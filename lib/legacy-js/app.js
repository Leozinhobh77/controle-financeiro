/**
 * app.js — Inicialização, roteamento, pages de Contas, Relatórios, Categorias e Configurações
 */

const App = (() => {

  let paginaAtual = 'dashboard';
  let filtrosContas = { status: 'todos', categoria: 'todas', busca: '', mesAno: '' };

  // ─── Inicialização ────────────────────────────────────────────────────
  function init() {
    aplicarTema();
    atualizarNomeUsuario();
    bindNavegacao();
    bindFAB();
    bindTeclas();
    navegarPara('dashboard');

    // Inicializar categorias padrão se vazio
    const cats = Storage.getCategorias();
    if (!cats.length) Storage.setCategorias(Storage.getCategorias());
  }

  function aplicarTema() {
    const config = Storage.getConfig();
    document.documentElement.dataset.theme = config.tema || 'dark';
  }

  function atualizarNomeUsuario() {
    const config = Storage.getConfig();
    const el = document.getElementById('user-name');
    const av = document.getElementById('user-avatar');
    if (el) el.textContent = config.nomeUsuario || 'Usuário';
    if (av) av.textContent = (config.nomeUsuario || 'U')[0].toUpperCase();
  }

  // ─── Roteamento/Navegação ─────────────────────────────────────────────
  function bindNavegacao() {
    document.querySelectorAll('[data-page]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        navegarPara(link.dataset.page);
        // Fechar sidebar no mobile
        if (window.innerWidth < 768) {
          document.getElementById('sidebar').classList.remove('sidebar-open');
        }
      });
    });

    // Toggle sidebar mobile
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('sidebar-open');
    });

    // Toggle sidebar desktop (colapsar)
    document.getElementById('sidebar-collapse')?.addEventListener('click', () => {
      document.getElementById('sidebar').classList.toggle('sidebar-collapsed');
      document.getElementById('main-content').classList.toggle('sidebar-collapsed');
    });
  }

  function navegarPara(pagina) {
    paginaAtual = pagina;

    // Atualizar nav items
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.page === pagina);
    });

    // Mostrar página correta
    document.querySelectorAll('.page').forEach(el => {
      el.classList.toggle('active', el.id === `page-${pagina}`);
    });

    // Atualizar topbar
    const nomes = {
      dashboard: 'Dashboard', contas: 'Contas', relatorios: 'Relatórios',
      kanban: 'Kanban', categorias: 'Categorias', configuracoes: 'Configurações',
    };
    const topTitle = document.getElementById('topbar-title');
    if (topTitle) topTitle.textContent = nomes[pagina] || pagina;

    // Renderizar página
    switch (pagina) {
      case 'dashboard':    Dashboard.render(); break;
      case 'contas':       renderContas(); break;
      case 'relatorios':   renderRelatorios(); break;
      case 'kanban':       Kanban.render(); break;
      case 'categorias':   renderCategorias(); break;
      case 'configuracoes': renderConfiguracoes(); break;
    }
  }

  // ─── FAB Button ───────────────────────────────────────────────────────
  function bindFAB() {
    const fab = document.getElementById('fab');
    const fabMenu = document.getElementById('fab-menu');

    fab?.addEventListener('click', () => {
      fabMenu?.classList.toggle('active');
      fab.classList.toggle('fab-open');
    });

    document.getElementById('fab-nova-conta')?.addEventListener('click', () => {
      fabMenu?.classList.remove('active');
      fab?.classList.remove('fab-open');
      abrirModalConta();
    });

    document.getElementById('fab-parcelamento')?.addEventListener('click', () => {
      fabMenu?.classList.remove('active');
      fab?.classList.remove('fab-open');
      abrirModalParcelamento();
    });

    document.getElementById('fab-kanban')?.addEventListener('click', () => {
      fabMenu?.classList.remove('active');
      fab?.classList.remove('fab-open');
      navegarPara('kanban');
      setTimeout(() => Kanban.novoCartao('todo'), 100);
    });

    // Fechar ao clicar fora
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#fab-container')) {
        fabMenu?.classList.remove('active');
        fab?.classList.remove('fab-open');
      }
    });
  }

  function bindTeclas() {
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'n') { e.preventDefault(); abrirModalConta(); }
      if (e.key === 'Escape') UI.fecharModal(null);
    });
  }

  // ─── PAGE: CONTAS ─────────────────────────────────────────────────────
  function renderContas() {
    const page = document.getElementById('page-contas');
    const categorias = Storage.getCategorias();
    const agora = new Date();
    const mesAtual = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`;
    if (!filtrosContas.mesAno) filtrosContas.mesAno = mesAtual;

    const contas = Financeiro.getContasFiltradas(filtrosContas);
    const totalFiltrado = contas.reduce((s, c) => s + c.valor, 0);

    page.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Contas</h1>
          <p class="page-subtitle">${contas.length} conta(s) · ${UI.formatarMoeda(totalFiltrado)}</p>
        </div>
        <button class="btn btn-primary" onclick="App.abrirModalConta()">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nova Conta
        </button>
      </div>

      <!-- Filtros -->
      <div class="filtros-bar">
        <div class="filtro-busca">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m21 21-4.35-4.35"/></svg>
          <input type="text" id="filtro-busca" placeholder="Buscar contas..." class="filtro-input"
            value="${filtrosContas.busca}" oninput="App.filtrarContas({busca:this.value})">
        </div>
        <input type="month" id="filtro-mes" class="form-input filtro-mes"
          value="${filtrosContas.mesAno}" onchange="App.filtrarContas({mesAno:this.value})">
        <select class="form-select filtro-select" onchange="App.filtrarContas({status:this.value})">
          <option value="todos" ${filtrosContas.status === 'todos' ? 'selected' : ''}>Todos os status</option>
          <option value="pendente" ${filtrosContas.status === 'pendente' ? 'selected' : ''}>Pendente</option>
          <option value="pago" ${filtrosContas.status === 'pago' ? 'selected' : ''}>Pago</option>
          <option value="atrasado" ${filtrosContas.status === 'atrasado' ? 'selected' : ''}>Atrasado</option>
        </select>
        <select class="form-select filtro-select" onchange="App.filtrarContas({categoria:this.value})">
          <option value="todas">Todas categorias</option>
          ${categorias.map(c => `<option value="${c.id}" ${filtrosContas.categoria === c.id ? 'selected' : ''}>${c.icone} ${c.nome}</option>`).join('')}
        </select>
      </div>

      <!-- Lista de contas -->
      ${contas.length === 0
        ? `<div class="empty-state">
            <div class="empty-icon">📂</div>
            <h3>Nenhuma conta encontrada</h3>
            <p>Clique em "Nova Conta" ou use o botão + para adicionar</p>
            <button class="btn btn-primary" onclick="App.abrirModalConta()">Criar primeira conta</button>
          </div>`
        : `<div class="contas-grid">
            ${contas.map(c => renderCardConta(c, categorias)).join('')}
          </div>`
      }
    `;
  }

  function renderCardConta(conta, categorias) {
    const cat = categorias.find(c => c.id === conta.categoria) || { icone: '📦', nome: 'Outros', cor: '#6B7280' };
    const statusAtual = UI.estaAtrasado(conta.dataVencimento, conta.status) ? 'atrasado' : conta.status;
    const parcInfo = conta.parcelado ? `<span class="tag-parcela">${conta.parcelaAtual}/${conta.totalParcelas}</span>` : '';
    const recInfo = conta.recorrente && conta.recorrenciaAtiva ? '<span class="tag-recorrente">🔄 Recorrente</span>' : '';

    return `
      <div class="conta-card status-${statusAtual}">
        <div class="conta-card-header">
          <div class="conta-card-cat" style="background:${cat.cor}22;color:${cat.cor}">
            ${cat.icone}
          </div>
          <div class="conta-card-titulo-wrap">
            <div class="conta-card-titulo">${conta.descricao}</div>
            <div class="conta-card-tags">${parcInfo}${recInfo}</div>
          </div>
          ${UI.badgeStatus(statusAtual)}
        </div>
        <div class="conta-card-body">
          <div class="conta-card-valor">${UI.formatarMoeda(conta.valor)}</div>
          <div class="conta-card-datas">
            <span>Vence: ${UI.formatarData(conta.dataVencimento)}</span>
            ${conta.dataPagamento ? `<span class="text-success">Pago: ${UI.formatarData(conta.dataPagamento)}</span>` : ''}
          </div>
          ${conta.observacoes ? `<div class="conta-card-obs">${conta.observacoes}</div>` : ''}
        </div>
        <div class="conta-card-footer">
          ${conta.status !== 'pago'
            ? `<button class="btn btn-sm btn-success" onclick="App.pagarConta('${conta.id}')">✓ Pagar</button>`
            : `<button class="btn btn-sm btn-ghost" onclick="App.despagarConta('${conta.id}')">↩ Desfazer</button>`}
          <button class="btn btn-sm btn-ghost" onclick="App.editarConta('${conta.id}')">Editar</button>
          <button class="btn btn-sm btn-danger-ghost" onclick="App.excluirConta('${conta.id}','${conta.grupoParcelamento || ''}')">Excluir</button>
        </div>
      </div>
    `;
  }

  function filtrarContas(novosFiltros) {
    filtrosContas = { ...filtrosContas, ...novosFiltros };
    renderContas();
  }

  // ─── Modais de Conta ──────────────────────────────────────────────────
  function formConta(dados = {}) {
    const categorias = Storage.getCategorias();
    const hoje = UI.hoje();
    return `
      <div class="form-row">
        <div class="form-group form-group-lg">
          <label class="form-label">Descrição *</label>
          <input type="text" id="c-descricao" class="form-input" value="${dados.descricao || ''}" placeholder="Ex: Conta de luz, Aluguel..." maxlength="100">
        </div>
        <div class="form-group">
          <label class="form-label">Valor (R$) *</label>
          <input type="number" id="c-valor" class="form-input" value="${dados.valor || ''}" placeholder="0,00" step="0.01" min="0">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Vencimento *</label>
          <input type="date" id="c-vencimento" class="form-input" value="${dados.dataVencimento || hoje}">
        </div>
        <div class="form-group">
          <label class="form-label">Categoria</label>
          <select id="c-categoria" class="form-select">
            ${categorias.map(c => `<option value="${c.id}" ${dados.categoria === c.id ? 'selected' : ''}>${c.icone} ${c.nome}</option>`).join('')}
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Observações</label>
        <textarea id="c-obs" class="form-textarea" rows="2" placeholder="Notas adicionais...">${dados.observacoes || ''}</textarea>
      </div>
      <div class="form-check-group">
        <label class="form-check">
          <input type="checkbox" id="c-recorrente" ${dados.recorrente ? 'checked' : ''} onchange="App.toggleRecorrente(this)">
          <span>Conta recorrente</span>
        </label>
      </div>
      <div id="c-recorrente-opts" style="${dados.recorrente ? '' : 'display:none'}">
        <div class="form-group">
          <label class="form-label">Repetir a cada</label>
          <select id="c-intervalo" class="form-select">
            <option value="semanal" ${dados.intervaloRecorrencia === 'semanal' ? 'selected' : ''}>Semanalmente</option>
            <option value="mensal" ${dados.intervaloRecorrencia === 'mensal' || !dados.intervaloRecorrencia ? 'selected' : ''}>Mensalmente</option>
            <option value="anual" ${dados.intervaloRecorrencia === 'anual' ? 'selected' : ''}>Anualmente</option>
          </select>
        </div>
      </div>
    `;
  }

  function toggleRecorrente(checkbox) {
    const opts = document.getElementById('c-recorrente-opts');
    if (opts) opts.style.display = checkbox.checked ? '' : 'none';
  }

  function coletarFormConta() {
    const descricao = document.getElementById('c-descricao')?.value.trim();
    const valor = parseFloat(document.getElementById('c-valor')?.value);
    const dataVencimento = document.getElementById('c-vencimento')?.value;
    const categoria = document.getElementById('c-categoria')?.value;
    const observacoes = document.getElementById('c-obs')?.value;
    const recorrente = document.getElementById('c-recorrente')?.checked;
    const intervaloRecorrencia = document.getElementById('c-intervalo')?.value;

    if (!descricao) { UI.toast('Informe a descrição', 'warning'); return false; }
    if (!valor || valor <= 0) { UI.toast('Informe um valor válido', 'warning'); return false; }
    if (!dataVencimento) { UI.toast('Informe a data de vencimento', 'warning'); return false; }

    return { descricao, valor, dataVencimento, categoria, observacoes, recorrente, intervaloRecorrencia };
  }

  async function abrirModalConta(dadosIniciais = {}) {
    const resultado = await UI.abrirModal('Nova Conta', formConta(dadosIniciais), {
      labelSalvar: 'Criar Conta',
      onSalvar: () => {
        const dados = coletarFormConta();
        if (!dados) return false;
        Financeiro.criarConta(dados);
        UI.toast('Conta criada com sucesso!', 'success');
        return true;
      }
    });
    if (resultado && paginaAtual === 'contas') renderContas();
    if (resultado && paginaAtual === 'dashboard') Dashboard.render();
  }

  async function abrirModalParcelamento() {
    const categorias = Storage.getCategorias();
    const hoje = UI.hoje();

    const resultado = await UI.abrirModal('Novo Parcelamento', `
      <div class="form-row">
        <div class="form-group form-group-lg">
          <label class="form-label">Descrição *</label>
          <input type="text" id="p-descricao" class="form-input" placeholder="Ex: Notebook, Geladeira...">
        </div>
        <div class="form-group">
          <label class="form-label">Valor Total (R$) *</label>
          <input type="number" id="p-valor" class="form-input" placeholder="1200,00" step="0.01" min="0"
            oninput="App.calcularParcela()">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Nº de Parcelas *</label>
          <input type="number" id="p-parcelas" class="form-input" value="12" min="2" max="360"
            oninput="App.calcularParcela()">
        </div>
        <div class="form-group">
          <label class="form-label">1ª Parcela em</label>
          <input type="date" id="p-vencimento" class="form-input" value="${hoje}">
        </div>
      </div>
      <div class="parcela-preview" id="parcela-preview">
        <span>💳 Valor por parcela: <strong id="parcela-valor">—</strong></span>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Categoria</label>
          <select id="p-categoria" class="form-select">
            ${categorias.map(c => `<option value="${c.id}">${c.icone} ${c.nome}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Observações</label>
          <input type="text" id="p-obs" class="form-input" placeholder="Opcional">
        </div>
      </div>
    `, {
      labelSalvar: 'Gerar Parcelas',
      onSalvar: () => {
        const descricao = document.getElementById('p-descricao').value.trim();
        const valor = parseFloat(document.getElementById('p-valor').value);
        const totalParcelas = parseInt(document.getElementById('p-parcelas').value);
        const dataVencimento = document.getElementById('p-vencimento').value;
        const categoria = document.getElementById('p-categoria').value;
        const observacoes = document.getElementById('p-obs').value;

        if (!descricao) { UI.toast('Informe a descrição', 'warning'); return false; }
        if (!valor || valor <= 0) { UI.toast('Valor inválido', 'warning'); return false; }
        if (!totalParcelas || totalParcelas < 2) { UI.toast('Mínimo 2 parcelas', 'warning'); return false; }
        if (!dataVencimento) { UI.toast('Informe a data da 1ª parcela', 'warning'); return false; }

        Financeiro.criarParcelamento({ descricao, valor, totalParcelas, dataVencimento, categoria, observacoes });
        UI.toast(`${totalParcelas} parcelas criadas com sucesso!`, 'success');
        return true;
      }
    });

    if (resultado) {
      if (paginaAtual === 'contas') renderContas();
      if (paginaAtual === 'dashboard') Dashboard.render();
    }
  }

  function calcularParcela() {
    const valor = parseFloat(document.getElementById('p-valor')?.value) || 0;
    const parcelas = parseInt(document.getElementById('p-parcelas')?.value) || 1;
    const el = document.getElementById('parcela-valor');
    if (el && valor > 0) {
      el.textContent = UI.formatarMoeda(valor / parcelas);
    }
  }

  async function editarConta(id) {
    const conta = Storage.getContas().find(c => c.id === id);
    if (!conta) return;

    const resultado = await UI.abrirModal('Editar Conta', formConta(conta), {
      labelSalvar: 'Salvar',
      onSalvar: () => {
        const dados = coletarFormConta();
        if (!dados) return false;
        Financeiro.editarConta(id, dados);
        UI.toast('Conta atualizada!', 'success');
        return true;
      }
    });

    if (resultado) {
      renderContas();
      if (paginaAtual === 'dashboard') Dashboard.render();
    }
  }

  async function excluirConta(id, grupoId) {
    if (grupoId) {
      const opcao = await UI.abrirModal('Excluir Parcelamento', `
        <p class="confirm-msg">Esta conta faz parte de um parcelamento. O que deseja excluir?</p>
        <div class="radio-group">
          <label class="radio-option">
            <input type="radio" name="excl-tipo" value="unica" checked>
            <span>Somente esta parcela</span>
          </label>
          <label class="radio-option">
            <input type="radio" name="excl-tipo" value="todas">
            <span>Todas as parcelas do grupo</span>
          </label>
        </div>
      `, {
        labelSalvar: 'Excluir',
        onSalvar: () => document.querySelector('input[name="excl-tipo"]:checked')?.value,
      });

      if (opcao === 'todas') {
        Financeiro.excluirParcelamento(grupoId);
        UI.toast('Parcelamento excluído.', 'info');
      } else if (opcao === 'unica') {
        Financeiro.excluirConta(id);
        UI.toast('Parcela excluída.', 'info');
      }
    } else {
      const ok = await UI.confirmar('Deseja excluir esta conta? Esta ação não pode ser desfeita.', 'Excluir Conta');
      if (ok) {
        Financeiro.excluirConta(id);
        UI.toast('Conta excluída.', 'info');
      }
    }

    renderContas();
    if (paginaAtual === 'dashboard') Dashboard.render();
  }

  function pagarConta(id) {
    Financeiro.marcarComoPago(id);
    UI.toast('Conta marcada como paga! ✓', 'success');
    if (paginaAtual === 'contas') renderContas();
    if (paginaAtual === 'dashboard') Dashboard.render();
  }

  function despagarConta(id) {
    Financeiro.desmarcarPagamento(id);
    UI.toast('Pagamento desfeito.', 'info');
    if (paginaAtual === 'contas') renderContas();
    if (paginaAtual === 'dashboard') Dashboard.render();
  }

  // ─── PAGE: RELATÓRIOS ─────────────────────────────────────────────────
  function renderRelatorios() {
    const agora = new Date();
    const mesAtual = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`;
    const stats = Financeiro.calcularEstatisticas();
    const dadosMes = Financeiro.dadosMensais(12);
    const categoriasMes = Financeiro.dadosPorCategoria(mesAtual);
    const categorias = Storage.getCategorias();

    // Top 3 categorias do mês
    const top3 = categoriasMes.slice(0, 3);

    page = document.getElementById('page-relatorios');
    page.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Relatórios</h1>
          <p class="page-subtitle">Análise detalhada das suas finanças</p>
        </div>
      </div>

      <!-- Resumo do mês -->
      <div class="stats-grid stats-grid-3">
        <div class="stat-card stat-card-success">
          <div class="stat-icon">✓</div>
          <div class="stat-info">
            <span class="stat-label">Pago este mês</span>
            <span class="stat-value">${UI.formatarMoeda(dadosMes[dadosMes.length-1]?.value || 0)}</span>
          </div>
        </div>
        <div class="stat-card stat-card-warning">
          <div class="stat-icon">⏳</div>
          <div class="stat-info">
            <span class="stat-label">Pendente este mês</span>
            <span class="stat-value">${UI.formatarMoeda(dadosMes[dadosMes.length-1]?.value2 || 0)}</span>
          </div>
        </div>
        <div class="stat-card stat-card-primary">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <span class="stat-label">Total de registros</span>
            <span class="stat-value">${stats.totalContas}</span>
          </div>
        </div>
      </div>

      <!-- Histórico 12 meses -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Histórico — 12 Meses</h3>
          <div class="chart-legend-row">
            <span class="legend-dot" style="background:#6366F1"></span><span>Pago</span>
            <span class="legend-dot" style="background:#F59E0B"></span><span>Pendente</span>
          </div>
        </div>
        <div id="chart-rel-mensal" style="min-height:220px"></div>
      </div>

      <div class="dashboard-grid">
        <!-- Categorias do mês -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Distribuição por Categoria</h3>
            <span class="card-badge">${agora.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
          </div>
          <div id="chart-rel-categorias"></div>
        </div>

        <!-- Top categorias -->
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Ranking de Gastos</h3>
          </div>
          <div class="ranking-list">
            ${categoriasMes.length === 0
              ? '<div class="empty-state-small"><span>📊</span><p>Sem dados este mês</p></div>'
              : categoriasMes.map((item, i) => {
                  const total = categoriasMes.reduce((s, d) => s + d.value, 0);
                  const pct = total > 0 ? (item.value / total * 100).toFixed(1) : 0;
                  return `
                    <div class="ranking-item">
                      <span class="ranking-pos">#${i + 1}</span>
                      <span class="ranking-dot" style="background:${item.cor}"></span>
                      <span class="ranking-label">${item.label}</span>
                      <div class="ranking-bar-wrap">
                        <div class="ranking-bar" style="width:${pct}%;background:${item.cor}"></div>
                      </div>
                      <span class="ranking-pct">${pct}%</span>
                      <span class="ranking-valor">${UI.formatarMoeda(item.value)}</span>
                    </div>`;
                }).join('')}
          </div>
        </div>
      </div>

      <!-- Saúde financeira detalhada -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Saúde Financeira</h3>
        </div>
        <div class="saude-detail">
          <div id="chart-rel-saude"></div>
          <div class="saude-metrics">
            <div class="saude-metric">
              <span class="saude-metric-label">Contas em dia</span>
              <span class="saude-metric-value text-success">${Storage.getContas().filter(c => c.status === 'pago').length}</span>
            </div>
            <div class="saude-metric">
              <span class="saude-metric-label">Contas pendentes</span>
              <span class="saude-metric-value text-warning">${Storage.getContas().filter(c => c.status === 'pendente').length}</span>
            </div>
            <div class="saude-metric">
              <span class="saude-metric-label">Contas atrasadas</span>
              <span class="saude-metric-value text-danger">${Storage.getContas().filter(c => c.status === 'atrasado').length}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    UI.renderBarras('chart-rel-mensal', dadosMes, { doisEixos: true, altura: 220 });
    UI.renderDonut('chart-rel-categorias', categoriasMes);
    UI.renderSaude('chart-rel-saude', stats.saudeScore);
  }

  // ─── PAGE: CATEGORIAS ─────────────────────────────────────────────────
  function renderCategorias() {
    const cats = Storage.getCategorias();
    const contas = Storage.getContas();
    const page = document.getElementById('page-categorias');

    page.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Categorias</h1>
          <p class="page-subtitle">${cats.length} categoria(s)</p>
        </div>
        <button class="btn btn-primary" onclick="App.abrirModalCategoria()">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          Nova Categoria
        </button>
      </div>
      <div class="categorias-grid">
        ${cats.map(cat => {
          const qtd = contas.filter(c => c.categoria === cat.id).length;
          const total = contas.filter(c => c.categoria === cat.id).reduce((s, c) => s + c.valor, 0);
          return `
            <div class="cat-card" style="border-left:4px solid ${cat.cor}">
              <div class="cat-icone" style="background:${cat.cor}22;color:${cat.cor}">${cat.icone}</div>
              <div class="cat-info">
                <span class="cat-nome">${cat.nome}</span>
                <span class="cat-stats">${qtd} conta(s) · ${UI.formatarMoeda(total)}</span>
              </div>
              <div class="cat-actions">
                <button class="btn-icon-sm" onclick="App.editarCategoria('${cat.id}')">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button class="btn-icon-sm btn-danger-icon" onclick="App.excluirCategoria('${cat.id}')">
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
              </div>
            </div>`;
        }).join('')}
      </div>
    `;
  }

  function formCategoria(dados = {}) {
    const icones = ['🏠', '🍔', '🚗', '💊', '📚', '🎮', '💼', '📱', '📦', '✈️', '💡', '🛒', '🎵', '🏋️', '💳', '🎯', '🔧', '🐾'];
    return `
      <div class="form-group">
        <label class="form-label">Nome *</label>
        <input type="text" id="cat-nome" class="form-input" value="${dados.nome || ''}" placeholder="Ex: Alimentação">
      </div>
      <div class="form-group">
        <label class="form-label">Ícone</label>
        <div class="icone-grid" id="cat-icone-sel" data-icone="${dados.icone || '📦'}">
          ${icones.map(ic => `
            <button type="button" class="icone-btn ${dados.icone === ic ? 'active' : ''}"
              data-icone="${ic}" onclick="App.selecionarIcone(this)">${ic}</button>
          `).join('')}
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Cor</label>
        <input type="color" id="cat-cor" class="form-color" value="${dados.cor || '#6366F1'}">
      </div>
    `;
  }

  function selecionarIcone(btn) {
    document.querySelectorAll('.icone-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const grid = btn.closest('.icone-grid');
    if (grid) grid.dataset.icone = btn.dataset.icone;
  }

  async function abrirModalCategoria(dados = {}) {
    const isEdit = !!dados.id;
    const resultado = await UI.abrirModal(isEdit ? 'Editar Categoria' : 'Nova Categoria', formCategoria(dados), {
      labelSalvar: isEdit ? 'Salvar' : 'Criar',
      onSalvar: () => {
        const nome = document.getElementById('cat-nome').value.trim();
        if (!nome) { UI.toast('Informe o nome', 'warning'); return false; }
        return {
          nome,
          icone: document.getElementById('cat-icone-sel')?.dataset.icone || '📦',
          cor: document.getElementById('cat-cor')?.value || '#6366F1',
        };
      }
    });

    if (resultado) {
      if (isEdit) {
        Storage.atualizarCategoria(dados.id, resultado);
        UI.toast('Categoria atualizada!', 'success');
      } else {
        Storage.adicionarCategoria(resultado);
        UI.toast('Categoria criada!', 'success');
      }
      renderCategorias();
    }
  }

  async function editarCategoria(id) {
    const cat = Storage.getCategorias().find(c => c.id === id);
    if (cat) abrirModalCategoria(cat);
  }

  async function excluirCategoria(id) {
    const ok = await UI.confirmar('Excluir esta categoria? As contas vinculadas serão mantidas.', 'Excluir Categoria');
    if (ok) {
      Storage.removerCategoria(id);
      UI.toast('Categoria excluída.', 'info');
      renderCategorias();
    }
  }

  // ─── PAGE: CONFIGURAÇÕES ─────────────────────────────────────────────
  function renderConfiguracoes() {
    const config = Storage.getConfig();
    const page = document.getElementById('page-configuracoes');

    page.innerHTML = `
      <div class="page-header">
        <h1 class="page-title">Configurações</h1>
      </div>
      <div class="config-grid">

        <div class="card config-card">
          <h3 class="config-section-title">👤 Perfil</h3>
          <div class="form-group">
            <label class="form-label">Seu nome</label>
            <input type="text" id="cfg-nome" class="form-input" value="${config.nomeUsuario || ''}" placeholder="Seu nome">
          </div>
          <div class="form-group">
            <label class="form-label">Saldo inicial / Renda mensal (R$)</label>
            <input type="number" id="cfg-saldo" class="form-input" value="${config.saldoInicial || 0}" step="0.01" min="0">
          </div>
          <button class="btn btn-primary" onclick="App.salvarConfig()">Salvar</button>
        </div>

        <div class="card config-card">
          <h3 class="config-section-title">🎨 Aparência</h3>
          <div class="form-group">
            <label class="form-label">Tema</label>
            <div class="tema-btns">
              <button class="btn ${config.tema === 'dark' ? 'btn-primary' : 'btn-ghost'}" onclick="App.setTema('dark')">🌙 Dark</button>
              <button class="btn ${config.tema === 'light' ? 'btn-primary' : 'btn-ghost'}" onclick="App.setTema('light')">☀️ Light</button>
            </div>
          </div>
        </div>

        <div class="card config-card">
          <h3 class="config-section-title">💾 Dados</h3>
          <p class="config-desc">Gerencie os dados armazenados no seu navegador.</p>
          <div class="config-actions">
            <button class="btn btn-ghost" onclick="App.exportarDados()">⬇ Exportar Dados</button>
            <button class="btn btn-ghost" onclick="App.importarDados()">⬆ Importar Dados</button>
            <input type="file" id="import-input" accept=".json" style="display:none" onchange="App.lerArquivoImport(this)">
            <button class="btn btn-danger-ghost" onclick="App.limparDados()">🗑 Limpar Tudo</button>
          </div>
        </div>

        <div class="card config-card">
          <h3 class="config-section-title">ℹ Sobre</h3>
          <p class="config-desc"><strong>FinanceFlow</strong> v1.0</p>
          <p class="config-desc">Aplicativo de controle financeiro pessoal. Todos os dados são armazenados localmente no seu navegador.</p>
          <p class="config-desc">Criado com HTML5, CSS3 e JavaScript puro.</p>
          <div class="shortcut-list">
            <div class="shortcut"><kbd>Ctrl+N</kbd> Nova conta</div>
            <div class="shortcut"><kbd>Esc</kbd> Fechar modal</div>
          </div>
        </div>
      </div>
    `;
  }

  function salvarConfig() {
    const nome = document.getElementById('cfg-nome')?.value.trim() || 'Usuário';
    const saldo = parseFloat(document.getElementById('cfg-saldo')?.value) || 0;
    Storage.setConfig({ nomeUsuario: nome, saldoInicial: saldo });
    atualizarNomeUsuario();
    UI.toast('Configurações salvas!', 'success');
  }

  function setTema(tema) {
    Storage.setConfig({ tema });
    document.documentElement.dataset.theme = tema;
    renderConfiguracoes();
    UI.toast(`Tema ${tema === 'dark' ? 'escuro' : 'claro'} ativado!`, 'info');
  }

  function exportarDados() {
    const dados = {
      contas: Storage.getContas(),
      categorias: Storage.getCategorias(),
      kanban: Storage.getKanban(),
      config: Storage.getConfig(),
      exportadoEm: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financeflow_backup_${UI.hoje()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    UI.toast('Backup exportado!', 'success');
  }

  function importarDados() {
    document.getElementById('import-input')?.click();
  }

  function lerArquivoImport(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const dados = JSON.parse(e.target.result);
        const ok = await UI.confirmar('Importar dados? Os dados atuais serão substituídos.', 'Importar Backup');
        if (ok) {
          if (dados.contas) Storage.setContas(dados.contas);
          if (dados.categorias) Storage.setCategorias(dados.categorias);
          if (dados.kanban) Storage.setKanban(dados.kanban);
          if (dados.config) Storage.setConfig(dados.config);
          UI.toast('Dados importados com sucesso!', 'success');
          aplicarTema();
          atualizarNomeUsuario();
          navegarPara(paginaAtual);
        }
      } catch {
        UI.toast('Arquivo inválido', 'error');
      }
    };
    reader.readAsText(file);
    input.value = '';
  }

  async function limparDados() {
    const ok = await UI.confirmar(
      'ATENÇÃO: Esta ação irá apagar TODOS os dados permanentemente. Deseja continuar?',
      '⚠ Limpar Todos os Dados'
    );
    if (ok) {
      localStorage.clear();
      UI.toast('Dados apagados. Recarregando...', 'info');
      setTimeout(() => location.reload(), 1500);
    }
  }

  return {
    init, navegarPara,
    // Contas
    filtrarContas, abrirModalConta, abrirModalParcelamento, calcularParcela,
    editarConta, excluirConta, pagarConta, despagarConta,
    toggleRecorrente,
    // Categorias
    abrirModalCategoria, editarCategoria, excluirCategoria, selecionarIcone,
    // Config
    salvarConfig, setTema, exportarDados, importarDados, lerArquivoImport, limparDados,
  };
})();

// ─── App.init() agora é chamado pelo index.html após Storage.init() ──────────
// (não inicializa mais automaticamente — aguarda o banco de dados carregar)
