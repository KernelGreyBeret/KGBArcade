/*
  KGB Arcade Engine v0.1 — Save Manager
  Namespaced localStorage saves for scores, settings, and future unlocks.
*/
(function (global) {
  'use strict';

  const KGB = global.KGB || (global.KGB = {});
  const Utils = KGB.Utils;

  class SaveManager {
    constructor(gameId = 'kgb-game') {
      this.gameId = gameId;
      this.prefix = `kgb:${gameId}:`;
    }

    key(name) {
      return `${this.prefix}${name}`;
    }

    get(name, fallback = null) {
      try {
        const value = localStorage.getItem(this.key(name));
        if (value === null || value === undefined) return fallback;
        return Utils.safeJsonParse(value, value);
      } catch (err) {
        console.warn('[KGB Save] get failed', name, err);
        return fallback;
      }
    }

    set(name, value) {
      try {
        localStorage.setItem(this.key(name), JSON.stringify(value));
        return true;
      } catch (err) {
        console.warn('[KGB Save] set failed', name, err);
        return false;
      }
    }

    remove(name) {
      try {
        localStorage.removeItem(this.key(name));
      } catch (err) {
        console.warn('[KGB Save] remove failed', name, err);
      }
    }

    getSetting(name, fallback = null) {
      const settings = this.get('settings', {});
      return Object.prototype.hasOwnProperty.call(settings, name) ? settings[name] : fallback;
    }

    setSetting(name, value) {
      const settings = this.get('settings', {});
      settings[name] = value;
      return this.set('settings', settings);
    }

    getBestScore(mode = 'default') {
      const scores = this.get('bestScores', {});
      return Number(scores[mode] || 0);
    }

    setBestScore(score, mode = 'default') {
      const value = Math.floor(Number(score) || 0);
      const scores = this.get('bestScores', {});
      const previous = Number(scores[mode] || 0);
      const improved = value > previous;
      if (improved) {
        scores[mode] = value;
        this.set('bestScores', scores);
      }
      return { improved, previous, best: Math.max(previous, value) };
    }

    clearAll() {
      const keys = [];
      for (let i = 0; i < localStorage.length; i += 1) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) keys.push(key);
      }
      keys.forEach((key) => localStorage.removeItem(key));
    }
  }

  KGB.SaveManager = SaveManager;
})(window);
