import { CollectibleItem, MemoryPuzzle, LoveStoryConfig } from '../types/game';

export const INITIAL_COLLECTIBLES: CollectibleItem[] = [
  {
    id: 'ice_cream',
    name: 'Toko Oen Heritage Ice Cream',
    category: 'Favorite Sweet Memory',
    icon: '🍨',
    tagline: 'Sweet afternoon stroll in Kota Lama, Semarang',
    memoryStory: 'Walking past the colonial arcades of Jl. Letjen Suprapto and sharing double scoops of tutti frutti ice cream! You laughed so hard when the ice cream dripped onto your fingers, and when we sat on the wooden bench watching the vintage bicycles pass by, I knew I wanted to spend every sunset with you.',
    locationHint: 'Inside the historic Toko Es Krim Kolonial (North-West, near Taman Srigunting)',
    found: false,
    color: 'from-pink-500 to-rose-400'
  },
  {
    id: 'cheesecake',
    name: 'Gedung Marba Basque Cheesecake',
    category: 'Favorite Cozy Café Treat',
    icon: '🍰',
    tagline: 'Sheltering from the tropical rain in Kota Lama',
    memoryStory: 'The afternoon the Semarang sky poured warm tropical rain, and we ducked inside the cozy red-brick cafe with high colonial ceilings. We shared a warm slice of strawberry basque cheesecake, listened to the raindrops echoing on the terracotta tiles, and didn’t want the afternoon to ever end.',
    locationHint: 'Beside the warm bakery counter in Gedung Marba Café (North-East)',
    found: false,
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 'movie_cassette',
    name: 'Kaset Pita Bioskop & Pasar Klithikan',
    category: 'Favorite Movie & Song Tape',
    icon: '📼',
    tagline: 'Treasures from Pasar Barang Antik Kota Lama',
    memoryStory: 'Digging through vintage cassette crates and old movie reels at Pasar Klithikan beside Bioskop Marabunta. You held up this tape with a grin and whispered that every love song on it belonged to us. Now every time we have our late-night movie marathons wrapped in blankets, this memory plays in my heart.',
    locationHint: 'Between the vintage racks at Bioskop Marabunta & Pasar Antik (South-West)',
    found: false,
    color: 'from-indigo-400 to-purple-500'
  }
];

export const INITIAL_PUZZLES: MemoryPuzzle[] = [
  {
    id: 'melody',
    title: 'Gereja Blenduk Carillon Melody',
    keyName: 'Harmony Key 🎵',
    keyIcon: '🗝️',
    description: 'Listen to the nostalgic chimes of the iconic dome church and replay the sweet melody of our song.',
    solved: false,
    color: 'text-amber-300'
  },
  {
    id: 'mosaic',
    title: 'Starlit Taman Srigunting Mosaic',
    keyName: 'Mosaic Key 🧩',
    keyIcon: '🔑',
    description: 'Reassemble the 16-bit vintage photo of us together under the glowing gas lamps of Kota Lama.',
    solved: false,
    color: 'text-sky-300'
  },
  {
    id: 'trivia',
    title: 'Trivia Cinta & Kenangan Kita',
    keyName: 'Trivia Key 💖',
    keyIcon: '🗝️',
    description: 'Answer 3 heartfelt questions about our unforgettable moments to unlock the final key of love!',
    solved: false,
    color: 'text-rose-300'
  }
];

