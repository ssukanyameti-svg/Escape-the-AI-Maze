import React from 'react';
import { Skull, RotateCcw, AlertTriangle } from 'lucide-react';

interface GameOverModalProps {
  reason: string;
  onRetry: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ reason, onRetry }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md font-chakra">
      <div className="relative w-full max-w-md bg-slate-900 border-2 border-rose-500/80 rounded-2xl overflow-hidden shadow-2xl shadow-rose-500/30 text-slate-100 p-6 sm:p-8 space-y-6 text-center">
        {/* CRT Scanline */}
        <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />

        <div className="inline-flex p-4 bg-rose-950/80 border-2 border-rose-500 rounded-2xl text-rose-500 neon-glow-rose animate-pulse">
          <Skull className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-cyber-mono text-rose-400 uppercase tracking-widest">
            /// NEURAL LINK TERMINATED ///
          </span>
          <h2 className="text-2xl sm:text-3xl font-orbitron font-black text-rose-400 text-glow-rose mt-1">
            RUNNER DERESOLVED
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 p-3 bg-rose-950/30 border border-rose-900/50 rounded-lg flex items-center gap-2 justify-center">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{reason || 'Shields depleted by AI countermeasures.'}</span>
          </p>
        </div>

        <p className="text-xs text-slate-400 font-cyber-mono">
          "Your neural parameters have been logged into my prediction archives. Try again, Runner."
          <br />— A.R.I.A.
        </p>

        <button
          onClick={onRetry}
          className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-slate-950 rounded-xl font-orbitron font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-600/30"
        >
          <RotateCcw className="w-4 h-4" />
          <span>REBOOT RUNNER & RETRY</span>
        </button>
      </div>
    </div>
  );
};
