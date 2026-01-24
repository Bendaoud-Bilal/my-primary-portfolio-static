import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './SnakeGame.css';

const SnakeGame = () => {
  const [showStartButton, setShowStartButton] = useState(true);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);
  const gameScreenRef = useRef(null);
  
  // All game state in refs to avoid stale closures
  const gameStartedRef = useRef(false);
  const gameIntervalRef = useRef(null);
  const scoreRef = useRef(0);
  const directionRef = useRef('up');
  const snakeRef = useRef([
    { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 10, y: 14 },
    { x: 10, y: 15 }, { x: 10, y: 16 }, { x: 10, y: 17 },
    { x: 10, y: 18 }, { x: 11, y: 18 }, { x: 12, y: 18 },
    { x: 13, y: 18 }, { x: 14, y: 18 }, { x: 15, y: 18 },
    { x: 15, y: 19 }, { x: 15, y: 20 }, { x: 15, y: 21 },
    { x: 15, y: 22 }, { x: 15, y: 23 }, { x: 15, y: 24 },
  ]);
  const foodRef = useRef({ x: 10, y: 5 });

  const generateNewFood = () => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * 24),
        y: Math.floor(Math.random() * 40)
      };
    } while (snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  };

  const render = () => {
    if (!gameScreenRef.current) return;
    
    const gameScreen = gameScreenRef.current;
    gameScreen.innerHTML = '';
    
    const cellSize = window.innerWidth > 1536 ? 10 : 8;
    
    for (let i = 0; i < 40; i++) {
      for (let j = 0; j < 24; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.style.display = 'flex';
        cell.style.flexShrink = '0';
        
        const snakeCell = snakeRef.current.find(
          segment => segment.x === j && segment.y === i
        );
        
        if (snakeCell) {
          cell.style.backgroundColor = '#43D9AD';
          cell.style.opacity = 1 - (snakeRef.current.indexOf(snakeCell) / snakeRef.current.length);
          
          if (snakeRef.current.indexOf(snakeCell) === 0) {
            const headRadius = '5px';
            if (directionRef.current === 'up') {
              cell.style.borderTopLeftRadius = headRadius;
              cell.style.borderTopRightRadius = headRadius;
            }
            if (directionRef.current === 'down') {
              cell.style.borderBottomLeftRadius = headRadius;
              cell.style.borderBottomRightRadius = headRadius;
            }
            if (directionRef.current === 'left') {
              cell.style.borderTopLeftRadius = headRadius;
              cell.style.borderBottomLeftRadius = headRadius;
            }
            if (directionRef.current === 'right') {
              cell.style.borderTopRightRadius = headRadius;
              cell.style.borderBottomRightRadius = headRadius;
            }
          }
        }
        
        if (j === foodRef.current.x && i === foodRef.current.y && !snakeCell) {
          cell.style.backgroundColor = '#43D9AD';
          cell.style.borderRadius = '50%';
          cell.style.boxShadow = '0 0 10px #43D9AD';
        }
        
        gameScreen.appendChild(cell);
      }
    }
  };

  const restartScore = () => {
    scoreRef.current = 0;
    const scoreFoods = document.getElementsByClassName('food');
    for (let i = 0; i < scoreFoods.length; i++) {
      scoreFoods[i].style.opacity = '0.3';
    }
  };

  const moveSnake = () => {
    let newX = snakeRef.current[0].x;
    let newY = snakeRef.current[0].y;

    switch (directionRef.current) {
      case 'up': newY--; break;
      case 'down': newY++; break;
      case 'left': newX--; break;
      case 'right': newX++; break;
    }

    if (
      newX >= 0 && newX < 24 &&
      newY >= 0 && newY < 40 &&
      !snakeRef.current.find(cell => cell.x === newX && cell.y === newY)
    ) {
      snakeRef.current.unshift({ x: newX, y: newY });

      if (newX === foodRef.current.x && newY === foodRef.current.y) {
        scoreRef.current++;
        const scoreFoods = document.getElementsByClassName('food');
        if (scoreFoods[scoreRef.current - 1]) {
          scoreFoods[scoreRef.current - 1].style.opacity = '1';
        }

        if (scoreRef.current === 10) {
          snakeRef.current.unshift({ x: newX, y: newY });
          foodRef.current = { x: null, y: null };
          clearInterval(gameIntervalRef.current);
          setShowCongrats(true);
          gameStartedRef.current = false;
        } else {
          foodRef.current = generateNewFood();
        }
      } else {
        snakeRef.current.pop();
      }
    } else {
      clearInterval(gameIntervalRef.current);
      setShowGameOver(true);
      gameStartedRef.current = false;
    }
    
    render();
  };

  const startGame = () => {
    setShowStartButton(false);
    gameStartedRef.current = true;
    gameIntervalRef.current = setInterval(moveSnake, 50);
  };

  const startAgain = () => {
    setShowStartButton(true);
    setShowGameOver(false);
    setShowCongrats(false);
    
    gameStartedRef.current = false;
    restartScore();
    foodRef.current = { x: 10, y: 5 };
    snakeRef.current = [
      { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 10, y: 14 },
      { x: 10, y: 15 }, { x: 10, y: 16 }, { x: 10, y: 17 },
      { x: 10, y: 18 }, { x: 11, y: 18 }, { x: 12, y: 18 },
      { x: 13, y: 18 }, { x: 14, y: 18 }, { x: 15, y: 18 },
      { x: 15, y: 19 }, { x: 15, y: 20 }, { x: 15, y: 21 },
      { x: 15, y: 22 }, { x: 15, y: 23 }, { x: 15, y: 24 },
    ];
    directionRef.current = 'up';
    
    clearInterval(gameIntervalRef.current);
    render();
  };

  const move = (direction) => {
    if (!gameStartedRef.current) return;
    
    switch (direction) {
      case 'up':
        if (directionRef.current !== 'down') directionRef.current = 'up';
        break;
      case 'down':
        if (directionRef.current !== 'up') directionRef.current = 'down';
        break;
      case 'left':
        if (directionRef.current !== 'right') directionRef.current = 'left';
        break;
      case 'right':
        if (directionRef.current !== 'left') directionRef.current = 'right';
        break;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameStartedRef.current) {
        switch (e.keyCode) {
          case 37:
            if (directionRef.current !== 'right') directionRef.current = 'left';
            break;
          case 38:
            if (directionRef.current !== 'down') directionRef.current = 'up';
            break;
          case 39:
            if (directionRef.current !== 'left') directionRef.current = 'right';
            break;
          case 40:
            if (directionRef.current !== 'up') directionRef.current = 'down';
            break;
        }
      } else {
        if (e.keyCode === 32) {
          if (showGameOver || showCongrats) {
            startAgain();
          } else {
            startGame();
          }
        }
      }
    };

    const handleResize = () => {
      render();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    
    render();
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      if (gameIntervalRef.current) {
        clearInterval(gameIntervalRef.current);
      }
    };
  }, [showGameOver, showCongrats]);

  return (
    <div id="console">
      {/* Bolts */}
      <img id="corner" src="/icons/console/bolt-up-left.svg" alt="" className="absolute top-2 left-2 opacity-70" />
      <img id="corner" src="/icons/console/bolt-up-right.svg" alt="" className="absolute top-2 right-2 opacity-70" />
      <img id="corner" src="/icons/console/bolt-down-left.svg" alt="" className="absolute bottom-2 left-2 opacity-70" />
      <img id="corner" src="/icons/console/bolt-down-right.svg" alt="" className="absolute bottom-2 right-2 opacity-70" />

      {/* Game Screen */}
      <div id="game-screen" ref={gameScreenRef}></div>

      {/* Start Button */}
      {showStartButton && (
        <button id="start-button" className="font-fira" onClick={startGame}>
          start-game
        </button>
      )}

      {/* Game Over */}
      <div id="game-over" style={{ display: showGameOver ? 'block' : 'none' }}>
        <span className="font-fira text-greenfy bg-bluefy-dark h-12 flex items-center justify-center">
          GAME OVER!
        </span>
        <button 
          className="font-fira text-menu-text text-sm flex items-center justify-center w-full py-6 hover:text-white"
          onClick={startAgain}
        >
          start-again
        </button>
      </div>

      {/* Congrats */}
      <div id="congrats" style={{ display: showCongrats ? 'block' : 'none' }}>
        <span className="font-fira text-greenfy bg-bluefy-dark h-12 flex items-center justify-center">
          WELL DONE!
        </span>
        <button 
          className="font-fira text-menu-text text-sm flex items-center justify-center w-full py-6 hover:text-white"
          onClick={startAgain}
        >
          play-again
        </button>
      </div>

      {/* Console Menu */}
      <div id="console-menu" className="h-full flex flex-col items-end justify-between">
        <div>
          <div id="instructions" className="font-fira text-sm text-white">
            <p>// use your keyboard</p>
            <p>// arrows to play</p>

            <div id="buttons" className="w-full flex flex-col items-center gap-1 pt-5">
              <button id="console-button" className="button-up" onClick={() => move('up')}>
                <img src="/icons/console/arrow-button.svg" alt="move up" />
              </button>

              <div className="grid grid-cols-3 gap-1">
                <button id="console-button" className="button-left" onClick={() => move('left')}>
                  <img src="/icons/console/arrow-button.svg" alt="move left" className="-rotate-90" />
                </button>

                <button id="console-button" className="button-down" onClick={() => move('down')}>
                  <img src="/icons/console/arrow-button.svg" alt="move down" className="rotate-180" />
                </button>

                <button id="console-button" className="button-right" onClick={() => move('right')}>
                  <img src="/icons/console/arrow-button.svg" alt="move right" className="rotate-90" />
                </button>
              </div>
            </div>
          </div>

          {/* Score Board */}
          <div id="score-board" className="w-full flex flex-col pl-5">
            <p className="font-fira text-white pt-5">// food left</p>
            <div id="score" className="grid grid-cols-5 gap-5 justify-items-center pt-5 w-fit">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="food"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Skip */}
        <Link id="skip-btn" to="/about-me" className="font-fira flex hover:bg-white/20">
          skip
        </Link>
      </div>
    </div>
  );
};

export default SnakeGame;
