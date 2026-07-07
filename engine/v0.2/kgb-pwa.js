/*
  KGB Arcade Engine v0.1 — PWA Helpers
*/
(function (global) {
  'use strict';

  const KGB = global.KGB || (global.KGB = {});

  class PWAHelper {
    static async register(serviceWorkerPath = './service-worker.js') {
      if (!('serviceWorker' in navigator)) return { ok: false, reason: 'serviceWorker unsupported' };
      if (!window.isSecureContext && location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
        return { ok: false, reason: 'secure context required' };
      }
      try {
        const registration = await navigator.serviceWorker.register(serviceWorkerPath, { scope: './' });
        return { ok: true, registration };
      } catch (err) {
        console.warn('[KGB PWA] registration failed', err);
        return { ok: false, reason: err.message || String(err) };
      }
    }

    static setupInstallPrompt(buttonSelector = '[data-kgb-install]') {
      let deferredPrompt = null;
      const buttons = Array.from(document.querySelectorAll(buttonSelector));
      const setVisible = (visible) => buttons.forEach((button) => { button.hidden = !visible; });
      setVisible(false);

      window.addEventListener('beforeinstallprompt', (event) => {
        event.preventDefault();
        deferredPrompt = event;
        setVisible(true);
      });

      buttons.forEach((button) => {
        button.addEventListener('click', async () => {
          if (!deferredPrompt) return;
          deferredPrompt.prompt();
          await deferredPrompt.userChoice.catch(() => null);
          deferredPrompt = null;
          setVisible(false);
        });
      });

      window.addEventListener('appinstalled', () => {
        deferredPrompt = null;
        setVisible(false);
      });
    }
  }

  KGB.PWA = PWAHelper;
})(window);
