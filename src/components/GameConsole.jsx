import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './GameConsole.css';

/*
 * GameConsole — a single retro console that hosts three games
 * (Snake, Flappy Bird, Tetris) sharing the exact same console design.
 *
 * All games render into the same 24 x 40 cell screen, use the same
 * monochrome green palette, and share the same 10-step win indicator.
 * Reaching a score of 10 wins ("WELL DONE!"); failing shows "GAME OVER!".
 *
 * The player can switch games at any time from the selector tabs. Switching
 * mid-game simply abandons the current run and resets to the chosen game.
 */

const COLS = 24;
const ROWS = 40;
const WIN_SCORE = 10;

const GREEN = '#43D9AD';

const GAMES = {
  snake: { label: 'snake', unit: 'food', speed: 50 },
  flappy: { label: 'flappy', unit: 'pipes', speed: 90 },
  tetris: { label: 'tetris', unit: 'lines', speed: 360 },
};

// --- Tetris piece definitions (cells are [x, y] within a small bounding box) ---
const TETROMINOES = {
  I: [
    [[0, 1], [1, 1], [2, 1], [3, 1]],
    [[2, 0], [2, 1], [2, 2], [2, 3]],
    [[0, 2], [1, 2], [2, 2], [3, 2]],
    [[1, 0], [1, 1], [1, 2], [1, 3]],
  ],
  O: [
    [[1, 0], [2, 0], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [2, 1]],
  ],
  T: [
    [[1, 0], [0, 1], [1, 1], [2, 1]],
    [[1, 0], [1, 1], [2, 1], [1, 2]],
    [[0, 1], [1, 1], [2, 1], [1, 2]],
    [[1, 0], [0, 1], [1, 1], [1, 2]],
  ],
  J: [
    [[0, 0], [0, 1], [1, 1], [2, 1]],
    [[1, 0], [2, 0], [1, 1], [1, 2]],
    [[0, 1], [1, 1], [2, 1], [2, 2]],
    [[1, 0], [1, 1], [0, 2], [1, 2]],
  ],
  L: [
    [[2, 0], [0, 1], [1, 1], [2, 1]],
    [[1, 0], [1, 1], [1, 2], [2, 2]],
    [[0, 1], [1, 1], [2, 1], [0, 2]],
    [[0, 0], [1, 0], [1, 1], [1, 2]],
  ],
  S: [
    [[1, 0], [2, 0], [0, 1], [1, 1]],
    [[1, 0], [1, 1], [2, 1], [2, 2]],
    [[1, 1], [2, 1], [0, 2], [1, 2]],
    [[0, 0], [0, 1], [1, 1], [1, 2]],
  ],
  Z: [
    [[0, 0], [1, 0], [1, 1], [2, 1]],
    [[2, 0], [1, 1], [2, 1], [1, 2]],
    [[0, 1], [1, 1], [1, 2], [2, 2]],
    [[1, 0], [0, 1], [1, 1], [0, 2]],
  ],
};
const TETRO_KEYS = Object.keys(TETROMINOES);

// Tetris playfield placement within the shared 24 x 40 screen
const PF_W = 12;
const PF_H = 30;
const PF_OFF_X = (COLS - PF_W) / 2; // 6
const PF_OFF_Y = 5;

const snakeStart = () => [
  { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 10, y: 14 },
  { x: 10, y: 15 }, { x: 10, y: 16 }, { x: 10, y: 17 },
  { x: 10, y: 18 }, { x: 11, y: 18 }, { x: 12, y: 18 },
  { x: 13, y: 18 }, { x: 14, y: 18 }, { x: 15, y: 18 },
  { x: 15, y: 19 }, { x: 15, y: 20 }, { x: 15, y: 21 },
  { x: 15, y: 22 }, { x: 15, y: 23 }, { x: 15, y: 24 },
];

