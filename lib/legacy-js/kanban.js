/**
 * kanban.js — Quadro Kanban com drag & drop
 */

const Kanban = (() => {

  const COLUNAS = {
    todo: { label: 'A Fazer', cor: '#6366F1', icone: '📋' },
    doing: { label: 'Em Andamento', cor: '#F59E0B', icone: '⚡' },
    done: { label: 'Concluído', cor: '#10B981', icone: '✅' },
  };

  const CORES_CARD = ['#6366F1', '#EF4444', '#F59E0B', '#10B981', '#EC4899', '#06B6D4', '#8B5CF6', '#14B8A6'];

  let dragId = null;
  let dragColuna = null;

  function render() {
    const kanban = Storage.getKanban();
    const page = document.getElementById('page-kanban');

    page.innerHTML = `
      <div class="page-header">
        <div>
          <h1 class="page-title">Kanban de Anotações</h1>
          <p class="page-subtitle">Organize suas tarefas e notas financeiras</p>
        </div>
      </div>
      <div class="kanban-board" id="kanban-board">
        ${Object.entries(COLUNAS).map(([key, col]) => renderColuna(key, col, kanban[key] || [])).join('')}
      </div>
    `;

    bindEventos();
  }

  function renderColuna(key, col, cartoes) {
    return `
      <div class="kanban-col" data-coluna="${key}" id="col-${key}">
        <div class="kanban-col-header" style="border-top:3px solid ${col.cor}">
          <div class="kanban-col-title">
            <span>${col.icone}</span>
            <span>${col.label}</span>
            <span class="kanban-count" style="background:${col.cor}22;color:${col.cor}">${cartoes.length}</span>
          </div>
          <button class="btn-icon-sm" onclick="Kanban.novoCartao('${key}')" title="Adicionar cartão">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
          </button>
        </div>
        <div class="kanban-cards" data-coluna="${key}" id="cards-${key}">
          ${cartoes.map(c => renderCartao(c, key)).join('')}
          <div class="kanban-drop-zone" data-coluna="${key}"></div>
        </div>
      </div>
    `;
  }

  function renderCartao(cartao, coluna) {
    const cor = cartao.cor || '#6366F1';
    const data = cartao.criadoEm
      ? new Date(cartao.criadoEm).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
      : '';

    return `
      <div class="kanban-card" draggable="true"
        data-id="${cartao.id}" data-coluna="${coluna}"
        style="border-left:4px solid ${cor}">
        <div class="kanban-card-body">
          <div class="kanban-card-titulo">${escapeHtml(cartao.titulo)}</div>
          ${cartao.descricao ? `<div class="kanban-card-desc">${escapeHtml(cartao.descricao)}</div>` : ''}
        </div>
        <div class="kanban-card-footer">
          <span class="kanban-card-date">${data}</span>
          <div class="kanban-card-actions">
            <button class="btn-icon-xs" onclick="Kanban.editarCartao('${cartao.id}','${coluna}')" title="Editar">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
            <button class="btn-icon-xs btn-danger-xs" onclick="Kanban.excluirCartao('${cartao.id}','${coluna}')" title="Excluir">
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function escapeHtml(str) {
    return (str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  // ─── Formulário de cartão ─────────────────────────────────────────────
  function formCartao(dados = {}) {
    const paleta = CORES_CARD.map(cor => `
      <button type="button" class="color-btn ${dados.cor === cor ? 'active' : ''}"
        style="background:${cor}" data-cor="${cor}" onclick="Kanban.selecionarCor(this)"></button>
    `).join('');

    return `
      <div class="form-group">
        <label class="form-label">Título *</label>
        <input type="text" id="k-titulo" class="form-input" value="${escapeHtml(dados.titulo || '')}" placeholder="Título do cartão" maxlength="80">
      </div>
      <div class="form-group">
        <label class="form-label">Descrição</label>
        <textarea id="k-desc" class="form-textarea" rows="3" placeholder="Detalhes, observações...">${escapeHtml(dados.descricao || '')}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">Cor</label>
        <div class="color-palette" id="k-cor-selecionada" data-cor="${dados.cor || CORES_CARD[0]}">
          ${paleta}
        </div>
      </div>
    `;
  }

  function selecionarCor(btn) {
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const palette = btn.closest('.color-palette');
    if (palette) palette.dataset.cor = btn.dataset.cor;
  }

  async function novoCartao(coluna) {
    const resultado = await UI.abrirModal('Novo Cartão', formCartao(), {
      labelSalvar: 'Criar',
      onSalvar: () => {
        const titulo = document.getElementById('k-titulo').value.trim();
        if (!titulo) { UI.toast('Informe o título do cartão', 'warning'); return false; }
        const descricao = document.getElementById('k-desc').value.trim();
        const cor = document.getElementById('k-cor-selecionada')?.dataset.cor || CORES_CARD[0];
        return { titulo, descricao, cor };
      }
    });

    if (resultado) {
      Storage.adicionarCartao(coluna, { ...resultado, coluna });
      render();
      UI.toast('Cartão criado!', 'success');
    }
  }

  async function editarCartao(id, coluna) {
    const kanban = Storage.getKanban();
    const cartao = kanban[coluna]?.find(c => c.id === id);
    if (!cartao) return;

    const resultado = await UI.abrirModal('Editar Cartão', formCartao(cartao), {
      labelSalvar: 'Salvar',
      onSalvar: () => {
        const titulo = document.getElementById('k-titulo').value.trim();
        if (!titulo) { UI.toast('Informe o título', 'warning'); return false; }
        return {
          titulo,
          descricao: document.getElementById('k-desc').value.trim(),
          cor: document.getElementById('k-cor-selecionada')?.dataset.cor || cartao.cor,
        };
      }
    });

    if (resultado) {
      Storage.atualizarCartao(coluna, id, resultado);
      render();
      UI.toast('Cartão atualizado!', 'success');
    }
  }

  async function excluirCartao(id, coluna) {
    const ok = await UI.confirmar('Deseja excluir este cartão?', 'Excluir Cartão');
    if (ok) {
      Storage.removerCartao(coluna, id);
      render();
      UI.toast('Cartão removido.', 'info');
    }
  }

  // ─── Drag & Drop ─────────────────────────────────────────────────────
  function bindEventos() {
    document.querySelectorAll('.kanban-card').forEach(card => {
      card.addEventListener('dragstart', onDragStart);
      card.addEventListener('dragend', onDragEnd);
    });

    document.querySelectorAll('.kanban-cards').forEach(col => {
      col.addEventListener('dragover', onDragOver);
      col.addEventListener('dragleave', onDragLeave);
      col.addEventListener('drop', onDrop);
    });
  }

  function onDragStart(e) {
    dragId = e.currentTarget.dataset.id;
    dragColuna = e.currentTarget.dataset.coluna;
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
  }

  function onDragEnd(e) {
    e.currentTarget.classList.remove('dragging');
    document.querySelectorAll('.kanban-cards').forEach(c => c.classList.remove('drag-over'));
  }

  function onDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    e.currentTarget.classList.add('drag-over');
  }

  function onDragLeave(e) {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      e.currentTarget.classList.remove('drag-over');
    }
  }

  function onDrop(e) {
    e.preventDefault();
    const colunaDestino = e.currentTarget.dataset.coluna;
    e.currentTarget.classList.remove('drag-over');

    if (!dragId || !colunaDestino) return;

    // Calcular posição de inserção
    const cards = [...e.currentTarget.querySelectorAll('.kanban-card')];
    const mouseY = e.clientY;
    let indice = cards.length;

    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      if (mouseY < rect.top + rect.height / 2) {
        indice = i;
        break;
      }
    }

    if (dragColuna === colunaDestino) {
      // Reordenar dentro da mesma coluna
      const kanban = Storage.getKanban();
      const col = kanban[colunaDestino];
      const fromIdx = col.findIndex(c => c.id === dragId);
      if (fromIdx !== -1) {
        const [item] = col.splice(fromIdx, 1);
        col.splice(fromIdx < indice ? indice - 1 : indice, 0, item);
        Storage.setKanban(kanban);
      }
    } else {
      Storage.moverCartao(dragId, dragColuna, colunaDestino, indice);
    }

    dragId = null;
    dragColuna = null;
    render();
  }

  return { render, novoCartao, editarCartao, excluirCartao, selecionarCor };
})();
