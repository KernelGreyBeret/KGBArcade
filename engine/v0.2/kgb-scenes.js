/*
  KGB Arcade Engine v0.1 — Scene Manager
*/
(function (global) {
  'use strict';

  const KGB = global.KGB || (global.KGB = {});

  class Scene {
    constructor(game) {
      this.game = game;
      this.started = false;
    }
    onEnter() {}
    onExit() {}
    update() {}
    render() {}
    onResize() {}
  }

  class SceneManager {
    constructor(game) {
      this.game = game;
      this.scenes = new Map();
      this.current = null;
      this.currentName = '';
      this.pending = null;
    }

    add(name, scene) {
      if (typeof scene === 'function') scene = new scene(this.game);
      scene.game = this.game;
      this.scenes.set(name, scene);
      return scene;
    }

    has(name) {
      return this.scenes.has(name);
    }

    switch(name, data = null) {
      if (!this.scenes.has(name)) {
        console.warn(`[KGB Scenes] Missing scene: ${name}`);
        return;
      }
      this.pending = { name, data };
    }

    applyPending() {
      if (!this.pending) return;
      const { name, data } = this.pending;
      this.pending = null;
      if (this.current && typeof this.current.onExit === 'function') this.current.onExit(name, data);
      this.current = this.scenes.get(name);
      this.currentName = name;
      if (this.current && typeof this.current.onEnter === 'function') this.current.onEnter(data);
    }

    update(dt) {
      this.applyPending();
      if (this.current && typeof this.current.update === 'function') this.current.update(dt);
      this.applyPending();
    }

    render(renderer, dt) {
      if (this.current && typeof this.current.render === 'function') this.current.render(renderer, dt);
    }

    resize() {
      if (this.current && typeof this.current.onResize === 'function') this.current.onResize();
    }
  }

  KGB.Scene = Scene;
  KGB.SceneManager = SceneManager;
})(window);
