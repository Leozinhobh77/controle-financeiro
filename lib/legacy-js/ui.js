/**
 * ui.js — Componentes visuais: toasts, modais, gráficos, formatadores
 */

const UI = (() => {

  // ─── Formatadores ────────────────────────────────────────────────────
  const formatarMoeda = (valor) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);

  const formatarData = (iso) => {
    if (!iso) return '—';
    const [ano, mes, dia] = iso.split('T')[0].split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const formatarDataInput = (iso) => (iso ? iso.split('T')[0] : '');

  const hoje = () => new Date().toISOString().split('T')[0];

  const estaAtrasado = (vencimento, status) =>
    status !== 'pago' && vencimento && vencimento < hoje();

  // ─── Toast Notifications ─────────────────────────────────────────────
  let toastContainer = null;

  function getToastContainer() {
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
    return toastContainer;
  }

  function toast(mensagem, tipo = 'info', duracao = 3500) {
    const container = getToastContainer();
    const el = document.createElement('div');
    el.className = `toast toast-${tipo}`;

    const icones = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };
    el.innerHTML = `
      <span class="toast-icon">${icones[tipo] || icones.info}</span>
      <span class="toast-msg">${mensagem}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(el);
    requestAnimationFrame(() => el.classList.add('toast-show'));

    setTimeout(() => {
      el.classList.remove('toast-show');
      el.classList.add('toast-hide');
      setTimeout(() => el.remove(), 350);
    }, duracao);
  }

  // ─── Modal System ─────────────────────────────────────────────────────
  let modalResolve = null;

  function abrirModal(titulo, conteudoHTML, opcoes = {}) {
    const overlay = document.getElementById('modal-overlay');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalFooter = document.getElementById('modal-footer');

    modalTitle.textContent = titulo;
    modalBody.innerHTML = conteudoHTML;

    // Footer com botões
    const btnSalvar = opcoes.btnSalvar !== false;
    const btnCancelar = opcoes.btnCancelar !== false;
    const labelSalvar = opcoes.labelSalvar || 'Salvar';

    modalFooter.innerHTML = `
      ${btnCancelar ? `<button class="btn btn-ghost" id="modal-btn-cancelar">Cancelar</button>` : ''}
      ${btnSalvar ? `<button class="btn btn-primary" id="modal-btn-salvar">${labelSalvar}</button>` : ''}
    `;

    overlay.classList.add('active');
    document.body.classList.add('modal-open');

    // Focus first input
    setTimeout(() => {
      const firstInput = modalBody.querySelector('input, select, textarea');
      if (firstInput) firstInput.focus();
    }, 100);

    return new Promise((resolve) => {
      modalResolve = resolve;

      document.getElementById('modal-btn-cancelar')?.addEventListener('click', () => fecharModal(null));
      document.getElementById('modal-btn-salvar')?.addEventListener('click', () => {
        if (opcoes.onSalvar) {
          const resultado = opcoes.onSalvar();
          if (resultado !== false) fecharModal(resultado);
        } else {
          fecharModal(true);
        }
      });

      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) fecharModal(null);
      }, { once: true });
    });
  }

  function fecharModal(resultado = null) {
    const overlay = document.getElementById('modal-overlay');
    overlay.classList.remove('active');
    document.body.classList.remove('modal-open');
    if (modalResolve) {
      modalResolve(resultado);
      modalResolve = null;
    }
  }

  async function confirmar(mensagem, titulo = 'Confirmar') {
    return abrirModal(titulo, `<p class="confirm-msg">${mensagem}</p>`, {
      labelSalvar: 'Confirmar',
      onSalvar: () => true,
    });
  }

  // ─── Gráficos SVG ─────────────────────────────────────────────────────

  /**
   * Gráfico de Rosca (Donut)
   * @param {string} containerId
   * @param {Array<{label, value, cor}>} dados
   */
  function renderDonut(containerId, dados, opcoes = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const tamanho = opcoes.tamanho || 200;
    const espessura = opcoes.espessura || 36;
    const raio = (tamanho - espessura) / 2;
    const circunferencia = 2 * Math.PI * raio;
    const total = dados.reduce((s, d) => s + (d.value || 0), 0);

    if (total === 0) {
      container.innerHTML = `<div class="chart-empty">Sem dados</div>`;
      return;
    }

    const cx = tamanho / 2;
    const cy = tamanho / 2;

    let offset = 0;
    const segmentos = dados
      .filter(d => d.value > 0)
      .map((d, i) => {
        const dash = (d.value / total) * circunferencia;
        const gap = circunferencia - dash;
        const angulo = (offset / total) * 360;
        const seg = `
          <circle class="donut-segment" cx="${cx}" cy="${cy}" r="${raio}"
            fill="none" stroke="${d.cor || '#6366F1'}"
            stroke-width="${espessura}" stroke-linecap="butt"
            stroke-dasharray="${dash.toFixed(2)} ${gap.toFixed(2)}"
            stroke-dashoffset="${(circunferencia * (1 - offset / total)).toFixed(2)}"
            transform="rotate(-90 ${cx} ${cy})"
            style="animation-delay:${i * 0.1}s"
          >
            <title>${d.label}: ${formatarMoeda(d.value)}</title>
          </circle>`;
        offset += d.value;
        return seg;
      });

    const legenda = dados.filter(d => d.value > 0).map(d => `
      <div class="donut-legend-item">
        <span class="donut-legend-dot" style="background:${d.cor}"></span>
        <span class="donut-legend-label">${d.label}</span>
        <span class="donut-legend-value">${((d.value / total) * 100).toFixed(1)}%</span>
      </div>
    `).join('');

    container.innerHTML = `
      <div class="donut-wrap">
        <svg width="${tamanho}" height="${tamanho}" viewBox="0 0 ${tamanho} ${tamanho}" class="donut-svg">
          <circle cx="${cx}" cy="${cy}" r="${raio}" fill="none" stroke="var(--border)" stroke-width="${espessura}"/>
          ${segmentos.join('')}
          <text x="${cx}" y="${cy - 8}" text-anchor="middle" class="donut-center-label">Total</text>
          <text x="${cx}" y="${cy + 14}" text-anchor="middle" class="donut-center-value">${formatarMoeda(total)}</text>
        </svg>
        <div class="donut-legend">${legenda}</div>
      </div>`;
  }

  /**
   * Gráfico de Barras
   * @param {string} containerId
   * @param {Array<{label, value, cor?}>} dados
   */
  function renderBarras(containerId, dados, opcoes = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!dados.length) {
      container.innerHTML = `<div class="chart-empty">Sem dados para exibir</div>`;
      return;
    }

    const altura = opcoes.altura || 220;
    const corBarra = opcoes.cor || '#6366F1';
    const corBarra2 = opcoes.cor2 || '#10B981';
    const doisEixos = opcoes.doisEixos || false;

    const pad = { top: 20, right: 16, bottom: 40, left: 60 };
    const maxVal = Math.max(...dados.map(d => Math.max(d.value || 0, d.value2 || 0)), 1);

    const renderGrafico = () => {
      const largura = container.offsetWidth || 500;
      const w = largura - pad.left - pad.right;
      const h = altura - pad.top - pad.bottom;
      const n = dados.length;
      const slotW = w / n;
      const barW = doisEixos ? slotW * 0.35 : slotW * 0.6;

      const stepVal = maxVal / 4;
      const linhasY = Array.from({ length: 5 }, (_, i) => {
        const y = pad.top + h - (i / 4) * h;
        return `
          <line x1="${pad.left}" y1="${y}" x2="${pad.left + w}" y2="${y}" stroke="var(--border)" stroke-dasharray="4,4" stroke-width="1"/>
          <text x="${pad.left - 8}" y="${y + 4}" text-anchor="end" font-size="10" fill="var(--text-muted)">${formatarMoeda(stepVal * i).replace('R$\u00a0', 'R$')}</text>
        `;
      });

      const barras = dados.map((d, i) => {
        const bh = Math.max(((d.value || 0) / maxVal) * h, 0);
        const x1 = pad.left + i * slotW + (doisEixos ? slotW * 0.1 : (slotW - barW) / 2);
        const y1 = pad.top + h - bh;

        let barra2 = '';
        if (doisEixos && d.value2 !== undefined) {
          const bh2 = Math.max(((d.value2 || 0) / maxVal) * h, 0);
          const x2 = pad.left + i * slotW + slotW * 0.55;
          const y2 = pad.top + h - bh2;
          barra2 = `
            <rect x="${x2}" y="${y2}" width="${barW}" height="${bh2}" rx="3"
              fill="${corBarra2}" opacity="0.85" class="bar-anim">
              <title>${d.label}: ${formatarMoeda(d.value2)}</title>
            </rect>`;
        }

        return `
          <rect x="${x1}" y="${y1}" width="${barW}" height="${bh}" rx="3"
            fill="${d.cor || corBarra}" opacity="0.9" class="bar-anim">
            <title>${d.label}: ${formatarMoeda(d.value)}</title>
          </rect>
          ${barra2}
          <text x="${pad.left + i * slotW + slotW / 2}" y="${pad.top + h + 16}"
            text-anchor="middle" font-size="10" fill="var(--text-muted)">${d.label}</text>
        `;
      });

      container.innerHTML = `
        <svg width="100%" height="${altura}" viewBox="0 0 ${largura} ${altura}">
          ${linhasY.join('')}
          <line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${pad.top + h}" stroke="var(--border)" stroke-width="1"/>
          ${barras.join('')}
        </svg>`;
    };

    renderGrafico();

    // Rerender on resize
    const obs = new ResizeObserver(renderGrafico);
    obs.observe(container);
  }

  /**
   * Mini sparkline para cards do dashboard
   */
  function renderSparkline(containerId, valores, cor = '#6366F1') {
    const container = document.getElementById(containerId);
    if (!container || !valores.length) return;

    const w = 120, h = 40, pad = 4;
    const max = Math.max(...valores, 1);
    const step = (w - pad * 2) / (valores.length - 1);

    const pontos = valores.map((v, i) => {
      const x = pad + i * step;
      const y = h - pad - ((v / max) * (h - pad * 2));
      return `${x},${y}`;
    }).join(' ');

    container.innerHTML = `
      <svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
        <defs>
          <linearGradient id="spark-grad-${containerId}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${cor}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="${cor}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <polyline points="${pontos}" fill="none" stroke="${cor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
  }

  /**
   * Barra de progresso animada
   */
  function renderProgressBar(containerId, percent, cor = '#6366F1') {
    const container = document.getElementById(containerId);
    if (!container) return;
    const pct = Math.min(Math.max(percent, 0), 100);
    container.innerHTML = `
      <div class="progress-track">
        <div class="progress-fill" style="width:${pct}%;background:${cor};" data-pct="${pct}"></div>
      </div>`;
  }

  // ─── Indicador de saúde financeira (arco SVG) ─────────────────────────
  function renderSaude(containerId, score) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const pct = Math.min(Math.max(score, 0), 100);
    const cor = pct >= 70 ? '#10B981' : pct >= 40 ? '#F59E0B' : '#EF4444';
    const label = pct >= 70 ? 'Ótima' : pct >= 40 ? 'Regular' : 'Atenção';

    // Arco semi-circular
    const cx = 80, cy = 80, r = 60;
    const circum = Math.PI * r;
    const dash = (pct / 100) * circum;

    container.innerHTML = `
      <svg width="160" height="90" viewBox="0 0 160 90">
        <path d="M20,80 A60,60 0 0,1 140,80" fill="none" stroke="var(--border)" stroke-width="14" stroke-linecap="round"/>
        <path d="M20,80 A60,60 0 0,1 140,80" fill="none" stroke="${cor}" stroke-width="14"
          stroke-linecap="round" stroke-dasharray="${dash} ${circum}"
          style="transition:stroke-dasharray 1s ease"/>
        <text x="${cx}" y="72" text-anchor="middle" font-size="22" font-weight="700" fill="${cor}">${pct.toFixed(0)}</text>
        <text x="${cx}" y="86" text-anchor="middle" font-size="10" fill="var(--text-muted)">${label}</text>
      </svg>`;
  }

  // ─── Skeleton loader ─────────────────────────────────────────────────
  function skeleton(linhas = 3) {
    return Array.from({ length: linhas }, (_, i) =>
      `<div class="skeleton" style="width:${80 - i * 15}%;height:16px;margin-bottom:10px;border-radius:8px;"></div>`
    ).join('');
  }

  // ─── Badge de status ─────────────────────────────────────────────────
  function badgeStatus(status) {
    const mapa = {
      pago: { label: 'Pago', cls: 'badge-success' },
      pendente: { label: 'Pendente', cls: 'badge-warning' },
      atrasado: { label: 'Atrasado', cls: 'badge-danger' },
    };
    const s = mapa[status] || mapa.pendente;
    return `<span class="badge ${s.cls}">${s.label}</span>`;
  }

  // ─── Exportar API ─────────────────────────────────────────────────────
  return {
    formatarMoeda, formatarData, formatarDataInput,
    hoje, estaAtrasado,
    toast, abrirModal, fecharModal, confirmar,
    renderDonut, renderBarras, renderSparkline, renderProgressBar, renderSaude,
    skeleton, badgeStatus,
  };
})();
