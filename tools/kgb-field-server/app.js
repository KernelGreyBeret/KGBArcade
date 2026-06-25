const DB_NAME = 'kgb-field-server-v2';
const STORE = 'files';
const $ = selector => document.querySelector(selector);
const zipInput = $('#zipInput');
const folderInput = $('#folderInput');
const launchSelect = $('#launchSelect');
const statusEl = $('#status');
const frame = $('#gameFrame');
const empty = $('#empty');
let currentURL = '';

function status(message, bad = false) {
  statusEl.textContent = message;
  statusEl.classList.toggle('bad', bad);
}

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      if (!request.result.objectStoreNames.contains(STORE)) request.result.createObjectStore(STORE, { keyPath: 'path' });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Each call creates and finishes a new transaction. Nothing asynchronous happens
// between transaction creation and put(), preventing TransactionInactiveError.
async function putFile(record) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onabort = tx.onerror = () => { const error = tx.error || new Error('Database write failed'); db.close(); reject(error); };
    tx.objectStore(STORE).put(record);
  });
}

async function clearFiles() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    tx.oncomplete = () => { db.close(); resolve(); };
    tx.onabort = tx.onerror = () => { const error = tx.error || new Error('Database clear failed'); db.close(); reject(error); };
    tx.objectStore(STORE).clear();
  });
}

