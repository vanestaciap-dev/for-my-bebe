import { MapEntity, HellDemon } from '../types/game';

export const MAP_WIDTH = 30;
export const MAP_HEIGHT = 22;
export const TILE_SIZE = 40; // 16-bit crisp tile size

export const HELL_MAP_WIDTH = 19;
export const HELL_MAP_HEIGHT = 15;

export enum TileType {
  GRASS_PARK = 0,
  RED_BRICK_WALL = 1,
  COBBLESTONE = 2,
  CANAL_WATER = 3,
  WOOD_TIMBER = 4,
  CHECKER_MARBLE = 5,
  CINEMA_CARPET = 6,
  BANYAN_TREE = 7,
  BRIDGE_BALUSTRADE = 8,
  ANTIQUE_COUNTER = 9,
  FLOWER_BUSH = 10,
  DOME_TILE = 11,
  STREETLAMP_BASE = 12,
  SECRET_PORTAL = 13,
}

// Hell Realm Tile Types
export enum HellTileType {
  OBSIDIAN_FLOOR = 0,
  OBSIDIAN_WALL = 1,
  LAVA_RIVER = 2,
  MAGMA_CRACK = 3,
  RUNE_PEDESTAL = 4,
  RETURN_PORTAL = 5,
}

// 30 x 22 Tile Grid representing Kota Lama, Semarang, Indonesia
export const OVERWORLD_TILES: number[][] = [
  // 0: North perimeter
  [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 1, 1, 1, 1, 1, 1, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
  // 1: Gereja Blenduk Dome & Colonial Shop Roofs
  [7, 1, 1, 1, 1, 1, 1, 1, 7, 7, 8, 11, 11, 11, 11, 11, 11, 8, 7, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7],
  // 2: Toko Es Krim (NW) & Gereja Blenduk Portico & Gedung Marba Bakery (NE)
  [7, 1, 5, 5, 5, 5, 5, 1, 7, 7, 8, 11, 11, 11, 11, 11, 11, 8, 7, 7, 1, 4, 4, 4, 4, 4, 4, 4, 1, 7],
  // 3: Toko Oen Ice Cream Counter & Blenduk Altar & Bakery Ovens
  [7, 1, 9, 5, 5, 5, 9, 1, 7, 8, 8, 11, 11, 11, 11, 11, 11, 8, 8, 7, 1, 9, 4, 4, 4, 4, 4, 9, 1, 7],
  // 4: Shop front doors & Gerbang Kasih Gate row
  [7, 1, 5, 5, 5, 5, 5, 1, 8, 8, 8, 8, 8, 1, 1, 8, 8, 8, 8, 8, 1, 4, 4, 4, 4, 4, 4, 4, 1, 7],
  // 5: Walkway to Taman Srigunting
  [7, 1, 1, 1, 2, 1, 1, 1, 0, 0, 10, 2, 2, 2, 2, 2, 2, 10, 0, 0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 7],
  // 6: Taman Srigunting Courtyard (Gereja Blenduk plaza)
  [7, 0, 0, 0, 2, 0, 0, 0, 0, 7, 0, 2, 2, 2, 2, 2, 2, 0, 7, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 7],
  // 7: Benches, Sepeda Ontel & Fountain
  [7, 0, 10, 0, 2, 0, 10, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 10, 0, 0, 2, 0, 10, 0, 0, 7],
  // 8: Jl. Letjen Suprapto (Main Cobblestone Heritage Promenade)
  [7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7],
  // 9: Kali Semarang Canal North Bank & Jembatan Berok approaches
  [7, 8, 8, 8, 2, 8, 8, 8, 8, 8, 8, 8, 8, 2, 2, 2, 2, 8, 8, 8, 8, 8, 8, 8, 2, 8, 8, 8, 8, 7],
  // 10: Kali Semarang Canal Water (Stone Bridge across center)
  [7, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 7],
  // 11: Kali Semarang Canal Water (Reflections of antique streetlamps)
  [7, 3, 3, 3, 2, 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 7],
  // 12: Kali Semarang Canal South Bank & Jembatan Berok South exit
  [7, 8, 8, 8, 2, 8, 8, 8, 8, 8, 8, 8, 8, 2, 2, 2, 2, 8, 8, 8, 8, 8, 8, 8, 2, 8, 8, 8, 8, 7],
  // 13: South Heritage Promenade (Pasar Klithikan & Cinema Promenade)
  [7, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7],
  // 14: Bioskop Marabunta & Pasar Klithikan (SW) & Gazebo Cinta (SE)
  [7, 1, 1, 1, 2, 1, 1, 1, 1, 1, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 1, 1, 1, 1, 2, 1, 1, 1, 1, 7],
  // 15: Cinema Marquee & Antique Stalls
  [7, 1, 6, 6, 6, 6, 6, 6, 6, 1, 0, 10, 0, 2, 2, 2, 2, 0, 10, 0, 1, 5, 5, 5, 5, 5, 5, 5, 1, 7],
  // 16: Cinema Projection Screen & Vintage Tape Racks
  [7, 1, 9, 6, 6, 6, 6, 6, 9, 1, 0, 0, 0, 2, 2, 2, 2, 0, 0, 0, 1, 9, 5, 5, 5, 5, 5, 9, 1, 7],
  // 17: Cinema Velvet Seats & Antique Pavilion Interior
  [7, 1, 6, 6, 6, 6, 6, 6, 6, 1, 7, 0, 0, 2, 2, 2, 2, 0, 0, 7, 1, 5, 5, 5, 5, 5, 5, 5, 1, 7],
  // 18: Cinema Row 2 & Gazebo Archways
  [7, 1, 6, 6, 6, 6, 6, 6, 6, 1, 7, 0, 0, 2, 2, 2, 2, 0, 0, 7, 1, 5, 5, 5, 5, 5, 5, 5, 1, 7],
  // 19: Cinema Exit & Hidden Nether Road (column 1 = 13: Secret Portal)
  [7, 13, 6, 6, 6, 6, 6, 6, 6, 1, 7, 0, 0, 2, 0, 0, 2, 0, 0, 7, 1, 5, 5, 5, 5, 5, 5, 5, 1, 7],
  // 20: Southern heritage walls
  [7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 0, 0, 2, 0, 0, 2, 0, 0, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7],
  // 21: South boundary
  [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7]
];

// 18 x 15 Dark Nether Realm / Hell Chamber Tiles
// 0: Obsidian Floor, 1: Skull Pillar Wall, 2: Magma Path, 3: Lava River, 4: Altar Tile
export const HELL_MAP_TILES: number[][] = [
  // 0: North perimeter
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  // 1: Cursed Skull Pillars
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
  // 2: Lava moats
  [1, 0, 3, 3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 3, 0, 1],
  // 3: Magma cracks
  [1, 0, 3, 3, 3, 0, 2, 2, 2, 2, 2, 2, 2, 0, 3, 3, 3, 0, 1],
  // 4: Chamber upper
  [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
  // 5: Demon 1 & Demon 2 spawn areas
  [1, 1, 0, 0, 0, 0, 2, 0, 4, 4, 4, 0, 2, 0, 0, 0, 0, 1, 1],
  // 6: Center approach
  [1, 0, 0, 2, 2, 2, 2, 4, 4, 4, 4, 4, 2, 2, 2, 2, 0, 0, 1],
  // 7: The Box in the Middle (x: 9, y: 7)
  [1, 0, 3, 2, 0, 0, 2, 4, 4, 4, 4, 4, 2, 0, 0, 2, 3, 0, 1],
  // 8: Center altar
  [1, 0, 3, 2, 2, 2, 2, 4, 4, 4, 4, 4, 2, 2, 2, 2, 3, 0, 1],
  // 9: Chamber lower
  [1, 1, 0, 0, 0, 0, 2, 0, 4, 4, 4, 0, 2, 0, 0, 0, 0, 1, 1],
  // 10: Demon 3 & Demon 4 spawn areas
  [1, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
  // 11: Lava south
  [1, 0, 3, 3, 3, 0, 2, 2, 2, 2, 2, 2, 2, 0, 3, 3, 3, 0, 1],
  // 12: Approach to portal
  [1, 0, 3, 3, 3, 0, 0, 0, 0, 2, 0, 0, 0, 0, 3, 3, 3, 0, 1],
  // 13: Portal Platform (x: 9, y: 13)
  [1, 0, 0, 0, 0, 0, 0, 0, 2, 5, 2, 0, 0, 0, 0, 0, 0, 0, 1],
  // 14: South perimeter
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

// Interactive entities placed across Kota Lama, Semarang
export const MAP_ENTITIES: MapEntity[] = [
  // 1. Collectible: Toko Oen Ice Cream in Toko Es Krim Kolonial (x: 3, y: 3)
  {
    id: 'entity_ice_cream',
    type: 'item',
    targetId: 'ice_cream',
    x: 3,
    y: 3,
    name: 'Toko Oen Heritage Ice Cream',
    sprite: '🍨',
    interactionType: 'collect_item',
    dialogue: [
      'You found the Toko Oen Heritage Ice Cream! 🍨',
      '"Strolling past the colonial arcades of Jl. Letjen Suprapto, laughing as the strawberry ice cream melted on our hands."'
    ]
  },

  // 2. Collectible: Gedung Marba Basque Cheesecake in Bakery (x: 26, y: 3)
  {
    id: 'entity_cheesecake',
    type: 'item',
    targetId: 'cheesecake',
    x: 26,
    y: 3,
    name: 'Gedung Marba Basque Cheesecake',
    sprite: '🍰',
    interactionType: 'collect_item',
    dialogue: [
      'You found the Gedung Marba Basque Cheesecake! 🍰',
      '"Sheltering from the afternoon rain inside the high-ceiling red-brick cafe, sharing warm cake straight from the pan."'
    ]
  },

  // 3. Collectible: Kaset Pita Bioskop in Pasar Klithikan & Bioskop Marabunta (x: 3, y: 16)
  {
    id: 'entity_movie_cassette',
    type: 'item',
    targetId: 'movie_cassette',
    x: 3,
    y: 16,
    name: 'Kaset Pita Bioskop & Pasar Klithikan',
    sprite: '📼',
    interactionType: 'collect_item',
    dialogue: [
      'You found the Vintage Movie Cassette (Kaset Pita Kenangan)! 📼',
      '"Treasures from Pasar Barang Antik Kota Lama. All those late-night movie marathons wrapped in warm blankets."'
    ]
  },

  // 4. Puzzle 1: Gereja Blenduk Carillon Bell (Taman Srigunting - x: 15, y: 7)
  {
    id: 'entity_puzzle_melody',
    type: 'puzzle',
    targetId: 'melody',
    x: 15,
    y: 7,
    name: 'Lonceng Gereja Blenduk',
    sprite: '🔔',
    interactionType: 'open_puzzle',
    dialogue: [
      'An antique brass carillon bell stands proudly in Taman Srigunting, facing Gereja Blenduk.',
      'It echoes the peaceful chime of our song! Replay the notes to unlock the Harmony Key.'
    ],
    solvedText: 'The carillon chimes peacefully across Taman Srigunting. Harmony Key acquired! 🎵'
  },

  // 5. Puzzle 2: Starlit Mosaic Photo Booth (Beside Bioskop Marabunta - x: 9, y: 15)
  {
    id: 'entity_puzzle_mosaic',
    type: 'puzzle',
    targetId: 'mosaic',
    x: 9,
    y: 15,
    name: 'Bilik Foto Vintage Bioskop',
    sprite: '🕹️',
    interactionType: 'open_puzzle',
    dialogue: [
      'An antique 16-bit wooden photo booth glows warmly under the cinema marquee.',
      'Reassemble the vintage photograph of us together in Kota Lama to earn the Mosaic Key!'
    ],
    solvedText: 'The vintage photo booth prints a sparkling 16-bit keepsake of us! Mosaic Key acquired. 🧩'
  },

  // 6. Puzzle 3: Trivia Cinta Gazebo (South-East Colonial Pavilion - x: 25, y: 16)
  {
    id: 'entity_puzzle_trivia',
    type: 'puzzle',
    targetId: 'trivia',
    x: 25,
    y: 16,
    name: 'Paviliun Kenangan Kota Lama',
    sprite: '📖',
    interactionType: 'open_puzzle',
    dialogue: [
      'A beautiful leather-bound love journal rests on a marble stand inside the colonial gazebo.',
      'Answer 3 sweet questions about our relationship to unlock the Trivia Key!'
    ],
    solvedText: 'You proved your love memory is unmatched! Trivia Key acquired. 💖'
  },

  // 7. Cupid Cat of Taman Srigunting (NPC on park lawn - x: 14, y: 6)
  {
    id: 'entity_npc_cat',
    type: 'npc',
    x: 14,
    y: 6,
    name: 'Kucing Cantik Kota Lama 🐱',
    sprite: '🐱',
    interactionType: 'dialogue',
    dialogue: [
      'Meow! Welcome to Kota Lama, Semarang! 🐾',
      'The air is peaceful, and your girlfriend has hidden a secret love letter on the Heritage Balcony of Gereja Blenduk (North).',
      'Psst... there is also a hidden dark tunnel behind Bioskop Marabunta (South-West corner) leading to a fiery Nether Realm with letters guarded by demons!',
      'Gather all 3 treats (🍨, 🍰, 📼) and solve the 3 memory puzzles to open Gerbang Kasih!'
    ]
  },

  // 8. Sepeda Ontel Klasik (Antique Dutch Bicycle in Taman Srigunting - x: 12, y: 7)
  {
    id: 'entity_npc_bicycle',
    type: 'npc',
    x: 12,
    y: 7,
    name: 'Sepeda Ontel Klasik 🚲',
    sprite: '🚲',
    interactionType: 'dialogue',
    dialogue: [
      'An antique Dutch bicycle with a woven flower basket rests peacefully by the banyan tree.',
      'A handwritten wooden tag reads: "To my favorite person in the world... let us pedal through every adventure hand-in-hand forever."'
    ]
  },

  // 9. Gerbang Kasih Heritage (The Golden Gate to Love Shrine - x: 14, y: 4)
  {
    id: 'entity_golden_gate',
    type: 'gate',
    x: 14,
    y: 4,
    name: 'Gerbang Kasih Gereja Blenduk',
    sprite: '🔒',
    interactionType: 'unlock_gate',
    requiresAllKeysAndItems: true,
    dialogue: [
      'The ornate wrought-iron arch of Gereja Blenduk is sealed with 3 ancient keyholes and 3 pedestal slots.',
      'It requires all 3 Collectibles (🍨, 🍰, 📼) and all 3 Memory Keys (🎵, 🧩, 💖) to unlock!'
    ],
    solvedText: 'Gerbang Kasih opens smoothly with a gentle golden glow! Step onto the balcony to read your love letter.'
  },

  // 10. The Secret Love Letter Shrine (x: 14, y: 2)
  {
    id: 'entity_love_letter',
    type: 'letter_pedestal',
    x: 14,
    y: 2,
    name: 'Balkon Cinta Gereja Blenduk',
    sprite: '💌',
    interactionType: 'open_letter',
    dialogue: [
      'A wax-sealed pink and gold envelope rests on an antique carved pedestal overlooking Kota Lama.',
      'Opening the secret love letter from your girlfriend...'
    ]
  },

  // 11. Hidden Road / Nether Portal behind Bioskop Marabunta (x: 1, y: 19)
  {
    id: 'entity_secret_portal',
    type: 'portal',
    x: 1,
    y: 19,
    name: 'Lorong Gelap Neraka (Hidden Abyss Portal)',
    sprite: '🔥',
    interactionType: 'warp_realm',
    targetId: 'hell_realm',
    dialogue: [
      'You found the hidden road! A cracked volcanic staircase carved with fiery red runes descends into a dark underworld...',
      'You sense a mysterious locked box in the center, guarded by dark demons of doubt and fear! Warping to the Abyss...'
    ]
  }
];

// Hell Realm Entities (Center Box and Return Portal)
export const HELL_MAP_ENTITIES: MapEntity[] = [
  // 1. Return Portal (x: 9, y: 13)
  {
    id: 'entity_return_portal',
    type: 'portal',
    x: 9,
    y: 13,
    name: 'Portal Cahaya Kembali (Return to Kota Lama)',
    sprite: '🌀',
    interactionType: 'warp_realm',
    targetId: 'kota_lama',
    dialogue: [
      'A swirl of peaceful blue light opens a passage back to the calm cobblestone streets of Kota Lama, Semarang.'
    ]
  },

  // 2. The Sealed Box in the Middle of Hell (x: 9, y: 7)
  {
    id: 'entity_hell_chest',
    type: 'letter_pedestal',
    x: 9,
    y: 7,
    name: 'Kotak Tersegel Lembah Api (Abyssal Love Box)',
    sprite: '📦',
    interactionType: 'open_letter',
    dialogue: [
      'A heavy obsidian chest wrapped in glowing crimson chains rests on the central volcanic altar.',
      'It contains the secret letters of our deepest love, but the chains can only break once all demons are defeated!'
    ]
  }
];

// Initial Demons guarding the Hell Box
export const INITIAL_DEMONS: HellDemon[] = [
  {
    id: 'demon_doubt',
    name: 'Iblis Keraguan',
    title: 'Demon of Doubt & Insecurity',
    sprite: '😈',
    x: 5,
    y: 5,
    hp: 3,
    maxHp: 3,
    isDefeated: false,
    deathCry: 'Argh! Your love was too certain, pure, and strong!',
    color: '#a855f7'
  },
  {
    id: 'demon_distance',
    name: 'Iblis Jarak & Kelelahan',
    title: 'Demon of Distance & Exhaustion',
    sprite: '👿',
    x: 13,
    y: 5,
    hp: 3,
    maxHp: 3,
    isDefeated: false,
    deathCry: 'No matter how tired the world gets, your bond never breaks!',
    color: '#3b82f6'
  },
  {
    id: 'demon_badmood',
    name: 'Iblis Bad Mood',
    title: 'Demon of Rainy Day Frustrations',
    sprite: '👹',
    x: 5,
    y: 10,
    hp: 3,
    maxHp: 3,
    isDefeated: false,
    deathCry: 'Your sweet smiles and warm hugs melted my anger away!',
    color: '#ef4444'
  },
  {
    id: 'demon_overlord',
    name: 'Raja Iblis Ketakutan',
    title: 'Overlord of Dark Fears',
    sprite: '👺',
    x: 13,
    y: 10,
    hp: 4,
    maxHp: 4,
    isDefeated: false,
    deathCry: 'Incredible... True love conquers even the darkest abyss!',
    color: '#f97316'
  }
];

// Solid non-walkable tiles for Kota Lama
export const SOLID_TILES = new Set<number>([
  TileType.RED_BRICK_WALL,
  TileType.CANAL_WATER,
  TileType.BANYAN_TREE,
  TileType.BRIDGE_BALUSTRADE,
  TileType.ANTIQUE_COUNTER
]);

// Solid non-walkable tiles for Hell Realm
export const SOLID_HELL_TILES = new Set<number>([
  HellTileType.OBSIDIAN_WALL,
  HellTileType.LAVA_RIVER
]);
