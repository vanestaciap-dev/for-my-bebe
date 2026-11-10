import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  MAP_WIDTH,
  MAP_HEIGHT,
  TILE_SIZE,
  OVERWORLD_TILES,
  TileType,
  SOLID_TILES,
  MAP_ENTITIES,
  HELL_MAP_WIDTH,
  HELL_MAP_HEIGHT,
  HELL_MAP_TILES,
  HELL_MAP_ENTITIES,
  HellTileType,
  SOLID_HELL_TILES
} from './mapData';
import {
  Direction,
  Position,
  MapEntity,
  CollectibleItem,
  MemoryPuzzle,
  WeatherType,
  WorldRealm,
  HellDemon
} from '../types/game';
import { sound } from '../utils/audio';
import { Focus, Swords, Flame, Sparkles } from 'lucide-react';

interface GameCanvasProps {
  realm: WorldRealm;
  collectibles: CollectibleItem[];
  puzzles: MemoryPuzzle[];
  demons: HellDemon[];
  onAttackDemon: (demonId: string) => void;
  isHellChestUnlocked: boolean;
  isGateUnlocked: boolean;
  onInteractEntity: (entity: MapEntity) => void;
  playerPos: Position;
  setPlayerPos: React.Dispatch<React.SetStateAction<Position>>;
  playerDir: Direction;
  setPlayerDir: React.Dispatch<React.SetStateAction<Direction>>;
  isSprinting: boolean;
  nearEntity: MapEntity | null;
  weather: WeatherType;
  playerHp: number;
  playerMaxHp: number;
  onPlayerTakeDamage: (amount: number, fromSource: string) => void;
  onHealPlayer?: (amount: number) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  realm,
  collectibles,
  puzzles,
  demons,
  onAttackDemon,
  isHellChestUnlocked,
  isGateUnlocked,
  onInteractEntity,
  playerPos,
  setPlayerPos,
  playerDir,
  setPlayerDir,
  isSprinting,
  nearEntity,
  weather,
  playerHp,
  playerMaxHp,
  onPlayerTakeDamage,
  onHealPlayer
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const frameCountRef = useRef(0);
  const [walkFrame, setWalkFrame] = useState(0);

