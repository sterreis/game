/* ═══════════════════════════════════════════════════════════
   fases/final.js — FASE FINAL: TORRE DE CONTAS A RECEBER
   Responsabilidade: cenas, diálogos, batalha final e
   múltiplos finais da narrativa.

   Depende de:
     - estado.js          (G, B, filas, cenaAtual)
     - systems/sprites.js (mostrarSprites, falarSprite, semFoco, trocarFundo)
     - systems/dialogo.js (fala, narrador)
     - systems/escolhas.js (mostrarEscolhas)
     - systems/hud.js     (atualizarHUD, atualizarInv)
     - systems/batalha.js (iniciarBatalha, ativarBerserker, renderAcoesBatalha)
     - data/inimigos.js   (INIMIGOS)
═══════════════════════════════════════════════════════════ */

/* ==========================
   MONTAGEM DA FASE FINAL
========================== */

/**
 * montagemFinal — ponto de entrada da Fase Final.
 * Configura o estado, registra a fila de cenas e executa a primeira.
 */
function montagemFinal() {
  cenaAtual = 0;
  G.fase          = 'Ritual de Glozium';
  G._salsiRaptado = false;
  G._salsiMorreu  = false;

  atualizarHUD();
  trocarFundo('torre.png');

  // Registra a fila desta fase para o sistema de navegação
  filas['Ritual de Glozium'] = cenasFinal;

  // Inicia na primeira cena
  cenasFinal[0]();

  // Música da fase final
  tocarMusica('assets/audio/final.mp3');
}

const cenasFinal = [
  // Cena 0 — escalada da torre
  () => {
    mostrarSprites('sp-hotdog');
    semFoco();
    narrador('Hot Dog sente que no topo da Torre de Contas a Receber reside Glozium. É uma habilidade dos Analyticaes di Glosium. Para evitar os andares, ele escala por fora e entra por uma janela do topo.');
  },

  // Cena 1 — gárgulas captchas (ou pula se tem Espada ZG)
  () => {
    if (G.itens.includes('Espada ZG')) {
      entradaSalaDoChefe();
    } else {
      semFoco();
      narrador('Glozium melhorou o sistema de segurança da torre com "Gárgulas Captchas". Elas atacam o herói na escalada!');
      document.getElementById('dialogo-box').onclick = () => {
        document.getElementById('dialogo-box').onclick = avancar;
        batalhaGargulasCaptchas();
      };
    }
  },
];

/* ==========================
   GÁRGULAS CAPTCHAS (PAR OU ÍMPAR)
========================== */

/**
 * batalhaGargulasCaptchas — apresenta o desafio de par ou ímpar.
 */
function batalhaGargulasCaptchas() {
  semFoco();
  fala('', 'As Gárgulas Captchas bloqueiam sua passagem! Escolha: Par ou Ímpar?', 'narrador');
  setTimeout(() => {
    mostrarEscolhas([
      { texto: 'Par',   fn: () => resolverCaptcha('par')   },
      { texto: 'Impar', fn: () => resolverCaptcha('impar') },
    ]);
  }, 500);
}

/**
 * resolverCaptcha — sorteia o resultado e aplica consequências.
 * Se errar, Salsichinha é raptado.
 */
function resolverCaptcha(escolha) {
  const sorteio = Math.floor(Math.random() * 10) + 1;
  const ehPar   = sorteio % 2 === 0;
  const acertou = (escolha === 'par' && ehPar) || (escolha === 'impar' && !ehPar);

  mostrarSprites('sp-hotdog');
  semFoco();

  if (acertou) {
    narrador(`O número sorteado foi ${sorteio} — você acertou! As Captchas são quebradas pela aura do herói. Salsichinha late de orgulho.`);
  } else {
    G._salsiRaptado = true;
    narrador(`O número sorteado foi ${sorteio} — você errou! As Gárgulas agarram Salsichinha e somem nas sombras da torre. Hot Dog segue sozinho, com o coração apertado.`);
  }

  document.getElementById('dialogo-box').onclick = () => {
    document.getElementById('dialogo-box').onclick = avancar;
    entradaSalaDoChefe();
  };
}

/* ==========================
   ENTRADA NA SALA DO CHEFE
========================== */

/**
 * entradaSalaDoChefe — troca fundo e exibe Hot Dog confrontando Glozium.
 */
