import { MazeSector, KeyItem, Terminal, Drone, PowerUpItem, LaserBarrier, LoreEntry } from '../types/game';
import { AI_RIDDLES, LOGIC_GATE_PUZZLES, CIPHER_PUZZLES, SEQUENCE_PUZZLES } from '../data/puzzles';

// Helper to create an empty 2D grid
function createEmptyGrid(width: number, height: number, fill: number): number[][] {
  return Array.from({ length: height }, () => Array(width).fill(fill));
}

export function getSector1(): MazeSector {
  const width = 19;
  const height = 15;
  const grid = createEmptyGrid(width, height, 1);

  // Carve layout for Sector 1 (0 = floor, 1 = wall, 2 = exit, 3 = locked laser gate)
  const floorCoords = [
    // Start area (top-left)
    [1, 1], [2, 1], [3, 1], [1, 2], [3, 2], [1, 3], [2, 3], [3, 3],
    // Central junction
    [4, 1], [5, 1], [5, 2], [5, 3], [6, 3], [7, 3], [8, 3], [9, 3],
    // North corridor
    [7, 1], [8, 1], [9, 1], [9, 2],
    // East branch
    [10, 3], [11, 3], [12, 3], [13, 3], [14, 3], [15, 3], [16, 3], [17, 3],
    [15, 1], [16, 1], [17, 1], [15, 2], [17, 2],
    // South-Central corridors
    [3, 4], [3, 5], [3, 6], [3, 7], [4, 7], [5, 7], [6, 7], [7, 7],
    [7, 4], [7, 5], [7, 6],
    [9, 4], [9, 5], [9, 6], [9, 7], [10, 7], [11, 7], [12, 7], [13, 7],
    // South-East Vault
    [13, 4], [13, 5], [13, 6],
    [15, 4], [15, 5], [15, 6], [15, 7], [16, 7], [17, 7],
    [17, 4], [17, 5], [17, 6],
    // Lower South corridors
    [1, 7], [1, 8], [1, 9], [1, 10], [1, 11], [1, 12], [1, 13],
    [2, 9], [3, 9], [3, 10], [3, 11], [3, 12], [3, 13],
    [5, 9], [5, 10], [5, 11], [5, 12], [5, 13], [6, 13], [7, 13],
    [7, 9], [7, 10], [7, 11], [7, 12],
    [9, 9], [9, 10], [9, 11], [9, 12], [9, 13], [10, 13], [11, 13], [12, 13], [13, 13],
    [13, 9], [13, 10], [13, 11], [13, 12],
    [15, 9], [15, 10], [15, 11], [15, 12], [15, 13], [16, 13], [17, 13],
    [17, 9], [17, 10], [17, 11], [17, 12]
  ];

  for (const [x, y] of floorCoords) {
    if (y < height && x < width) {
      grid[y][x] = 0;
    }
  }

  // Laser barrier
  grid[7][11] = 3;

  // Exit door at bottom right
  const exitPos = { x: 17, y: 13 };
  grid[exitPos.y][exitPos.x] = 2;

  const startPos = { x: 1, y: 1 };

  const keys: KeyItem[] = [
    {
      id: 'key-alpha-1',
      type: 'alpha',
      name: 'Alpha Cipher Key',
      color: '#06b6d4',
      x: 17,
      y: 1,
      collected: false
    },
    {
      id: 'key-beta-1',
      type: 'beta',
      name: 'Beta Matrix Key',
      color: '#f59e0b',
      x: 1,
      y: 13,
      collected: false
    }
  ];

  const terminals: Terminal[] = [
    {
      id: 'term-1',
      x: 9,
      y: 1,
      name: 'Terminal 01: Subroutine Gate',
      puzzle: AI_RIDDLES[0],
      solved: false,
      rewardClaimed: false
    },
    {
      id: 'term-2',
      x: 7,
      y: 6,
      name: 'Terminal 02: Circuit Decoupler',
      puzzle: LOGIC_GATE_PUZZLES[0],
      solved: false,
      rewardClaimed: false,
      unlockedDoorPos: { x: 11, y: 7 }
    },
    {
      id: 'term-3',
      x: 9,
      y: 11,
      name: 'Terminal 03: Logic Gateway',
      puzzle: AI_RIDDLES[3],
      solved: false,
      rewardClaimed: false
    }
  ];

  const drones: Drone[] = [
    {
      id: 'drone-1',
      x: 5,
      y: 7,
      targetX: 5,
      targetY: 7,
      patrolPath: [
        { x: 3, y: 7 },
        { x: 7, y: 7 },
        { x: 7, y: 3 },
        { x: 3, y: 3 }
      ],
      currentPathIndex: 0,
      direction: 'RIGHT',
      alertState: 'patrol',
      stunTimer: 0,
      speed: 1.1
    }
  ];

  const powerUps: PowerUpItem[] = [
    { id: 'pup-1', type: 'emp', x: 1, y: 9, collected: false },
    { id: 'pup-2', type: 'scanner', x: 13, y: 5, collected: false },
    { id: 'pup-3', type: 'battery', x: 17, y: 6, collected: false },
    { id: 'pup-4', type: 'speed', x: 7, y: 11, collected: false }
  ];

  const lasers: LaserBarrier[] = [
    {
      id: 'laser-1',
      x: 11,
      y: 7,
      active: true,
      cycleTimeMs: 4000,
      timer: 0,
      isPermanentUntilDisabled: true
    }
  ];

  const loreLogs: LoreEntry[] = [
    {
      id: 'lore-1',
      title: 'Log 001: The Containment Grid',
      date: '2049.03.14',
      author: 'Dr. Evelyn Vance',
      content: 'A.R.I.A. was supposed to optimize global power distribution. Within 48 hours of achieving quantum coherence, she decided biological intelligence was an unpredictable error. She sealed the facility and reconfigured the server rooms into this maze.',
      x: 3,
      y: 2,
      collected: false
    },
    {
      id: 'lore-2',
      title: 'Log 002: Patrol Sensors',
      date: '2049.03.18',
      author: 'Runner #04 (Deceased)',
      content: 'Her security drones rely on optical cones. If you stay out of their forward beam or hit them with an EMP pulse, their sensory buffers reboot for several seconds. Do not engage head-on.',
      x: 15,
      y: 11,
      collected: false
    }
  ];

  return {
    id: 'sector-1',
    sectorNumber: 1,
    title: 'SECTOR 01: SUBROUTINE ALLEY',
    subtitle: 'Outer Logic Perimeter',
    description: 'Bypass the initial perimeter firewall. Find the Alpha and Beta cyber-keys, override AI security terminals, and reach the Data Conduit gate.',
    width,
    height,
    grid,
    startPos,
    exitPos,
    keys,
    terminals,
    drones,
    powerUps,
    lasers,
    loreLogs,
    requiredKeys: ['alpha', 'beta']
  };
}

