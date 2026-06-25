const CACHE='kgb-field-server-shell-v1';
const DB_NAME='kgb-field-server-v1';
const STORE='files';
const SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(self.clients.claim()); });
function openDB(){ return new Promise((resolve,reject)=>{ const r=indexedDB.open(DB_NAME,1); r.onupgradeneeded=()=>{ const db=r.result; if(!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE,{keyPath:'path'}); if(!db.objectStoreNames.contains('meta')) db.createObjectStore('meta',{keyPath:'key'}); }; r.onsuccess=()=>resolve(r.result); r.onerror=()=>reject(r.error); }); }
function getFile(path){ return openDB().then(db=>new Promise((res,rej)=>{ const tx=db.transaction(STORE,'readonly'); const rq=tx.objectStore(STORE).get(path); rq.onsuccess=()=>res(rq.result); rq.onerror=()=>rej(rq.error); })); }
function fallbackIndex(path){ if(!path || path.endsWith('/')) return path+'index.html'; return path; }
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url); const scope=new URL(self.registration.scope); if(url.origin!==scope.origin) return;
  const scopePath=scope.pathname.endsWith('/')?scope.pathname:scope.pathname+'/';
  if(url.pathname.startsWith(scopePath+'__game__/')){
    e.respondWith((async()=>{
      let rel=decodeURIComponent(url.pathname.slice((scopePath+'__game__/').length)); rel=rel.replace(/^\/+/, ''); rel=fallbackIndex(rel);
      let rec=await getFile(rel);
      if(!rec && rel.endsWith('/index.html')) rec=await getFile(rel.slice(0,-10));
      if(!rec && !/\.html?$/i.test(rel)) rec=await getFile(rel.replace(/\/?$/,'')+'/index.html');
      if(!rec) return new Response(`KGB Field Server: file not found: ${rel}`,{status:404,headers:{'content-type':'text/plain;charset=utf-8'}});
      return new Response(rec.blob,{status:200,headers:{'content-type':rec.type||'application/octet-stream','cache-control':'no-store'}});
    })()); return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).catch(()=>caches.match('./index.html'))));
});
