/*
  KGB Arcade Engine v0.1 — Input Manager
  Keyboard, mouse/pointer, touch zones, virtual buttons, holds, taps, and swipes.
*/
(function (global) {
  'use strict';

  const KGB = global.KGB || (global.KGB = {});

  const DEFAULT_BINDINGS = {
    left: ['ArrowLeft', 'KeyA'],
    right: ['ArrowRight', 'KeyD'],
    up: ['ArrowUp', 'KeyW'],
    down: ['ArrowDown', 'KeyS'],
    action: ['Space', 'Enter', 'KeyJ'],
    boost: ['ShiftLeft', 'ShiftRight', 'KeyK'],
    pause: ['Escape', 'KeyP'],
    mute: ['KeyM']
  };

  class InputManager {
    constructor(options = {}) {
      this.target = options.target || document;
      this.bindings = { ...DEFAULT_BINDINGS, ...(options.bindings || {}) };
      this.keyToAction = new Map();
      this.actions = new Map();
      this.pointer = {
        x: 0,
        y: 0,
        worldX: 0,
        worldY: 0,
        down: false,
        pressed: false,
        released: false,
        startX: 0,
        startY: 0,
        dx: 0,
        dy: 0,
        tap: false,
        swipe: null
      };
      this.swipeThreshold = options.swipeThreshold || 48;
      this.tapMaxMove = options.tapMaxMove || 14;
      this.tapMaxMs = options.tapMaxMs || 260;
      this.pointerStartTime = 0;
      this.buttons = new Map();
      this.tapZones = [];
      this.enabled = true;
      this.preventDefaultKeys = options.preventDefaultKeys !== false;
      this.buildMaps();
      this.attach();
    }

    buildMaps() {
      this.keyToAction.clear();
      Object.keys(this.bindings).forEach((action) => {
        this.ensureAction(action);
        (this.bindings[action] || []).forEach((code) => this.keyToAction.set(code, action));
      });
    }

    ensureAction(action) {
      if (!this.actions.has(action)) {
        this.actions.set(action, { down: false, pressed: false, released: false, hold: 0, source: null });
      }
      return this.actions.get(action);
    }

    attach() {
      window.addEventListener('keydown', (e) => this.onKey(e, true), { passive: false });
      window.addEventListener('keyup', (e) => this.onKey(e, false), { passive: false });
      window.addEventListener('blur', () => this.reset());

      const pointerTarget = this.target === document ? document.body : this.target;
      pointerTarget.addEventListener('pointerdown', (e) => this.onPointerDown(e), { passive: false });
      pointerTarget.addEventListener('pointermove', (e) => this.onPointerMove(e), { passive: false });
      pointerTarget.addEventListener('pointerup', (e) => this.onPointerUp(e), { passive: false });
      pointerTarget.addEventListener('pointercancel', (e) => this.onPointerUp(e), { passive: false });

      this.bindVirtualButtons();
    }

    bindVirtualButtons(root = document) {
      const buttons = root.querySelectorAll('[data-kgb-btn]');
      buttons.forEach((el) => {
        const action = el.getAttribute('data-kgb-btn');
        if (!action || this.buttons.has(el)) return;
        this.buttons.set(el, action);
        const down = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.setAction(action, true, 'button');
          el.classList.add('is-down');
        };
        const up = (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.setAction(action, false, 'button');
          el.classList.remove('is-down');
        };
        el.addEventListener('pointerdown', down, { passive: false });
        el.addEventListener('pointerup', up, { passive: false });
        el.addEventListener('pointercancel', up, { passive: false });
        el.addEventListener('pointerleave', up, { passive: false });
      });
    }

    addTapZone(rect, action) {
      // rect can be {x,y,w,h} in CSS pixels or a function returning that object.
      this.tapZones.push({ rect, action });
    }

    clearTapZones() {
      this.tapZones.length = 0;
    }

    onKey(e, isDown) {
      if (!this.enabled) return;
      const action = this.keyToAction.get(e.code);
      if (!action) return;
      if (this.preventDefaultKeys) e.preventDefault();
      this.setAction(action, isDown, 'keyboard');
    }

    setAction(action, isDown, source = 'manual') {
      const state = this.ensureAction(action);
      if (isDown && !state.down) state.pressed = true;
      if (!isDown && state.down) state.released = true;
      state.down = isDown;
      state.source = source;
      if (!isDown) state.hold = 0;
    }

    onPointerDown(e) {
      if (!this.enabled) return;
      this.pointer.down = true;
      this.pointer.pressed = true;
      this.pointer.released = false;
      this.pointer.tap = false;
      this.pointer.swipe = null;
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
      this.pointer.startX = e.clientX;
      this.pointer.startY = e.clientY;
      this.pointer.dx = 0;
      this.pointer.dy = 0;
      this.pointerStartTime = performance.now();
    }

    onPointerMove(e) {
      if (!this.enabled) return;
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
      if (this.pointer.down) {
        this.pointer.dx = e.clientX - this.pointer.startX;
        this.pointer.dy = e.clientY - this.pointer.startY;
      }
    }

    onPointerUp(e) {
      if (!this.enabled) return;
      this.pointer.x = e.clientX;
      this.pointer.y = e.clientY;
      this.pointer.dx = e.clientX - this.pointer.startX;
      this.pointer.dy = e.clientY - this.pointer.startY;
      this.pointer.down = false;
      this.pointer.released = true;

      const elapsed = performance.now() - this.pointerStartTime;
      const absX = Math.abs(this.pointer.dx);
      const absY = Math.abs(this.pointer.dy);
      const moved = Math.hypot(this.pointer.dx, this.pointer.dy);

      if (moved <= this.tapMaxMove && elapsed <= this.tapMaxMs) {
        this.pointer.tap = true;
        this.fireTapZones(e.clientX, e.clientY);
      } else if (Math.max(absX, absY) >= this.swipeThreshold) {
        if (absX > absY) this.pointer.swipe = this.pointer.dx > 0 ? 'right' : 'left';
        else this.pointer.swipe = this.pointer.dy > 0 ? 'down' : 'up';
      }
    }

    fireTapZones(x, y) {
      for (const zone of this.tapZones) {
        const rect = typeof zone.rect === 'function' ? zone.rect() : zone.rect;
        if (!rect) continue;
        if (x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h) {
          this.tap(zone.action);
        }
      }
    }

    tap(action) {
      const state = this.ensureAction(action);
      state.pressed = true;
      state.released = true;
      state.source = 'tapzone';
    }

    isDown(action) {
      return !!this.ensureAction(action).down;
    }

    wasPressed(action) {
      return !!this.ensureAction(action).pressed;
    }

    wasReleased(action) {
      return !!this.ensureAction(action).released;
    }

    axis(negativeAction, positiveAction) {
      return (this.isDown(positiveAction) ? 1 : 0) - (this.isDown(negativeAction) ? 1 : 0);
    }

    update(dt) {
      this.actions.forEach((state) => {
        if (state.down) state.hold += dt;
      });
    }

    endFrame() {
      this.actions.forEach((state) => {
        state.pressed = false;
        state.released = false;
      });
      this.pointer.pressed = false;
      this.pointer.released = false;
      this.pointer.tap = false;
      this.pointer.swipe = null;
    }

    reset() {
      this.actions.forEach((state) => {
        state.down = false;
        state.pressed = false;
        state.released = false;
        state.hold = 0;
      });
      this.pointer.down = false;
      this.pointer.pressed = false;
      this.pointer.released = false;
      this.pointer.tap = false;
      this.pointer.swipe = null;
      document.querySelectorAll('[data-kgb-btn].is-down').forEach((el) => el.classList.remove('is-down'));
    }
  }

  KGB.InputManager = InputManager;
})(window);
