/* ═══════════════════════════════════════════════════════════
   systems/sprites.js — GERENCIAMENTO DE SPRITES E FUNDO
   Responsabilidade: controlar visibilidade, estado visual
   (falando/quieto/oculto) dos sprites e trocar o fundo
   da tela de jogo.

   Depende de: estado.js (apenas leitura de estado, indireta)
═══════════════════════════════════════════════════════════ */

// ===================================== SPRITES =====================================

const spH  = () => document.getElementById('sp-hotdog');
const spA  = () => document.getElementById('sp-anti');
const spC  = () => document.getElementById('sp-cavaleiro');
const spB  = () => document.getElementById('sp-boss');
const spS  = () => document.getElementById('sp-sarsicha');

const todosSprites = () => [spH(), spA(), spC(), spB(), spS()].filter(el => el !== null);

function mostrarSprites(...ids) {
  todosSprites().forEach(sprite => {
    sprite.classList.add('oculto');
    sprite.classList.remove('falando', 'quieto');
  });
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('oculto');
  });
}

function falarSprite(id) {
  todosSprites().forEach(sprite => {
    if (!sprite.classList.contains('oculto')) {
      sprite.classList.toggle('falando', sprite.id === id);
      sprite.classList.toggle('quieto',  sprite.id !== id);
    }
  });
  const falante = document.getElementById(id);
  if (falante) {
    falante.classList.remove('quieto');
    falante.classList.remove('falando');
    void falante.offsetWidth;
    falante.classList.add('falando');
  }
}

function semFoco() {
  todosSprites().forEach(sprite => sprite.classList.remove('falando', 'quieto'));
}

function trocarFundo(img) {
  document.getElementById('game-bg').style.backgroundImage = `url('assets/img/${img}')`;
}