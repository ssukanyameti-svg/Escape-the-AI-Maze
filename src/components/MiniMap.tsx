import React, { useRef, useEffect } from 'react';
import { MazeSector, PlayerStats } from '../types/game';

interface MiniMapProps {
  sector: MazeSector;
  player: PlayerStats;
  isScannerActive: boolean;
}

export const MiniMap: React.FC<MiniMapProps> = ({ sector, player, isScannerActive }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.fillRect(0, 0, width, height);

    const cellW = width / sector.width;
    const cellH = height / sector.height;

    // Draw grid tiles
    for (let y = 0; y < sector.height; y++) {
      for (let x = 0; x < sector.width; x++) {
        const tile = sector.grid[y][x];
        const distToPlayer = Math.hypot(x - player.x, y - player.y);

        // Visibility check (always visible if scanner active or near player)
        if (!isScannerActive && distToPlayer > 8) {
          continue;
        }

        if (tile === 1) {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(x * cellW, y * cellH, cellW, cellH);
        } else {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(x * cellW, y * cellH, cellW, cellH);
        }
      }
    }

    // Draw Exit Gateway
    ctx.fillStyle = '#10b981';
    ctx.fillRect(sector.exitPos.x * cellW, sector.exitPos.y * cellH, cellW * 1.5, cellH * 1.5);

    // Draw Keys
    sector.keys.forEach(k => {
      if (k.collected) return;
      const dist = Math.hypot(k.x - player.x, k.y - player.y);
      if (isScannerActive || dist <= 8) {
        ctx.fillStyle = k.color;
        ctx.beginPath();
        ctx.arc(k.x * cellW + cellW / 2, k.y * cellH + cellH / 2, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw Terminals
    sector.terminals.forEach(t => {
      const dist = Math.hypot(t.x - player.x, t.y - player.y);
      if (isScannerActive || dist <= 7) {
        ctx.fillStyle = t.solved ? '#10b981' : '#06b6d4';
        ctx.fillRect(t.x * cellW, t.y * cellH, cellW, cellH);
      }
    });

    // Draw Drones
    sector.drones.forEach(d => {
      const dist = Math.hypot(d.x - player.x, d.y - player.y);
      if (isScannerActive || dist <= 6) {
        ctx.fillStyle = d.alertState === 'chase' ? '#ef4444' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(d.x * cellW + cellW / 2, d.y * cellH + cellH / 2, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw Player
    ctx.fillStyle = '#22d3ee';
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(player.x * cellW + cellW / 2, player.y * cellH + cellH / 2, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Radar border
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, width, height);

  }, [sector, player, isScannerActive]);

  return (
    <div className="relative rounded-lg overflow-hidden border border-cyan-500/40 bg-slate-950/80 p-1.5 shadow-lg shadow-cyan-500/10">
      <div className="flex items-center justify-between px-1.5 pb-1 text-[10px] font-cyber-mono text-cyan-400">
        <span>RADAR HUD</span>
        <span>X:{player.x.toString().padStart(2, '0')} Y:{player.y.toString().padStart(2, '0')}</span>
      </div>
      <canvas
        ref={canvasRef}
        width={140}
        height={100}
        className="rounded block"
      />
      {isScannerActive && (
        <div className="absolute inset-x-0 bottom-1.5 text-center text-[9px] font-orbitron font-bold text-amber-400 bg-amber-950/80 py-0.5">
          QUANTUM SCAN ACTIVE
        </div>
      )}
    </div>
  );
};
