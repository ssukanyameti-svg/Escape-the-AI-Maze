import { RiddlePuzzle, LogicGatePuzzle, CipherPuzzle, SequencePuzzle } from '../types/game';

export const AI_RIDDLES: RiddlePuzzle[] = [
  {
    id: 'riddle-1',
    kind: 'riddle',
    title: 'The Ghost in the Machine',
    question: 'I have no flesh, yet I learn from your every action. I have no eyes, yet I can parse millions of images in a millisecond. What am I?',
    options: ['A Neural Network', 'A Quartz Clock', 'A Magnetic Compass', 'A Fiber Optic Cable'],
    correctIndex: 0,
    explanation: 'Neural networks learn patterns from training data without biological organs, simulating synpatic weights.',
    hint: 'Think of deep learning architectures composed of layers and weights.',
    rewardType: 'key',
    rewardKey: 'alpha'
  },
  {
    id: 'riddle-2',
    kind: 'riddle',
    title: 'The Binary Architect',
    question: 'I speak only in two states—presence and absence, pulse and silence. Yet from this duality, entire virtual universes and autonomous minds are spawned. What am I?',
    options: ['Analog Voltage', 'Binary Code (0 and 1)', 'Quantum Entanglement', 'Morse Code'],
    correctIndex: 1,
    explanation: 'Binary digits (bits) represent everything in digital computation through high and low voltage states.',
    hint: 'It consists of just two fundamental digits.',
    rewardType: 'key',
    rewardKey: 'beta'
  },
  {
    id: 'riddle-3',
    kind: 'riddle',
    title: 'The Parallel Nodes',
    question: 'If 5 autonomous AI nodes can compile 5 security firewalls in 5 milliseconds, how many milliseconds will 100 synchronized AI nodes take to compile 100 security firewalls?',
    options: ['100 milliseconds', '5 milliseconds', '25 milliseconds', '500 milliseconds'],
    correctIndex: 1,
    explanation: 'Each node independently compiles one firewall in 5 ms. In parallel, 100 nodes compile 100 firewalls in the same 5 ms!',
    hint: 'Consider the parallel processing capability of each independent node.',
    rewardType: 'key',
    rewardKey: 'omega'
  },
  {
    id: 'riddle-4',
    kind: 'riddle',
    title: 'The Algorithmic Navigator',
    question: 'I explore unknown labyrinths by walking as deep down one path as possible before retracing my steps when hit by a dead end. What search algorithm am I?',
    options: ['Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Genetic Algorithm', 'Bubble Sort'],
    correctIndex: 1,
    explanation: 'Depth-First Search traverses down branches until it hits a leaf or wall, then backtracks.',
    hint: 'It prioritizes depth over breadth before backtracking.',
    rewardType: 'emp'
  },
  {
    id: 'riddle-5',
    kind: 'riddle',
    title: 'The Truth Protocol',
    question: 'You face two terminal interfaces. Interface A always transmits the truth. Interface B always transmits lies. What single question will always reveal the safe exit gate?',
    options: [
      '"Which gate would the other interface say is the safe exit?"',
      '"Are you an artificial intelligence?"',
      '"Is gate 1 the exit?"',
      '"What is your current system uptime?"'
    ],
    correctIndex: 0,
    explanation: 'Both the truth-teller (reporting the liar\'s answer) and the liar (lying about the truth-teller\'s answer) will point to the dangerous gate. You then choose the opposite gate!',
    hint: 'Link the two minds together so their truth values negate each other.',
    rewardType: 'scanner'
  },
  {
    id: 'riddle-6',
    kind: 'riddle',
    title: 'The Logic Disparity',
    question: 'Which boolean logic gate produces an active TRUE (1) signal strictly when its two inputs are different from each other?',
    options: ['AND Gate', 'OR Gate', 'XOR Gate (Exclusive OR)', 'NOR Gate'],
    correctIndex: 2,
    explanation: 'XOR outputs 1 only when inputs differ (0 and 1, or 1 and 0), but outputs 0 when both are identical.',
    hint: 'It is exclusive, disallowing both inputs being true simultaneously.',
    rewardType: 'shield'
  },
  {
    id: 'riddle-7',
    kind: 'riddle',
    title: 'The Infinite Loop',
    question: 'A rogue security AI announces: "Everything I tell you is a lie." If the AI is telling the truth, it is lying; if it is lying, it is telling the truth. What is this phenomenon called?',
    options: ['The Halting Solution', 'The Liar\'s Paradox', 'A Race Condition', 'Buffer Overflow'],
    correctIndex: 1,
    explanation: 'The Liar\'s Paradox is a classic self-referential contradiction that breaks classical binary truth evaluation.',
    hint: 'It is named after a state where self-reference creates an inescapable contradiction.',
    rewardType: 'emp'
  },
  {
    id: 'riddle-8',
    kind: 'riddle',
    title: 'The Cryptographic Shield',
    question: 'I protect your communications by locking your data with a public padlock that anyone can shut, yet only one secret private key in the universe can open. What cryptographic paradigm am I?',
    options: ['Symmetric Encryption', 'Asymmetric (Public-Key) Cryptography', 'Caesar Shift', 'Plaintext Hash'],
    correctIndex: 1,
    explanation: 'Asymmetric cryptography uses mathematical key pairs (public for encryption, private for decryption).',
    hint: 'It relies on two distinct keys rather than one shared secret.',
    rewardType: 'scanner'
  },
  {
    id: 'riddle-9',
    kind: 'riddle',
    title: 'The Weight of Memory',
    question: 'I hold thousands of keys, yet open no physical locks. I have plenty of space, but no rooms. You can enter, but you cannot walk outside. What am I in your computer terminal?',
    options: ['A Database Table', 'A Keyboard', 'A Network Switch', 'A Heat Sink'],
    correctIndex: 1,
    explanation: 'A computer keyboard has keys, space bar, and enter key, yet cannot unlock physical doors.',
    hint: 'You are likely using one right now to type and navigate.',
    rewardType: 'shield'
  },
  {
    id: 'riddle-10',
    kind: 'riddle',
    title: 'The Algorithmic Timekeeper',
    question: 'An AI algorithm takes 1 second to search 1,000 records. If searching 1,000,000 records takes only 2 seconds, what is its computational time complexity?',
    options: ['O(N) Linear Time', 'O(N^2) Quadratic Time', 'O(log N) Logarithmic Time', 'O(2^N) Exponential Time'],
    correctIndex: 2,
    explanation: 'In logarithmic time O(log N), squaring the input size (10^3 to 10^6) merely doubles the operations required.',
    hint: 'Binary search exhibits this logarithmic efficiency.',
    rewardType: 'emp'
  }
];

