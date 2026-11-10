import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  Direction,
  Position,
  CollectibleItem,
  MemoryPuzzle,
  LoveStoryConfig,
  MapEntity,
  WeatherType,
  WorldRealm,
  HellDemon
} from './types/game';
import {
  INITIAL_COLLECTIBLES,
  INITIAL_PUZZLES,
  DEFAULT_STORY_CONFIG
} from './data/defaultStory';
import { sound } from './utils/audio';
import { GameCanvas } from './game/GameCanvas';
import {
  MAP_ENTITIES,
  OVERWORLD_TILES,
  SOLID_TILES,
  MAP_WIDTH,
  MAP_HEIGHT,
  HELL_MAP_ENTITIES,
  INITIAL_DEMONS,
  SOLID_HELL_TILES,
  HELL_MAP_WIDTH,
  HELL_MAP_HEIGHT,
  HELL_MAP_TILES
} from './game/mapData';
import { TopNav } from './components/TopNav';
import { QuestTracker } from './components/QuestTracker';
import { MobileControls } from './components/MobileControls';
import { DialogueBox } from './components/DialogueBox';
import { MelodyPuzzle } from './components/puzzles/MelodyPuzzle';
import { MosaicPuzzle } from './components/puzzles/MosaicPuzzle';
import { TriviaPuzzle } from './components/puzzles/TriviaPuzzle';
import { InventoryModal } from './components/InventoryModal';
import { LoveLetterModal } from './components/LoveLetterModal';
import { HellLetterModal } from './components/HellLetterModal';
import { MemoryEditorModal } from './components/MemoryEditorModal';
import { ControlsHelpModal } from './components/ControlsHelpModal';
import confetti from 'canvas-confetti';
import { Heart, Sparkles, MapPin, Gamepad2, Gift, Swords, Flame } from 'lucide-react';

const STORAGE_KEY_COLLECTIBLES = 'pixel_hearts_collectibles_v1';
const STORAGE_KEY_PUZZLES = 'pixel_hearts_puzzles_v1';
const STORAGE_KEY_CONFIG = 'pixel_hearts_config_v1';
const STORAGE_KEY_DEMONS = 'pixel_hearts_demons_v1';
const STORAGE_KEY_REALM = 'pixel_hearts_realm_v1';

