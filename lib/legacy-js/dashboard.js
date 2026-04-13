/**
 * dashboard.js — Renderização e lógica do Dashboard com filtros por período
 */

const Dashboard = (() => {

  let filtroAtivo = 'mes'; // hoje | semana | mes | ano | custom
  let customInicio = null;
  let customFim = null;

  // ─── Render principal ─────────────────────────────────────────────────
  function render() {
    const stats   = Financeiro.calcularEstatisticas();
    const resumo  = Financeiro.calcularResumoTemporal();
    const semana  = Financeiro.dadosSemanaAtual();
    const agora   = new Date();
    const mesAtual = `${agora.getFullYear()}-${String(agora.getMonth() + 1).padStart(2, '0')}`;

    const page = document.getElementById('page-dashboard');
    page.innerHTML = `

      <!-- ── Cabeçalho ─────────────────────────────────────────────── -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">${agora.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <div class="page-header-actions">
          <button class="btn btn-ghost btn-sm" id="btn-exportar-csv">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
            Exportar CSV
          </button>
        </div>
      </div>

      <!-- ── Filtros de período ─────────────────────────────────────── -->
      <div class="period-filter-bar">
        <div class="period-filter-tabs">
          <button class="period-tab ${filtroAtivo === 'hoje'   ? 'active' : ''}" onclick="Dashboard.setFiltro('hoje')">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke-width="2"/><line x1="16" y1="2" x2="16" y2="6" stroke-width="2"/><line x1="8" y1="2" x2="8" y2="6" stroke-width="2"/><line x1="3" y1="10" x2="21" y2="10" stroke-width="2"/></svg>
            Hoje
          </button>
          <button class="period-tab ${filtroAtivo === 'semana' ? 'active' : ''}" onclick="Dashboard.setFiltro('semana')">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            Semana
          </button>
          <button class="period-tab ${filtroAtivo === 'mes'    ? 'active' : ''}" onclick="Dashboard.setFiltro('mes')">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            Este Mês
          </button>
          <button class="period-tab ${filtroAtivo === 'ano'    ? 'active' : ''}" onclick="Dashboard.setFiltro('ano')">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
            Este Ano
          </button>
          <div class="period-tab-divider"></div>
          <div class="period-custom">
            <input type="date" id="custom-inicio" class="form-input period-date-input"
              value="${customInicio || ''}" placeholder="De" onchange="Dashboard.setFiltroCustom()">
            <span class="period-custom-sep">→</span>
            <input type="date" id="custom-fim" class="form-input period-date-input"
              value="${customFim || ''}" placeholder="Até" onchange="Dashboard.setFiltroCustom()">
          </div>
        </div>
      </div>

      <!-- ── Painel do período selecionado ─────────────────────────── -->
      ${renderPeriodoDestaque(resumo, stats)}

      <!-- ── Cards principais ──────────────────────────────────────── -->
      <div class="stats-grid">
        <div class="stat-card stat-card-primary">
          <div class="stat-glow stat-glow-primary"></div>
          <div class="stat-icon-wrap stat-icon-primary">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Saldo Projetado</span>
            <span class="stat-value ${stats.saldoTotal < 0 ? 'text-danger' : ''}">${UI.formatarMoeda(stats.saldoTotal)}</span>
            <span class="stat-sub">Saldo − pendentes</span>
          </div>
          <div class="stat-sparkline" id="spark-saldo"></div>
        </div>

        <div class="stat-card stat-card-success">
          <div class="stat-glow stat-glow-success"></div>
          <div class="stat-icon-wrap stat-icon-success">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Pago</span>
            <span class="stat-value">${UI.formatarMoeda(stats.totalPago)}</span>
            <span class="stat-sub">${stats.totalContas > 0 ? Math.round((stats.totalContas - stats.contasAtrasadas.length) / stats.totalContas * 100) : 0}% das contas</span>
          </div>
        </div>

        <div class="stat-card stat-card-warning">
          <div class="stat-glow stat-glow-warning"></div>
          <div class="stat-icon-wrap stat-icon-warning">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Pendente</span>
            <span class="stat-value">${UI.formatarMoeda(stats.totalPendente)}</span>
            <span class="stat-sub">${stats.proximasContas.length} conta(s) próximas</span>
          </div>
        </div>

        <div class="stat-card ${stats.totalAtrasado > 0 ? 'stat-card-danger' : 'stat-card-neutral'}">
          <div class="stat-glow ${stats.totalAtrasado > 0 ? 'stat-glow-danger' : 'stat-glow-neutral'}"></div>
          <div class="stat-icon-wrap ${stats.totalAtrasado > 0 ? 'stat-icon-danger' : 'stat-icon-neutral'}">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Atrasado</span>
            <span class="stat-value ${stats.totalAtrasado > 0 ? 'text-danger' : ''}">${UI.formatarMoeda(stats.totalAtrasado)}</span>
            <span class="stat-sub">${stats.contasAtrasadas.length} conta(s) em atraso</span>
          </div>
        </div>
      </div>

      <!-- ── Visão por Período: Pago vs Falta Pagar ─────────────────── -->
      <div class="section-header">
        <h2 class="section-title">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
          Pago vs. Falta Pagar
        </h2>
        <span class="section-sub">Visão consolidada por período</span>
      </div>
      ${renderTabelaPeriodos(resumo)}

      <!-- ── Minha Semana ───────────────────────────────────────────── -->
      <div class="section-header">
        <h2 class="section-title">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          Minha Semana
        </h2>
        <span class="section-sub">Contas de cada dia desta semana</span>
      </div>
      ${renderSemanaView(semana)}

      <!-- ── Mini-cards de saúde e período ─────────────────────────── -->
      <div class="stats-row">
        <div class="mini-card">
          <span class="mini-card-label">Pago Hoje</span>
          <span class="mini-card-value text-success">${UI.formatarMoeda(stats.gasto_dia)}</span>
        </div>
        <div class="mini-card">
          <span class="mini-card-label">Pago Esta Semana</span>
          <span class="mini-card-value text-success">${UI.formatarMoeda(stats.gasto_semana)}</span>
        </div>
        <div class="mini-card">
          <span class="mini-card-label">Pago Este Mês</span>
          <span class="mini-card-value text-success">${UI.formatarMoeda(stats.gasto_mes)}</span>
        </div>
        <div class="mini-card mini-card-saude">
          <span class="mini-card-label">Saúde Financeira</span>
          <div id="chart-saude"></div>
        </div>
      </div>

      <!-- ── Gráficos ───────────────────────────────────────────────── -->
      <div class="dashboard-grid">

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Comparativo Mensal</h3>
            <span class="card-badge">Últimos 6 meses</span>
          </div>
          <div class="chart-legend-row">
            <span class="legend-dot" style="background:#6366F1"></span><span>Pago</span>
            <span class="legend-dot" style="background:#F59E0B"></span><span>Pendente</span>
          </div>
          <div id="chart-mensal"></div>
        </div>

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Gastos por Categoria</h3>
            <span class="card-badge">${agora.toLocaleDateString('pt-BR', { month: 'long' })}</span>
          </div>
          <div id="chart-categorias"></div>
        </div>

      </div>

      <!-- ── Alertas e próximas ─────────────────────────────────────── -->
      <div class="dashboard-grid">

        ${stats.contasAtrasadas.length > 0 ? `
        <div class="card card-alert">
          <div class="card-header">
            <h3 class="card-title">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
              Contas Atrasadas
            </h3>
            <span class="badge badge-danger">${stats.contasAtrasadas.length}</span>
          </div>
          <div class="conta-lista">
            ${stats.contasAtrasadas.map(c => `
              <div class="conta-item conta-atrasada">
                <div class="conta-item-info">
                  <span class="conta-item-desc">${c.descricao}</span>
                  <span class="conta-item-data">Venceu em ${UI.formatarData(c.dataVencimento)}</span>
                </div>
                <div class="conta-item-right">
                  <span class="conta-item-valor text-danger">${UI.formatarMoeda(c.valor)}</span>
                  <button class="btn btn-sm btn-success" onclick="App.pagarConta('${c.id}')">Pagar</button>
                </div>
              </div>`).join('')}
          </div>
        </div>` : ''}

        <div class="card">
          <div class="card-header">
            <h3 class="card-title">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              Próximas Contas
            </h3>
            <span class="badge badge-info">${stats.proximasContas.length}</span>
          </div>
          ${stats.proximasContas.length === 0
            ? '<div class="empty-state-small"><span>🎉</span><p>Nenhuma conta pendente!</p></div>'
            : `<div class="conta-lista">
                ${stats.proximasContas.map(c => {
                  const catObj = Storage.getCategorias().find(cat => cat.id === c.categoria) || {};
                  const diasRestantes = Math.ceil((new Date(c.dataVencimento + 'T12:00:00') - new Date()) / 86400000);
                  const urgente = diasRestantes <= 3;
                  return `
                  <div class="conta-item ${urgente ? 'conta-urgente' : ''}">
                    <div class="conta-item-cat" style="background:${catObj.cor || '#6B7280'}22;color:${catObj.cor || '#6B7280'}">${catObj.icone || '📦'}</div>
                    <div class="conta-item-info">
                      <span class="conta-item-desc">${c.descricao}</span>
                      <span class="conta-item-data ${urgente ? 'text-warning' : ''}">
                        ${diasRestantes === 0 ? '🔥 Hoje!' : diasRestantes === 1 ? '⚡ Amanhã' : `em ${diasRestantes} dias`} — ${UI.formatarData(c.dataVencimento)}
                      </span>
                    </div>
                    <div class="conta-item-right">
                      <span class="conta-item-valor">${UI.formatarMoeda(c.valor)}</span>
                      <button class="btn btn-xs btn-success" onclick="App.pagarConta('${c.id}')">✓</button>
                    </div>
                  </div>`;
                }).join('')}
              </div>`}
        </div>

      </div>
    `;

    // Renderizar gráficos
    UI.renderSaude('chart-saude', stats.saudeScore);
    UI.renderBarras('chart-mensal', Financeiro.dadosMensais(6), { doisEixos: true, altura: 200 });
    UI.renderDonut('chart-categorias', Financeiro.dadosPorCategoria(mesAtual));

    const dadosMes = Financeiro.dadosMensais(6);
    UI.renderSparkline('spark-saldo', dadosMes.map(d => d.value), '#6366F1');

    document.getElementById('btn-exportar-csv')?.addEventListener('click', exportarCSV);

    // Animar progress bars e barras da semana após DOM pronto
    requestAnimationFrame(() => {
      setTimeout(() => {
        // Progress bars dos cards de período
        document.querySelectorAll('.period-progress-fill').forEach(el => {
          el.style.width = el.dataset.pct + '%';
        });
        // Progress bar do destaque
        const fill = document.querySelector('.period-destaque-fill');
        if (fill) fill.style.width = fill.dataset.pct + '%';
      }, 60);
    });
  }

  // ─── Painel do período ativo ──────────────────────────────────────────
  function renderPeriodoDestaque(resumo, stats) {
    const mapa = { hoje: 'hoje', semana: 'semana', mes: 'mes', ano: 'ano' };
    const chave = mapa[filtroAtivo] || 'mes';
    const d = filtroAtivo === 'custom' && customInicio && customFim
      ? calcularCustom(customInicio, customFim)
      : resumo[chave];

    if (!d) return '';

    const pct = d.total > 0 ? Math.min((d.pago / d.total) * 100, 100) : 0;
    const labelPeriodo = {
      hoje: 'Hoje', semana: 'Esta Semana', mes: 'Este Mês', ano: 'Este Ano', custom: 'Período Personalizado'
    }[filtroAtivo] || 'Período';

    const corPct = pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444';

    return `
      <div class="period-destaque">
        <div class="period-destaque-label">
          <span class="period-destaque-titulo">${labelPeriodo}</span>
          <span class="period-destaque-progress-text">${pct.toFixed(0)}% pago</span>
        </div>
        <div class="period-destaque-track">
          <div class="period-destaque-fill" data-pct="${pct.toFixed(1)}" style="width:0%;background:${corPct}"></div>
        </div>
        <div class="period-destaque-stats">
          <div class="period-destaque-stat">
            <div class="period-destaque-stat-icon success">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7"/></svg>
            </div>
            <div>
              <div class="period-destaque-stat-val text-success">${UI.formatarMoeda(d.pago)}</div>
              <div class="period-destaque-stat-label">Já pago · ${d.count_pago} conta(s)</div>
            </div>
          </div>
          <div class="period-destaque-divider"></div>
          <div class="period-destaque-stat">
            <div class="period-destaque-stat-icon warning">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div>
              <div class="period-destaque-stat-val ${d.falta > 0 ? 'text-warning' : 'text-muted'}">${UI.formatarMoeda(d.falta)}</div>
              <div class="period-destaque-stat-label">Falta pagar · ${d.count_falta} conta(s)</div>
            </div>
          </div>
          <div class="period-destaque-divider"></div>
          <div class="period-destaque-stat">
            <div class="period-destaque-stat-icon neutral">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M12 7h.01M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1z"/></svg>
            </div>
            <div>
              <div class="period-destaque-stat-val">${UI.formatarMoeda(d.total)}</div>
              <div class="period-destaque-stat-label">Total do período</div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ─── Tabela Pago vs Falta Pagar por período ───────────────────────────
  function renderTabelaPeriodos(resumo) {
    const periodos = [
      { key: 'hoje',   label: 'Hoje',        icon: '📅' },
      { key: 'semana', label: 'Esta Semana',  icon: '📆' },
      { key: 'mes',    label: 'Este Mês',     icon: '🗓️' },
      { key: 'ano',    label: 'Este Ano',     icon: '📊' },
    ];

    return `
      <div class="periodo-cards-grid">
        ${periodos.map(p => {
          const d = resumo[p.key];
          const pct = d.total > 0 ? Math.min((d.pago / d.total) * 100, 100) : 0;
          const corPct = pct >= 80 ? '#10B981' : pct >= 50 ? '#F59E0B' : '#EF4444';
          const isAtivo = filtroAtivo === p.key;
          return `
            <div class="periodo-card ${isAtivo ? 'periodo-card--ativo' : ''}" onclick="Dashboard.setFiltro('${p.key}')">
              <div class="periodo-card-header">
                <span class="periodo-card-icon">${p.icon}</span>
                <span class="periodo-card-label">${p.label}</span>
                ${isAtivo ? '<span class="periodo-card-active-dot"></span>' : ''}
              </div>
              <div class="periodo-card-body">
                <div class="periodo-stat-row">
                  <div class="periodo-stat-item">
                    <span class="periodo-stat-label">
                      <span class="dot-success"></span>Pago
                    </span>
                    <span class="periodo-stat-value text-success">${UI.formatarMoeda(d.pago)}</span>
                    <span class="periodo-stat-count">${d.count_pago} conta(s)</span>
                  </div>
                  <div class="periodo-stat-divider-v"></div>
                  <div class="periodo-stat-item">
                    <span class="periodo-stat-label">
                      <span class="dot-warning"></span>Falta pagar
                    </span>
                    <span class="periodo-stat-value ${d.falta > 0 ? 'text-warning' : 'text-muted'}">${UI.formatarMoeda(d.falta)}</span>
                    <span class="periodo-stat-count">${d.count_falta} conta(s)</span>
                  </div>
                </div>
                <div class="periodo-progress-wrap">
                  <div class="periodo-progress-track">
                    <div class="periodo-progress-fill period-progress-fill"
                      data-pct="${pct.toFixed(1)}"
                      style="width:0%;background:${corPct};transition:width 0.8s cubic-bezier(0.4,0,0.2,1)">
                    </div>
                  </div>
                  <span class="periodo-progress-pct" style="color:${corPct}">${pct.toFixed(0)}%</span>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // ─── Visão da semana (dia a dia) ──────────────────────────────────────
  function renderSemanaView(semana) {
    const maxVal = Math.max(...semana.map(d => d.pago + d.falta), 1);

    return `
      <div class="semana-grid">
        ${semana.map(d => {
          const total = d.pago + d.falta;
          const pctPago = total > 0 ? (d.pago / maxVal) * 100 : 0;
          const pctFalta = total > 0 ? (d.falta / maxVal) * 100 : 0;
          return `
            <div class="semana-day ${d.isHoje ? 'semana-day--hoje' : ''} ${total === 0 ? 'semana-day--vazio' : ''}">
              <div class="semana-day-label">
                <span class="semana-day-name">${d.label}</span>
                ${d.isHoje ? '<span class="semana-today-badge">hoje</span>' : ''}
              </div>
              <div class="semana-bar-wrap">
                <div class="semana-bar-track">
                  <div class="semana-bar-falta week-bar-fill" style="height:${pctFalta.toFixed(1)}%;transform:scaleY(0);background:rgba(245,158,11,0.5)" title="Falta: ${UI.formatarMoeda(d.falta)}"></div>
                  <div class="semana-bar-pago week-bar-fill" style="height:${pctPago.toFixed(1)}%;transform:scaleY(0);background:#10B981" title="Pago: ${UI.formatarMoeda(d.pago)}"></div>
                </div>
              </div>
              <div class="semana-day-vals">
                ${d.pago > 0 ? `<span class="semana-val-pago">${UI.formatarMoeda(d.pago)}</span>` : ''}
                ${d.falta > 0 ? `<span class="semana-val-falta">${UI.formatarMoeda(d.falta)}</span>` : ''}
                ${total === 0 ? '<span class="semana-val-zero">—</span>' : ''}
              </div>
            </div>
          `;
        }).join('')}
      </div>
      <div class="semana-legend">
        <span class="legend-dot" style="background:#10B981"></span><span>Pago</span>
        <span class="legend-dot" style="background:rgba(245,158,11,0.6)"></span><span>Falta pagar</span>
      </div>
    `;
  }

  // ─── Helpers ──────────────────────────────────────────────────────────
  function calcularCustom(inicio, fim) {
    const contas = Storage.getContas();
    const pagas = contas.filter(c => c.status === 'pago' && (c.dataPagamento || c.dataVencimento) >= inicio && (c.dataPagamento || c.dataVencimento) <= fim);
    const pendentes = contas.filter(c => c.status !== 'pago' && c.dataVencimento >= inicio && c.dataVencimento <= fim);
    const pago = pagas.reduce((s, c) => s + c.valor, 0);
    const falta = pendentes.reduce((s, c) => s + c.valor, 0);
    return { pago, falta, total: pago + falta, count_pago: pagas.length, count_falta: pendentes.length };
  }

  function setFiltro(filtro) {
    filtroAtivo = filtro;
    customInicio = null;
    customFim = null;
    render();
  }

  function setFiltroCustom() {
    const inicio = document.getElementById('custom-inicio')?.value;
    const fim = document.getElementById('custom-fim')?.value;
    if (inicio && fim && inicio <= fim) {
      filtroAtivo = 'custom';
      customInicio = inicio;
      customFim = fim;
      render();
    }
  }

  // ─── Exportar CSV ─────────────────────────────────────────────────────
  function exportarCSV() {
    const contas = Storage.getContas();
    const header = 'Descrição,Valor,Vencimento,Pagamento,Status,Categoria,Observações\n';
    const rows = contas.map(c => [
      `"${c.descricao}"`,
      c.valor.toFixed(2).replace('.', ','),
      c.dataVencimento || '',
      c.dataPagamento || '',
      c.status,
      c.categoria,
      `"${c.observacoes || ''}"`,
    ].join(',')).join('\n');

    const blob = new Blob(['\ufeff' + header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financeflow_${UI.hoje()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    UI.toast('Exportação concluída!', 'success');
  }

  return { render, setFiltro, setFiltroCustom };
})();
