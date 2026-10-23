import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { MazeSector, PlayerStats } from '../types/game';
import { Trophy, ArrowRight, RotateCcw, Clock, Award, CheckCircle2, Shield, Flame } from 'lucide-react';

interface VictoryModalProps {
  sector: MazeSector;
  player: PlayerStats;
  timeSeconds: number;
  onNextSector: () => void;
  onReplay: () => void;
  isGameComplete: boolean;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  sector,
  player,
  timeSeconds,
  onNextSector,
  onReplay,
  isGameComplete
}) => {
  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  }, []);

  // Compute runner rank
  let rank = 'B';
  if (timeSeconds < 90 && player.riddlesSolved >= 2 && player.shield >= 80) rank = 'S';
  else if (timeSeconds < 140 && player.riddlesSolved >= 1) rank = 'A';
  else if (player.shield < 30) rank = 'C';

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins}m ${remaining}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-chakra">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-emerald-500/60 rounded-2xl overflow-hidden shadow-2xl shadow-emerald-500/20 text-slate-100 p-6 sm:p-8 space-y-6 text-center">
        {/* Glow icon */}
        <div className="inline-flex p-4 bg-emerald-950/80 border-2 border-emerald-400 rounded-2xl text-emerald-400 neon-glow-emerald animate-bounce">
          <Trophy className="w-10 h-10" />
        </div>

        <div>
          <span className="text-xs font-cyber-mono text-emerald-400 uppercase tracking-widest">
            {isGameComplete ? '/// MISSION ACCOMPLISHED ///' : '/// SECTOR BREACH SUCCESSFUL ///'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-orbitron font-black text-slate-100 mt-1">
            {isGameComplete ? 'N.E.X.U.S.-9 DISMANTLED' : `${sector.title} CLEARED`}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {isGameComplete
              ? 'You outwitted A.R.I.A.\'s logic core and shattered the simulation barrier. You are free!'
              : 'All security tokens gathered. The conduit gate opened to the next sector.'}
          </p>
        </div>

        {/* Stats card */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl grid grid-cols-2 gap-3 text-left">
          <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>TIME ELAPSED</span>
            </div>
            <div className="font-orbitron font-bold text-base text-cyan-300 mt-0.5">
              {formatTime(timeSeconds)}
            </div>
          </div>

          <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>TOTAL SCORE</span>
            </div>
            <div className="font-orbitron font-bold text-base text-amber-300 mt-0.5">
              {player.score.toLocaleString()} PTS
            </div>
          </div>

          <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>RIDDLES SOLVED</span>
            </div>
            <div className="font-orbitron font-bold text-base text-emerald-300 mt-0.5">
              {player.riddlesSolved} COMPLETED
            </div>
          </div>

          <div className="p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg">
            <div className="flex items-center gap-1.5 text-slate-400 text-xs">
              <Flame className="w-3.5 h-3.5 text-purple-400" />
              <span>RUNNER RATING</span>
            </div>
            <div className="font-orbitron font-black text-xl text-purple-400 mt-0.5">
              RANK {rank}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            onClick={onReplay}
            className="w-full sm:w-1/2 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl font-orbitron font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>RETRY SECTOR</span>
          </button>

          <button
            onClick={onNextSector}
            className="w-full sm:w-1/2 py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl font-orbitron font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-600/30"
          >
            <span>{isGameComplete ? 'PLAY INFINITE SECTOR' : 'NEXT SECTOR'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
