window.ForgeSettings = (() => {
  const prefix = 'kgbForge.';
  function get(key, fallback = '') {
    try { return JSON.parse(localStorage.getItem(prefix + key)) ?? fallback; }
    catch { return fallback; }
  }
  function set(key, value) { localStorage.setItem(prefix + key, JSON.stringify(value)); }
  function remove(key) { localStorage.removeItem(prefix + key); }
  return { get, set, remove };
})();
