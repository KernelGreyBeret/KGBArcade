(function(){
  const junkPatterns = [
    /^__MACOSX\//, /(^|\/)\.DS_Store$/, /(^|\/)Thumbs\.db$/i, /(^|\/)desktop\.ini$/i,
    /(^|\/)\.git\//, /(^|\/)\.git$/
  ];
  let state = { zip: null, files: [], busy: false };

  function render(root, ctx){
    root.innerHTML = `
      <div class="panel">
        <div class="panel-head">
          <div>
            <div class="panel-title">Repo Forge</div>
            <div class="panel-subtitle">Commit a whole ZIP/folder tree to GitHub from Android or desktop.</div>
          </div>
          <span class="badge">v0.1</span>
        </div>
        <div class="panel-body grid">
          <div class="grid two">
            <div><label>GitHub Token</label><input id="ghToken" type="password" placeholder="Fine-grained PAT with Contents: Read/Write" autocomplete="off"></div>
            <div><label>Owner / Org</label><input id="owner" placeholder="KernelGreyBeret"></div>
            <div><label>Repository</label><input id="repo" placeholder="KGBArcade"></div>
            <div><label>Branch</label><input id="branch" placeholder="main" value="main"></div>
            <div><label>Destination Path</label><input id="dest" placeholder="games/starwarp or leave blank"></div>
            <div><label>Commit Message</label><input id="message" placeholder="Update files from Repo Forge"></div>
          </div>

          <div class="row">
            <label style="margin:0;display:flex;align-items:center;gap:8px;text-transform:none;letter-spacing:0;font-size:14px;color:var(--text)">
              <input id="stripTop" type="checkbox" checked style="width:auto"> Strip single top-level wrapper folder
            </label>
            <label style="margin:0;display:flex;align-items:center;gap:8px;text-transform:none;letter-spacing:0;font-size:14px;color:var(--text)">
              <input id="rememberToken" type="checkbox" style="width:auto"> Remember token locally
            </label>
          </div>

          <div class="divider"></div>

          <div class="grid two">
            <div>
              <label>Select ZIP</label>
              <input id="zipInput" type="file" accept=".zip,application/zip,application/x-zip-compressed">
            </div>
            <div class="grid">
              <label>Actions</label>
              <div class="row">
                <button id="saveFields">Save Fields</button>
                <button id="commitBtn" class="primary" disabled>Commit to GitHub</button>
              </div>
            </div>
          </div>

          <div class="grid two">
            <div class="panel" style="box-shadow:none">
              <div class="panel-head"><div><div class="panel-title">ZIP Preview</div><div id="fileSummary" class="panel-subtitle">No ZIP loaded</div></div></div>
              <div class="panel-body"><div id="fileList" class="file-list"><div class="file-row"><span class="muted">Choose a ZIP to preview files.</span><span></span></div></div></div>
            </div>
            <div class="panel" style="box-shadow:none">
              <div class="panel-head"><div><div class="panel-title">Commit Progress</div><div id="progressText" class="panel-subtitle">Waiting</div></div></div>
              <div class="panel-body grid">
                <div class="progress"><div id="bar"></div></div>
                <div id="log" class="log">Ready.</div>
              </div>
            </div>
          </div>
        </div>
      </div>`;

    loadSaved();
    root.querySelector('#zipInput').addEventListener('change', onZipSelected);
    root.querySelector('#saveFields').addEventListener('click', saveFields);
    root.querySelector('#commitBtn').addEventListener('click', commit);
  }

  function field(id){ return document.getElementById(id); }
  function log(msg){ const el = field('log'); el.textContent += `\n${msg}`; el.scrollTop = el.scrollHeight; }
  function setProgress(done,total,text){
    const pct = total ? Math.round((done/total)*100) : 0;
    field('bar').style.width = pct + '%';
    field('progressText').textContent = text || `${done}/${total}`;
    ForgeUI.setStatus(text || 'Working', `${pct}%`);
  }
  function saveFields(){
    const data = ['owner','repo','branch','dest','message'].reduce((a,id)=>(a[id]=field(id).value.trim(),a),{});
    ForgeSettings.set('repoForge.fields', data);
    if(field('rememberToken').checked) ForgeSettings.set('repoForge.token', field('ghToken').value.trim());
    else ForgeSettings.remove('repoForge.token');
    ForgeNotify.toast('Repo Forge fields saved locally', 'ok');
  }
  function loadSaved(){
    const data = ForgeSettings.get('repoForge.fields', {});
    for(const [k,v] of Object.entries(data)) if(field(k)) field(k).value = v;
    const token = ForgeSettings.get('repoForge.token', '');
    if(token){ field('ghToken').value = token; field('rememberToken').checked = true; }
  }

  async function onZipSelected(e){
    const zipFile = e.target.files?.[0];
    if(!zipFile) return;
    if(!window.JSZip){ ForgeNotify.toast('JSZip failed to load. Check internet/CDN access.', 'error', 6000); return; }
    field('log').textContent = `Loading ${zipFile.name}...`;
    setProgress(0,1,'Reading ZIP');
    try{
      const zip = await JSZip.loadAsync(zipFile);
      state.zip = zip;
      state.files = normalizeFiles(zip);
      renderFileList();
      field('commitBtn').disabled = state.files.length === 0;
      setProgress(1,1,`${state.files.length} files ready`);
      log(`Loaded ${state.files.length} usable files.`);
      ForgeNotify.toast('ZIP loaded', 'ok');
    }catch(err){
      console.error(err); ForgeNotify.toast('Could not read ZIP', 'error'); log(`ERROR: ${err.message}`); setProgress(0,1,'ZIP failed');
    }
  }

  function normalizeFiles(zip){
    let entries = Object.values(zip.files).filter(f => !f.dir && !junkPatterns.some(rx => rx.test(f.name)));
    if(field('stripTop')?.checked){
      const tops = new Set(entries.map(f => f.name.split('/')[0]).filter(Boolean));
      if(tops.size === 1){
        const top = [...tops][0] + '/';
        entries = entries.map(f => {
          f.forgePath = f.name.startsWith(top) ? f.name.slice(top.length) : f.name;
          return f;
        });
      } else entries = entries.map(f => { f.forgePath = f.name; return f; });
    } else entries = entries.map(f => { f.forgePath = f.name; return f; });
    return entries.filter(f => f.forgePath && !junkPatterns.some(rx => rx.test(f.forgePath)));
  }

  function renderFileList(){
    const host = field('fileList');
    const total = state.files.reduce((sum,f)=>sum+(f._data?.uncompressedSize||0),0);
    field('fileSummary').textContent = `${state.files.length} files • ${ForgeUI.fmtBytes(total)}`;
    host.innerHTML = state.files.slice(0,500).map(f => `<div class="file-row"><span>${ForgeUI.escapeHtml(f.forgePath)}</span><span class="muted">${ForgeUI.fmtBytes(f._data?.uncompressedSize||0)}</span></div>`).join('') || '<div class="file-row"><span>No usable files found.</span><span></span></div>';
    if(state.files.length > 500) host.innerHTML += `<div class="file-row"><span class="muted">...and ${state.files.length-500} more</span><span></span></div>`;
  }

  function requireFields(){
    const token = field('ghToken').value.trim();
    const owner = field('owner').value.trim();
    const repo = field('repo').value.trim();
    const branch = field('branch').value.trim() || 'main';
    const message = field('message').value.trim() || 'Update files from Repo Forge';
    const dest = cleanPath(field('dest').value.trim());
    if(!token || !owner || !repo || !branch) throw new Error('Token, owner, repository, and branch are required.');
    if(!state.files.length) throw new Error('Select a ZIP first.');
    return { token, owner, repo, branch, message, dest };
  }

  async function commit(){
    if(state.busy) return;
    state.busy = true; field('commitBtn').disabled = true; field('log').textContent = 'Starting GitHub commit...'; setProgress(0,state.files.length+5,'Starting');
    try{
      saveFields();
      const cfg = requireFields();
      const api = githubApi(cfg);
      log(`Repo: ${cfg.owner}/${cfg.repo}#${cfg.branch}`);
      log('Reading branch ref...');
      const ref = await api(`/git/ref/heads/${encodeURIComponent(cfg.branch)}`);
      const headSha = ref.object.sha;
      log(`HEAD: ${headSha.slice(0,7)}`);
      setProgress(1,state.files.length+5,'Reading current commit');
      const commit = await api(`/git/commits/${headSha}`);
      const baseTree = commit.tree.sha;
      setProgress(2,state.files.length+5,'Creating blobs');

      const tree = [];
      let done = 2;
      for(const f of state.files){
        const arr = await f.async('arraybuffer');
        const b64 = arrayBufferToBase64(arr);
        const blob = await api('/git/blobs', 'POST', { content: b64, encoding: 'base64' });
        const path = cleanPath([cfg.dest, f.forgePath].filter(Boolean).join('/'));
        tree.push({ path, mode: '100644', type: 'blob', sha: blob.sha });
        done++;
        setProgress(done, state.files.length+5, `Uploaded blob ${done-2}/${state.files.length}`);
        if((done-2) % 10 === 0 || done-2 === state.files.length) log(`Blobs: ${done-2}/${state.files.length}`);
      }

      log('Creating tree...');
      const newTree = await api('/git/trees', 'POST', { base_tree: baseTree, tree });
      setProgress(state.files.length+3,state.files.length+5,'Creating commit');
      log('Creating commit...');
      const newCommit = await api('/git/commits', 'POST', { message: cfg.message, tree: newTree.sha, parents: [headSha] });
      setProgress(state.files.length+4,state.files.length+5,'Updating branch');
      log('Updating branch ref...');
      await api(`/git/refs/heads/${encodeURIComponent(cfg.branch)}`, 'PATCH', { sha: newCommit.sha, force: false });
      setProgress(state.files.length+5,state.files.length+5,'Commit complete');
      log(`SUCCESS: ${newCommit.sha}`);
      ForgeNotify.toast(`Commit complete: ${newCommit.sha.slice(0,7)}`, 'ok', 6000);
    }catch(err){
      console.error(err); log(`ERROR: ${err.message}`); ForgeNotify.toast(err.message || 'Commit failed', 'error', 8000); ForgeUI.setStatus('Error', 'Commit failed');
    }finally{
      state.busy = false; field('commitBtn').disabled = state.files.length === 0;
    }
  }

  function githubApi(cfg){
    const base = `https://api.github.com/repos/${encodeURIComponent(cfg.owner)}/${encodeURIComponent(cfg.repo)}`;
    return async (path, method='GET', body=null) => {
      const res = await fetch(base + path, {
        method,
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `Bearer ${cfg.token}`,
          'X-GitHub-Api-Version': '2022-11-28',
          ...(body ? {'Content-Type':'application/json'} : {})
        },
        body: body ? JSON.stringify(body) : null
      });
      const text = await res.text();
      let data = null; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
      if(!res.ok){
        const msg = data?.message || res.statusText || 'GitHub API error';
        throw new Error(`${res.status} ${msg}`);
      }
      return data;
    };
  }

  function cleanPath(path){ return String(path||'').replace(/\\/g,'/').replace(/^\/+|\/+$/g,'').replace(/\/+/g,'/'); }
  function arrayBufferToBase64(buffer){
    let binary = ''; const bytes = new Uint8Array(buffer); const chunk = 0x8000;
    for(let i=0;i<bytes.length;i+=chunk) binary += String.fromCharCode.apply(null, bytes.subarray(i,i+chunk));
    return btoa(binary);
  }

  ForgeShell.register({
    id:'repo-forge', name:'Repo Forge', icon:'↥', description:'ZIP → GitHub commit', render
  });
})();
