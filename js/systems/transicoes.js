/* ═══════════════════════════════════════════════════════════
   systems/transicoes.js — TRANSIÇÕES, INTRO E PARTÍCULAS
   Responsabilidade: controlar as telas de título, intro
   (texto digitado), transição de fase e o efeito de
   partículas da tela de título.

   Depende de: (sem dependências diretas — usa o DOM)
═══════════════════════════════════════════════════════════ */

/* ==========================
   PARTÍCULAS
========================== */

/**
 * iniciarParticulas — cria e anima partículas douradas no canvas
 * da tela de título. Expõe window._stopParticulas() para
 * cancelar a animação ao sair da tela.
 */
function iniciarParticulas() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  // Gera 60 partículas com posição, raio, velocidade e opacidade aleatórios
  const particulas = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.4,  // raio
    s: Math.random() * 0.4 + 0.2,  // velocidade de queda
    o: Math.random() * 0.5 + 0.2,  // opacidade
  }));

  let raf; // referência do requestAnimationFrame para cancelamento

  function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particulas.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240,192,64,${p.o})`;
      ctx.fill();

      // Desce a partícula; reinicia no topo ao sair da tela
      p.y += p.s;
      if (p.y > canvas.height) {
        p.y = 0;
        p.x = Math.random() * canvas.width;
      }
    });

    raf = requestAnimationFrame(desenhar);
  }

  desenhar();

  // Expõe função de parada para ser chamada ao trocar de tela
  window._stopParticulas = () => {
    cancelAnimationFrame(raf);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
}

/* ==========================
   TEXTOS DA INTRO
========================== */

const INTRO_PASSADO =
`Passado... \n\nSurgindo de um ponto além do horizonte, com um ruído estrondoso que ecoou por montanhas, vales, rios e florestas... \n\nUma voz, semelhante a um trovão, atingiu a audição de todos no mundo: \n\n\"Contemplem seu novo mestre, Glozium... Demonstrativus potentiaaam!!\" \n\nO terror recaiu sobre as pessoas. O mundo foi tomado por uma neblina que provocou todo tipo de mazela. \nAlguns morreram, outros tornaram-se monstros, animais sofreram mutações.`;

const INTRO_AGORA =
`Agora... \n\nA província de Hospitalis é conhecida por seus médicos mágicos poderosos. \n\nA famosa Zerum Glozium é a principal Guilda do reino, seus ferreiros forjam armas para os guerreiros escolhidos, os Analyticaes di Glozium. \n\nPara diminuir o poder do monstro imortal Glozium, a província executa o grande ritual: Ciclum Receitatus Hospitalis. \n\nO guerreiro escolhido deve visitar quatro locais para obter os itens necessários ao ritual. E Hot Dog parte nessa jornada...`;

/* ==========================
   CONTROLE DA INTRO
========================== */

let introTimer = null;
let introIdx   = 0;
let introParte = 0;

/**
 * iniciarIntro — inicia a sequência de texto da introdução.
 */
function iniciarIntro() {
  introParte = 0;
  mostrarTextoIntro(INTRO_PASSADO);
}

/**
 * mostrarTextoIntro — digita o texto da intro letra a letra.
 * Ao terminar o PASSADO, faz fade e exibe o AGORA.
 * Ao terminar o AGORA, inicia o jogo.
 */
function mostrarTextoIntro(texto) {
  const el = document.getElementById('intro-texto');
  el.innerHTML = '';
  introIdx = 0;
  clearTimeout(introTimer);

  function loop() {
    if (introIdx < texto.length) {
      el.innerHTML += texto[introIdx] === '\n' ? '<br>' : texto[introIdx];
      introIdx++;
      introTimer = setTimeout(loop, 45);
    } else {
      if (introParte === 0) {
        // Terminou PASSADO — aguarda e transiciona para AGORA
        introParte = 1;
        setTimeout(fadeTrocaTexto, 2500);
      } else {
        // Terminou AGORA — inicia o jogo
        setTimeout(() => {
          document.getElementById('screen-intro').style.display = 'none';
          iniciarJogo();
        }, 2500);
      }
    }
  }

  loop();
}

/**
 * fadeTrocaTexto — faz fade out/in entre PASSADO e AGORA.
 */
function fadeTrocaTexto() {
  const el = document.getElementById('intro-texto');
  el.style.opacity = '0';
  setTimeout(() => {
    mostrarTextoIntro(INTRO_AGORA);
    el.style.opacity = '1';
  }, 1200);
}

/**
 * pularIntro — cancela a digitação e vai direto para o jogo.
 * Acionado pelo botão "PULAR INTRODUÇÃO".
 */
function pularIntro() {
  clearTimeout(introTimer);
  document.getElementById('screen-intro').style.display = 'none';
  iniciarJogo();
}

/* ==========================
   NAVEGAÇÃO DE TELAS
========================== */

/**
 * irParaIntro — oculta o título e exibe a tela de intro.
 * Para as partículas antes de trocar.
 */
function irParaIntro() {
  if (window._stopParticulas) window._stopParticulas();
  document.getElementById('screen-title').style.display = 'none';
  document.getElementById('screen-intro').style.display = 'flex';
  iniciarIntro();
}

/**
 * irParaTitulo — volta para a tela de título após a intro.
 * Reinicia as partículas.
 */
function irParaTitulo() {
  document.getElementById('screen-intro').style.display = 'none';
  document.getElementById('screen-title').style.display = 'flex';
  iniciarParticulas();
}

/* ==========================
   TRANSIÇÃO DE FASE
========================== */

/**
 * mostrarTransicaoFase — exibe a tela de transição com número
 * e nome da fase por 2.4 segundos, depois executa o callback.
 *
 * @param {string}   numero - Número da fase (ex.: 'I', 'II')
 * @param {string}   nome   - Nome da fase (ex.: 'FLORESTA DO ATENDIMENTUS')
 * @param {Function} cb     - Função executada após a transição
 */
function mostrarTransicaoFase(numero, nome, cb) {
  const sfase = document.getElementById('screen-fase');

  document.getElementById('screen-title').style.display = 'none';
  sfase.style.display = 'flex';
  document.getElementById('fase-nome-big').textContent = `FASE ${numero}`;
  document.getElementById('fase-sub-big').textContent  = nome;

  setTimeout(() => {
    sfase.style.display = 'none';
    cb();
  }, 2400);
}
