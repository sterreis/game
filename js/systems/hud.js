/* ═══════════════════════════════════════════════════════════
   systems/hud.js — HUD E INVENTÁRIO
   Responsabilidade: sincronizar vida/fase no DOM e gerenciar
   o overlay de inventário com accordion por item.
═══════════════════════════════════════════════════════════ */

// ===================================== HUD =====================================

function atualizarHUD() {
  document.getElementById('hp-txt').textContent    = Math.max(0, G.vida);
  document.getElementById('maxhp-txt').textContent = G.vidaMax;
  document.getElementById('fase-txt').textContent  = G.fase;
 
  const porcentagem = Math.max(0, G.vida / G.vidaMax * 100);
  document.getElementById('hp-bar-fill').style.width = porcentagem + '%';
 
  atualizarInv();
}
 
// ===================================== INVENTÁRIO — PAINEL LATERAL =====================================
 
function atualizarInv() {
  const lista = document.getElementById('inv-lista');
 
  lista.innerHTML = G.itens.map(nomeItem => {
    let cor = '';
    if (nomeItem === 'Send Pearl')     cor = 'color:var(--blue)';
    else if (nomeItem === G.itemAtivo) cor = 'color:var(--gold)';
    return `<div class="inv-item-mini" style="${cor}">${nomeItem.toUpperCase()}</div>`;
  }).join('');
}
 
// ===================================== OVERLAY DO INVENTÁRIO =====================================
 
function abrirInventario() {
  const overlay = document.getElementById('overlay-inventario');
  overlay.innerHTML = '';
 
  const modal = document.createElement('div');
  modal.id = 'inv-modal';
 
  // Título sem acento
  const titulo = document.createElement('div');
  titulo.id          = 'inv-modal-titulo';
  titulo.textContent = 'INVENTARIO';
  modal.appendChild(titulo);
 
  // Itens
  const listaEl = document.createElement('div');
  listaEl.id = 'inv-modal-itens';
 
  G.itens.forEach(nomeItem => {
    const info        = ITENS_INFO[nomeItem] || { desc: 'Sem descricao.' };
    const isSendPearl = nomeItem === 'Send Pearl';
    const isEst       = nomeItem === 'Estilingue Magico';
 
    const item = document.createElement('div');
    item.className = 'inv-modal-item' +
      (isSendPearl ? ' send-pearl' : '') +
      (isEst       ? ' estilingue' : '');
 
    const nomeEl = document.createElement('div');
    nomeEl.className   = 'inv-modal-item-nome';
    nomeEl.textContent = nomeItem.toUpperCase();
 
    const descEl = document.createElement('div');
    descEl.className   = 'inv-modal-item-desc';
    descEl.textContent = info.desc;
    descEl.style.display = 'none'; 
 
    // Clique expande/recolhe a descrição
    nomeEl.onclick = () => {
      const jaAberto = descEl.style.display !== 'none';
 
      // Fecha todos (inclusive confirmações)
      document.querySelectorAll('.inv-modal-item-desc').forEach(d => d.style.display = 'none');
      document.querySelectorAll('.inv-modal-item-nome').forEach(n => n.classList.remove('aberto'));
      document.querySelectorAll('#inv-confirmacao').forEach(c => c.remove());
 
      // Abre este se estava fechado
      if (!jaAberto) {
        descEl.style.display = 'block';
        nomeEl.classList.add('aberto');
        if (isSendPearl) _renderConfirmacaoSendPearl(item, descEl, nomeEl);
      }
    };
 
    item.appendChild(nomeEl);
    item.appendChild(descEl);
    listaEl.appendChild(item);
  });
 
  modal.appendChild(listaEl);
 
  // Botão fechar
  const btnFechar = document.createElement('button');
  btnFechar.className   = 'btn-px ghost small';
  btnFechar.id          = 'inv-modal-fechar';
  btnFechar.textContent = 'FECHAR';
  btnFechar.onclick     = fecharInventario;
 
  const rodape = document.createElement('div');
  rodape.className = 'inv-modal-rodape';
  rodape.appendChild(btnFechar);
  modal.appendChild(rodape);
 
  overlay.appendChild(modal);
  overlay.classList.add('aberto');
}
 
function fecharInventario() {
  const overlay = document.getElementById('overlay-inventario');
  overlay.classList.remove('aberto');
  overlay.innerHTML = ''; // limpa tudo ao fechar — evita estado preso
}
 
// ── Confirmação Send Pearl (versão única, sem duplicata) ──
 
function _renderConfirmacaoSendPearl(itemEl, descEl, nomeEl) {
  const conf = document.createElement('div');
  conf.id = 'inv-confirmacao';
 
  conf.innerHTML = `
    <p>Este item vai te custar <strong style="color:var(--red)">3 de vida</strong> e teleportar direto para Glozium.<br>Voce tem certeza?</p>
    <div id="inv-confirmacao-btns">
      <button class="btn-px small" id="btn-confirmar-pearl">SIM, USAR</button>
      <button class="btn-px ghost small" id="btn-cancelar-pearl">NAO</button>
    </div>
  `;
 
  itemEl.appendChild(conf);
 
  document.getElementById('btn-confirmar-pearl').onclick = () => {
    fecharInventario();
    usarSendPearl();
  };
 
  document.getElementById('btn-cancelar-pearl').onclick = () => {
    conf.remove();
    descEl.style.display = 'none';
    nomeEl.classList.remove('aberto');
  };
}