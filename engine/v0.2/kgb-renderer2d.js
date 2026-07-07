/*
  KGB Arcade Engine v0.1 — Renderer2D
  Practical Canvas 2D helpers for sprites, camera, shake, parallax, shapes, panels, text, and debug.
*/
(function (global) {
  'use strict';

  const KGB = global.KGB || (global.KGB = {});
  const Utils = KGB.Utils;

  class Renderer2D {
    constructor(canvas, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d', { alpha: options.alpha ?? false });
      this.width = 0;
      this.height = 0;
      this.dpr = 1;
      this.camera = { x: 0, y: 0, zoom: 1 };
      this.shakeTime = 0;
      this.shakeDuration = 0;
      this.shakeStrength = 0;
      this.debug = false;
    }

    resize(width = window.innerWidth, height = window.innerHeight, maxDpr = 2) {
      this.dpr = Math.min(maxDpr, window.devicePixelRatio || 1);
      this.width = Math.floor(width);
      this.height = Math.floor(height);
      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);
      this.canvas.style.width = `${this.width}px`;
      this.canvas.style.height = `${this.height}px`;
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.ctx.imageSmoothingEnabled = false;
    }

    clear(color = '#000') {
      const ctx = this.ctx;
      ctx.save();
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.restore();
    }

    beginWorld(dt = 0) {
      const ctx = this.ctx;
      ctx.save();
      let sx = 0;
      let sy = 0;
      if (this.shakeTime > 0) {
        this.shakeTime = Math.max(0, this.shakeTime - dt);
        const t = this.shakeDuration ? this.shakeTime / this.shakeDuration : 0;
        const strength = this.shakeStrength * t;
        sx = Utils.rand(-strength, strength);
        sy = Utils.rand(-strength, strength);
      }
      ctx.translate(sx, sy);
      ctx.scale(this.camera.zoom, this.camera.zoom);
      ctx.translate(-this.camera.x, -this.camera.y);
    }

    endWorld() {
      this.ctx.restore();
    }

    setCamera(x = 0, y = 0, zoom = 1) {
      this.camera.x = x;
      this.camera.y = y;
      this.camera.zoom = zoom;
    }

    shake(strength = 8, duration = 0.18) {
      this.shakeStrength = strength;
      this.shakeDuration = duration;
      this.shakeTime = duration;
    }

    worldToScreen(x, y) {
      return {
        x: (x - this.camera.x) * this.camera.zoom,
        y: (y - this.camera.y) * this.camera.zoom
      };
    }

    screenToWorld(x, y) {
      return {
        x: x / this.camera.zoom + this.camera.x,
        y: y / this.camera.zoom + this.camera.y
      };
    }

    image(img, x, y, w, h, options = {}) {
      if (!img) return;
      const ctx = this.ctx;
      ctx.save();
      const alpha = options.alpha ?? 1;
      if (alpha !== 1) ctx.globalAlpha = alpha;
      if (options.rotation || options.flipX || options.flipY) {
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate(options.rotation || 0);
        ctx.scale(options.flipX ? -1 : 1, options.flipY ? -1 : 1);
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
      } else {
        ctx.drawImage(img, x, y, w, h);
      }
      ctx.restore();
    }

    sprite(img, sx, sy, sw, sh, x, y, w, h, options = {}) {
      if (!img) return;
      const ctx = this.ctx;
      ctx.save();
      if (options.alpha !== undefined) ctx.globalAlpha = options.alpha;
      if (options.rotation || options.flipX || options.flipY) {
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate(options.rotation || 0);
        ctx.scale(options.flipX ? -1 : 1, options.flipY ? -1 : 1);
        ctx.drawImage(img, sx, sy, sw, sh, -w / 2, -h / 2, w, h);
      } else {
        ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
      }
      ctx.restore();
    }

    rect(x, y, w, h, color = '#fff', options = {}) {
      const ctx = this.ctx;
      ctx.save();
      ctx.globalAlpha = options.alpha ?? 1;
      ctx.fillStyle = color;
      if (options.radius) this.roundRectPath(x, y, w, h, options.radius);
      else ctx.rect(x, y, w, h);
      ctx.fill();
      if (options.stroke) {
        ctx.lineWidth = options.lineWidth || 2;
        ctx.strokeStyle = options.stroke;
        ctx.stroke();
      }
      ctx.restore();
    }

    circle(x, y, r, color = '#fff', options = {}) {
      const ctx = this.ctx;
      ctx.save();
      ctx.globalAlpha = options.alpha ?? 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Utils.TAU);
      if (color) {
        ctx.fillStyle = color;
        ctx.fill();
      }
      if (options.stroke) {
        ctx.lineWidth = options.lineWidth || 2;
        ctx.strokeStyle = options.stroke;
        ctx.stroke();
      }
      ctx.restore();
    }

    line(x1, y1, x2, y2, color = '#fff', width = 2, options = {}) {
      const ctx = this.ctx;
      ctx.save();
      ctx.globalAlpha = options.alpha ?? 1;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = options.cap || 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.restore();
    }

    panel(x, y, w, h, options = {}) {
      this.rect(x, y, w, h, options.fill || 'rgba(6,10,18,.78)', {
        radius: options.radius || 16,
        stroke: options.stroke || 'rgba(255,255,255,.18)',
        lineWidth: options.lineWidth || 2,
        alpha: options.alpha ?? 1
      });
    }

    meter(x, y, w, h, value, options = {}) {
      const pct = Utils.clamp(value, 0, 1);
      this.panel(x, y, w, h, { radius: options.radius || h / 2, fill: options.back || 'rgba(0,0,0,.45)', stroke: options.stroke || 'rgba(255,255,255,.2)', lineWidth: 1 });
      this.rect(x + 3, y + 3, (w - 6) * pct, h - 6, options.fill || '#28D7FF', { radius: Math.max(2, h / 2 - 3) });
    }

    text(text, x, y, options = {}) {
      const ctx = this.ctx;
      ctx.save();
      ctx.font = options.font || '800 20px system-ui, sans-serif';
      ctx.textAlign = options.align || 'left';
      ctx.textBaseline = options.baseline || 'top';
      if (options.shadow) {
        ctx.shadowColor = options.shadow;
        ctx.shadowBlur = options.shadowBlur || 8;
      }
      if (options.stroke) {
        ctx.lineWidth = options.strokeWidth || 4;
        ctx.strokeStyle = options.stroke;
        ctx.strokeText(String(text), x, y);
      }
      ctx.fillStyle = options.fill || '#fff';
      ctx.fillText(String(text), x, y);
      ctx.restore();
    }

    parallaxRect(x, y, w, h, color, factor = 0.5) {
      this.rect(x - this.camera.x * factor, y - this.camera.y * factor, w, h, color);
    }

    debugBox(x, y, w, h, label = '') {
      if (!this.debug) return;
      this.rect(x, y, w, h, 'rgba(255,0,90,.12)', { stroke: '#ff4d6d', lineWidth: 1 });
      if (label) this.text(label, x + 4, y + 4, { font: '700 11px monospace', fill: '#ffb3c1', stroke: '#000', strokeWidth: 2 });
    }

    roundRectPath(x, y, w, h, r) {
      const ctx = this.ctx;
      const radius = Math.min(r, w / 2, h / 2);
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + w, y, x + w, y + h, radius);
      ctx.arcTo(x + w, y + h, x, y + h, radius);
      ctx.arcTo(x, y + h, x, y, radius);
      ctx.arcTo(x, y, x + w, y, radius);
      ctx.closePath();
    }
  }

  KGB.Renderer2D = Renderer2D;
})(window);
