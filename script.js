const dino = document.querySelector('.dino');
const background = document.querySelector('.background');
const scoreEl = document.querySelector('.score');
const gameContainer = document.querySelector('.game-container');

let isJumping = false;
let isGameOver = false;
let position = 0;
let score = 0;
let scoreInterval = null;

function handleKeyDown(event) {
  if (event.key === "ArrowUp") {
    if (!isJumping) {
      jump();
    }
  } else if (event.key === "ArrowDown") {
    dino.classList.add('ducking');
    dino.style.height = '35px';
    dino.style.backgroundImage = "url('img/dino_duck.png')"; // use uma imagem de dinossauro agachado
  }
}

function handleKeyUp(event) {
  if (event.key === "ArrowDown") {
    dino.classList.remove('ducking');
    dino.style.height = '60px';
    dino.style.backgroundImage = "url('img/dino.png')";
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
  const cactus = document.createElement('div');
  let cactosPosition = gameContainer.offsetWidth; // começa na borda direita do container
  let randomTime = Math.random() * 7000;

  if (isGameOver) return;

  cactus.classList.add('cactos');
  background.appendChild(cactus);
  cactus.style.left = cactosPosition + 'px';

  let leftTimer = setInterval(() => {
    if (cactosPosition < -60) {
      clearInterval(leftTimer);
      background.removeChild(cactus);
    } else if (cactosPosition > 0 && cactosPosition < 60 && position < 60) {
      clearInterval(leftTimer);
      gameOver();
    } else {
      cactosPosition -= 10;
      cactus.style.left = cactosPosition + 'px';
    }
  }, 20);

  setTimeout(createCactus, randomTime);
}

function createShuriken() {
  if (score < 300 || isGameOver) {
    setTimeout(createShuriken, 1000);
    return;
  }

  const shuriken = document.createElement('div');
  shuriken.classList.add('shuriken');

  // Altura aleatória: baixa (30px) ou alta (120px)
  const heights = [30, 120];
  const shurikenBottom = heights[Math.floor(Math.random() * heights.length)];
  shuriken.style.bottom = shurikenBottom + 'px';

  let shurikenPosition = gameContainer.offsetWidth;
  background.appendChild(shuriken);
  shuriken.style.left = shurikenPosition + 'px';

  let shurikenTimer = setInterval(() => {
    if (shurikenPosition < -60) {
      clearInterval(shurikenTimer);
      background.removeChild(shuriken);
    } else {
      // Colisão: se altura baixa e dino não está agachado, ou altura alta e dino está pulando
      if (
        shurikenPosition > 0 && shurikenPosition < 60 &&
        (
          (shurikenBottom < 60 && !dino.classList.contains('ducking')) ||
          (shurikenBottom > 60 && position < 60)
        )
      ) {
        clearInterval(shurikenTimer);
        gameOver();
      } else {
        shurikenPosition -= 12;
        shuriken.style.left = shurikenPosition + 'px';
      }
    }
  }, 20);

  setTimeout(createShuriken, 2000 + Math.random() * 2000);
}

function startScore() {
  score = 0;
  scoreEl.textContent = score;
  scoreInterval = setInterval(() => {
    if (!isGameOver) {
      score++;
      scoreEl.textContent = score;
    }
  }, 100);
}

function stopScore() {
  clearInterval(scoreInterval);
}

function gameOver() {
  isGameOver = true;
  stopScore();

  document.body.innerHTML = `
    <div class="end-screen">
      <h1 class="game-over">Fim de jogo</h1>
      <div class="final-score">Pontuação: ${score}</div>
      <button class="restart-btn" onclick="window.location.reload()">Reiniciar</button>
    </div>
    <div class="tutorial">
      <p>Use <b>↑</b> para pular, <b>↓</b> para agachar.<br>
      Desvie dos cactos e das shurikens!<br>
      Pressione <b>Enter</b> ou <b>Espaço</b> para reiniciar.</p>
    </div>
  `;

  // Listener para Enter ou Espaço reiniciar
  document.addEventListener('keydown', function restartOnKey(e) {
    if (e.code === 'Enter' || e.code === 'Space') {
      window.location.reload();
    }
  });
}

window.onload = function() {
    const startScreen = document.getElementById('startScreen');
    const gameContainer = document.querySelector('.game-container');
    const countdownEl = document.getElementById('countdown');
    let countdown = 5;

    function startCountdown() {
        const timer = setInterval(() => {
            countdown--;
            countdownEl.textContent = countdown;
            if (countdown === 0) {
                clearInterval(timer);
                startScreen.style.display = 'none';
                gameContainer.style.display = 'block';
                iniciarJogo();
            }
        }, 1000);
    }

    startCountdown();
};

function iniciarJogo() {
    createCactus();
    createShuriken();
    startScore();
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
}