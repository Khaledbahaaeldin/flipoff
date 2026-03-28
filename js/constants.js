export const GRID_COLS = 22;
export const GRID_ROWS = 5;

export const SCRAMBLE_DURATION = 800;
export const FLIP_DURATION = 300;
export const STAGGER_DELAY = 25;
export const TOTAL_TRANSITION = 3800;
export const MESSAGE_INTERVAL = 4000;

export const MODES = {
  SHOWCASE: 'showcase',
  SLEEP: 'sleep'
};

export const CHARSET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,-!?\'/: ';

export const SCRAMBLE_COLORS = [
  '#00AAFF', '#00FFCC', '#AA00FF',
  '#FF2D00', '#FFCC00', '#FFFFFF'
];

export const ACCENT_COLORS = [
  '#00FF7F', '#FF4D00', '#AA00FF',
  '#00AAFF', '#00FFCC'
];

export const MODE_PROFILES = {
  [MODES.SHOWCASE]: {
    label: 'Showcase',
    messageInterval: 3600,
    weatherRefreshMs: 10 * 60 * 1000,
    defaultMuted: false,
    accentColors: ['#00FF7F', '#FF4D00', '#00AAFF', '#FFCC00', '#00FFCC'],
    scrambleColors: ['#00AAFF', '#00FFCC', '#FF2D00', '#FFCC00', '#FFFFFF']
  },
  [MODES.SLEEP]: {
    label: 'Sleep',
    messageInterval: 5200,
    weatherRefreshMs: 20 * 60 * 1000,
    defaultMuted: true,
    accentColors: ['#4AD9A0', '#4AB0D9', '#9BB7C4', '#7AD7C8', '#B7D7CF'],
    scrambleColors: ['#2E8BBA', '#4AA89B', '#7CB8C7', '#9CCFD4', '#FFFFFF']
  }
};

export const CITIES = [
  {
    id: 'alexandria',
    display: 'ALEXANDRIA, EG',
    timezone: 'Africa/Cairo',
    latitude: 31.2001,
    longitude: 29.9187
  },
  {
    id: 'casablanca',
    display: 'CASABLANCA, MA',
    timezone: 'Africa/Casablanca',
    latitude: 33.5731,
    longitude: -7.5898
  },
  {
    id: 'riyadh',
    display: 'RIYADH, SA',
    timezone: 'Asia/Riyadh',
    latitude: 24.7136,
    longitude: 46.6753
  }
];

export const MESSAGES = [
  [
    '',
    'GOD IS IN',
    'THE DETAILS .',
    '- LUDWIG MIES',
    ''
  ],
  [
    '',
    'STAY HUNGRY',
    'STAY FOOLISH',
    '- STEVE JOBS',
    ''
  ],
  [
    '',
    'GOOD DESIGN IS',
    'GOOD BUSINESS',
    '- THOMAS WATSON',
    ''
  ],
  [
    '',
    'LESS IS MORE',
    '',
    '- MIES VAN DER ROHE',
    ''
  ],
  [
    '',
    'MAKE IT SIMPLE',
    'BUT SIGNIFICANT',
    '- DON DRAPER',
    ''
  ],
  [
    '',
    'HAVE NO FEAR OF',
    'PERFECTION',
    '- SALVADOR DALI',
    ''
  ]
];

export const SOFTWARE_QUOTES = [
  { text: 'THERE ARE ONLY TWO HARD THINGS IN COMPUTER SCIENCE: CACHE INVALIDATION AND NAMING THINGS.', author: 'PHIL KARLTON' },
  { text: 'IT WORKS ON MY MACHINE.', author: 'EVERY DEVELOPER EVER' },
  { text: 'MEASURING PROGRAMMING PROGRESS BY LINES OF CODE IS LIKE MEASURING AIRCRAFT BUILDING PROGRESS BY WEIGHT.', author: 'BILL GATES' },
  { text: 'THE BEST THING ABOUT A BOOLEAN IS EVEN IF YOU ARE WRONG, YOU ARE ONLY OFF BY A BIT.', author: 'ANONYMOUS' },
  { text: 'IF DEBUGGING IS THE PROCESS OF REMOVING BUGS, THEN PROGRAMMING MUST BE THE PROCESS OF PUTTING THEM IN.', author: 'E. DIJKSTRA' },
  { text: 'A SQL QUERY WALKS INTO A BAR, WALKS UP TO TWO TABLES, AND ASKS: CAN I JOIN YOU?', author: 'DB JOKE' },
  { text: 'IN ORDER TO UNDERSTAND RECURSION, YOU MUST FIRST UNDERSTAND RECURSION.', author: 'ANONYMOUS' }
];
