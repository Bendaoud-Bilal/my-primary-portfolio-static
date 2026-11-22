import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './GameConsole.css';

/*
 * GameConsole — a single retro console that hosts three games
 * (Snake, Flappy Bird, Tetris) sharing the exact same console design.
 *
 * All games use the same 24 x 40 screen, the same green palette and the same
 * 10-step win indicator. Reaching a score of 10 wins ("WELL DONE!"); failing
 * shows "GAME OVER!".
 *
 * Snake and Tetris are drawn on the cell grid. Flappy Bird runs on continuous
 * physics (requestAnimationFrame) and is drawn with overlays — an SVG bird and
 * pipe bars — so it moves smoothly instead of jumping cell by cell.
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
  flappy: { label: 'flappy', unit: 'pipes' },
  tetris: { label: 'tetris', unit: 'lines', speed: 360 },
};

// --- Flappy Bird tuning (all distances in cells, times in seconds) ---
const BIRD_CX = 6.5;     // bird centre x
const BIRD_R = 0.9;      // bird collision radius
const GAP = 10;          // vertical opening between pipes
const PIPE_W = 2;        // pipe width
const SPACING = 17;      // horizontal distance between pipes
const SPEED = 8;         // pipe scroll speed (cells / s)
const GRAVITY = 55;      // downward acceleration (cells / s^2)
const FLAP = -15;        // upward velocity after a flap (cells / s)
const MAX_FALL = 26;     // terminal fall speed (cells / s)

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
const PF_H = 32;
const PF_OFF_X = (COLS - PF_W) / 2; // 6
const PF_OFF_Y = 4;

const snakeStart = () => [
  { x: 10, y: 12 }, { x: 10, y: 13 }, { x: 10, y: 14 },
  { x: 10, y: 15 }, { x: 10, y: 16 }, { x: 10, y: 17 },
  { x: 10, y: 18 }, { x: 11, y: 18 }, { x: 12, y: 18 },
  { x: 13, y: 18 }, { x: 14, y: 18 }, { x: 15, y: 18 },
  { x: 15, y: 19 }, { x: 15, y: 20 }, { x: 15, y: 21 },
  { x: 15, y: 22 }, { x: 15, y: 23 }, { x: 15, y: 24 },
];

// Pixel size of one cell — uses the same media query as the compact console in
// GameConsole.css, so the grid always matches the #game-screen size
const SMALL_SCREEN_QUERY = '(max-width: 1536px), (max-height: 700px)';
const cellSize = () => (window.matchMedia(SMALL_SCREEN_QUERY).matches ? 8 : 10);

const GameConsole = () => {
  const [currentGame, setCurrentGame] = useState('snake');
  const [showStartButton, setShowStartButton] = useState(true);
  const [showGameOver, setShowGameOver] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const rootRef = useRef(null);
  const gameScreenRef = useRef(null);
  const birdRef = useRef(null);
  const pipesLayerRef = useRef(null);
  const tetrisWellRef = useRef(null);

  // Shared control state
  const gameRef = useRef('snake');       // mirror of currentGame for callbacks
  const gameStartedRef = useRef(false);
  const intervalRef = useRef(null);      // snake / tetris loop
  const rafRef = useRef(null);           // flappy loop
  const lastTsRef = useRef(null);
  const scoreRef = useRef(0);

  // Snake state
  const snakeRef = useRef(snakeStart());
  const foodRef = useRef({ x: 10, y: 5 });
  const dirRef = useRef('up');

  // Flappy state (continuous)
  const birdYRef = useRef(ROWS / 2);
  const birdVelRef = useRef(0);
  const pipesRef = useRef([]);

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
  //  FLAPPY BIRD (continuous physics, drawn with overlays)
  // ============================================================
  const randomGapTop = () => 3 + Math.random() * (ROWS - GAP - 6);

  const flappyReset = () => {
    birdYRef.current = ROWS / 2;
    birdVelRef.current = 0;
    pipesRef.current = [
      { x: COLS + 2, gapTop: randomGapTop(), passed: false },
      { x: COLS + 2 + SPACING, gapTop: randomGapTop(), passed: false },
    ];
  };

  const flappyFlap = () => {
    birdVelRef.current = FLAP;
  };

  const drawFlappy = () => {
    const cs = cellSize();

    const bird = birdRef.current;
    if (bird) {
      const size = 2.6 * cs;
      // nose up when rising, dive when falling
      const tilt = Math.max(-25, Math.min(70, birdVelRef.current * 3));
      bird.style.width = `${size}px`;
      bird.style.height = `${size}px`;
      bird.style.transform =
        `translate(${BIRD_CX * cs - size / 2}px, ${birdYRef.current * cs - size / 2}px) rotate(${tilt}deg)`;
    }

    const layer = pipesLayerRef.current;
    if (layer) {
      let html = '';
      for (const p of pipesRef.current) {
        const left = p.x * cs;
        const width = PIPE_W * cs;
        const topH = p.gapTop * cs;
        const bottomTop = (p.gapTop + GAP) * cs;
        const bottomH = (ROWS - p.gapTop - GAP) * cs;
        html += `<div class="pipe pipe-top" style="left:${left}px;top:0;width:${width}px;height:${topH}px"></div>`;
        html += `<div class="pipe pipe-bottom" style="left:${left}px;top:${bottomTop}px;width:${width}px;height:${bottomH}px"></div>`;
      }
      layer.innerHTML = html;
    }
  };

  const flappyFrame = (ts) => {
    if (!gameStartedRef.current) return;
    if (lastTsRef.current === null) {
      lastTsRef.current = ts;
      rafRef.current = requestAnimationFrame(flappyFrame);
      return;
    }
    // clamp dt so a background tab doesn't teleport the bird
    const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000);
    lastTsRef.current = ts;

    birdVelRef.current = Math.min(MAX_FALL, birdVelRef.current + GRAVITY * dt);
    birdYRef.current += birdVelRef.current * dt;

    for (const p of pipesRef.current) p.x -= SPEED * dt;

    // score each pipe once the bird has cleared it
    for (const p of pipesRef.current) {
      if (!p.passed && p.x + PIPE_W < BIRD_CX - BIRD_R) {
        p.passed = true;
        setScore(scoreRef.current + 1);
      }
    }

    // recycle off-screen pipes and keep the next ones coming
    pipesRef.current = pipesRef.current.filter((p) => p.x > -PIPE_W - 1);
    const lastX = pipesRef.current.reduce((m, p) => Math.max(m, p.x), 0);
    if (pipesRef.current.length < 2 || lastX <= COLS - SPACING) {
      pipesRef.current.push({ x: lastX + SPACING, gapTop: randomGapTop(), passed: false });
    }

    if (scoreRef.current >= WIN_SCORE) {
      drawFlappy();
      return win();
    }

    const by = birdYRef.current;
    if (by - BIRD_R < 0 || by + BIRD_R > ROWS) {
      drawFlappy();
      return gameOver();
    }
    for (const p of pipesRef.current) {
      const overlapsX = BIRD_CX + BIRD_R > p.x && BIRD_CX - BIRD_R < p.x + PIPE_W;
      if (overlapsX && (by - BIRD_R < p.gapTop || by + BIRD_R > p.gapTop + GAP)) {
        drawFlappy();
        return gameOver();
      }
    }

    drawFlappy();
    rafRef.current = requestAnimationFrame(flappyFrame);
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

  // Visible well around the playfield
  const positionTetrisWell = () => {
    const el = tetrisWellRef.current;
    if (!el) return;
    const cs = cellSize();
    el.style.left = `${PF_OFF_X * cs}px`;
    el.style.top = `${PF_OFF_Y * cs}px`;
    el.style.width = `${PF_W * cs}px`;
    el.style.height = `${PF_H * cs}px`;
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
    return tetrisStyle(x, y);
  };

  const step = () => {
    if (gameRef.current === 'snake') snakeTick();
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

    // Flappy is drawn entirely by its overlays
    if (gameRef.current === 'flappy') return;

    const cs = cellSize();
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.style.width = `${cs}px`;
        cell.style.height = `${cs}px`;
        cell.style.display = 'flex';
        cell.style.flexShrink = '0';

        const s = cellStyle(x, y);
        if (s) Object.assign(cell.style, s);

        screen.appendChild(cell);
      }
    }
  };

  // Full redraw for the active game (grid + overlays)
  const layout = () => {
    render();
    if (gameRef.current === 'flappy') drawFlappy();
    if (gameRef.current === 'tetris') positionTetrisWell();
  };

  // ============================================================
  //  Flow control
  // ============================================================
  const stopLoop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const startGame = () => {
    stopLoop();
    setShowStartButton(false);
    setShowGameOver(false);
    setShowCongrats(false);
    setScore(0);
    initActiveGame();
    gameStartedRef.current = true;
    layout();

    if (gameRef.current === 'flappy') {
      lastTsRef.current = null;
      flappyFlap(); // a small hop to start
      rafRef.current = requestAnimationFrame(flappyFrame);
    } else {
      intervalRef.current = setInterval(step, GAMES[gameRef.current].speed);
    }
  };

  const resetToStart = () => {
    stopLoop();
    gameStartedRef.current = false;
    setShowStartButton(true);
    setShowGameOver(false);
    setShowCongrats(false);
    setScore(0);
    initActiveGame();
    layout();
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

    const handleResize = () => layout();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('resize', handleResize);
    layout();

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

      {/* Game Screen + overlays */}
      <div id="screen-wrap">
        <div id="game-screen" ref={gameScreenRef}></div>

        {/* Flappy: pipes + bird */}
        <div
          id="pipes-layer"
          ref={pipesLayerRef}
          style={{ display: currentGame === 'flappy' ? 'block' : 'none' }}
        ></div>
        <svg
          id="flappy-bird"
          ref={birdRef}
          viewBox="0 0 26 20"
          aria-hidden="true"
          style={{ display: currentGame === 'flappy' ? 'block' : 'none' }}
        >
          {/* body */}
          <ellipse cx="11.5" cy="11" rx="9.5" ry="7.5" fill={GREEN} />
          {/* wing */}
          <path d="M3.5 11.5c2.5-3.5 7-3.8 9.5-1.2-2.3 2.9-6.6 3.6-9.5 1.2z" fill="#011627" opacity="0.28" />
          {/* beak */}
          <path d="M20 9.2 25.5 10.6 20 12.6z" fill={GREEN} />
          {/* eye */}
          <circle cx="16" cy="7.8" r="2.1" fill="#011627" />
          <circle cx="16.7" cy="7.2" r="0.6" fill="#E5E9F0" />
        </svg>

        {/* Tetris: visible well */}
        <div
          id="tetris-well"
          ref={tetrisWellRef}
          style={{ display: currentGame === 'tetris' ? 'block' : 'none' }}
        ></div>
      </div>

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
      <div id="console-menu" className="flex flex-col justify-between">
        <div className="flex flex-col">
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
                <p>// arrows to move</p>
                <p>// up to rotate</p>
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
          <div id="score-board" className="flex flex-col">
            <p className="font-fira text-white pt-5">// {game.unit} left</p>
            <div id="score" className="grid grid-cols-5 gap-5 justify-items-center pt-5 w-fit mx-auto">
              {[...Array(WIN_SCORE)].map((_, i) => (
                <div key={i} className="food"></div>
              ))}
            </div>
          </div>
        </div>

        {/* Skip */}
        <Link id="skip-btn" to="/about-me" className="font-fira flex self-end hover:bg-white/20">
          skip
        </Link>
      </div>
    </div>
  );
};

export default GameConsole;
