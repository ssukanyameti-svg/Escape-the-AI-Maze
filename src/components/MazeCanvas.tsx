import React, { useRef, useEffect } from 'react';
import { MazeSector, PlayerStats } from '../types/game';

interface MazeCanvasProps {
  sector: MazeSector;
  player: PlayerStats;
  isScannerActive: boolean;
  onInteractPrompt?: string | null;
  canvasWidth: number;
  canvasHeight: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export const MazeCanvas: React.FC<MazeCanvasProps> = ({
  sector,
  player,
  isScannerActive,
  canvasWidth,
  canvasHeight
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const cameraRef = useRef({ x: player.x * 48 + 24, y: player.y * 48 + 24 });
  const pulseRef = useRef(0);

  const TILE_SIZE = 48; // Size of each maze cell in pixels

  // Trigger particle burst helper
  const addSparkle = (worldX: number, worldY: number, color: string, count = 8) => {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 2;
      particlesRef.current.push({
        x: worldX,
        y: worldY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        maxLife: 30 + Math.random() * 20,
        color,
        size: 1.5 + Math.random() * 2.5
      });
    }
  };

  useEffect(() => {
    let animationFrameId: number;

    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      pulseRef.current += 0.04;
      const pulse = Math.sin(pulseRef.current);

      // Smooth camera interpolation towards player center
      const targetCamX = player.x * TILE_SIZE + TILE_SIZE / 2;
      const targetCamY = player.y * TILE_SIZE + TILE_SIZE / 2;
      cameraRef.current.x += (targetCamX - cameraRef.current.x) * 0.12;
      cameraRef.current.y += (targetCamY - cameraRef.current.y) * 0.12;

      const camOffsetX = canvasWidth / 2 - cameraRef.current.x;
      const camOffsetY = canvasHeight / 2 - cameraRef.current.y;

      // Clear Canvas
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      ctx.save();
      ctx.translate(camOffsetX, camOffsetY);

      // 1. Draw Maze Floor & Walls
      for (let y = 0; y < sector.height; y++) {
        for (let x = 0; x < sector.width; x++) {
          const tile = sector.grid[y][x];
          const px = x * TILE_SIZE;
          const py = y * TILE_SIZE;

          if (tile === 1) {
            // WALL
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

            // Wall Bevel
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(px + 1, py + 1, TILE_SIZE - 2, TILE_SIZE - 2);

            // Neon circuitry trace on walls
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(px + 4, py + 4);
            ctx.lineTo(px + TILE_SIZE - 4, py + 4);
            ctx.stroke();

            // Accent cyber node dot
            if ((x + y) % 3 === 0) {
              ctx.fillStyle = 'rgba(6, 182, 212, 0.4)';
              ctx.beginPath();
              ctx.arc(px + TILE_SIZE / 2, py + TILE_SIZE / 2, 2.5, 0, Math.PI * 2);
              ctx.fill();
            }
          } else {
            // FLOOR
            ctx.fillStyle = '#020617';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);

            // Subtle floor grid lines
            ctx.strokeStyle = 'rgba(15, 23, 42, 0.8)';
            ctx.lineWidth = 1;
            ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);

            // Circuit pathways
            if ((x * 7 + y * 13) % 5 === 0) {
              ctx.strokeStyle = 'rgba(14, 165, 233, 0.08)';
              ctx.beginPath();
              ctx.moveTo(px, py + TILE_SIZE / 2);
              ctx.lineTo(px + TILE_SIZE, py + TILE_SIZE / 2);
              ctx.stroke();
            }
          }
        }
      }

      // 2. Draw Exit Gateway / Firewall Core
      const exitPx = sector.exitPos.x * TILE_SIZE + TILE_SIZE / 2;
      const exitPy = sector.exitPos.y * TILE_SIZE + TILE_SIZE / 2;
      const hasAllKeys = sector.requiredKeys.every(k => player.keys[k]);

      // Exit Gateway aura
      const exitGlow = ctx.createRadialGradient(exitPx, exitPy, 4, exitPx, exitPy, TILE_SIZE * 1.5);
      exitGlow.addColorStop(0, hasAllKeys ? 'rgba(16, 185, 129, 0.6)' : 'rgba(239, 68, 68, 0.4)');
      exitGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = exitGlow;
      ctx.beginPath();
      ctx.arc(exitPx, exitPy, TILE_SIZE * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Spinning Cyber Rings
      ctx.save();
      ctx.translate(exitPx, exitPy);
      ctx.rotate(pulseRef.current * 0.8);
      ctx.strokeStyle = hasAllKeys ? '#10b981' : '#f43f5e';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, TILE_SIZE * 0.4, 0, Math.PI * 2);
      ctx.stroke();

      ctx.rotate(-pulseRef.current * 1.6);
      ctx.strokeStyle = hasAllKeys ? '#34d399' : '#fb7185';
      ctx.lineWidth = 2;
      ctx.strokeRect(-12, -12, 24, 24);
      ctx.restore();

      // 3. Draw Laser Barriers
      sector.lasers.forEach(laser => {
        if (!laser.active) return;
        const lx = laser.x * TILE_SIZE;
        const ly = laser.y * TILE_SIZE;

        // Pulsing electric laser beam
        ctx.strokeStyle = 'rgba(244, 63, 94, 0.85)';
        ctx.lineWidth = 3 + Math.sin(pulseRef.current * 8) * 1.5;
        ctx.shadowColor = '#f43f5e';
        ctx.shadowBlur = 12;

        ctx.beginPath();
        ctx.moveTo(lx, ly + TILE_SIZE / 2);
        ctx.lineTo(lx + TILE_SIZE, ly + TILE_SIZE / 2);
        ctx.stroke();

        ctx.shadowBlur = 0; // reset
      });

      // 4. Draw Terminals
      sector.terminals.forEach(term => {
        const tx = term.x * TILE_SIZE + TILE_SIZE / 2;
        const ty = term.y * TILE_SIZE + TILE_SIZE / 2;

        // Terminal pedestal
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(tx - 14, ty - 14, 28, 28, 6);
        ctx.fill();

        // Terminal screen glow
        const termColor = term.solved ? '#10b981' : '#06b6d4';
        ctx.fillStyle = termColor;
        ctx.shadowColor = termColor;
        ctx.shadowBlur = term.solved ? 8 : 14;
        ctx.fillRect(tx - 9, ty - 9, 18, 14);

        // Holographic prompt beacon above terminal
        ctx.beginPath();
        ctx.arc(tx, ty - 16 + Math.sin(pulseRef.current * 3) * 2, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
      });

      // 5. Draw Cyber Keys
      sector.keys.forEach(key => {
        if (key.collected) return;
        const kx = key.x * TILE_SIZE + TILE_SIZE / 2;
        const ky = key.y * TILE_SIZE + TILE_SIZE / 2 + Math.sin(pulseRef.current * 3 + key.x) * 4;

        ctx.save();
        ctx.translate(kx, ky);

        // Key aura
        const keyAura = ctx.createRadialGradient(0, 0, 2, 0, 0, 18);
        keyAura.addColorStop(0, key.color);
        keyAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = keyAura;
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2);
        ctx.fill();

        // Key shape (Holographic Cyber Key)
        ctx.strokeStyle = key.color;
        ctx.lineWidth = 2.5;
        ctx.shadowColor = key.color;
        ctx.shadowBlur = 12;

        // Key ring
        ctx.beginPath();
        ctx.arc(0, -6, 6, 0, Math.PI * 2);
        ctx.stroke();

        // Key stem
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, 12);
        ctx.lineTo(4, 12);
        ctx.moveTo(0, 8);
        ctx.lineTo(3, 8);
        ctx.stroke();

        ctx.restore();
      });

