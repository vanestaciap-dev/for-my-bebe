import React from 'react';
import { CollectibleItem, MemoryPuzzle, WeatherType, WorldRealm, HellDemon } from '../types/game';
import { Volume2, VolumeX, Backpack, Sparkles, Settings, Swords, Flame, Heart, RotateCcw } from 'lucide-react';
import { WeatherControls } from './WeatherControls';

interface QuestTrackerProps {
  realm: WorldRealm;
  collectibles: CollectibleItem[];
  puzzles: MemoryPuzzle[];
  demons: HellDemon[];
  onOpenInventory: () => void;
  onOpenSettings: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isGateUnlocked: boolean;
  weather: WeatherType;
  onSelectWeather: (weather: WeatherType) => void;
  onWarpRealm?: (targetRealm: WorldRealm) => void;
  playerHp: number;
  playerMaxHp: number;
  onResetDemons?: () => void;
}

export const QuestTracker: React.FC<QuestTrackerProps> = ({
  realm,
  collectibles,
  puzzles,
  demons,
  onOpenInventory,
  onOpenSettings,
  isMuted,
  onToggleMute,
  isGateUnlocked,
  weather,
  onSelectWeather,
  onWarpRealm,
  playerHp,
  playerMaxHp
}) => {
  const isHell = realm === 'hell_realm';
  const itemsFound = collectibles.filter(c => c.found).length;
  const keysFound = puzzles.filter(p => p.solved).length;
  const allReady = itemsFound === 3 && keysFound === 3;
  const defeatedCount = demons.filter(d => d.isDefeated).length;
  const allDemonsDead = defeatedCount === demons.length;

  return (
    <div
      className={`w-full border-b-2 px-3 py-2 text-slate-100 font-vt flex flex-col md:flex-row md:items-center justify-between gap-2 shadow-sm ${
        isHell ? 'bg-stone-950/95 border-rose-900' : 'bg-slate-900/95 border-slate-700'
      }`}
    >
      {/* Objective message */}
      <div className="flex items-center gap-2 min-w-0">
        {isHell ? (
          <Flame className="w-4 h-4 text-rose-500 shrink-0 animate-bounce" />
        ) : (
          <Sparkles className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
        )}
        <div className="truncate">
          <span
            className={`font-pixel text-[10px] mr-2 uppercase ${
              isHell ? 'text-amber-400' : 'text-rose-300'
            }`}
          >
            {isHell ? 'ABYSS QUEST:' : 'MISI:'}
          </span>
          <span className="text-base text-slate-200">
            {isHell
              ? allDemonsDead
                ? '✨ SEMUA IBLIS KALAH! Buka Peti Surat di Tengah Altar!'
                : `⚔️ Tebas 4 Iblis (${defeatedCount}/${demons.length}) untuk membuka Peti Surat di Tengah!`
              : isGateUnlocked
              ? '✨ Gerbang Terbuka! Naik ke Balkon Gereja Blenduk!'
              : allReady
              ? '💖 Semua 3 camilan & 3 kunci terkumpul! Buka Gerbang Kasih (Utara)!'
              : `Kumpulkan 3 kenangan (${itemsFound}/3) & 3 kunci teka-teki (${keysFound}/3)`}
          </span>
        </div>
      </div>

      {/* Badges and Buttons */}
      <div className="flex items-center gap-2.5 flex-wrap shrink-0">
        {/* Player Health Hearts */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 border text-xs font-pixel shadow-sm ${
            playerHp <= 1
              ? 'bg-rose-950 border-rose-500 animate-pulse text-rose-200'
              : isHell
              ? 'bg-stone-900 border-rose-800 text-rose-300'
              : 'bg-slate-950 border-slate-700 text-rose-300'
          }`}
          title={`Health: ${playerHp}/${playerMaxHp}`}
        >
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 shrink-0" />
          <span className="text-[10px]">HP:</span>
          <div className="flex gap-0.5 text-xs">
            {Array.from({ length: playerMaxHp }).map((_, i) => (
              <span key={i} className="leading-none">{i < playerHp ? '❤️' : '🖤'}</span>
            ))}
          </div>
        </div>

        {/* Weather Selector (Kota Lama only) */}
        {!isHell && <WeatherControls currentWeather={weather} onSelectWeather={onSelectWeather} />}

        {/* Demon Tracker Badge if in Hell */}
        {isHell ? (
          <div className="flex items-center gap-1.5 bg-rose-950 px-2.5 py-0.5 border border-rose-700 text-xs">
            <Swords className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-pixel text-[10px] text-amber-300">
              IBLIS: {defeatedCount}/{demons.length} KALAH
            </span>
            <div className="flex gap-1 ml-1">
              {demons.map(d => (
                <span
                  key={d.id}
                  className={`text-xs ${d.isDefeated ? 'opacity-30 line-through' : 'opacity-100'}`}
                  title={`${d.name} (${d.isDefeated ? 'Kalah' : 'Hidup'})`}
                >
                  {d.sprite}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Treats badge */}
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 border border-slate-800 text-xs">
              {collectibles.map(item => (
                <span
                  key={item.id}
                  className={`text-sm transition-opacity ${item.found ? 'opacity-100 scale-105' : 'opacity-25 grayscale'}`}
                  title={`${item.name} (${item.found ? 'Found' : 'Hidden'})`}
                >
                  {item.icon}
                </span>
              ))}
              <span className="font-pixel text-[9px] text-slate-400 ml-1">
                {itemsFound}/3
              </span>
            </div>

            {/* Keys badge */}
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 border border-slate-800 text-xs">
              {puzzles.map(puzzle => (
                <span
                  key={puzzle.id}
                  className={`text-sm transition-opacity ${puzzle.solved ? 'opacity-100 scale-105' : 'opacity-25 grayscale'}`}
                  title={`${puzzle.keyName} (${puzzle.solved ? 'Unlocked' : 'Locked'})`}
                >
                  {puzzle.keyIcon}
                </span>
              ))}
              <span className="font-pixel text-[9px] text-slate-400 ml-1">
                {keysFound}/3
              </span>
            </div>
          </>
        )}

        {/* Satchel Button */}
        <button
          onClick={onOpenInventory}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-600 font-pixel text-[10px]"
          title="Buka Tas / Satchel"
        >
          <Backpack className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">TAS</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={onToggleMute}
          className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600"
          title={isMuted ? 'Nyalakan Musik' : 'Matikan Suara'}
          aria-label="Toggle Sound"
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
        </button>

        {/* Customize Memories */}
        <button
          onClick={onOpenSettings}
          className="p-1 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-600"
          title="Personalisasi Kenangan & Surat"
          aria-label="Customize Memories"
        >
          <Settings className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
