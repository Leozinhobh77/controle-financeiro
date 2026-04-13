/**
 * financeiro.js — Lógica de negócio para contas, parcelamentos e recorrências
 */

const Financeiro = (() => {

  // ─── Atualizar status automaticamente ────────────────────────────────
  function sincronizarStatus() {
    const contas = Storage.getContas();
    const hoje = UI.hoje();
    let alterado = false;

    const atualizadas = contas.map(c => {
      if (c.status !== 'pago' && c.dataVencimento && c.dataVencimento < hoje) {
        alterado = true;
        return { ...c, status: 'atrasado' };
      }
      if (c.status === 'atrasado' && c.dataVencimento >= hoje) {
        alterado = true;
        return { ...c, status: 'pendente' };
      }
      return c;
    });

    if (alterado) Storage.setContas(atualizadas);
    return atualizadas;
  }

  // ─── Gerar próxima data de vencimento (recorrência) ───────────────────
  function proximaData(dataISO, intervalo) {
    const d = new Date(dataISO + 'T12:00:00');
    if (intervalo === 'semanal') d.setDate(d.getDate() + 7);
    else if (intervalo === 'mensal') d.setMonth(d.getMonth() + 1);
    else if (intervalo === 'anual') d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
  }

  // ─── Criar conta simples ──────────────────────────────────────────────
  function criarConta(dados) {
    const conta = {
      descricao: dados.descricao.trim(),
      valor: parseFloat(dados.valor),
      dataVencimento: dados.dataVencimento,
      categoria: dados.categoria || 'outros',
      observacoes: dados.observacoes || '',
      status: 'pendente',
      recorrente: !!dados.recorrente,
      intervaloRecorrencia: dados.recorrente ? (dados.intervaloRecorrencia || 'mensal') : null,
      recorrenciaAtiva: !!dados.recorrente,
      parcelado: false,
      totalParcelas: null,
      parcelaAtual: null,
      grupoParcelamento: null,
    };
    return Storage.adicionarConta(conta);
  }

  // ─── Criar parcelamento ───────────────────────────────────────────────
  function criarParcelamento(dados) {
    const total = parseInt(dados.totalParcelas);
    const valorTotal = parseFloat(dados.valor);
    const valorParcela = parseFloat((valorTotal / total).toFixed(2));
    const grupoId = Storage.gerarId();
    const parcelas = [];

    let dataAtual = dados.dataVencimento;

    for (let i = 1; i <= total; i++) {
      // Ajuste centavos na última parcela
      const v = i === total
        ? parseFloat((valorTotal - valorParcela * (total - 1)).toFixed(2))
        : valorParcela;

      const conta = Storage.adicionarConta({
        descricao: `${dados.descricao.trim()} (${i}/${total})`,
        valor: v,
        dataVencimento: dataAtual,
        categoria: dados.categoria || 'outros',
        observacoes: dados.observacoes || '',
        status: 'pendente',
        recorrente: false,
        intervaloRecorrencia: null,
        recorrenciaAtiva: false,
        parcelado: true,
        totalParcelas: total,
        parcelaAtual: i,
        grupoParcelamento: grupoId,
      });
      parcelas.push(conta);
      dataAtual = proximaData(dataAtual, 'mensal');
    }
    return parcelas;
  }

  // ─── Marcar como pago ────────────────────────────────────────────────
  function marcarComoPago(id) {
    const contas = Storage.getContas();
    const conta = contas.find(c => c.id === id);
    if (!conta) return null;

    const atualizada = Storage.atualizarConta(id, {
      status: 'pago',
      dataPagamento: UI.hoje(),
    });

    // Se for recorrente e ativa, gerar próxima ocorrência
    if (conta.recorrente && conta.recorrenciaAtiva) {
      const novaData = proximaData(conta.dataVencimento, conta.intervaloRecorrencia);
      Storage.adicionarConta({
        ...conta,
        id: undefined,
        status: 'pendente',
        dataVencimento: novaData,
        dataPagamento: null,
        criadoEm: undefined,
      });
    }

    return atualizada;
  }

  // ─── Desmarcar pagamento ──────────────────────────────────────────────
  function desmarcarPagamento(id) {
    const hoje = UI.hoje();
    const conta = Storage.getContas().find(c => c.id === id);
    if (!conta) return null;

    const novoStatus = conta.dataVencimento < hoje ? 'atrasado' : 'pendente';
    return Storage.atualizarConta(id, { status: novoStatus, dataPagamento: null });
  }

  // ─── Editar conta ────────────────────────────────────────────────────
  function editarConta(id, dados) {
    return Storage.atualizarConta(id, {
      descricao: dados.descricao.trim(),
      valor: parseFloat(dados.valor),
      dataVencimento: dados.dataVencimento,
      categoria: dados.categoria,
      observacoes: dados.observacoes || '',
      recorrente: !!dados.recorrente,
      intervaloRecorrencia: dados.recorrente ? (dados.intervaloRecorrencia || 'mensal') : null,
      recorrenciaAtiva: !!dados.recorrente,
    });
  }

  // ─── Excluir conta ────────────────────────────────────────────────────
  function excluirConta(id) {
    return Storage.removerConta(id);
  }

  // ─── Excluir grupo de parcelas ────────────────────────────────────────
  function excluirParcelamento(grupoId) {
    return Storage.removerGrupoParcelamento(grupoId);
  }

  // ─── Calcular estatísticas ────────────────────────────────────────────
  function calcularEstatisticas() {
    const contas = sincronizarStatus();
    const hoje = new Date().toISOString().split('T')[0];
    const agora = new Date();

    const inicioDia = hoje;
    const inicioSemana = (() => {
      const d = new Date(agora);
      d.setDate(d.getDate() - d.getDay());
      return d.toISOString().split('T')[0];
    })();
    const inicioMes = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}-01`;

    let totalPago = 0, totalPendente = 0, totalAtrasado = 0;
    let gasto_dia = 0, gasto_semana = 0, gasto_mes = 0;
    const proximasContas = [], contasAtrasadas = [];

    for (const c of contas) {
      if (c.status === 'pago') {
        totalPago += c.valor;
        const dp = c.dataPagamento || c.dataVencimento;
        if (dp >= inicioDia) gasto_dia += c.valor;
        if (dp >= inicioSemana) gasto_semana += c.valor;
        if (dp >= inicioMes) gasto_mes += c.valor;
      } else if (c.status === 'atrasado') {
        totalAtrasado += c.valor;
        contasAtrasadas.push(c);
      } else {
        totalPendente += c.valor;
        if (c.dataVencimento >= hoje) proximasContas.push(c);
      }
    }

    // Ordenar próximas por vencimento
    proximasContas.sort((a, b) => a.dataVencimento.localeCompare(b.dataVencimento));
    contasAtrasadas.sort((a, b) => a.dataVencimento.localeCompare(b.dataVencimento));

    // Score de saúde financeira (0-100)
    const totalContas = contas.length;
    const pagas = contas.filter(c => c.status === 'pago').length;
    const atrasadas = contasAtrasadas.length;
    let score = 100;
    if (totalContas > 0) {
      score -= (atrasadas / totalContas) * 60;
      score -= Math.min((totalAtrasado / Math.max(totalPago + totalPendente + totalAtrasado, 1)) * 40, 40);
    }

    const config = Storage.getConfig();
    const saldoInicial = config.saldoInicial || 0;
    const saldoTotal = saldoInicial - totalPendente - totalAtrasado;

    return {
      saldoTotal,
      totalPago,
      totalPendente,
      totalAtrasado,
      gasto_dia,
      gasto_semana,
      gasto_mes,
      proximasContas: proximasContas.slice(0, 5),
      contasAtrasadas: contasAtrasadas.slice(0, 5),
      saudeScore: Math.max(0, Math.round(score)),
      totalContas,
    };
  }

  // ─── Dados para gráficos ──────────────────────────────────────────────
  function dadosPorCategoria(mesAno = null) {
    const contas = Storage.getContas();
    const categorias = Storage.getCategorias();
    const filtradas = mesAno
      ? contas.filter(c => c.dataVencimento && c.dataVencimento.startsWith(mesAno))
      : contas;

    const mapa = {};
    for (const c of filtradas) {
      if (!mapa[c.categoria]) mapa[c.categoria] = 0;
      mapa[c.categoria] += c.valor;
    }

    return categorias
      .filter(cat => mapa[cat.id] > 0)
      .map(cat => ({ label: cat.nome, value: mapa[cat.id], cor: cat.cor }))
      .sort((a, b) => b.value - a.value);
  }

  function dadosMensais(qtdMeses = 6) {
    const contas = Storage.getContas();
    const resultado = [];
    const agora = new Date();

    for (let i = qtdMeses - 1; i >= 0; i--) {
      const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
      const mesAno = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('pt-BR', { month: 'short' });

      const pagos = contas
        .filter(c => c.status === 'pago' && c.dataVencimento && c.dataVencimento.startsWith(mesAno))
        .reduce((s, c) => s + c.valor, 0);

      const pendentes = contas
        .filter(c => c.status !== 'pago' && c.dataVencimento && c.dataVencimento.startsWith(mesAno))
        .reduce((s, c) => s + c.valor, 0);

      resultado.push({ label, value: pagos, value2: pendentes, mesAno });
    }
    return resultado;
  }

  // ─── Resumo temporal (pago vs falta pagar por período) ───────────────
  function calcularResumoTemporal() {
    const contas = sincronizarStatus();
    const agora = new Date();
    const hoje = agora.toISOString().split('T')[0];

    const diaSemana = agora.getDay();
    const inicioSemana = new Date(agora);
    inicioSemana.setDate(agora.getDate() - diaSemana);
    const fimSemana = new Date(agora);
    fimSemana.setDate(agora.getDate() + (6 - diaSemana));
    const inicioSemanaStr = inicioSemana.toISOString().split('T')[0];
    const fimSemanaStr = fimSemana.toISOString().split('T')[0];

    const inicioMes = `${agora.getFullYear()}-${String(agora.getMonth()+1).padStart(2,'0')}-01`;
    const fimMes = new Date(agora.getFullYear(), agora.getMonth()+1, 0).toISOString().split('T')[0];

    const inicioAno = `${agora.getFullYear()}-01-01`;
    const fimAno = `${agora.getFullYear()}-12-31`;

    function calcPeriodo(inicio, fim) {
      const pagas = contas.filter(c => c.status === 'pago' && (c.dataPagamento || c.dataVencimento) >= inicio && (c.dataPagamento || c.dataVencimento) <= fim);
      const pendentes = contas.filter(c => c.status !== 'pago' && c.dataVencimento >= inicio && c.dataVencimento <= fim);
      const atrasadas = contas.filter(c => c.status === 'atrasado' && c.dataVencimento >= inicio && c.dataVencimento <= fim);
      const pago = pagas.reduce((s, c) => s + c.valor, 0);
      const falta = pendentes.reduce((s, c) => s + c.valor, 0);
      const atrasado = atrasadas.reduce((s, c) => s + c.valor, 0);
      return { pago, falta, atrasado, total: pago + falta + atrasado, count_pago: pagas.length, count_falta: pendentes.length };
    }

    return {
      hoje: calcPeriodo(hoje, hoje),
      semana: calcPeriodo(inicioSemanaStr, fimSemanaStr),
      mes: calcPeriodo(inicioMes, fimMes),
      ano: calcPeriodo(inicioAno, fimAno),
      periodos: { inicioSemana: inicioSemanaStr, fimSemana: fimSemanaStr, inicioMes, fimMes, inicioAno, fimAno },
    };
  }

  // ─── Dados diários da semana atual ───────────────────────────────────
  function dadosSemanaAtual() {
    const contas = Storage.getContas();
    const agora = new Date();
    const dias = [];
    const nomes = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(agora);
      d.setDate(agora.getDate() - agora.getDay() + i);
      const dataStr = d.toISOString().split('T')[0];
      const pago = contas.filter(c => c.status === 'pago' && (c.dataPagamento || c.dataVencimento) === dataStr).reduce((s, c) => s + c.valor, 0);
      const falta = contas.filter(c => c.status !== 'pago' && c.dataVencimento === dataStr).reduce((s, c) => s + c.valor, 0);
      dias.push({ label: nomes[i], data: dataStr, pago, falta, isHoje: dataStr === agora.toISOString().split('T')[0] });
    }
    return dias;
  }

  function getContasFiltradas(filtros = {}) {
    let contas = sincronizarStatus();

    if (filtros.status && filtros.status !== 'todos') {
      contas = contas.filter(c => c.status === filtros.status);
    }
    if (filtros.categoria && filtros.categoria !== 'todas') {
      contas = contas.filter(c => c.categoria === filtros.categoria);
    }
    if (filtros.busca) {
      const b = filtros.busca.toLowerCase();
      contas = contas.filter(c => c.descricao.toLowerCase().includes(b));
    }
    if (filtros.mesAno) {
      contas = contas.filter(c => c.dataVencimento && c.dataVencimento.startsWith(filtros.mesAno));
    }

    // Ordenar por data de vencimento
    contas.sort((a, b) => (a.dataVencimento || '').localeCompare(b.dataVencimento || ''));
    return contas;
  }

  return {
    sincronizarStatus,
    criarConta, criarParcelamento,
    marcarComoPago, desmarcarPagamento,
    editarConta, excluirConta, excluirParcelamento,
    calcularEstatisticas, calcularResumoTemporal,
    dadosPorCategoria, dadosMensais, dadosSemanaAtual,
    getContasFiltradas,
  };
})();
