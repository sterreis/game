/* ═══════════════════════════════════════════════════════════
   estado.js — ESTADO GLOBAL DO JOGO
   Responsabilidade: armazenar e expor o estado mutável do
   jogador (G) e o estado temporário de batalha (B).
   Todos os outros módulos leem/escrevem G e B diretamente.

   Depende de: data/itens.js (para o item inicial)
═══════════════════════════════════════════════════════════ */

// ===================================== ESTADO DO JOGADOR =====================================

/**
 * G — Estado global persistente do jogador.
 * Alterado pelos sistemas durante toda a jornada.
 */
const G = {
  vida:        5,
  vidaMax:     5,
  itens:       ['Espada Simples', 'Salsichinha', 'Send Pearl', 'Estilingue Mágico'],
  fase:        'Prologo',
  itemAtivo:   'Espada Simples',
  salsiActive: false,
};

// ===================================== ESTADO DE BATALHA =====================================

/**
 * B — Estado temporário de uma batalha em andamento.
 * Inicializado por iniciarBatalha() e zerado ao terminar.
 */
let B = {};

// ===================================== ESTADO DE CENAS =====================================

/**
 * cenaAtual — índice da cena sendo executada na fase corrente.
 * Incrementado por avancar() a cada clique do jogador.
 */
let cenaAtual = 0;

/**
 * filas — mapa de fase → array de funções de cena.
 * Cada fase registra sua fila aqui para que avancar()
 * saiba qual cena chamar a seguir.
 *
 * Exemplo:
 *   filas['Floresta do Atendimentus'] = cenasFase1;
 */
const filas = {};

let musicaAtual = null;
let musicaSrcAtual = null;

function tocarMusica(src, volume = 0.02) {
  // Evita recriar a mesma música na mesma fase
  if (musicaSrcAtual === src) return;

  // Salva música atual
  musicaSrcAtual = src;

  if (musicaAtual) {
    const antiga = musicaAtual;
    musicaAtual = null;
    antiga.pause();
    antiga.currentTime = 0;
  }

  // Cria nova instância
  const nova = new Audio(src);
  nova.loop   = true;
  nova.volume = volume;
  musicaAtual = nova;

  // Toca música 
  setTimeout(() => {
    nova.play().catch(err => console.log('Erro ao tocar música:', err));
  }, 100);
}
function pararMusica() {
    if (musicaAtual) {
        musicaAtual.pause();
        musicaAtual.currentTime = 0;

        musicaAtual = null;
        musicaSrcAtual = null;
    }
}
