/* ═══════════════════════════════════════════════════════════
   systems/batalha.js — SISTEMA DE BATALHA
   Responsabilidade: toda a lógica de batalha por turnos —
   inicialização, seleção de item, rodadas de ataque,
   cálculo de dano, log de mensagens e encerramento.

   Depende de:
     - estado.js          (G, B)
     - data/itens.js      (ITENS_INFO)
     - systems/hud.js     (atualizarHUD, atualizarInv)
     - systems/dialogo.js (narrador)
     - systems/sprites.js (mostrarSprites)
═══════════════════════════════════════════════════════════ */

/* ==========================
   INICIALIZAÇÃO
========================== */

/**
 * iniciarBatalha — configura o estado B e exibe o painel de batalha.
 *
 * @param {Object} cfg - Configuração da batalha:
 *   - nome, vida, numeros : dados do inimigo
 *   - aoVencer, aoPerder  : callbacks de fim de batalha
 *   - onThreshold         : { porcentagem, fn } — ação intermediária
 */
function iniciarBatalha(cfg) {
  B = {
    vidaPlayer:          G.vida,
    vidaEnemy:           cfg.vida,
    vidaMaxEnemy:        cfg.vida,
    secretoPlayer:       Math.floor(Math.random() * G.vidaMax) + 1,
    secretoEnemy:        Math.floor(Math.random() * cfg.vida)  + 1,
    numSorteadosEnemy:   cfg.numeros,
    multiplicadorDano:   1,
    penalidade:          0,
    encerrada:           false,
    thresholdDisparado:  false,
    aoVencer:            cfg.aoVencer   || null,
    aoPerder:            cfg.aoPerder   || null,
    onThreshold:         cfg.onThreshold || null,
    nomeInimigo:         cfg.nome       || 'INIMIGO',
    // Estilingue Mágico
    estilingueCarregado: true,
    inimigoAtordoado:    false,
  };

  document.getElementById('batalha-titulo').textContent = '⚔ BATALHA!';
  document.getElementById('b-hp-player').textContent   = B.vidaPlayer;
  document.getElementById('b-hp-enemy').textContent    = B.vidaEnemy;
  document.getElementById('b-nome-enemy').innerHTML    =
    `${B.nomeInimigo}: <span id="b-hp-enemy" style="color:var(--red)">${B.vidaEnemy}</span>`;
  document.getElementById('batalha-log').innerHTML = '';

  renderizarBotoesDeItem();
  logSistema('Número secreto sorteado. A batalha começa!');
  renderAcoesBatalha();
  document.getElementById('painel-batalha').style.display = 'flex';
}

/* ==========================
   MODO BERSERKER
========================== */

/**
 * ativarBerserker — multiplica o dano por 3 e concede +50 de vida.
 * Chamado pela fase final após evento narrativo.
 */
function ativarBerserker() {
  B.multiplicadorDano = 3;
  B.vidaPlayer        = Math.min(B.vidaPlayer + 50, G.vidaMax + 50);
  G.vida              = B.vidaPlayer;
  atualizarHUD();
  document.getElementById('b-hp-player').textContent = B.vidaPlayer;
  logSistema('<span class="log-acerto">MODO BERSERKER ATIVADO! Dano 3x | +50 de vida.</span>');
}

/* ==========================
   RENDERIZAÇÃO DE ITENS
========================== */

/**
 * renderizarBotoesDeItem — monta os botões de seleção de item
 * no painel de batalha, respeitando estados especiais
 * (estilingue recarregando, salsichinha raptada).
 */
