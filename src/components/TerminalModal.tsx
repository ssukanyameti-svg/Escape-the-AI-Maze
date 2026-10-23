import React, { useState, useEffect } from 'react';
import { Terminal, RiddlePuzzle, LogicGatePuzzle, CipherPuzzle, SequencePuzzle } from '../types/game';
import { sound } from '../utils/audio';
import { Terminal as TerminalIcon, ShieldAlert, Cpu, Key, HelpCircle, CheckCircle2, XCircle, Zap, Radio, RefreshCw } from 'lucide-react';

interface TerminalModalProps {
  terminal: Terminal | null;
  onClose: () => void;
  onSolve: (terminalId: string, rewardType?: string, rewardKey?: string) => void;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({ terminal, onClose, onSolve }) => {
  if (!terminal) return null;

  const puzzle = terminal.puzzle;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900/95 border-2 border-cyan-500/50 rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/20 text-slate-100 font-chakra">
        {/* CRT Scanline overlay */}
        <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />

        {/* Terminal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-cyan-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950/80 border border-cyan-500/40 rounded-lg text-cyan-400">
              <TerminalIcon className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-bold text-cyan-300 tracking-wider text-sm sm:text-base">
                  {terminal.name}
                </span>
                {terminal.solved && (
                  <span className="px-2 py-0.5 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded">
                    OVERRIDDEN
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-cyber-mono">
                ENCRYPTION: 4096-BIT QUANTUM // A.R.I.A. OVERRIDE PROTOCOL
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-cyan-400 p-1.5 rounded-lg border border-transparent hover:border-cyan-500/30 transition-all font-orbitron text-sm"
          >
            ESC [X]
          </button>
        </div>

        {/* Terminal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {puzzle.kind === 'riddle' && (
            <RiddleView
              puzzle={puzzle}
              isSolved={terminal.solved}
              onSuccess={() => onSolve(terminal.id, puzzle.rewardType, puzzle.rewardKey)}
            />
          )}

          {puzzle.kind === 'logic_gate' && (
            <LogicGateView
              puzzle={puzzle}
              isSolved={terminal.solved}
              onSuccess={() => onSolve(terminal.id, 'shield')}
            />
          )}

          {puzzle.kind === 'cipher' && (
            <CipherView
              puzzle={puzzle}
              isSolved={terminal.solved}
              onSuccess={() => onSolve(terminal.id, 'emp')}
            />
          )}

          {puzzle.kind === 'sequence' && (
            <SequenceView
              puzzle={puzzle}
              isSolved={terminal.solved}
              onSuccess={() => onSolve(terminal.id, 'scanner')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* --- Riddle Puzzle View --- */
interface RiddleViewProps {
  puzzle: RiddlePuzzle;
  isSolved: boolean;
  onSuccess: () => void;
}

const RiddleView: React.FC<RiddleViewProps> = ({ puzzle, isSolved, onSuccess }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(isSolved);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (index: number) => {
    if (submitted) return;
    setSelectedIndex(index);
    sound.playTerminalBeep();

    if (index === puzzle.correctIndex) {
      sound.playSuccess();
      setSubmitted(true);
      setErrorMsg(null);
      onSuccess();
    } else {
      sound.playError();
      setErrorMsg('CORRUPTED RESPONSE: A.R.I.A. rejected your logical deduction.');
    }
  };

  return (
    <div className="space-y-5">
      <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-lg">
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-cyber-mono mb-2">
          <Cpu className="w-4 h-4" />
          <span>QUERY PROMPT FROM A.R.I.A.</span>
        </div>
        <p className="text-lg text-slate-100 font-medium leading-relaxed font-chakra">
          "{puzzle.question}"
        </p>
      </div>

      {/* Answer Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {puzzle.options.map((option, idx) => {
          let btnStyle = 'bg-slate-800/80 border-slate-700 hover:border-cyan-400/80 text-slate-200';
          if (submitted && idx === puzzle.correctIndex) {
            btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 font-semibold';
          } else if (selectedIndex === idx && idx !== puzzle.correctIndex) {
            btnStyle = 'bg-rose-950/80 border-rose-500 text-rose-300';
          }

          return (
            <button
              key={idx}
              disabled={submitted}
              onClick={() => handleSubmit(idx)}
              className={`flex items-start text-left p-3.5 rounded-lg border transition-all text-sm group ${btnStyle}`}
            >
              <span className="font-cyber-mono font-bold text-cyan-400 mr-2.5 opacity-70 group-hover:opacity-100">
                [{idx + 1}]
              </span>
              <span className="flex-1">{option}</span>
            </button>
          );
        })}
      </div>

      {/* Error feedback */}
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-rose-950/50 border border-rose-500/50 rounded-lg text-rose-300 text-sm">
          <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Solved Explanation */}
      {submitted && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-lg space-y-2 text-emerald-300">
          <div className="flex items-center gap-2 font-bold font-orbitron text-sm">
            <CheckCircle2 className="w-4 h-4" />
            <span>LOGIC VERIFIED // ACCESS GRANTED</span>
          </div>
          <p className="text-xs sm:text-sm text-emerald-200/90 leading-relaxed font-cyber-mono">
            {puzzle.explanation}
          </p>
          {puzzle.rewardKey && (
            <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-amber-300">
              <Key className="w-4 h-4" />
              <span>DISPENSED: {puzzle.rewardKey.toUpperCase()} KEY ROOT TOKEN</span>
            </div>
          )}
        </div>
      )}

      {/* Hint Accordion */}
      {!submitted && (
        <div className="pt-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-xs text-cyan-400/80 hover:text-cyan-300 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? 'Hide Hint' : 'Request Diagnostic Hint'}</span>
          </button>
          {showHint && (
            <p className="mt-2 p-3 bg-slate-950 border border-cyan-500/20 rounded text-xs text-slate-300 font-cyber-mono italic">
              {puzzle.hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

/* --- Logic Gate Puzzle View --- */
interface LogicGateViewProps {
  puzzle: LogicGatePuzzle;
  isSolved: boolean;
  onSuccess: () => void;
}

const LogicGateView: React.FC<LogicGateViewProps> = ({ puzzle, isSolved, onSuccess }) => {
  const [inputs, setInputs] = useState<boolean[]>(puzzle.inputs);
  const [solved, setSolved] = useState<boolean>(isSolved);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Evaluate the logic gate network based on gateType
  const evaluateCircuit = (inp: boolean[]): boolean => {
    if (puzzle.gateType === 'AND_OR') {
      // (A OR B) AND C
      const [a, b, c] = inp;
      return (a || b) && c;
    } else if (puzzle.gateType === 'XOR_AND') {
      // (A XOR B) AND (C XOR D)
      const [a, b, c, d] = inp;
      return (a !== b) && (c !== d);
    } else {
      // TRIPLE_GATE: !(A && B) && (B || C)
      const [a, b, c] = inp;
      return !(a && b) && (b || c);
    }
  };

  const currentOutput = evaluateCircuit(inputs);

  const toggleInput = (idx: number) => {
    if (solved) return;
    sound.playTerminalBeep();
    const updated = [...inputs];
    updated[idx] = !updated[idx];
    setInputs(updated);

    if (evaluateCircuit(updated) === puzzle.targetOutput) {
      sound.playSuccess();
      setSolved(true);
      onSuccess();
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-lg">
        <h4 className="font-orbitron font-bold text-cyan-300 mb-1">{puzzle.title}</h4>
        <p className="text-sm text-slate-300">{puzzle.description}</p>
      </div>

      {/* Circuit Visual Board */}
      <div className="p-5 bg-slate-950 border border-cyan-500/40 rounded-xl space-y-5">
        <div className="text-xs font-cyber-mono text-cyan-400 flex items-center justify-between">
          <span>INPUT BUS SWITCHES</span>
          <span>GATE ARCHITECTURE: {puzzle.gateType}</span>
        </div>

        {/* Input Switch Toggles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {inputs.map((val, idx) => (
            <button
              key={idx}
              disabled={solved}
              onClick={() => toggleInput(idx)}
              className={`p-3.5 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all ${
                val
                  ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300 neon-glow-emerald'
                  : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              <span className="text-xs font-cyber-mono font-bold">SWITCH #{String.fromCharCode(65 + idx)}</span>
              <span className="font-orbitron text-xl font-black">{val ? '1 [HIGH]' : '0 [LOW]'}</span>
            </button>
          ))}
        </div>

        {/* Logic Bus Flow */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Radio className={`w-5 h-5 ${currentOutput ? 'text-emerald-400 animate-pulse' : 'text-slate-600'}`} />
            <div>
              <div className="text-xs text-slate-400 font-cyber-mono">SIGNAL COMPARATOR</div>
              <div className={`font-orbitron font-bold text-sm ${currentOutput ? 'text-emerald-400' : 'text-rose-400'}`}>
                CURRENT OUTPUT: {currentOutput ? 'TRUE (1)' : 'FALSE (0)'}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs text-slate-400 font-cyber-mono">TARGET REQUIRED</div>
            <div className="font-orbitron font-bold text-sm text-cyan-300">
              {puzzle.targetOutput ? 'TRUE (1)' : 'FALSE (0)'}
            </div>
          </div>
        </div>
      </div>

      {solved ? (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-emerald-300 flex items-center gap-3 font-orbitron font-bold text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>CIRCUIT BALANCED // LASER GRID DECOUPLED // SHIELDS RECHARGED</span>
        </div>
      ) : (
        <div className="pt-2">
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-xs text-cyan-400/80 hover:text-cyan-300"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{showHint ? 'Hide Hint' : 'View Gate Logic Diagram Hint'}</span>
          </button>
          {showHint && (
            <p className="mt-2 p-3 bg-slate-950 border border-cyan-500/20 rounded text-xs text-slate-300 font-cyber-mono">
              {puzzle.hint}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

/* --- Cipher Frequency Decoder View --- */
interface CipherViewProps {
  puzzle: CipherPuzzle;
  isSolved: boolean;
  onSuccess: () => void;
}

const CipherView: React.FC<CipherViewProps> = ({ puzzle, isSolved, onSuccess }) => {
  const [guess, setGuess] = useState<string>('');
  const [solved, setSolved] = useState<boolean>(isSolved);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (solved) return;

    if (guess.trim().toUpperCase() === puzzle.targetWord) {
      sound.playSuccess();
      setSolved(true);
      setErrorMsg(null);
      onSuccess();
    } else {
      sound.playError();
      setErrorMsg('KEY HASH MISMATCH: Decryption rejected.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-lg">
        <h4 className="font-orbitron font-bold text-cyan-300 mb-1">{puzzle.title}</h4>
        <p className="text-sm text-slate-300">{puzzle.description}</p>
      </div>

      <div className="p-5 bg-slate-950 border border-cyan-500/40 rounded-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-900 border border-slate-800 rounded">
          <span className="text-xs text-slate-400 font-cyber-mono">INTERCEPTED CIPHERTEXT:</span>
          <span className="font-orbitron tracking-widest text-2xl font-bold text-amber-400">
            {puzzle.encodedWord}
          </span>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-cyber-mono text-cyan-400 mb-1.5">
              ENTER DECRYPTED ACCESS STRING:
            </label>
            <input
              type="text"
              disabled={solved}
              value={guess}
              onChange={(e) => setGuess(e.target.value.toUpperCase())}
              placeholder="E.G. HUMAN"
              className="w-full px-4 py-3 bg-slate-900 border border-cyan-500/50 rounded-lg text-slate-100 font-orbitron tracking-wider text-lg uppercase focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </div>

          {errorMsg && (
            <div className="flex items-center gap-2 text-rose-400 text-xs font-cyber-mono">
              <XCircle className="w-4 h-4" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!solved && (
            <button
              type="submit"
              className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-orbitron font-bold rounded-lg transition-all shadow-lg shadow-cyan-600/30"
            >
              EXECUTE DECRYPTION // BYPASS
            </button>
          )}
        </form>
      </div>

      {solved && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-emerald-300 flex items-center gap-3 font-orbitron font-bold text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>CIPHER RESOLVED // EMP CHARGES REPLENISHED</span>
        </div>
      )}
    </div>
  );
};

/* --- Neural Memory Sequencer View --- */
interface SequenceViewProps {
  puzzle: SequencePuzzle;
  isSolved: boolean;
  onSuccess: () => void;
}

const SequenceView: React.FC<SequenceViewProps> = ({ puzzle, isSolved, onSuccess }) => {
  const [solved, setSolved] = useState<boolean>(isSolved);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [sequence, setSequence] = useState<number[]>([0, 2, 1, 3]);

  useEffect(() => {
    // Generate sequence based on length
    const seq: number[] = [];
    for (let i = 0; i < puzzle.sequenceLength; i++) {
      seq.push(Math.floor(Math.random() * 4));
    }
    setSequence(seq);
  }, [puzzle.sequenceLength]);

  const playSequence = () => {
    if (isPlaying || solved) return;
    setIsPlaying(true);
    setPlayerInput([]);

    sequence.forEach((val, i) => {
      setTimeout(() => {
        setActiveStep(val);
        sound.playTerminalBeep();
      }, (i + 1) * 600);

      setTimeout(() => {
        setActiveStep(null);
        if (i === sequence.length - 1) {
          setIsPlaying(false);
        }
      }, (i + 1) * 600 + 400);
    });
  };

  const handleNodeClick = (nodeIdx: number) => {
    if (isPlaying || solved) return;
    sound.playTerminalBeep();
    const updated = [...playerInput, nodeIdx];
    setPlayerInput(updated);

    // Verify step
    const currentStepIdx = updated.length - 1;
    if (updated[currentStepIdx] !== sequence[currentStepIdx]) {
      sound.playError();
      setPlayerInput([]);
      return;
    }

    if (updated.length === sequence.length) {
      sound.playSuccess();
      setSolved(true);
      onSuccess();
    }
  };

  const nodeColors = [
    { name: 'Cyan', bg: 'bg-cyan-500', glow: 'neon-glow-cyan', text: 'text-cyan-400' },
    { name: 'Amber', bg: 'bg-amber-500', glow: 'neon-glow-amber', text: 'text-amber-400' },
    { name: 'Rose', bg: 'bg-rose-500', glow: 'neon-glow-rose', text: 'text-rose-400' },
    { name: 'Emerald', bg: 'bg-emerald-500', glow: 'neon-glow-emerald', text: 'text-emerald-400' }
  ];

  return (
    <div className="space-y-6">
      <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-lg">
        <h4 className="font-orbitron font-bold text-cyan-300 mb-1">{puzzle.title}</h4>
        <p className="text-sm text-slate-300">{puzzle.description}</p>
      </div>

      <div className="p-5 bg-slate-950 border border-cyan-500/40 rounded-xl space-y-5 flex flex-col items-center">
        {!solved && (
          <button
            onClick={playSequence}
            disabled={isPlaying}
            className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600/80 hover:bg-cyan-500 text-slate-950 font-orbitron font-bold rounded-lg transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
            <span>{isPlaying ? 'A.R.I.A. TRANSMITTING SEQUENCE...' : 'TRANSMIT SYNAPSE SEQUENCE'}</span>
          </button>
        )}

        {/* 4 Interactive Nodes */}
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
          {nodeColors.map((node, idx) => {
            const isLit = activeStep === idx;
            return (
              <button
                key={idx}
                disabled={isPlaying || solved}
                onClick={() => handleNodeClick(idx)}
                className={`h-24 rounded-xl border flex flex-col items-center justify-center transition-all ${
                  isLit
                    ? `${node.bg} border-white text-slate-950 scale-105 ${node.glow}`
                    : 'bg-slate-900 border-slate-700 hover:border-slate-500'
                }`}
              >
                <Zap className={`w-6 h-6 mb-1 ${isLit ? 'text-white' : node.text}`} />
                <span className="font-orbitron text-xs font-bold tracking-wider">
                  NODE {idx + 1}
                </span>
              </button>
            );
          })}
        </div>

        <div className="text-xs font-cyber-mono text-slate-400">
          PROGRESS: {playerInput.length} / {sequence.length} SYNAPSE NODES
        </div>
      </div>

      {solved && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-emerald-300 flex items-center gap-3 font-orbitron font-bold text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span>SYNAPTIC SEQUENCE MATCHED // SCANNER OVERCHARGED</span>
        </div>
      )}
    </div>
  );
};
