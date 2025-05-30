const dino = document.querySelector('.dino');
const background = document.querySelector('.background');

let isJumping = false;
let isGameOver = false;
let position = 0;

function handleKeyUp(event) {
  if (event.keyCode === 32) {
    if (!isJumping) {
      jump();
    }
  }
}

function jump() {
  isJumping = true;

  let upInterval = setInterval(() => {
    if (position >= 150) {
      // Descendo
      clearInterval(upInterval);

      let downInterval = setInterval(() => {
        if (position <= 0) {
          clearInterval(downInterval);
          isJumping = false;
        } else {
          position -= 20;
          dino.style.bottom = position + 'px';
        }
      }, 20);
    } else {
      // Subindo
      position += 20;
      dino.style.bottom = position + 'px';
    }
  }, 20);
}

function createCactus() {
  const cactus = document.createElement('div'); // Corrigir o nome para 'cactus'
  let cactosPosition = 1000;
  let randomTime = Math.random() * 7000;

  if (isGameOver) return;

  cactus.classList.add('cactos'); // Certifique-se de que a classe está correta
  background.appendChild(cactus); // Corrigir para 'cactus'
  cactus.style.left = cactosPosition + 'px';

  let leftTimer = setInterval(() => {
    if (cactosPosition < -60) {
      clearInterval(leftTimer);
      background.removeChild(cactus); // Corrigir para 'cactus'
    } else if (cactosPosition > 0 && cactosPosition < 60 && position < 60) {
      clearInterval(leftTimer);
      isGameOver = true;
      document.body.innerHTML = '<h1 class="game-over">Fim de jogo</h1>';
    } else {
      cactosPosition -= 10;
      cactus.style.left = cactosPosition + 'px'; // Corrigir para 'cactus'
    }
  }, 20);

  setTimeout(createCactus, randomTime);
}

createCactus();
document.addEventListener('keypress', handleKeyUp);