  // Dynamic Camera coordinates (top-left of viewport in world pixels)
  const cameraRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isCameraLocked, setIsCameraLocked] = useState(true);

  // Attack slash animation state
  const slashAnimRef = useRef<{ active: boolean; frame: number; x: number; y: number; dir: Direction }>({
    active: false,
    frame: 0,
    x: 0,
    y: 0,
    dir: 'down'
  });

  // Combat AI & Projectile state refs
  const onPlayerTakeDamageRef = useRef(onPlayerTakeDamage);
  onPlayerTakeDamageRef.current = onPlayerTakeDamage;

  const onHealPlayerRef = useRef(onHealPlayer);
  onHealPlayerRef.current = onHealPlayer;

  const demonAttackTimersRef = useRef<Record<string, number>>({});
  const demonProjectilesRef = useRef<{ id: number; x: number; y: number; vx: number; vy: number; color: string; life: number; radius: number }[]>([]);
  const playerInvincibleUntilRef = useRef<number>(0);
  const screenShakeRef = useRef<number>(0);
  const damageFlashRef = useRef<number>(0);
  const clawSwipesRef = useRef<{ x: number; y: number; frame: number; maxFrames: number; color: string }[]>([]);
  const droppedHeartsRef = useRef<{ id: string; x: number; y: number; collected: boolean }[]>([]);
  const defeatedDemonIdsRef = useRef<Set<string>>(new Set());

  // Track newly defeated demons to drop Love Hearts
  useEffect(() => {
    demons.forEach(demon => {
      if (demon.isDefeated && !defeatedDemonIdsRef.current.has(demon.id)) {
        defeatedDemonIdsRef.current.add(demon.id);
        droppedHeartsRef.current.push({
          id: `heart_${demon.id}`,
          x: demon.x,
          y: demon.y,
          collected: false
        });
      }
    });
  }, [demons]);

  // Canvas Viewport Dimensions
  const [viewportSize, setViewportSize] = useState<{ width: number; height: number }>({
    width: 800,
    height: 520
  });

  // Weather Particles (Kota Lama)
  const rainDropsRef = useRef<{ x: number; y: number; speed: number; len: number }[]>([]);
  const ripplesRef = useRef<{ x: number; y: number; radius: number; maxRadius: number; alpha: number }[]>([]);
  const firefliesRef = useRef<{ x: number; y: number; vx: number; vy: number; phase: number }[]>([]);
  const petalsRef = useRef<{ x: number; y: number; vx: number; vy: number; rot: number; size: number }[]>([]);

  // Hell Cinder Particles
  const cindersRef = useRef<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number }[]>([]);

  // Initialize weather & hell particles
  useEffect(() => {
    // Raindrops
    const rains = [];
    for (let i = 0; i < 70; i++) {
      rains.push({
        x: Math.random() * (MAP_WIDTH * TILE_SIZE),
        y: Math.random() * (MAP_HEIGHT * TILE_SIZE),
        speed: 12 + Math.random() * 8,
        len: 10 + Math.random() * 8
      });
    }
    rainDropsRef.current = rains;

    // Fireflies
    const ffs = [];
    for (let i = 0; i < 30; i++) {
      ffs.push({
        x: Math.random() * (MAP_WIDTH * TILE_SIZE),
        y: Math.random() * (MAP_HEIGHT * TILE_SIZE),
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        phase: Math.random() * Math.PI * 2
      });
    }
    firefliesRef.current = ffs;

    // Frangipani petals
    const pts = [];
    for (let i = 0; i < 40; i++) {
      pts.push({
        x: Math.random() * (MAP_WIDTH * TILE_SIZE),
        y: Math.random() * (MAP_HEIGHT * TILE_SIZE),
        vx: 0.8 + Math.random() * 1.2,
        vy: 0.4 + Math.random() * 0.8,
        rot: Math.random() * Math.PI * 2,
        size: 3 + Math.random() * 4
      });
    }
    petalsRef.current = pts;

    // Hell cinders
    const cnds = [];
    for (let i = 0; i < 50; i++) {
      cnds.push({
        x: Math.random() * (HELL_MAP_WIDTH * TILE_SIZE),
        y: Math.random() * (HELL_MAP_HEIGHT * TILE_SIZE),
        vx: (Math.random() - 0.5) * 0.7,
        vy: -(1.5 + Math.random() * 2),
        size: 2 + Math.random() * 3,
        alpha: 0.4 + Math.random() * 0.6
      });
    }
    cindersRef.current = cnds;
  }, []);

  // Update canvas size on window resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const w = Math.min(containerRef.current.clientWidth, 960);
        const h = Math.min(window.innerHeight * 0.62, 540);
        setViewportSize({ width: Math.max(340, w), height: Math.max(360, h) });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Smooth camera following player
  useEffect(() => {
    if (!isCameraLocked) return;

    const currentMapW = realm === 'hell_realm' ? HELL_MAP_WIDTH : MAP_WIDTH;
    const currentMapH = realm === 'hell_realm' ? HELL_MAP_HEIGHT : MAP_HEIGHT;

    const targetX = playerPos.x * TILE_SIZE + TILE_SIZE / 2 - viewportSize.width / 2;
    const targetY = playerPos.y * TILE_SIZE + TILE_SIZE / 2 - viewportSize.height / 2;

    const maxCamX = Math.max(0, currentMapW * TILE_SIZE - viewportSize.width);
    const maxCamY = Math.max(0, currentMapH * TILE_SIZE - viewportSize.height);

    const clampedX = Math.max(0, Math.min(maxCamX, targetX));
    const clampedY = Math.max(0, Math.min(maxCamY, targetY));

    cameraRef.current = { x: clampedX, y: clampedY };
  }, [playerPos, viewportSize, isCameraLocked, realm]);

  // Attack Action Handler (Sword slash + hit demons)
  const performAttack = useCallback(() => {
    sound.playSwordSlash();
    slashAnimRef.current = {
      active: true,
      frame: 0,
      x: playerPos.x * TILE_SIZE,
      y: playerPos.y * TILE_SIZE,
      dir: playerDir
    };

    if (realm === 'hell_realm') {
      // Check demon in front of player
      let strikeX = playerPos.x;
      let strikeY = playerPos.y;
      if (playerDir === 'up') strikeY -= 1;
      if (playerDir === 'down') strikeY += 1;
      if (playerDir === 'left') strikeX -= 1;
      if (playerDir === 'right') strikeX += 1;

      // Find nearby alive demon
      const targetDemon = demons.find(d => {
        if (d.isDefeated) return false;
        const isFacing = d.x === strikeX && d.y === strikeY;
        const isAdjacent = Math.abs(d.x - playerPos.x) <= 1 && Math.abs(d.y - playerPos.y) <= 1;
        return isFacing || isAdjacent;
      });

      if (targetDemon) {
        onAttackDemon(targetDemon.id);
      }
    }
  }, [playerPos, playerDir, realm, demons, onAttackDemon]);

  // Movement handler with boundary & obstacle collision
  const movePlayer = useCallback(
    (dir: Direction) => {
      setPlayerDir(dir);
      sound.playFootstep();
      setIsCameraLocked(true);

      const currentMapW = realm === 'hell_realm' ? HELL_MAP_WIDTH : MAP_WIDTH;
      const currentMapH = realm === 'hell_realm' ? HELL_MAP_HEIGHT : MAP_HEIGHT;
      const currentTiles = realm === 'hell_realm' ? HELL_MAP_TILES : OVERWORLD_TILES;
      const currentSolid = realm === 'hell_realm' ? SOLID_HELL_TILES : SOLID_TILES;

      setPlayerPos(curr => {
        let nx = curr.x;
        let ny = curr.y;

        if (dir === 'up') ny -= 1;
        if (dir === 'down') ny += 1;
        if (dir === 'left') nx -= 1;
        if (dir === 'right') nx += 1;

        // Map Boundaries
        if (nx < 1 || nx >= currentMapW - 1 || ny < 1 || ny >= currentMapH - 1) {
          return curr;
        }

        // Check solid obstacle
        const tile = currentTiles[ny]?.[nx];
        if (tile !== undefined && currentSolid.has(tile)) {
          return curr;
        }

        // Check locked Gerbang Kasih (Kota Lama)
        if (realm === 'kota_lama' && !isGateUnlocked && nx === 14 && ny === 4) {
          return curr;
        }

        // Step animation frame
        setWalkFrame(f => (f + 1) % 4);
        return { x: nx, y: ny };
      });
    },
    [setPlayerDir, setPlayerPos, isGateUnlocked, realm]
  );

  // Click / Tap on canvas to walk or attack
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX + cameraRef.current.x;
    const clickY = (e.clientY - rect.top) * scaleY + cameraRef.current.y;

    const tileX = Math.floor(clickX / TILE_SIZE);
    const tileY = Math.floor(clickY / TILE_SIZE);

    // If clicking directly on a demon in Hell, attack it!
    if (realm === 'hell_realm') {
      const clickedDemon = demons.find(
        d => !d.isDefeated && Math.abs(d.x - tileX) <= 1 && Math.abs(d.y - tileY) <= 1
      );
      if (clickedDemon) {
        performAttack();
        return;
      }
    }

    const dx = tileX - playerPos.x;
    const dy = tileY - playerPos.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      movePlayer(dx > 0 ? 'right' : 'left');
    } else if (dy !== 0) {
      movePlayer(dy > 0 ? 'down' : 'up');
    }
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        movePlayer('up');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        movePlayer('down');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        movePlayer('left');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        movePlayer('right');
      } else if (e.key === 'f' || e.key === 'F') {
        // Attack key
        e.preventDefault();
        performAttack();
      } else if (e.key === ' ' || e.key === 'Enter' || e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        if (nearEntity) {
          onInteractEntity(nearEntity);
        } else if (realm === 'hell_realm') {
          // In hell, space can also swing sword
          performAttack();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, nearEntity, onInteractEntity, performAttack, realm]);

  // Main 16-Bit Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      frameCountRef.current++;
      const frame = frameCountRef.current;
      const cam = cameraRef.current;

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let shakeX = 0;
      let shakeY = 0;
      if (screenShakeRef.current > 0) {
        shakeX = (Math.random() - 0.5) * screenShakeRef.current * 4;
        shakeY = (Math.random() - 0.5) * screenShakeRef.current * 4;
        screenShakeRef.current = Math.max(0, screenShakeRef.current - 0.5);
      }
      ctx.translate(-Math.round(cam.x + shakeX), -Math.round(cam.y + shakeY));

      const isHell = realm === 'hell_realm';
      const curWidth = isHell ? HELL_MAP_WIDTH : MAP_WIDTH;
      const curHeight = isHell ? HELL_MAP_HEIGHT : MAP_HEIGHT;
      const curTiles = isHell ? HELL_MAP_TILES : OVERWORLD_TILES;

      const startTileX = Math.max(0, Math.floor(cam.x / TILE_SIZE) - 1);
      const endTileX = Math.min(curWidth, Math.ceil((cam.x + canvas.width) / TILE_SIZE) + 1);
      const startTileY = Math.max(0, Math.floor(cam.y / TILE_SIZE) - 1);
      const endTileY = Math.min(curHeight, Math.ceil((cam.y + canvas.height) / TILE_SIZE) + 1);

      // 1. Draw World Tiles
      for (let y = startTileY; y < endTileY; y++) {
        for (let x = startTileX; x < endTileX; x++) {
          const tile = curTiles[y]?.[x] ?? 0;
          const px = x * TILE_SIZE;
          const py = y * TILE_SIZE;

          if (isHell) {
            // --- HELL REALM RENDERING ---
            switch (tile) {
              case HellTileType.OBSIDIAN_FLOOR: {
                ctx.fillStyle = '#18181b'; // Dark basalt
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#27272a';
                ctx.fillRect(px + 4, py + 4, 14, 14);
                ctx.fillRect(px + 22, py + 20, 12, 14);
                if ((x + y) % 3 === 0) {
                  // Magma vein
                  ctx.fillStyle = '#ef4444';
                  ctx.fillRect(px + 10, py + 14, 8, 2);
                }
                break;
              }
              case HellTileType.OBSIDIAN_WALL: {
                ctx.fillStyle = '#09090b';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#27272a';
                ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);
                // Skull horn detail
                ctx.fillStyle = '#71717a';
                ctx.fillRect(px + 12, py + 10, 16, 18);
                ctx.fillStyle = '#ef4444';
                ctx.fillRect(px + 16, py + 14, 3, 3);
                ctx.fillRect(px + 22, py + 14, 3, 3);
                break;
              }
              case HellTileType.LAVA_RIVER: {
                // Bubbling Magma
                ctx.fillStyle = '#b91c1c';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                const pulse = Math.sin(frame * 0.08 + x) * 3;
                ctx.fillStyle = '#f97316';
                ctx.fillRect(px + 2, py + 8 + pulse, TILE_SIZE - 4, 12);
                ctx.fillStyle = '#fef08a';
                ctx.fillRect(px + 8, py + 12 + pulse, 12, 4);
                break;
              }
              case HellTileType.MAGMA_CRACK: {
                ctx.fillStyle = '#27272a';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#ea580c';
                ctx.fillRect(px + 2, py + 18, TILE_SIZE - 4, 4);
                ctx.fillRect(px + 18, py + 2, 4, TILE_SIZE - 4);
                break;
              }
              case HellTileType.RUNE_PEDESTAL: {
                // Sacred Center Altar
                ctx.fillStyle = '#450a0a';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#7f1d1d';
                ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);
                ctx.fillStyle = '#f43f5e';
                ctx.fillRect(px + 16, py + 16, 8, 8);
                break;
              }
              case HellTileType.RETURN_PORTAL: {
                // Blue swirl return portal
                ctx.fillStyle = '#1e1b4b';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#38bdf8';
                ctx.beginPath();
                ctx.arc(px + 20, py + 20, 14, 0, Math.PI * 2);
                ctx.fill();
                break;
              }
            }
          } else {
            // --- KOTA LAMA REALM RENDERING ---
            switch (tile) {
              case TileType.GRASS_PARK: {
                ctx.fillStyle = '#2f5e28';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#3d7834';
                ctx.fillRect(px + 4, py + 4, 14, 14);
                ctx.fillRect(px + 22, py + 20, 12, 14);
                if ((x * 3 + y * 7) % 7 === 0) {
                  ctx.fillStyle = '#fffbeb';
                  ctx.fillRect(px + 14, py + 16, 5, 5);
                  ctx.fillStyle = '#fef08a';
                  ctx.fillRect(px + 16, py + 18, 2, 2);
                }
                break;
              }
              case TileType.COBBLESTONE: {
                ctx.fillStyle = '#6b7280';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#4b5563';
                ctx.fillRect(px + 1, py + 1, TILE_SIZE - 2, 2);
                ctx.fillRect(px + 1, py + TILE_SIZE - 3, TILE_SIZE - 2, 2);
                ctx.fillStyle = (x + y) % 2 === 0 ? '#9ca3af' : '#78716c';
                ctx.fillRect(px + 4, py + 5, 14, 12);
                ctx.fillRect(px + 20, py + 5, 16, 12);
                ctx.fillRect(px + 4, py + 22, 16, 12);
                ctx.fillRect(px + 22, py + 22, 14, 12);
                break;
              }
              case TileType.RED_BRICK_WALL: {
                ctx.fillStyle = '#7f1d1d';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#991b1b';
                ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, 16);
                ctx.fillRect(px + 2, py + 20, TILE_SIZE - 4, 16);
                ctx.fillStyle = '#fef3c7';
                ctx.fillRect(px, py + TILE_SIZE - 4, TILE_SIZE, 4);
                break;
              }
              case TileType.CANAL_WATER: {
                ctx.fillStyle = '#0e7490';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                const wave = Math.sin(frame * 0.05 + x * 0.8) * 3;
                ctx.fillStyle = '#22d3ee';
                ctx.fillRect(px + 4, py + 10 + wave, 16, 3);
                ctx.fillRect(px + 18, py + 26 - wave, 14, 2);
                break;
              }
              case TileType.BRIDGE_BALUSTRADE: {
                ctx.fillStyle = '#64748b';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#f1f5f9';
                ctx.fillRect(px + 4, py + 4, 8, 32);
                ctx.fillRect(px + 18, py + 4, 8, 32);
                ctx.fillStyle = '#94a3b8';
                ctx.fillRect(px, py + 8, TILE_SIZE, 4);
                ctx.fillRect(px, py + 24, TILE_SIZE, 4);
                break;
              }
              case TileType.DOME_TILE: {
                ctx.fillStyle = '#0f766e';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#14b8a6';
                ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);
                ctx.fillStyle = '#fef08a';
                ctx.fillRect(px + 18, py + 18, 4, 4);
                break;
              }
              case TileType.CHECKER_MARBLE: {
                const isEven = (x + y) % 2 === 0;
                ctx.fillStyle = isEven ? '#f8fafc' : '#1e293b';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = isEven ? '#e2e8f0' : '#0f172a';
                ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
                break;
              }
              case TileType.WOOD_TIMBER: {
                ctx.fillStyle = '#78350f';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#92400e';
                ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, 10);
                ctx.fillRect(px + 2, py + 15, TILE_SIZE - 4, 10);
                ctx.fillRect(px + 2, py + 28, TILE_SIZE - 4, 10);
                break;
              }
              case TileType.CINEMA_CARPET: {
                ctx.fillStyle = '#4c0519';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#881337';
                ctx.fillRect(px + 3, py + 3, TILE_SIZE - 6, TILE_SIZE - 6);
                if ((x + y) % 2 === 0) {
                  ctx.fillStyle = '#f59e0b';
                  ctx.fillRect(px + 18, py + 18, 4, 4);
                }
                break;
              }
              case TileType.BANYAN_TREE: {
                ctx.fillStyle = '#2f5e28';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#451a03';
                ctx.fillRect(px + 14, py + 20, 12, 20);
                ctx.fillStyle = '#14532d';
                ctx.fillRect(px + 2, py + 2, 36, 26);
                ctx.fillStyle = '#16a34a';
                ctx.fillRect(px + 5, py + 5, 30, 20);
                break;
              }
              case TileType.ANTIQUE_COUNTER: {
                ctx.fillStyle = '#451a03';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#b45309';
                ctx.fillRect(px + 2, py + 2, TILE_SIZE - 4, 14);
                break;
              }
              case TileType.FLOWER_BUSH: {
                ctx.fillStyle = '#2f5e28';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                ctx.fillStyle = '#166534';
                ctx.fillRect(px + 4, py + 6, 32, 28);
                ctx.fillStyle = '#e11d48';
                ctx.fillRect(px + 8, py + 10, 6, 6);
                break;
              }
              case TileType.SECRET_PORTAL: {
                // Glowing Hell Road Portal behind cinema
                ctx.fillStyle = '#1c1917';
                ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
                const glow = Math.sin(frame * 0.1) * 4;
                ctx.fillStyle = '#dc2626';
                ctx.beginPath();
                ctx.arc(px + 20, py + 20, 14 + glow, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#fbbf24';
                ctx.fillRect(px + 16, py + 16, 8, 8);
                break;
              }
            }
          }
        }
      }

      // 2. Draw Entities
      const currentEntities = isHell ? HELL_MAP_ENTITIES : MAP_ENTITIES;
      currentEntities.forEach(ent => {
        if (ent.id === 'entity_golden_gate' && isGateUnlocked) {
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(ent.x * TILE_SIZE + 4, ent.y * TILE_SIZE + 2, 6, 36);
          ctx.fillRect(ent.x * TILE_SIZE + 30, ent.y * TILE_SIZE + 2, 6, 36);
          return;
        }

        const ex = ent.x * TILE_SIZE;
        const ey = ent.y * TILE_SIZE;
        const bounce = Math.sin(frame * 0.08 + ent.x) * 3;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.ellipse(ex + 20, ey + 32, 14, 7, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '28px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ent.sprite, ex + 20, ey + 18 + bounce);

        // Hell Chest visual state (Chains or Golden Aura)
        if (ent.id === 'entity_hell_chest') {
          if (!isHellChestUnlocked) {
            // Crimson chains around chest
            ctx.font = '14px sans-serif';
            ctx.fillText('🔗', ex + 6, ey + 6);
            ctx.fillText('🔗', ex + 34, ey + 6);
          } else {
            // Golden Rose Aura & Letter icon
            const aura = Math.sin(frame * 0.1) * 3;
            ctx.font = `${18 + aura}px sans-serif`;
            ctx.fillText('💌', ex + 20, ey - 10 + bounce);
          }
        }

        // Collectibles checkmarks
        if (ent.type === 'item') {
          const col = collectibles.find(c => c.id === ent.targetId);
          if (col?.found) {
            ctx.font = 'bold 14px monospace';
            ctx.fillStyle = '#10b981';
            ctx.fillText('✓', ex + 32, ey + 8);
          }
        }

        // Puzzle keys
        if (ent.type === 'puzzle') {
          const pz = puzzles.find(p => p.id === ent.targetId);
          if (pz?.solved) {
            ctx.font = '14px sans-serif';
            ctx.fillText('🗝️', ex + 32, ey + 8);
          }
        }
      });

      // 3. Draw Hell Demons & Demon Attack AI (If in Hell Realm)
      const now = Date.now();
      const pCenterX = playerPos.x * TILE_SIZE + 20;
      const pCenterY = playerPos.y * TILE_SIZE + 20;

      if (isHell) {
        demons.forEach(demon => {
          if (demon.isDefeated) {
            // Dissolved sparkle tombstone / flower
            ctx.font = '16px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('🌸', demon.x * TILE_SIZE + 20, demon.y * TILE_SIZE + 20);
            return;
          }

          const dx = demon.x * TILE_SIZE;
          const dy = demon.y * TILE_SIZE;
          const demonBounce = Math.sin(frame * 0.1 + demon.x * 2) * 4;
          const distTiles = Math.hypot(demon.x - playerPos.x, demon.y - playerPos.y);

          // Shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
          ctx.beginPath();
          ctx.ellipse(dx + 20, dy + 32, 16, 8, 0, 0, Math.PI * 2);
          ctx.fill();

          // Demon Sprite
          ctx.font = '32px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(demon.sprite, dx + 20, dy + 18 + demonBounce);

          // Name and HP hearts above demon
          ctx.font = 'bold 8px "Press Start 2P", monospace';
          ctx.fillStyle = demon.color;
          ctx.fillText(demon.name, dx + 20, dy - 8 + demonBounce);

          // HP Hearts
          let hpStr = '';
          for (let h = 0; h < demon.maxHp; h++) {
            hpStr += h < demon.hp ? '❤️' : '🖤';
          }
          ctx.font = '9px sans-serif';
          ctx.fillText(hpStr, dx + 20, dy + 2);

          // Aggro indicator & Demon Attack AI
          if (distTiles <= 5.5) {
            // Aggro warning bubble
            const alertY = dy - 20 + Math.sin(frame * 0.15) * 3;
            ctx.fillStyle = '#ef4444';
            ctx.font = 'bold 7px "Press Start 2P", monospace';
            ctx.fillText('⚠️ AGGRO', dx + 20, alertY);

            // Demon Attack execution
            const nextAttackTime = demonAttackTimersRef.current[demon.id];
            if (nextAttackTime === undefined) {
              // Initial sight grace period (1.8s - 2.6s)
              demonAttackTimersRef.current[demon.id] = now + 1800 + Math.random() * 800;
            } else if (now > nextAttackTime) {
              // Set next attack cooldown (2.4s - 3.2s)
              demonAttackTimersRef.current[demon.id] = now + 2400 + Math.random() * 800;

              if (distTiles <= 1.8) {
                // Melee strike: Cursed Claw Swipe!
                clawSwipesRef.current.push({
                  x: pCenterX,
                  y: pCenterY,
                  frame: 0,
                  maxFrames: 14,
                  color: demon.color
                });
                sound.playDemonAttack();

                if (now > playerInvincibleUntilRef.current) {
                  playerInvincibleUntilRef.current = now + 1200;
                  screenShakeRef.current = 7;
                  damageFlashRef.current = 10;
                  sound.playPlayerHurt();
                  const demonName = demon.name;
                  setTimeout(() => {
                    onPlayerTakeDamageRef.current?.(1, demonName);
                  }, 0);
                }
              } else {
                // Ranged attack: Hellfire Projectile Orb!
                const angle = Math.atan2(pCenterY - (dy + 18), pCenterX - (dx + 20));
                const speed = 4.0;
                demonProjectilesRef.current.push({
                  id: Math.random(),
                  x: dx + 20,
                  y: dy + 18,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  color: demon.color,
                  radius: 7,
                  life: 100
                });
                sound.playDemonAttack();
              }
            }
          }
        });

        // Draw dropped Love Hearts (heals +2 HP)
        droppedHeartsRef.current.forEach(heart => {
          if (!heart.collected) {
            const hx = heart.x * TILE_SIZE + 20;
            const hy = heart.y * TILE_SIZE + 20 + Math.sin(frame * 0.12) * 4;
            ctx.font = '22px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('💖', hx, hy);

            ctx.fillStyle = 'rgba(244, 63, 94, 0.25)';
            ctx.beginPath();
            ctx.arc(hx, hy, 16, 0, Math.PI * 2);
            ctx.fill();

            // Auto-pickup if player is close
            if (Math.hypot(hx - pCenterX, hy - pCenterY) < 24) {
              heart.collected = true;
              sound.playHealHeart();
              setTimeout(() => {
                onHealPlayerRef.current?.(2);
              }, 0);
            }
          }
        });

        // Update & Draw Demon Projectiles
        demonProjectilesRef.current.forEach(proj => {
          proj.x += proj.vx;
          proj.y += proj.vy;
          proj.life--;

          ctx.save();
          ctx.shadowColor = proj.color;
          ctx.shadowBlur = 10;
          ctx.fillStyle = proj.color;
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
          ctx.fill();

          // Glowing hot core
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, proj.radius * 0.45, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();

          // Check collision with player
          const hitDist = Math.hypot(proj.x - pCenterX, proj.y - pCenterY);
          if (hitDist < 20) {
            proj.life = 0; // explode
            if (now > playerInvincibleUntilRef.current) {
              playerInvincibleUntilRef.current = now + 1200;
              screenShakeRef.current = 7;
              damageFlashRef.current = 10;
              sound.playPlayerHurt();
              setTimeout(() => {
                onPlayerTakeDamageRef.current?.(1, 'Bola Api Iblis');
              }, 0);
            }
          }
        });
        demonProjectilesRef.current = demonProjectilesRef.current.filter(p => p.life > 0);

        // Update & Draw Demon Claw Swipes
        clawSwipesRef.current.forEach(claw => {
          claw.frame++;
          ctx.save();
          ctx.strokeStyle = claw.color;
          ctx.lineWidth = 3.5;
          ctx.lineCap = 'round';
          const size = 16;
          const slide = (claw.frame / claw.maxFrames) * 8;
          for (let i = -1; i <= 1; i++) {
            ctx.beginPath();
            ctx.moveTo(claw.x - size + i * 8 + slide, claw.y - size + slide);
            ctx.lineTo(claw.x + size + i * 8 + slide, claw.y + size + slide);
            ctx.stroke();
          }
          ctx.restore();
        });
        clawSwipesRef.current = clawSwipesRef.current.filter(c => c.frame < c.maxFrames);
      }

      // 4. Draw Player Character (with i-Frame Hurt Blink)
      const plX = playerPos.x * TILE_SIZE;
      const plY = playerPos.y * TILE_SIZE;
      const isInvincible = now < playerInvincibleUntilRef.current;

      if (isInvincible && Math.floor(frame / 4) % 2 === 0) {
        ctx.globalAlpha = 0.35; // blinking damage invincibility
      }

      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(plX + 20, plY + 34, 12, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      const legStep = (walkFrame % 2 === 0 ? 3 : -3) * (isSprinting ? 1.6 : 1);

      // Shoes
      ctx.fillStyle = '#3e2723';
      ctx.fillRect(plX + 11, plY + 28 + legStep, 7, 7);
      ctx.fillRect(plX + 22, plY + 28 - legStep, 7, 7);

      // Trousers
      ctx.fillStyle = '#d4a373';
      ctx.fillRect(plX + 11, plY + 20, 18, 9);

      // Jacket
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(plX + 8, plY + 11, 24, 11);
      ctx.fillStyle = '#fef3c7';
      ctx.fillRect(plX + 14, plY + 10, 12, 4);

      // Head
      ctx.fillStyle = '#fde68a';
      ctx.fillRect(plX + 12, plY + 3, 16, 9);

      // Hair
      ctx.fillStyle = '#451a03';
      ctx.fillRect(plX + 11, plY, 18, 5);
      if (playerDir === 'down' || playerDir === 'right') {
        ctx.fillRect(plX + 9, plY + 2, 4, 5);
      }
      if (playerDir === 'left') {
        ctx.fillRect(plX + 27, plY + 2, 4, 5);
      }

      // Eyes & smile
      ctx.fillStyle = '#1c1917';
      if (playerDir === 'down') {
        ctx.fillRect(plX + 14, plY + 6, 3, 3);
        ctx.fillRect(plX + 23, plY + 6, 3, 3);
        ctx.fillStyle = '#e11d48';
        ctx.fillRect(plX + 17, plY + 10, 6, 2);
      } else if (playerDir === 'up') {
        ctx.fillStyle = '#451a03';
        ctx.fillRect(plX + 12, plY + 3, 16, 7);
      } else if (playerDir === 'left') {
        ctx.fillRect(plX + 13, plY + 6, 3, 3);
      } else if (playerDir === 'right') {
        ctx.fillRect(plX + 24, plY + 6, 3, 3);
      }

      // Glowing Light Sword in Hell Realm
      if (isHell) {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(plX + (playerDir === 'left' ? 4 : 28), plY + 12, 4, 16);
        ctx.fillStyle = '#fef08a';
        ctx.fillRect(plX + (playerDir === 'left' ? 4 : 28), plY + 14, 4, 4);
      }
      ctx.globalAlpha = 1.0; // Reset alpha after player rendering

      // 5. Draw Sword Slash Animation
      const slash = slashAnimRef.current;
      if (slash.active) {
        slash.frame++;
        const slashRadius = 26;
        let arcCenterX = plX + 20;
        let arcCenterY = plY + 20;
        let startAngle = 0;
        let endAngle = Math.PI;

        if (slash.dir === 'down') {
          arcCenterY += 16;
          startAngle = 0;
          endAngle = Math.PI;
        } else if (slash.dir === 'up') {
          arcCenterY -= 16;
          startAngle = Math.PI;
          endAngle = Math.PI * 2;
        } else if (slash.dir === 'right') {
          arcCenterX += 16;
          startAngle = -Math.PI / 2;
          endAngle = Math.PI / 2;
        } else if (slash.dir === 'left') {
          arcCenterX -= 16;
          startAngle = Math.PI / 2;
          endAngle = (Math.PI * 3) / 2;
        }

        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(arcCenterX, arcCenterY, slashRadius, startAngle, endAngle);
        ctx.stroke();

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(arcCenterX, arcCenterY, slashRadius + 4, startAngle, endAngle);
        ctx.stroke();

        if (slash.frame > 8) {
          slash.active = false;
        }
      }

      // Action Cue Bubble
      if (nearEntity) {
        const bubbleY = plY - 22 + Math.sin(frame * 0.1) * 3;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(plX + 4, bubbleY, 32, 16);
        ctx.fillStyle = isHell ? '#ef4444' : '#f43f5e';
        ctx.fillRect(plX + 5, bubbleY + 1, 30, 14);

        ctx.font = 'bold 9px "Press Start 2P", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText('[A]', plX + 20, bubbleY + 11);
      }

      // 6. Environmental Particles
      if (isHell) {
        // Floating Hell Cinders & Embers
        cindersRef.current.forEach(c => {
          c.y += c.vy;
          c.x += c.vx;
          if (c.y < 0) {
            c.y = HELL_MAP_HEIGHT * TILE_SIZE;
            c.x = Math.random() * (HELL_MAP_WIDTH * TILE_SIZE);
          }
          ctx.fillStyle = `rgba(249, 115, 22, ${c.alpha})`;
          ctx.fillRect(c.x, c.y, c.size, c.size);
        });

        // Fiery red ambient tint
        ctx.fillStyle = 'rgba(69, 10, 10, 0.28)';
        ctx.fillRect(cam.x, cam.y, canvas.width, canvas.height);
      } else {
        // Kota Lama Weather Rendering
        if (weather === 'rain') {
          ctx.strokeStyle = 'rgba(186, 230, 253, 0.65)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          rainDropsRef.current.forEach(r => {
            r.y += r.speed;
            r.x += 1.5;
            if (r.y > MAP_HEIGHT * TILE_SIZE) {
              r.y = 0;
              r.x = Math.random() * (MAP_WIDTH * TILE_SIZE);
            }
            if (r.x > MAP_WIDTH * TILE_SIZE) r.x = 0;
            ctx.moveTo(r.x, r.y);
            ctx.lineTo(r.x + 2, r.y + r.len);
          });
          ctx.stroke();

          ctx.fillStyle = 'rgba(30, 58, 138, 0.18)';
          ctx.fillRect(cam.x, cam.y, canvas.width, canvas.height);
        } else if (weather === 'golden_hour') {
          ctx.fillStyle = 'rgba(245, 158, 11, 0.16)';
          ctx.fillRect(cam.x, cam.y, canvas.width, canvas.height);
        } else if (weather === 'night') {
          ctx.fillStyle = 'rgba(15, 23, 42, 0.52)';
          ctx.fillRect(cam.x, cam.y, canvas.width, canvas.height);
          firefliesRef.current.forEach(f => {
            f.x += f.vx;
            f.y += f.vy;
            if (f.x < 0) f.x = MAP_WIDTH * TILE_SIZE;
            if (f.x > MAP_WIDTH * TILE_SIZE) f.x = 0;
            if (f.y < 0) f.y = MAP_HEIGHT * TILE_SIZE;
            if (f.y > MAP_HEIGHT * TILE_SIZE) f.y = 0;
            const glow = Math.sin(frame * 0.08 + f.phase) * 0.5 + 0.5;
            ctx.fillStyle = `rgba(254, 240, 138, ${0.4 + glow * 0.5})`;
            ctx.fillRect(f.x, f.y, 3, 3);
          });
        } else if (weather === 'breeze') {
          petalsRef.current.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x > MAP_WIDTH * TILE_SIZE) p.x = 0;
            if (p.y > MAP_HEIGHT * TILE_SIZE) p.y = 0;
            ctx.fillStyle = '#fda4af';
            ctx.fillRect(p.x, p.y, p.size, p.size);
          });
        }
      }

      ctx.restore();

      // ==========================================
      // SCREEN-SPACE 16-BIT RETRO COMBAT HUD
      // ==========================================

      // 1. Red Damage Flash Vignette
      if (damageFlashRef.current > 0) {
        ctx.fillStyle = `rgba(239, 68, 68, ${damageFlashRef.current * 0.045})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        damageFlashRef.current--;
      }

      // 2. Player Health Container (Top-Left)
      const hudY = 12;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.strokeStyle = isHell ? '#e11d48' : '#334155';
      ctx.lineWidth = 2;
      ctx.fillRect(10, hudY, 170, 36);
      ctx.strokeRect(10, hudY, 170, 36);

      // Label
      ctx.font = 'bold 8px "Press Start 2P", monospace';
      ctx.fillStyle = isHell ? '#fca5a5' : '#fda4af';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('HEALTH / NYAWA', 18, hudY + 6);

      // Hearts string
      let heartIcons = '';
      for (let i = 0; i < playerMaxHp; i++) {
        heartIcons += i < playerHp ? '❤️' : '🖤';
      }
      ctx.font = '13px sans-serif';
      ctx.fillText(heartIcons, 18, hudY + 18);

      // 3. Low HP Warning
      if (playerHp <= 1 && isHell) {
        const pulse = Math.floor(frame / 10) % 2 === 0;
        ctx.fillStyle = pulse ? '#ef4444' : '#fbbf24';
        ctx.font = 'bold 8px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚠️ NYAWA KRITIS! TEBAS / MENGHINDAR! ⚠️', canvas.width / 2, hudY + 18);
      }

      // 4. Hell Realm Demon Defeat Badge (Top-Right)
      if (isHell) {
        const deadCount = demons.filter(d => d.isDefeated).length;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2;
        ctx.fillRect(canvas.width - 170, hudY, 160, 36);
        ctx.strokeRect(canvas.width - 170, hudY, 160, 36);

        ctx.font = 'bold 8px "Press Start 2P", monospace';
        ctx.fillStyle = '#fca5a5';
        ctx.textAlign = 'right';
        ctx.textBaseline = 'top';
        ctx.fillText('STATUS IBLIS', canvas.width - 18, hudY + 6);

        ctx.fillStyle = '#fbbf24';
        ctx.fillText(`${deadCount} / ${demons.length} DIKALAHKAN`, canvas.width - 18, hudY + 20);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [
    realm,
    collectibles,
    puzzles,
    demons,
    isHellChestUnlocked,
    isGateUnlocked,
    playerPos,
    playerDir,
    walkFrame,
    isSprinting,
    nearEntity,
    weather,
    playerHp,
    playerMaxHp,
    onPlayerTakeDamage,
    onHealPlayer
  ]);

  const jumpToLocation = (x: number, y: number) => {
    setPlayerPos({ x, y });
    setIsCameraLocked(true);
    sound.playDialogueBeep(580);
  };

  const isHell = realm === 'hell_realm';

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden flex flex-col items-center justify-center p-1 sm:p-2 border-4 rounded-none shadow-[8px_8px_0_0_#0f172a] ${
        isHell ? 'bg-stone-950 border-rose-900' : 'bg-slate-950 border-amber-900/80'
      }`}
    >
      {/* 16-Bit Bezel Header */}
      <div
        className={`w-full flex items-center justify-between px-2 py-1 border-b-2 text-[11px] font-pixel ${
          isHell
            ? 'bg-rose-950/80 border-rose-900 text-rose-300'
            : 'bg-slate-900 border-amber-950 text-amber-200'
        }`}
      >
        <span className="truncate">
          {isHell
            ? '🔥 LEMBAH API (THE NETHER ABYSS) · FIGHT ALL DEMONS TO UNLOCK THE BOX!'
            : 'KOTA LAMA, SEMARANG · OUDSTAD 16-BIT'}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {isHell && (
            <button
              onClick={performAttack}
              className="flex items-center gap-1 px-2.5 py-0.5 bg-rose-700 hover:bg-rose-600 text-white font-pixel text-[10px] border border-rose-400 active:scale-95 transition-transform"
              title="Swing Light Sword [F / Space]"
            >
              <Swords className="w-3.5 h-3.5 text-amber-300" />
              <span>SWING SWORD [F]</span>
            </button>
          )}

          <button
            onClick={() => setIsCameraLocked(true)}
            className="flex items-center gap-1 px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-600 text-[10px]"
            title="Lock Camera on Player"
          >
            <Focus className="w-3 h-3 text-rose-400" />
            <span className="hidden sm:inline">Center</span>
          </button>
        </div>
      </div>

      {/* Dynamic Camera Canvas */}
      <div className="relative overflow-hidden w-full flex items-center justify-center bg-slate-950">
        <canvas
          ref={canvasRef}
          width={viewportSize.width}
          height={viewportSize.height}
          onClick={handleCanvasClick}
          className="cursor-pointer pixelated block mx-auto"
          style={{
            maxWidth: '100%',
            height: 'auto',
            touchAction: 'none'
          }}
        />

        <div className="absolute inset-0 crt-scanlines pointer-events-none opacity-25" />
      </div>

      {/* Quick Navigation Bar */}
      <div
        className={`w-full flex items-center gap-1.5 overflow-x-auto py-1 px-1 border-t-2 text-[10px] font-pixel scrollbar-none ${
          isHell
            ? 'bg-stone-900/90 border-rose-950 text-rose-200'
            : 'bg-slate-900/90 border-amber-950 text-slate-300'
        }`}
      >
        <span className="text-amber-400 shrink-0 mr-1">
          {isHell ? 'TARGETS:' : 'LOCATIONS:'}
        </span>

        {isHell ? (
          <>
            <button
              onClick={() => jumpToLocation(9, 7)}
              className="px-2 py-0.5 bg-rose-950 hover:bg-rose-900 border border-rose-500 text-amber-300 whitespace-nowrap shrink-0"
            >
              📦 Peti Rahasia (Tengah)
            </button>
            <button
              onClick={() => jumpToLocation(5, 5)}
              className="px-2 py-0.5 bg-stone-800 hover:bg-rose-950 border border-stone-600 whitespace-nowrap shrink-0"
            >
              😈 Iblis Keraguan
            </button>
            <button
              onClick={() => jumpToLocation(13, 5)}
              className="px-2 py-0.5 bg-stone-800 hover:bg-rose-950 border border-stone-600 whitespace-nowrap shrink-0"
            >
              👿 Iblis Jarak
            </button>
            <button
              onClick={() => jumpToLocation(5, 10)}
              className="px-2 py-0.5 bg-stone-800 hover:bg-rose-950 border border-stone-600 whitespace-nowrap shrink-0"
            >
              👹 Iblis Bad Mood
            </button>
            <button
              onClick={() => jumpToLocation(13, 10)}
              className="px-2 py-0.5 bg-stone-800 hover:bg-rose-950 border border-stone-600 whitespace-nowrap shrink-0"
            >
              👺 Raja Iblis
            </button>
            <button
              onClick={() => jumpToLocation(9, 13)}
              className="px-2 py-0.5 bg-indigo-950 hover:bg-indigo-900 border border-indigo-400 text-sky-200 whitespace-nowrap shrink-0"
            >
              🌀 Portal Kembali
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => jumpToLocation(14, 6)}
              className="px-2 py-0.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-200 border border-slate-700 whitespace-nowrap shrink-0"
            >
              ⛪ Gereja Blenduk
            </button>
            <button
              onClick={() => jumpToLocation(3, 4)}
              className="px-2 py-0.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-200 border border-slate-700 whitespace-nowrap shrink-0"
            >
              🍨 Toko Oen (NW)
            </button>
            <button
              onClick={() => jumpToLocation(24, 4)}
              className="px-2 py-0.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-200 border border-slate-700 whitespace-nowrap shrink-0"
            >
              🍰 Gedung Marba (NE)
            </button>
            <button
              onClick={() => jumpToLocation(14, 10)}
              className="px-2 py-0.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-200 border border-slate-700 whitespace-nowrap shrink-0"
            >
              🌉 Jembatan Berok
            </button>
            <button
              onClick={() => jumpToLocation(4, 16)}
              className="px-2 py-0.5 bg-slate-800 hover:bg-rose-950 hover:text-rose-200 border border-rose-600 text-rose-300 whitespace-nowrap shrink-0"
            >
              🎬 Bioskop Marabunta
            </button>
            <button
              onClick={() => jumpToLocation(1, 19)}
              className="px-2 py-0.5 bg-rose-950 hover:bg-rose-900 border border-rose-500 text-amber-300 whitespace-nowrap shrink-0 animate-pulse"
              title="Lorong Rahasia ke Lembah Api / Hell"
            >
              🔥 Lorong Rahasia (SW)
            </button>
          </>
        )}
      </div>
    </div>
  );
};
