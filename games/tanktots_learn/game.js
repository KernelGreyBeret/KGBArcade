(() => {
  'use strict';
  const APP_VERSION = '0.2-production-refresh-2';
  const $ = (id) => document.getElementById(id);
  const els = {
    deckPanel: $('deckPanel'), deckGrid: $('deckGrid'), deckToggle: $('deckToggle'),
    mixSelectedBtn: $('mixSelectedBtn'), singleModeBtn: $('singleModeBtn'),
    cardPanel: $('cardPanel'), learnCard: $('learnCard'), imageWrap: $('imageWrap'), cardImage: $('cardImage'), placeholder: $('placeholder'),
    cardTitle: $('cardTitle'), progressText: $('progressText'), progressFill: $('progressFill'),
    prevBtn: $('prevBtn'), nextBtn: $('nextBtn'), randomBtn: $('randomBtn'), hearBtn: $('hearBtn'),
    soundToggle: $('soundToggle'), soundIcon: $('soundIcon'), toast: $('toast')
  };

  const state = {
    registry: null,
    decks: new Map(),
    activeMeta: null,
    deck: null,
    index: 0,
    mixedMode: localStorage.getItem('ttl_mix_mode') === '1',
    selectedDeckIds: safeJson(localStorage.getItem('ttl_mix_decks'), []),
    soundOn: localStorage.getItem('ttl_sound') !== '0',
    animationTimer: null,
    animationFrames: [],
    animationFrameIndex: 0,
    animationPaused: false,
    activeAudio: null,
    voice: null,
    lastCardKey: '',
    toastTimer: null
  };

  function safeJson(raw, fallback) {
    try {
      const parsed = JSON.parse(raw || '');
      return parsed ?? fallback;
    } catch (_) { return fallback; }
  }

  function cacheBustUrl(url) {
    const u = new URL(url, location.href);
    u.searchParams.set('v', Date.now().toString());
    return u.toString();
  }

  async function fetchJson(url, onlineFirst = true) {
    const attempts = onlineFirst ? [cacheBustUrl(url), url] : [url];
    let lastErr;
    for (const target of attempts) {
      try {
        const res = await fetch(target, { cache: onlineFirst ? 'no-store' : 'default' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return await res.json();
      } catch (err) { lastErr = err; }
    }
    throw new Error(`Could not load ${url}: ${lastErr?.message || lastErr}`);
  }

  function deckBase(meta) {
    return meta?.path ? meta.path.replace(/[^/]+$/, '') : '';
  }

  function resolveDeckUrl(rel, meta = state.activeMeta) {
    if (!rel) return '';
    return new URL(rel, new URL(deckBase(meta || { path: '' }), location.href)).toString();
  }

  function setToast(msg, ms = 2600) {
    if (!msg) return;
    els.toast.textContent = msg;
    els.toast.classList.add('show');
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => els.toast.classList.remove('show'), ms);
  }

  function setSoundIcon() {
    els.soundIcon.src = state.soundOn ? 'assets/ui/btn_sound.png' : 'assets/ui/btn_mute.png';
    els.soundToggle.setAttribute('aria-label', state.soundOn ? 'Sound on' : 'Sound off');
  }

  function stopSpeechAndAudio() {
    try { speechSynthesis.cancel(); } catch (_) {}
    if (state.activeAudio) {
      try { state.activeAudio.pause(); state.activeAudio.currentTime = 0; } catch (_) {}
      state.activeAudio = null;
    }
  }

  function stopAnimation() {
    if (state.animationTimer) clearInterval(state.animationTimer);
    state.animationTimer = null;
    state.animationFrames = [];
    state.animationFrameIndex = 0;
  }

  function pauseAnimation() {
    if (state.animationTimer) clearInterval(state.animationTimer);
    state.animationTimer = null;
    state.animationPaused = true;
  }

  function resumeAnimation() {
    state.animationPaused = false;
    const card = currentCard();
    if (isAnimated(card) && state.animationFrames.length) startAnimation(card, false);
  }

  function preloadImage(src) {
    return new Promise((resolve) => {
      if (!src) return resolve(null);
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.decoding = 'async';
      img.src = src;
    });
  }

  async function preloadCard(card) {
    if (!card) return;
    if (isAnimated(card)) {
      const urls = card.frames.map(frame => resolveDeckUrl(frame, card.__meta));
      await Promise.all(urls.map(preloadImage));
      return;
    }
    if (card.image) await preloadImage(resolveDeckUrl(card.image, card.__meta));
  }

  function preloadNeighbors() {
    const cards = state.deck?.cards || [];
    if (!cards.length) return;
    const prev = cards[(state.index - 1 + cards.length) % cards.length];
    const next = cards[(state.index + 1) % cards.length];
    [prev, next].forEach(card => {
      if (!card) return;
      const src = isAnimated(card) ? card.frames?.[0] : card.image;
      if (src) preloadImage(resolveDeckUrl(src, card.__meta));
    });
  }

  function isAnimated(card) {
    return !!(card && card.type === 'animated' && Array.isArray(card.frames) && card.frames.length);
  }

  function currentCard() {
    return state.deck?.cards?.[state.index] || null;
  }

  function deckDefaults(card = currentCard()) {
    if (state.mixedMode) return card?.__deckDefaults || {};
    return state.deck?.cardDefaults || {};
  }

  function startAnimation(card, reset = true) {
    if (document.hidden) return;
    if (state.animationTimer) clearInterval(state.animationTimer);
    const defaults = deckDefaults(card);
    const fps = Math.max(1, Math.min(30, Number(card.fps || defaults.fps || 8)));
    const loop = card.loop !== false && defaults.loop !== false;
    if (reset) state.animationFrameIndex = 0;
    const show = () => {
      if (!state.animationFrames.length) return;
      els.cardImage.src = state.animationFrames[state.animationFrameIndex];
      if (state.animationFrameIndex >= state.animationFrames.length - 1) {
        if (loop) state.animationFrameIndex = 0;
        else {
          clearInterval(state.animationTimer);
          state.animationTimer = null;
        }
      } else state.animationFrameIndex++;
    };
    show();
    state.animationTimer = setInterval(show, 1000 / fps);
  }

  async function renderCard() {
    stopSpeechAndAudio();
    stopAnimation();
    const card = currentCard();
    const cards = state.deck?.cards || [];
    if (!card) return;

    state.lastCardKey = `${state.deck.id}:${card.__deckId || ''}:${card.id || state.index}:${state.index}`;
    els.learnCard.classList.remove('pop'); void els.learnCard.offsetWidth; els.learnCard.classList.add('pop');
    els.cardTitle.textContent = card.title || 'TankTots';

    const deckLabel = state.mixedMode ? 'Mixed Decks' : (state.deck.title || 'Deck');
    els.progressText.textContent = `${deckLabel} • ${state.index + 1} of ${cards.length}`;
    els.progressFill.style.width = `${cards.length ? ((state.index + 1) / cards.length) * 100 : 0}%`;
    els.cardImage.hidden = false;
    els.placeholder.hidden = true;
    els.cardImage.alt = card.title || '';

    if (isAnimated(card)) {
      state.animationFrames = card.frames.map(frame => resolveDeckUrl(frame, card.__meta));
      els.cardImage.src = state.animationFrames[0];
      await preloadCard(card);
      if (state.lastCardKey === `${state.deck.id}:${card.__deckId || ''}:${card.id || state.index}:${state.index}`) startAnimation(card, true);
    } else if (card.image) {
      const src = resolveDeckUrl(card.image, card.__meta);
      els.cardImage.src = src;
      preloadImage(src);
    } else {
      els.cardImage.hidden = true;
      els.placeholder.hidden = false;
      els.placeholder.textContent = '?';
    }
    preloadNeighbors();
  }

  function renderDeckGrid() {
    const metas = state.registry?.decks || [];
    if (!state.selectedDeckIds.length && metas.length) state.selectedDeckIds = [metas[0].id];
    els.deckGrid.innerHTML = '';
    metas.forEach(meta => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'deck-card';
      btn.dataset.deckId = meta.id;
      const checked = state.selectedDeckIds.includes(meta.id) ? 'checked' : '';
      btn.innerHTML = `
        <img src="${escapeAttr(meta.cover || '')}" alt="">
        <span>
          <span class="deck-title">${escapeHtml(meta.title || meta.id)}</span>
          <span class="deck-subtitle">${escapeHtml(meta.subtitle || 'Learning deck')}</span>
          <span class="deck-count" data-count-for="${escapeHtml(meta.id)}">Tap to load</span>
        </span>
        <input class="deck-check" type="checkbox" aria-label="Include ${escapeAttr(meta.title || meta.id)} in mix" ${checked}>`;
      btn.addEventListener('click', (event) => {
        const rect = btn.getBoundingClientRect();
        const wasCheckboxArea = event.clientX > rect.right - 58;
        if (wasCheckboxArea) toggleDeckSelection(meta.id);
        else loadDeck(meta.id);
      });
      btn.addEventListener('contextmenu', (event) => { event.preventDefault(); toggleDeckSelection(meta.id); });
      els.deckGrid.appendChild(btn);
    });
    updateActiveDeckUI();
  }

  function toggleDeckSelection(id) {
    const set = new Set(state.selectedDeckIds);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    if (!set.size) set.add(id);
    state.selectedDeckIds = [...set];
    localStorage.setItem('ttl_mix_decks', JSON.stringify(state.selectedDeckIds));
    updateActiveDeckUI();
  }

  function updateActiveDeckUI() {
    document.querySelectorAll('.deck-card').forEach(el => {
      const id = el.dataset.deckId;
      el.classList.toggle('active', !state.mixedMode && id === state.activeMeta?.id);
      el.classList.toggle('mixed', state.mixedMode && state.selectedDeckIds.includes(id));
      const check = el.querySelector('.deck-check');
      if (check) check.checked = state.selectedDeckIds.includes(id);
    });
  }

  async function getDeck(meta) {
    let deck = state.decks.get(meta.id);
    if (!deck) {
      deck = await fetchJson(meta.path, true);
      deck.__meta = meta;
      state.decks.set(meta.id, deck);
      const countEl = document.querySelector(`[data-count-for="${cssEscape(meta.id)}"]`);
      if (countEl) countEl.textContent = `${deck.cards?.length || 0} cards`;
    }
    return deck;
  }

  function decorateCards(deck, meta) {
    return (deck.cards || []).map((card, i) => ({
      ...card,
      __deckId: meta.id,
      __deckTitle: deck.title || meta.title || meta.id,
      __meta: meta,
      __deckDefaults: deck.cardDefaults || {},
      __sourceIndex: i
    }));
  }

  async function loadDeck(deckId) {
    const meta = (state.registry?.decks || []).find(d => d.id === deckId) || state.registry?.decks?.[0];
    if (!meta) throw new Error('No decks found.');
    state.mixedMode = false;
    localStorage.setItem('ttl_mix_mode', '0');
    state.activeMeta = meta;
    updateActiveDeckUI();
    const deck = await getDeck(meta);
    state.deck = { ...deck, cards: decorateCards(deck, meta) };
    const saved = Number(localStorage.getItem(`ttl_${deck.id}_index`) || 0);
    state.index = Math.max(0, Math.min(saved, (state.deck.cards?.length || 1) - 1));
    localStorage.setItem('ttl_last_deck', meta.id);
    await renderCard();
    els.deckPanel.classList.remove('open');
  }

  function shuffle(array) {
    const out = [...array];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  async function loadMixedDeck() {
    const metas = (state.registry?.decks || []).filter(meta => state.selectedDeckIds.includes(meta.id));
    if (!metas.length) return setToast('Pick at least one deck.');
    const parts = [];
    for (const meta of metas) {
      const deck = await getDeck(meta);
      parts.push(...decorateCards(deck, meta));
    }
    state.mixedMode = true;
    localStorage.setItem('ttl_mix_mode', '1');
    localStorage.setItem('ttl_mix_decks', JSON.stringify(state.selectedDeckIds));
    state.activeMeta = metas[0];
    state.deck = { id: 'mixed', title: 'Mixed Decks', cards: shuffle(parts), cardDefaults: {} };
    state.index = 0;
    updateActiveDeckUI();
    await renderCard();
    els.deckPanel.classList.remove('open');
    setToast('Mixed decks shuffled!', 1600);
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }
  function escapeAttr(str) { return escapeHtml(str); }
  function cssEscape(value) {
    return window.CSS && CSS.escape ? CSS.escape(value) : String(value).replace(/[^a-zA-Z0-9_-]/g, '\\$&');
  }

  function go(delta) {
    const cards = state.deck?.cards || [];
    if (!cards.length) return;
    state.index = (state.index + delta + cards.length) % cards.length;
    if (!state.mixedMode) localStorage.setItem(`ttl_${state.deck.id}_index`, String(state.index));
    renderCard();
  }

  function randomCard() {
    const cards = state.deck?.cards || [];
    if (!cards.length) return;
    if (cards.length === 1) return renderCard();
    let next = state.index;
    while (next === state.index) next = Math.floor(Math.random() * cards.length);
    state.index = next;
    if (!state.mixedMode) localStorage.setItem(`ttl_${state.deck.id}_index`, String(state.index));
    renderCard();
  }

  function spokenText(card) {
    return card?.soundText || card?.prompt || card?.spoken || card?.title || '';
  }

  function chooseVoice() {
    const voices = speechSynthesis.getVoices?.() || [];
    if (!voices.length) return null;
    const english = voices.filter(v => /^en[-_]?/i.test(v.lang || '') || /english/i.test(v.name));
    const candidates = english.length ? english : voices;
    const maleHints = [
      /google uk english male/i,
      /microsoft david/i,
      /microsoft mark/i,
      /daniel/i,
      /alex/i,
      /fred/i,
      /microsoft guy/i,
      /google us english/i
    ];
    for (const hint of maleHints) {
      const found = candidates.find(v => hint.test(v.name));
      if (found) return found;
    }
    return candidates[0] || null;
  }

  try {
    speechSynthesis.onvoiceschanged = () => { state.voice = chooseVoice(); };
  } catch (_) {}

  async function speakCard() {
    const card = currentCard();
    if (!card) return;
    stopSpeechAndAudio();
    els.learnCard.classList.remove('bounce'); void els.learnCard.offsetWidth; els.learnCard.classList.add('bounce');

    const text = spokenText(card);
    if (text) setToast(text, 2800);

    const audioPath = card.audio ? resolveDeckUrl(card.audio, card.__meta) : '';
    if (state.soundOn && audioPath) {
      try {
        const audio = new Audio(audioPath);
        state.activeAudio = audio;
        await audio.play();
        return;
      } catch (_) { state.activeAudio = null; }
    }

    if (!state.soundOn || !text) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.84;
      u.pitch = 0.82;
      u.volume = 1;
      state.voice = state.voice || chooseVoice();
      if (state.voice) u.voice = state.voice;
      speechSynthesis.speak(u);
    } catch (_) {}
  }

  async function init() {
    setSoundIcon();
    try {
      if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
        navigator.serviceWorker.register('./service-worker.js').then(reg => reg.update?.()).catch(() => {});
      }
      state.registry = await fetchJson('decks/index.json', true);
      if (!Array.isArray(state.selectedDeckIds) || !state.selectedDeckIds.length) {
        state.selectedDeckIds = [state.registry.defaultDeck || state.registry.decks?.[0]?.id].filter(Boolean);
      }
      renderDeckGrid();
      state.voice = chooseVoice();
      const defaultDeck = localStorage.getItem('ttl_last_deck') || state.registry.defaultDeck || state.registry.decks?.[0]?.id;
      if (state.mixedMode && state.selectedDeckIds.length > 1) await loadMixedDeck();
      else await loadDeck(defaultDeck);

      for (const meta of state.registry.decks || []) {
        if (state.decks.has(meta.id)) continue;
        fetchJson(meta.path, true).then(deck => {
          deck.__meta = meta;
          state.decks.set(meta.id, deck);
          const countEl = document.querySelector(`[data-count-for="${cssEscape(meta.id)}"]`);
          if (countEl) countEl.textContent = `${deck.cards?.length || 0} cards`;
        }).catch(() => {});
      }
    } catch (err) {
      els.cardTitle.textContent = 'Decks could not load';
      els.progressText.textContent = 'Check the server path';
      els.cardImage.hidden = true;
      els.placeholder.hidden = false;
      els.placeholder.textContent = '!';
      setToast('Deck load failed. Use a local static server from the app folder.', 4200);
      console.error(err);
    }
  }

  els.deckToggle.addEventListener('click', () => els.deckPanel.classList.toggle('open'));
  els.mixSelectedBtn.addEventListener('click', loadMixedDeck);
  els.singleModeBtn.addEventListener('click', () => {
    const id = state.activeMeta?.id || state.selectedDeckIds[0] || state.registry?.defaultDeck;
    if (id) loadDeck(id);
  });
  els.soundToggle.addEventListener('click', () => {
    state.soundOn = !state.soundOn;
    localStorage.setItem('ttl_sound', state.soundOn ? '1' : '0');
    setSoundIcon();
    if (!state.soundOn) stopSpeechAndAudio();
    setToast(state.soundOn ? 'Sound on' : 'Sound off', 1400);
  });
  els.prevBtn.addEventListener('click', () => go(-1));
  els.nextBtn.addEventListener('click', () => go(1));
  els.randomBtn.addEventListener('click', randomCard);
  els.hearBtn.addEventListener('click', speakCard);

  let swipeStartX = 0, swipeStartY = 0, swipeStartT = 0, swipeMoved = false;
  els.learnCard.addEventListener('pointerdown', e => {
    swipeStartX = e.clientX;
    swipeStartY = e.clientY;
    swipeStartT = Date.now();
    swipeMoved = false;
  }, { passive: true });
  els.learnCard.addEventListener('pointermove', e => {
    const dx = e.clientX - swipeStartX;
    const dy = e.clientY - swipeStartY;
    if (Math.abs(dx) > 12 || Math.abs(dy) > 12) swipeMoved = true;
  }, { passive: true });
  els.learnCard.addEventListener('pointerup', e => {
    const dx = e.clientX - swipeStartX;
    const dy = e.clientY - swipeStartY;
    const dt = Date.now() - swipeStartT;
    const isSwipe = Math.abs(dx) >= 45 && Math.abs(dx) > Math.abs(dy) * 1.4 && dt < 700;
    if (isSwipe) {
      e.preventDefault();
      if (dx < 0) go(1);
      else go(-1);
      return;
    }
    if (!swipeMoved) speakCard();
  }, { passive: false });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
    if (e.key.toLowerCase() === 'r') randomCard();
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); speakCard(); }
    if (e.key === 'Escape') els.deckPanel.classList.toggle('open');
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { pauseAnimation(); stopSpeechAndAudio(); }
    else resumeAnimation();
  });

  window.addEventListener('pagehide', () => { stopAnimation(); stopSpeechAndAudio(); });
  init();
})();
