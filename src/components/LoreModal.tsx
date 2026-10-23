import React from 'react';
import { LoreEntry } from '../types/game';
import { BookOpen, Calendar, User, FileText, CheckCircle2 } from 'lucide-react';

interface LoreModalProps {
  logs: LoreEntry[];
  activeLog: LoreEntry | null;
  onSelectLog: (log: LoreEntry) => void;
  onClose: () => void;
}

export const LoreModal: React.FC<LoreModalProps> = ({ logs, activeLog, onSelectLog, onClose }) => {
  const currentLog = activeLog || logs.find(l => l.collected) || logs[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-chakra">
      <div className="relative w-full max-w-3xl bg-slate-900 border-2 border-amber-500/50 rounded-xl overflow-hidden shadow-2xl shadow-amber-500/20 text-slate-100 flex flex-col md:flex-row h-[70vh]">
        {/* CRT scanlines */}
        <div className="absolute inset-0 scanlines opacity-30 pointer-events-none" />

        {/* Sidebar Log Index */}
        <div className="w-full md:w-72 bg-slate-950/90 border-b md:border-b-0 md:border-r border-amber-500/30 p-4 flex flex-col">
          <div className="flex items-center gap-2 text-amber-400 font-orbitron font-bold text-sm mb-4">
            <BookOpen className="w-4 h-4" />
            <span>ARCHIVE MEMORY BANKS</span>
          </div>

          <div className="space-y-2 overflow-y-auto flex-1 pr-1">
            {logs.map((log) => {
              const isSelected = currentLog?.id === log.id;
              return (
                <button
                  key={log.id}
                  disabled={!log.collected}
                  onClick={() => onSelectLog(log)}
                  className={`w-full text-left p-3 rounded-lg border transition-all text-xs flex items-start gap-2.5 ${
                    !log.collected
                      ? 'bg-slate-950/40 border-slate-800 text-slate-600 cursor-not-allowed'
                      : isSelected
                      ? 'bg-amber-950/70 border-amber-500 text-amber-200 neon-glow-amber'
                      : 'bg-slate-900/60 border-slate-800 hover:border-amber-500/40 text-slate-300'
                  }`}
                >
                  <FileText className={`w-4 h-4 mt-0.5 shrink-0 ${log.collected ? 'text-amber-400' : 'text-slate-700'}`} />
                  <div>
                    <div className="font-semibold font-orbitron truncate">
                      {log.collected ? log.title : '/// ENCRYPTED MEMORY CORE'}
                    </div>
                    <div className="text-[10px] text-slate-500 font-cyber-mono mt-0.5">
                      {log.collected ? log.date : 'STATUS: UNRECOVERED'}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Log Reader Content */}
        <div className="flex-1 p-6 flex flex-col justify-between bg-slate-900/90 overflow-y-auto">
          {currentLog && currentLog.collected ? (
            <div className="space-y-4">
              <div>
                <span className="text-xs text-amber-400 font-cyber-mono tracking-widest uppercase">
                  DECRYPTED ARCHIVE DATA-CHIP
                </span>
                <h3 className="text-xl font-orbitron font-bold text-slate-100 mt-1">
                  {currentLog.title}
                </h3>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-400 font-cyber-mono border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>AUTHOR: {currentLog.author}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>TIMESTAMP: {currentLog.date}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-lg text-slate-200 text-sm leading-relaxed font-chakra whitespace-pre-line">
                {currentLog.content}
              </div>

              <div className="flex items-center gap-2 text-xs text-emerald-400 font-cyber-mono">
                <CheckCircle2 className="w-4 h-4" />
                <span>INTEGRITY VERIFIED // STORED IN LOCAL RUNNER MEMORY</span>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <BookOpen className="w-12 h-12 mb-3 stroke-1 text-slate-600" />
              <p className="font-orbitron text-sm">NO DATA-CHIP SELECTED OR UNRECOVERED</p>
              <p className="text-xs mt-1 text-slate-600">
                Explore the maze corridors to recover data logs scattered across the facility.
              </p>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-orbitron transition-all"
            >
              CLOSE ARCHIVE [ESC]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
