window.KGB_GAME_CONFIG = {
  id: 'kgb-8bitops-template-v0-2',
  title: '8BitOps Production Template',
  world: '8BitOps',
  canvas: '#game',
  assetBase: 'assets/',
  backToArcadeHref: '../../index.html',
  serviceWorker: './service-worker.js',
  controlPreset: 'arena',
  scoreMode: 'default',

  // Template tuning knobs. Future games can keep these here or move to JSON.
  startingLives: 3,
  waveGoal: 18,
  enemyLimit: 8,
  spawnSeconds: 0.8,
  boostDrainPerSecond: 0.55,
  boostRecoverPerSecond: 0.22,

  manifest: {
    images: [
      { key: 'player', src: 'player.svg' },
      { key: 'core', src: 'core.svg' },
      { key: 'bug', src: 'bug.svg' },
      { key: 'shot', src: 'shot.svg' }
    ],
    audio: [],
    json: []
  },

  bindings: {
    action: ['Space', 'Enter', 'KeyJ'],
    boost: ['ShiftLeft', 'ShiftRight', 'KeyK'],
    pause: ['Escape', 'KeyP'],
    mute: ['KeyM']
  }
};
