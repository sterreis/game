/* ═══════════════════════════════════════════════════════════
   data/inimigos.js — DADOS ESTÁTICOS DOS INIMIGOS
   Responsabilidade: fichas de todos os inimigos do jogo
   (nome, vida, sorteios por rodada, sprite).
   Não possui dependências.
═══════════════════════════════════════════════════════════ */

// ===================================== INIMIGOS =====================================

/**
 * INIMIGOS
 * Catálogo de inimigos utilizados nas batalhas.
 * Cada entrada contém:
 *   - nome    : nome exibido no log de batalha e no HUD de batalha
 *   - vida    : pontos de vida iniciais do inimigo
 *   - numeros : quantos números o inimigo sorteia por rodada
 *   - sprite  : id do elemento <img> usado como sprite (opcional)
 */
const INIMIGOS = {
  ANTI_AUTHORIZATUS: {
    nome:    'ANTI-AUTHORIZATUS',
    vida:    4,
    numeros: 1,
    sprite:  'sp-anti',
  },

  GLOZIUM_ADMINISTRATUS: {
    nome:    'GLOZIUM ADMINISTRATUS',
    vida:    6,
    numeros: 2,
    sprite:  'sp-cavaleiro',
  },

  GLOZIUM_FINAL: {
    nome:    'GLOZIUM',
    vida:    100,
    numeros: 10,
    sprite:  'sp-glozium',
  },
};
