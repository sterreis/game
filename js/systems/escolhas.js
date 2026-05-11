/* ═══════════════════════════════════════════════════════════
   systems/escolhas.js — SISTEMA DE ESCOLHAS
   Responsabilidade: renderizar os botões de escolha do
   jogador, suspender o clique do diálogo enquanto as
   escolhas estão abertas e restaurá-lo após a seleção.

   Depende de: (sem dependências diretas — usa o DOM)
═══════════════════════════════════════════════════════════ */

// ===================================== ESCOLHAS =====================================

/**
 * mostrarEscolhas — renderiza um conjunto de opções de escolha
 * acima da caixa de diálogo. Suspende o avanço de cena até
 * que o jogador selecione uma opção.
 *
 * @param {Array<{texto: string, fn: Function}>} opcoes
 *   Array de objetos com:
 *     - texto : rótulo exibido no botão
 *     - fn    : função executada ao clicar
 *
 * Exemplo:
 *   mostrarEscolhas([
 *     { texto: 'Atacar', fn: () => iniciarBatalha({...}) },
 *     { texto: 'Fugir',  fn: cenaFuga },
 *   ]);
 */
function mostrarEscolhas(opcoes) {
  const elEscolhas = document.getElementById('escolhas');
  const elDialogo  = document.getElementById('dialogo-box');

  // Limpa escolhas anteriores e exibe o contêiner
  elEscolhas.innerHTML = '';
  elEscolhas.style.display = 'flex';

  // Suspende o clique do diálogo enquanto escolhas estão abertas
  elDialogo.onclick = null;

  // Cria um botão para cada opção
  opcoes.forEach(opcao => {
    const btn = document.createElement('button');
    btn.className = 'btn-escolha';
    btn.textContent = opcao.texto;

    btn.onclick = (evento) => {
      evento.stopPropagation(); // evita propagar clique para o diálogo

      // Fecha as escolhas e restaura o avanço de cena
      elEscolhas.style.display = 'none';
      elDialogo.onclick = avancar;

      // Executa a ação da opção escolhida
      opcao.fn();
    };

    elEscolhas.appendChild(btn);
  });
}
