export type Direction = 'up' | 'down' | 'left' | 'right';
export type WeatherType = 'golden_hour' | 'rain' | 'night' | 'breeze';
export type WorldRealm = 'kota_lama' | 'hell_realm';

export interface Position {
  x: number;
  y: number;
}

export interface CollectibleItem {
  id: 'ice_cream' | 'cheesecake' | 'movie_cassette';
  name: string;
  category: string;
  icon: string;
  tagline: string;
  memoryStory: string;
  locationHint: string;
  found: boolean;
  foundAt?: string;
  color: string;
}

export interface MemoryPuzzle {
  id: 'melody' | 'mosaic' | 'trivia';
  title: string;
  keyName: string;
  keyIcon: string;
  description: string;
  solved: boolean;
  color: string;
}

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  sweetNote: string;
}

export interface HellDemon {
  id: string;
  name: string;
  title: string;
  sprite: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  isDefeated: boolean;
  deathCry: string;
  color: string;
  attackCooldown?: number;
  isAttacking?: boolean;
}

export interface DemonProjectile {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  life: number;
}

export interface LoveStoryConfig {
  boyfriendName: string;
  girlfriendName: string;
  anniversaryDate: string;
  loveLetterTitle: string;
  loveLetterBody: string[];
  loveLetterSignoff: string;
  hellLetterTitle: string;
  hellLetterBody: string[];
  photos: {
    url: string;
    caption: string;
    date: string;
  }[];
  triviaQuestions: TriviaQuestion[];
}

export interface MapEntity {
  id: string;
  type: 'npc' | 'item' | 'puzzle' | 'gate' | 'letter_pedestal' | 'poi' | 'portal';
  x: number;
  y: number;
  name: string;
  sprite: string;
  interactionType: 'dialogue' | 'collect_item' | 'open_puzzle' | 'unlock_gate' | 'open_letter' | 'warp_realm';
  targetId?: string; // e.g. item id or puzzle id or realm name
  dialogue?: string[];
  solvedText?: string;
  requiresAllKeysAndItems?: boolean;
}
