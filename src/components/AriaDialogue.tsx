import React from 'react';
import { Cpu, Volume2, VolumeX } from 'lucide-react';

interface AriaDialogueProps {
  message: string;
  mood: 'neutral' | 'alert' | 'curious' | 'impressed' | 'threat';
  isVoiceMuted: boolean;
  onToggleVoice: () => void;
}

export const AriaDialogue: React.FC<AriaDialogueProps> = ({
  message,
  mood,
  isVoiceMuted,
  onToggleVoice
}) => {
  if (!message) return null;

  const moodColors = {
    neutral: 'border-cyan-500/50 bg-slate-950/90 text-cyan-200 shadow-cyan-500/10',
    alert: 'border-rose-500/60 bg-rose-950/90 text-rose-200 shadow-rose-500/20',
    curious: 'border-purple-500/50 bg-slate-950/90 text-purple-200 shadow-purple-500/10',
    impressed: 'border-emerald-500/50 bg-slate-950/90 text-emerald-200 shadow-emerald-500/10',
    threat: 'border-amber-500/60 bg-slate-950/90 text-amber-200 shadow-amber-500/20'
  };

  const avatarGlow = {
    neutral: 'text-cyan-400 bg-cyan-950/80 border-cyan-500/40',
    alert: 'text-rose-400 bg-rose-950/80 border-rose-500/40 animate-pulse',
    curious: 'text-purple-400 bg-purple-950/80 border-purple-500/40',
    impressed: 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40',
    threat: 'text-amber-400 bg-amber-950/80 border-amber-500/40'
  };

  return (
    <div className={`relative flex items-center gap-3 p-3 sm:p-4 rounded-xl border backdrop-blur-md shadow-xl transition-all ${moodColors[mood]}`}>
      {/* AI Avatar Core */}
      <div className={`relative p-2.5 rounded-lg border shrink-0 ${avatarGlow[mood]}`}>
        <Cpu className="w-5 h-5 sm:w-6 sm:h-6" />
        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
        </span>
      </div>

      {/* Message and Subtitle */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-orbitron font-bold text-xs sm:text-sm tracking-wider text-slate-100">
            A.R.I.A. OVERSEER
          </span>
          <span className="text-[10px] font-cyber-mono opacity-60">
            // NEURAL BROADCAST
          </span>
        </div>
        <p className="text-xs sm:text-sm font-chakra tracking-wide leading-snug mt-0.5 text-slate-200">
          "{message}"
        </p>
      </div>

      {/* Voice Synthesizer Toggle */}
      <button
        onClick={onToggleVoice}
        title={isVoiceMuted ? 'Enable AI Voice' : 'Mute AI Voice'}
        className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-300 transition-colors shrink-0"
      >
        {isVoiceMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
      </button>
    </div>
  );
};
