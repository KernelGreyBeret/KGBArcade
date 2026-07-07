/*
  8BitOps Production Template — KGB Arcade Engine v0.2
  Demo game: Neon Sweep
  Purpose: production shell pattern for regular KGB Arcade bangers.
*/
(function () {
  'use strict';

  const cfg = window.KGB_GAME_CONFIG;
  const U = KGB.Utils;
  const game = new KGB.Game(cfg);
  KGB.ArcadeKit.setupStandardShell(game, cfg);

  class BootScene extends KGB.Scene {
    constructor(game) {
      super(game);
      this.progress = 0;
      this.message = 'Booting 8BitOps runtime...';
    }

    onEnter() {
      this.game.assets.onProgress = (p) => {
        this.progress = p.ratio;
        this.message = p.current ? `Loading ${p.current}...` : 'Loading assets...';
      };
      this.game.assets.loadManifest(cfg.manifest).then(() => this.game.scenes.switch('title'));
    }

    render(r) {
      r.clear('#05070c');
      drawOpsBackdrop(r, 0);
      r.text('KGB Arcade Engine v0.2', r.width / 2, r.height * 0.34, {
        align: 'center', baseline: 'middle', font: '950 30px system-ui', fill: '#00FF9A', stroke: '#000', strokeWidth: 6
      });
      r.text(this.message, r.width / 2, r.height * 0.47, {
        align: 'center', baseline: 'middle', font: '850 16px system-ui', fill: '#b7c0cc'
      });
      r.meter(r.width * 0.25, r.height * 0.56, r.width * 0.5, 18, this.progress, { fill: '#00FF9A' });
    }
  }

  class TitleScene extends KGB.Scene {
    onEnter() {
      KGB.ArcadeKit.setStatus('TITLE');
      KGB.ArcadeKit.setLives(cfg.startingLives);
      KGB.ArcadeKit.setMeter('boost', 1);
    }

    update() {
      if (this.game.input.wasPressed('action') || this.game.input.pointer.tap) {
        this.game.audio.unlock();
        this.game.scenes.switch('play');
      }
      if (this.game.input.wasPressed('pause')) this.game.scenes.switch('settings', this);
      if (this.game.input.wasPressed('mute')) {
        this.game.audio.toggleSound();
        KGB.UI.updateSoundButton(this.game.audio);
      }
    }

    render(r) {
      r.clear('#060913');
      drawOpsBackdrop(r, this.game.time * 30);
      r.text('8BITOPS', r.width / 2, r.height * 0.24, {
        align: 'center', baseline: 'middle', font: `950 ${Math.max(38, r.width * 0.085)}px system-ui`, fill: '#00FF9A', stroke: '#000', strokeWidth: 9, shadow: '#00FF9A', shadowBlur: 18
      });
      r.text('PRODUCTION TEMPLATE', r.width / 2, r.height * 0.36, {
        align: 'center', baseline: 'middle', font: '950 25px system-ui', fill: '#fff', stroke: '#000', strokeWidth: 6
      });
      r.text('Neon Sweep demo: collect cores, blast bugs, survive the wave.', r.width / 2, r.height * 0.46, {
        align: 'center', baseline: 'middle', font: '850 17px system-ui', fill: '#b7c0cc', stroke: '#000', strokeWidth: 4
      });
      r.text('ACTION / Tap to deploy • Settings button or P/Esc for options', r.width / 2, r.height * 0.58, {
        align: 'center', baseline: 'middle', font: '950 20px system-ui', fill: '#28D7FF', stroke: '#000', strokeWidth: 6
      });
      r.text(`Best: ${this.game.save.getBestScore(cfg.scoreMode)}`, r.width / 2, r.height * 0.70, {
        align: 'center', baseline: 'middle', font: '900 19px system-ui', fill: '#FFD94D', stroke: '#000', strokeWidth: 4
      });
    }
  }

  class SettingsScene extends KGB.Scene {
    onEnter(previousScene) {
      this.previousScene = previousScene;
      this.cursor = 0;
      KGB.ArcadeKit.setStatus('SETTINGS');
      this.options = ['Toggle Sound', 'Clear Best Score', 'Back'];
    }

    update() {
      if (this.game.input.wasPressed('up')) this.cursor = U.wrap(this.cursor - 1, 0, this.options.length);
      if (this.game.input.wasPressed('down')) this.cursor = U.wrap(this.cursor + 1, 0, this.options.length);
      if (this.game.input.wasPressed('pause')) this.goBack();
      if (this.game.input.wasPressed('action') || this.game.input.pointer.tap) this.activate();
    }

    activate() {
      const choice = this.options[this.cursor];
      if (choice === 'Toggle Sound') {
        this.game.audio.toggleSound();
        KGB.UI.updateSoundButton(this.game.audio);
        KGB.UI.toast(this.game.audio.soundOn ? 'Sound on' : 'Sound off');
      } else if (choice === 'Clear Best Score') {
        this.game.save.remove('bestScores');
        KGB.UI.setHud({ best: 0 });
        KGB.UI.toast('Best score cleared');
      } else this.goBack();
    }

    goBack() {
      if (this.previousScene) {
        this.game.scenes.current = this.previousScene;
        this.game.scenes.currentName = this.previousScene instanceof PlayScene ? 'play' : 'title';
        KGB.ArcadeKit.setStatus(this.game.scenes.currentName === 'play' ? 'LIVE' : 'TITLE');
      } else this.game.scenes.switch('title');
    }

    render(r) {
      if (this.previousScene) this.previousScene.render(r, 0);
      else { r.clear('#060913'); drawOpsBackdrop(r, 0); }
      r.rect(0, 0, r.width, r.height, 'rgba(0,0,0,.66)');
      const w = Math.min(560, r.width * 0.88);
      const h = 285;
      const x = r.width / 2 - w / 2;
      const y = r.height / 2 - h / 2;
      r.panel(x, y, w, h, { fill: 'rgba(7,12,22,.92)', stroke: 'rgba(0,255,154,.5)' });
      r.text('SETTINGS', r.width / 2, y + 48, { align: 'center', baseline: 'middle', font: '950 36px system-ui', fill: '#FFD94D', stroke: '#000', strokeWidth: 5 });
      this.options.forEach((option, i) => {
        const selected = i === this.cursor;
        r.text(`${selected ? '▶ ' : '  '}${option}`, r.width / 2, y + 112 + i * 42, {
          align: 'center', baseline: 'middle', font: '900 20px system-ui', fill: selected ? '#00FF9A' : '#fff', stroke: '#000', strokeWidth: 4
        });
      });
      r.text('Up/Down + ACTION • P/Esc to return', r.width / 2, y + h - 34, { align: 'center', baseline: 'middle', font: '800 14px system-ui', fill: '#b7c0cc' });
    }
  }

  class PlayScene extends KGB.Scene {
    onEnter() {
      this.player = { x: this.game.width / 2, y: this.game.height * 0.72, r: 24, speed: 300, invuln: 0 };
      this.shots = [];
      this.cores = [];
      this.bugs = [];
      this.particles = [];
      this.score = 0;
      this.lives = cfg.startingLives;
      this.wave = 1;
      this.collected = 0;
      this.spawnT = 0;
      this.coreT = 0.25;
      this.fireT = 0;
      this.boost = 1;
      this.time = 0;
      KGB.ArcadeKit.setScore(this.game, this.score, cfg.scoreMode);
      KGB.ArcadeKit.setLives(this.lives);
      KGB.ArcadeKit.setStatus('LIVE');
      KGB.ArcadeKit.setMeter('boost', this.boost);
      KGB.UI.toast('8BitOps template online');
    }

    spawnCore() {
      this.cores.push({ x: U.rand(50, this.game.width - 50), y: -30, r: 18, vy: U.rand(80, 150), spin: U.rand(0, U.TAU) });
    }

    spawnBug() {
      const side = U.pick([-1, 1]);
      this.bugs.push({ x: side < 0 ? -40 : this.game.width + 40, y: U.rand(110, this.game.height * 0.60), r: 23, vx: side * -U.rand(95, 165), vy: U.rand(-25, 50), hp: 1 });
    }

    fire() {
      if (this.fireT > 0) return;
      this.fireT = 0.12;
      this.shots.push({ x: this.player.x, y: this.player.y - 26, r: 7, vy: -650 });
      this.game.audio.tone(880, 0.055, 'square', 0.14);
    }

    burst(x, y, color = '#00FF9A', count = 10) {
      for (let i = 0; i < count; i += 1) {
        const a = U.rand(0, U.TAU);
        const s = U.rand(80, 240);
        this.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0, max: U.rand(0.28, 0.75), color, r: U.rand(2, 4) });
      }
      if (this.particles.length > 160) this.particles.splice(0, this.particles.length - 160);
    }

    hitPlayer() {
      if (this.player.invuln > 0) return;
      this.lives -= 1;
      this.player.invuln = 1.0;
      this.game.renderer.shake(10, 0.18);
      this.game.audio.noise(0.16, 0.16);
      this.burst(this.player.x, this.player.y, '#ff4d6d', 18);
      KGB.ArcadeKit.setLives(this.lives);
      if (this.lives <= 0) this.game.scenes.switch('gameover', { score: this.score });
    }

    update(dt) {
      if (this.game.input.wasPressed('pause')) { this.game.scenes.switch('pause', this); return; }
      if (this.game.input.wasPressed('mute')) { this.game.audio.toggleSound(); KGB.UI.updateSoundButton(this.game.audio); }
      if (this.game.input.isDown('action') || this.game.input.wasPressed('action')) this.fire();

      const ix = this.game.input.axis('left', 'right');
      const iy = this.game.input.axis('up', 'down');
      const mag = Math.hypot(ix, iy) || 1;
      const boosting = this.game.input.isDown('boost') && this.boost > 0;
      const speed = this.player.speed * (boosting ? 1.75 : 1);
      if (boosting) this.boost = Math.max(0, this.boost - cfg.boostDrainPerSecond * dt);
      else this.boost = Math.min(1, this.boost + cfg.boostRecoverPerSecond * dt);
      KGB.ArcadeKit.setMeter('boost', this.boost);

      this.player.x += (ix / mag) * speed * dt;
      this.player.y += (iy / mag) * speed * dt;
      this.player.x = U.clamp(this.player.x, this.player.r, this.game.width - this.player.r);
      this.player.y = U.clamp(this.player.y, 100, this.game.height - this.player.r - 92);
      this.player.invuln = Math.max(0, this.player.invuln - dt);
      this.fireT = Math.max(0, this.fireT - dt);
      this.time += dt;

      this.spawnT += dt;
      this.coreT += dt;
      if (this.spawnT >= Math.max(0.28, cfg.spawnSeconds - this.wave * 0.04) && this.bugs.length < cfg.enemyLimit + this.wave) {
        this.spawnT = 0;
        this.spawnBug();
      }
      if (this.coreT >= Math.max(0.45, 1.1 - this.wave * 0.03)) {
        this.coreT = 0;
        this.spawnCore();
      }

      for (let i = this.shots.length - 1; i >= 0; i -= 1) {
        const s = this.shots[i];
        s.y += s.vy * dt;
        if (s.y < -40) this.shots.splice(i, 1);
      }
      for (let i = this.cores.length - 1; i >= 0; i -= 1) {
        const c = this.cores[i];
        c.y += c.vy * dt;
        c.spin += dt * 4;
        if (c.y > this.game.height + 40) this.cores.splice(i, 1);
      }
      for (let i = this.bugs.length - 1; i >= 0; i -= 1) {
        const b = this.bugs[i];
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.vy += Math.sin(this.time * 2 + i) * 8 * dt;
        if (b.x < -80 || b.x > this.game.width + 80) this.bugs.splice(i, 1);
      }
      for (let i = this.particles.length - 1; i >= 0; i -= 1) {
        const p = this.particles[i];
        p.life += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 1 - 2.8 * dt;
        p.vy *= 1 - 2.8 * dt;
        if (p.life >= p.max) this.particles.splice(i, 1);
      }

      // shots vs bugs
      for (let i = this.bugs.length - 1; i >= 0; i -= 1) {
        const b = this.bugs[i];
        let killed = false;
        for (let j = this.shots.length - 1; j >= 0; j -= 1) {
          const s = this.shots[j];
          if (U.circleHit(s.x, s.y, s.r, b.x, b.y, b.r)) {
            this.shots.splice(j, 1);
            this.bugs.splice(i, 1);
            this.score += 2;
            this.burst(b.x, b.y, '#28D7FF', 13);
            this.game.audio.noise(0.08, 0.09);
            KGB.ArcadeKit.setScore(this.game, this.score, cfg.scoreMode);
            killed = true;
            break;
          }
        }
        if (killed) continue;
      }

      // player collisions
      for (let i = this.cores.length - 1; i >= 0; i -= 1) {
        const c = this.cores[i];
        if (U.circleHit(this.player.x, this.player.y, this.player.r, c.x, c.y, c.r)) {
          this.cores.splice(i, 1);
          this.score += 1;
          this.collected += 1;
          this.burst(c.x, c.y, '#00FF9A', 10);
          this.game.audio.tone(620 + this.collected * 10, 0.075, 'triangle', 0.16);
          KGB.ArcadeKit.setScore(this.game, this.score, cfg.scoreMode);
          KGB.ArcadeKit.setStatus(`${this.collected}/${cfg.waveGoal}`);
          if (this.collected >= cfg.waveGoal) this.game.scenes.switch('complete', { score: this.score, wave: this.wave });
        }
      }
      for (let i = this.bugs.length - 1; i >= 0; i -= 1) {
        const b = this.bugs[i];
        if (U.circleHit(this.player.x, this.player.y, this.player.r, b.x, b.y, b.r)) {
          this.bugs.splice(i, 1);
          this.hitPlayer();
        }
      }
    }

    render(r, dt) {
      r.clear('#05070c');
      drawOpsBackdrop(r, this.time * 90);
      r.beginWorld(dt);
      this.cores.forEach((c) => r.image(this.game.assets.image('core'), c.x - 21, c.y - 21, 42, 42, { rotation: c.spin }));
      this.bugs.forEach((b) => r.image(this.game.assets.image('bug'), b.x - 25, b.y - 25, 50, 50, { flipX: b.vx > 0 }));
      this.shots.forEach((s) => r.image(this.game.assets.image('shot'), s.x - 8, s.y - 14, 16, 28));
      const blink = this.player.invuln > 0 && Math.floor(this.time * 16) % 2 === 0;
      if (!blink) r.image(this.game.assets.image('player'), this.player.x - 30, this.player.y - 30, 60, 60);
      this.particles.forEach((p) => {
        const a = 1 - p.life / p.max;
        r.circle(p.x, p.y, p.r * a, p.color, { alpha: a });
      });
      r.endWorld();

      r.meter(r.width / 2 - 120, r.height - 84, 240, 14, this.boost, { fill: '#28D7FF' });
      r.text('BOOST', r.width / 2, r.height - 100, { align: 'center', baseline: 'middle', font: '800 12px system-ui', fill: '#b7c0cc' });
    }
  }

  class PauseScene extends KGB.Scene {
    onEnter(previousScene) { this.previousScene = previousScene; KGB.ArcadeKit.setStatus('PAUSED'); }
    update() {
      if (this.game.input.wasPressed('pause') || this.game.input.wasPressed('action')) {
        this.game.scenes.current = this.previousScene;
        this.game.scenes.currentName = 'play';
        KGB.ArcadeKit.setStatus('LIVE');
      }
    }
    render(r) {
      if (this.previousScene) this.previousScene.render(r, 0);
      r.rect(0, 0, r.width, r.height, 'rgba(0,0,0,.58)');
      r.panel(r.width / 2 - 190, r.height / 2 - 95, 380, 190);
      r.text('PAUSED', r.width / 2, r.height / 2 - 34, { align: 'center', baseline: 'middle', font: '950 40px system-ui', fill: '#FFD94D', stroke: '#000', strokeWidth: 5 });
      r.text('ACTION or P/Esc to resume', r.width / 2, r.height / 2 + 22, { align: 'center', baseline: 'middle', font: '850 16px system-ui', fill: '#fff' });
    }
  }

  class CompleteScene extends KGB.Scene {
    onEnter(data) {
      this.score = data?.score || 0;
      this.wave = data?.wave || 1;
      this.result = KGB.ArcadeKit.finishScore(this.game, this.score, cfg.scoreMode);
      KGB.ArcadeKit.setStatus('CLEAR');
      this.game.audio.tone(660, 0.1, 'triangle', 0.18);
      setTimeout(() => this.game.audio.tone(880, 0.1, 'triangle', 0.18), 110);
      setTimeout(() => this.game.audio.tone(1120, 0.16, 'triangle', 0.18), 220);
    }
    update() {
      if (this.game.input.wasPressed('action') || this.game.input.pointer.tap) this.game.scenes.switch('play');
      if (this.game.input.wasPressed('pause')) this.game.scenes.switch('title');
    }
    render(r) {
      r.clear('#061018');
      drawOpsBackdrop(r, 160);
      r.text('WAVE COMPLETE', r.width / 2, r.height * 0.34, { align: 'center', baseline: 'middle', font: '950 46px system-ui', fill: '#00FF9A', stroke: '#000', strokeWidth: 7 });
      r.text(`Score: ${this.score}${this.result.improved ? ' — NEW BEST!' : ''}`, r.width / 2, r.height * 0.47, { align: 'center', baseline: 'middle', font: '900 24px system-ui', fill: '#fff', stroke: '#000', strokeWidth: 4 });
      r.text('ACTION to run again • P/Esc for title', r.width / 2, r.height * 0.61, { align: 'center', baseline: 'middle', font: '800 17px system-ui', fill: '#b7c0cc' });
    }
  }

  class GameOverScene extends KGB.Scene {
    onEnter(data) {
      this.score = data?.score || 0;
      this.result = KGB.ArcadeKit.finishScore(this.game, this.score, cfg.scoreMode);
      KGB.ArcadeKit.setStatus('GAME OVER');
      this.game.audio.noise(0.28, 0.18);
    }
    update() {
      if (this.game.input.wasPressed('action') || this.game.input.pointer.tap) this.game.scenes.switch('play');
      if (this.game.input.wasPressed('pause')) this.game.scenes.switch('title');
    }
    render(r) {
      r.clear('#09060a');
      drawOpsBackdrop(r, 80);
      r.text('GAME OVER', r.width / 2, r.height * 0.34, { align: 'center', baseline: 'middle', font: '950 50px system-ui', fill: '#ff4d6d', stroke: '#000', strokeWidth: 8 });
      r.text(`Score: ${this.score}${this.result.improved ? ' — NEW BEST!' : ''}`, r.width / 2, r.height * 0.48, { align: 'center', baseline: 'middle', font: '900 24px system-ui', fill: '#fff', stroke: '#000', strokeWidth: 4 });
      r.text('ACTION to retry • P/Esc for title', r.width / 2, r.height * 0.62, { align: 'center', baseline: 'middle', font: '800 17px system-ui', fill: '#b7c0cc' });
    }
  }

  function drawOpsBackdrop(r, offset) {
    const step = 52;
    const ctx = r.ctx;
    ctx.save();
    for (let y = -step + (offset % step); y < r.height + step; y += step) {
      r.line(0, y, r.width, y, 'rgba(0,255,154,.07)', 1);
    }
    for (let x = -step + ((offset * 0.6) % step); x < r.width + step; x += step) {
      r.line(x, 0, x, r.height, 'rgba(40,215,255,.06)', 1);
    }
    r.circle(r.width * 0.18, r.height * 0.18, 90, 'rgba(40,215,255,.045)');
    r.circle(r.width * 0.82, r.height * 0.72, 120, 'rgba(0,255,154,.04)');
    ctx.restore();
  }

  game.scenes.add('boot', BootScene);
  game.scenes.add('title', TitleScene);
  game.scenes.add('settings', SettingsScene);
  game.scenes.add('play', PlayScene);
  game.scenes.add('pause', PauseScene);
  game.scenes.add('complete', CompleteScene);
  game.scenes.add('gameover', GameOverScene);
  game.start('boot');
})();
