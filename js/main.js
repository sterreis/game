/* ═══════════════════════════════════════════════════════════
   main.js — PONTO DE ENTRADA E FLUXO PRINCIPAL
   Responsabilidade: iniciar o jogo, controlar o fluxo entre
   telas (título → intro → transição → jogo) e expor as
   funções globais chamadas pelo HTML (desistir).

   Este arquivo NÃO contém lógica de sistemas ou cenas.
   Ele apenas orquestra a ordem de execução.

   Depende de: todos os outros módulos (carregados antes)
═══════════════════════════════════════════════════════════ */

// ===================================== INICIALIZAÇÃO =====================================

/**
 * window.onload — ponto de entrada da aplicação.
 * Exibe a tela de título e inicia as partículas decorativas.
 */
window.onload = () => {
  ['sp-hotdog','sp-anti','sp-cavaleiro','sp-boss','sp-sarsicha'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('oculto');
  });

  document.getElementById('screen-title').style.display = 'flex';
  iniciarParticulas();
};

// ===================================== FLUXO DO JOGO =====================================

function iniciarJogo() {
  if (window._stopParticulas) window._stopParticulas();

  mostrarTransicaoFase('I', 'FLORESTA DO ATENDIMENTUS', () => {
    const sgame = document.getElementById('screen-game');
    sgame.style.display = 'flex';
    sgame.classList.add('fadeIn');

    document.getElementById('hud').style.display               = 'flex';
    document.getElementById('inventario').style.display        = 'flex';
    document.getElementById('btn-desistir').style.display      = 'block';
    document.getElementById('btn-como-funciona').style.display = 'block';
    document.getElementById('dialogo-box').style.display       = 'block';
    document.getElementById('dialogo-box').onclick             = avancar;

    montagemFase1();
  });
}

// ===================================== SEND PEARL =====================================

/**
 * usarSendPearl — chamada ao clicar na Send Pearl no inventário.
 * Custa 3 de vida, remove o item e teleporta para a fase final.
 */
function usarSendPearl() {
  if (!G.itens.includes('Send Pearl')) return;

  G.vida  = Math.max(1, G.vida - 3);
  G.itens = G.itens.filter(i => i !== 'Send Pearl');
  atualizarHUD();

  document.getElementById('painel-batalha').style.display = 'none';
  document.getElementById('escolhas').style.display       = 'none';

  narrador('A Send Pearl pulsa com uma luz intensa. Em um piscar de olhos, Hot Dog é teleportado para o topo da Torre de Contas a Receber...');
  document.getElementById('dialogo-box').onclick = () => {
    document.getElementById('dialogo-box').onclick = avancar;
    montagemFinal();
  };
}

// ===================================== AÇÕES GLOBAIS =====================================

function desistir() {
  mostrarEscolhas([
    {
      texto: 'SIM, ABANDONAR A MISSÃO',
      fn: () => {
        mostrarSprites();
        semFoco();
        narrador('Hot Dog parou no meio do caminho. Salsichinha olhou pra ele com aquela cara. O mundo foi destruído por Glozium.');
        document.getElementById('dialogo-box').onclick = null;
        setTimeout(() => location.reload(), 3200);
      },
    },
    {
      texto: 'NÃO, CONTINUAR',
      fn: () => {
        document.getElementById('dialogo-box').onclick = avancar;
      },
    },
  ]);
}