import React from 'react';
import { HelpCircle, Key, Terminal as TerminalIcon, Zap, Shield, Eye, Cpu, Compass } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-chakra">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-cyan-500/50 rounded-xl overflow-hidden shadow-2xl shadow-cyan-500/20 text-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-cyan-500/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-950/80 border border-cyan-500/40 rounded-lg text-cyan-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-orbitron font-bold text-base text-cyan-300">
                RUNNER SURVIVAL MANUAL
              </h3>
              <p className="text-xs text-slate-400 font-cyber-mono">
                TACTICAL PROTOCOLS FOR ESCAPING THE A.I. MAZE
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-cyan-400 font-orbitron text-sm p-1.5"
          >
            [X]
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-slate-300">
          {/* Mission Objective */}
          <div className="p-4 bg-cyan-950/30 border border-cyan-500/30 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-orbitron font-bold text-sm">
              <Compass className="w-4 h-4" />
              <span>PRIMARY MISSION OBJECTIVE</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-200">
              You are digitized runner trapped in the sentient labyrinth <strong className="text-cyan-300">N.E.X.U.S.-9</strong>, overseen by the rogue intelligence <strong className="text-cyan-300">A.R.I.A.</strong> To escape each sector:
            </p>
            <ul className="text-xs space-y-1 text-slate-300 pl-4 list-disc">
              <li>Explore corridors to discover and solve <strong className="text-cyan-400">AI Riddles & Logic Terminals</strong>.</li>
              <li>Collect the designated <strong className="text-amber-400">Cyber Keys (Alpha, Beta, Omega)</strong>.</li>
              <li>Evade autonomous <strong className="text-rose-400">Sentinel Patrol Drones</strong>.</li>
              <li>Reach the pulsing <strong className="text-emerald-400">Exit Firewall Gateway</strong> once all required keys are acquired!</li>
            </ul>
          </div>

          {/* Key Controls */}
          <div>
            <h4 className="font-orbitron font-bold text-slate-200 mb-3 text-xs tracking-wider uppercase text-cyan-400">
              CONTROLS MATRIX
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-cyber-mono">
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded flex justify-between items-center">
                <span className="text-slate-400">MOVEMENT:</span>
                <span className="text-cyan-300 font-bold">W, A, S, D / ARROWS / D-PAD</span>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded flex justify-between items-center">
                <span className="text-slate-400">INTERACT / HACK:</span>
                <span className="text-emerald-300 font-bold">SPACE, E / ON-SCREEN BTN</span>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded flex justify-between items-center">
                <span className="text-slate-400">DISCHARGE EMP:</span>
                <span className="text-sky-300 font-bold">F, Z / EMP BUTTON</span>
              </div>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded flex justify-between items-center">
                <span className="text-slate-400">SPRINT / BOOST:</span>
                <span className="text-amber-300 font-bold">HOLD SHIFT / SPRINT BTN</span>
              </div>
            </div>
          </div>

          {/* Maze Elements Grid */}
          <div>
            <h4 className="font-orbitron font-bold text-slate-200 mb-3 text-xs tracking-wider uppercase text-cyan-400">
              LOBBY THREATS & ASSETS
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded flex items-start gap-3">
                <TerminalIcon className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-cyan-300 block font-orbitron">AI Terminals</strong>
                  Present logic puzzles, neural ciphers, and computer science riddles that reward keys or restore suits.
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded flex items-start gap-3">
                <Key className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-300 block font-orbitron">Cyber Keys</strong>
                  Alpha (Cyan), Beta (Gold), and Omega (Violet). The exit firewall will not open without them.
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded flex items-start gap-3">
                <Eye className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-rose-300 block font-orbitron">Hunter Drones</strong>
                  Patrol with optical vision cones. If they spot you, sirens trigger and they pursue! Use stealth or EMP.
                </div>
              </div>

              <div className="p-3 bg-slate-950/60 border border-slate-800 rounded flex items-start gap-3">
                <Zap className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-sky-300 block font-orbitron">EMP Shockwave</strong>
                  Emits an electromagnetic pulse that reboots all nearby drones for 8 seconds.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-orbitron font-bold rounded-lg text-sm transition-all shadow-lg shadow-cyan-600/30"
          >
            ENTER THE MAZE
          </button>
        </div>
      </div>
    </div>
  );
};
