/*
  KGB Arcade Engine v0.2 — 8BitOps Arcade Kit
  Small production helper for standard arcade games.
  Keeps the engine dependency-free and easy to read.
*/
(function (global) {
  'use strict';

  const KGB = global.KGB || (global.KGB = {});

  function stopUiEvent(event) {
    if (!event) return;
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
  }

  function oncePer(handler, lockMs = 260) {
    let last = 0;
    return function wrapped(event) {
      stopUiEvent(event);
      const now = performance.now();
      if (now - last < lockMs) return;
      last = now;
      handler(event);
    };
  }

  const ArcadeKit = {
    VERSION: '0.2.0',

    setupStandardShell(game, cfg = {}) {
      document.title = `${cfg.title || game.title} — KGB Arcade`;
      KGB.UI.setText('[data-kgb-game-title]', cfg.title || game.title);
      KGB.UI.setWorldBadge(cfg.world || '8BitOps');
      KGB.UI.wireBackToArcade(cfg.backToArcadeHref || '../../index.html');
      KGB.UI.bindSoundButtons(game.audio);
      game.input.bindVirtualButtons();

      if (KGB.PWA) {
        KGB.PWA.register(cfg.serviceWorker || './service-worker.js');
        KGB.PWA.setupInstallPrompt();
      }

      this.bindSettingsButtons(game);
      this.bindFullscreenButtons();
      this.applyControlHelp(cfg.controlPreset || 'arena');
      KGB.UI.setHud({ best: game.save.getBestScore(cfg.scoreMode || 'default') });
    },

    bindSettingsButtons(game) {
      document.querySelectorAll('[data-kgb-settings-toggle]').forEach((el) => {
        if (el._kgbSettingsBound) return;
        const go = oncePer(() => {
          const current = game.scenes.current;
          if (game.scenes.has('settings')) game.scenes.switch('settings', current);
        });
        ['pointerdown', 'mousedown', 'touchstart'].forEach((eventName) => el.addEventListener(eventName, stopUiEvent, { passive: false }));
        ['pointerup', 'mouseup', 'touchend', 'click'].forEach((eventName) => el.addEventListener(eventName, go, { passive: false }));
        el._kgbSettingsBound = true;
      });
    },

    bindFullscreenButtons() {
      document.querySelectorAll('[data-kgb-fullscreen-toggle]').forEach((el) => {
        if (el._kgbFullscreenBound) return;
        const go = oncePer(() => {
          const root = document.documentElement;
          if (!document.fullscreenElement && root.requestFullscreen) root.requestFullscreen().catch(() => {});
          else if (document.exitFullscreen) document.exitFullscreen().catch(() => {});
        });
        ['pointerdown', 'mousedown', 'touchstart'].forEach((eventName) => el.addEventListener(eventName, stopUiEvent, { passive: false }));
        ['pointerup', 'mouseup', 'touchend', 'click'].forEach((eventName) => el.addEventListener(eventName, go, { passive: false }));
        el._kgbFullscreenBound = true;
      });
    },

    applyControlHelp(preset) {
      const help = document.querySelector('[data-kgb-control-help]');
      if (!help) return;
      const labels = {
        arena: 'Move: WASD/Arrows • Fire: Space/J • Boost: Shift/K • Pause: Esc/P',
        lanes: 'Move lanes: A/D or Arrows • Action: Space/J • Pause: Esc/P',
        tap: 'Tap zones + ACTION button • Pause button available',
        platformer: 'Move: A/D • Jump: W/Space • Action: J • Pause: Esc/P'
      };
      help.textContent = labels[preset] || labels.arena;
    },

    setHud(values = {}) {
      KGB.UI.setHud(values);
    },

    setScore(game, score, mode = 'default') {
      const value = Math.max(0, Math.floor(Number(score) || 0));
      KGB.UI.setHud({ score: value, best: game.save.getBestScore(mode) });
      return value;
    },

    finishScore(game, score, mode = 'default') {
      const result = game.save.setBestScore(score, mode);
      KGB.UI.setHud({ best: result.best });
      return result;
    },

    setLives(lives) {
      KGB.UI.setHud({ lives: '♥'.repeat(Math.max(0, lives)) || '0' });
    },

    setStatus(text) {
      KGB.UI.setHud({ status: text || 'READY' });
    },

    setMeter(name, value) {
      KGB.UI.setMeter(name, value);
    }
  };

  KGB.ArcadeKit = ArcadeKit;
})(window);
