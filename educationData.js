export const educationTips = [
  {
    id: 'tip-1',
    category: 'Basic Segregation',
    title: 'The 3-Bin System',
    description: 'Learn the fundamentals of waste segregation using the simple 3-bin system for different types of waste.',
    content: [
      'Green Bin: Biodegradable waste like food scraps, yard trimmings, and organic materials',
      'Blue Bin: Recyclable materials such as paper, plastic, glass, and metal',
      'Red Bin: Non-recyclable waste including medical waste, broken glass, and contaminated items'
    ],
    icon: '🗂️',
    difficulty: 'Beginner',
    readTime: '2 min',
    tips: [
      'Keep bins clean and dry',
      'Remove food residue from recyclables',
      'Check local guidelines for specific items'
    ]
  },
  {
    id: 'tip-2',
    category: 'Plastic Recycling',
    title: 'Understanding Plastic Codes',
    description: 'Decode the plastic recycling symbols to properly sort different types of plastic materials.',
    content: [
      'Code 1 (PET): Water bottles, soft drink bottles - Highly recyclable',
      'Code 2 (HDPE): Milk jugs, detergent bottles - Commonly recycled',
      'Code 3 (PVC): Pipes, vinyl flooring - Rarely recyclable',
      'Code 4 (LDPE): Plastic bags, food wraps - Special collection needed',
      'Code 5 (PP): Yogurt containers, bottle caps - Increasingly recyclable',
      'Code 6 (PS): Styrofoam, disposable cups - Difficult to recycle',
      'Code 7 (Other): Mixed plastics - Usually not recyclable'
    ],
    icon: '♻️',
    difficulty: 'Intermediate',
    readTime: '4 min',
    tips: [
      'Look for the recycling symbol with numbers',
      'Focus on codes 1 and 2 for best recycling success',
      'Avoid single-use plastics when possible'
    ]
  },
  {
    id: 'tip-3',
    category: 'Composting',
    title: 'Home Composting Basics',
    description: 'Start your own compost system at home to reduce organic waste and create nutrient-rich soil.',
    content: [
      'Brown Materials: Dry leaves, paper, cardboard - provide carbon',
      'Green Materials: Food scraps, grass clippings - provide nitrogen',
      'Maintain 3:1 ratio of brown to green materials',
      'Turn compost regularly to ensure proper aeration',
      'Keep compost moist but not waterlogged',
      'Compost is ready in 3-6 months when dark and crumbly'
    ],
    icon: '🌱',
    difficulty: 'Intermediate',
    readTime: '5 min',
    tips: [
      'Avoid meat, dairy, and oily foods',
      'Chop large items into smaller pieces',
      'Add red worms to speed up decomposition'
    ]
  },
  {
    id: 'tip-4',
    category: 'E-Waste',
    title: 'Electronic Waste Management',
    description: 'Properly dispose of electronic devices to prevent environmental contamination and recover valuable materials.',
    content: [
      'Smartphones and tablets contain precious metals like gold and silver',
      'Batteries contain toxic chemicals that need special handling',
      'Old computers can be refurbished and donated',
      'Never throw electronics in regular trash',
      'Data security: Always wipe personal information before disposal',
      'Find certified e-waste recycling centers in your area'
    ],
    icon: '📱',
    difficulty: 'Advanced',
    readTime: '3 min',
    tips: [
      'Check manufacturer take-back programs',
      'Remove batteries before recycling devices',
      'Consider repair before replacement'
    ]
  },
  {
    id: 'tip-5',
    category: 'Paper Recycling',
    title: 'Paper Recycling Do\'s and Don\'ts',
    description: 'Maximize paper recycling efficiency by understanding what can and cannot be recycled.',
    content: [
      'CAN Recycle: Newspapers, magazines, office paper, cardboard boxes',
      'CANNOT Recycle: Wax-coated paper, carbon paper, tissue paper',
      'Remove staples and paper clips when possible',
      'Pizza boxes are only recyclable if grease-free',
      'Shredded paper needs special handling',
      'Paper can be recycled 5-7 times before fibers become too short'
    ],
    icon: '📄',
    difficulty: 'Beginner',
    readTime: '3 min',
    tips: [
      'Keep paper dry and clean',
      'Remove plastic windows from envelopes',
      'Bundle newspapers and magazines together'
    ]
  },
  {
    id: 'tip-6',
    category: 'Hazardous Waste',
    title: 'Safe Disposal of Hazardous Materials',
    description: 'Learn how to safely dispose of household chemicals and hazardous materials to protect the environment.',
    content: [
      'Paint, solvents, and pesticides require special disposal',
      'Never pour chemicals down drains or toilets',
      'Household hazardous waste collection days',
      'Auto fluids: motor oil, antifreeze, brake fluid',
      'Fluorescent bulbs contain mercury',
      'Smoke detectors may contain radioactive materials'
    ],
    icon: '⚠️',
    difficulty: 'Advanced',
    readTime: '4 min',
    tips: [
      'Keep chemicals in original containers',
      'Never mix different chemicals',
      'Use up products completely when possible'
    ]
  },
  {
    id: 'tip-7',
    category: 'Reduce & Reuse',
    title: 'Before You Recycle: Reduce and Reuse',
    description: 'The first two R\'s are more important than recycling. Learn creative ways to reduce and reuse items.',
    content: [
      'Buy only what you need to reduce waste at the source',
      'Choose products with minimal packaging',
      'Reuse glass jars for storage containers',
      'Turn old t-shirts into cleaning rags',
      'Use both sides of paper before recycling',
      'Repurpose cardboard boxes for organization',
      'Donate or sell items instead of throwing away'
    ],
    icon: '🔄',
    difficulty: 'Beginner',
    readTime: '3 min',
    tips: [
      'Get creative with repurposing projects',
      'Share or borrow items you rarely use',
      'Choose quality items that last longer'
    ]
  },
  {
    id: 'tip-8',
    category: 'Glass Recycling',
    title: 'Glass Recycling Guidelines',
    description: 'Glass is infinitely recyclable. Learn how to properly prepare glass items for recycling.',
    content: [
      'Glass can be recycled endlessly without quality loss',
      'Remove lids and caps from glass containers',
      'Rinse containers to remove food residue',
      'Clear, brown, and green glass may need to be separated',
      'Broken glass should be wrapped and labeled',
      'Window glass and mirrors are not recyclable with containers',
      'Light bulbs require special recycling programs'
    ],
    icon: '🍾',
    difficulty: 'Beginner',
    readTime: '2 min',
    tips: [
      'Don\'t break glass intentionally',
      'Check local color separation requirements',
      'Consider reusing glass jars first'
    ]
  }
];

