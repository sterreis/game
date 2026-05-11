/* ═══════════════════════════════════════════════════════════
   data/cores.js — PALETA DE CORES DOS PERSONAGENS
   Responsabilidade: mapeamento de identificadores de
   personagem para suas cores de nome no diálogo.
   Não possui dependências.
═══════════════════════════════════════════════════════════ */

// ===================================== CORES =====================================

/**
 * CORES_PERSONAGENS
 * Chave: identificador interno do personagem (usado em fala())
 * Valor: cor CSS aplicada ao nome na caixa de diálogo
 */
const CORES_PERSONAGENS = {
  hotdog:     '#f0c040',   // dourado  — o protagonista
  sandubinha: '#6090cc',   // azul     — o pai (voz telepática)
  anti:       '#cc3322',   // vermelho — inimigos gerais
  narrador:   '#7a6a5a',   // cinza    — narrador / sem fala
  filho:      '#44cc66',   // verde    — filho de Processus
  glozium:    '#9b30ff',   // roxo     — o vilão final
  mae:        '#ff69b4',   // rosa     — mãe de Hot Dog (possuída)
  anciao:     '#d4a017',   // âmbar    — ancião / vozes do passado
};