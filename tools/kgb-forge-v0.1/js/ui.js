window.ForgeUI = (() => {
  function qs(sel, root = document) { return root.querySelector(sel); }
  function qsa(sel, root = document) { return [...root.querySelectorAll(sel)]; }
  function setStatus(text, detail = '') {
    qs('#statusText').textContent = text || 'Ready';
    qs('#statusDetail').textContent = detail || 'Idle';
  }
  function modal(title, html) {
    qs('#modalTitle').textContent = title;
    qs('#modalBody').innerHTML = html;
    qs('#modal').showModal();
  }
  function fmtBytes(bytes) {
    if (!bytes) return '0 B';
    const units = ['B','KB','MB','GB'];
    let n = bytes, i = 0;
    while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
    return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
  }
  function escapeHtml(s) {
    return String(s ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }
  return { qs, qsa, setStatus, modal, fmtBytes, escapeHtml };
})();
