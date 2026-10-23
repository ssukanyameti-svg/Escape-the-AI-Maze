export type KeyType = 'alpha' | 'beta' | 'omega';

export interface KeyItem {
  id: string;
  type: KeyType;
  x: number;
  y: number;
  name: string;
  color: string;
  collected: boolean;
}

export type PowerUpType = 'battery' | 'scanner' | 'emp' | 'speed';

export interface PowerUpItem {
  id: string;
  type: PowerUpType;
  x: number;
  y: number;
  collected: boolean;
}

export type PuzzleKind = 'riddle' | 'logic_gate' | 'cipher' | 'sequence';

export interface RiddlePuzzle {
  id: string;
  kind: 'riddle';
  title: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
  rewardType: 'key' | 'emp' | 'shield' | 'scanner' | 'lore';
  rewardKey?: KeyType;
}

export interface LogicGatePuzzle {
  kind: 'logic_gate';
  title: string;
  description: string;
  inputs: boolean[]; // user togglable inputs
  targetOutput: boolean;
  gateType: 'AND_OR' | 'XOR_AND' | 'NAND_NOR' | 'TRIPLE_GATE';
  hint: string;
}

export interface CipherPuzzle {
  kind: 'cipher';
  title: string;
  description: string;
  encodedWord: string;
  shift: number;
  targetWord: string;
  hint: string;
}

export interface SequencePuzzle {
  kind: 'sequence';
  title: string;
  description: string;
  sequenceLength: number;
  hint: string;
}

export type PuzzleData = RiddlePuzzle | LogicGatePuzzle | CipherPuzzle | SequencePuzzle;

export interface Terminal {
  id: string;
  x: number;
  y: number;
  name: string;
  puzzle: PuzzleData;
  solved: boolean;
  rewardClaimed: boolean;
  unlockedDoorPos?: { x: number; y: number };
}

export interface Drone {
  id: string;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  patrolPath: { x: number; y: number }[];
  currentPathIndex: number;
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
  alertState: 'patrol' | 'chase' | 'stunned';
  stunTimer: number;
  speed: number;
}

export interface LaserBarrier {
  id: string;
  x: number;
  y: number;
  active: boolean;
  cycleTimeMs: number;
  timer: number;
  isPermanentUntilDisabled?: boolean;
}

export interface LoreEntry {
  id: string;
  title: string;
  date: string;
  author: string;
  content: string;
  x: number;
  y: number;
  collected: boolean;
}

export interface MazeSector {
  id: string;
  sectorNumber: number;
  title: string;
  subtitle: string;
  description: string;
  width: number;
  height: number;
  grid: number[][]; // 0: floor, 1: wall, 2: exit door, 3: locked laser gate
  startPos: { x: number; y: number };
  exitPos: { x: number; y: number };
  keys: KeyItem[];
  terminals: Terminal[];
  drones: Drone[];
  powerUps: PowerUpItem[];
  lasers: LaserBarrier[];
  loreLogs: LoreEntry[];
  requiredKeys: KeyType[];
}

export interface PlayerStats {
  x: number;
  y: number;
  dirX: number;
  dirY: number;
  shield: number;
  maxShield: number;
  empCharges: number;
  scannerActiveTime: number;
  speedBoostTime: number;
  keys: Record<KeyType, boolean>;
  score: number;
  riddlesSolved: number;
  dronesStunned: number;
  stepsTaken: number;
}
