/*
  KGB Arcade Engine v0.1 — Asset Loader
  Lightweight asset loading for static-hosted browser games.
*/
(function (global) {
  'use strict';

  const KGB = global.KGB || (global.KGB = {});
  const Utils = KGB.Utils;

  class AssetLoader {
    constructor(options = {}) {
      this.basePath = Utils.withTrailingSlash(options.basePath || '');
      this.cache = new Map();
      this.progress = { loaded: 0, total: 0, ratio: 0, current: '', errors: [] };
      this.onProgress = options.onProgress || null;
      this.silent = !!options.silent;
      this.missingImage = null;
    }

    setBasePath(path) {
      this.basePath = Utils.withTrailingSlash(path || '');
    }

    path(src) {
      if (!src) return src;
      if (/^(data:|blob:|https?:|\/)/i.test(src)) return src;
      return Utils.pathJoin(this.basePath, src);
    }

    get(key) {
      return this.cache.get(key);
    }

    has(key) {
      return this.cache.has(key);
    }

    image(key) {
      return this.get(key) || this.get('missing:image') || this.createMissingImage();
    }

    audio(key) {
      return this.get(key) || null;
    }

    json(key) {
      return this.get(key) || null;
    }

    async loadManifest(manifest = {}) {
      const jobs = [];
      const push = (type, item) => {
        if (!item) return;
        const asset = typeof item === 'string' ? { key: item, src: item } : item;
        if (!asset.key || !asset.src) return;
        jobs.push({ type, ...asset });
      };

      (manifest.images || []).forEach((item) => push('image', item));
      (manifest.audio || []).forEach((item) => push('audio', item));
      (manifest.json || []).forEach((item) => push('json', item));
      (manifest.files || []).forEach((item) => push('file', item));

      this.progress = { loaded: 0, total: jobs.length, ratio: jobs.length ? 0 : 1, current: '', errors: [] };
      this.emitProgress();

      await Promise.all(jobs.map((job) => this.loadJob(job)));
      this.progress.ratio = 1;
      this.emitProgress();
      return this;
    }

    async loadJob(job) {
      this.progress.current = job.key;
      try {
        if (this.cache.has(job.key)) return this.cache.get(job.key);
        let result;
        if (job.type === 'image') result = await this.loadImage(job.key, job.src);
        else if (job.type === 'audio') result = await this.loadAudio(job.key, job.src);
        else if (job.type === 'json') result = await this.loadJSON(job.key, job.src);
        else result = await this.loadFile(job.key, job.src);
        return result;
      } catch (err) {
        this.progress.errors.push({ key: job.key, src: job.src, message: err.message || String(err) });
        if (!this.silent) console.warn('[KGB Assets] Missing or failed asset:', job.key, job.src, err);
        if (job.type === 'image') this.cache.set(job.key, this.createMissingImage(job.key));
        return this.cache.get(job.key) || null;
      } finally {
        this.progress.loaded += 1;
        this.progress.ratio = this.progress.total ? this.progress.loaded / this.progress.total : 1;
        this.emitProgress();
      }
    }

    emitProgress() {
      if (typeof this.onProgress === 'function') this.onProgress({ ...this.progress });
    }

    loadImage(key, src) {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          this.cache.set(key, img);
          resolve(img);
        };
        img.onerror = () => reject(new Error(`Image failed to load: ${src}`));
        img.src = this.path(src);
      });
    }

    loadAudio(key, src) {
      return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.preload = 'auto';
        audio.addEventListener('canplaythrough', () => {
          this.cache.set(key, audio);
          resolve(audio);
        }, { once: true });
        audio.addEventListener('error', () => reject(new Error(`Audio failed to load: ${src}`)), { once: true });
        audio.src = this.path(src);
        audio.load();
      });
    }

    async loadJSON(key, src) {
      const res = await fetch(this.path(src), { cache: 'no-cache' });
      if (!res.ok) throw new Error(`JSON failed to load: ${src} (${res.status})`);
      const data = await res.json();
      this.cache.set(key, data);
      return data;
    }

    async loadFile(key, src) {
      const res = await fetch(this.path(src));
      if (!res.ok) throw new Error(`File failed to load: ${src} (${res.status})`);
      const text = await res.text();
      this.cache.set(key, text);
      return text;
    }

    createMissingImage(label = 'missing') {
      if (this.missingImage && label === 'missing') return this.missingImage;
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, 64, 64);
      ctx.strokeStyle = '#ff4d6d';
      ctx.lineWidth = 4;
      ctx.strokeRect(3, 3, 58, 58);
      ctx.beginPath();
      ctx.moveTo(8, 8);
      ctx.lineTo(56, 56);
      ctx.moveTo(56, 8);
      ctx.lineTo(8, 56);
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 8px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(String(label).slice(0, 10), 32, 34);
      const img = new Image();
      img.src = canvas.toDataURL('image/png');
      if (label === 'missing') {
        this.missingImage = img;
        this.cache.set('missing:image', img);
      }
      return img;
    }
  }

  KGB.AssetLoader = AssetLoader;
})(window);
