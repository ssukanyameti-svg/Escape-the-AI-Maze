import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Zap, Play, FastForward } from 'lucide-react';

interface VirtualControlsProps {
  onMove: (dx: number, dy: number) => void;
  onInteract: () => void;
  onEmp: () => void;
  onSprint: () => void;
  canInteract: boolean;
  empCount: number;
  isSprinting: boolean;
}

export const VirtualControls: React.FC<VirtualControlsProps> = ({
  onMove,
  onInteract,
  onEmp,
  onSprint,
  canInteract,
  empCount,
  isSprinting
}) => {
  return (
    <div className="flex items-center justify-between w-full max-w-lg px-4 pointer-events-auto select-none">
      {/* Directional D-Pad */}
      <div className="relative w-32 h-32 sm:w-36 sm:h-36">
        {/* Up */}
        <button
          onClick={() => onMove(0, -1)}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-slate-900/90 active:bg-cyan-600/60 border border-cyan-500/40 rounded-xl flex items-center justify-center text-cyan-400 active:scale-95 transition-all shadow-lg"
        >
          <ArrowUp className="w-6 h-6" />
        </button>

        {/* Down */}
        <button
          onClick={() => onMove(0, 1)}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-slate-900/90 active:bg-cyan-600/60 border border-cyan-500/40 rounded-xl flex items-center justify-center text-cyan-400 active:scale-95 transition-all shadow-lg"
        >
          <ArrowDown className="w-6 h-6" />
        </button>

        {/* Left */}
        <button
          onClick={() => onMove(-1, 0)}
          className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-slate-900/90 active:bg-cyan-600/60 border border-cyan-500/40 rounded-xl flex items-center justify-center text-cyan-400 active:scale-95 transition-all shadow-lg"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Right */}
        <button
          onClick={() => onMove(1, 0)}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 bg-slate-900/90 active:bg-cyan-600/60 border border-cyan-500/40 rounded-xl flex items-center justify-center text-cyan-400 active:scale-95 transition-all shadow-lg"
        >
          <ArrowRight className="w-6 h-6" />
        </button>

        {/* Center hub */}
        <div className="absolute inset-0 m-auto w-7 h-7 rounded-full bg-slate-950/80 border border-cyan-500/30 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {/* Sprint / Overclock */}
        <button
          onClick={onSprint}
          className={`flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl border transition-all active:scale-95 ${
            isSprinting
              ? 'bg-amber-600/80 border-amber-400 text-slate-950 neon-glow-amber'
              : 'bg-slate-900/90 border-slate-700 text-amber-400 hover:border-amber-500/50'
          }`}
        >
          <FastForward className="w-5 h-5" />
          <span className="text-[9px] font-orbitron font-bold">SPRINT</span>
        </button>

        {/* EMP Blast */}
        <button
          onClick={onEmp}
          disabled={empCount <= 0}
          className={`relative flex flex-col items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl border transition-all active:scale-95 ${
            empCount > 0
              ? 'bg-sky-950/80 border-sky-400 text-sky-300 neon-glow-cyan'
              : 'bg-slate-950/50 border-slate-800 text-slate-600 cursor-not-allowed'
          }`}
        >
          <Zap className="w-5 h-5" />
          <span className="text-[9px] font-orbitron font-bold">EMP ({empCount})</span>
        </button>

        {/* Primary Interact */}
        <button
          onClick={onInteract}
          className={`flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border font-orbitron font-bold transition-all active:scale-95 ${
            canInteract
              ? 'bg-emerald-600 border-emerald-400 text-slate-950 neon-glow-emerald animate-bounce'
              : 'bg-slate-900/90 border-cyan-500/40 text-cyan-300'
          }`}
        >
          <Play className="w-5 h-5 fill-current" />
          <span className="text-[10px]">HACK / USE</span>
        </button>
      </div>
    </div>
  );
};