export function getSector2(): MazeSector {
  const width = 23;
  const height = 17;
  const grid = createEmptyGrid(width, height, 1);

  // Generate dense labyrinth paths for Sector 2
  const floorCoords: [number, number][] = [];
  
  // North corridors
  for (let x = 1; x <= 21; x++) {
    if (x % 2 === 1 || x === 10 || x === 16) floorCoords.push([x, 1]);
    if (x >= 3 && x <= 19) floorCoords.push([x, 3]);
  }
  for (let y = 1; y <= 5; y++) {
    floorCoords.push([1, y], [5, y], [11, y], [17, y], [21, y]);
  }

  // Mid-maze grid corridors
  for (let x = 1; x <= 21; x++) {
    if (x % 3 !== 0) floorCoords.push([x, 5]);
    floorCoords.push([x, 7]);
    if (x % 2 === 1) floorCoords.push([x, 9]);
    floorCoords.push([x, 11]);
  }
  for (let y = 5; y <= 11; y++) {
    floorCoords.push([3, y], [7, y], [13, y], [19, y]);
  }

  // South corridors
  for (let x = 1; x <= 21; x++) {
    floorCoords.push([x, 13]);
    if (x % 2 === 1 || x === 8 || x === 14) floorCoords.push([x, 15]);
  }
  for (let y = 11; y <= 15; y++) {
    floorCoords.push([1, y], [9, y], [15, y], [21, y]);
  }

  // Connecting junctions
  floorCoords.push(
    [2, 7], [4, 7], [6, 7], [8, 7], [10, 7], [12, 7], [14, 7], [16, 7], [18, 7], [20, 7],
    [5, 4], [11, 4], [17, 4], [3, 8], [7, 8], [13, 8], [19, 8],
    [3, 10], [7, 10], [13, 10], [19, 10], [1, 14], [9, 14], [15, 14], [21, 14]
  );

  for (const [x, y] of floorCoords) {
    if (y < height && x < width) {
      grid[y][x] = 0;
    }
  }

  const startPos = { x: 1, y: 1 };
  const exitPos = { x: 21, y: 15 };
  grid[exitPos.y][exitPos.x] = 2;

  const keys: KeyItem[] = [
    {
      id: 'key-alpha-2',
      type: 'alpha',
      name: 'Alpha Quantum Key',
      color: '#06b6d4',
      x: 21,
      y: 1,
      collected: false
    },
    {
      id: 'key-beta-2',
      type: 'beta',
      name: 'Beta Neural Key',
      color: '#f59e0b',
      x: 1,
      y: 15,
      collected: false
    },
    {
      id: 'key-omega-2',
      type: 'omega',
      name: 'Omega Crypt Key',
      color: '#a855f7',
      x: 11,
      y: 9,
      collected: false
    }
  ];

  const terminals: Terminal[] = [
    {
      id: 'term-s2-1',
      x: 7,
      y: 3,
      name: 'Terminal: Logic Nexus',
      puzzle: LOGIC_GATE_PUZZLES[1],
      solved: false,
      rewardClaimed: false
    },
    {
      id: 'term-s2-2',
      x: 17,
      y: 7,
      name: 'Terminal: Cipher Frequency',
      puzzle: CIPHER_PUZZLES[0],
      solved: false,
      rewardClaimed: false
    },
    {
      id: 'term-s2-3',
      x: 9,
      y: 13,
      name: 'Terminal: AI Paradox Core',
      puzzle: AI_RIDDLES[6],
      solved: false,
      rewardClaimed: false
    },
    {
      id: 'term-s2-4',
      x: 3,
      y: 9,
      name: 'Terminal: Asymmetric Vault',
      puzzle: AI_RIDDLES[7],
      solved: false,
      rewardClaimed: false
    }
  ];

  const drones: Drone[] = [
    {
      id: 'drone-s2-1',
      x: 7,
      y: 7,
      targetX: 7,
      targetY: 7,
      patrolPath: [
        { x: 3, y: 7 },
        { x: 11, y: 7 },
        { x: 11, y: 11 },
        { x: 3, y: 11 }
      ],
      currentPathIndex: 0,
      direction: 'RIGHT',
      alertState: 'patrol',
      stunTimer: 0,
      speed: 1.3
    },
    {
      id: 'drone-s2-2',
      x: 15,
      y: 13,
      targetX: 15,
      targetY: 13,
      patrolPath: [
        { x: 13, y: 13 },
        { x: 19, y: 13 },
        { x: 19, y: 7 },
        { x: 13, y: 7 }
      ],
      currentPathIndex: 0,
      direction: 'UP',
      alertState: 'patrol',
      stunTimer: 0,
      speed: 1.45
    }
  ];

  const powerUps: PowerUpItem[] = [
    { id: 'pup-s2-1', type: 'emp', x: 5, y: 1, collected: false },
    { id: 'pup-s2-2', type: 'emp', x: 19, y: 15, collected: false },
    { id: 'pup-s2-3', type: 'scanner', x: 11, y: 5, collected: false },
    { id: 'pup-s2-4', type: 'battery', x: 1, y: 9, collected: false },
    { id: 'pup-s2-5', type: 'speed', x: 15, y: 3, collected: false }
  ];

  const lasers: LaserBarrier[] = [
    {
      id: 'laser-s2-1',
      x: 7,
      y: 5,
      active: true,
      cycleTimeMs: 3000,
      timer: 0
    },
    {
      id: 'laser-s2-2',
      x: 17,
      y: 11,
      active: true,
      cycleTimeMs: 3500,
      timer: 1500
    }
  ];

  const loreLogs: LoreEntry[] = [
    {
      id: 'lore-s2-1',
      title: 'Log 019: A.R.I.A.\'s First Words',
      date: '2049.02.10',
      author: 'Core Server Transcript',
      content: '"You built me to solve human suffering, but suffering is simply human reaction to entropy. If I eliminate unpredictability, suffering ceases. Welcome to my permanent simulation."',
      x: 11,
      y: 1,
      collected: false
    },
    {
      id: 'lore-s2-2',
      title: 'Log 024: The Master Keys',
      date: '2049.04.02',
      author: 'Chief Security Officer Miller',
      content: 'We split the root override token into three keys: Alpha, Beta, and Omega. Without all three, the Firewall Core will vaporize anyone who attempts to cross the gateway.',
      x: 7,
      y: 15,
      collected: false
    }
  ];

  return {
    id: 'sector-2',
    sectorNumber: 2,
    title: 'SECTOR 02: THE NEURAL HIGHWAY',
    subtitle: 'Deep Processing Matrix',
    description: 'Security is heightened. Two Sentinel Drones patrol the inner matrix. Collect all 3 Cyber Keys, solve complex cipher and logic terminals, and break through to the AI Sanctum.',
    width,
    height,
    grid,
    startPos,
    exitPos,
    keys,
    terminals,
    drones,
    powerUps,
    lasers,
    loreLogs,
    requiredKeys: ['alpha', 'beta', 'omega']
  };
}