function entradaSalaDoChefe() {
  trocarFundo('tronohaha.png');
  mostrarSprites('sp-hotdog', 'sp-boss');
  semFoco();
  narrador('Hot Dog entra na sala do chefe e se depara com a presença arrepiante de Glozium sentado no trono.');
  document.getElementById('dialogo-box').onclick = () => {
    document.getElementById('dialogo-box').onclick = avancar;
    dialogoPreBatalha();
  };
}

/* ==========================
   DIÁLOGO PRÉ-BATALHA
========================== */

/**
 * dialogoPreBatalha — oferece opção de assistir ou pular o diálogo.
 */
function dialogoPreBatalha() {
  semFoco();
  fala('', 'Assistir ao diálogo ou pular direto para a batalha?', 'narrador');
  setTimeout(() => {
    mostrarEscolhas([
      { texto: 'Assistir ao diálogo',         fn: dialogoCena1        },
      { texto: 'Pular direto para a batalha', fn: escolhaBatalhaFinal },
    ]);
  }, 500);
}

// Sequência de diálogo entre Hot Dog e Glozium (cenas 1–8)
function dialogoCena1() {
  mostrarSprites('sp-hotdog', 'sp-boss');
  falarSprite('sp-boss');
  fala('GLOZIUM', 'Novamente um rato invadiu meu recinto. Desta vez irá servir de alimento para meus escravos.', 'glozium');
  document.getElementById('dialogo-box').onclick = () => { document.getElementById('dialogo-box').onclick = avancar; dialogoCena2(); };
}

function dialogoCena2() {
  falarSprite('sp-hotdog');
  fala('HOT DOG', 'Você é como meu pai descreveu. Não cansa de ser terrivelmente molestado por gerações?', 'hotdog');
  document.getElementById('dialogo-box').onclick = () => { document.getElementById('dialogo-box').onclick = avancar; dialogoCena3(); };
}

function dialogoCena3() {
  falarSprite('sp-boss');
  fala('GLOZIUM', 'Ha ha ha ha! Que petulante. Chegou a época, mas mandaram outro pobre coitado. Péssima ideia.', 'glozium');
  document.getElementById('dialogo-box').onclick = () => { document.getElementById('dialogo-box').onclick = avancar; dialogoCena4(); };
}

function dialogoCena4() {
  falarSprite('sp-hotdog');
  fala('HOT DOG', 'Vou te destruir, Glozium, e garantir sua aniquilação total e permanente. Já me diga onde está minha mãe!', 'hotdog');
  document.getElementById('dialogo-box').onclick = () => { document.getElementById('dialogo-box').onclick = avancar; dialogoCena5(); };
}

function dialogoCena5() {
  falarSprite('sp-boss');
  fala('GLOZIUM', 'E o que um garoto com cabeça de cachorro quente pode fazer contra um monstro milenar, que presenciou eventos tão singulares, que caminhou sobre a superfície de vulcões e subjugou a humanidade?', 'glozium');
  document.getElementById('dialogo-box').onclick = () => { document.getElementById('dialogo-box').onclick = avancar; dialogoCena6(); };
}

function dialogoCena6() {
  semFoco();
  narrador('Hot Dog lança sua espada girando no ar, ferindo o monstro. A espada retorna à sua mão.');
  document.getElementById('dialogo-box').onclick = () => { document.getElementById('dialogo-box').onclick = avancar; dialogoCena7(); };
}

function dialogoCena7() {
  falarSprite('sp-hotdog');
  fala('HOT DOG', 'Não subestime alguém com cabeça de cachorro quente. Sou um descendente dos Analyticaes di Glosium. Te procurei em cada canto do inferno para reduzir você a Zero e finalmente resgatar minha mãe!', 'hotdog');
  document.getElementById('dialogo-box').onclick = () => { document.getElementById('dialogo-box').onclick = avancar; dialogoCena8(); };
}

function dialogoCena8() {
  falarSprite('sp-boss');
  fala('GLOZIUM', 'Interessante. Aceito seu pedido de batalha. Me derrote e você poderá ver sua mãe.', 'glozium');
  document.getElementById('dialogo-box').onclick = () => { document.getElementById('dialogo-box').onclick = avancar; escolhaBatalhaFinal(); };
}

/* ==========================
   ESCOLHA E INÍCIO DA BATALHA FINAL
========================== */

