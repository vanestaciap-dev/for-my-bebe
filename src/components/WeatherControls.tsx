import React from 'react';
import { WeatherType } from '../types/game';
import { Sun, CloudRain, Moon, Wind } from 'lucide-react';
import { sound } from '../utils/audio';

interface WeatherControlsProps {
  currentWeather: WeatherType;
  onSelectWeather: (weather: WeatherType) => void;
}

const WEATHERS: { id: WeatherType; label: string; sub: string; icon: React.ReactNode; color: string }[] = [
  {
    id: 'golden_hour',
    label: 'Cerah Sore',
    sub: 'Golden Sunset',
    icon: <Sun className="w-3.5 h-3.5 text-amber-400" />,
    color: 'border-amber-500 bg-amber-950/40 text-amber-200'
  },
  {
    id: 'rain',
    label: 'Hujan Syahdu',
    sub: 'Tropical Rain',
    icon: <CloudRain className="w-3.5 h-3.5 text-sky-400" />,
    color: 'border-sky-500 bg-sky-950/40 text-sky-200'
  },
  {
    id: 'night',
    label: 'Malam Bintang',
    sub: 'Starry Gaslamps',
    icon: <Moon className="w-3.5 h-3.5 text-purple-400" />,
    color: 'border-purple-500 bg-purple-950/40 text-purple-200'
  },
  {
    id: 'breeze',
    label: 'Angin Bunga',
    sub: 'Petal Breeze',
    icon: <Wind className="w-3.5 h-3.5 text-rose-400" />,
    color: 'border-rose-500 bg-rose-950/40 text-rose-200'
  }
];

export const WeatherControls: React.FC<WeatherControlsProps> = ({
  currentWeather,
  onSelectWeather
}) => {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className="text-[10px] font-pixel text-slate-400 mr-1 hidden sm:inline">CUACA:</span>
      {WEATHERS.map(w => {
        const isActive = currentWeather === w.id;
        return (
          <button
            key={w.id}
            onClick={() => {
              onSelectWeather(w.id);
              sound.playDialogueBeep(540);
              if (w.id === 'rain') {
                sound.startRainAmbient();
              } else {
                sound.stopRainAmbient();
              }
            }}
            className={`flex items-center gap-1 px-2 py-0.5 border text-[10px] font-pixel transition-all cursor-pointer ${
              isActive
                ? `${w.color} shadow-sm font-bold scale-105`
                : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
            title={`Ganti Cuaca: ${w.label} (${w.sub})`}
          >
            {w.icon}
            <span>{w.label}</span>
          </button>
        );
      })}
    </div>
  );
};
