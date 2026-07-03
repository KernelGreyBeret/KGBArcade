window.ForgeShell = (() => {
  const modules = new Map();
  let active = null;

  function register(mod) {
    if (!mod?.id || !mod?.name || typeof mod.render !== 'function') throw new Error('Invalid module');
    modules.set(mod.id, mod);
  }

  function boot() {
    renderModuleList();
    wireShellControls();
    const last = ForgeSettings.get('activeModule', 'repo-forge');
    open(modules.has(last) ? last : modules.keys().next().value);
  }

  function renderModuleList() {
    const host = ForgeUI.qs('#moduleList');
    host.innerHTML = '';
    for (const mod of modules.values()) {
      const btn = document.createElement('button');
      btn.className = 'module-btn';
      btn.dataset.moduleId = mod.id;
      btn.innerHTML = `
        <span class="module-icon">${ForgeUI.escapeHtml(mod.icon || '◆')}</span>
        <span class="module-meta">
          <span class="module-name">${ForgeUI.escapeHtml(mod.name)}</span>
          <span class="module-desc">${ForgeUI.escapeHtml(mod.description || '')}</span>
        </span>`;
      btn.addEventListener('click', () => open(mod.id));
      host.appendChild(btn);
    }
  }

  function open(id) {
    const mod = modules.get(id);
    if (!mod) return;
    if (active?.destroy) active.destroy();
    active = mod;
    ForgeSettings.set('activeModule', id);
    ForgeUI.qsa('.module-btn').forEach(b => b.classList.toggle('active', b.dataset.moduleId === id));
    const workspace = ForgeUI.qs('#workspace');
    workspace.innerHTML = '';
    mod.render(workspace, { setStatus: ForgeUI.setStatus, toast: ForgeNotify.toast, modal: ForgeUI.modal });
    ForgeUI.setStatus(`${mod.name} loaded`, 'Ready');
  }

  function wireShellControls() {
    ForgeUI.qs('#collapseSidebar').addEventListener('click', () => ForgeUI.qs('#sidebar').classList.toggle('collapsed'));
    ForgeUI.qs('#btnOpenModule').addEventListener('click', () => active && open(active.id));
    ForgeUI.qs('#btnSaveSettings').addEventListener('click', () => { ForgeNotify.toast('Settings saved locally', 'ok'); });
    ForgeUI.qs('#btnClearStatus').addEventListener('click', () => ForgeUI.setStatus('Ready', 'Idle'));
    ForgeUI.qs('#btnAbout').addEventListener('click', () => ForgeUI.modal('KGB Forge v0.1', '<p>KGB Forge is the shared static shell for production utilities. Current module: Repo Forge.</p><p>No server. No framework. Just HTML, CSS, and JavaScript.</p>'));
    ForgeUI.qsa('.menubar button').forEach(btn => btn.addEventListener('click', () => ForgeNotify.toast(`${btn.textContent} menu placeholder`, 'info')));
  }

  return { register, boot, open };
})();
