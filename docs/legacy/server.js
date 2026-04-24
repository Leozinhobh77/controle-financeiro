/**
 * server.js — FinanceFlow API local (Express + Prisma + SQLite)
 *
 * Rotas:
 *   GET    /api/contas
 *   POST   /api/contas
 *   PUT    /api/contas/:id
 *   DELETE /api/contas/:id
 *   DELETE /api/contas/grupo/:grupoId
 *
 *   GET    /api/categorias
 *   POST   /api/categorias
 *   PUT    /api/categorias/:id
 *   DELETE /api/categorias/:id
 *
 *   GET    /api/kanban
 *   PUT    /api/kanban          (salva estado completo)
 *   POST   /api/kanban/:coluna
 *   PUT    /api/kanban/card/:id
 *   DELETE /api/kanban/card/:id
 *
 *   GET    /api/config
 *   PUT    /api/config
 */

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const { PrismaClient } = require('@prisma/client');

const app    = express();
const prisma = new PrismaClient();
const PORT   = process.env.PORT || 3333;

// ─── Middlewares ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos (o próprio app HTML)
app.use(express.static(path.join(__dirname)));

// ─── Helper: resposta de erro ─────────────────────────────────────────────────
function erro(res, msg, status = 500) {
  console.error('[API]', msg);
  return res.status(status).json({ erro: msg });
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTAS
// ═══════════════════════════════════════════════════════════════════════════════

// Listar todas
app.get('/api/contas', async (req, res) => {
  try {
    const contas = await prisma.conta.findMany({
      orderBy: { dataVencimento: 'asc' },
    });
    // Serializar: converter datas ISO para string simples compatível com o frontend
    res.json(contas.map(serializarConta));
  } catch (e) { erro(res, e.message); }
});

// Criar
app.post('/api/contas', async (req, res) => {
  try {
    const dados = req.body;
    const nova = await prisma.conta.create({
      data: {
        descricao:            dados.descricao,
        valor:                parseFloat(dados.valor),
        dataVencimento:       dados.dataVencimento || null,
        dataPagamento:        dados.dataPagamento  || null,
        categoria:            dados.categoria       || 'outros',
        observacoes:          dados.observacoes     || '',
        status:               dados.status          || 'pendente',
        recorrente:           !!dados.recorrente,
        intervaloRecorrencia: dados.intervaloRecorrencia || null,
        recorrenciaAtiva:     !!dados.recorrenciaAtiva,
        parcelado:            !!dados.parcelado,
        totalParcelas:        dados.totalParcelas   ? parseInt(dados.totalParcelas) : null,
        parcelaAtual:         dados.parcelaAtual    ? parseInt(dados.parcelaAtual)  : null,
        grupoParcelamento:    dados.grupoParcelamento || null,
      },
    });
    res.status(201).json(serializarConta(nova));
  } catch (e) { erro(res, e.message); }
});

// Atualizar
app.put('/api/contas/:id', async (req, res) => {
  try {
    const dados = req.body;
    const atualizada = await prisma.conta.update({
      where: { id: req.params.id },
      data: {
        ...(dados.descricao            !== undefined && { descricao: dados.descricao }),
        ...(dados.valor                !== undefined && { valor: parseFloat(dados.valor) }),
        ...(dados.dataVencimento       !== undefined && { dataVencimento: dados.dataVencimento || null }),
        ...(dados.dataPagamento        !== undefined && { dataPagamento: dados.dataPagamento || null }),
        ...(dados.categoria            !== undefined && { categoria: dados.categoria }),
        ...(dados.observacoes          !== undefined && { observacoes: dados.observacoes }),
        ...(dados.status               !== undefined && { status: dados.status }),
        ...(dados.recorrente           !== undefined && { recorrente: !!dados.recorrente }),
        ...(dados.intervaloRecorrencia !== undefined && { intervaloRecorrencia: dados.intervaloRecorrencia || null }),
        ...(dados.recorrenciaAtiva     !== undefined && { recorrenciaAtiva: !!dados.recorrenciaAtiva }),
      },
    });
    res.json(serializarConta(atualizada));
  } catch (e) {
    if (e.code === 'P2025') return erro(res, 'Conta não encontrada', 404);
    erro(res, e.message);
  }
});

// Excluir
app.delete('/api/contas/:id', async (req, res) => {
  try {
    await prisma.conta.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e) {
    if (e.code === 'P2025') return erro(res, 'Conta não encontrada', 404);
    erro(res, e.message);
  }
});

// Excluir grupo de parcelamento
app.delete('/api/contas/grupo/:grupoId', async (req, res) => {
  try {
    const result = await prisma.conta.deleteMany({
      where: { grupoParcelamento: req.params.grupoId },
    });
    res.json({ ok: true, removidas: result.count });
  } catch (e) { erro(res, e.message); }
});

// Serializar conta (datas Prisma → string YYYY-MM-DD)
function serializarConta(c) {
  return {
    id:                   c.id,
    descricao:            c.descricao,
    valor:                c.valor,
    dataVencimento:       c.dataVencimento  || null,
    dataPagamento:        c.dataPagamento   || null,
    categoria:            c.categoria,
    observacoes:          c.observacoes     || '',
    status:               c.status,
    recorrente:           c.recorrente,
    intervaloRecorrencia: c.intervaloRecorrencia || null,
    recorrenciaAtiva:     c.recorrenciaAtiva,
    parcelado:            c.parcelado,
    totalParcelas:        c.totalParcelas   ?? null,
    parcelaAtual:         c.parcelaAtual    ?? null,
    grupoParcelamento:    c.grupoParcelamento || null,
    criadoEm:             c.criadoEm?.toISOString(),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// CATEGORIAS
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/api/categorias', async (req, res) => {
  try {
    const cats = await prisma.categoria.findMany({ orderBy: { ordem: 'asc' } });
    res.json(cats);
  } catch (e) { erro(res, e.message); }
});

app.post('/api/categorias', async (req, res) => {
  try {
    const { nome, cor, icone } = req.body;
    // Gerar ID baseado no nome
    const id = nome.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    const total = await prisma.categoria.count();
    const nova = await prisma.categoria.create({
      data: { id: id + '_' + Date.now(), nome, cor, icone, ordem: total + 1 },
    });
    res.status(201).json(nova);
  } catch (e) { erro(res, e.message); }
});

app.put('/api/categorias/:id', async (req, res) => {
  try {
    const { nome, cor, icone } = req.body;
    const atualizada = await prisma.categoria.update({
      where: { id: req.params.id },
      data: { nome, cor, icone },
    });
    res.json(atualizada);
  } catch (e) {
    if (e.code === 'P2025') return erro(res, 'Categoria não encontrada', 404);
    erro(res, e.message);
  }
});

app.delete('/api/categorias/:id', async (req, res) => {
  try {
    await prisma.categoria.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e) {
    if (e.code === 'P2025') return erro(res, 'Categoria não encontrada', 404);
    erro(res, e.message);
  }
});

// ═══════════════════════════════════════════════════════════════════════════════
// KANBAN
// ═══════════════════════════════════════════════════════════════════════════════

// Retorna { todo: [], doing: [], done: [] }
app.get('/api/kanban', async (req, res) => {
  try {
    const cards = await prisma.kanbanCard.findMany({ orderBy: [{ coluna: 'asc' }, { ordem: 'asc' }] });
    const board = { todo: [], doing: [], done: [] };
    for (const c of cards) {
      if (board[c.coluna]) board[c.coluna].push(c);
    }
    res.json(board);
  } catch (e) { erro(res, e.message); }
});

// Salva estado completo do board (substituição total — usado pelo frontend)
app.put('/api/kanban', async (req, res) => {
  try {
    const board = req.body; // { todo: [], doing: [], done: [] }
    // Deletar todos e recriar (simples e confiável para Kanban com drag-and-drop)
    await prisma.kanbanCard.deleteMany();
    const inserts = [];
    for (const [coluna, cards] of Object.entries(board)) {
      cards.forEach((c, i) => {
        inserts.push(prisma.kanbanCard.create({
          data: {
            id:        c.id,
            coluna,
            titulo:    c.titulo    || c.title || 'Sem título',
            descricao: c.descricao || c.desc  || null,
            prioridade:c.prioridade || null,
            cor:       c.cor       || null,
            ordem:     i,
          },
        }));
      });
    }
    await Promise.all(inserts);
    res.json({ ok: true });
  } catch (e) { erro(res, e.message); }
});

// Adicionar card
app.post('/api/kanban/:coluna', async (req, res) => {
  try {
    const { coluna } = req.params;
    const total = await prisma.kanbanCard.count({ where: { coluna } });
    const novo = await prisma.kanbanCard.create({
      data: {
        coluna,
        titulo:    req.body.titulo    || 'Nova nota',
        descricao: req.body.descricao || null,
        prioridade:req.body.prioridade || null,
        cor:       req.body.cor       || null,
        ordem:     total,
      },
    });
    res.status(201).json(novo);
  } catch (e) { erro(res, e.message); }
});

// Atualizar card
app.put('/api/kanban/card/:id', async (req, res) => {
  try {
    const atualizado = await prisma.kanbanCard.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(atualizado);
  } catch (e) { erro(res, e.message); }
});

// Deletar card
app.delete('/api/kanban/card/:id', async (req, res) => {
  try {
    await prisma.kanbanCard.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch (e) { erro(res, e.message); }
});

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════════════════════════════════════════

app.get('/api/config', async (req, res) => {
  try {
    const config = await prisma.config.upsert({
      where:  { id: 'main' },
      update: {},
      create: { id: 'main', tema: 'dark', moeda: 'BRL', nomeUsuario: 'Usuário', saldoInicial: 0 },
    });
    res.json(config);
  } catch (e) { erro(res, e.message); }
});

app.put('/api/config', async (req, res) => {
  try {
    const config = await prisma.config.upsert({
      where:  { id: 'main' },
      update: req.body,
      create: { id: 'main', ...req.body },
    });
    res.json(config);
  } catch (e) { erro(res, e.message); }
});

// ─── Saúde da API ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', versao: '1.0.0', banco: 'SQLite', timestamp: new Date().toISOString() });
});

// ─── Iniciar servidor ─────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════╗');
  console.log('║   💰 FinanceFlow — Servidor rodando       ║');
  console.log(`║   📡 http://localhost:${PORT}               ║`);
  console.log('║   🗄️  Banco: banco/financeflow.db          ║');
  console.log('║   ⌨️  Ctrl+C para parar                    ║');
  console.log('╚══════════════════════════════════════════╝');
  console.log('');
});

// Fechar Prisma ao encerrar
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