      // 6. Draw Power-Ups
      sector.powerUps.forEach(pup => {
        if (pup.collected) return;
        const px = pup.x * TILE_SIZE + TILE_SIZE / 2;
        const py = pup.y * TILE_SIZE + TILE_SIZE / 2 + Math.cos(pulseRef.current * 2.5 + pup.x) * 3;

        ctx.save();
        ctx.translate(px, py);

        if (pup.type === 'emp') {
          ctx.strokeStyle = '#38bdf8';
          ctx.fillStyle = '#0284c7';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(0, 0, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else if (pup.type === 'battery') {
          ctx.fillStyle = '#10b981';
          ctx.strokeStyle = '#34d399';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 8;
          ctx.fillRect(-6, -9, 12, 18);
          ctx.strokeRect(-6, -9, 12, 18);
        } else if (pup.type === 'scanner') {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(0, 0, 8, Math.PI, 0);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, 13, Math.PI * 1.1, Math.PI * 1.9);
          ctx.stroke();
        } else if (pup.type === 'speed') {
          ctx.fillStyle = '#eab308';
          ctx.shadowColor = '#eab308';
          ctx.shadowBlur = 10;
          // Lightning icon
          ctx.beginPath();
          ctx.moveTo(1, -9);
          ctx.lineTo(-6, 1);
          ctx.lineTo(0, 1);
          ctx.lineTo(-2, 9);
          ctx.lineTo(6, -1);
          ctx.lineTo(0, -1);
          ctx.closePath();
          ctx.fill();
        }

        ctx.restore();
      });

      // 7. Draw Lore Logs
      sector.loreLogs.forEach(lore => {
        if (lore.collected) return;
        const lx = lore.x * TILE_SIZE + TILE_SIZE / 2;
        const ly = lore.y * TILE_SIZE + TILE_SIZE / 2;

        ctx.fillStyle = '#d97706';
        ctx.strokeStyle = '#fbbf24';
        ctx.shadowColor = '#fbbf24';
        ctx.shadowBlur = 8;
        ctx.save();
        ctx.translate(lx, ly);
        ctx.rotate(pulseRef.current * 0.5);
        ctx.fillRect(-7, -7, 14, 14);
        ctx.strokeRect(-7, -7, 14, 14);
        ctx.restore();
      });

      // 8. Draw Sentinels / Hunter Drones & Vision Cones
      sector.drones.forEach(drone => {
        const dx = drone.x * TILE_SIZE + TILE_SIZE / 2;
        const dy = drone.y * TILE_SIZE + TILE_SIZE / 2;

        // Angle based on direction
        let angle = 0;
        if (drone.direction === 'DOWN') angle = Math.PI / 2;
        if (drone.direction === 'LEFT') angle = Math.PI;
        if (drone.direction === 'UP') angle = -Math.PI / 2;

        // Vision Cone (if not stunned)
        if (drone.stunTimer <= 0) {
          const coneRange = TILE_SIZE * 3.4;
          const coneFov = Math.PI * 0.35; // ~63 degree vision field

          const coneColor = drone.alertState === 'chase'
            ? 'rgba(239, 68, 68, 0.3)'
            : 'rgba(234, 179, 8, 0.15)';

          ctx.fillStyle = coneColor;
          ctx.beginPath();
          ctx.moveTo(dx, dy);
          ctx.arc(dx, dy, coneRange, angle - coneFov / 2, angle + coneFov / 2);
          ctx.closePath();
          ctx.fill();
        }

        // Drone Sprite
        ctx.save();
        ctx.translate(dx, dy);
        ctx.rotate(angle);

        // Drone chassis
        ctx.fillStyle = drone.stunTimer > 0 ? '#475569' : '#0f172a';
        ctx.strokeStyle = drone.alertState === 'chase' ? '#ef4444' : '#f59e0b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(12, 0);
        ctx.lineTo(-8, -12);
        ctx.lineTo(-4, 0);
        ctx.lineTo(-8, 12);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Single red robotic eye
        ctx.fillStyle = drone.stunTimer > 0 ? '#64748b' : (drone.alertState === 'chase' ? '#ff0033' : '#38bdf8');
        ctx.beginPath();
        ctx.arc(4, 0, 3.5, 0, Math.PI * 2);
        ctx.fill();

        // Stunned electrical sparks
        if (drone.stunTimer > 0) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(-10 + Math.random() * 20, -10 + Math.random() * 20);
          ctx.lineTo(-10 + Math.random() * 20, -10 + Math.random() * 20);
          ctx.stroke();
        }

        ctx.restore();
      });