function mime(path) {
  const ext = path.split('.').pop().toLowerCase();
  return ({html:'text/html; charset=utf-8',htm:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8',mjs:'text/javascript; charset=utf-8',json:'application/json',png:'image/png',jpg:'image/jpeg',jpeg:'image/jpeg',gif:'image/gif',webp:'image/webp',svg:'image/svg+xml',mp3:'audio/mpeg',wav:'audio/wav',ogg:'audio/ogg',mp4:'video/mp4',webm:'video/webm',woff:'font/woff',woff2:'font/woff2',ttf:'font/ttf'})[ext] || 'application/octet-stream';
}

function u16(v, o) { return v.getUint16(o, true); }
function u32(v, o) { return v.getUint32(o, true); }

async function inflateRaw(bytes) {
  if (!('DecompressionStream' in window)) throw new Error('This browser cannot decompress ZIP files. Update Chrome and try again.');
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

async function unzip(file) {
  const buffer = await file.arrayBuffer();
  const view = new DataView(buffer);
  const bytes = new Uint8Array(buffer);
  let eocd = -1;
  for (let i = Math.max(0, bytes.length - 65557); i <= bytes.length - 22; i++) {
    if (u32(view, i) === 0x06054b50) eocd = i;
  }
  if (eocd < 0) throw new Error('That file is not a readable ZIP archive.');
  const count = u16(view, eocd + 10);
  let cursor = u32(view, eocd + 16);
  const decoder = new TextDecoder('utf-8');
  const entries = [];
  for (let n = 0; n < count; n++) {
    if (u32(view, cursor) !== 0x02014b50) throw new Error('Invalid ZIP directory.');
    const method = u16(view, cursor + 10);
    const compressedSize = u32(view, cursor + 20);
    const nameLength = u16(view, cursor + 28);
    const extraLength = u16(view, cursor + 30);
    const commentLength = u16(view, cursor + 32);
    const localOffset = u32(view, cursor + 42);
    const name = decoder.decode(bytes.slice(cursor + 46, cursor + 46 + nameLength)).replace(/\\/g, '/').replace(/^\/+/, '');
    cursor += 46 + nameLength + extraLength + commentLength;
    if (!name || name.endsWith('/') || name.includes('../') || name.startsWith('__MACOSX/')) continue;
    if (u32(view, localOffset) !== 0x04034b50) throw new Error(`Invalid ZIP entry: ${name}`);
    const localNameLength = u16(view, localOffset + 26);
    const localExtraLength = u16(view, localOffset + 28);
    const start = localOffset + 30 + localNameLength + localExtraLength;
    const compressed = bytes.slice(start, start + compressedSize);
    let output;
    if (method === 0) output = compressed;
    else if (method === 8) output = await inflateRaw(compressed);
    else throw new Error(`Unsupported ZIP compression in ${name}.`);
    entries.push({ path: name, bytes: output, type: mime(name) });
  }
  return entries;
}

function stripCommonFolder(records) {
  if (!records.length) return records;
  const firstParts = records[0].path.split('/');
  if (firstParts.length < 2) return records;
  const root = firstParts[0] + '/';
  if (!records.every(r => r.path.startsWith(root))) return records;
  return records.map(r => ({ ...r, path: r.path.slice(root.length) }));
}

async function saveRecords(records) {
  records = stripCommonFolder(records).filter(r => r.path);
  if (!records.length) throw new Error('No usable files were found.');
  await clearFiles();
  for (let i = 0; i < records.length; i++) {
    status(`Saving ${i + 1} of ${records.length}: ${records[i].path}`);
    await putFile(records[i]);
  }
  populateLaunchers(records.map(r => r.path));
  localStorage.setItem('kgb-field-files', JSON.stringify(records.map(r => r.path)));
  status(`Ready — ${records.length} files loaded.`);
}

function populateLaunchers(paths) {
  const html = paths.filter(p => /\.html?$/i.test(p));
  launchSelect.replaceChildren();
  for (const path of html) launchSelect.add(new Option(path, path));
  const preferred = html.find(p => p.toLowerCase() === 'index.html') || html[0];
  if (preferred) launchSelect.value = preferred;
  $('#launchBtn').disabled = !preferred;
}

async function importZip(file) {
  status('Extracting ZIP…');
  const records = await unzip(file);
  await saveRecords(records);
}

async function importFolder(files) {
  status('Reading folder…');
  const records = [];
  for (const file of files) {
    const path = file.webkitRelativePath || file.name;
    records.push({ path, bytes: new Uint8Array(await file.arrayBuffer()), type: file.type || mime(path) });
  }
  await saveRecords(records);
}

function report(error) {
  console.error(error);
  status(error?.message || String(error), true);
  alert(`Could not load game:\n\n${error?.message || error}`);
}

zipInput.addEventListener('change', async () => {
  const file = zipInput.files[0];
  if (!file) return;
  try { await importZip(file); } catch (error) { report(error); }
  zipInput.value = '';
});

folderInput.addEventListener('change', async () => {
  if (!folderInput.files.length) return;
  try { await importFolder([...folderInput.files]); } catch (error) { report(error); }
  folderInput.value = '';
});

function launch() {
  if (!launchSelect.value) return;
  currentURL = `./__game__/${launchSelect.value}?v=${Date.now()}`;
  frame.src = currentURL;
  frame.hidden = false;
  empty.hidden = true;
  $('#stage').classList.add('playing');
}

$('#launchBtn').addEventListener('click', launch);
$('#reloadBtn').addEventListener('click', () => { if (currentURL) frame.src = currentURL.replace(/v=\d+/, `v=${Date.now()}`); });
$('#tabBtn').addEventListener('click', () => { if (currentURL) window.open(currentURL, '_blank'); });
$('#fullBtn').addEventListener('click', () => $('#stage').requestFullscreen?.());
$('#clearBtn').addEventListener('click', async () => {
  if (!confirm('Remove the loaded game from this device?')) return;
  try {
    await clearFiles(); localStorage.removeItem('kgb-field-files'); populateLaunchers([]);
    frame.hidden = true; frame.src = 'about:blank'; empty.hidden = false; currentURL = ''; status('No game loaded.');
  } catch (error) { report(error); }
});

try { populateLaunchers(JSON.parse(localStorage.getItem('kgb-field-files') || '[]')); } catch { populateLaunchers([]); }

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(async registration => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) {
      status('Field Server updated. Reloading once…');
      location.reload();
    }
  }).catch(report);
} else status('Service workers are unavailable in this browser.', true);