function renderizarBotoesDeItem() {
  const divItens = document.getElementById('btn-itens');
  divItens.innerHTML = '';

  // Itens com comportamento próprio são tratados separadamente
  const itensIgnorados = new Set(['Salsichinha', 'Estilingue Mágico', 'Send Pearl']);

  G.itens.forEach(nomeItem => {
    if (itensIgnorados.has(nomeItem)) return;

    const btn = document.createElement('button');
    btn.className   = 'btn-item-batalha' + (nomeItem === G.itemAtivo ? ' ativo' : '');
    btn.textContent = nomeItem;
    btn.onclick = () => {
      G.itemAtivo = nomeItem;
      divItens.querySelectorAll('.btn-item-batalha').forEach(b => b.classList.remove('ativo'));
      btn.classList.add('ativo');
      atualizarItemDisplay();
      atualizarInv();
    };
    divItens.appendChild(btn);
  });

  // Estilingue Mágico — com estado de cooldown
  if (G.itens.includes('Estilingue Mágico')) {
    const btnEst = document.createElement('button');
    btnEst.id = 'btn-estilingue';

    if (B.estilingueCarregado) {
      btnEst.className   = 'btn-item-batalha' + (G.itemAtivo === 'Estilingue Mágico' ? ' ativo' : '');
      btnEst.textContent = 'Estilingue Mágico';
      btnEst.onclick = () => {
        G.itemAtivo = 'Estilingue Mágico';
        divItens.querySelectorAll('.btn-item-batalha').forEach(b => b.classList.remove('ativo'));
        btnEst.classList.add('ativo');
        atualizarItemDisplay();
      };
    } else {
      btnEst.className   = 'btn-item-batalha';
      btnEst.textContent = 'Estilingue Mágico [RECARREGANDO]';
      btnEst.disabled    = true;
    }

    divItens.appendChild(btnEst);
  }

  // Salsichinha — com estado de raptado
  if (G.itens.includes('Salsichinha')) {
    const btnSalsi = document.createElement('button');
    btnSalsi.id = 'btn-salsi';

    if (G._salsiRaptado) {
      btnSalsi.className   = 'btn-item-batalha';
      btnSalsi.textContent = 'Salsichinha [RAPTADO]';
      btnSalsi.disabled    = true;
    } else {
      btnSalsi.className   = 'btn-item-batalha' + (G.salsiActive ? ' ativo' : '');
      btnSalsi.textContent = 'Salsichinha ' + (G.salsiActive ? '[ON]' : '[OFF]');
      btnSalsi.onclick = () => {
        G.salsiActive = !G.salsiActive;
        btnSalsi.classList.toggle('ativo', G.salsiActive);
        btnSalsi.textContent = 'Salsichinha ' + (G.salsiActive ? '[ON]' : '[OFF]');
        atualizarItemDisplay();
      };
    }

    divItens.appendChild(btnSalsi);
  }

  atualizarItemDisplay();
}

/**
 * atualizarItemDisplay — atualiza o texto do item ativo no painel.
 */
function atualizarItemDisplay() {
  const sufixoSalsi = G.salsiActive ? ' + Salsichinha' : '';
  document.getElementById('item-ativo-display').innerHTML =
    `Item: <span>${G.itemAtivo}${sufixoSalsi}</span>`;
}

/* ==========================
   LOG DE BATALHA
========================== */