/**
 * escolhaBatalhaFinal — exibe opções de item antes da batalha com Glozium.
 */
function escolhaBatalhaFinal() {
  semFoco();
  fala('', 'A batalha violenta começa. O que você usa?', 'narrador');
  setTimeout(() => {
    const opcoes = [
      {
        texto: 'Atacar com a Espada Simples',
        fn: () => { G.itemAtivo = 'Espada Simples'; G.salsiActive = false; atualizarInv(); _iniciarBatalhaFinal(); },
      },
    ];

    if (!G._salsiRaptado && G.itens.includes('Salsichinha')) {
      opcoes.push({
        texto: 'Atacar com Salsichinha junto (+1 dano)',
        fn: () => { G.itemAtivo = 'Espada Simples'; G.salsiActive = true; atualizarInv(); _iniciarBatalhaFinal(); },
      });
    }

    if (G.itens.includes('Guia de Atendimento')) {
      opcoes.push({
        texto: 'Usar Guia de Atendimento (2 sorteios)',
        fn: () => { G.itemAtivo = 'Guia de Atendimento'; G.salsiActive = false; atualizarInv(); _iniciarBatalhaFinal(); },
      });
    }

    if (G.itens.includes('Faturamentus')) {
      opcoes.push({
        texto: 'Usar Faturamentus (4 sorteios)',
        fn: () => { G.itemAtivo = 'Faturamentus'; G.salsiActive = false; atualizarInv(); _iniciarBatalhaFinal(); },
      });
    }

    mostrarEscolhas(opcoes);
  }, 500);
}

/**
 * _iniciarBatalhaFinal — monta a config e inicia a batalha com Glozium Final.
 * Adiciona threshold de 80% se Salsichinha foi raptado.
 */
function _iniciarBatalhaFinal() {
  const cfg = {
    nome:     INIMIGOS.GLOZIUM_FINAL.nome,
    vida:     INIMIGOS.GLOZIUM_FINAL.vida,
    numeros:  INIMIGOS.GLOZIUM_FINAL.numeros,
    aoVencer: _posVitoriaFinal,
    aoPerder: _finalDerrota,
  };

  if (G._salsiRaptado) {
    cfg.onThreshold = { porcentagem: 80, fn: _cenaThreshold80 };
  }

  iniciarBatalha(cfg);
}

/* ==========================
   THRESHOLD 80% — SALSICHINHA RAPTADO
========================== */

/**
 * _cenaThreshold80 — cena intermediária ativada quando Glozium
 * chega a 80% de dano. Oferece ao jogador desistir ou continuar
 * (com consequência narrativa se continuar).
 */
function _cenaThreshold80() {
  document.getElementById('painel-batalha').style.display = 'none';
  mostrarSprites('sp-hotdog', 'sp-boss');
  falarSprite('sp-boss');
  fala('GLOZIUM', 'Venham até mim, Gárgulas Captchas — e tragam o presentinho.', 'glozium');

  document.getElementById('dialogo-box').onclick = () => {
    document.getElementById('dialogo-box').onclick = avancar;
    falarSprite('sp-boss');
    fala('GLOZIUM', 'Melhor não se mover, herói. Desista de tudo, entregue a espada e seu companheiro viverá. Recuse e ele morrerá.', 'glozium');

    document.getElementById('dialogo-box').onclick = () => {
      document.getElementById('dialogo-box').onclick = avancar;
      semFoco();
      fala('', 'O que você faz?', 'narrador');
      setTimeout(() => {
        mostrarEscolhas([
          { texto: 'Continuar a batalha — não vou desistir!', fn: _escolhaContinuar   },
          { texto: 'Desistir e salvar Salsichinha',           fn: _finalDesistencia   },
        ]);
      }, 500);
    };
  };
}

/**
 * _escolhaContinuar — jogador decide continuar. Salsichinha morre,
 * ativando o Modo Berserker e retomando a batalha.
 */
