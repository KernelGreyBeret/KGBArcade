// ninja-panda.js — Ninja Panda v3
(() => {
  const IMG_URL = "ninja-panda.png"; // update if needed

  function injectStyles() {
    const css = `
      .ninja-panda {
        position: fixed;
        width: 86px;
        height: 110px;
        z-index: 9999;
        pointer-events: auto;
        transform: translate3d(0,0,0);
      }

      .ninja-panda-inner {
        position: relative;
        width: 100%;
        height: 100%;
      }

      .ninja-panda-head {
        width: 86px;
        height: 86px;
        border-radius: 50%;
        overflow: hidden;
        position: relative;
        margin: 0 auto;
      }
      .ninja-panda-head img {
        width: 100%;
        height: 100%;
        display: block;
        filter: drop-shadow(0 4px 10px rgba(0,0,0,0.7));
      }

      /* Simple ninja cloak/body */
      .ninja-panda-body {
        position: absolute;
        left: 50%;
        bottom: 4px;
        transform: translateX(-50%);
        width: 46px;
        height: 28px;
        background: radial-gradient(circle at 50% 0%, #111 0%, #030509 65%, #000 100%);
        border-radius: 60% 60% 12px 12px;
        box-shadow: 0 3px 10px rgba(0,0,0,0.8);
      }
      .ninja-panda-body::before,
      .ninja-panda-body::after {
        content: "";
        position: absolute;
        top: 3px;
        width: 18px;
        height: 22px;
        background: #050811;
        border-radius: 16px;
        box-shadow: 0 0 6px rgba(0,0,0,0.6);
      }
      .ninja-panda-body::before {
        left: -10px;
      }
      .ninja-panda-body::after {
        right: -10px;
      }

      .ninja-panda-shadow {
        position: absolute;
        left: 50%;
        bottom: -6px;
        transform: translateX(-50%);
        width: 52px;
        height: 12px;
        background: radial-gradient(circle, rgba(0,0,0,0.6) 0%, transparent 60%);
        opacity: 0.7;
      }

      .ninja-panda .np-speech {
        position: absolute;
        left: 50%;
        bottom: 100%;
        transform: translate(-50%, 10px);
        background: rgba(0,0,0,0.85);
        color: #fff;
        font: 700 11px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        padding: 6px 10px;
        border-radius: 10px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.18s ease, transform 0.18s ease;
      }
      .ninja-panda:hover .np-speech {
        opacity: 1;
        transform: translate(-50%, -4px);
      }

      /* Horizontal dash paths */
      @keyframes np-run-right {
        from { left: -130px; }
        to   { left: calc(100vw + 130px); }
      }
      @keyframes np-run-left {
        from { right: -130px; }
        to   { right: calc(100vw + 130px); }
      }
      .np-run-right {
        animation: np-run-right 9s linear forwards;
      }
      .np-run-left {
        animation: np-run-left 9s linear forwards;
      }

      /* Zipline diagonals */
      @keyframes np-zip-lr {
        from { left: -130px; top: 8vh; }
        to   { left: calc(100vw + 130px); top: 70vh; }
      }
      @keyframes np-zip-rl {
        from { right: -130px; top: 8vh; }
        to   { right: calc(100vw + 130px); top: 70vh; }
      }
      .np-zip-lr {
        animation: np-zip-lr 8s linear forwards;
      }
      .np-zip-rl {
        animation: np-zip-rl 8s linear forwards;
      }

      /* Tiny hop when dodging cursor */
      .np-hop {
        animation: np-hop 0.22s ease-out;
      }
      @keyframes np-hop {
        0% { transform: translate3d(0,0,0); }
        40% { transform: translate3d(0,-10px,0); }
        100% { transform: translate3d(0,0,0); }
      }

      /* Caught animation */
      .np-caught {
        animation: np-caught 0.55s ease-out forwards;
      }
      @keyframes np-caught {
        to {
          transform: scale(0) rotate(420deg);
          opacity: 0;
        }
      }

      /* Smoke bomb */
      .np-smoke {
        position: fixed;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(220,220,220,0.9) 0%, rgba(120,120,120,0.7) 40%, rgba(40,40,40,0) 70%);
        opacity: 0;
        pointer-events: none;
        z-index: 9998;
        animation: np-smoke 0.5s ease-out forwards;
      }
      @keyframes np-smoke {
        from { transform: scale(0.6); opacity: 0.0; }
        40% { transform: scale(1.1); opacity: 0.9; }
        to   { transform: scale(1.3); opacity: 0.0; }
      }

      /* Shuriken */
      .np-shuriken {
        position: fixed;
        width: 24px;
        height: 24px;
        z-index: 9999;
        pointer-events: none;
        transform-origin: center center;
        animation: np-shuriken-throw 0.45s ease-out forwards;
      }
      .np-shuriken::before,
      .np-shuriken::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 4px;
        height: 20px;
        background: #4bd5ff;
        border-radius: 999px;
        box-shadow: 0 0 6px rgba(75,213,255,0.8);
        transform: translate(-50%, -50%) rotate(45deg);
      }
      .np-shuriken::after {
        transform: translate(-50%, -50%) rotate(-45deg);
      }
      @keyframes np-shuriken-throw {
        from {
          transform: translate3d(0,0,0) rotate(0deg);
          opacity: 1;
        }
        to {
          transform: translate3d(var(--dx, 0px), var(--dy, -40px), 0) rotate(540deg);
          opacity: 0;
        }
      }

      /* Toast */
      .np-toast {
        position: fixed;
        left: 50%;
        bottom: 18px;
        transform: translate(-50%, 20px);
        background: rgba(6,10,18,0.96);
        color: #fdfdfd;
        padding: 10px 16px;
        border-radius: 999px;
        border: 2px solid #4bd5ff;
        font: 800 13px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: 0.06em;
        text-transform: uppercase;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.25s ease, transform 0.25s ease;
        z-index: 10000;
      }
      .np-toast.show {
        opacity: 1;
        transform: translate(-50%, 0);
      }

      /* Screen shake */
      @keyframes np-shake {
        0% { transform: translate(0, 0); }
        20% { transform: translate(-4px, 2px); }
        40% { transform: translate(3px, -3px); }
        60% { transform: translate(-3px, 3px); }
        80% { transform: translate(4px, -2px); }
        100% { transform: translate(0, 0); }
      }
      .np-shake {
        animation: np-shake 0.25s linear;
      }
    `;
    const style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  let activePanda = null;
  let spawnTimer = null;

  function scheduleSpawn(initialDelay) {
    const delay = initialDelay != null ? initialDelay : 500; // 0.5s between pandas // rand(15000, 45000); // 15–45s
    spawnTimer = window.setTimeout(spawnPanda, delay);
  }

  function spawnSmoke(x, y) {
    const s = document.createElement("div");
    s.className = "np-smoke";
    s.style.left = `${x - 30}px`;
    s.style.top = `${y - 30}px`;
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 550);
  }

  function shurikenTossFrom(panda, targetX, targetY) {
    if (!panda) return;
    const rect = panda.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height * 0.35;

    const sh = document.createElement("div");
    sh.className = "np-shuriken";
    sh.style.left = `${cx - 12}px`;
    sh.style.top = `${cy - 12}px`;

    let dx = (targetX ?? (cx + (Math.random() < 0.5 ? -80 : 80))) - cx;
    let dy = (targetY ?? (cy + rand(-20, 40))) - cy;

    sh.style.setProperty("--dx", `${dx}px`);
    sh.style.setProperty("--dy", `${dy}px`);

    document.body.appendChild(sh);
    setTimeout(() => sh.remove(), 500);
  }

  function spawnPanda() {
    if (activePanda) return;

    const panda = document.createElement("div");
    panda.className = "ninja-panda";

    panda.innerHTML = `
      <div class="ninja-panda-inner">
        <div class="ninja-panda-head">
          <img src="${IMG_URL}" alt="Ninja Panda">
        </div>
        <div class="ninja-panda-body"></div>
        <div class="ninja-panda-shadow"></div>
        <div class="np-speech">No one is coming<br>it’s up to us</div>
      </div>
    `;

    document.body.appendChild(panda);
    activePanda = panda;

    // Choose movement style:
    // 0–0.6: horizontal routes, 0.6–1: zipline
    const styleRoll = Math.random();
    const fromLeft = Math.random() < 0.5;

    if (styleRoll < 0.6) {
      // lane-style run: low, mid, rooftop
      const route = Math.floor(Math.random() * 3);
      let topPx;
      if (route === 0) {
        topPx = window.innerHeight - rand(110, 150); // low
      } else if (route === 1) {
        topPx = window.innerHeight * rand(0.3, 0.55); // mid
      } else {
        topPx = rand(40, 120); // rooftop
      }
      panda.style.top = `${topPx}px`;

      if (fromLeft) {
        panda.style.left = "-130px";
        panda.classList.add("np-run-right");
      } else {
        panda.style.right = "-130px";
        panda.classList.add("np-run-left");
      }
    } else {
      // zipline diagonals (top → bottom)
      if (fromLeft) {
        panda.classList.add("np-zip-lr");
      } else {
        panda.classList.add("np-zip-rl");
      }
    }

    let clickedOnce = false;
    let caught = false;

    panda.addEventListener("click", (e) => {
      e.stopPropagation();
      if (caught) return;

      if (!clickedOnce) {
        clickedOnce = true;
        fightBack(panda);
      } else {
        caught = true;
        handleCatch(panda);
      }
    });

    // Cursor proximity = little hop (desktop)
    let lastMouseMove = 0;
    window.addEventListener(
      "mousemove",
      (ev) => {
        const now = performance.now();
        if (now - lastMouseMove < 120) return;
        lastMouseMove = now;
        if (!activePanda || activePanda !== panda) return;

        const rect = panda.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = ev.clientX - cx;
        const dy = ev.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          panda.classList.remove("np-hop");
          // force reflow
          // eslint-disable-next-line no-unused-expressions
          panda.offsetHeight;
          panda.classList.add("np-hop");
        }
      },
      { passive: true }
    );

    // If he escapes, smoke bomb out
    setTimeout(() => {
      if (activePanda === panda) {
        const rect = panda.getBoundingClientRect();
        panda.remove();
        activePanda = null;
        spawnSmoke(rect.left + rect.width / 2, rect.top + rect.height / 2);
        scheduleSpawn();
      }
    }, 11000);
  }

  function fightBack(panda) {
    // global shake
    document.documentElement.classList.add("np-shake");
    document.body.classList.add("np-shake");
    setTimeout(() => {
      document.documentElement.classList.remove("np-shake");
      document.body.classList.remove("np-shake");
    }, 260);
  }

  function handleCatch(panda) {
    panda.classList.remove("np-run-right", "np-run-left", "np-zip-lr", "np-zip-rl");
    panda.classList.add("np-caught");

    const key = "ninjaPandaCatches";
    const prev = parseInt(localStorage.getItem(key) || "0", 10);
    const now = prev + 1;
    localStorage.setItem(key, String(now));

    // Event hook for rewards / intel pages
    window.dispatchEvent(
      new CustomEvent("ninjaPandaCaught", { detail: { count: now } })
    );

    showToast(
      now === 1
        ? "Ninja Panda Found — Secret Unlocked!"
        : `Ninja Panda Caught ×${now}`
    );

    setTimeout(() => {
      panda.remove();
      if (activePanda === panda) activePanda = null;
      scheduleSpawn();
    }, 550);
  }

  function showToast(msg) {
    const toast = document.createElement("div");
    toast.className = "np-toast";
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 350);
    }, 2300);
  }

  document.addEventListener("DOMContentLoaded", () => {
    injectStyles();

    // first appearance 10–25s
    scheduleSpawn(rand(10000, 25000));

    // Global "missed click" = shuriken toss
    document.addEventListener(
      "click",
      (e) => {
        if (!activePanda) return;
        if (activePanda.contains(e.target)) return; // handled in its own listener
        shurikenTossFrom(activePanda, e.clientX, e.clientY);
      },
      { passive: true }
    );
  });
})();