function logPlayer(html) {
  const el  = document.getElementById('batalha-log');
  const div = document.createElement('div');
  div.className = 'msg-player';
  div.innerHTML = `<div class="msg-label">HOT DOG</div>${html}`;
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

function logEnemy(html) {
  const el  = document.getElementById('batalha-log');
  const div = document.createElement('div');
  div.className = 'msg-enemy';
  div.innerHTML = `<div class="msg-label">${B.nomeInimigo}</div>${html}`;
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

function logSistema(html) {
  const el  = document.getElementById('batalha-log');
  const div = document.createElement('div');
  div.style.cssText = 'font-size:10px;color:var(--gray);text-align:center;padding:4px 0;font-family:Cinzel,serif';
  div.innerHTML = html;
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

/* ==========================
   AÇÕES E RODADA
========================== */

/**
 * renderAcoesBatalha — exibe (ou oculta) o botão de ataque.
 */
function renderAcoesBatalha() {
  const divAcoes = document.getElementById('batalha-acoes');
  divAcoes.innerHTML = '';
  if (B.encerrada) return;

  const btn = document.createElement('button');
  btn.className   = 'btn-px small';
  btn.textContent = 'ATACAR';
  btn.onclick     = rodada;
  divAcoes.appendChild(btn);
}

/**
 * rodada — executa um turno completo: ataque do jogador
 * (com lógica especial para Estilingue) seguido do ataque
 * do inimigo, com verificação de vitória/derrota/threshold.
 */
function rodada() {
  if (B.encerrada) return;

  document.getElementById('batalha-acoes').innerHTML = '';

  // ── Estilingue Mágico ──────────────────────────────────
  if (G.itemAtivo === 'Estilingue Mágico') {
    if (!B.estilingueCarregado) {
      logSistema('<span class="log-erro">Estilingue ainda recarregando! Troque de item.</span>');
      renderAcoesBatalha();
      return;
    }

    const qtdEst     = Math.floor(B.vidaMaxEnemy * 0.5);
    const numEst     = sortear(qtdEst, B.vidaMaxEnemy);
    const acertouEst = numEst.includes(B.secretoEnemy);

    B.estilingueCarregado = false;

    logPlayer(
      `Estilingue! Sorteados (${qtdEst} números): [${numEst.join(', ')}]<br>` +
      (acertouEst
        ? `<span class="log-acerto">Acertou o número secreto (${B.secretoEnemy})! Inimigo ATORDOADO — perde a próxima rodada!</span>`
        : `<span class="log-erro">Errou. Inimigo não foi atordoado.</span>`)
    );

    if (acertouEst) B.inimigoAtordoado = true;

    setTimeout(() => {
      if (B.encerrada) return;

      if (B.inimigoAtordoado) {
        B.inimigoAtordoado = false;
        logSistema('<span class="log-neutro">Inimigo atordoado — perdeu a rodada!</span>');
        renderizarBotoesDeItem();
        renderAcoesBatalha();
      } else {
        _ataqueInimigo();
      }
    }, 1000);

    return;
  }

  // ── Ataque normal ──────────────────────────────────────
  const infoItem       = ITENS_INFO[G.itemAtivo] || { numeros: 1 };
  const numerosJogador = sortear(infoItem.numeros, B.vidaMaxEnemy);
  const aparicoes      = numerosJogador.filter(n => n === B.secretoEnemy).length;

  // Recarrega o estilingue a cada rodada normal
  if (!B.estilingueCarregado) {
    B.estilingueCarregado = true;
    renderizarBotoesDeItem();
    logSistema('<span class="log-neutro">Estilingue Mágico recarregado!</span>');
  }

  if (aparicoes > 0) {
    const bonusSalsi = G.salsiActive ? 1 : 0;
    const dano       = (aparicoes * B.secretoEnemy + bonusSalsi) * B.multiplicadorDano;
    B.vidaEnemy      = Math.max(0, B.vidaEnemy - dano);

    let msg = `Sorteados: [${numerosJogador.join(', ')}]<br><span class="log-acerto">Acertou! Dano: ${dano}</span>`;
    if (G.salsiActive)           msg += `<br><span class="log-neutro">Salsichinha mordeu! +1</span>`;
    if (B.multiplicadorDano > 1) msg += `<br><span class="log-acerto">BERSERKER x${B.multiplicadorDano}!</span>`;
    logPlayer(msg);
  } else {
    logPlayer(`Sorteados: [${numerosJogador.join(', ')}]<br><span class="log-erro">Errou o número secreto.</span>`);

    if (G.itemAtivo === 'Faturamentus') {
      B.penalidade += 2;
      logSistema('<span class="log-erro">Penalidade Faturamentus: inimigo +2 no próximo ataque.</span>');
    }
  }

  document.getElementById('b-hp-enemy').textContent = B.vidaEnemy;

  if (B.vidaEnemy <= 0) { encerrarBatalha(true); return; }

  // Verifica threshold intermediário
  if (
    B.onThreshold &&
    !B.thresholdDisparado &&
    B.vidaEnemy <= (B.vidaMaxEnemy * (B.onThreshold.porcentagem / 100))
  ) {
    B.thresholdDisparado = true;
    B.encerrada = true;
    renderAcoesBatalha();
    B.onThreshold.fn();
    return;
  }

  setTimeout(() => {
    if (B.encerrada) return;
    _ataqueInimigo();
  }, 1000);
}

/* ==========================
   ATAQUE DO INIMIGO
========================== */

/**
 * _ataqueInimigo — processa o turno do inimigo.
 * Separado em função própria para ser reutilizado pelo estilingue.
 */
function _ataqueInimigo() {
  const qtdInimigo     = B.numSorteadosEnemy + B.penalidade;
  B.penalidade         = 0;

  const numerosInimigo = sortear(qtdInimigo, G.vidaMax);
  const aparEnemigo    = numerosInimigo.filter(n => n === B.secretoPlayer).length;

  if (aparEnemigo > 0) {
    const danoInimigo = aparEnemigo * B.secretoPlayer;
    B.vidaPlayer      = Math.max(0, B.vidaPlayer - danoInimigo);
    logEnemy(`Sorteados: [${numerosInimigo.join(', ')}]<br><span class="log-erro">Acertou seu secreto! Dano: ${danoInimigo}</span>`);
  } else {
    logEnemy(`Sorteados: [${numerosInimigo.join(', ')}]<br><span class="log-acerto">Errou. Você escapou!</span>`);
  }

  G.vida = B.vidaPlayer;
  document.getElementById('b-hp-player').textContent = B.vidaPlayer;
  atualizarHUD();

  if (B.vidaPlayer <= 0) { encerrarBatalha(false); return; }

  renderAcoesBatalha();
}

/* ==========================
   AUXILIARES
========================== */

/**
 * sortear — gera um array de `qtd` números aleatórios entre 1 e `max`.
 */
function sortear(qtd, max) {
  const resultado = [];
  for (let i = 0; i < qtd; i++) {
    resultado.push(Math.floor(Math.random() * max) + 1);
  }
  return resultado;
}

/* ==========================
   ENCERRAMENTO
========================== */

/**
 * encerrarBatalha — finaliza a batalha, aplica recompensa ou
 * penalidade e chama os callbacks configurados.
 *
 * @param {boolean} venceu - true se o jogador venceu
 */
function encerrarBatalha(venceu) {
  B.encerrada = true;
  renderAcoesBatalha();

  if (venceu) {
    G.vidaMax += 5;
    G.vida     = Math.min(G.vida + 5, G.vidaMax);
    atualizarHUD();

    logSistema('<span class="log-acerto">Vitória! +5 de vida máxima.</span>');

    const btnContinuar = document.createElement('button');
    btnContinuar.className       = 'btn-px small';
    btnContinuar.style.marginTop = '10px';
    btnContinuar.textContent     = 'CONTINUAR';
    btnContinuar.onclick = () => {
      document.getElementById('painel-batalha').style.display = 'none';
      document.getElementById('batalha-log').innerHTML = '';
      const callback = B.aoVencer;
      B = {};
      if (callback) callback();
    };

    document.getElementById('batalha-acoes').appendChild(btnContinuar);

  } else {
    logSistema('<span class="log-erro">Derrota...</span>');

    setTimeout(() => {
      document.getElementById('painel-batalha').style.display = 'none';
      const callback = B.aoPerder;
      B = {};
      if (callback) {
        callback();
      } else {
        _telaDerrota();
      }
    }, 600);
  }
}

/* ==========================
   TELA DE DERROTA
========================== */

/**
 * _telaDerrota — exibe a tela de derrota padrão com
 * animação de fade e botão de reinício.
 */
function _telaDerrota() {
  const overlay = document.createElement('div');
  overlay.id = 'overlay-derrota';
  document.body.appendChild(overlay);

  requestAnimationFrame(() => overlay.classList.add('visivel'));

  setTimeout(() => {
    const titulo = document.createElement('div');
    titulo.id          = 'overlay-derrota-titulo';
    titulo.textContent = 'DERROTA';
    overlay.appendChild(titulo);

    const texto = document.createElement('div');
    texto.id        = 'overlay-derrota-texto';
    texto.innerHTML = 'O mundo foi destruído por Glozium.<br>Uma fatalidade terrível...';
    overlay.appendChild(texto);

    setTimeout(() => {
      const btn = document.createElement('button');
      btn.className   = 'btn-px danger fadeIn';
      btn.textContent = 'JOGAR NOVAMENTE';
      btn.onclick     = () => location.reload();
      overlay.appendChild(btn);
    }, 1000);
  }, 1200);
}