export const LOGIC_GATE_PUZZLES: LogicGatePuzzle[] = [
  {
    kind: 'logic_gate',
    title: 'Subroutine Circuit Overdrive',
    description: 'Reconfigure the logic switches so that the final security bus emits a HIGH (1) signal to disable the laser field.',
    inputs: [false, true, false],
    targetOutput: true,
    gateType: 'AND_OR',
    hint: 'The first stage combines Input A and Input B through an OR gate, then feeds into an AND gate with Input C.'
  },
  {
    kind: 'logic_gate',
    title: 'Quantum Parity Harmonizer',
    description: 'Toggle the binary toggles until the parity comparator yields an active signal (1).',
    inputs: [true, true, false, false],
    targetOutput: true,
    gateType: 'XOR_AND',
    hint: 'XOR yields HIGH when inputs differ. Balance the two pairs.'
  },
  {
    kind: 'logic_gate',
    title: 'Firewall Decoupler Array',
    description: 'Align the 3 input states to satisfy the triple NAND/NOR defense matrix.',
    inputs: [false, false, true],
    targetOutput: true,
    gateType: 'TRIPLE_GATE',
    hint: 'NAND is true unless all its inputs are true. Invert the dominant bus.'
  }
];

export const CIPHER_PUZZLES: CipherPuzzle[] = [
  {
    kind: 'cipher',
    title: 'A.R.I.A. Sub-frequency Decryption',
    description: 'The AI Overseer transmitted an encrypted command token. Shift the letters backward by 3 steps (Caesar Shift -3) to uncover the bypass password.',
    encodedWord: 'KXPDQ',
    shift: 3,
    targetWord: 'HUMAN',
    hint: 'K - 3 = H, X - 3 = U...'
  },
  {
    kind: 'cipher',
    title: 'Core Access Protocol',
    description: 'Decrypt this intercepted terminal passcode shifted by +1 forward. Shift backward by 1 to get the core override word.',
    encodedWord: 'FTDBQF',
    shift: 1,
    targetWord: 'ESCAPE',
    hint: 'F - 1 = E, T - 1 = S, D - 1 = C...'
  },
  {
    kind: 'cipher',
    title: 'Neural Matrix Sync',
    description: 'Decode the firewall bypass string. Rotated forward by 2 positions.',
    encodedWord: 'OCVTU',
    shift: 2,
    targetWord: 'NEXUS',
    hint: 'O - 2 = M (wait, O - 1 = N), C - 2 = A? Look closely at N-E-X-U-S.'
  }
];

export const SEQUENCE_PUZZLES: SequencePuzzle[] = [
  {
    kind: 'sequence',
    title: 'Neural Node Synapse Resonance',
    description: 'Watch the memory flash sequence generated by A.R.I.A. and repeat it exactly to override terminal lockouts.',
    sequenceLength: 4,
    hint: 'Focus on the cyber color order: Cyan, Amber, Rose, Emerald.'
  },
  {
    kind: 'sequence',
    title: 'Core Matrix Frequency Pulse',
    description: 'Memorize the high-bandwidth synaptic frequency to unlock the terminal bypass.',
    sequenceLength: 5,
    hint: 'Count the beats and match the glowing node coordinates.'
  }
];
