/*
  KGB Arcade Engine v0.1.1 — UI Helpers
  DOM helpers for the common KGB Arcade game shell.
*/
(function (global) {
  'use strict';

  const KGB = global.KGB || (global.KGB = {});

  const WORLD_LABELS = {
    minimission: 'MiniMission',
    '8bitops': '8BitOps',
    tanktots: 'TankTots'
  };

  function stopUiEvent(event) {
    if (!event) return;
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === 'function') event.stopImmediatePropagation();
  }

  function makeSingleActivation(handler, lockMs = 260) {
    let lastActivation = 0;
    return function activate(event) {
      stopUiEvent(event);
      const now = performance.now();
      if (now - lastActivation < lockMs) return;
      lastActivation = now;
      handler(event);
    };
  }

  class UIHelpers {
    static qs(selector, root = document) {
      return root.querySelector(selector);
    }

    static qsa(selector, root = document) {
      return Array.from(root.querySelectorAll(selector));
    }

    static setText(selector, text) {
      const el = typeof selector === 'string' ? UIHelpers.qs(selector) : selector;
      if (el) el.textContent = text;
    }

    static show(selector, display = 'flex') {
      const el = typeof selector === 'string' ? UIHelpers.qs(selector) : selector;
      if (el) el.style.display = display;
    }

    static hide(selector) {
      const el = typeof selector === 'string' ? UIHelpers.qs(selector) : selector;
      if (el) el.style.display = 'none';
    }

    static setWorldBadge(world) {
      const el = UIHelpers.qs('[data-kgb-world]');
      if (!el) return;
      const key = String(world || '').toLowerCase();
      el.textContent = WORLD_LABELS[key] || world || 'KGB Arcade';
      el.dataset.kgbWorld = key;
    }

    static wireBackToArcade(href = '../../index.html') {
      UIHelpers.qsa('[data-kgb-back]').forEach((el) => {
        if (el._kgbBackEventsBound) return;
        const targetHref = href || el.getAttribute('href') || '../../index.html';
        el.setAttribute('href', targetHref);
        el.setAttribute('role', 'link');
        el.style.pointerEvents = 'auto';
        el.style.touchAction = 'manipulation';

        const navigate = makeSingleActivation(() => {
          const url = el.getAttribute('href') || targetHref;
          if (!url || url === '#') return;
          window.location.assign(url);
        }, 320);

        // Use pointerup/touchend/click because some mobile/PWA shells suppress click after pointerdown.
        ['pointerdown', 'mousedown', 'touchstart'].forEach((eventName) => {
          el.addEventListener(eventName, stopUiEvent, { passive: false });
        });
        ['pointerup', 'mouseup', 'touchend', 'click'].forEach((eventName) => {
          el.addEventListener(eventName, navigate, { passive: false });
        });

        el.addEventListener('keydown', (event) => {
          if (event.code === 'Enter' || event.code === 'Space') navigate(event);
        });

        el._kgbBackEventsBound = true;
      });
    }

    static updateSoundButton(audio) {
      UIHelpers.qsa('[data-kgb-sound-toggle]').forEach((el) => {
        el.textContent = audio.soundOn ? 'Sound: On' : 'Sound: Off';
        el.setAttribute('aria-pressed', audio.soundOn ? 'true' : 'false');
        el.classList.toggle('is-off', !audio.soundOn);
      });
    }

    static bindSoundButtons(audio) {
      UIHelpers.qsa('[data-kgb-sound-toggle]').forEach((el) => {
        if (el._kgbSoundEventsBound) return;
        el.style.pointerEvents = 'auto';
        el.style.touchAction = 'manipulation';

        const toggle = makeSingleActivation(() => {
          audio.toggleSound();
          if (audio.soundOn) audio.unlock();
          UIHelpers.updateSoundButton(audio);
          UIHelpers.toast(audio.soundOn ? 'Sound on' : 'Sound off', 900);
        }, 260);

        ['pointerdown', 'mousedown', 'touchstart'].forEach((eventName) => {
          el.addEventListener(eventName, stopUiEvent, { passive: false });
        });
        ['pointerup', 'mouseup', 'touchend', 'click'].forEach((eventName) => {
          el.addEventListener(eventName, toggle, { passive: false });
        });

        el.addEventListener('keydown', (event) => {
          if (event.code === 'Enter' || event.code === 'Space') toggle(event);
        });

        el._kgbSoundEventsBound = true;
      });
      UIHelpers.updateSoundButton(audio);
    }

    static makeVirtualButton(action, label, className = '') {
      const button = document.createElement('button');
      button.className = `kgb-vbtn ${className}`.trim();
      button.type = 'button';
      button.dataset.kgbBtn = action;
      button.textContent = label;
      return button;
    }

    static setHud(values = {}) {
      Object.keys(values).forEach((key) => {
        UIHelpers.qsa(`[data-kgb-hud="${key}"]`).forEach((el) => {
          el.textContent = values[key];
        });
      });
    }

    static setMeter(name, value) {
      const pct = Math.max(0, Math.min(1, Number(value) || 0));
      UIHelpers.qsa(`[data-kgb-meter="${name}"]`).forEach((el) => {
        el.style.setProperty('--kgb-meter', `${pct * 100}%`);
        el.setAttribute('aria-valuenow', String(Math.round(pct * 100)));
      });
    }

    static toast(message, ms = 1500) {
      let el = UIHelpers.qs('.kgb-toast');
      if (!el) {
        el = document.createElement('div');
        el.className = 'kgb-toast';
        document.body.appendChild(el);
      }
      el.textContent = message;
      el.classList.add('show');
      clearTimeout(el._timer);
      el._timer = setTimeout(() => el.classList.remove('show'), ms);
    }
  }

  KGB.UI = UIHelpers;
})(window);