export const wasteCategories = [
  {
    name: 'Organic Waste',
    color: '#84cc16',
    icon: '🥬',
    examples: ['Food scraps', 'Yard trimmings', 'Paper towels', 'Egg shells'],
    binColor: 'Green'
  },
  {
    name: 'Recyclables',
    color: '#3b82f6',
    icon: '♻️',
    examples: ['Plastic bottles', 'Aluminum cans', 'Paper', 'Cardboard'],
    binColor: 'Blue'
  },
  {
    name: 'Non-Recyclable',
    color: '#ef4444',
    icon: '🗑️',
    examples: ['Medical waste', 'Broken ceramics', 'Dirty diapers', 'Cigarette butts'],
    binColor: 'Red'
  },
  {
    name: 'Hazardous',
    color: '#f59e0b',
    icon: '⚠️',
    examples: ['Batteries', 'Paint', 'Chemicals', 'Electronic devices'],
    binColor: 'Yellow'
  }
];

export const recyclingBenefits = [
  {
    title: 'Environmental Protection',
    description: 'Reduces pollution and conserves natural resources',
    icon: '🌍',
    stats: 'Saves 17 trees for every ton of paper recycled'
  },
  {
    title: 'Energy Conservation',
    description: 'Uses less energy than producing new materials',
    icon: '⚡',
    stats: 'Recycling aluminum saves 95% of energy vs. new production'
  },
  {
    title: 'Economic Benefits',
    description: 'Creates jobs and generates economic value',
    icon: '💰',
    stats: 'Recycling industry employs over 1.1 million people'
  },
  {
    title: 'Waste Reduction',
    description: 'Reduces the amount of waste sent to landfills',
    icon: '📉',
    stats: 'Americans recycle 32% of their waste annually'
  }
];

export const funFacts = [
  'It takes 500 years for a plastic bottle to decompose in a landfill',
  'One recycled plastic bottle can save enough energy to power a laptop for 6 hours',
  'Americans throw away enough paper annually to build a wall 12 feet high from LA to NYC',
  'Recycling one aluminum can saves enough energy to watch TV for 3 hours',
  'Glass containers can be recycled infinitely without losing quality',
  'The average American generates 4.9 pounds of waste per day',
  'Composting can reduce household waste by up to 30%',
  'One ton of recycled paper saves 3.3 cubic yards of landfill space'
]; 