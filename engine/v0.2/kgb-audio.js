/*
  KGB Arcade Engine v0.1 — Audio Manager
  Mobile-safe WebAudio unlock, one-shots, loops, volume, mute, and synth fallbacks.
*/
(function (global) {
  'use strict';

  const KGB = global.KGB || (global.KGB = {});

  class AudioManager {
    constructor(save = null, options = {}) {
      this.save = save;
      this.ctx = null;
      this.master = null;
      this.unlocked = false;
      this.volume = Number(this.save?.getSetting('masterVolume', options.volume ?? 0.75));
      this.soundOn = this.save?.getSetting('soundOn', options.soundOn ?? true) !== false;
      this.loops = new Map();
      this.attachUnlockListeners();
    }

    attachUnlockListeners() {
      const unlock = () => this.unlock();
      ['pointerdown', 'touchstart', 'mousedown', 'keydown'].forEach((eventName) => {
        document.addEventListener(eventName, unlock, { once: true, passive: true });
      });
    }

    unlock() {
      if (this.unlocked) return true;
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return false;
        this.ctx = this.ctx || new AudioContext();
        if (this.ctx.state === 'suspended') this.ctx.resume();
        this.master = this.master || this.ctx.createGain();
        this.master.gain.value = this.soundOn ? this.volume : 0;
        this.master.connect(this.ctx.destination);

        const buffer = this.ctx.createBuffer(1, 1, 22050);
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.master);
        source.start(0);
        this.unlocked = true;
        return true;
      } catch (err) {
        console.warn('[KGB Audio] unlock failed', err);
        return false;
      }
    }

    setSoundOn(value) {
      this.soundOn = !!value;
      if (this.save) this.save.setSetting('soundOn', this.soundOn);
      if (this.master) this.master.gain.value = this.soundOn ? this.volume : 0;
      if (!this.soundOn) this.stopAllLoops();
    }

    toggleSound() {
      this.setSoundOn(!this.soundOn);
      return this.soundOn;
    }

    setVolume(value) {
      this.volume = Math.max(0, Math.min(1, Number(value) || 0));
      if (this.save) this.save.setSetting('masterVolume', this.volume);
      if (this.master) this.master.gain.value = this.soundOn ? this.volume : 0;
    }

    tone(freq = 440, duration = 0.12, type = 'sine', volume = 0.22) {
      if (!this.soundOn || !this.unlock() || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(volume, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(this.master);
      osc.start(now);
      osc.stop(now + duration + 0.03);
    }

    noise(duration = 0.2, volume = 0.18, filterType = 'highpass', filterFreq = 900) {
      if (!this.soundOn || !this.unlock() || !this.ctx) return;
      const length = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, length, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < length; i += 1) {
        const t = i / length;
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2);
      }
      const source = this.ctx.createBufferSource();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      filter.type = filterType;
      filter.frequency.value = filterFreq;
      gain.gain.value = volume;
      source.buffer = buffer;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.master);
      source.start();
    }

    oneShot(audioAsset, volume = 1) {
      if (!this.soundOn || !audioAsset) return;
      try {
        const clone = audioAsset.cloneNode(true);
        clone.volume = Math.max(0, Math.min(1, volume * this.volume));
        clone.currentTime = 0;
        clone.play().catch(() => {});
      } catch (err) {
        console.warn('[KGB Audio] oneShot failed', err);
      }
    }

    startLoop(key, audioAsset, volume = 0.65) {
      if (!this.soundOn || !audioAsset || this.loops.has(key)) return;
      try {
        const loop = audioAsset.cloneNode(true);
        loop.loop = true;
        loop.volume = Math.max(0, Math.min(1, volume * this.volume));
        loop.play().catch(() => {});
        this.loops.set(key, loop);
      } catch (err) {
        console.warn('[KGB Audio] loop failed', key, err);
      }
    }

    stopLoop(key) {
      const loop = this.loops.get(key);
      if (!loop) return;
      loop.pause();
      loop.currentTime = 0;
      this.loops.delete(key);
    }

    stopAllLoops() {
      Array.from(this.loops.keys()).forEach((key) => this.stopLoop(key));
    }
  }

  KGB.AudioManager = AudioManager;
})(window);