function _escolhaContinuar() {
  G._salsiMorreu = true;
  mostrarSprites('sp-hotdog', 'sp-boss');
  semFoco();
  narrador('Glozium mata Salsichinha diante dos olhos do herói. Um silêncio pesado toma a sala.');

  document.getElementById('dialogo-box').onclick = () => {
    document.getElementById('dialogo-box').onclick = avancar;
    falarSprite('sp-hotdog');
    fala('HOT DOG', '...', 'hotdog');

    document.getElementById('dialogo-box').onclick = () => {
      document.getElementById('dialogo-box').onclick = avancar;
      semFoco();
      narrador('Algo dentro de Hot Dog se rompe. Uma fúria incontrolável desperta seu verdadeiro poder. Modo Berserker ativado. Poder de ataque 3x. +50 de vida.');

      document.getElementById('dialogo-box').onclick = () => {
        document.getElementById('dialogo-box').onclick = avancar;
        // Retoma a batalha com Modo Berserker
        B.encerrada = false;
        ativarBerserker();
        document.getElementById('painel-batalha').style.display = 'flex';
        renderAcoesBatalha();
      };
    };
  };
}

/* ==========================
   PÓS-VITÓRIA
========================== */

/**
 * _posVitoriaFinal — sequência narrativa após derrotar Glozium.
 * Revela a identidade de Glozium e encaminha para o final adequado.
 */
function _posVitoriaFinal() {
  document.getElementById('painel-batalha').style.display = 'none';
  mostrarSprites('sp-hotdog', 'sp-boss');
  semFoco();
  narrador('Hot Dog golpeia Glozium no peito. O monstro sorri em agonia.');

  document.getElementById('dialogo-box').onclick = () => {
    document.getElementById('dialogo-box').onclick = avancar;
    falarSprite('sp-boss');
    fala('GLOZIUM', 'Você conseguiu... vou cumprir minha promessa. Aqui está sua mãe. Aproveite seus últimos momentos... hahaha!', 'glozium');

    document.getElementById('dialogo-box').onclick = () => {
      document.getElementById('dialogo-box').onclick = avancar;
      semFoco();
      narrador('O corpo de Glozium se desfigura, revelando ser a mãe de Hot Dog, possuída pelos poderes sombrios.');

      document.getElementById('dialogo-box').onclick = () => {
        document.getElementById('dialogo-box').onclick = avancar;
        mostrarSprites('sp-hotdog', 'sp-sarsicha');
        falarSprite('sp-hotdog');
        fala('HOT DOG', 'Não pode ser... mãe? O que foi que eu fiz!', 'hotdog');

        document.getElementById('dialogo-box').onclick = () => {
          document.getElementById('dialogo-box').onclick = avancar;
          semFoco();
          narrador('Hot Dog segura a mãe nos braços, com a espada ainda em seu peito.');

          document.getElementById('dialogo-box').onclick = () => {
            document.getElementById('dialogo-box').onclick = avancar;
            falarSprite('sp-sarsicha');
            fala('MÃE', 'Você apenas cumpriu seu dever, filho...', 'mae');

            document.getElementById('dialogo-box').onclick = () => {
              document.getElementById('dialogo-box').onclick = avancar;
              // Seleciona o final com base nos flags acumulados
              if (G.itens.includes('Espada ZG')) {
                _finalA();
              } else if (G._salsiMorreu) {
                _finalB();
              } else {
                _finalC();
              }
            };
          };
        };
      };
    };
  };
}

/* ==========================
   FINAIS
========================== */

/**
 * _finalA — True Ending. Disponível somente com a Espada ZG.
 * Mãe de Hot Dog é curada. Final feliz.
 */
function _finalA() {
  semFoco();
  mostrarSprites('sp-hotdog', 'sp-sarsicha');
  narrador('Quando a esperança parecia ter se esgotado, a Espada ZG manifestou seu poder milagroso, acumulado durante todo o ciclo Hospitales. Esse poder fundiu-se à mãe de Hot Dog, curando-a por completo. A espada, enfim, havia cumprido sua missão.');

  document.getElementById('dialogo-box').onclick = () => {
    document.getElementById('dialogo-box').onclick = avancar;
    narrador('O herói derrotou Glozium e a paz retornou ao mundo. Ele viverá feliz com sua família.');

    document.getElementById('dialogo-box').onclick = () => {
      document.getElementById('dialogo-box').onclick = avancar;
      narrador('Muito obrigado, herói!');

      document.getElementById('dialogo-box').onclick = () => {
        document.getElementById('dialogo-box').onclick = avancar;
        _telaFimDeJogo('FINAL A — TRUE ENDING', 'gold', 'Glozium foi derrotado. A mãe de Hot Dog foi salva. O mundo seguirá em paz.', 'JOGAR NOVAMENTE');
      };
    };
  };
}

