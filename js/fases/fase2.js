/* ═══════════════════════════════════════════════════════════
   fases/fase2.js — FASE 2: CAVERNAS DE FATURAMENTUS
   Responsabilidade: cenas, diálogos e narrativa da Fase 2.

   Depende de:
     - estado.js              (G, filas, cenaAtual)
     - systems/sprites.js     (mostrarSprites, falarSprite, semFoco, trocarFundo)
     - systems/dialogo.js     (fala, narrador)
     - systems/escolhas.js    (mostrarEscolhas)
     - systems/hud.js         (atualizarHUD, atualizarInv)
     - systems/batalha.js     (iniciarBatalha)
     - data/inimigos.js       (INIMIGOS)
═══════════════════════════════════════════════════════════ */

// ===================================== FASE 2 =====================================

/**
 * montagemFase2 — ponto de entrada da Fase 2.
 * Configura o estado, registra a fila de cenas e executa a primeira.
 */
function montagemFase2() {
  cenaAtual = 0;
  G.fase    = 'Cavernas de Faturamentus';
  G._bonusGlozium = 0; // reinicia bônus de vida do Glozium

  atualizarHUD();
  trocarFundo('caverna.png');

  // Registra a fila desta fase para o sistema de navegação
  filas['Cavernas de Faturamentus'] = cenasFase2;

  // Inicia na primeira cena
  cenasFase2[0]();

  // Música da fase 2
  tocarMusica('assets/audio/caverna.mp3');
}

// ── Fila de Cenas da Fase 2 ───────────────────────────────

const cenasFase2 = [

  // Cena 0 — texto de abertura da fase
  () => {
    mostrarSprites('sp-hotdog');
    semFoco();
    narrador('Existe sempre um preço a se pagar pela cura do corpo e da alma. Após a floresta do Atendimentus, seu preço é calculado de acordo com o tipo de contrato divino que você tem...');
  },

  // Cena 1 — ambientação da caverna
  () => {
    semFoco();
    narrador('Avançando pela caverna, iluminada apenas pelo brilho de sua tocha, Hot Dog distinguiu ruídos metálicos distantes.');
  },

  // Cena 2 — chegada na clareira das portas
  () => {
    trocarFundo('porta.png');
    semFoco();
    narrador('Ao chegar a uma clareira banhada pela luz emanada por minérios incomuns, ele se deparou com três passagens e um enigma que continha a chave para a escolha correta.');
  },

  // Cena 3 — o enigma
  () => {
    semFoco();
    fala('', 'Do enfermo vem o início, do registro o meio, do pagamento o fim do anseio. Gira sem parar nos salões do curar — que ciclo é esse a sustentar?', 'narrador');
  },

  // Cena 4 — escolha das portas
  () => {
    semFoco();
    fala('', 'Qual passagem você segue?', 'narrador');

    setTimeout(() => {
      const opcoes = [
        { texto: 'A) O Ciclum Receitatus Hospitalis', fn: portaA },
        { texto: 'B) O Rito dos Curandeiros Eternos',  fn: portaB },
        { texto: 'C) A Roda da Vida e da Cura',        fn: portaC },
      ];

      // Porta secreta — só aparece se Salsichinha estiver ativo
      if (G.itens.includes('Salsichinha') && G.itemAtivo === 'Salsichinha') {
        opcoes.push({
          texto: '[SALSICHINHA] Seguir o instinto do cão',
          fn: passagemSecreta,
        });
      }

      mostrarEscolhas(opcoes);
    }, 500);
  },
];

// ── Portas ────────────────────────────────────────────────

/**
 * portaA — resposta correta.
 * Segue direto para o encontro com Glozium.
 */
function portaA() {
  trocarFundo('caverna.png');
  mostrarSprites('sp-hotdog');
  semFoco();
  narrador('Porta A. O caminho se abre sem resistência. Salsichinha assentiu com a cabeça. Escolha certa.');

  document.getElementById('dialogo-box').onclick = () => {
    document.getElementById('dialogo-box').onclick = avancar;
    encontroGlozium();
  };
}

/**
 * portaB — resposta errada.
 * Jogador sofre 3 de dano e segue para Glozium.
 */
function portaB() {
  trocarFundo('caverna.png');
  mostrarSprites('sp-hotdog');
  semFoco();

  G.vida = Math.max(1, G.vida - 3);
  atualizarHUD();

  narrador('Porta B. Uma armadilha. Uma pedra cai do teto direto na cabeça. Dano: 3. Salsichinha fechou os olhos de vergonha.');

  document.getElementById('dialogo-box').onclick = () => {
    document.getElementById('dialogo-box').onclick = avancar;
    encontroGlozium();
  };
}

/**
 * portaC — resposta errada.
 * Glozium ganha +7 de vida e segue para o encontro.
 */
function portaC() {
  trocarFundo('caverna.png');
  mostrarSprites('sp-hotdog');
  semFoco();

  G._bonusGlozium += 7;

  narrador('Porta C. Errou feio. Lá nas profundezas da caverna, Glozium sentiu a energia e cresceu. +7 de vida pra ele.');

  document.getElementById('dialogo-box').onclick = () => {
    document.getElementById('dialogo-box').onclick = avancar;
    encontroGlozium();
  };
}

/**
 * passagemSecreta — Salsichinha encontra passagem oculta.
 * Jogador decide entrar no portal ou seguir a rota normal.
 */
