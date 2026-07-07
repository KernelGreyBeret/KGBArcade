/*
  KGB Arcade Engine v0.1 — Utilities
  Zero-dependency browser helpers shared across KGB Arcade runtime modules.
*/
(function (global) {
  'use strict';

  const KGB = global.KGB || (global.KGB = {});

  const Utils = {
    VERSION: '0.2.0',
    TAU: Math.PI * 2,

    clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    },

    lerp(a, b, t) {
      return a + (b - a) * t;
    },

    inverseLerp(a, b, value) {
      if (a === b) return 0;
      return Utils.clamp((value - a) / (b - a), 0, 1);
    },

    rand(min = 0, max = 1) {
      return min + Math.random() * (max - min);
    },

    randInt(min, max) {
      return Math.floor(Utils.rand(min, max + 1));
    },

    chance(probability) {
      return Math.random() < probability;
    },

    pick(list) {
      return list[Math.floor(Math.random() * list.length)];
    },

    dist(ax, ay, bx, by) {
      return Math.hypot(ax - bx, ay - by);
    },

    circleHit(ax, ay, ar, bx, by, br) {
      const dx = ax - bx;
      const dy = ay - by;
      const r = ar + br;
      return dx * dx + dy * dy <= r * r;
    },

    rectHit(a, b) {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    },

    wrap(value, min, max) {
      const range = max - min;
      if (range === 0) return min;
      return ((((value - min) % range) + range) % range) + min;
    },

    now() {
      return performance.now();
    },

    uid(prefix = 'kgb') {
      return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`;
    },

    safeJsonParse(value, fallback = null) {
      try {
        return JSON.parse(value);
      } catch (err) {
        return fallback;
      }
    },

    pathJoin(...parts) {
      return parts
        .filter(Boolean)
        .join('/')
        .replace(/\\/g, '/')
        .replace(/\/+/g, '/')
        .replace(':/', '://');
    },

    withTrailingSlash(path) {
      if (!path) return '';
      return path.endsWith('/') ? path : `${path}/`;
    },

    isTouchDevice() {
      return (navigator.maxTouchPoints || 0) > 0 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    },

    getSafeArea() {
      // CSS env() values are not directly exposed to JS. The shell writes them into CSS vars.
      const root = getComputedStyle(document.documentElement);
      const read = (name) => parseFloat(root.getPropertyValue(name)) || 0;
      return {
        top: read('--kgb-safe-top'),
        right: read('--kgb-safe-right'),
        bottom: read('--kgb-safe-bottom'),
        left: read('--kgb-safe-left')
      };
    },

    debounce(fn, wait = 100) {
      let timer = 0;
      return function debounced(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), wait);
      };
    }
  };

  KGB.Utils = Utils;
})(window);
