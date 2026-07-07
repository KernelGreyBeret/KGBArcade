/*
  KGB Arcade Engine v0.1 — Core Runtime
  Owns canvas, managers, capped/fixed loop, pause/resume, scenes, resize, DPR, and safe areas.
*/
(function (global) {
  'use strict';

  const KGB = global.KGB || (global.KGB = {});
  const Utils = KGB.Utils;

  class Game {
    constructor(config = {}) {
      this.config = config;
      this.id = config.id || 'kgb-game';
      this.title = config.title || 'KGB Arcade Game';
      this.canvas = typeof config.canvas === 'string' ? document.querySelector(config.canvas) : (config.canvas || document.querySelector('canvas'));
      if (!this.canvas) throw new Error('KGB.Game requires a canvas element.');

      this.maxDelta = config.maxDelta || 1 / 20;
      this.fixedStep = config.fixedStep || 0;
      this.accumulator = 0;
      this.time = 0;
      this.frame = 0;
      this.running = false;
      this.paused = false;
      this.lastTs = 0;
      this.safeArea = { top: 0, right: 0, bottom: 0, left: 0 };
      this.pausedByVisibility = false;

      this.save = new KGB.SaveManager(this.id);
      this.assets = new KGB.AssetLoader({ basePath: config.assetBase || '', onProgress: config.onAssetProgress });
      this.input = new KGB.InputManager({ target: this.canvas, bindings: config.bindings || {} });
      this.audio = new KGB.AudioManager(this.save, config.audio || {});
      this.renderer = new KGB.Renderer2D(this.canvas, config.renderer || {});
      this.scenes = new KGB.SceneManager(this);

      this.onResize = this.onResize.bind(this);
      this.loop = this.loop.bind(this);
      this.visibilityChanged = this.visibilityChanged.bind(this);
      window.addEventListener('resize', Utils.debounce(this.onResize, 80), { passive: true });
      window.addEventListener('orientationchange', Utils.debounce(this.onResize, 120), { passive: true });
      document.addEventListener('visibilitychange', this.visibilityChanged);
      this.onResize();
    }

    get width() { return this.renderer.width; }
    get height() { return this.renderer.height; }
    get ctx() { return this.renderer.ctx; }

    start(firstScene = 'boot') {
      if (this.running) return;
      this.running = true;
      this.paused = false;
      this.lastTs = performance.now();
      if (firstScene && this.scenes.has(firstScene)) this.scenes.switch(firstScene);
      requestAnimationFrame(this.loop);
    }

    stop() {
      this.running = false;
    }

    pause() {
      this.paused = true;
      document.body.classList.add('kgb-paused');
    }

    resume() {
      this.paused = false;
      this.lastTs = performance.now();
      document.body.classList.remove('kgb-paused');
    }

    togglePause() {
      if (this.paused) this.resume();
      else this.pause();
    }

    visibilityChanged() {
      if (this.config.pauseOnHidden === false) return;
      if (document.hidden) {
        this.pausedByVisibility = !this.paused;
        this.pause();
      } else if (this.pausedByVisibility) {
        this.pausedByVisibility = false;
        this.resume();
      }
    }

    onResize() {
      this.safeArea = Utils.getSafeArea();
      this.renderer.resize(window.innerWidth, window.innerHeight, this.config.maxDpr || 2);
      this.scenes.resize();
    }

    loop(ts) {
      if (!this.running) return;
      let dt = Math.min(this.maxDelta, (ts - this.lastTs) / 1000 || 0);
      this.lastTs = ts;

      if (!this.paused) {
        this.time += dt;
        this.frame += 1;
        this.input.update(dt);

        if (this.fixedStep > 0) {
          this.accumulator += dt;
          while (this.accumulator >= this.fixedStep) {
            this.scenes.update(this.fixedStep);
            this.accumulator -= this.fixedStep;
          }
        } else {
          this.scenes.update(dt);
        }
      }

      this.scenes.render(this.renderer, dt);
      this.input.endFrame();
      requestAnimationFrame(this.loop);
    }
  }

  KGB.Game = Game;
})(window);
