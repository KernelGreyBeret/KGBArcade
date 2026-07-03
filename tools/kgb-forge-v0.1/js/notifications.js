window.ForgeNotify = (() => {
  function toast(message, type = 'info', ms = 3600) {
    const host = document.getElementById('toastHost');
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.textContent = message;
    host.appendChild(el);
    setTimeout(() => el.remove(), ms);
  }
  return { toast };
})();
