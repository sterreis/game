/* ═══════════════════════════════════════════════════════════
   systems/tutorial.js — PAINEL DE TUTORIAL
   Responsabilidade: exibir e ocultar o painel de instruções
   de batalha, acessível pelo botão "? COMO FUNCIONA".
═══════════════════════════════════════════════════════════ */

/* ==========================
   TUTORIAL
========================== */

/**
 * abrirTutorial — exibe o painel de instruções de batalha.
 */
function abrirTutorial() {
  document.getElementById('painel-tutorial').style.display = 'flex';
}

/**
 * fecharTutorial — fecha o painel de instruções.
 */
function fecharTutorial() {
  document.getElementById('painel-tutorial').style.display = 'none';
}