/**
 * _finalB — Salsichinha morreu. Mãe morre. Hot Dog se joga da torre.
 * Exibe epílogo de Salsichinha antes do fim de jogo.
 */
function _finalB() {
  semFoco();
  mostrarSprites('sp-hotdog');
  narrador('A mãe de Hot Dog falece. O herói a repousa gentilmente no chão e se levanta.');

  document.getElementById('dialogo-box').onclick = () => {
    document.getElementById('dialogo-box').onclick = avancar;
    narrador('O silêncio preenche a sala. Glozium foi detido por mais um ano, mas a que custo?');

    document.getElementById('dialogo-box').onclick = () => {
      document.getElementById('dialogo-box').onclick = avancar;
      narrador('Sob forte pressão mental pelas perdas, e com o sangue da mãe nas mãos, o herói, em profunda tristeza e decepção, caminha silenciosamente até a janela.');

      document.getElementById('dialogo-box').onclick = () => {
        document.getElementById('dialogo-box').onclick = avancar;
        narrador('...e se joga da torre.');

        document.getElementById('dialogo-box').onclick = () => {
          _exibirEpilogoComFim(
            `Salsichinha. O leal mascote de Hot Dog, companheiro inseparável em sua jornada.\n\nQuando filhote, um monstro de Glozium atacou sua ninhada. Teve sua mandíbula quebrada e uma perna triturada. Foi Hot Dog quem o encontrou e sua mãe, uma legítima Hospitalience, usou sua magia para curá-lo.\n\nEle e Hot Dog partiram juntos contra Glozium. Nunca hesitou. Nunca recuou.\n\nMorreu como viveu, ao lado do seu herói.\n\nGlozium foi derrotado ao custo mais alto possível. O mundo seguirá normalmente por mais 1 ano. Fim de Jogo.`
          );
        };
      };
    };
  };
}

/**
 * _finalC — Salsichinha sobreviveu. Mãe morre. Hot Dog se joga da torre.
 * Exibe epílogo de Salsichinha antes do fim de jogo.
 */
function _finalC() {
  semFoco();
  mostrarSprites('sp-hotdog');
  narrador('A mãe de Hot Dog falece. O herói a repousa gentilmente no chão.');

  document.getElementById('dialogo-box').onclick = () => {
    document.getElementById('dialogo-box').onclick = avancar;
    narrador('Glozium foi detido. Mas sem a Espada ZG, o preço foi a própria mãe. O silêncio é ensurdecedor.');

    document.getElementById('dialogo-box').onclick = () => {
      document.getElementById('dialogo-box').onclick = avancar;
      narrador('Hot Dog caminha até a janela. Lá embaixo, Salsichinha late — não entende o que está prestes a acontecer.');

      document.getElementById('dialogo-box').onclick = () => {
        document.getElementById('dialogo-box').onclick = avancar;
        narrador('...e se joga da torre.');

        document.getElementById('dialogo-box').onclick = () => {
          _exibirEpilogoComFim(
            `Salsichinha não entendeu o que aconteceu naquele dia.\n\nFicou na base da torre. Esperando. Farejando o ar na esperança de reconhecer aquele cheiro familiar.\n\nOs dias passaram. Hot Dog não voltou.\n\nEventualmente, os ferreiros de Zerum Glozium o encontraram, magro, quieto, com o olhar perdido no horizonte. O levaram consigo. Cuidaram dele.\n\nSalsichinha viveu seus dias entre aqueles que forjam as armas dos heróis. Nunca soube que esteve em cada batalha. Nunca soube que o mundo seguia em pé por causa dele.\n\nGlozium foi derrotado ao custo mais alto possível. O mundo seguirá normalmente por mais 1 ano.\n\nFim de Jogo.`
          );
        };
      };
    };
  };
}

/**
 * _exibirEpilogoComFim — exibe o texto do epílogo letra a letra
 * na tela de intro e, ao clicar em continuar, vai para o fim de jogo.
 * Compartilhado pelos Finais B e C.
 *
 * @param {string} texto - Texto do epílogo a ser digitado
 */
