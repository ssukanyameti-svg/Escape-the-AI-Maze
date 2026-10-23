import React from 'react';
import { MazeSector, PlayerStats } from '../types/game';
import { Shield, Key, Zap, Radio, Clock, Award, BookOpen, Volume2, VolumeX, HelpCircle, RotateCcw } from 'lucide-react';

interface GameHUDProps {
  sector: MazeSector;
  player: PlayerStats;
  elapsedSeconds: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenLore: () => void;
  onOpenHelp: () => void;
  onRestart: () => void;
  loreCount: number;
  totalLore: number;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  sector,
  player,
  elapsedSeconds,
  isMuted,
  onToggleMute,
  onOpenLore,
  onOpenHelp,
  onRestart,
  loreCount,
  totalLore
}) => {
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remaining = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const keyConfig = [
    { type: 'alpha', name: 'Alpha', color: 'text-cyan-400', border: 'border-cyan-500/50', bg: 'bg-cyan-950/60' },
    { type: 'beta', name: 'Beta', color: 'text-amber-400', border: 'border-amber-500/50', bg: 'bg-amber-950/60' },
    { type: 'omega', name: 'Omega', color: 'text-purple-400', border: 'border-purple-500/50', bg: 'bg-purple-950/60' }
  ] as const;

  const shieldPercent = Math.max(0, Math.min(100, (player.shield / player.maxShield) * 100));

  return (
    <header className="w-full bg-slate-950/90 border-b border-cyan-500/30 px-3 sm:px-6 py-2.5 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 text-slate-100 font-chakra select-none z-20">
      {/* Sector Badge & Identity */}
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-orbitron font-extrabold text-xs sm:text-sm tracking-wider text-cyan-400 text-glow-cyan">
              {sector.title}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-cyber-mono hidden sm:block">
            {sector.subtitle}
          </p>
        </div>
      </div>

      {/* Center: Shield & Keys Status */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Shield Bar */}
        <div className="flex items-center gap-2">
          <Shield className={`w-4 h-4 ${shieldPercent < 30 ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`} />
          <div className="w-24 sm:w-32">
            <div className="flex justify-between text-[10px] font-cyber-mono text-slate-300 mb-0.5">
              <span>SHIELD</span>
              <span>{player.shield}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all duration-300 ${
                  shieldPercent > 50
                    ? 'bg-cyan-500'
                    : shieldPercent > 20
                    ? 'bg-amber-500'
                    : 'bg-rose-500'
                }`}
                style={{ width: `${shieldPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Required Keys Matrix */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {keyConfig.map(k => {
            const isRequired = sector.requiredKeys.includes(k.type);
            const isOwned = player.keys[k.type];
            if (!isRequired) return null;

            return (
              <div
                key={k.type}
                className={`flex items-center gap-1 px-2 py-1 rounded border text-xs font-orbitron transition-all ${
                  isOwned
                    ? `${k.bg} ${k.border} ${k.color} shadow-sm font-bold scale-105`
                    : 'bg-slate-900/60 border-slate-800 text-slate-600'
                }`}
                title={`${k.name} Key: ${isOwned ? 'Acquired' : 'Required to unlock firewall'}`}
              >
                <Key className={`w-3.5 h-3.5 ${isOwned ? 'animate-bounce' : 'opacity-40'}`} />
                <span className="text-[10px] uppercase hidden sm:inline">{k.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: Telemetry & Controls */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* EMP Charges Badge */}
        <div className="flex items-center gap-1 px-2 py-1 bg-sky-950/40 border border-sky-500/30 rounded text-xs font-cyber-mono text-sky-300">
          <Zap className="w-3.5 h-3.5 text-sky-400" />
          <span>EMP: {player.empCharges}</span>
        </div>

        {/* Score & Time */}
        <div className="flex items-center gap-3 text-xs font-cyber-mono text-slate-300 hidden md:flex">
          <div className="flex items-center gap-1 text-amber-300">
            <Award className="w-3.5 h-3.5" />
            <span>{player.score.toLocaleString()} PTS</span>
          </div>
          <div className="flex items-center gap-1 text-cyan-300">
            <Clock className="w-3.5 h-3.5" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          {/* Lore Archives Button */}
          <button
            onClick={onOpenLore}
            className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:border-amber-500/50 text-amber-400 hover:text-amber-300 text-xs flex items-center gap-1 transition-colors"
            title="Open Lore Data Archive"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="text-[10px] font-cyber-mono hidden sm:inline">LOGS ({loreCount}/{totalLore})</span>
          </button>

          {/* Help Guide */}
          <button
            onClick={onOpenHelp}
            className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 transition-colors"
            title="Controls & Objective Guide"
          >
            <HelpCircle className="w-4 h-4" />
          </button>

          {/* Mute Toggle */}
          <button
            onClick={onToggleMute}
            className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 transition-colors"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Restart */}
          <button
            onClick={onRestart}
            className="p-1.5 rounded bg-slate-900 border border-slate-700 hover:border-rose-500/50 text-slate-300 hover:text-rose-400 transition-colors"
            title="Restart Sector"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
