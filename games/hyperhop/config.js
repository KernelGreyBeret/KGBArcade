window.KGB_GAME_CONFIG = {
  id: 'hyperhop-8bitops-v0-2-4',
  title: 'HyperHop',
  subtitle: 'Lane Dodger Arcade Upgrade',
  world: '8BitOps',
  canvas: '#game',
  assetBase: 'assets/',
  backToArcadeHref: '../../index.html',
  serviceWorker: './service-worker.js',
  controlPreset: 'tap',
  scoreMode: 'default',

  // Arcade banger tuning. Difficulty still starts from the selected preset,
  // then ramps during the run based on score/rank.
  startingDifficulty: 'normal',
  // Backdrops are tied to rank progression, not player settings.
  backdropRanks: [
    { rank: 1, mode: 'star', label: 'Starfield' },
    { rank: 3, mode: 'particle', label: 'Particle Rain' },
    { rank: 5, mode: 'matrix', label: 'Matrix Rain' },
    { rank: 7, mode: 'rift', label: 'Rift Grid' },
    { rank: 9, mode: 'storm', label: 'Neon Storm' }
  ],
  lanes: 3,
  patternSeed: 7331,
  rankEvery: 12,
  // Combo rewards are based on clean pickups in a row without touching a hazard.
  heartComboEvery: 30,
  comboShieldEvery: 10,
  comboBonusEvery: 15,
  maxLives: 5,
  shieldMaxSeconds: 5.0,
  warpCooldownSeconds: 5.0,
  warpInvulnSeconds: 0.75,
  warpClearRadius: 190,

  difficulties: {
    super:  { label: 'Recruit',    lives: 5, fall: 420, spawn: 0.95, core: 0.58, shield: 0.28, hazard: 0.14, hazardRadius: 21, coreRadius: 32, shipSlide: 7.0, shieldSeconds: 6.5 },
    easy:   { label: 'Patrol',     lives: 4, fall: 610, spawn: 0.78, core: 0.55, shield: 0.22, hazard: 0.23, hazardRadius: 24, coreRadius: 30, shipSlide: 8.5, shieldSeconds: 5.5 },
    normal: { label: 'Operator',   lives: 3, fall: 850, spawn: 0.56, core: 0.54, shield: 0.16, hazard: 0.30, hazardRadius: 29, coreRadius: 27, shipSlide: 11,  shieldSeconds: 4.5 },
    hard:   { label: 'Black Run',  lives: 3, fall: 1080, spawn: 0.44, core: 0.51, shield: 0.12, hazard: 0.37, hazardRadius: 32, coreRadius: 25, shipSlide: 13,  shieldSeconds: 3.8 },
    insane: { label: 'Nightmare',  lives: 2, fall: 1320, spawn: 0.34, core: 0.47, shield: 0.09, hazard: 0.44, hazardRadius: 35, coreRadius: 23, shipSlide: 15,  shieldSeconds: 3.0 }
  },


  // Repeatable spawn tracks. Same difficulty = same obstacle/bonus order every run, so players can learn the route.
  patternTracks: {
    super: [
      ['core',1], ['core',0], ['shield',2], ['core',1], ['hazard',0], ['core',2], ['core',1], ['hazard',2], ['shield',1], ['core',0], ['core',2], ['hazard',1]
    ],
    easy: [
      ['core',1], ['hazard',0], ['core',2], ['shield',1], ['core',0], ['hazard',2], ['core',1], ['core',2], ['hazard',1], ['shield',0], ['core',2], ['hazard',0], ['core',1], ['hazard',2]
    ],
    normal: [
      ['core',1], ['hazard',0], ['core',2], ['hazard',1], ['shield',2], ['core',0], ['hazard',2], ['core',1], ['core',0], ['hazard',1], ['shield',0], ['hazard',2], ['core',1], ['hazard',0], ['core',2], ['hazard',1]
    ],
    hard: [
      ['core',1], ['hazard',0], ['hazard',2], ['core',1], ['shield',0], ['hazard',1], ['core',2], ['hazard',0], ['hazard',1], ['core',0], ['shield',2], ['hazard',2], ['core',1], ['hazard',0], ['hazard',2], ['core',0]
    ],
    insane: [
      ['core',1], ['hazard',0], ['hazard',2], ['core',0], ['hazard',1], ['shield',2], ['hazard',0], ['core',2], ['hazard',1], ['hazard',2], ['core',0], ['hazard',1], ['shield',1], ['hazard',2], ['core',1], ['hazard',0]
    ]
  },

  manifest: { images: [], audio: [], json: [] },

  bindings: {
    left: ['ArrowLeft', 'KeyA'],
    right: ['ArrowRight', 'KeyD'],
    action: ['Space', 'Enter', 'KeyJ'],
    boost: ['ShiftLeft', 'ShiftRight', 'KeyK'],
    pause: ['Escape', 'KeyP'],
    mute: ['KeyM']
  }
};