      // 9. Draw Particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 1;

        if (p.life <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // 10. Draw Player Runner Avatar
      const playerPx = player.x * TILE_SIZE + TILE_SIZE / 2;
      const playerPy = player.y * TILE_SIZE + TILE_SIZE / 2;

      // Player direction angle
      let playerAngle = 0;
      if (player.dirX === 1) playerAngle = 0;
      else if (player.dirX === -1) playerAngle = Math.PI;
      else if (player.dirY === 1) playerAngle = Math.PI / 2;
      else if (player.dirY === -1) playerAngle = -Math.PI / 2;

      ctx.save();
      ctx.translate(playerPx, playerPy);

      // Flashlight Cone
      const flashGradient = ctx.createRadialGradient(0, 0, 10, 0, 0, TILE_SIZE * 3.5);
      flashGradient.addColorStop(0, 'rgba(6, 182, 212, 0.45)');
      flashGradient.addColorStop(0.7, 'rgba(6, 182, 212, 0.1)');
      flashGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.save();
      ctx.rotate(playerAngle);
      ctx.fillStyle = flashGradient;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, TILE_SIZE * 3.8, -Math.PI * 0.28, Math.PI * 0.28);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Shield Aura
      if (player.shield > 0) {
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.4 + pulse * 0.2})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(0, 0, 19, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Player Cyber Suit Sprite
      ctx.rotate(playerAngle);

      // Thruster / backpack
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-12, -7, 6, 14);

      // Thruster flame when speed boosted
      if (player.speedBoostTime > 0) {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.moveTo(-12, -4);
        ctx.lineTo(-18 - Math.random() * 6, 0);
        ctx.lineTo(-12, 4);
        ctx.closePath();
        ctx.fill();
      }

      // Torso
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.roundRect(-8, -9, 16, 18, 4);
      ctx.fill();

      // Cyber Visor / Helmet
      ctx.fillStyle = '#22d3ee';
      ctx.shadowColor = '#22d3ee';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(3, 0, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Restore camera translation
      ctx.restore();

      // 11. Fog of War / Lighting Mask Overlay (when scanner is NOT active)
      if (!isScannerActive) {
        ctx.save();
        const screenPlayerX = canvasWidth / 2;
        const screenPlayerY = canvasHeight / 2;

        // Dark vignette overlay
        const lightGrad = ctx.createRadialGradient(
          screenPlayerX,
          screenPlayerY,
          TILE_SIZE * 0.8,
          screenPlayerX,
          screenPlayerY,
          TILE_SIZE * 4.2
        );
        lightGrad.addColorStop(0, 'rgba(3, 7, 18, 0)');
        lightGrad.addColorStop(0.65, 'rgba(3, 7, 18, 0.45)');
        lightGrad.addColorStop(1, 'rgba(3, 7, 18, 0.94)');

        ctx.fillStyle = lightGrad;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
      } else {
        // Scanner Active Radar Wave
        ctx.save();
        const sweepAngle = (Date.now() / 800) % (Math.PI * 2);
        const sweepGrad = ctx.createRadialGradient(
          canvasWidth / 2,
          canvasHeight / 2,
          10,
          canvasWidth / 2,
          canvasHeight / 2,
          canvasWidth
        );
        sweepGrad.addColorStop(0, 'rgba(6, 182, 212, 0.12)');
        sweepGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
        ctx.fillStyle = sweepGrad;
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [sector, player, isScannerActive, canvasWidth, canvasHeight]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      className="block w-full h-full cursor-crosshair"
    />
  );
};