export default function App() {
  // 1. Story Configuration
  const [storyConfig, setStoryConfig] = useState<LoveStoryConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      return saved ? JSON.parse(saved) : DEFAULT_STORY_CONFIG;
    } catch {
      return DEFAULT_STORY_CONFIG;
    }
  });

  // 2. Collectibles
  const [collectibles, setCollectibles] = useState<CollectibleItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_COLLECTIBLES);
      return saved ? JSON.parse(saved) : INITIAL_COLLECTIBLES;
    } catch {
      return INITIAL_COLLECTIBLES;
    }
  });

  // 3. Puzzles
  const [puzzles, setPuzzles] = useState<MemoryPuzzle[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PUZZLES);
      return saved ? JSON.parse(saved) : INITIAL_PUZZLES;
    } catch {
      return INITIAL_PUZZLES;
    }
  });

  // 4. Realm & Demons State
  const [realm, setRealm] = useState<WorldRealm>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_REALM);
      return (saved === 'hell_realm' || saved === 'kota_lama') ? saved : 'kota_lama';
    } catch {
      return 'kota_lama';
    }
  });

  const [demons, setDemons] = useState<HellDemon[]>(() => {
    try {
      const savedRealm = localStorage.getItem(STORAGE_KEY_REALM);
      if (savedRealm === 'kota_lama' || !savedRealm) {
        return INITIAL_DEMONS.map(d => ({ ...d }));
      }
      const saved = localStorage.getItem(STORAGE_KEY_DEMONS);
      if (!saved) return INITIAL_DEMONS.map(d => ({ ...d }));
      const parsed: HellDemon[] = JSON.parse(saved);
      if (parsed.every(d => d.isDefeated)) {
        return INITIAL_DEMONS.map(d => ({ ...d }));
      }
      return parsed;
    } catch {
      return INITIAL_DEMONS.map(d => ({ ...d }));
    }
  });

  // 5. Player & Environment State
  const playerMaxHp = 5;
  const [playerHp, setPlayerHp] = useState<number>(5);
  const [playerPos, setPlayerPos] = useState<Position>(() => {
    return realm === 'hell_realm' ? { x: 9, y: 12 } : { x: 15, y: 7 };
  });
  const [playerDir, setPlayerDir] = useState<Direction>('down');
  const [isSprinting, setIsSprinting] = useState(false);
  const [weather, setWeather] = useState<WeatherType>('golden_hour');

  // 6. Gate & Hell Chest State
  const allCollectiblesFound = collectibles.every(c => c.found);
  const allPuzzlesSolved = puzzles.every(p => p.solved);
  const [manualGateUnlocked, setManualGateUnlocked] = useState(false);
  const isGateUnlocked = (allCollectiblesFound && allPuzzlesSolved) || manualGateUnlocked;
  const isHellChestUnlocked = demons.every(d => d.isDefeated);

  // Purely derived nearEntity based on active realm - eliminates cross-component setState
  const nearEntity = useMemo(() => {
    let targetX = playerPos.x;
    let targetY = playerPos.y;

    if (playerDir === 'up') targetY -= 1;
    if (playerDir === 'down') targetY += 1;
    if (playerDir === 'left') targetX -= 1;
    if (playerDir === 'right') targetX += 1;

    const entityList = realm === 'hell_realm' ? HELL_MAP_ENTITIES : MAP_ENTITIES;

    const found = entityList.find(ent => {
      if (ent.id === 'entity_golden_gate' && isGateUnlocked) return false;
      const isFacing = ent.x === targetX && ent.y === targetY;
      const isAdjacent = Math.abs(ent.x - playerPos.x) <= 1 && Math.abs(ent.y - playerPos.y) <= 1;
      return isFacing || isAdjacent;
    });

    return found || null;
  }, [realm, playerPos.x, playerPos.y, playerDir, isGateUnlocked]);

  // 6. Audio State
  const [isMuted, setIsMuted] = useState(false);

  // 7. Modals & Overlays
  const [activeDialogue, setActiveDialogue] = useState<{
    speaker: string;
    portrait: string;
    lines: string[];
  } | null>(null);

  const [activePuzzle, setActivePuzzle] = useState<'melody' | 'mosaic' | 'trivia' | null>(null);
  const [showInventory, setShowInventory] = useState(false);
  const [showLoveLetter, setShowLoveLetter] = useState(false);
  const [showHellLetter, setShowHellLetter] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showControlsHelp, setShowControlsHelp] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_COLLECTIBLES, JSON.stringify(collectibles));
    } catch {}
  }, [collectibles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_PUZZLES, JSON.stringify(puzzles));
    } catch {}
  }, [puzzles]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(storyConfig));
    } catch {}
  }, [storyConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_DEMONS, JSON.stringify(demons));
    } catch {}
  }, [demons]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_REALM, realm);
    } catch {}
  }, [realm]);

  // Audio Toggle
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // Switch sound theme & reset demons when leaving to Kota Lama
  useEffect(() => {
    if (realm === 'hell_realm') {
      sound.setTheme('hell');
    } else {
      sound.setTheme('calm');
      // Leaving to Kota Lama resets all demons, re-locks the chest, and restores HP
      setDemons(INITIAL_DEMONS.map(d => ({ ...d })));
      setPlayerHp(5);
      try {
        localStorage.removeItem(STORAGE_KEY_DEMONS);
      } catch {}
    }
  }, [realm]);

  // Start BGM on first user interaction
  useEffect(() => {
    const handleFirstInteraction = () => {
      sound.startBgm();
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    window.addEventListener('keydown', handleFirstInteraction);
    return () => {
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  // Demon Combat Attack Handler
  const handleAttackDemon = useCallback((demonId: string) => {
    sound.playSwordSlash();

    setDemons(prev => {
      const target = prev.find(d => d.id === demonId);
      if (!target || target.isDefeated) return prev;

      const newHp = Math.max(0, target.hp - 1);
      const isNowDefeated = newHp === 0;

      if (isNowDefeated) {
        sound.playDemonDefeated();
      } else {
        sound.playDemonHit();
      }

      const updated = prev.map(d =>
        d.id === demonId ? { ...d, hp: newHp, isDefeated: isNowDefeated } : d
      );

      // Check if all demons defeated after this strike
      const allDefeatedNow = updated.every(d => d.isDefeated);
      if (allDefeatedNow && !target.isDefeated) {
        sound.playHellChestUnlock();
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 },
          colors: ['#ef4444', '#f97316', '#fbbf24']
        });
        setTimeout(() => {
          setActiveDialogue({
            speaker: 'Kotak Tersegel Lembah Api',
            portrait: '📦',
            lines: [
              '⚡ THE CRIMSON CHAINS SHATTER! ⚡',
              'All 4 demons of doubt, distance, bad mood, and fear have been conquered by your true love!',
              'The Abyssal Love Box is now unlocked! Step in front of it and press [E] or [OPEN] to read the secret letters!'
            ]
          });
        }, 500);
      } else if (isNowDefeated) {
        const remaining = updated.filter(d => !d.isDefeated).length;
        setActiveDialogue({
          speaker: target.name,
          portrait: target.sprite,
          lines: [
            target.deathCry,
            `Demon defeated! Only ${remaining} guardian${remaining === 1 ? '' : 's'} remain.`
          ]
        });
      }

      return updated;
    });
  }, []);

  // Generic Attack (checks facing or adjacent demons)
  const handleAttack = useCallback(() => {
    sound.playSwordSlash();

    if (realm !== 'hell_realm') {
      return;
    }

    let targetX = playerPos.x;
    let targetY = playerPos.y;
    if (playerDir === 'up') targetY -= 1;
    if (playerDir === 'down') targetY += 1;
    if (playerDir === 'left') targetX -= 1;
    if (playerDir === 'right') targetX += 1;

    // First check demon directly in front
    const facingDemon = demons.find(
      d => !d.isDefeated && d.x === targetX && d.y === targetY
    );

    if (facingDemon) {
      handleAttackDemon(facingDemon.id);
      return;
    }

    // Check demon in adjacent tiles
    const adjacentDemon = demons.find(
      d => !d.isDefeated && Math.abs(d.x - playerPos.x) <= 1 && Math.abs(d.y - playerPos.y) <= 1
    );

    if (adjacentDemon) {
      handleAttackDemon(adjacentDemon.id);
    }
  }, [realm, playerPos.x, playerPos.y, playerDir, demons, handleAttackDemon]);

  // Global key listener for Attack [F key]
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === 'f' || e.key === 'F') {
        handleAttack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAttack]);

  // Player Damage & Knockout Revival
  const handlePlayerTakeDamage = useCallback((amount: number, fromSource: string) => {
    setPlayerHp(prev => {
      const nextHp = Math.max(0, prev - amount);
      if (nextHp === 0 && prev > 0) {
        sound.playPlayerHurt();
        setTimeout(() => {
          sound.playPlayerRespawn();
          confetti({
            particleCount: 90,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#f43f5e', '#fbbf24', '#ffffff']
          });
          setPlayerPos({ x: 9, y: 12 }); // Respawn safely at return portal
          setPlayerHp(5);                 // Full revival
          setActiveDialogue({
            speaker: 'Cinta Abadi (Pelindung Hati)',
            portrait: '💖',
            lines: [
              'Sayang, jangan menyerah! 🥺💪',
              'Iblis keraguan dan ketakutan tidak bisa memadamkan api cinta kita!',
              'Cintaku melindungimu dan membangkitkanmu kembali dengan kekuatan penuh! Hati-hati dan kalahkan mereka! ❤️✨'
            ]
          });
        }, 400);
      }
      return nextHp;
    });
  }, []);

  // Player Heal
  const handleHealPlayer = useCallback((amount: number) => {
    setPlayerHp(prev => Math.min(playerMaxHp, prev + amount));
  }, [playerMaxHp]);

  // Realm Warping helper
  const handleWarpRealm = useCallback((targetRealm: WorldRealm) => {
    if (targetRealm === 'hell_realm') {
      setRealm('hell_realm');
      setPlayerPos({ x: 9, y: 12 });
      setPlayerDir('up');
      sound.setTheme('hell');
      sound.playHellChestUnlock();
      setActiveDialogue({
        speaker: 'Lembah Api Abadi',
        portrait: '🔥',
        lines: [
          'You descended into the fiery Nether Realm...',
          'In the center rests the Abyssal Love Box bound by 4 crimson chains of doubt and fear.',
          'Slay all 4 demons with your sword ([F] or [SLASH] button) to break the chains!'
        ]
      });
    } else {
      setRealm('kota_lama');
      setPlayerPos({ x: 2, y: 18 });
      setPlayerDir('right');
      sound.setTheme('calm');
      sound.playFootstep();

      // Reset all demons to alive, re-lock the chest, and restore HP
      setDemons(INITIAL_DEMONS.map(d => ({ ...d })));
      setPlayerHp(playerMaxHp);
      try {
        localStorage.removeItem(STORAGE_KEY_DEMONS);
      } catch {}

      setActiveDialogue({
        speaker: 'Kota Lama, Semarang',
        portrait: '🏛️',
        lines: [
          'Kamu kembali ke jalanan tenang Kota Lama, Semarang.',
          'Semua 4 iblis neraka telah bangkit kembali dan Peti Rahasia kembali terkunci dengan rantai berapi!',
          'Tantangan arena neraka telah di-reset dan siap dihadapi lagi kapan saja.'
        ]
      });
    }
  }, [playerMaxHp]);

  // Manual Reset Demons & Chest lock
  const handleResetDemons = useCallback(() => {
    setDemons(INITIAL_DEMONS.map(d => ({ ...d })));
    setPlayerHp(playerMaxHp);
    try {
      localStorage.removeItem(STORAGE_KEY_DEMONS);
    } catch {}
    sound.playDialogueBeep(640);
    setActiveDialogue({
      speaker: 'Altar Lembah Api',
      portrait: '🔥',
      lines: [
        'Kekuatan kegelapan bergemuruh!',
        'Semua 4 iblis neraka telah bangkit kembali dengan nyawa penuh, dan Peti Rahasia kembali terkunci dengan rantai berapi!'
      ]
    });
  }, [playerMaxHp]);

  // Entity Interaction Resolver
  const handleInteractWithEntity = useCallback(
    (entity: MapEntity) => {
      sound.playDialogueBeep(520);

      // 1. Warp Realm (Hidden Nether Portal or Return Portal)
      if (entity.interactionType === 'warp_realm' && entity.targetId) {
        handleWarpRealm(entity.targetId as WorldRealm);
        return;
      }

      // 2. Abyssal Love Box in Hell Realm
      if (entity.id === 'entity_hell_chest') {
        if (isHellChestUnlocked) {
          setShowHellLetter(true);
        } else {
          const remaining = demons.filter(d => !d.isDefeated);
          setActiveDialogue({
            speaker: 'Kotak Tersegel Lembah Api',
            portrait: '🔒',
            lines: [
              'The chest is tightly bound with 4 crimson chains of doubt, distance, bad mood, and fear!',
              `You must defeat all demons first. Remaining: ${remaining.map(d => d.name).join(', ')}`,
              'Walk close to them and press [F] or [SLASH] to strike!'
            ]
          });
        }
        return;
      }

      // 3. Collect items
      if (entity.interactionType === 'collect_item' && entity.targetId) {
        const item = collectibles.find(c => c.id === entity.targetId);
        if (item) {
          if (!item.found) {
            sound.playCollectSound();
            confetti({
              particleCount: 50,
              spread: 60,
              origin: { y: 0.6 }
            });
            setCollectibles(prev =>
              prev.map(c => (c.id === entity.targetId ? { ...c, found: true } : c))
            );
            setActiveDialogue({
              speaker: entity.name,
              portrait: entity.sprite,
              lines: [
                `✨ You found the ${item.name}! ✨`,
                `"${item.tagline}"`,
                item.memoryStory
              ]
            });
          } else {
            setActiveDialogue({
              speaker: entity.name,
              portrait: entity.sprite,
              lines: [
                `You already gathered the ${item.name}!`,
                `"${item.memoryStory}"`
              ]
            });
          }
        }
      } else if (entity.interactionType === 'open_puzzle' && entity.targetId) {
        const pz = puzzles.find(p => p.id === entity.targetId);
        if (pz?.solved) {
          setActiveDialogue({
            speaker: entity.name,
            portrait: entity.sprite,
            lines: [
              entity.solvedText || 'Puzzle already solved! You hold this memory key.',
              'You can play it again from your Satchel anytime!'
            ]
          });
        } else {
          setActivePuzzle(entity.targetId as 'melody' | 'mosaic' | 'trivia');
        }
      } else if (entity.interactionType === 'unlock_gate') {
        if (allCollectiblesFound && allPuzzlesSolved) {
          setManualGateUnlocked(true);
          sound.playUnlockGate();
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.5 }
          });
          setActiveDialogue({
            speaker: 'The Golden Heart Gate',
            portrait: '🔓',
            lines: [
              'The 3 sweet offerings are presented and the 3 memory keys turn together in perfect harmony.',
              'The Golden Gate dissolves into golden stardust!',
              'Ascend Stargazing Hill to read the Secret Love Letter!'
            ]
          });
        } else {
          const missingItems = collectibles.filter(c => !c.found);
          const missingPuzzles = puzzles.filter(p => !p.solved);
          const itemsText = missingItems.length
            ? `Treats still hidden: ${missingItems.map(i => i.icon).join(' ')}`
            : 'All treats found! ✓';
          const puzzlesText = missingPuzzles.length
            ? `Keys still locked: ${missingPuzzles.map(p => p.keyName).join(', ')}`
            : 'All keys unlocked! ✓';

          setActiveDialogue({
            speaker: 'The Golden Heart Gate',
            portrait: '🔒',
            lines: [
              'The Gate remains sealed until all our favorite things and memories are reunited.',
              itemsText,
              puzzlesText
            ]
          });
        }
      } else if (entity.interactionType === 'open_letter') {
        setShowLoveLetter(true);
      } else if (entity.interactionType === 'dialogue') {
        setActiveDialogue({
          speaker: entity.name,
          portrait: entity.sprite,
          lines: entity.dialogue || ['Hello there!']
        });
      }
    },
    [collectibles, puzzles, allCollectiblesFound, allPuzzlesSolved, isHellChestUnlocked, demons, handleWarpRealm]
  );

  // Continuous Movement Loop
  const moveIntervalRef = useRef<number | null>(null);

  const handleMoveStart = (dir: Direction) => {
    if (moveIntervalRef.current) clearInterval(moveIntervalRef.current);
    setPlayerDir(dir);

    const tryStep = (curr: Position) => {
      let nx = curr.x;
      let ny = curr.y;
      if (dir === 'up') ny -= 1;
      if (dir === 'down') ny += 1;
      if (dir === 'left') nx -= 1;
      if (dir === 'right') nx += 1;

      const currentMapW = realm === 'hell_realm' ? HELL_MAP_WIDTH : MAP_WIDTH;
      const currentMapH = realm === 'hell_realm' ? HELL_MAP_HEIGHT : MAP_HEIGHT;
      const currentTiles = realm === 'hell_realm' ? HELL_MAP_TILES : OVERWORLD_TILES;
      const currentSolid = realm === 'hell_realm' ? SOLID_HELL_TILES : SOLID_TILES;

      if (nx < 1 || nx >= currentMapW - 1 || ny < 1 || ny >= currentMapH - 1) return curr;
      const tile = currentTiles[ny]?.[nx];
      if (tile !== undefined && currentSolid.has(tile)) return curr;

      // Gate check in Kota Lama
      if (realm === 'kota_lama' && !isGateUnlocked && nx === 14 && ny === 4) return curr;

      // Demon solid check in Hell
      if (realm === 'hell_realm') {
        const hasDemon = demons.some(d => !d.isDefeated && d.x === nx && d.y === ny);
        if (hasDemon) return curr;
      }

      return { x: nx, y: ny };
    };

    // Initial step
    setPlayerPos(curr => tryStep(curr));
    sound.playFootstep();

    // Repeat interval
    const speed = isSprinting ? 120 : 180;
    moveIntervalRef.current = window.setInterval(() => {
      setPlayerPos(curr => tryStep(curr));
      sound.playFootstep();
    }, speed);
  };

  const handleMoveEnd = () => {
    if (moveIntervalRef.current) {
      clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }
  };

  // Puzzle Solved Handlers
  const handlePuzzleSuccess = (puzzleId: 'melody' | 'mosaic' | 'trivia') => {
    setPuzzles(prev =>
      prev.map(p => (p.id === puzzleId ? { ...p, solved: true } : p))
    );
    setActivePuzzle(null);
    sound.playPuzzleSuccess();

    // Check if that was the last puzzle & all items found
    const otherPuzzlesSolved = puzzles.filter(p => p.id !== puzzleId).every(p => p.solved);
    if (otherPuzzlesSolved && allCollectiblesFound) {
      setManualGateUnlocked(true);
      setTimeout(() => {
        setActiveDialogue({
          speaker: 'Stargazing Hill Whispers',
          portrait: '💖',
          lines: [
            '✨ ALL MEMORY KEYS & SWEET TREATS RESTORED! ✨',
            'The Golden Gate is shimmering open at the North of the map.',
            'Walk to the summit to read your Secret Love Letter!'
          ]
        });
      }, 600);
    }
  };

  // Reset to default
  const handleResetData = () => {
    setCollectibles(INITIAL_COLLECTIBLES);
    setPuzzles(INITIAL_PUZZLES);
    setDemons(INITIAL_DEMONS);
    setRealm('kota_lama');
    setStoryConfig(DEFAULT_STORY_CONFIG);
    setManualGateUnlocked(false);
    setPlayerPos({ x: 15, y: 7 });
    setPlayerHp(5);
    sound.setTheme('calm');
    try {
      localStorage.removeItem(STORAGE_KEY_COLLECTIBLES);
      localStorage.removeItem(STORAGE_KEY_PUZZLES);
      localStorage.removeItem(STORAGE_KEY_CONFIG);
      localStorage.removeItem(STORAGE_KEY_DEMONS);
      localStorage.removeItem(STORAGE_KEY_REALM);
    } catch {}
  };

  const isHell = realm === 'hell_realm';

  return (
    <div className={`min-h-screen text-slate-100 flex flex-col font-vt select-none ${
      isHell ? 'bg-stone-950' : 'bg-slate-950'
    }`}>
      {/* 1. Header (Top Bar Contract) */}
      <TopNav
        onOpenInventory={() => setShowInventory(true)}
        onOpenSettings={() => setShowSettings(true)}
        onOpenControlsHelp={() => setShowControlsHelp(true)}
        onOpenLetterDirect={() => {
          if (isHell && isHellChestUnlocked) {
            setShowHellLetter(true);
          } else {
            setShowLoveLetter(true);
          }
        }}
        isLetterAvailable={
          isHell
            ? isHellChestUnlocked
            : isGateUnlocked || (allCollectiblesFound && allPuzzlesSolved)
        }
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* 2. Quest Progress Strip with Weather Controls & Realm status */}
      <QuestTracker
        realm={realm}
        collectibles={collectibles}
        puzzles={puzzles}
        demons={demons}
        onOpenInventory={() => setShowInventory(true)}
        onOpenSettings={() => setShowSettings(true)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        isGateUnlocked={isGateUnlocked}
        weather={weather}
        onSelectWeather={setWeather}
        onWarpRealm={handleWarpRealm}
        playerHp={playerHp}
        playerMaxHp={playerMaxHp}
      />

      {/* 3. Main 16-Bit Heritage Arena */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 max-w-5xl mx-auto w-full">
        {/* World Name / Location banner */}
        <div className="w-full flex items-center justify-between text-xs font-pixel text-slate-400 mb-1 px-1">
          <div className="flex items-center gap-1.5 text-rose-300">
            {isHell ? (
              <Flame className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            ) : (
              <MapPin className="w-3.5 h-3.5" />
            )}
            <span className="truncate">
              {isHell ? (
                playerPos.x >= 7 && playerPos.x <= 11 && playerPos.y >= 5 && playerPos.y <= 9
                  ? 'ALTAR API ABADI · KOTAK SURAT TERSEGEL (CENTER)'
                  : playerPos.y >= 12
                  ? 'PORTAL KEMBALI KE KOTA LAMA (SOUTH)'
                  : 'LEMBAH API NERAKA · ARENA PERTARUNGAN IBLIS'
              ) : (
                playerPos.y <= 4 && playerPos.x >= 10 && playerPos.x <= 18
                  ? 'BALKON CINTA GEREJA BLENDUK (SHRINE)'
                  : playerPos.x <= 8 && playerPos.y <= 5
                  ? 'TOKO ES KRIM OEN (NW)'
                  : playerPos.x >= 19 && playerPos.y <= 5
                  ? 'BAKERY & KAFE GEDUNG MARBA (NE)'
                  : playerPos.y >= 8 && playerPos.y <= 12
                  ? 'JEMBATAN BEROK & KALI SEMARANG'
                  : playerPos.x <= 11 && playerPos.y >= 14
                  ? 'BIOSKOP MARABUNTA & PASAR KLITHIKAN (SW)'
                  : playerPos.x >= 19 && playerPos.y >= 14
                  ? 'PAVILIUN CINTA KOTA LAMA (SE)'
                  : 'TAMAN SRIGUNTING · GEREJA BLENDUK'
              )}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-slate-400">
            {isHell ? (
              <>
                <Swords className="w-3.5 h-3.5 text-amber-400" />
                <span>[F] SLASH DEMON · [SPACE] OPEN BOX</span>
              </>
            ) : (
              <>
                <Gamepad2 className="w-3.5 h-3.5" />
                <span>WASD / ARROWS TO WALK · SPACE TO TALK</span>
              </>
            )}
          </div>
        </div>

        {/* 16-bit Heritage Screen Box */}
        <div className={`relative w-full border-4 shadow-[8px_8px_0_0_#0f172a] p-1 sm:p-2 ${
          isHell
            ? 'border-rose-800 bg-stone-950 shadow-[8px_8px_0_0_#450a0a]'
            : 'border-slate-700 bg-slate-900 shadow-[8px_8px_0_0_#0f172a]'
        }`}>
          {/* Active Canvas */}
          <GameCanvas
            realm={realm}
            collectibles={collectibles}
            puzzles={puzzles}
            demons={demons}
            onAttackDemon={handleAttackDemon}
            isHellChestUnlocked={isHellChestUnlocked}
            isGateUnlocked={isGateUnlocked}
            onInteractEntity={handleInteractWithEntity}
            playerPos={playerPos}
            setPlayerPos={setPlayerPos}
            playerDir={playerDir}
            setPlayerDir={setPlayerDir}
            isSprinting={isSprinting}
            nearEntity={nearEntity}
            weather={weather}
            playerHp={playerHp}
            playerMaxHp={playerMaxHp}
            onPlayerTakeDamage={handlePlayerTakeDamage}
            onHealPlayer={handleHealPlayer}
          />

          {/* Dialogue Box Overlay */}
          {activeDialogue && (
            <DialogueBox
              speakerName={activeDialogue.speaker}
              portrait={activeDialogue.portrait}
              lines={activeDialogue.lines}
              onFinish={() => setActiveDialogue(null)}
            />
          )}
        </div>

        {/* Mobile & Touch Controls Bar */}
        <div className="w-full mt-3 block sm:hidden">
          <MobileControls
            onMoveStart={handleMoveStart}
            onMoveEnd={handleMoveEnd}
            onInteract={() => {
              if (nearEntity) handleInteractWithEntity(nearEntity);
            }}
            onAttack={handleAttack}
            onOpenInventory={() => setShowInventory(true)}
            isNearInteractable={Boolean(nearEntity)}
            interactLabel={nearEntity?.sprite}
            isSprinting={isSprinting}
            onToggleSprint={() => setIsSprinting(s => !s)}
            isHellRealm={isHell}
          />
        </div>

        {/* Desktop Quick Shortcuts Bar */}
        <div className="hidden sm:flex items-center justify-between w-full mt-3 px-2 text-xs font-pixel text-slate-400">
          <div className="flex items-center gap-4">
            <span className="text-slate-300">
              <strong className="text-rose-400">[SPACE / ENTER]</strong> Interact
            </span>
            {isHell && (
              <span className="text-amber-300 animate-pulse">
                <strong className="text-amber-400">[F / ATTACK]</strong> Sword Slash
              </span>
            )}
            <span className="text-slate-300">
              <strong className="text-amber-400">[CLICK]</strong> Tap-to-walk
            </span>
            <span className="text-slate-300">
              <strong className="text-sky-400">[BAG]</strong> Satchel
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSettings(true)}
              className="text-amber-300 hover:text-amber-200 underline cursor-pointer"
            >
              Personalize Memories / Letter
            </button>
            <span>·</span>
            <button
              onClick={() => setShowControlsHelp(true)}
              className="text-slate-400 hover:text-slate-200 underline cursor-pointer"
            >
              Help Guide
            </button>
          </div>
        </div>
      </main>

      {/* 4. Active Puzzle Overlays */}
      {activePuzzle === 'melody' && (
        <MelodyPuzzle
          onSuccess={() => handlePuzzleSuccess('melody')}
          onClose={() => setActivePuzzle(null)}
          isAlreadySolved={Boolean(puzzles.find(p => p.id === 'melody')?.solved)}
        />
      )}

      {activePuzzle === 'mosaic' && (
        <MosaicPuzzle
          onSuccess={() => handlePuzzleSuccess('mosaic')}
          onClose={() => setActivePuzzle(null)}
          isAlreadySolved={Boolean(puzzles.find(p => p.id === 'mosaic')?.solved)}
        />
      )}

      {activePuzzle === 'trivia' && (
        <TriviaPuzzle
          questions={storyConfig.triviaQuestions}
          onSuccess={() => handlePuzzleSuccess('trivia')}
          onClose={() => setActivePuzzle(null)}
          isAlreadySolved={Boolean(puzzles.find(p => p.id === 'trivia')?.solved)}
        />
      )}

      {/* 5. Inventory Modal */}
      {showInventory && (
        <InventoryModal
          collectibles={collectibles}
          puzzles={puzzles}
          onClose={() => setShowInventory(false)}
        />
      )}

      {/* 6. Grand Finale: Secret Love Letter Modal (Kota Lama) */}
      {showLoveLetter && (
        <LoveLetterModal
          config={storyConfig}
          onClose={() => setShowLoveLetter(false)}
        />
      )}

      {/* 6b. Hell Realm Secret Love Letter Modal */}
      {showHellLetter && (
        <HellLetterModal
          config={storyConfig}
          onClose={() => setShowHellLetter(false)}
        />
      )}

      {/* 7. Memory Customizer / Settings Modal */}
      {showSettings && (
        <MemoryEditorModal
          config={storyConfig}
          onSave={newCfg => setStoryConfig(newCfg)}
          onReset={handleResetData}
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* 8. Controls Guide Modal */}
      {showControlsHelp && (
        <ControlsHelpModal onClose={() => setShowControlsHelp(false)} />
      )}
    </div>
  );
}
