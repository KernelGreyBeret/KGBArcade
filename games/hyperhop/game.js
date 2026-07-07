/*
  HyperHop — KGB Arcade Engine v0.2 8BitOps upgrade
  Original legacy concept preserved: lane-dodger survival, collect green, avoid red, blue shield.
  Upgrade focus: standardized shell, repeatable arcade run, progressive ranks, shield clarity, clean-combo heart recovery,
  visual FX, audio cues, pause/settings/gameover flow, PWA-ready folder.
*/
(function () {
  'use strict';

  const cfg = window.KGB_GAME_CONFIG;
  const U = KGB.Utils;
  const game = new KGB.Game(cfg);
  KGB.ArcadeKit.setupStandardShell(game, cfg);

  const COLORS = {
    bg: '#020408',
    green: '#78ffa0',
    red: '#ff5a5a',
    blue: '#52d1ff',
    cyan: '#28D7FF',
    yellow: '#ffe678',
    amber: '#FFAE42',
    magenta: '#ff4df5',
    dim: '#1e314a',
    ink: '#f5f7fb',
    muted: '#b7c0cc'
  };

  function setPausedChrome(isPaused) {
    document.body.classList.toggle('kgb-shell-paused', !!isPaused);
  }

  function setting(name, fallback) {
    return game.save.getSetting(name, fallback);
  }

  function saveSetting(name, value) {
    game.save.setSetting(name, value);
  }

  function difficultyKeys() { return Object.keys(cfg.difficulties); }
  function difficultyLabel(key) { return cfg.difficulties[key]?.label || key; }

  class BootScene extends KGB.Scene {
    constructor(game) {
      super(game);
      this.progress = 0;
      this.message = 'Booting HyperHop...';
    }

    onEnter() {
      setPausedChrome(false);
      this.game.assets.onProgress = (p) => {
        this.progress = p.ratio;
        this.message = p.current ? `Loading ${p.current}...` : 'Loading runtime...';
      };
      this.game.assets.loadManifest(cfg.manifest).then(() => this.game.scenes.switch('title'));
    }

    render(r) {
      r.clear(COLORS.bg);
      drawStarfieldPreview(r, this.game.time, 0.75);
      r.text('HYPERHOP', r.width / 2, r.height * 0.34, {
        align: 'center', baseline: 'middle', font: `950 ${Math.max(40, r.width * 0.08)}px system-ui`,
        fill: COLORS.yellow, stroke: '#000', strokeWidth: 9, shadow: COLORS.cyan, shadowBlur: 18
      });
      r.text(this.message, r.width / 2, r.height * 0.48, {
        align: 'center', baseline: 'middle', font: '850 16px system-ui', fill: COLORS.muted
      });
      r.meter(r.width * 0.25, r.height * 0.58, r.width * 0.5, 18, this.progress, { fill: COLORS.cyan });
    }
  }

  class TitleScene extends KGB.Scene {
    onEnter() {
      setPausedChrome(false);
      this.pulse = 0;
      KGB.ArcadeKit.setStatus('READY');
      KGB.ArcadeKit.setLives(cfg.difficulties[setting('difficulty', cfg.startingDifficulty)]?.lives || 3);
      KGB.ArcadeKit.setMeter('shield', 0);
      KGB.UI.setHud({ score: 0, best: this.game.save.getBestScore(cfg.scoreMode) });

    }

    update(dt) {
      this.pulse += dt;
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
      r.clear(COLORS.bg);
      drawDynamicBackdrop(r, this.pulse, 'star', 1);
      drawLogoTitle(r, r.height * 0.25);
      r.text('LANE DODGER ARCADE UPGRADE', r.width / 2, r.height * 0.38, {
        align: 'center', baseline: 'middle', font: '950 22px system-ui', fill: COLORS.cyan, stroke: '#000', strokeWidth: 5
      });
      const diff = setting('difficulty', cfg.startingDifficulty);
      drawWrappedText(r, 'Move across three lanes. Grab green cores. Dodge red threats. Blue shields save hearts. Clean streaks restore lost hearts.', r.width / 2, r.height * 0.47, Math.min(720, r.width * 0.86), 22, {
        align: 'center', baseline: 'middle', font: `850 ${r.width < 520 ? 14 : 17}px system-ui`, fill: COLORS.ink, stroke: '#000', strokeWidth: 4
      });
      r.text(`Difficulty: ${difficultyLabel(diff)} • Backdrops evolve with rank`, r.width / 2, r.height * 0.57, {
        align: 'center', baseline: 'middle', font: '850 15px system-ui', fill: COLORS.muted, stroke: '#000', strokeWidth: 3
      });
      drawWrappedText(r, 'Press Start / Space to deploy • Arrow buttons move lanes • Clean combo 30 restores a heart', r.width / 2, r.height * 0.67, Math.min(720, r.width * 0.86), 24, {
        align: 'center', baseline: 'middle', font: `950 ${r.width < 520 ? 16 : 20}px system-ui`, fill: COLORS.green, stroke: '#000', strokeWidth: 6
      });
      r.text(`Best: ${this.game.save.getBestScore(cfg.scoreMode)}`, r.width / 2, r.height * 0.78, {
        align: 'center', baseline: 'middle', font: '900 19px system-ui', fill: COLORS.yellow, stroke: '#000', strokeWidth: 4
      });
    }
  }

  class SettingsScene extends KGB.Scene {
    onEnter(previousScene) {
      setPausedChrome(true);
      this.previousScene = previousScene;
      this.cursor = 0;
      this.hitboxes = [];
      this.options = ['Difficulty', 'Toggle Sound', 'Clear Best Score', 'Back'];
      KGB.ArcadeKit.setStatus('SETTINGS');
    }

    update() {
      if (this.game.input.wasPressed('up') || this.game.input.pointer.swipe === 'up') this.cursor = U.wrap(this.cursor - 1, 0, this.options.length);
      if (this.game.input.wasPressed('down') || this.game.input.pointer.swipe === 'down') this.cursor = U.wrap(this.cursor + 1, 0, this.options.length);
      if (this.game.input.wasPressed('left') || this.game.input.pointer.swipe === 'left') this.adjust(-1);
      if (this.game.input.wasPressed('right') || this.game.input.pointer.swipe === 'right') this.adjust(1);
      if (this.game.input.wasPressed('pause')) this.goBack();
      if (this.game.input.pointer.tap) {
        this.handlePointerTap(this.game.input.pointer.x, this.game.input.pointer.y);
        return;
      }
      if (this.game.input.wasPressed('action')) this.activate();
    }

    handlePointerTap(x, y) {
      const hit = (this.hitboxes || []).find((box) => x >= box.x && x <= box.x + box.w && y >= box.y && y <= box.y + box.h);
      if (!hit) return;
      this.cursor = hit.index;
      this.activate();
    }

    adjust(dir) {
      const choice = this.options[this.cursor];
      if (choice === 'Difficulty') cycleDifficulty(dir);
    }

    activate() {
      const choice = this.options[this.cursor];
      if (choice === 'Difficulty') cycleDifficulty(1);
      else if (choice === 'Toggle Sound') {
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
        if (this.previousScene instanceof PlayScene) this.game.scenes.currentName = 'play';
        else if (this.previousScene instanceof PauseScene) this.game.scenes.currentName = 'pause';
        else this.game.scenes.currentName = 'title';
        if (this.game.scenes.currentName === 'play') {
          setPausedChrome(false);
          if (this.previousScene.updateStatus) this.previousScene.updateStatus(); else KGB.ArcadeKit.setStatus('LIVE');
        } else if (this.game.scenes.currentName === 'pause') {
          setPausedChrome(true);
          KGB.ArcadeKit.setStatus('PAUSED');
        } else {
          setPausedChrome(false);
          KGB.ArcadeKit.setStatus('READY');
        }
      } else this.game.scenes.switch('title');
    }

    render(r) {
      if (this.previousScene) this.previousScene.render(r, 0);
      else { r.clear(COLORS.bg); drawDynamicBackdrop(r, this.game.time, 'star', 0.7); }
      r.rect(0, 0, r.width, r.height, 'rgba(0,0,0,.68)');
      const w = Math.min(620, r.width * 0.94);
      const h = Math.min(370, r.height * 0.82);
      const x = r.width / 2 - w / 2;
      const y = r.height / 2 - h / 2;
      r.panel(x, y, w, h, { fill: 'rgba(7,12,22,.94)', stroke: 'rgba(40,215,255,.5)' });
      r.text('HYPERHOP SETTINGS', r.width / 2, y + 42, {
        align: 'center', baseline: 'middle', font: `950 ${r.width < 520 ? 26 : 34}px system-ui`, fill: COLORS.yellow, stroke: '#000', strokeWidth: 5
      });
      const diff = difficultyLabel(setting('difficulty', cfg.startingDifficulty));
      const nextBg = getNextBackdropInfo(1);
      this.hitboxes = [];
      const rowStart = y + (r.width < 520 ? 96 : 108);
      const rowGap = r.width < 520 ? 38 : 40;
      const rowH = 34;
      this.options.forEach((option, i) => {
        const selected = i === this.cursor;
        let text = option;
        if (option === 'Difficulty') text = `Difficulty: ${diff}`;
        if (option === 'Toggle Sound') text = `Sound: ${this.game.audio.soundOn ? 'On' : 'Off'}`;
        const rowY = rowStart + i * rowGap;
        this.hitboxes.push({ index: i, x: x + 22, y: rowY - rowH / 2, w: w - 44, h: rowH });
        if (selected) r.rect(x + 24, rowY - rowH / 2, w - 48, rowH, 'rgba(0,255,154,.10)');
        r.text(`${selected ? '▶ ' : '  '}${text}`, r.width / 2, rowY, {
          align: 'center', baseline: 'middle', font: `900 ${r.width < 520 ? 17 : 20}px system-ui`, fill: selected ? COLORS.green : '#fff', stroke: '#000', strokeWidth: 4
        });
      });
      r.text(`Tap a row • Swipe up/down • Next backdrop: ${nextBg.label} at R${nextBg.rank}`, r.width / 2, y + h - 28, {
        align: 'center', baseline: 'middle', font: `800 ${r.width < 520 ? 11 : 13}px system-ui`, fill: COLORS.muted
      });
    }
  }

  class PlayScene extends KGB.Scene {
    onEnter() {
      setPausedChrome(false);
      this.diffKey = setting('difficulty', cfg.startingDifficulty);
      this.bgMode = getBackdropForRank(1).mode;
      this.bgLabel = getBackdropForRank(1).label;
      this.diff = cfg.difficulties[this.diffKey] || cfg.difficulties.normal;
      this.laneCount = Math.max(2, cfg.lanes || 3);
      this.lane = Math.floor(this.laneCount / 2);
      this.targetLane = this.lane;
      this.shipX = this.laneX(this.lane);
      this.targetX = this.shipX;
      this.shipY = this.game.height * 0.78;
      this.shipR = 26;
      this.score = 0;
      this.rank = 1;
      this.combo = 0;
      this.bestCombo = 0;
      this.nextHeartCombo = cfg.heartComboEvery;
      this.lives = Math.min(cfg.maxLives, this.diff.lives);
      this.objects = [];
      this.stars = [];
      this.matrixCols = [];
      this.particles = [];
      this.popups = [];
      this.trails = [];
      this.spawnT = 0;
      this.patternIndex = 0;
      this.rng = seededRng((cfg.patternSeed || 7331) + hashString(this.diffKey));
      this.invuln = 0;
      this.shield = 0;
      this.flash = 0;
      this.warpCooldown = 0;
      this.survivalTime = 0;
      this.lastRankAnnounced = 1;
      this.initBackdrop();
      KGB.ArcadeKit.setScore(this.game, this.score, cfg.scoreMode);
      KGB.ArcadeKit.setLives(this.lives);
      this.updateStatus();
      KGB.ArcadeKit.setMeter('shield', 0);
      KGB.UI.toast('HyperHop online');
      this.pop('THREE-LANE RUN', this.game.width / 2, this.game.height * 0.52, COLORS.cyan, 1.0);
    }

    laneX(laneIndex) {
      const lanes = this.laneCount || Math.max(2, cfg.lanes || 3);
      const safeWidth = Math.min(this.game.width * 0.74, this.game.height * 0.62);
      const step = lanes <= 1 ? 0 : safeWidth / (lanes - 1);
      return this.game.width / 2 + (laneIndex - (lanes - 1) / 2) * step;
    }

    laneXs() {
      const lanes = this.laneCount || Math.max(2, cfg.lanes || 3);
      return Array.from({ length: lanes }, (_, i) => this.laneX(i));
    }

    initBackdrop() {
      this.stars.length = 0;
      for (let i = 0; i < 180; i += 1) this.stars.push(makeStar(this.game.width, this.game.height, true));
      this.matrixCols.length = 0;
      const colW = 18;
      const cols = Math.ceil(this.game.width / colW) + 1;
      for (let i = 0; i < cols; i += 1) this.matrixCols.push({ x: i * colW, y: U.rand(-this.game.height, 0), speed: U.rand(70, 160), glyph: randomGlyph() });
    }

    onResize() {
      this.shipY = this.game.height * 0.78;
      this.laneCount = Math.max(2, cfg.lanes || 3);
      this.lane = U.clamp(this.lane, 0, this.laneCount - 1);
      this.targetX = this.laneX(this.lane);
      this.shipX = U.clamp(this.shipX || this.targetX, 0, this.game.width);
      this.initBackdrop();
    }

    currentFall() {
      return this.diff.fall * (1 + (this.rank - 1) * 0.13) + this.survivalTime * 3.2;
    }

    currentSpawn() {
      return Math.max(0.22, this.diff.spawn - (this.rank - 1) * 0.026 - this.survivalTime * 0.0018);
    }

    setLane(laneIndex, useWarp = false) {
      const next = U.clamp(Math.round(laneIndex), 0, this.laneCount - 1);
      if (this.lane === next && !useWarp) return;
      this.lane = next;
      this.targetX = this.laneX(next);
      this.burst(this.shipX, this.shipY, useWarp ? COLORS.magenta : COLORS.cyan, useWarp ? 18 : 8);
      this.game.audio.tone(useWarp ? 740 : 520, 0.055, 'triangle', useWarp ? 0.18 : 0.10);
    }

    shiftLane(dir) {
      this.setLane(this.lane + dir);
    }

    emergencyWarp() {
      if (this.warpCooldown > 0) return;
      this.warpCooldown = cfg.warpCooldownSeconds;
      this.invuln = Math.max(this.invuln, cfg.warpInvulnSeconds);

      let cleared = 0;
      const radius = cfg.warpClearRadius || 190;
      for (let i = this.objects.length - 1; i >= 0; i -= 1) {
        const o = this.objects[i];
        const dx = o.x - this.shipX;
        const dy = o.y - this.shipY;
        const dist = Math.hypot(dx, dy);
        const sameLaneDanger = o.kind === 'hazard' && o.lane === this.lane && o.y > this.shipY - radius * 1.25 && o.y < this.shipY + radius * 0.85;
        if (o.kind === 'hazard' && (dist < radius || sameLaneDanger)) {
          this.objects.splice(i, 1);
          this.burst(o.x, o.y, COLORS.magenta, 20);
          cleared += 1;
        }
      }

      this.flash = Math.max(this.flash, 0.12);
      this.game.renderer.shake(cleared ? 13 : 7, cleared ? 0.18 : 0.12);
      this.burst(this.shipX, this.shipY, COLORS.magenta, 34);
      this.pop(cleared ? `PHASE WARP ×${cleared}` : 'PHASE WARP', this.shipX, this.shipY - 68, COLORS.magenta, 0.85);
      if (cleared) this.addScore(cleared, this.shipX, this.shipY - 36, false);
      this.game.audio.tone(220, 0.07, 'sawtooth', 0.16);
      setTimeout(() => this.game.audio.tone(520, 0.07, 'triangle', 0.14), 70);
      setTimeout(() => this.game.audio.tone(920, 0.10, 'triangle', 0.14), 145);
    }

    spawn() {
      const track = (cfg.patternTracks && (cfg.patternTracks[this.diffKey] || cfg.patternTracks.normal)) || [];
      let kind = 'core';
      let lane = Math.floor(this.laneCount / 2);
      if (track.length) {
        const step = track[this.patternIndex % track.length];
        kind = step[0];
        lane = step[1];
      } else {
        const roll = this.rng();
        const shieldChance = this.diff.shield * Math.max(0.45, 1 - (this.rank - 1) * 0.045);
        kind = roll < shieldChance ? 'shield' : (roll < shieldChance + this.diff.core ? 'core' : 'hazard');
        lane = Math.floor(this.rng() * this.laneCount);
      }
      this.patternIndex += 1;

      // Later ranks introduce deterministic echo hazards, but the pattern remains learnable.
      this.spawnObject(kind, lane, 0);
      if (this.rank >= 4 && kind !== 'shield' && this.patternIndex % 5 === 0) {
        const echoLane = (lane + 2) % this.laneCount;
        this.spawnObject('hazard', echoLane, -120);
      }
    }

    spawnObject(kind, lane, yOffset = 0) {
      lane = U.clamp(Math.round(lane), 0, this.laneCount - 1);
      const baseRadius = kind === 'hazard' ? this.diff.hazardRadius : kind === 'shield' ? 31 : this.diff.coreRadius;
      const wobble = this.rng() * U.TAU;
      this.objects.push({
        kind,
        lane,
        x: this.laneX(lane),
        y: -60 + yOffset,
        r: baseRadius,
        spin: this.rng() * U.TAU,
        wobble,
        vx: (this.rng() * 16) - 8
      });
    }

    addScore(amount, x, y, showPopup = true) {
      this.score += amount;
      this.rank = 1 + Math.floor(this.score / cfg.rankEvery);
      KGB.ArcadeKit.setScore(this.game, this.score, cfg.scoreMode);
      this.updateStatus();
      if (showPopup) this.pop(`+${amount}`, x, y, COLORS.green, 0.55);

      if (this.rank > this.lastRankAnnounced) {
        this.lastRankAnnounced = this.rank;
        this.rankUp();
      }
    }

    updateStatus() {
      KGB.ArcadeKit.setStatus(`R${this.rank} • C${this.combo || 0}`);
    }

    cleanPickup(x, y, label = 'COMBO') {
      this.combo += 1;
      this.bestCombo = Math.max(this.bestCombo, this.combo);
      this.updateStatus();

      if (this.combo > 0 && this.combo % cfg.comboBonusEvery === 0) {
        this.addScore(1, x, y - 28, true);
        this.pop(`${label} ${this.combo}! BONUS +1`, x, y - 58, COLORS.yellow, 0.95);
        this.game.audio.tone(880, 0.08, 'triangle', 0.13);
      }

      if (this.combo > 0 && this.combo % cfg.comboShieldEvery === 0) {
        this.addShieldBonus(0.75, `COMBO SHIELD ${this.combo}`);
        this.game.renderer.shake(3, 0.10);
      }

      if (this.combo >= this.nextHeartCombo) {
        this.nextHeartCombo += cfg.heartComboEvery;
        this.restoreHeart(x, y);
      }
    }

    resetCombo(x, y, label = 'COMBO BROKEN') {
      if (this.combo > 0) this.pop(label, x, y - 42, COLORS.red, 0.70);
      this.combo = 0;
      this.nextHeartCombo = cfg.heartComboEvery;
      this.updateStatus();
    }

    rankUp() {
      this.game.renderer.shake(4, 0.16);
      this.pop(`RANK ${this.rank}`, this.game.width / 2, this.game.height * 0.28, COLORS.yellow, 1.0);
      KGB.UI.toast(`Rank ${this.rank} — speed increased`);
      this.game.audio.tone(520, 0.08, 'triangle', 0.16);
      setTimeout(() => this.game.audio.tone(720, 0.08, 'triangle', 0.16), 90);
      setTimeout(() => this.game.audio.tone(940, 0.12, 'triangle', 0.16), 180);
    }

    restoreHeart(x, y) {
      if (this.lives < cfg.maxLives) {
        this.lives += 1;
        KGB.ArcadeKit.setLives(this.lives);
        this.pop('HEART RESTORED', x, y - 35, '#ff9a9a', 1.0);
        KGB.UI.toast('Lost heart recovered');
        this.burst(this.shipX, this.shipY, '#ff9a9a', 22);
        this.game.audio.tone(660, 0.08, 'triangle', 0.18);
        setTimeout(() => this.game.audio.tone(990, 0.10, 'triangle', 0.16), 90);
      } else {
        this.addShieldBonus(1.0, 'MAX HEARTS');
      }
    }

    collectShield(x, y) {
      this.shield = Math.min(cfg.shieldMaxSeconds, Math.max(this.shield, this.diff.shieldSeconds));
      KGB.ArcadeKit.setMeter('shield', this.shield / cfg.shieldMaxSeconds);
      this.pop('SHIELD ONLINE', x, y, COLORS.blue, 0.9);
      KGB.UI.toast('Shield online');
      this.burst(x, y, COLORS.blue, 28);
      this.game.audio.tone(420, 0.08, 'sine', 0.16);
      setTimeout(() => this.game.audio.tone(720, 0.12, 'triangle', 0.18), 90);
    }

    addShieldBonus(seconds, label) {
      this.shield = Math.min(cfg.shieldMaxSeconds, this.shield + seconds);
      KGB.ArcadeKit.setMeter('shield', this.shield / cfg.shieldMaxSeconds);
      this.pop(label, this.shipX, this.shipY - 50, COLORS.blue, 0.75);
    }

    absorbHit(obj) {
      this.shield = 0;
      KGB.ArcadeKit.setMeter('shield', 0);
      this.invuln = Math.max(this.invuln, 0.4);
      this.flash = Math.max(this.flash, 0.12);
      this.game.renderer.shake(12, 0.18);
      this.pop('SHIELD BREAK', obj.x, obj.y, COLORS.blue, 0.9);
      this.burst(obj.x, obj.y, COLORS.blue, 36);
      this.resetCombo(obj.x, obj.y, 'SHIELD HIT — COMBO LOST');
      this.game.audio.noise(0.18, 0.18, 'bandpass', 420);
      setTimeout(() => this.game.audio.tone(180, 0.12, 'sawtooth', 0.12), 60);
    }

    damage(obj) {
      if (this.invuln > 0) return;
      this.lives -= 1;
      this.invuln = 1.0;
      this.flash = Math.max(this.flash, 0.22);
      this.game.renderer.shake(14, 0.22);
      this.burst(obj.x, obj.y, COLORS.red, 34);
      this.pop('HIT!', obj.x, obj.y, COLORS.red, 0.75);
      this.resetCombo(obj.x, obj.y, 'HIT — COMBO LOST');
      this.game.audio.noise(0.22, 0.20);
      KGB.ArcadeKit.setLives(this.lives);
      if (this.lives <= 0) this.game.scenes.switch('gameover', { score: this.score, rank: this.rank, time: this.survivalTime, combo: this.bestCombo });
    }

    burst(x, y, color, count = 10) {
      for (let i = 0; i < count; i += 1) {
        const a = U.rand(0, U.TAU);
        const s = U.rand(80, 300);
        this.particles.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0, max: U.rand(0.26, 0.82), color, r: U.rand(2, 4) });
      }
      if (this.particles.length > 220) this.particles.splice(0, this.particles.length - 220);
    }

    pop(text, x, y, color, max = 0.75) {
      this.popups.push({ text, x, y, color, life: 0, max });
      if (this.popups.length > 12) this.popups.shift();
    }

    update(dt) {
      if (this.game.input.wasPressed('pause')) { this.game.scenes.switch('pause', this); return; }
      if (this.game.input.wasPressed('mute')) { this.game.audio.toggleSound(); KGB.UI.updateSoundButton(this.game.audio); }
      if (this.game.input.wasPressed('left')) this.shiftLane(-1);
      if (this.game.input.wasPressed('right')) this.shiftLane(1);
      if (this.game.input.wasPressed('boost')) this.emergencyWarp();

      this.survivalTime += dt;
      this.shipY = this.game.height * 0.78;
      this.targetX = this.laneX(this.lane);
      this.shipX += (this.targetX - this.shipX) * Math.min(1, this.diff.shipSlide * dt);
      this.invuln = Math.max(0, this.invuln - dt);
      this.shield = Math.max(0, this.shield - dt);
      this.warpCooldown = Math.max(0, this.warpCooldown - dt);
      KGB.ArcadeKit.setMeter('shield', this.shield / cfg.shieldMaxSeconds);

      this.spawnT += dt;
      while (this.spawnT >= this.currentSpawn()) {
        this.spawnT -= this.currentSpawn();
        this.spawn();
      }

      const fall = this.currentFall();
      for (let i = this.objects.length - 1; i >= 0; i -= 1) {
        const o = this.objects[i];
        o.y += fall * dt;
        o.spin += dt * (o.kind === 'hazard' ? 5.2 : 3.4);
        o.x = this.laneX(o.lane) + Math.sin(this.survivalTime * 3 + o.wobble) * (o.kind === 'hazard' ? 12 : 6) + o.vx;
        if (o.y > this.game.height + 80) this.objects.splice(i, 1);
      }

      for (let i = this.trails.length - 1; i >= 0; i -= 1) {
        const t = this.trails[i];
        t.life += dt;
        if (t.life >= t.max) this.trails.splice(i, 1);
      }
      this.trails.push({ x: this.shipX, y: this.shipY + 28, life: 0, max: 0.28, shield: this.shield > 0 });
      if (this.trails.length > 24) this.trails.shift();

      for (let i = this.particles.length - 1; i >= 0; i -= 1) {
        const p = this.particles[i];
        p.life += dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 1 - 2.4 * dt;
        p.vy *= 1 - 2.4 * dt;
        if (p.life >= p.max) this.particles.splice(i, 1);
      }

      for (let i = this.popups.length - 1; i >= 0; i -= 1) {
        const p = this.popups[i];
        p.life += dt;
        p.y -= 30 * dt;
        if (p.life >= p.max) this.popups.splice(i, 1);
      }

      for (let i = this.objects.length - 1; i >= 0; i -= 1) {
        const o = this.objects[i];
        if (!U.circleHit(this.shipX, this.shipY, this.shipR, o.x, o.y, o.r)) continue;
        this.objects.splice(i, 1);
        if (o.kind === 'core') {
          this.addScore(1, o.x, o.y);
          this.cleanPickup(o.x, o.y, 'CORE STREAK');
          this.burst(o.x, o.y, COLORS.green, 15);
          this.game.audio.tone(620 + Math.min(240, this.rank * 22), 0.07, 'triangle', 0.14);
        } else if (o.kind === 'shield') {
          this.collectShield(o.x, o.y);
          this.cleanPickup(o.x, o.y, 'SHIELD STREAK');
        } else if (o.kind === 'hazard') {
          if (this.shield > 0) this.absorbHit(o);
          else this.damage(o);
        }
      }
    }

    render(r, dt) {
      r.clear(COLORS.bg);
      const bgInfo = getBackdropForRank(this.rank);
      if (bgInfo.mode !== this.bgMode) {
        this.bgMode = bgInfo.mode;
        this.bgLabel = bgInfo.label;
        this.flash = Math.max(this.flash, 0.16);
        this.game.renderer.shake(5, 0.14);
        this.pop(`${bgInfo.label.toUpperCase()} ZONE`, r.width / 2, r.height * 0.33, COLORS.cyan, 1.0);
      }
      drawDynamicBackdrop(r, this.survivalTime, this.bgMode, Math.min(2.35, 1 + this.rank * 0.09));
      drawLaneGuides(r, this.survivalTime, this.laneXs(), this.lane);
      r.beginWorld(dt);
      for (const t of this.trails) drawTrail(r, t);
      for (const o of this.objects) drawObject(r, o, this.survivalTime);
      const blink = this.invuln > 0 && Math.floor(this.survivalTime * 18) % 2 === 0;
      if (!blink) drawShip(r, this.shipX, this.shipY, this.shipR, this.shield, this.warpCooldown / cfg.warpCooldownSeconds, this.survivalTime);
      if (this.invuln > 0) {
        const phasePulse = 0.5 + Math.sin(this.survivalTime * 24) * 0.5;
        r.circle(this.shipX, this.shipY, this.shipR * (2.05 + phasePulse * 0.22), 'rgba(255,77,245,.20)');
        r.circle(this.shipX, this.shipY, this.shipR * (1.52 + phasePulse * 0.12), 'rgba(40,215,255,.16)');
        r.text('PHASE', this.shipX, this.shipY - this.shipR * 2.5, { align: 'center', baseline: 'middle', font: '900 13px system-ui', fill: COLORS.magenta, stroke: '#000', strokeWidth: 3 });
      }
      for (const p of this.particles) {
        const a = 1 - p.life / p.max;
        r.circle(p.x, p.y, Math.max(0.5, p.r * a), p.color, { alpha: a });
      }
      r.endWorld();

      // Bottom game-state meters, in addition to the HUD shield meter.
      const shieldPct = this.shield / cfg.shieldMaxSeconds;
      const warpReady = 1 - (this.warpCooldown / cfg.warpCooldownSeconds);
      const y = r.height - 102;
      r.text('SHIELD', r.width / 2 - 136, y - 15, { align: 'center', baseline: 'middle', font: '800 11px system-ui', fill: COLORS.muted });
      r.meter(r.width / 2 - 230, y, 188, 13, shieldPct, { fill: COLORS.blue, stroke: 'rgba(82,209,255,.55)' });
      r.text('PHASE', r.width / 2 + 136, y - 15, { align: 'center', baseline: 'middle', font: '800 11px system-ui', fill: COLORS.muted });
      r.meter(r.width / 2 + 42, y, 188, 13, warpReady, { fill: warpReady >= 1 ? COLORS.magenta : COLORS.amber, stroke: 'rgba(255,77,245,.42)' });

      for (const p of this.popups) {
        const a = 1 - p.life / p.max;
        r.text(p.text, p.x, p.y, { align: 'center', baseline: 'middle', font: '950 22px system-ui', fill: p.color, stroke: '#000', strokeWidth: 5, shadow: p.color, shadowBlur: 10 * a });
      }

      if (this.flash > 0) {
        const a = Math.min(0.55, this.flash * 2.8);
        r.rect(0, 0, r.width, r.height, this.shield > 0 ? `rgba(82,209,255,${a})` : `rgba(255,255,255,${a})`);
        this.flash = Math.max(0, this.flash - (dt || 0));
      }
    }
  }

  class PauseScene extends KGB.Scene {
    onEnter(previousScene) { setPausedChrome(true); this.previousScene = previousScene; KGB.ArcadeKit.setStatus('PAUSED'); }
    update() {
      if (this.game.input.wasPressed('pause') || this.game.input.wasPressed('action') || this.game.input.pointer.tap) {
        this.game.scenes.current = this.previousScene;
        this.game.scenes.currentName = 'play';
        setPausedChrome(false);
        if (this.previousScene.updateStatus) this.previousScene.updateStatus(); else KGB.ArcadeKit.setStatus(`RANK ${this.previousScene.rank || 1}`);
      }
    }
    render(r) {
      if (this.previousScene) this.previousScene.render(r, 0);
      r.rect(0, 0, r.width, r.height, 'rgba(0,0,0,.60)');
      r.panel(r.width / 2 - 205, r.height / 2 - 98, 410, 196, { fill: 'rgba(7,12,22,.94)', stroke: 'rgba(255,255,255,.22)' });
      r.text('PAUSED', r.width / 2, r.height / 2 - 34, { align: 'center', baseline: 'middle', font: '950 42px system-ui', fill: COLORS.yellow, stroke: '#000', strokeWidth: 5 });
      r.text('ACTION / Tap / P / Esc to resume', r.width / 2, r.height / 2 + 24, { align: 'center', baseline: 'middle', font: '850 16px system-ui', fill: '#fff' });
    }
  }

  class GameOverScene extends KGB.Scene {
    onEnter(data) {
      setPausedChrome(false);
      this.score = data?.score || 0;
      this.rank = data?.rank || 1;
      this.time = data?.time || 0;
      this.combo = data?.combo || 0;
      this.result = KGB.ArcadeKit.finishScore(this.game, this.score, cfg.scoreMode);
      KGB.ArcadeKit.setStatus('GAME OVER');
      KGB.ArcadeKit.setMeter('shield', 0);
      this.game.audio.noise(0.30, 0.20);
      setTimeout(() => this.game.audio.tone(120, 0.18, 'sawtooth', 0.12), 100);
    }
    update() {
      if (this.game.input.wasPressed('action') || this.game.input.pointer.tap) this.game.scenes.switch('play');
      if (this.game.input.wasPressed('pause')) this.game.scenes.switch('title');
    }
    render(r) {
      r.clear('#09060a');
      drawDynamicBackdrop(r, this.game.time, getBackdropForRank(this.rank).mode, 0.9);
      r.rect(0, 0, r.width, r.height, 'rgba(0,0,0,.24)');
      r.text('GAME OVER', r.width / 2, r.height * 0.31, { align: 'center', baseline: 'middle', font: `950 ${Math.max(46, r.width * 0.07)}px system-ui`, fill: COLORS.red, stroke: '#000', strokeWidth: 8, shadow: COLORS.red, shadowBlur: 18 });
      r.text(`Score: ${this.score}${this.result.improved ? ' — NEW BEST!' : ''}`, r.width / 2, r.height * 0.45, { align: 'center', baseline: 'middle', font: '900 24px system-ui', fill: '#fff', stroke: '#000', strokeWidth: 4 });
      r.text(`Final Rank: ${this.rank} • Best Combo: ${this.combo} • Runtime: ${Math.floor(this.time)}s`, r.width / 2, r.height * 0.53, { align: 'center', baseline: 'middle', font: '850 17px system-ui', fill: COLORS.muted, stroke: '#000', strokeWidth: 3 });
      r.text('ACTION / Tap to retry • P/Esc for title', r.width / 2, r.height * 0.65, { align: 'center', baseline: 'middle', font: '800 17px system-ui', fill: COLORS.green, stroke: '#000', strokeWidth: 4 });
    }
  }

  function cycleDifficulty(dir) {
    const keys = difficultyKeys();
    const current = setting('difficulty', cfg.startingDifficulty);
    const idx = Math.max(0, keys.indexOf(current));
    saveSetting('difficulty', keys[U.wrap(idx + dir, 0, keys.length)]);
    KGB.UI.toast(`Difficulty: ${difficultyLabel(setting('difficulty', cfg.startingDifficulty))}`);
  }

  function getBackdropForRank(rank) {
    const list = Array.isArray(cfg.backdropRanks) && cfg.backdropRanks.length ? cfg.backdropRanks : [
      { rank: 1, mode: 'star', label: 'Starfield' },
      { rank: 3, mode: 'particle', label: 'Particle Rain' },
      { rank: 5, mode: 'matrix', label: 'Matrix Rain' },
      { rank: 7, mode: 'rift', label: 'Rift Grid' },
      { rank: 9, mode: 'storm', label: 'Neon Storm' }
    ];
    let current = list[0];
    for (const item of list) {
      if (rank >= item.rank) current = item;
      else break;
    }
    return current;
  }

  function getNextBackdropInfo(rank) {
    const list = Array.isArray(cfg.backdropRanks) && cfg.backdropRanks.length ? cfg.backdropRanks : [];
    return list.find((item) => item.rank > rank) || list[list.length - 1] || { rank: 1, mode: 'star', label: 'Starfield' };
  }

  function drawLogoTitle(r, y) {
    r.text('HYPERHOP', r.width / 2, y, {
      align: 'center', baseline: 'middle', font: `950 ${Math.max(48, r.width * 0.115)}px system-ui`,
      fill: COLORS.yellow, stroke: '#061018', strokeWidth: 10, shadow: COLORS.cyan, shadowBlur: 20
    });
  }

  function drawDynamicBackdrop(r, time, mode, intensity = 1) {
    if (mode === 'matrix') drawMatrixBackdrop(r, time, intensity);
    else if (mode === 'rift') drawRiftBackdrop(r, time, intensity);
    else if (mode === 'particle') drawParticleRainBackdrop(r, time, intensity);
    else if (mode === 'storm') drawNeonStormBackdrop(r, time, intensity);
    else drawStarBackdrop(r, time, intensity);
  }

  function drawStarBackdrop(r, time, intensity = 1) {
    const ctx = r.ctx;
    const cx = r.width / 2;
    const cy = r.height / 2;
    ctx.save();
    r.rect(0, 0, r.width, r.height, '#020408');
    for (let i = 0; i < 130; i += 1) {
      const a = (i * 12.9898 + time * 0.22) % U.TAU;
      const raw = ((i * 47.17 + time * 120 * intensity) % Math.max(r.width, r.height));
      const dist = raw;
      const x = cx + Math.cos(a) * dist;
      const y = cy + Math.sin(a) * dist;
      const len = U.clamp(dist * 0.035 * intensity, 2, 34);
      const alpha = U.clamp(dist / Math.max(r.width, r.height), 0.08, 0.8);
      r.line(x, y, x + Math.cos(a) * len, y + Math.sin(a) * len, `rgba(120,200,255,${alpha})`, 1.4);
    }
    const pulse = 0.5 + Math.sin(time * 2.4) * 0.5;
    r.circle(cx, cy, Math.min(r.width, r.height) * 0.18 + pulse * 24, 'rgba(40,215,255,.035)');
    ctx.restore();
  }

  function drawStarfieldPreview(r, time, intensity = 1) { drawStarBackdrop(r, time, intensity); }

  function drawMatrixBackdrop(r, time, intensity = 1) {
    r.rect(0, 0, r.width, r.height, '#020408');
    const ctx = r.ctx;
    ctx.save();
    const fontSize = 16;
    ctx.font = `800 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.textBaseline = 'top';
    for (let x = 0; x < r.width + 20; x += 18) {
      const speed = 40 + (x % 90) * 0.9;
      const offset = (time * speed * intensity + x * 3.17) % (r.height + 140);
      for (let y = -140; y < r.height; y += fontSize + 8) {
        const yy = y + offset;
        const fade = 1 - Math.min(1, Math.max(0, yy / r.height));
        const glyph = String.fromCharCode(0x30A0 + ((x + y + Math.floor(time * 10)) % 80));
        ctx.fillStyle = `rgba(0,255,154,${0.06 + fade * 0.34})`;
        ctx.fillText(glyph, x, yy);
      }
    }
    ctx.restore();
  }

  function drawRiftBackdrop(r, time, intensity = 1) {
    r.rect(0, 0, r.width, r.height, '#03040b');
    const cx = r.width / 2;
    const cy = r.height * 0.28;
    for (let i = 0; i < 11; i += 1) {
      const a = i / 11 * U.TAU + Math.sin(time * 0.5) * 0.2;
      const len = Math.max(r.width, r.height) * (0.34 + i * 0.018);
      r.line(cx, cy, cx + Math.cos(a) * len, cy + Math.sin(a) * len, i % 2 ? 'rgba(255,77,245,.12)' : 'rgba(40,215,255,.15)', 2.4);
    }
    const pulse = 0.5 + Math.sin(time * 3.2) * 0.5;
    r.circle(cx, cy, 72 + pulse * 24, 'rgba(40,215,255,.10)');
    r.circle(cx, cy, 34 + pulse * 18, 'rgba(255,77,245,.12)');
    for (let y = -52 + ((time * 80 * intensity) % 52); y < r.height + 52; y += 52) r.line(0, y, r.width, y, 'rgba(40,215,255,.07)', 1);
    for (let x = -52 + ((time * 46 * intensity) % 52); x < r.width + 52; x += 52) r.line(x, 0, x, r.height, 'rgba(255,77,245,.045)', 1);
  }


  function drawParticleRainBackdrop(r, time, intensity = 1) {
    r.rect(0, 0, r.width, r.height, '#02070b');
    const speed = 170 * intensity;
    for (let i = 0; i < 160; i += 1) {
      const x = (i * 73.37 + Math.sin(i * 1.7) * 40) % (r.width + 80) - 40;
      const y = (i * 41.91 + time * speed * (0.55 + (i % 5) * 0.16)) % (r.height + 120) - 80;
      const len = 10 + (i % 7) * 3;
      const alpha = 0.12 + (i % 9) * 0.035;
      const color = i % 3 === 0 ? `rgba(0,255,154,${alpha})` : i % 3 === 1 ? `rgba(40,215,255,${alpha})` : `rgba(255,174,66,${alpha})`;
      r.line(x, y, x - 18 * intensity, y + len, color, i % 4 === 0 ? 2 : 1);
    }
    for (let y = (time * 45 * intensity) % 64; y < r.height; y += 64) r.line(0, y, r.width, y, 'rgba(0,255,154,.035)', 1);
  }

  function drawNeonStormBackdrop(r, time, intensity = 1) {
    r.rect(0, 0, r.width, r.height, '#07020b');
    const cx = r.width / 2;
    const cy = r.height / 2;
    for (let i = 0; i < 18; i += 1) {
      const a = i / 18 * U.TAU + time * (0.12 + i * 0.003);
      const inner = Math.min(r.width, r.height) * (0.08 + (i % 4) * 0.035);
      const outer = Math.max(r.width, r.height) * (0.42 + (i % 5) * 0.018);
      const x1 = cx + Math.cos(a) * inner;
      const y1 = cy + Math.sin(a) * inner;
      const x2 = cx + Math.cos(a + Math.sin(time + i) * 0.12) * outer;
      const y2 = cy + Math.sin(a + Math.cos(time + i) * 0.12) * outer;
      r.line(x1, y1, x2, y2, i % 2 ? 'rgba(255,77,245,.14)' : 'rgba(255,174,66,.13)', 2);
    }
    const pulse = 0.5 + Math.sin(time * 4.8) * 0.5;
    r.circle(cx, cy, 92 + pulse * 38, 'rgba(255,77,245,.10)');
    r.circle(cx, cy, 42 + pulse * 22, 'rgba(255,174,66,.12)');
    for (let i = 0; i < 55; i += 1) {
      const x = (i * 97 + time * 110 * intensity) % (r.width + 120) - 60;
      const y = (i * 53 + Math.sin(time * 2 + i) * 35) % (r.height + 100) - 50;
      r.circle(x, y, 1.4 + (i % 4), i % 2 ? 'rgba(255,77,245,.18)' : 'rgba(255,174,66,.16)');
    }
  }

  function drawLaneGuides(r, time, laneXs, activeLane) {
    const pulse = 0.28 + Math.sin(time * 4) * 0.13;
    laneXs.forEach((x, i) => {
      const active = i === activeLane;
      r.line(x, r.height * 0.11, x, r.height - 118, active ? `rgba(255,230,120,.52)` : `rgba(82,209,255,${pulse})`, active ? 3 : 2);
      for (let y = r.height * 0.12 + ((time * 170) % 48); y < r.height - 118; y += 48) {
        r.line(x - 12, y, x + 12, y, active ? 'rgba(255,230,120,.18)' : 'rgba(255,255,255,.10)', 2);
      }
    });
  }

  function drawObject(r, o, time) {
    const rot = o.spin;
    if (o.kind === 'core') drawCore(r, o.x, o.y, o.r, rot);
    else if (o.kind === 'shield') drawShieldPickup(r, o.x, o.y, o.r, rot, time);
    else drawHazard(r, o.x, o.y, o.r, rot);
  }

  function drawCore(r, x, y, rad, rot) {
    const ctx = r.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.shadowColor = COLORS.green;
    ctx.shadowBlur = 16;
    ctx.strokeStyle = COLORS.green;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, rad, 0, U.TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-rad * 0.55, 0);
    ctx.lineTo(rad * 0.55, 0);
    ctx.moveTo(0, -rad * 0.55);
    ctx.lineTo(0, rad * 0.55);
    ctx.stroke();
    ctx.fillStyle = 'rgba(120,255,160,.22)';
    ctx.beginPath(); ctx.arc(0, 0, rad * 0.55, 0, U.TAU); ctx.fill();
    ctx.restore();
  }

  function drawHazard(r, x, y, rad, rot) {
    const ctx = r.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.shadowColor = COLORS.red;
    ctx.shadowBlur = 12;
    ctx.strokeStyle = COLORS.red;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(0, 0, rad, 0, U.TAU);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-rad * 0.72, -rad * 0.72);
    ctx.lineTo(rad * 0.72, rad * 0.72);
    ctx.moveTo(rad * 0.72, -rad * 0.72);
    ctx.lineTo(-rad * 0.72, rad * 0.72);
    ctx.stroke();
    ctx.fillStyle = 'rgba(255,90,90,.16)';
    ctx.beginPath(); ctx.arc(0, 0, rad * 0.62, 0, U.TAU); ctx.fill();
    ctx.restore();
  }

  function drawShieldPickup(r, x, y, rad, rot, time) {
    const ctx = r.ctx;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot * 0.5);
    ctx.shadowColor = COLORS.blue;
    ctx.shadowBlur = 20;
    ctx.strokeStyle = COLORS.blue;
    ctx.lineWidth = 4;
    polygonPath(ctx, 0, 0, rad, 6);
    ctx.stroke();
    ctx.rotate(-rot * 1.1);
    ctx.beginPath();
    ctx.arc(0, 0, rad * (0.45 + Math.sin(time * 5) * 0.04), 0, U.TAU);
    ctx.stroke();
    ctx.fillStyle = 'rgba(82,209,255,.16)';
    ctx.beginPath(); ctx.arc(0, 0, rad * 0.70, 0, U.TAU); ctx.fill();
    ctx.restore();
  }

  function drawShip(r, x, y, rad, shield, warpPct, time) {
    const ctx = r.ctx;
    ctx.save();
    ctx.translate(x, y);
    if (shield > 0) {
      const pct = Math.min(1, shield / cfg.shieldMaxSeconds);
      ctx.shadowColor = COLORS.blue;
      ctx.shadowBlur = 25;
      ctx.strokeStyle = `rgba(82,209,255,${0.65 + pct * 0.25})`;
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, rad * (1.65 + Math.sin(time * 7) * 0.05), 0, U.TAU);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(82,209,255,.20)';
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(0, 0, rad * 1.55, 0, U.TAU);
      ctx.stroke();
    }
    ctx.shadowColor = shield > 0 ? COLORS.blue : COLORS.yellow;
    ctx.shadowBlur = 12;
    ctx.strokeStyle = shield > 0 ? COLORS.cyan : COLORS.yellow;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, -rad * 1.25);
    ctx.lineTo(rad * 0.92, rad * 0.62);
    ctx.lineTo(rad * 0.24, rad * 0.35);
    ctx.lineTo(0, rad * 1.06);
    ctx.lineTo(-rad * 0.24, rad * 0.35);
    ctx.lineTo(-rad * 0.92, rad * 0.62);
    ctx.closePath();
    ctx.stroke();
    ctx.fillStyle = shield > 0 ? 'rgba(82,209,255,.15)' : 'rgba(255,230,120,.14)';
    ctx.fill();
    ctx.fillStyle = warpPct >= 1 ? COLORS.magenta : COLORS.cyan;
    ctx.beginPath(); ctx.arc(0, 0, rad * 0.26, 0, U.TAU); ctx.fill();
    ctx.restore();
  }

  function drawTrail(r, t) {
    const a = 1 - t.life / t.max;
    const color = t.shield ? '82,209,255' : '255,230,120';
    r.line(t.x, t.y, t.x, t.y + 38 * a, `rgba(${color},${0.38 * a})`, 7 * a);
    r.circle(t.x, t.y + 14, 8 * a, `rgba(${color},${0.22 * a})`);
  }

  function polygonPath(ctx, x, y, r, sides) {
    ctx.beginPath();
    for (let i = 0; i < sides; i += 1) {
      const a = -Math.PI / 2 + i / sides * U.TAU;
      const px = x + Math.cos(a) * r;
      const py = y + Math.sin(a) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function makeStar(w, h, full) {
    return { x: U.rand(0, w), y: full ? U.rand(0, h) : U.rand(-h * 0.2, 0), z: U.rand(0.2, 1), speed: U.rand(0.5, 1.4) };
  }

  function randomGlyph() {
    const chars = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ$%#@';
    return chars[Math.floor(Math.random() * chars.length)];
  }


  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < String(str).length; i += 1) {
      h ^= String(str).charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function seededRng(seed) {
    let s = seed >>> 0;
    return function next() {
      s += 0x6D2B79F5;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function drawWrappedText(r, text, x, y, maxWidth, lineHeight, opts = {}) {
    const ctx = r.ctx;
    ctx.save();
    ctx.font = opts.font || '800 16px system-ui';
    const words = String(text).split(/\s+/);
    const lines = [];
    let line = '';
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else line = test;
    }
    if (line) lines.push(line);
    ctx.restore();
    const startY = y - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((ln, i) => r.text(ln, x, startY + i * lineHeight, opts));
  }

  game.scenes.add('boot', BootScene);
  game.scenes.add('title', TitleScene);
  game.scenes.add('settings', SettingsScene);
  game.scenes.add('play', PlayScene);
  game.scenes.add('pause', PauseScene);
  game.scenes.add('gameover', GameOverScene);
  game.start('boot');
})();
