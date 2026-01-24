import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

const SnakeGame = () => {
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [congrats, setCongrats] = useState(false);
  const gameScreenRef = useRef(null);
  
  // Use refs for game state to avoid stale closures in interval
  const snakeRef = useRef([
    { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 10, y: 14 },
    { x: 10, y: 15 }, { x: 10, y: 16 }, { x: 10, y: 17 },
    { x: 10, y: 18 }, { x: 11, y: 18 }, { x: 12, y: 18 },
    { x: 13, y: 18 }, { x: 14, y: 18 }, { x: 15, y: 18 },
    { x: 15, y: 19 }, { x: 15, y: 20 }, { x: 15, y: 21 },
    { x: 15, y: 22 }, { x: 15, y: 23 }, { x: 15, y: 24 },
  ]);
  const foodRef = useRef({ x: 10, y: 5 });
  const directionRef = useRef('up');
  const gameIntervalRef = useRef(null);
  const scoreRef = useRef(0);

  const generateNewFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * 24),
        y: Math.floor(Math.random() * 40)
      };
    } while (snakeRef.current.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const render = useCallback(() => {
    if (!gameScreenRef.current) return;
    
    const gameScreen = gameScreenRef.current;
    gameScreen.innerHTML = '';
    
    const cellSize = window.innerWidth > 1536 ? 10 : 8;
    
    // Create grid cells
    for (let row = 0; row < 40; row++) {
      for (let col = 0; col < 24; col++) {
        const cell = document.createElement('div');
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.style.display = 'flex';
        cell.style.flexShrink = '0';
        
        // Check if this cell is part of the snake
        const snakeIndex = snakeRef.current.findIndex(
          segment => segment.x === col && segment.y === row
        );
        
        if (snakeIndex !== -1) {
          cell.style.backgroundColor = '#43D9AD';
          cell.style.opacity = 1 - (snakeIndex / snakeRef.current.length);
          
          // Snake head special style
          if (snakeIndex === 0) {
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
        
        // Render food
        if (col === foodRef.current.x && row === foodRef.current.y && snakeIndex === -1) {
          cell.style.backgroundColor = '#43D9AD';
          cell.style.borderRadius = '50%';
          cell.style.boxShadow = '0 0 10px #43D9AD';
        }
        
        gameScreen.appendChild(cell);
      }
    }
  }, []);

  const updateFoodIndicators = useCallback((newScore) => {
    const scoreFoods = document.getElementsByClassName('food-indicator');
    for (let i = 0; i < scoreFoods.length; i++) {
      if (i < newScore) {
        scoreFoods[i].style.opacity = '1';
        scoreFoods[i].style.boxShadow = 'none';
        scoreFoods[i].style.backgroundColor = '#011627';
      }
    }
  }, []);

  const resetFoodIndicators = useCallback(() => {
    const scoreFoods = document.getElementsByClassName('food-indicator');
    for (let i = 0; i < scoreFoods.length; i++) {
      scoreFoods[i].style.opacity = '0.3';
      scoreFoods[i].style.boxShadow = '0 0 10px #43D9AD';
      scoreFoods[i].style.backgroundColor = '#43D9AD';
    }
  }, []);

  const moveSnake = useCallback(() => {
    let newX = snakeRef.current[0].x;
    let newY = snakeRef.current[0].y;

    switch (directionRef.current) {
      case 'up': newY--; break;
      case 'down': newY++; break;
      case 'left': newX--; break;
      case 'right': newX++; break;
    }

    // Check boundaries and self-collision
    if (
      newX >= 0 && newX < 24 &&
      newY >= 0 && newY < 40 &&
      !snakeRef.current.some(cell => cell.x === newX && cell.y === newY)
    ) {
      snakeRef.current.unshift({ x: newX, y: newY });

      // Check food collision
      if (newX === foodRef.current.x && newY === foodRef.current.y) {
        scoreRef.current += 1;
        setScore(scoreRef.current);
        updateFoodIndicators(scoreRef.current);

        if (scoreRef.current === 10) {
          snakeRef.current.unshift({ x: newX, y: newY });
          foodRef.current = { x: null, y: null };
          clearInterval(gameIntervalRef.current);
          setCongrats(true);
          setGameStarted(false);
        } else {
          foodRef.current = generateNewFood();
        }
      } else {
        snakeRef.current.pop();
      }
    } else {
      // Game over
      clearInterval(gameIntervalRef.current);
      setGameOver(true);
      setGameStarted(false);
    }
    
    render();
  }, [generateNewFood, render, updateFoodIndicators]);

  const startGame = useCallback(() => {
    setGameStarted(true);
    gameIntervalRef.current = setInterval(moveSnake, 80);
  }, [moveSnake]);

  const startAgain = useCallback(() => {
    setGameOver(false);
    setCongrats(false);
    setScore(0);
    scoreRef.current = 0;
    resetFoodIndicators();
    
    snakeRef.current = [
      { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 10, y: 14 },
      { x: 10, y: 15 }, { x: 10, y: 16 }, { x: 10, y: 17 },
      { x: 10, y: 18 }, { x: 11, y: 18 }, { x: 12, y: 18 },
      { x: 13, y: 18 }, { x: 14, y: 18 }, { x: 15, y: 18 },
      { x: 15, y: 19 }, { x: 15, y: 20 }, { x: 15, y: 21 },
      { x: 15, y: 22 }, { x: 15, y: 23 }, { x: 15, y: 24 },
    ];
    foodRef.current = { x: 10, y: 5 };
    directionRef.current = 'up';
    
    clearInterval(gameIntervalRef.current);
    render();
  }, [render, resetFoodIndicators]);

  const move = useCallback((dir) => {
    if (!gameStarted) return;
    
    const opposites = { up: 'down', down: 'up', left: 'right', right: 'left' };
    if (opposites[dir] !== directionRef.current) {
      directionRef.current = dir;
    }
  }, [gameStarted]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameStarted) {
        switch (e.keyCode) {
          case 37: // left
            if (directionRef.current !== 'right') directionRef.current = 'left';
            break;
          case 38: // up
            if (directionRef.current !== 'down') directionRef.current = 'up';
            break;
          case 39: // right
            if (directionRef.current !== 'left') directionRef.current = 'right';
            break;
          case 40: // down
            if (directionRef.current !== 'up') directionRef.current = 'down';
            break;
        }
      } else {
        if (e.keyCode === 32) { // space
          if (gameOver || congrats) {
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
  }, [gameStarted, gameOver, congrats, render, startGame, startAgain]);

  return (
    <div 
      id="console" 
      className="relative rounded-lg flex border border-border"
      style={{
        background: 'linear-gradient(150.26deg, rgba(23, 85, 83, 0.7) 1.7%, rgba(67, 217, 173, 0.091) 81.82%)',
        boxShadow: 'inset 0px 2px 0px rgba(255, 255, 255, 0.3)',
        width: 'clamp(380px, 28vw, 530px)',
        height: 'clamp(340px, 35vh, 475px)',
        padding: 'clamp(24px, 2vw, 45px) clamp(20px, 2vw, 35px)',
      }}
    >
      {/* Bolts */}
      <img src="/icons/console/bolt-up-left.svg" alt="" className="absolute top-2.5 left-2.5 opacity-70" />
      <img src="/icons/console/bolt-up-right.svg" alt="" className="absolute top-2.5 right-2.5 opacity-70" />
      <img src="/icons/console/bolt-down-left.svg" alt="" className="absolute bottom-2.5 left-2.5 opacity-70" />
      <img src="/icons/console/bolt-down-right.svg" alt="" className="absolute bottom-2.5 right-2.5 opacity-70" />

      <div className="relative flex-shrink-0">
        {/* Game Screen */}
        <div 
          ref={gameScreenRef}
          className="rounded-lg overflow-hidden flex flex-wrap content-start"
          style={{ 
            width: window.innerWidth > 1536 ? '240px' : '192px',
            height: window.innerWidth > 1536 ? '400px' : '320px',
            backgroundColor: 'rgba(1, 22, 39, 0.84)',
            boxShadow: 'inset 0 0 60px rgba(67, 217, 173, 0.2)',
          }}
        />

        {/* Start Button */}
        {!gameStarted && !gameOver && !congrats && (
          <button 
            onClick={startGame}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-fira text-greenfy bg-[#011627cc] px-4 py-2 text-sm rounded-lg border border-greenfy hover:bg-greenfy hover:text-[#011627] transition-colors whitespace-nowrap"
          >
            start-game
          </button>
        )}

        {/* Game Over */}
        {gameOver && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="font-fira text-greenfy bg-bluefy-dark h-10 flex items-center justify-center px-4 rounded-t-lg text-sm whitespace-nowrap">
              GAME OVER!
            </span>
            <button 
              onClick={startAgain}
              className="font-fira text-menu-text text-xs flex items-center justify-center w-full py-3 hover:text-white bg-[#011627] rounded-b-lg"
            >
              start-again
            </button>
          </div>
        )}

        {/* Congrats */}
        {congrats && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <span className="font-fira text-greenfy bg-bluefy-dark h-10 flex items-center justify-center px-4 rounded-t-lg text-sm whitespace-nowrap">
              WELL DONE!
            </span>
            <button 
              onClick={startAgain}
              className="font-fira text-menu-text text-xs flex items-center justify-center w-full py-3 hover:text-white bg-[#011627] rounded-b-lg"
            >
              play-again
            </button>
          </div>
        )}
      </div>

      {/* Console Menu */}
      <div className="h-full flex flex-col items-end justify-between ml-4 flex-shrink-0">
        <div>
          <div className="font-fira text-xs text-white">
            <p className="whitespace-nowrap">// use keyboard</p>
            <p className="whitespace-nowrap">// arrows to play</p>

            <div className="w-full flex flex-col items-center gap-1 pt-4">
              <button 
                onClick={() => move('up')}
                className="w-8 h-8 bg-[#010C15] rounded-lg flex items-center justify-center hover:bg-border transition-colors"
              >
                <img src="/icons/console/arrow-button.svg" alt="move up" className="w-3 h-3" />
              </button>

              <div className="grid grid-cols-3 gap-1">
                <button 
                  onClick={() => move('left')}
                  className="w-8 h-8 bg-[#010C15] rounded-lg flex items-center justify-center hover:bg-border transition-colors"
                >
                  <img src="/icons/console/arrow-button.svg" alt="move left" className="-rotate-90 w-3 h-3" />
                </button>

                <button 
                  onClick={() => move('down')}
                  className="w-8 h-8 bg-[#010C15] rounded-lg flex items-center justify-center hover:bg-border transition-colors"
                >
                  <img src="/icons/console/arrow-button.svg" alt="move down" className="rotate-180 w-3 h-3" />
                </button>

                <button 
                  onClick={() => move('right')}
                  className="w-8 h-8 bg-[#010C15] rounded-lg flex items-center justify-center hover:bg-border transition-colors"
                >
                  <img src="/icons/console/arrow-button.svg" alt="move right" className="rotate-90 w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Score Board */}
          <div className="w-full flex flex-col mt-4">
            <p className="font-fira text-white text-xs whitespace-nowrap">// food left</p>

            <div className="grid grid-cols-5 gap-2 justify-items-center pt-2 w-fit">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i}
                  className="food-indicator w-2 h-2 rounded-full"
                  style={{ 
                    backgroundColor: '#43D9AD',
                    opacity: 0.3,
                    boxShadow: '0 0 10px #43D9AD'
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Skip */}
        <Link 
          to="/about-me"
          className="font-fira text-menu-text px-2 py-1 text-xs hover:bg-white/20 rounded whitespace-nowrap"
        >
          skip
        </Link>
      </div>
    </div>
  );
};

export default SnakeGame;