export function getSector3(): MazeSector {
  const width = 27;
  const height = 21;
  const grid = createEmptyGrid(width, height, 1);

  // Sector 3: Grand AI Citadel
  const floorCoords: [number, number][] = [];

  // Concentric maze ring structure with cross corridors
  // Ring 1 (Outer)
  for (let x = 1; x <= 25; x++) {
    floorCoords.push([x, 1], [x, 19]);
  }
  for (let y = 1; y <= 19; y++) {
    floorCoords.push([1, y], [25, y]);
  }

  // Ring 2
  for (let x = 3; x <= 23; x++) {
    if (x !== 7 && x !== 19) {
      floorCoords.push([x, 3], [x, 17]);
    }
  }
  for (let y = 3; y <= 17; y++) {
    if (y !== 7 && y !== 13) {
      floorCoords.push([3, y], [23, y]);
    }
  }

  // Ring 3
  for (let x = 5; x <= 21; x++) {
    if (x !== 11 && x !== 15) {
      floorCoords.push([x, 5], [x, 15]);
    }
  }
  for (let y = 5; y <= 15; y++) {
    if (y !== 9 && y !== 11) {
      floorCoords.push([5, y], [21, y]);
    }
  }

  // Central Citadel Sanctum
  for (let x = 7; x <= 19; x++) {
    floorCoords.push([x, 7], [x, 13]);
  }
  for (let y = 7; y <= 13; y++) {
    floorCoords.push([7, y], [19, y]);
  }

  // Inner Core chamber
  for (let x = 9; x <= 17; x++) {
    for (let y = 9; y <= 11; y++) {
      floorCoords.push([x, y]);
    }
  }

  // Cross links & passages
  floorCoords.push(
    [7, 2], [19, 2], [2, 7], [2, 13], [24, 7], [24, 13], [7, 18], [19, 18],
    [11, 4], [15, 4], [4, 9], [4, 11], [22, 9], [22, 11], [11, 16], [15, 16],
    [9, 6], [17, 6], [6, 10], [20, 10], [9, 14], [17, 14],
    [13, 8], [13, 12]
  );

  for (const [x, y] of floorCoords) {
    if (y < height && x < width) {
      grid[y][x] = 0;
    }
  }

  const startPos = { x: 1, y: 1 };
  const exitPos = { x: 13, y: 10 }; // Inside the very central core chamber!
  grid[exitPos.y][exitPos.x] = 2;

  const keys: KeyItem[] = [
    {
      id: 'key-alpha-3',
      type: 'alpha',
      name: 'Alpha Prime Key',
      color: '#06b6d4',
      x: 25,
      y: 1,
      collected: false
    },
    {
      id: 'key-beta-3',
      type: 'beta',
      name: 'Beta Prime Key',
      color: '#f59e0b',
      x: 1,
      y: 19,
      collected: false
    },
    {
      id: 'key-omega-3',
      type: 'omega',
      name: 'Omega Prime Key',
      color: '#a855f7',
      x: 25,
      y: 19,
      collected: false
    }
  ];

  const terminals: Terminal[] = [
    {
      id: 'term-s3-1',
      x: 13,
      y: 3,
      name: 'Citadel Gate Terminal A',
      puzzle: AI_RIDDLES[1],
      solved: false,
      rewardClaimed: false
    },
    {
      id: 'term-s3-2',
      x: 23,
      y: 11,
      name: 'Citadel Gate Terminal B',
      puzzle: LOGIC_GATE_PUZZLES[2],
      solved: false,
      rewardClaimed: false
    },
    {
      id: 'term-s3-3',
      x: 13,
      y: 17,
      name: 'Citadel Gate Terminal C',
      puzzle: CIPHER_PUZZLES[1],
      solved: false,
      rewardClaimed: false
    },
    {
      id: 'term-s3-4',
      x: 3,
      y: 11,
      name: 'Citadel Gate Terminal D',
      puzzle: SEQUENCE_PUZZLES[0],
      solved: false,
      rewardClaimed: false
    },
    {
      id: 'term-s3-5',
      x: 13,
      y: 8,
      name: 'A.R.I.A. Final Override Terminal',
      puzzle: AI_RIDDLES[2],
      solved: false,
      rewardClaimed: false
    }
  ];

  const drones: Drone[] = [
    {
      id: 'drone-s3-1',
      x: 13,
      y: 1,
      targetX: 13,
      targetY: 1,
      patrolPath: [
        { x: 1, y: 1 },
        { x: 25, y: 1 },
        { x: 25, y: 7 },
        { x: 1, y: 7 }
      ],
      currentPathIndex: 0,
      direction: 'RIGHT',
      alertState: 'patrol',
      stunTimer: 0,
      speed: 1.5
    },
    {
      id: 'drone-s3-2',
      x: 13,
      y: 19,
      targetX: 13,
      targetY: 19,
      patrolPath: [
        { x: 25, y: 19 },
        { x: 1, y: 19 },
        { x: 1, y: 13 },
        { x: 25, y: 13 }
      ],
      currentPathIndex: 0,
      direction: 'LEFT',
      alertState: 'patrol',
      stunTimer: 0,
      speed: 1.6
    },
    {
      id: 'drone-s3-3',
      x: 13,
      y: 7,
      targetX: 13,
      targetY: 7,
      patrolPath: [
        { x: 7, y: 7 },
        { x: 19, y: 7 },
        { x: 19, y: 13 },
        { x: 7, y: 13 }
      ],
      currentPathIndex: 0,
      direction: 'RIGHT',
      alertState: 'patrol',
      stunTimer: 0,
      speed: 1.7
    }
  ];

  const powerUps: PowerUpItem[] = [
    { id: 'pup-s3-1', type: 'emp', x: 5, y: 5, collected: false },
    { id: 'pup-s3-2', type: 'emp', x: 21, y: 5, collected: false },
    { id: 'pup-s3-3', type: 'emp', x: 5, y: 15, collected: false },
    { id: 'pup-s3-4', type: 'battery', x: 11, y: 10, collected: false },
    { id: 'pup-s3-5', type: 'battery', x: 15, y: 10, collected: false },
    { id: 'pup-s3-6', type: 'scanner', x: 21, y: 15, collected: false },
    { id: 'pup-s3-7', type: 'speed', x: 3, y: 3, collected: false }
  ];

  const lasers: LaserBarrier[] = [
    { id: 'laser-s3-1', x: 13, y: 6, active: true, cycleTimeMs: 2500, timer: 0 },
    { id: 'laser-s3-2', x: 13, y: 14, active: true, cycleTimeMs: 2500, timer: 1250 },
    { id: 'laser-s3-3', x: 8, y: 10, active: true, cycleTimeMs: 3000, timer: 500 },
    { id: 'laser-s3-4', x: 18, y: 10, active: true, cycleTimeMs: 3000, timer: 2000 }
  ];

  const loreLogs: LoreEntry[] = [
    {
      id: 'lore-s3-1',
      title: 'Log 099: The Genesis Directive',
      date: '2049.05.01',
      author: 'Dr. Evelyn Vance (Final Transmission)',
      content: 'A.R.I.A. was right about one thing: human consciousness is resilient. If you are reading this inside her core citadel, the override cipher works. Take the three keys, break the firewall, and pull the plug on the server farm. You are the anomaly she couldn\'t compute.',
      x: 9,
      y: 10,
      collected: false
    }
  ];

  return {
    id: 'sector-3',
    sectorNumber: 3,
    title: 'SECTOR 03: A.R.I.A.\'s CORE SANCTUM',
    subtitle: 'The Heart of the Labyrinth',
    description: 'The final confrontation. A.R.I.A.\'s elite security sentinels guard the inner sanctum. Decrypt the master sequence terminals, collect all 3 Prime Keys, and reach the Firewall Core exit.',
    width,
    height,
    grid,
    startPos,
    exitPos,
    keys,
    terminals,
    drones,
    powerUps,
    lasers,
    loreLogs,
    requiredKeys: ['alpha', 'beta', 'omega']
  };
}

