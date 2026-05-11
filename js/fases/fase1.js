/* ═══════════════════════════════════════════════════════════
   fases/fase1.js — FASE 1: FLORESTA DO ATENDIMENTUS
   Responsabilidade: todas as cenas, diálogos e narrativa
   da Fase 1. Chama os sistemas mas não contém lógica deles.
   Registra a fila de cenas em filas[] para o sistema de
   navegação de avancar().

   Depende de:
     - estado.js         (G, filas, cenaAtual)
     - systems/sprites.js (mostrarSprites, falarSprite, semFoco, trocarFundo)
     - systems/dialogo.js (fala, narrador)
     - systems/escolhas.js (mostrarEscolhas)
     - systems/hud.js    (atualizarHUD, atualizarInv)
     - systems/batalha.js (iniciarBatalha)
     - data/inimigos.js  (INIMIGOS)
═══════════════════════════════════════════════════════════ */

// ===================================== FASE 1 =====================================

/**
 * montagemFase1 — ponto de entrada da Fase 1.
 * Configura o estado, registra a fila de cenas e executa a primeira.
 */
function montagemFase1() {
  cenaAtual = 0;
  G.fase    = 'Floresta do Atendimentus';

  atualizarHUD();
  trocarFundo('floresta.png');

  // Registra a fila desta fase para o sistema de navegação
  filas['Floresta do Atendimentus'] = cenasFase1;

  // Inicia na primeira cena
  cenasFase1[0]();

  // Música da fase 1
  tocarMusica('assets/audio/jungle.mp3');
  }


// ── Fila de Cenas da Fase 1 ───────────────────────────────

/**
 * cenasFase1 — array de funções, uma por cena.
 * O índice corresponde à cenaAtual. avancar() incrementa
 * cenaAtual e chama a próxima função automaticamente.
 */
const cenasFase1 = [

  // Cena 0 — apresentação da floresta (narrador)
  () => {
    mostrarSprites('sp-hotdog');
    semFoco();
    narrador('Floresta do Atendimentus. Um lugar encantado — dizem que pessoas doentes ou com almas feridas podem ir à floresta para serem curadas.');
  },

  // Cena 1 — ambientação sombria (narrador)
  () => {
    semFoco();
    narrador('Mais ameaçadora do que nunca, a floresta envolve Hot Dog em paisagens escuras e enevoadas, enquanto ele se comunica telepaticamente com seu pai, Sandubinha.');
  },

  // Cena 2 — instrução do pai (Sandubinha fala)
  () => {
    falarSprite('sp-hotdog');
    fala('SANDUBINHA', 'Na floresta de Atendimentus, encontre o ser "Processus"... ele irá te mostrar o monstro a ser enfrentado.', 'sandubinha');
  },

  // Cena 3 — Hot Dog se perde, cachorro fareja algo (narrador)
  () => {
    semFoco();
    narrador('Porém Hot Dog se perde na floresta. De repente, seu cachorro fareja algo e começa a correr. O herói o segue pois confia totalmente em seu querido animal.');
  },

  // Cena 4 — corrida pela mata (narrador)
  () => {
    narrador('Atravessando a densa vegetação de espinhos que lhes feriam a pele, eles avançam rapidamente até alcançarem uma clareira, onde se deparam com uma visão aterrorizante...');
  },

  // Cena 5 — revelação do inimigo (troca de fundo e sprites)
  () => {
    trocarFundo('sombria.png');
    mostrarSprites('sp-hotdog', 'sp-anti');
    semFoco();
    narrador('Processus estava morto! Caído aos pés de uma criatura humanoide com um olhar nojento e arrogante, como um demônio.');
  },

  // Cena 6 — Hot Dog confronta o inimigo
  () => {
    falarSprite('sp-hotdog');
    fala('HOT DOG', 'Não há dúvidas, você é o inimigo. Como você feriu o Processus? Não era para seu poder afetar seres mágicos do tipo dele!', 'hotdog');
  },

  // Cena 7 — Anti-Authorizatus se revela e ameaça
  () => {
    falarSprite('sp-anti');
    fala('ANTI-AUTHORIZATUS', 'Não afeta diretamente... mas interfere no equilíbrio. Eu impeço o atendimento das almas, eu sou Anti-authorizatus! E mesmo esses seres precisam passar pelo Ciclo de Hospitalis. HAHAHA que pena, esse já era — agora é sua vez, e depois matarei esse pirralho assustado nos arbustos, filho desse aqui.', 'anti');
  },

  // Cena 8 — Hot Dog aceita o desafio
  () => {
    falarSprite('sp-hotdog');
    fala('HOT DOG', 'Não se preocupe, jovem. Irei me vingar pelo amigo de meu pai!', 'hotdog');
  },

  // Cena 9 — escolha antes da batalha
  () => {
    semFoco();
    fala('', 'O monstro se prepara. Salsichinha rosna baixinho. O que você faz?', 'narrador');

    // Exibe escolhas após meio segundo (aguarda o texto terminar)
    setTimeout(() => {
      mostrarEscolhas([
        {
          texto: 'Atacar com a Espada Simples',
          fn: () => {
            G.itemAtivo   = 'Espada Simples';
            G.salsiActive = false;
            atualizarInv();
            iniciarBatalha({
              ...INIMIGOS.ANTI_AUTHORIZATUS,
              aoVencer: posB_Fase1,
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
              ...INIMIGOS.ANTI_AUTHORIZATUS,
              aoVencer: posB_Fase1,
            });
          },
        },
        {
          texto: 'Tentar fugir...',
          fn: cenaFuga,
        },
      ]);
    }, 500);
  },
];

// ── Cenas Especiais ────────────────────────────────────────

/**
 * cenaFuga — Hot Dog recusa a fuga e volta para o desafio.
 * Retorna para a cena 8 (aceitação do combate) após 2.2s.
 */
function cenaFuga() {
  falarSprite('sp-hotdog');
  fala('HOT DOG', '...Não. Não posso fugir. Processus merece vingança.', 'hotdog');

  setTimeout(() => {
    cenaAtual = 8;
    cenasFase1[8]();
  }, 2200);
}

// ===================================== PÓS-BATALHA FASE 1 =====================================

function posB_Fase1() {
  document.getElementById('painel-batalha').style.display = 'none';
  mostrarSprites('sp-hotdog');
  semFoco();

  fala('FILHO DE PROCESSUS', 'Muito obrigado... Tome o artefato "Guia de Atendimento" e vá para o próximo desafio. Vou sepultar meu pai.', 'filho');

  if (!G.itens.includes('Guia de Atendimento')) G.itens.push('Guia de Atendimento');
  atualizarInv();

  document.getElementById('dialogo-box').onclick = () => {
    narrador('Fase 1 concluída. As Cavernas de Faturamentus aguardam...');
    document.getElementById('dialogo-box').onclick = () => {
      document.getElementById('dialogo-box').onclick = avancar;
      mostrarTransicaoFase('II', 'CAVERNAS DE FATURAMENTUS', montagemFase2);
    };
  };
}