function passagemSecreta() {
  trocarFundo('caverna.png');
  mostrarSprites('sp-hotdog');
  semFoco();
  narrador('Salsichinha cheirou uma pedra solta na parede. Empurrou. Abriu uma passagem com luz azulada lá dentro — um portal direto para a Torre de Transmissão.');

  document.getElementById('dialogo-box').onclick = () => {
    document.getElementById('dialogo-box').onclick = avancar;
    fala('', 'Você entra no portal ou segue a rota normal?', 'narrador');

    setTimeout(() => {
      mostrarEscolhas([
        {
          texto: 'Entrar no portal (ir direto para a Torre)',
          fn: () => {
            narrador('O portal absorve os dois sem dor. Em um segundo, estão na Torre de Transmissão. Glozium já estava lá, afiando a espada sem pressa.');
            document.getElementById('dialogo-box').onclick = () => {
              document.getElementById('dialogo-box').onclick = avancar;
              encontroGlozium();
            };
          },
        },
        { texto: 'Ignorar e seguir a caverna', fn: portaA },
      ]);
    }, 500);
  };
}

// ── Encontro com Glozium ───────────────────────────────────

/**
 * encontroGlozium — cenas de confronto antes da batalha final.
 */
function encontroGlozium() {
  mostrarSprites('sp-hotdog', 'sp-cavaleiro');
  document.getElementById('sp-cavaleiro').classList.remove('quieto', 'falando');
  document.getElementById('sp-hotdog').classList.remove('quieto', 'falando');
  semFoco();
  narrador('Os Anciões do Faturamento trabalham sem dar atenção aos arredores. E lá, no canto, afiando a espada — Glozium Administratus.');

  document.getElementById('dialogo-box').onclick = () => {
    document.getElementById('dialogo-box').onclick = avancar;

    falarSprite('sp-cavaleiro');
    fala('GLOZIUM ADMINISTRATUS', 'Você é o herói deste ano? Não me parece grande coisa. Não sou muito de conversa — venha lutar. Vou te fatiar e servir pros lacaios do meu mestre!', 'cavaleiro');

    document.getElementById('dialogo-box').onclick = () => {
      document.getElementById('dialogo-box').onclick = avancar;

      falarSprite('sp-hotdog');
      fala('HOT DOG', 'Algumas piadas ruins podem até me fazer rir. Você é uma dessas, hahaha... se prepare!', 'hotdog');

      document.getElementById('dialogo-box').onclick = () => {
        document.getElementById('dialogo-box').onclick = avancar;
        escolhaBatalhaGlozium();
      };
    };
  };
}

/**
 * escolhaBatalhaGlozium — exibe opções de item antes da batalha.
 */
function escolhaBatalhaGlozium() {
  semFoco();
  fala('', 'O que você usa na batalha?', 'narrador');

  setTimeout(() => {
    const vidaGlozium = INIMIGOS.GLOZIUM_ADMINISTRATUS.vida + (G._bonusGlozium || 0);

    const opcoes = [
      {
        texto: 'Atacar com a Espada Simples',
        fn: () => {
          G.itemAtivo   = 'Espada Simples';
          G.salsiActive = false;
          atualizarInv();
          iniciarBatalha({
            ...INIMIGOS.GLOZIUM_ADMINISTRATUS,
            vida:     vidaGlozium,
            aoVencer: posB_Fase2,
          });
        },
      },
      {
        texto: 'Atacar com Salsichinha junto (+1 dano)',
        fn: () => {
          G.itemAtivo   = 'Espada Simples';
          G.salsiActive = true;
          atualizarInv();
          iniciarBatalha({
            ...INIMIGOS.GLOZIUM_ADMINISTRATUS,
            vida:     vidaGlozium,
            aoVencer: posB_Fase2,
          });
        },
      },
    ];

    if (G.itens.includes('Guia de Atendimento')) {
      opcoes.push({
        texto: 'Usar Guia de Atendimento (2 sorteios)',
        fn: () => {
          G.itemAtivo   = 'Guia de Atendimento';
          G.salsiActive = false;
          atualizarInv();
          iniciarBatalha({
            ...INIMIGOS.GLOZIUM_ADMINISTRATUS,
            vida:     vidaGlozium,
            aoVencer: posB_Fase2,
          });
        },
      });
    }

    mostrarEscolhas(opcoes);
  }, 500);
}

// ── Pós-Batalha ────────────────────────────────────────────

/**
 * posB_Fase2 — executado após vitória na batalha da Fase 2.
 * Concede o artefato "Faturamentus", encerra a fase
 * e transiciona para a Fase Final.
 */
function posB_Fase2() {
  document.getElementById('painel-batalha').style.display = 'none';
  mostrarSprites('sp-hotdog');
  semFoco();

  fala('ANCIÃO FATURADOR', 'Muito obrigado, mas to ocupado demais para agradecimentos longos. Tome o artefato sagrado e siga em frente.', 'filho');

  if (!G.itens.includes('Faturamentus')) {
    G.itens.push('Faturamentus');
  }
  atualizarInv();

  document.getElementById('dialogo-box').onclick = () => {
    document.getElementById('dialogo-box').onclick = avancar;
    narrador('Fase 2 concluída. As Cavernas de Faturamentus ficam para trás. A Torre de Contas a Receber se ergue no horizonte...');

    // Transição para a Fase Final após o clique
    document.getElementById('dialogo-box').onclick = () => {
      document.getElementById('dialogo-box').onclick = avancar;
      mostrarTransicaoFase('FINAL', 'RITUAL DE GLOZIUM', montagemFinal);
    };
  };
}