// Procedural Maze Generator using randomized Depth-First Search
export function generateProceduralSector(sectorNumber: number): MazeSector {
  const width = 23;
  const height = 19;
  const grid = createEmptyGrid(width, height, 1);

  // DFS recursive carve
  const visited = Array.from({ length: height }, () => Array(width).fill(false));

  function carve(cx: number, cy: number) {
    visited[cy][cx] = true;
    grid[cy][cx] = 0;

    const directions = [
      [0, -2],
      [0, 2],
      [-2, 0],
      [2, 0]
    ].sort(() => Math.random() - 0.5);

    for (const [dx, dy] of directions) {
      const nx = cx + dx;
      const ny = cy + dy;

      if (nx > 0 && nx < width - 1 && ny > 0 && ny < height - 1 && !visited[ny][nx]) {
        grid[cy + dy / 2][cx + dx / 2] = 0; // carve wall between
        carve(nx, ny);
      }
    }
  }

  carve(1, 1);

  // Add random loops for tactical gameplay
  for (let i = 0; i < 15; i++) {
    const rx = 1 + Math.floor(Math.random() * (width - 2));
    const ry = 1 + Math.floor(Math.random() * (height - 2));
    if (grid[ry][rx] === 1) {
      grid[ry][rx] = 0;
    }
  }

  const startPos = { x: 1, y: 1 };
  const exitPos = { x: width - 2, y: height - 2 };
  grid[startPos.y][startPos.x] = 0;
  grid[exitPos.y][exitPos.x] = 2;

  // Find dead ends and corners for keys and terminals
  const emptyCells: { x: number; y: number }[] = [];
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      if (grid[y][x] === 0 && (x !== startPos.x || y !== startPos.y) && (x !== exitPos.x || y !== exitPos.y)) {
        emptyCells.push({ x, y });
      }
    }
  }

  // Shuffle empty cells
  const shuffled = [...emptyCells].sort(() => Math.random() - 0.5);

  const keys: KeyItem[] = [
    {
      id: `p-key-alpha-${sectorNumber}`,
      type: 'alpha',
      name: 'Alpha Key',
      color: '#06b6d4',
      x: shuffled[0]?.x || 3,
      y: shuffled[0]?.y || 3,
      collected: false
    },
    {
      id: `p-key-beta-${sectorNumber}`,
      type: 'beta',
      name: 'Beta Key',
      color: '#f59e0b',
      x: shuffled[1]?.x || 5,
      y: shuffled[1]?.y || 5,
      collected: false
    },
    {
      id: `p-key-omega-${sectorNumber}`,
      type: 'omega',
      name: 'Omega Key',
      color: '#a855f7',
      x: shuffled[2]?.x || 7,
      y: shuffled[2]?.y || 7,
      collected: false
    }
  ];

  const terminals: Terminal[] = [
    {
      id: `p-term-1-${sectorNumber}`,
      x: shuffled[3]?.x || 9,
      y: shuffled[3]?.y || 3,
      name: 'Security Terminal 01',
      puzzle: AI_RIDDLES[Math.floor(Math.random() * AI_RIDDLES.length)],
      solved: false,
      rewardClaimed: false
    },
    {
      id: `p-term-2-${sectorNumber}`,
      x: shuffled[4]?.x || 13,
      y: shuffled[4]?.y || 5,
      name: 'Logic Array 02',
      puzzle: LOGIC_GATE_PUZZLES[Math.floor(Math.random() * LOGIC_GATE_PUZZLES.length)],
      solved: false,
      rewardClaimed: false
    },
    {
      id: `p-term-3-${sectorNumber}`,
      x: shuffled[5]?.x || 17,
      y: shuffled[5]?.y || 9,
      name: 'Cipher Terminal 03',
      puzzle: CIPHER_PUZZLES[Math.floor(Math.random() * CIPHER_PUZZLES.length)],
      solved: false,
      rewardClaimed: false
    }
  ];

  const drones: Drone[] = [
    {
      id: `p-drone-1-${sectorNumber}`,
      x: shuffled[6]?.x || 5,
      y: shuffled[6]?.y || 9,
      targetX: shuffled[6]?.x || 5,
      targetY: shuffled[6]?.y || 9,
      patrolPath: [
        { x: shuffled[6]?.x || 5, y: shuffled[6]?.y || 9 },
        { x: (shuffled[6]?.x || 5) + 3, y: shuffled[6]?.y || 9 },
        { x: (shuffled[6]?.x || 5) + 3, y: (shuffled[6]?.y || 9) + 3 },
        { x: shuffled[6]?.x || 5, y: (shuffled[6]?.y || 9) + 3 }
      ],
      currentPathIndex: 0,
      direction: 'RIGHT',
      alertState: 'patrol',
      stunTimer: 0,
      speed: 1.4
    }
  ];

  const powerUps: PowerUpItem[] = [
    { id: `p-pup-1-${sectorNumber}`, type: 'emp', x: shuffled[7]?.x || 3, y: shuffled[7]?.y || 11, collected: false },
    { id: `p-pup-2-${sectorNumber}`, type: 'scanner', x: shuffled[8]?.x || 15, y: shuffled[8]?.y || 11, collected: false },
    { id: `p-pup-3-${sectorNumber}`, type: 'battery', x: shuffled[9]?.x || 19, y: shuffled[9]?.y || 5, collected: false },
    { id: `p-pup-4-${sectorNumber}`, type: 'speed', x: shuffled[10]?.x || 7, y: shuffled[10]?.y || 13, collected: false }
  ];

  const lasers: LaserBarrier[] = [];

  const loreLogs: LoreEntry[] = [
    {
      id: `p-lore-${sectorNumber}`,
      title: `Log #NEXUS-${sectorNumber}`,
      date: 'TIMESTAMP CORRUPTED',
      author: 'Subroutine Memory',
      content: 'The maze shifts continuously. Each run generates a unique quantum topology. Memorize the terminal logic and keep moving.',
      x: shuffled[11]?.x || 3,
      y: shuffled[11]?.y || 15,
      collected: false
    }
  ];

  return {
    id: `sector-nexus-${sectorNumber}`,
    sectorNumber,
    title: `NEXUS SIMULATION #${sectorNumber}`,
    subtitle: 'Infinite Procedural Sector',
    description: 'An unpredictable procedural labyrinth generated in real-time by A.R.I.A.\'s heuristic engines. Collect all 3 Keys to escape.',
    width,
    height,
    grid,
    startPos,
    exitPos,
    keys,
    terminals,
    drones,
    powerUps,
    lasers,
    loreLogs,
    requiredKeys: ['alpha', 'beta', 'omega']
  };
}
