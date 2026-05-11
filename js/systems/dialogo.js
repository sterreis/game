/* ═══════════════════════════════════════════════════════════
   systems/dialogo.js — SISTEMA DE DIÁLOGO
   Responsabilidade: exibir falas com efeito de digitação
   (typewriter), controlar o sprite falante e permitir
   pular o texto. Também expõe a função narrador() como
   atalho para textos sem personagem.

   Depende de:
     - data/cores.js      (CORES_PERSONAGENS)
     - systems/sprites.js (falarSprite, semFoco)
     - estado.js          (filas, cenaAtual — via avancar)
═══════════════════════════════════════════════════════════ */

/* ==========================
   DIÁLOGO
========================== */

// Controle interno do efeito de digitação
let digitando    = false;
let textoAtual   = '';
let timerDialogo = null;

// Mapeamento de personagem → sprite correspondente
const SPRITES_PERSONAGENS = {
  hotdog:     'sp-hotdog',
  sandubinha: 'sp-hotdog',
  anti:       'sp-anti',
  cavaleiro:  'sp-cavaleiro',
  glozium:    'sp-boss',
  mae:        'sp-sarsicha',
};

/**
 * fala — exibe uma fala com efeito de digitação na caixa de diálogo.
 * Colore o nome do personagem conforme CORES_PERSONAGENS.
 * Ativa o sprite correspondente ao personagem.
 *
 * @param {string} nome  - Nome exibido acima do texto (ex.: 'HOT DOG')
 * @param {string} texto - Conteúdo da fala a ser digitado
 * @param {string} quem  - Chave do personagem em CORES_PERSONAGENS
 *                         (ex.: 'hotdog', 'anti', 'narrador')
 */
function fala(nome, texto, quem) {
  const elNome  = document.getElementById('dialogo-nome');
  const elTexto = document.getElementById('dialogo-texto');

  // Aplica nome e cor do personagem
  elNome.textContent = nome || '';
  elNome.style.color = CORES_PERSONAGENS[quem] || '#e8dcc8';

  // Reinicia estado de digitação
  clearTimeout(timerDialogo);
  textoAtual = texto;
  elTexto.textContent = '';
  digitando = true;

  // Ativa sprite correto conforme o personagem
  const spriteId = SPRITES_PERSONAGENS[quem];
  if (spriteId) {
    falarSprite(spriteId);
  } else {
    semFoco();
  }

  // Efeito de digitação letra a letra
  let i = 0;
  (function loop() {
    if (i < texto.length) {
      elTexto.textContent = texto.slice(0, ++i);
      timerDialogo = setTimeout(loop, 20);
    } else {
      // Texto completo — adiciona cursor piscante
      elTexto.innerHTML = texto + '<span id="cursor-dialogo"></span>';
      digitando = false;
    }
  })();
}

/**
 * narrador — atalho para textos de narração sem personagem.
 * Remove o foco dos sprites e usa a cor de narrador.
 *
 * @param {string} texto - Texto de narração
 */
function narrador(texto) {
  semFoco();
  fala('', texto, 'narrador');
}

/**
 * pularTexto — exibe o texto completo imediatamente,
 * cancelando o timer de digitação.
 * Chamada quando o jogador clica durante a digitação.
 */
function pularTexto() {
  clearTimeout(timerDialogo);
  document.getElementById('dialogo-texto').innerHTML =
    textoAtual + '<span id="cursor-dialogo"></span>';
  digitando = false;
}

/* ==========================
   NAVEGAÇÃO DE CENAS
========================== */

/**
 * avancar — avança para a próxima cena da fase atual.
 * Se o texto ainda estiver digitando, pula para o fim.
 * Se houver escolhas abertas, aguarda a seleção do jogador.
 *
 * Registrado como onclick no #dialogo-box pelo main.js.
 */
function avancar() {
  // Texto ainda sendo digitado: exibe completo antes de avançar
  if (digitando) {
    pularTexto();
    return;
  }

  // Escolhas abertas: o clique no diálogo não deve interferir
  if (document.getElementById('escolhas').style.display === 'flex') return;

  cenaAtual++;
  const fila = filas[G.fase];
  if (fila && cenaAtual < fila.length) {
    fila[cenaAtual]();
  }
}