export const DEFAULT_STORY_CONFIG: LoveStoryConfig = {
  boyfriendName: 'My Favorite Person',
  girlfriendName: 'Your Love',
  anniversaryDate: 'Kota Lama, Semarang · Forever & Always',
  loveLetterTitle: 'To the love of my life, my best friend, and my favorite adventure partner...',
  loveLetterBody: [
    'If you are reading this on the balcony of Kota Lama, it means you navigated through every nostalgic corner, found all our favorite treats, and proved once again how much you remember every little piece of us.',
    'I made this 16-bit world inspired by our favorite memories in Kota Lama, Semarang—where the old Dutch cobblestones, the dome of Gereja Blenduk, the canal breeze, and the antique streetlamps will always remind me of the magic of falling in love with you.',
    'Thank you for being my anchor, for sharing the last spoonful of dessert, for holding my hand when it rains, and for making every ordinary day feel like the most beautiful movie scene.',
    'No matter where our journey leads, through sunny golden hours or stormy rainy days, I choose you—every single day, in every lifetime, in every pixel.',
    'Happy Anniversary / Valentine’s Day! You will forever be my player two.'
  ],
  loveLetterSignoff: 'With all the love in the universe & more,',
  hellLetterTitle: 'SURAT DARI LEMBAH API: Untuk Kesatria Hatiku',
  hellLetterBody: [
    'Kamu telah bertarung menembus lahar dan kegelapan, mengalahkan iblis keraguan, jarak, dan rasa takut, lalu membuka peti obsidian terkutuk ini di dasar terdalam.',
    'Aku menyembunyikan surat rahasia ini di sini karena cinta kita bukan hanya tentang hari-hari cerah dan manis di Kota Lama. Cinta kita teruji kuat karena kita selalu saling memilih bahkan saat menghadapi badai, hari-hari yang melelahkan, dan kegelapan hidup.',
    'Setiap kali kamu merasa lelah, tertekan dengan pekerjaan, atau menghadapi masa-masa sulit, ingatlah bahwa kamu tidak pernah bertarung sendirian. Aku akan selalu berdiri di sampingmu, menggenggam pedang cinta bersamamu, mengusir semua iblis kegelapan yang menghalangi jalan kita.',
    'Kamu adalah pahlawanku, kesatria terkuatku, dan tempat ternyamanku pulang. Terima kasih telah membuktikan bahwa cinta kita mampu menaklukkan apapun di dunia ini dan selamanya!'
  ],
  photos: [
    {
      url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=600&q=80',
      caption: 'Golden hour stroll by the historic buildings of Kota Lama.',
      date: 'Kota Lama, Semarang'
    },
    {
      url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80',
      caption: 'Laughing over dessert and coffee at the vintage cafe.',
      date: 'Sweet Memories'
    },
    {
      url: 'https://images.unsplash.com/photo-1494774157365-9e04c6720e47?auto=format&fit=crop&w=600&q=80',
      caption: 'Holding hands under the warm evening streetlamps.',
      date: 'Forever & Always'
    }
  ],
  triviaQuestions: [
    {
      question: 'When we walk around together in places like Kota Lama, what do we love doing most?',
      options: [
        'Finding cute dessert spots & laughing until our cheeks hurt!',
        'Rushing through without looking at anything',
        'Getting lost on purpose and debating who has better sense of direction',
        'Hunting for sweet snacks and taking silly photos together!'
      ],
      correctIndex: 3,
      sweetNote: 'Spot on! Exploring vintage corners and taking silly cute photos together is our favorite thing!'
    },
    {
      question: 'What is our couple superpower when it rains in Semarang?',
      options: [
        'Finding the coziest spot, eating warm snacks, and listening to the rain',
        'Running through puddles like dramatic movie characters',
        'Stealing the entire umbrella',
        'All of the above combined with big smiles!'
      ],
      correctIndex: 3,
      sweetNote: 'Haha yes! All of the above—especially cozying up and watching the raindrops together!'
    },
    {
      question: 'How much do I love you, through every chapter of our lives?',
      options: [
        'More than all the ice cream in Toko Oen combined',
        'More than all the stars above Gereja Blenduk',
        'Endlessly, in every weather and every season of life',
        'All of the above, forever and always without end'
      ],
      correctIndex: 3,
      sweetNote: 'Infinitely! You are my forever favorite person in the whole wide world.'
    }
  ]
};