function _exibirEpilogoComFim(texto) {
  document.getElementById('screen-game').style.display  = 'none';
  document.getElementById('dialogo-box').onclick = null;

  const screenIntro = document.getElementById('screen-intro');
  const elTexto     = document.getElementById('intro-texto');
  const elPular     = document.getElementById('btn-pular');

  elTexto.textContent         = '';
  elPular.textContent         = 'CONTINUAR';
  elPular.style.display       = 'block';
  elPular.style.pointerEvents = 'auto';
  elPular.onclick = () => {
    _telaFimDeJogo('FIM DE JOGO', 'gold', 'Glozium foi derrotado ao custo mais alto possível. O mundo seguirá normalmente por mais 1 ano.', 'JOGAR NOVAMENTE');
  };
  screenIntro.style.display = 'flex';

  let i = 0;
  (function digitar() {
    if (i < texto.length) {
      elTexto.textContent += texto[i++];
      setTimeout(digitar, 45);
    }
  })();
}

/**
 * _finalDesistencia — jogador escolhe salvar Salsichinha.
 * Glozium destrói o mundo.
 */
function _finalDesistencia() {
  mostrarSprites('sp-hotdog', 'sp-boss');
  falarSprite('sp-boss');
  fala('GLOZIUM', 'Sábio. Agora se retirem — e assistam ao fim do mundo de camarote.', 'glozium');

  document.getElementById('dialogo-box').onclick = () => {
    document.getElementById('dialogo-box').onclick = avancar;
    semFoco();
    narrador('Glozium liberta o herói e o mascote. Eles sobrevivem, mas desonrados. Glozium destrói o mundo.');

    document.getElementById('dialogo-box').onclick = () => {
      document.getElementById('dialogo-box').onclick = avancar;
      _telaFimDeJogo('FIM DE JOGO', 'red', 'Você escolheu a vida de Salsichinha. O mundo foi destruído por Glozium. Uma fatalidade terrível.', 'JOGAR NOVAMENTE');
    };
  };
}

/**
 * _finalDerrota — jogador perde a batalha final.
 */
function _finalDerrota() {
  mostrarSprites('sp-boss');
  falarSprite('sp-boss');
  fala('GLOZIUM', 'Finalmente! Um herói bosta que apenas aumentou meus poderes.', 'glozium');

  document.getElementById('dialogo-box').onclick = () => {
    document.getElementById('dialogo-box').onclick = avancar;
    semFoco();
    narrador('O mundo foi destruído por Glozium. Uma fatalidade terrível... Fim de jogo.');

    document.getElementById('dialogo-box').onclick = () => {
      document.getElementById('dialogo-box').onclick = avancar;
      _telaFimDeJogo('DERROTA', 'red', 'Glozium destruiu o mundo. Você não era o herói desta vez.', 'TENTAR NOVAMENTE');
    };
  };
}

/* ==========================
   TELA DE FIM DE JOGO
========================== */

/**
 * _telaFimDeJogo — exibe a tela final com partículas, título,
 * mensagem e botão de reinício.
 *
 * @param {string} titulo   - Título principal (ex.: 'FINAL A — TRUE ENDING')
 * @param {string} classe   - Classe de cor: 'gold' ou 'red'
 * @param {string} mensagem - Texto descritivo do resultado
 * @param {string} botao    - Rótulo do botão de reinício
 */
function _telaFimDeJogo(titulo, classe, mensagem, botao) {
  ['screen-game', 'screen-title', 'screen-intro', 'screen-fase'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });

  const tela = document.getElementById('screen-fim');
  tela.innerHTML = `
    <canvas id="particles-canvas-fim"></canvas>
    <div class="title-scanlines"></div>
    <h1 class="fim-titulo fim-titulo--${classe}">${titulo}</h1>
    <p>${mensagem}</p>
    <button class="btn-px fim-btn--${classe}" onclick="location.reload()">${botao}</button>
  `;
  tela.style.display = 'flex';

  // Inicia partículas na tela de fim de jogo
  const canvas = document.getElementById('particles-canvas-fim');
  canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;';
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext('2d');
  const particulas = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.4,
    s: Math.random() * 0.4 + 0.2,
    o: Math.random() * 0.5 + 0.2,
  }));

  (function desenhar() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particulas.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(240,192,64,${p.o})`;
      ctx.fill();
      p.y += p.s;
      if (p.y > canvas.height) { p.y = 0; p.x = Math.random() * canvas.width; }
    });
    requestAnimationFrame(desenhar);
  })();
}
