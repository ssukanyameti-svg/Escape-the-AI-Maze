import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MazeSector, PlayerStats, Terminal, LoreEntry, KeyType } from './types/game';
import { getSector1, getSector2, getSector3, generateProceduralSector } from './utils/mazeGenerator';
import { sound } from './utils/audio';
import { MazeCanvas } from './components/MazeCanvas';
import { GameHUD } from './components/GameHUD';
import { MiniMap } from './components/MiniMap';
import { AriaDialogue } from './components/AriaDialogue';
import { TerminalModal } from './components/TerminalModal';
import { LoreModal } from './components/LoreModal';
import { HelpModal } from './components/HelpModal';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { VirtualControls } from './components/VirtualControls';

export default function App() {
  const [sectorIndex, setSectorIndex] = useState<number>(1);
  const [sector, setSector] = useState<MazeSector>(() => getSector1());
  const [player, setPlayer] = useState<PlayerStats>({
    x: 1,
    y: 1,
    dirX: 0,
    dirY: 1,
    shield: 100,
    maxShield: 100,
    empCharges: 1,
    scannerActiveTime: 0,
    speedBoostTime: 0,
    keys: { alpha: false, beta: false, omega: false },
    score: 0,
    riddlesSolved: 0,
    dronesStunned: 0,
    stepsTaken: 0
  });

  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [activeTerminal, setActiveTerminal] = useState<Terminal | null>(null);
  const [activeLore, setActiveLore] = useState<LoreEntry | null>(null);
  const [showLoreModal, setShowLoreModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);
  const [gameOverReason, setGameOverReason] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isVoiceMuted, setIsVoiceMuted] = useState<boolean>(false);
  const [ariaMessage, setAriaMessage] = useState<string>(
    'Runner identified in Sector 01. Your escape probability is calculated at 0.04%.'
  );
  const [ariaMood, setAriaMood] = useState<'neutral' | 'alert' | 'curious' | 'impressed' | 'threat'>('neutral');
  const [interactionPrompt, setInteractionPrompt] = useState<string | null>(null);
  const [isSprinting, setIsSprinting] = useState<boolean>(false);

  // Canvas container sizing
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 800, height: 600 });

  // Update canvas size on resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setCanvasDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Initialize sector
  const loadSector = useCallback((index: number) => {
    let newSec: MazeSector;
    if (index === 1) newSec = getSector1();
    else if (index === 2) newSec = getSector2();
    else if (index === 3) newSec = getSector3();
    else newSec = generateProceduralSector(index);

    setSector(newSec);
    setSectorIndex(index);
    setPlayer(prev => ({
      ...prev,
      x: newSec.startPos.x,
      y: newSec.startPos.y,
      dirX: 0,
      dirY: 1,
      shield: 100,
      keys: { alpha: false, beta: false, omega: false },
      scannerActiveTime: 0,
      speedBoostTime: 0
    }));
    setElapsedSeconds(0);
    setShowVictoryModal(false);
    setGameOverReason(null);
    setActiveTerminal(null);

    const introMsg = index === 1
      ? 'Runner identified in Sector 01. Locate the Alpha & Beta keys and crack terminal subroutines.'
      : index === 2
      ? 'Sector 02 online. Neural Highway activated. Hunter Sentinel drones have been deployed.'
      : index === 3
      ? 'A.R.I.A. Core Sanctum entered. All three Prime Keys are required to breach my Firewall.'
      : `Nexus Simulation #${index} initialized. The maze is procedurally shifting.`;

    setAriaMessage(introMsg);
    setAriaMood('neutral');
    sound.speakAI(introMsg);
  }, []);

  // Sector Timer
  useEffect(() => {
    if (showVictoryModal || gameOverReason || showHelpModal) return;

    const timer = setInterval(() => {
      setElapsedSeconds(s => s + 1);

      // Decrement power-up durations
      setPlayer(prev => ({
        ...prev,
        scannerActiveTime: Math.max(0, prev.scannerActiveTime - 1),
        speedBoostTime: Math.max(0, prev.speedBoostTime - 1)
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, [showVictoryModal, gameOverReason, showHelpModal]);

  // Ambient sound initialization on first click
  useEffect(() => {
    const handleFirstTouch = () => {
      sound.startAmbience();
      window.removeEventListener('keydown', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
    };
    window.addEventListener('keydown', handleFirstTouch);
    window.addEventListener('click', handleFirstTouch);
    return () => {
      window.removeEventListener('keydown', handleFirstTouch);
      window.removeEventListener('click', handleFirstTouch);
    };
  }, []);

  // Drone AI & Laser Tick Loop
  useEffect(() => {
    if (showVictoryModal || gameOverReason || activeTerminal) return;

    const interval = setInterval(() => {
      // 1. Update Laser cycles
      setSector(prevSector => {
        const updatedLasers = prevSector.lasers.map(l => {
          if (l.isPermanentUntilDisabled) return l;
          const newTimer = (l.timer + 200) % l.cycleTimeMs;
          const active = newTimer < l.cycleTimeMs * 0.6; // 60% active, 40% inactive
          return { ...l, timer: newTimer, active };
        });

        // 2. Update Drone patrol / chase behavior
        const updatedDrones = prevSector.drones.map(drone => {
          if (drone.stunTimer > 0) {
            return {
              ...drone,
              stunTimer: Math.max(0, drone.stunTimer - 0.2),
              alertState: drone.stunTimer <= 0.2 ? ('patrol' as const) : ('stunned' as const)
            };
          }

          // Check line of sight / distance to player
          const distToPlayer = Math.hypot(drone.x - player.x, drone.y - player.y);
          let newAlert = drone.alertState;
          let newDir = drone.direction;
          let nextX = drone.x;
          let nextY = drone.y;

          if (distToPlayer <= 3.5) {
            // Player in detection range!
            newAlert = 'chase';
            // Move towards player
            const dx = Math.sign(player.x - drone.x);
            const dy = Math.sign(player.y - drone.y);

            // Avoid diagonal, prioritize primary delta
            if (Math.abs(player.x - drone.x) > Math.abs(player.y - drone.y)) {
              if (prevSector.grid[drone.y]?.[drone.x + dx] === 0) {
                nextX = drone.x + dx;
                newDir = dx > 0 ? 'RIGHT' : 'LEFT';
              }
            } else {
              if (prevSector.grid[drone.y + dy]?.[drone.x] === 0) {
                nextY = drone.y + dy;
                newDir = dy > 0 ? 'DOWN' : 'UP';
              }
            }

            // Check if drone hit player
            if (nextX === player.x && nextY === player.y) {
              sound.playAlarm();
              setPlayer(p => {
                const nextShield = Math.max(0, p.shield - 25);
                if (nextShield === 0) {
                  setGameOverReason('Sentinel Drone intercepted and terminated runner signal.');
                  sound.playError();
                }
                return { ...p, shield: nextShield };
              });
              setAriaMessage('Hostile runner contact confirmed. Deresolution sequence underway.');
              setAriaMood('threat');
            }
          } else {
            // Normal patrol path
            newAlert = 'patrol';
            if (drone.patrolPath.length > 0) {
              const targetNode = drone.patrolPath[drone.currentPathIndex];
              const dx = Math.sign(targetNode.x - drone.x);
              const dy = Math.sign(targetNode.y - drone.y);

              if (dx !== 0) {
                nextX = drone.x + dx;
                newDir = dx > 0 ? 'RIGHT' : 'LEFT';
              } else if (dy !== 0) {
                nextY = drone.y + dy;
                newDir = dy > 0 ? 'DOWN' : 'UP';
              }

              let nextIndex = drone.currentPathIndex;
              if (nextX === targetNode.x && nextY === targetNode.y) {
                nextIndex = (drone.currentPathIndex + 1) % drone.patrolPath.length;
              }

              return {
                ...drone,
                x: nextX,
                y: nextY,
                direction: newDir,
                alertState: newAlert,
                currentPathIndex: nextIndex
              };
            }
          }

          return {
            ...drone,
            x: nextX,
            y: nextY,
            direction: newDir,
            alertState: newAlert
          };
        });

        return {
          ...prevSector,
          lasers: updatedLasers,
          drones: updatedDrones
        };
      });

      // Check player laser damage
      sector.lasers.forEach(laser => {
        if (laser.active && laser.x === player.x && laser.y === player.y) {
          sound.playError();
          setPlayer(p => {
            const nextShield = Math.max(0, p.shield - 20);
            if (nextShield === 0) {
              setGameOverReason('Runner incinerated by high-energy laser barrier.');
            }
            return { ...p, shield: nextShield };
          });
          setAriaMessage('Warning: Physical integrity compromised by security laser.');
          setAriaMood('alert');
        }
      });
    }, 450);

    return () => clearInterval(interval);
  }, [player.x, player.y, showVictoryModal, gameOverReason, activeTerminal, sector.lasers]);

  // Player Move logic
  const movePlayer = useCallback((dx: number, dy: number) => {
    if (showVictoryModal || gameOverReason || activeTerminal) return;

    const newX = player.x + dx;
    const newY = player.y + dy;

    // Check bounds
    if (newX < 0 || newX >= sector.width || newY < 0 || newY >= sector.height) {
      return;
    }

    const tile = sector.grid[newY][newX];

    // Wall collision
    if (tile === 1) return;

    // Locked gate collision (tile === 3)
    if (tile === 3) {
      sound.playError();
      setAriaMessage('Security gate locked. Solve the linked terminal circuit to decouple.');
      setAriaMood('threat');
      return;
    }

    sound.playFootstep();

    // Check Items & Collections
    let scoreDelta = 5;

    // 1. Keys Collection
    const keyAtCell = sector.keys.find(k => !k.collected && k.x === newX && k.y === newY);
    let updatedKeys = { ...player.keys };
    if (keyAtCell) {
      sound.playKeyPickup();
      updatedKeys[keyAtCell.type] = true;
      scoreDelta += 1000;

      // Update sector keys
      setSector(prev => ({
        ...prev,
        keys: prev.keys.map(k => k.id === keyAtCell.id ? { ...k, collected: true } : k)
      }));

      const msg = `Root ${keyAtCell.name} secured. Firewalls are destabilizing.`;
      setAriaMessage(msg);
      setAriaMood('impressed');
      sound.speakAI(msg);
    }

    // 2. Power-Ups Collection
    const pupAtCell = sector.powerUps.find(p => !p.collected && p.x === newX && p.y === newY);
    let empBonus = 0;
    let scannerBonus = 0;
    let speedBonus = 0;
    let shieldBonus = 0;

    if (pupAtCell) {
      sound.playPowerUp();
      scoreDelta += 250;
      if (pupAtCell.type === 'emp') {
        empBonus = 1;
        setAriaMessage('EMP Shockwave cell charged. Press [F] or [Z] to reboot sentinels.');
      } else if (pupAtCell.type === 'battery') {
        shieldBonus = 35;
        setAriaMessage('Power battery consumed. Runner shields restored.');
      } else if (pupAtCell.type === 'scanner') {
        scannerBonus = 15;
        setAriaMessage('Quantum Scanner online. Full radar sweep broadcasting.');
      } else if (pupAtCell.type === 'speed') {
        speedBonus = 12;
        setAriaMessage('Neural Overclock engaged. Velocity augmented.');
      }

      setSector(prev => ({
        ...prev,
        powerUps: prev.powerUps.map(p => p.id === pupAtCell.id ? { ...p, collected: true } : p)
      }));
    }

    // 3. Lore Data-Chips Collection
    const loreAtCell = sector.loreLogs.find(l => !l.collected && l.x === newX && l.y === newY);
    if (loreAtCell) {
      sound.playSuccess();
      scoreDelta += 400;
      setSector(prev => ({
        ...prev,
        loreLogs: prev.loreLogs.map(l => l.id === loreAtCell.id ? { ...l, collected: true } : l)
      }));
      setActiveLore(loreAtCell);
      setShowLoreModal(true);
      setAriaMessage(`Data-chip recovered: "${loreAtCell.title}". Memory fragments unsealed.`);
    }

    // 4. Exit Gateway Check
    if (newX === sector.exitPos.x && newY === sector.exitPos.y) {
      const hasAllKeys = sector.requiredKeys.every(k => updatedKeys[k]);
      if (hasAllKeys) {
        sound.playSuccess();
        setShowVictoryModal(true);
        const victoryMsg = sector.sectorNumber >= 3
          ? 'Simulation collapsed! You have escaped the AI Maze!'
          : `Sector ${sector.sectorNumber} bypassed! Advancing to the next layer.`;
        setAriaMessage(victoryMsg);
        setAriaMood('impressed');
        sound.speakAI(victoryMsg);
      } else {
        const missing = sector.requiredKeys.filter(k => !updatedKeys[k]).map(k => k.toUpperCase());
        sound.playError();
        const msg = `Firewall Core sealed! Missing required keys: ${missing.join(', ')}.`;
        setAriaMessage(msg);
        setAriaMood('threat');
        sound.speakAI(msg);
      }
    }

    // Update Player
    setPlayer(prev => ({
      ...prev,
      x: newX,
      y: newY,
      dirX: dx,
      dirY: dy,
      shield: Math.min(prev.maxShield, prev.shield + shieldBonus),
      empCharges: prev.empCharges + empBonus,
      scannerActiveTime: prev.scannerActiveTime + scannerBonus,
      speedBoostTime: prev.speedBoostTime + speedBonus,
      keys: updatedKeys,
      score: prev.score + scoreDelta,
      stepsTaken: prev.stepsTaken + 1
    }));
  }, [player, sector, showVictoryModal, gameOverReason, activeTerminal]);

  // EMP Blast Trigger
  const triggerEmpBlast = useCallback(() => {
    if (player.empCharges <= 0 || showVictoryModal || gameOverReason) {
      sound.playError();
      return;
    }

    sound.playEmpBlast();
    setPlayer(prev => ({
      ...prev,
      empCharges: prev.empCharges - 1,
      dronesStunned: prev.dronesStunned + sector.drones.length,
      score: prev.score + 300
    }));

    // Stun drones within 9 tiles
    setSector(prev => ({
      ...prev,
      drones: prev.drones.map(d => {
        const dist = Math.hypot(d.x - player.x, d.y - player.y);
        if (dist <= 9) {
          return { ...d, stunTimer: 8, alertState: 'stunned' };
        }
        return d;
      })
    }));

    setAriaMessage('ALERT: EMP discharge detected! Local sentinel optic sensors blinded.');
    setAriaMood('alert');
  }, [player.empCharges, player.x, player.y, sector.drones, showVictoryModal, gameOverReason]);

  // Primary Interaction (Terminals / Exit)
  const handleInteract = useCallback(() => {
    if (showVictoryModal || gameOverReason) return;

    // Check adjacent or same-tile terminal
    const nearbyTerminal = sector.terminals.find(t => {
      const dist = Math.hypot(t.x - player.x, t.y - player.y);
      return dist <= 1.5;
    });

    if (nearbyTerminal) {
      sound.playTerminalBeep();
      setActiveTerminal(nearbyTerminal);
      return;
    }

    // Check Exit Gateway
    if (player.x === sector.exitPos.x && player.y === sector.exitPos.y) {
      const hasAllKeys = sector.requiredKeys.every(k => player.keys[k]);
      if (hasAllKeys) {
        sound.playSuccess();
        setShowVictoryModal(true);
      } else {
        const missing = sector.requiredKeys.filter(k => !player.keys[k]).map(k => k.toUpperCase());
        setAriaMessage(`Firewall Core requires keys: ${missing.join(', ')}.`);
        setAriaMood('threat');
      }
    }
  }, [sector, player, showVictoryModal, gameOverReason]);

  // Solve Terminal Callback
  const handleSolveTerminal = (terminalId: string, rewardType?: string, rewardKey?: string) => {
    setSector(prev => {
      const targetTerm = prev.terminals.find(t => t.id === terminalId);
      let updatedGrid = [...prev.grid.map(row => [...row])];

      // If terminal unlocks a door or laser
      if (targetTerm?.unlockedDoorPos) {
        const { x, y } = targetTerm.unlockedDoorPos;
        if (updatedGrid[y] && updatedGrid[y][x] === 3) {
          updatedGrid[y][x] = 0; // unlock laser gate
        }
      }

      return {
        ...prev,
        grid: updatedGrid,
        terminals: prev.terminals.map(t =>
          t.id === terminalId ? { ...t, solved: true, rewardClaimed: true } : t
        )
      };
    });

    // Reward player
    setPlayer(prev => {
      const updatedKeys = { ...prev.keys };
      let newEmp = prev.empCharges;
      let newScanner = prev.scannerActiveTime;
      let newShield = prev.shield;

      if (rewardKey) {
        updatedKeys[rewardKey as KeyType] = true;
      }
      if (rewardType === 'emp') newEmp += 1;
      if (rewardType === 'scanner') newScanner += 15;
      if (rewardType === 'shield') newShield = Math.min(prev.maxShield, prev.shield + 40);

      return {
        ...prev,
        keys: updatedKeys,
        empCharges: newEmp,
        scannerActiveTime: newScanner,
        shield: newShield,
        score: prev.score + 1500,
        riddlesSolved: prev.riddlesSolved + 1
      };
    });

    const taunt = 'Security terminal overridden. Your logical inference was... satisfactory.';
    setAriaMessage(taunt);
    setAriaMood('curious');
    sound.speakAI(taunt);
  };

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If modal open, handle ESC to close
      if (e.key === 'Escape') {
        if (activeTerminal) setActiveTerminal(null);
        if (showLoreModal) setShowLoreModal(false);
        if (showHelpModal) setShowHelpModal(false);
        return;
      }

      if (activeTerminal || showLoreModal || showHelpModal || showVictoryModal || gameOverReason) {
        return;
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          movePlayer(1, 0);
          break;
        case ' ':
        case 'e':
        case 'E':
        case 'Enter':
          e.preventDefault();
          handleInteract();
          break;
        case 'f':
        case 'F':
        case 'z':
        case 'Z':
          e.preventDefault();
          triggerEmpBlast();
          break;
        case 'Shift':
          setIsSprinting(true);
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsSprinting(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [movePlayer, handleInteract, triggerEmpBlast, activeTerminal, showLoreModal, showHelpModal, showVictoryModal, gameOverReason]);

  // Update prompt for nearby interactables
  useEffect(() => {
    const nearbyTerminal = sector.terminals.find(t => {
      const dist = Math.hypot(t.x - player.x, t.y - player.y);
      return dist <= 1.5;
    });

    if (nearbyTerminal) {
      setInteractionPrompt(nearbyTerminal.solved ? '[SPACE / E] INSPECT OVERRIDDEN TERMINAL' : '[SPACE / E] HACK AI SECURITY TERMINAL');
      return;
    }

    if (player.x === sector.exitPos.x && player.y === sector.exitPos.y) {
      setInteractionPrompt('[SPACE / E] ACCESS EXIT FIREWALL GATEWAY');
      return;
    }

    setInteractionPrompt(null);
  }, [sector, player]);

  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sound.setMuted(next);
  };

  const toggleVoiceMute = () => {
    const next = !isVoiceMuted;
    setIsVoiceMuted(next);
    sound.setSpeechMuted(next);
  };

  const collectedLoreCount = sector.loreLogs.filter(l => l.collected).length;

  return (
    <div className="relative w-screen h-screen bg-slate-950 text-slate-100 flex flex-col overflow-hidden select-none">
      {/* Top Game HUD Header */}
      <GameHUD
        sector={sector}
        player={player}
        elapsedSeconds={elapsedSeconds}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        onOpenLore={() => setShowLoreModal(true)}
        onOpenHelp={() => setShowHelpModal(true)}
        onRestart={() => loadSector(sectorIndex)}
        loreCount={collectedLoreCount}
        totalLore={sector.loreLogs.length}
      />

      {/* Main Game Stage Container */}
      <div ref={containerRef} className="relative flex-1 w-full h-full overflow-hidden bg-slate-950">
        {/* CRT Scanline Effect */}
        <div className="absolute inset-0 scanlines opacity-25 pointer-events-none z-10" />

        {/* 2D Canvas Engine */}
        <MazeCanvas
          sector={sector}
          player={player}
          isScannerActive={player.scannerActiveTime > 0}
          onInteractPrompt={interactionPrompt}
          canvasWidth={canvasDimensions.width}
          canvasHeight={canvasDimensions.height}
        />

        {/* Top-Right Mini-Map Radar */}
        <div className="absolute top-4 right-4 z-20 pointer-events-auto">
          <MiniMap
            sector={sector}
            player={player}
            isScannerActive={player.scannerActiveTime > 0}
          />
        </div>

        {/* Center Floating Interaction Banner */}
        {interactionPrompt && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-auto">
            <button
              onClick={handleInteract}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900/90 border-2 border-emerald-400 rounded-xl font-orbitron font-bold text-xs sm:text-sm text-emerald-300 neon-glow-emerald animate-bounce shadow-2xl"
            >
              <span>{interactionPrompt}</span>
            </button>
          </div>
        )}

        {/* Bottom Floating Area: A.R.I.A. Dialogue Banner & Touch Controls */}
        <div className="absolute inset-x-0 bottom-3 z-20 flex flex-col items-center gap-2 px-4 pointer-events-none">
          <div className="w-full max-w-2xl pointer-events-auto">
            <AriaDialogue
              message={ariaMessage}
              mood={ariaMood}
              isVoiceMuted={isVoiceMuted}
              onToggleVoice={toggleVoiceMute}
            />
          </div>

          {/* Virtual Mobile D-Pad & Action Buttons */}
          <VirtualControls
            onMove={movePlayer}
            onInteract={handleInteract}
            onEmp={triggerEmpBlast}
            onSprint={() => setIsSprinting(!isSprinting)}
            canInteract={!!interactionPrompt}
            empCount={player.empCharges}
            isSprinting={isSprinting || player.speedBoostTime > 0}
          />
        </div>
      </div>

      {/* Terminal Puzzle Modal */}
      {activeTerminal && (
        <TerminalModal
          terminal={activeTerminal}
          onClose={() => setActiveTerminal(null)}
          onSolve={handleSolveTerminal}
        />
      )}

      {/* Lore Data Archive Modal */}
      {showLoreModal && (
        <LoreModal
          logs={sector.loreLogs}
          activeLog={activeLore}
          onSelectLog={setActiveLore}
          onClose={() => setShowLoreModal(false)}
        />
      )}

      {/* Runner Help Guide Modal */}
      {showHelpModal && (
        <HelpModal onClose={() => setShowHelpModal(false)} />
      )}

      {/* Sector Cleared / Game Complete Modal */}
      {showVictoryModal && (
        <VictoryModal
          sector={sector}
          player={player}
          timeSeconds={elapsedSeconds}
          onNextSector={() => loadSector(sectorIndex + 1)}
          onReplay={() => loadSector(sectorIndex)}
          isGameComplete={sectorIndex === 3}
        />
      )}

      {/* Game Over Modal */}
      {gameOverReason && (
        <GameOverModal
          reason={gameOverReason}
          onRetry={() => loadSector(sectorIndex)}
        />
      )}
    </div>
  );
}
