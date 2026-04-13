/**
 * storage.js — Camada de persistência via API local (SQLite)
 *
 * Estratégia: cache em memória + sync com API
 * - Leituras são síncronas (do cache em memória)
 * - Escritas atualizam o cache IMEDIATAMENTE e enviam para API em background
 * - Isso garante que o UI não trava aguardando a API
 *
 * Para migrar para nuvem: só mude BASE_URL para o endereço da API em produção.
 */

const Storage = (() => {

  const BASE_URL = 'http://localhost:3333/api';

  // ─── Cache em memória ─────────────────────────────────────────────────────
  let _cache = {
    contas:     [],
    categorias: [],
    kanban:     { todo: [], doing: [], done: [] },
    config:     { tema: 'dark', moeda: 'BRL', nomeUsuario: 'Usuário', saldoInicial: 0 },
  };

  // ─── Helpers de fetch ─────────────────────────────────────────────────────
  async function api(method, path, body) {
    try {
      const res = await fetch(BASE_URL + path, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ erro: res.statusText }));
        throw new Error(err.erro || res.statusText);
      }
      return await res.json();
    } catch (e) {
      console.error('[Storage API]', method, path, e.message);
      throw e;
    }
  }

  const get  = (path)        => api('GET',    path);
  const post = (path, body)  => api('POST',   path, body);
  const put  = (path, body)  => api('PUT',    path, body);
  const del  = (path)        => api('DELETE', path);

  // ─── ID local (usado para otimistic update antes da API confirmar) ────────
  function gerarId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // ─── Init: carrega tudo da API para o cache ───────────────────────────────
  async function init() {
    try {
      const [contas, categorias, kanban, config] = await Promise.all([
        get('/contas'),
        get('/categorias'),
        get('/kanban'),
        get('/config'),
      ]);
      _cache.contas     = contas;
      _cache.categorias = categorias.length ? categorias : getCategoriasDefault();
      _cache.kanban     = kanban;
      _cache.config     = config;
      console.log('[Storage] Cache carregado:', {
        contas: contas.length,
        categorias: _cache.categorias.length,
      });
      return true;
    } catch (e) {
      console.error('[Storage] Falha ao conectar com API. Usando cache vazio.', e.message);
      // Se a API não estiver disponível, usa categorias padrão
      _cache.categorias = getCategoriasDefault();
      return false;
    }
  }

  // ════════════════════════════════════════════════════════════════════════════
  // CONTAS
  // ════════════════════════════════════════════════════════════════════════════

  function getContas() {
    return [..._cache.contas];
  }

  function setContas(contas) {
    _cache.contas = contas;
    // Sem endpoint de "substituição total" — use as operações individuais
    return true;
  }

  function adicionarConta(dados) {
    // Optimistic update: adiciona no cache imediatamente com ID temporário
    const idTemp = dados.id || gerarId();
    const nova = {
      ...dados,
      id: idTemp,
      criadoEm: new Date().toISOString(),
    };
    _cache.contas.push(nova);

    // Sync com API em background
    post('/contas', dados).then(contaReal => {
      // Substitui o registro temporário pelo retornado pela API
      const idx = _cache.contas.findIndex(c => c.id === idTemp);
      if (idx !== -1) _cache.contas[idx] = contaReal;
    }).catch(e => console.error('[Storage] Erro ao criar conta na API:', e.message));

    return nova;
  }

  function atualizarConta(id, dados) {
    const idx = _cache.contas.findIndex(c => c.id === id);
    if (idx === -1) return null;

    // Optimistic update
    _cache.contas[idx] = { ..._cache.contas[idx], ...dados, atualizadoEm: new Date().toISOString() };
    const atualizada = _cache.contas[idx];

    // Sync com API
    put(`/contas/${id}`, dados).catch(e =>
      console.error('[Storage] Erro ao atualizar conta:', e.message)
    );

    return atualizada;
  }

  function removerConta(id) {
    _cache.contas = _cache.contas.filter(c => c.id !== id);
    del(`/contas/${id}`).catch(e =>
      console.error('[Storage] Erro ao remover conta:', e.message)
    );
    return true;
  }

  function removerGrupoParcelamento(grupoId) {
    _cache.contas = _cache.contas.filter(c => c.grupoParcelamento !== grupoId);
    del(`/contas/grupo/${grupoId}`).catch(e =>
      console.error('[Storage] Erro ao remover parcelamento:', e.message)
    );
    return true;
  }

  // ════════════════════════════════════════════════════════════════════════════
  // CATEGORIAS
  // ════════════════════════════════════════════════════════════════════════════

  function getCategorias() {
    return _cache.categorias.length ? [..._cache.categorias] : getCategoriasDefault();
  }

  function setCategorias(cats) {
    _cache.categorias = cats;
    return true;
  }

  function adicionarCategoria(cat) {
    const idTemp = gerarId();
    const nova = { ...cat, id: idTemp };
    _cache.categorias.push(nova);

    post('/categorias', cat).then(catReal => {
      const idx = _cache.categorias.findIndex(c => c.id === idTemp);
      if (idx !== -1) _cache.categorias[idx] = catReal;
    }).catch(e => console.error('[Storage] Erro ao criar categoria:', e.message));

    return nova;
  }

  function atualizarCategoria(id, dados) {
    const idx = _cache.categorias.findIndex(c => c.id === id);
    if (idx === -1) return null;
    _cache.categorias[idx] = { ..._cache.categorias[idx], ...dados };

    put(`/categorias/${id}`, dados).catch(e =>
      console.error('[Storage] Erro ao atualizar categoria:', e.message)
    );

    return _cache.categorias[idx];
  }

  function removerCategoria(id) {
    _cache.categorias = _cache.categorias.filter(c => c.id !== id);
    del(`/categorias/${id}`).catch(e =>
      console.error('[Storage] Erro ao remover categoria:', e.message)
    );
    return true;
  }

  function getCategoriasDefault() {
    return [
      { id: 'moradia',     nome: 'Moradia',      cor: '#6366F1', icone: '🏠' },
      { id: 'alimentacao', nome: 'Alimentação',   cor: '#EF4444', icone: '🍔' },
      { id: 'transporte',  nome: 'Transporte',    cor: '#F59E0B', icone: '🚗' },
      { id: 'saude',       nome: 'Saúde',         cor: '#10B981', icone: '💊' },
      { id: 'educacao',    nome: 'Educação',      cor: '#3B82F6', icone: '📚' },
      { id: 'lazer',       nome: 'Lazer',         cor: '#EC4899', icone: '🎮' },
      { id: 'trabalho',    nome: 'Trabalho',      cor: '#8B5CF6', icone: '💼' },
      { id: 'assinaturas', nome: 'Assinaturas',   cor: '#06B6D4', icone: '📱' },
      { id: 'outros',      nome: 'Outros',        cor: '#6B7280', icone: '📦' },
    ];
  }

  // ════════════════════════════════════════════════════════════════════════════
  // KANBAN
  // ════════════════════════════════════════════════════════════════════════════

  function getKanban() {
    return JSON.parse(JSON.stringify(_cache.kanban)); // deep clone
  }

  function setKanban(data) {
    _cache.kanban = data;
    put('/kanban', data).catch(e =>
      console.error('[Storage] Erro ao salvar kanban:', e.message)
    );
    return true;
  }

  function adicionarCartao(coluna, cartao) {
    const idTemp = gerarId();
    const novo = { ...cartao, id: idTemp, coluna, criadoEm: new Date().toISOString() };
    if (!_cache.kanban[coluna]) _cache.kanban[coluna] = [];
    _cache.kanban[coluna].push(novo);

    post(`/kanban/${coluna}`, cartao).then(cartaoReal => {
      const col = _cache.kanban[coluna];
      const idx = col.findIndex(c => c.id === idTemp);
      if (idx !== -1) col[idx] = { ...cartaoReal, coluna };
    }).catch(e => console.error('[Storage] Erro ao criar cartão:', e.message));

    return novo;
  }

  function moverCartao(id, colunaOrigem, colunaDestino, indice) {
    const kanban = _cache.kanban;
    const idxOrigem = kanban[colunaOrigem]?.findIndex(c => c.id === id);
    if (idxOrigem === -1 || idxOrigem === undefined) return false;

    const [cartao] = kanban[colunaOrigem].splice(idxOrigem, 1);
    cartao.coluna = colunaDestino;
    kanban[colunaDestino].splice(indice, 0, cartao);

    // Salva o board inteiro (mais simples para Kanban)
    put('/kanban', kanban).catch(e =>
      console.error('[Storage] Erro ao mover cartão:', e.message)
    );
    return true;
  }

  function atualizarCartao(coluna, id, dados) {
    const col = _cache.kanban[coluna];
    const idx = col?.findIndex(c => c.id === id);
    if (idx === -1 || idx === undefined) return null;

    col[idx] = { ...col[idx], ...dados };

    put(`/kanban/card/${id}`, dados).catch(e =>
      console.error('[Storage] Erro ao atualizar cartão:', e.message)
    );

    return col[idx];
  }

  function removerCartao(coluna, id) {
    if (_cache.kanban[coluna]) {
      _cache.kanban[coluna] = _cache.kanban[coluna].filter(c => c.id !== id);
    }
    del(`/kanban/card/${id}`).catch(e =>
      console.error('[Storage] Erro ao remover cartão:', e.message)
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // CONFIG
  // ════════════════════════════════════════════════════════════════════════════

  function getConfig() {
    return { ..._cache.config };
  }

  function setConfig(novaConfig) {
    _cache.config = { ..._cache.config, ...novaConfig };
    put('/config', novaConfig).catch(e =>
      console.error('[Storage] Erro ao salvar config:', e.message)
    );
    return true;
  }

  // ─── API pública ──────────────────────────────────────────────────────────
  return {
    init,
    gerarId,
    // Contas
    getContas, setContas,
    adicionarConta, atualizarConta, removerConta, removerGrupoParcelamento,
    // Categorias
    getCategorias, setCategorias,
    adicionarCategoria, atualizarCategoria, removerCategoria,
    // Kanban
    getKanban, setKanban,
    adicionarCartao, moverCartao, atualizarCartao, removerCartao,
    // Config
    getConfig, setConfig,
  };
})();
