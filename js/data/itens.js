/* ═══════════════════════════════════════════════════════════
   data/itens.js — DADOS ESTÁTICOS DOS ITENS
   Responsabilidade: definições imutáveis de todos os itens
   do jogo (descrição, quantidade de sorteios, efeitos).
   Não possui dependências.
═══════════════════════════════════════════════════════════ */

// ===================================== ITENS =====================================

/**
 * ITENS_INFO
 * Catálogo completo de itens disponíveis no jogo.
 * Cada entrada contém:
 *   - desc    : descrição exibida no tooltip do inventário
 *   - numeros : quantos números o item sorteia por rodada de batalha
 */
const ITENS_INFO = {
 
  'Espada Simples': {
    desc:    'Espada comum forjada pelos Zerum Glozium. Sorteia 1 número por rodada.',
    numeros: 1,
  },
 
  'Salsichinha': {
    desc:    '+1 de dano quando o ataque acertar. Ative junto com outro item.',
    numeros: 0,
  },
 
  'Estilingue Mágico': {
    desc:    'Presente do pai de Hot Dog. Sorteia 50% da vida do inimigo em números extras. Se acertar o número secreto, o inimigo fica atordoado e perde a próxima rodada. Só pode ser usado vez sim, vez não (recarrega 1 rodada).',
    numeros: 0,
  },
 
  'Guia de Atendimento': {
    desc:    'Pergaminho sagrado. Sorteia 2 números por rodada. Dano acumula por aparição do número secreto.',
    numeros: 2,
  },
 
  'Faturamentus': {
    desc:    'Placa de pedra. Sorteia 4 números por rodada. Se errar, inimigo ganha +2 no próximo ataque.',
    numeros: 4,
  },
 
  'Send Pearl': {
    desc:    'Teleporta direto para Glozium. Custa 3 de vida ao usar.',
    numeros: 0,
  },
 
};