const GameConsole = () => {
  const [currentGame, setCurrentGame] = useState('snake');
  const [showStartButton, setShowStartButton] = useState(true);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const rootRef = useRef(null);
  const gameScreenRef = useRef(null);

  // Shared control state
  const gameRef = useRef('snake');       // mirror of currentGame for callbacks
  const gameStartedRef = useRef(false);
  const intervalRef = useRef(null);
  const scoreRef = useRef(0);

  // Snake state
  const snakeRef = useRef(snakeStart());
  const foodRef = useRef({ x: 10, y: 5 });
  const dirRef = useRef('up');

  // Flappy state
  const birdYRef = useRef(ROWS / 2);
  const birdVelRef = useRef(0);
  const pipesRef = useRef([]);
  const BIRD_X = 6;
  const GAP = 9;
  const PIPE_SPACING = 15;

  // Tetris state
  const boardRef = useRef(null);
  const pieceRef = useRef(null);  // { type, rot, x, y }

  // ----- Score indicator (shared 10 dots) -----
  const setScore = (n) => {
    scoreRef.current = n;
    if (!rootRef.current) return;
    const dots = rootRef.current.getElementsByClassName('food');
    for (let i = 0; i < dots.length; i++) {
      dots[i].style.opacity = i < n ? '1' : '0.3';
    }
  };

  // ============================================================
  //  SNAKE
  // ============================================================
  const snakeReset = () => {
    snakeRef.current = snakeStart();
    foodRef.current = { x: 10, y: 5 };
    dirRef.current = 'up';
  };

  const generateFood = () => {
    let food;
    do {
      food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (snakeRef.current.some((s) => s.x === food.x && s.y === food.y));
    return food;
  };

  const snakeTick = () => {
    let newX = snakeRef.current[0].x;
    let newY = snakeRef.current[0].y;
    switch (dirRef.current) {
      case 'up': newY--; break;
      case 'down': newY++; break;
      case 'left': newX--; break;
      case 'right': newX++; break;
      default: break;
    }

    const valid =
      newX >= 0 && newX < COLS &&
      newY >= 0 && newY < ROWS &&
      !snakeRef.current.find((c) => c.x === newX && c.y === newY);

    if (!valid) return gameOver();

    snakeRef.current.unshift({ x: newX, y: newY });
    if (newX === foodRef.current.x && newY === foodRef.current.y) {
      setScore(scoreRef.current + 1);
      if (scoreRef.current >= WIN_SCORE) {
        foodRef.current = { x: null, y: null };
        return win();
      }
      foodRef.current = generateFood();
    } else {
      snakeRef.current.pop();
    }
    render();
  };

  const snakeStyle = (x, y) => {
    const idx = snakeRef.current.findIndex((s) => s.x === x && s.y === y);
    if (idx !== -1) {
      const style = {
        backgroundColor: GREEN,
        opacity: 1 - idx / snakeRef.current.length,
      };
      if (idx === 0) {
        const r = '5px';
        if (dirRef.current === 'up') { style.borderTopLeftRadius = r; style.borderTopRightRadius = r; }
        if (dirRef.current === 'down') { style.borderBottomLeftRadius = r; style.borderBottomRightRadius = r; }
        if (dirRef.current === 'left') { style.borderTopLeftRadius = r; style.borderBottomLeftRadius = r; }
        if (dirRef.current === 'right') { style.borderTopRightRadius = r; style.borderBottomRightRadius = r; }
      }
      return style;
    }
    if (x === foodRef.current.x && y === foodRef.current.y) {
      return { backgroundColor: GREEN, borderRadius: '50%', boxShadow: `0 0 10px ${GREEN}` };
    }
    return null;
  };

  // ============================================================
  //  FLAPPY BIRD
  // ============================================================
  const flappyReset = () => {
    birdYRef.current = ROWS / 2;
    birdVelRef.current = 0;
    pipesRef.current = [
      { x: COLS + 2, gapTop: 10, passed: false },
      { x: COLS + 2 + PIPE_SPACING, gapTop: 20, passed: false },
    ];
  };

  const flappyFlap = () => {
    birdVelRef.current = -1.7;
  };

  const flappyTick = () => {
    birdVelRef.current += 0.35;
    birdYRef.current += birdVelRef.current;

    // Move pipes left
    pipesRef.current.forEach((p) => { p.x -= 1; });

    // Score when a pipe passes the bird
    pipesRef.current.forEach((p) => {
      if (!p.passed && p.x < BIRD_X) {
        p.passed = true;
        setScore(scoreRef.current + 1);
      }
    });

    // Recycle / spawn pipes
    pipesRef.current = pipesRef.current.filter((p) => p.x > -1);
    const lastX = pipesRef.current.reduce((m, p) => Math.max(m, p.x), 0);
    if (pipesRef.current.length < 2 || lastX <= COLS - PIPE_SPACING) {
      pipesRef.current.push({
        x: lastX + PIPE_SPACING,
        gapTop: 3 + Math.floor(Math.random() * (ROWS - GAP - 6)),
        passed: false,
      });
    }

    if (scoreRef.current >= WIN_SCORE) return win();

    const by = Math.floor(birdYRef.current);
    if (by < 0 || by >= ROWS) return gameOver();
    const hit = pipesRef.current.some(
      (p) => p.x === BIRD_X && (by < p.gapTop || by >= p.gapTop + GAP)
    );
    if (hit) return gameOver();

    render();
  };

  const flappyStyle = (x, y) => {
    if (x === BIRD_X && y === Math.floor(birdYRef.current)) {
      return { backgroundColor: GREEN, borderRadius: '50%', boxShadow: `0 0 10px ${GREEN}` };
    }
    for (const p of pipesRef.current) {
      if (p.x === x && (y < p.gapTop || y >= p.gapTop + GAP)) {
        return { backgroundColor: GREEN, opacity: 0.85 };
      }
    }
    return null;
  };

  // ============================================================
  //  TETRIS
  // ============================================================
  const tetrisCells = (piece) =>
    TETROMINOES[piece.type][piece.rot].map(([cx, cy]) => [piece.x + cx, piece.y + cy]);

  const tetrisCollides = (piece) =>
    tetrisCells(piece).some(([bx, by]) =>
      bx < 0 || bx >= PF_W || by >= PF_H || (by >= 0 && boardRef.current[by][bx])
    );

  const tetrisSpawn = () => {
    const type = TETRO_KEYS[Math.floor(Math.random() * TETRO_KEYS.length)];
    const piece = { type, rot: 0, x: Math.floor(PF_W / 2) - 2, y: 0 };
    pieceRef.current = piece;
    return !tetrisCollides(piece);
  };

  const tetrisReset = () => {
    boardRef.current = Array.from({ length: PF_H }, () => Array(PF_W).fill(0));
    tetrisSpawn();
  };

  const tetrisLock = () => {
    tetrisCells(pieceRef.current).forEach(([bx, by]) => {
      if (by >= 0 && by < PF_H && bx >= 0 && bx < PF_W) boardRef.current[by][bx] = 1;
    });
    // Clear completed lines
    let cleared = 0;
    boardRef.current = boardRef.current.filter((row) => {
      const full = row.every((c) => c);
      if (full) cleared++;
      return !full;
    });
    while (boardRef.current.length < PF_H) {
      boardRef.current.unshift(Array(PF_W).fill(0));
    }
    if (cleared > 0) {
      setScore(Math.min(WIN_SCORE, scoreRef.current + cleared));
      if (scoreRef.current >= WIN_SCORE) return win();
    }
    if (!tetrisSpawn()) return gameOver();
    render();
  };

  const tetrisTick = () => {
    const moved = { ...pieceRef.current, y: pieceRef.current.y + 1 };
    if (tetrisCollides(moved)) {
      tetrisLock();
    } else {
      pieceRef.current = moved;
      render();
    }
  };

  const tetrisMove = (dx) => {
    const moved = { ...pieceRef.current, x: pieceRef.current.x + dx };
    if (!tetrisCollides(moved)) { pieceRef.current = moved; render(); }
  };

  const tetrisSoftDrop = () => {
    const moved = { ...pieceRef.current, y: pieceRef.current.y + 1 };
    if (tetrisCollides(moved)) tetrisLock();
    else { pieceRef.current = moved; render(); }
  };

  const tetrisRotate = () => {
    const p = pieceRef.current;
    const rotated = { ...p, rot: (p.rot + 1) % 4 };
    // simple wall kicks
    for (const dx of [0, -1, 1, -2, 2]) {
      const test = { ...rotated, x: rotated.x + dx };
      if (!tetrisCollides(test)) { pieceRef.current = test; render(); return; }
    }
  };

  const tetrisStyle = (x, y) => {
    const px = x - PF_OFF_X;
    const py = y - PF_OFF_Y;
    if (px < 0 || px >= PF_W || py < 0 || py >= PF_H) return null;
    // active piece
    if (pieceRef.current) {
      const on = tetrisCells(pieceRef.current).some(([bx, by]) => bx === px && by === py);
      if (on) return { backgroundColor: GREEN, borderRadius: '2px', boxShadow: `0 0 6px ${GREEN}` };
    }
    if (boardRef.current[py][px]) return { backgroundColor: GREEN, opacity: 0.6, borderRadius: '2px' };
    return null;
  };

  // ============================================================
  //  Shared dispatch
  // ============================================================
  const initActiveGame = () => {
    if (gameRef.current === 'snake') snakeReset();
    else if (gameRef.current === 'flappy') flappyReset();
    else tetrisReset();
  };

  const cellStyle = (x, y) => {
    if (gameRef.current === 'snake') return snakeStyle(x, y);
    if (gameRef.current === 'flappy') return flappyStyle(x, y);
    return tetrisStyle(x, y);
  };

  const step = () => {
    if (gameRef.current === 'snake') snakeTick();
    else if (gameRef.current === 'flappy') flappyTick();
    else tetrisTick();
  };

  // Directional input shared by arrow keys and on-screen buttons
  const action = (dir) => {
    if (!gameStartedRef.current) return;
    const g = gameRef.current;
    if (g === 'snake') {
      if (dir === 'up' && dirRef.current !== 'down') dirRef.current = 'up';
      if (dir === 'down' && dirRef.current !== 'up') dirRef.current = 'down';
      if (dir === 'left' && dirRef.current !== 'right') dirRef.current = 'left';
      if (dir === 'right' && dirRef.current !== 'left') dirRef.current = 'right';
    } else if (g === 'flappy') {
      if (dir === 'up') flappyFlap();
    } else {
      if (dir === 'up') tetrisRotate();
      else if (dir === 'down') tetrisSoftDrop();
      else if (dir === 'left') tetrisMove(-1);
      else if (dir === 'right') tetrisMove(1);
    }
  };

  // Space / primary action while playing
  const primary = () => {
    const g = gameRef.current;
    if (g === 'flappy') flappyFlap();
    else if (g === 'tetris') tetrisRotate();
  };

  // ============================================================
  //  Rendering
  // ============================================================
  const render = () => {
    const screen = gameScreenRef.current;
    if (!screen) return;
    screen.innerHTML = '';
    const cellSize = window.innerWidth > 1536 ? 10 : 8;

    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.style.width = `${cellSize}px`;
        cell.style.height = `${cellSize}px`;
        cell.style.display = 'flex';
        cell.style.flexShrink = '0';

        const s = cellStyle(x, y);
        if (s) Object.assign(cell.style, s);

        screen.appendChild(cell);
      }
    }
  };

  // ============================================================
  //  Flow control
  // ============================================================
  const stopLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startGame = () => {
    setShowStartButton(false);
    setShowGameOver(false);
    setShowCongrats(false);
    setScore(0);
    initActiveGame();
    gameStartedRef.current = true;
    render();
    stopLoop();
    intervalRef.current = setInterval(step, GAMES[gameRef.current].speed);
  };

  const resetToStart = () => {
    stopLoop();
    gameStartedRef.current = false;
    setShowStartButton(true);
    setShowGameOver(false);
    setShowCongrats(false);
    setScore(0);
    initActiveGame();
    render();
  };

  const gameOver = () => {
    stopLoop();
    gameStartedRef.current = false;
    setShowGameOver(true);
  };

  const win = () => {
    stopLoop();
    gameStartedRef.current = false;
    setShowCongrats(true);
    render();
  };

  // Switch games — abandons any run in progress and resets to the new game
  const switchGame = (name) => {
    if (name === gameRef.current) return;
    gameRef.current = name;
    setCurrentGame(name);
    resetToStart();
  };

  // ============================================================
  //  Lifecycle
  // ============================================================
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameStartedRef.current) {
        switch (e.keyCode) {
          case 37: e.preventDefault(); action('left'); break;
          case 38: e.preventDefault(); action('up'); break;
          case 39: e.preventDefault(); action('right'); break;
          case 40: e.preventDefault(); action('down'); break;
          case 32: e.preventDefault(); primary(); break;
          default: break;
        }
      } else if (e.keyCode === 32) {
        e.preventDefault();
        startGame();
      }
    };

    const handleResize = () => render();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    render();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      stopLoop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const game = GAMES[currentGame];

  return (
    <div id="console" ref={rootRef}>
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
          onClick={resetToStart}
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
          onClick={resetToStart}
        >
          play-again
        </button>
      </div>

      {/* Console Menu */}
      <div id="console-menu" className="h-full flex flex-col items-end justify-between">
        <div className="flex flex-col items-end">
          {/* Game selector */}
          <div id="game-select">
            {Object.entries(GAMES).map(([key, g]) => (
              <button
                key={key}
                className={`game-tab ${currentGame === key ? 'active' : ''}`}
                onClick={() => switchGame(key)}
              >
                {g.label}
              </button>
            ))}
          </div>

          <div id="instructions" className="font-fira text-sm text-white">
            {currentGame === 'snake' && (
              <>
                <p>// use your keyboard</p>
                <p>// arrows to play</p>
              </>
            )}
            {currentGame === 'flappy' && (
              <>
                <p>// press up / space</p>
                <p>// to flap the bird</p>
              </>
            )}
            {currentGame === 'tetris' && (
              <>
                <p>// up rotate, down drop</p>
                <p>// left / right to move</p>
              </>
            )}

            <div id="buttons" className="w-full flex flex-col items-center gap-1 pt-5">
              <button id="console-button" className="button-up" onClick={() => action('up')}>
                <img src="/icons/console/arrow-button.svg" alt="up" />
              </button>

              <div className="grid grid-cols-3 gap-1">
                <button id="console-button" className="button-left" onClick={() => action('left')}>
                  <img src="/icons/console/arrow-button.svg" alt="left" className="-rotate-90" />
                </button>

                <button id="console-button" className="button-down" onClick={() => action('down')}>
                  <img src="/icons/console/arrow-button.svg" alt="down" className="rotate-180" />
                </button>

                <button id="console-button" className="button-right" onClick={() => action('right')}>
                  <img src="/icons/console/arrow-button.svg" alt="right" className="rotate-90" />
                </button>
              </div>
            </div>
          </div>

          {/* Score Board */}
          <div id="score-board" className="w-full flex flex-col pl-5">
            <p className="font-fira text-white pt-5">// {game.unit} left</p>
            <div id="score" className="grid grid-cols-5 gap-5 justify-items-center pt-5 w-fit">
              {[...Array(WIN_SCORE)].map((_, i) => (
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

export default GameConsole;
