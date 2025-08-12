export const rewardActions = [
  {
    id: 'scan-recycle',
    name: 'Scan QR Code for Recycling',
    points: 10,
    icon: '📱',
    description: 'Scan QR codes on recyclable items',
    category: 'Recycling'
  },
  {
    id: 'report-bin',
    name: 'Report Bin Issue',
    points: 15,
    icon: '📝',
    description: 'Report full or damaged bins',
    category: 'Reporting'
  },
  {
    id: 'educate-complete',
    name: 'Complete Education Module',
    points: 20,
    icon: '🎓',
    description: 'Finish reading educational content',
    category: 'Learning'
  },
  {
    id: 'proper-disposal',
    name: 'Proper Waste Disposal',
    points: 25,
    icon: '♻️',
    description: 'Correctly sort waste into bins',
    category: 'Sorting'
  },
  {
    id: 'community-clean',
    name: 'Community Cleanup',
    points: 50,
    icon: '🧹',
    description: 'Participate in neighborhood cleanup',
    category: 'Community'
  },
  {
    id: 'referral',
    name: 'Refer a Friend',
    points: 30,
    icon: '👥',
    description: 'Invite friends to use the app',
    category: 'Social'
  }
];

export const vouchers = [
  {
    id: 'voucher-1',
    title: 'Coffee Shop Discount',
    description: '20% off at participating coffee shops',
    points: 100,
    value: '$5',
    category: 'Food & Drink',
    icon: '☕',
    validFor: '30 days',
    terms: 'Valid at participating locations only. Cannot be combined with other offers.',
    partner: 'Green Bean Coffee Co.',
    color: '#8b4513'
  },
  {
    id: 'voucher-2',
    title: 'Grocery Store Credit',
    description: '$10 credit for grocery shopping',
    points: 200,
    value: '$10',
    category: 'Grocery',
    icon: '🛒',
    validFor: '60 days',
    terms: 'Minimum purchase of $50 required. One per customer.',
    partner: 'EcoMart Grocery',
    color: '#10b981'
  },
  {
    id: 'voucher-3',
    title: 'Public Transport Pass',
    description: 'Free daily public transport pass',
    points: 150,
    value: '$3',
    category: 'Transport',
    icon: '🚌',
    validFor: '90 days',
    terms: 'Valid for all public transport within city limits.',
    partner: 'City Transit Authority',
    color: '#3b82f6'
  },
  {
    id: 'voucher-4',
    title: 'Plant Store Voucher',
    description: '$15 off plants and gardening supplies',
    points: 300,
    value: '$15',
    category: 'Garden',
    icon: '🌱',
    validFor: '45 days',
    terms: 'Excludes sale items. Valid for plants, seeds, and gardening tools.',
    partner: 'Green Thumb Nursery',
    color: '#84cc16'
  },
  {
    id: 'voucher-5',
    title: 'Movie Theater Ticket',
    description: 'Free movie ticket for any showtime',
    points: 250,
    value: '$12',
    category: 'Entertainment',
    icon: '🎬',
    validFor: '30 days',
    terms: 'Valid for regular 2D screenings. Premium formats excluded.',
    partner: 'Downtown Cinema',
    color: '#8b5cf6'
  },
  {
    id: 'voucher-6',
    title: 'Bike Share Credit',
    description: '5 free bike share rides',
    points: 120,
    value: '$15',
    category: 'Transport',
    icon: '🚲',
    validFor: '45 days',
    terms: 'Each ride valid for up to 30 minutes.',
    partner: 'City Bike Share',
    color: '#06b6d4'
  },
  {
    id: 'voucher-7',
    title: 'Bookstore Gift Card',
    description: '$20 gift card for books and supplies',
    points: 400,
    value: '$20',
    category: 'Education',
    icon: '📚',
    validFor: '120 days',
    terms: 'Valid for books, magazines, and stationery items.',
    partner: 'Knowledge Corner Books',
    color: '#f59e0b'
  },
  {
    id: 'voucher-8',
    title: 'Eco-Products Discount',
    description: '25% off sustainable products',
    points: 180,
    value: '$8',
    category: 'Eco-Friendly',
    icon: '🌿',
    validFor: '60 days',
    terms: 'Valid for eco-friendly household and personal care items.',
    partner: 'EcoLife Store',
    color: '#059669'
  }
];

export const pointsHistory = [
  {
    id: 'history-1',
    action: 'Scan QR Code for Recycling',
    points: 10,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    type: 'earned'
  },
  {
    id: 'history-2',
    action: 'Report Bin Issue',
    points: 15,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    type: 'earned'
  },
  {
    id: 'history-3',
    action: 'Coffee Shop Discount',
    points: -100,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    type: 'redeemed'
  },
  {
    id: 'history-4',
    action: 'Complete Education Module',
    points: 20,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    type: 'earned'
  }
];

export const achievements = [
  {
    id: 'first-scan',
    title: 'First Scanner',
    description: 'Complete your first QR code scan',
    icon: '🔍',
    points: 5,
    unlocked: true
  },
  {
    id: 'reporter',
    title: 'Community Reporter',
    description: 'Submit 5 bin reports',
    icon: '📋',
    points: 25,
    unlocked: false,
    progress: 2,
    target: 5
  },
  {
    id: 'scholar',
    title: 'Eco Scholar',
    description: 'Read 10 educational articles',
    icon: '🎓',
    points: 50,
    unlocked: false,
    progress: 3,
    target: 10
  },
  {
    id: 'green-warrior',
    title: 'Green Warrior',
    description: 'Earn 500 total points',
    icon: '🏆',
    points: 100,
    unlocked: false,
    progress: 245,
    target: 500
  },
  {
    id: 'recycling-master',
    title: 'Recycling Master',
    description: 'Scan 50 QR codes',
    icon: '♻️',
    points: 150,
    unlocked: false,
    progress: 12,
    target: 50
  }
];

export const leaderboard = [
  { rank: 1, name: 'EcoWarrior2024', points: 1250, avatar: '🌟' },
  { rank: 2, name: 'GreenThumb', points: 1180, avatar: '🌱' },
  { rank: 3, name: 'RecycleKing', points: 950, avatar: '♻️' },
  { rank: 4, name: 'EarthLover', points: 820, avatar: '🌍' },
  { rank: 5, name: 'CleanCity', points: 750, avatar: '🧹' },
  { rank: 6, name: 'WasteNinja', points: 680, avatar: '🥷' },
  { rank: 7, name: 'EcoFriend', points: 620, avatar: '🌿' },
  { rank: 8, name: 'GreenGuard', points: 580, avatar: '🛡️' },
  { rank: 9, name: 'You', points: 245, avatar: '👤' },
  { rank: 10, name: 'NewRecycler', points: 150, avatar: '🆕' }
]; 