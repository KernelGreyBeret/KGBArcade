// ninja-panda.js — Ninja Panda v2 (routes + cloak + fightback + events)
(() => {
  const IMG_URL = "ninja-panda.png"; // update path if needed

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

      /* simple ninja cloak/body */
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

      /* dash paths */
      @keyframes np-run-right {
        from { left: -130px; }
        to   { left: calc(100vw + 130px); }
      }
      @keyframes np-run-left {
        from { right: -130px; }
        to   { right: calc(100vw + 130px); }
      }

      .np-run-right {
        animation: np-run-right 6s linear forwards;
      }
      .np-run-left {
        animation: np-run-left 6s linear forwards;
      }

      /* tiny hop for "dodge" */
      .np-hop {
        animation: np-hop 0.22s ease-out;
      }
      @keyframes np-hop {
        0% { transform: translate3d(0,0,0); }
        40% { transform: translate3d(0,-10px,0); }
        100% { transform: translate3d(0,0,0); }
      }

      /* caught */
      .np-caught {
        animation: np-caught 0.55s ease-out forwards;
      }
      @keyframes np-caught {
        to {
          transform: scale(0) rotate(420deg);
          opacity: 0;
        }
      }

      /* smoke bomb */
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

      /* toast */
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

      /* screen shake */
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
    const delay = initialDelay != null ? initialDelay : rand(15000, 45000); // 15–45s
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

    // Pick a route: 0=low, 1=mid, 2=rooftop
    const route = Math.floor(Math.random() * 3);
    const fromLeft = Math.random() < 0.5;

    let topPx;
    if (route === 0) {
      // low run
      topPx = window.innerHeight - rand(110, 150);
    } else if (route === 1) {
      // mid run
      topPx = window.innerHeight * rand(0.3, 0.55);
    } else {
      // rooftop-ish
      topPx = rand(40, 120);
    }

    panda.style.top = `${topPx}px`;

    if (fromLeft) {
      panda.style.left = "-130px";
      panda.classList.add("np-run-right");
    } else {
      panda.style.right = "-130px";
      panda.classList.add("np-run-left");
    }

    let clickedOnce = false;
    let caught = false;

    // fightback + catch logic
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

    // little dodge when cursor gets super close (desktop only)
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
          // force reflow to restart animation
          // eslint-disable-next-line no-unused-expressions
          panda.offsetHeight;
          panda.classList.add("np-hop");
        }
      },
      { passive: true }
    );

    // if he gets away: smoke bomb
    setTimeout(() => {
      if (activePanda === panda) {
        const rect = panda.getBoundingClientRect();
        panda.remove();
        activePanda = null;
        spawnSmoke(rect.left + rect.width / 2, rect.top + rect.height / 2);
        scheduleSpawn();
      }
    }, 6500);
  }

  function fightBack(panda) {
    document.documentElement.classList.add("np-shake");
    document.body.classList.add("np-shake");
    setTimeout(() => {
      document.documentElement.classList.remove("np-shake");
      document.body.classList.remove("np-shake");
    }, 260);
  }

  function handleCatch(panda) {
    panda.classList.remove("np-run-right", "np-run-left");
    panda.classList.add("np-caught");

    const key = "ninjaPandaCatches";
    const prev = parseInt(localStorage.getItem(key) || "0", 10);
    const now = prev + 1;
    localStorage.setItem(key, String(now));

    // Global event hook for rewards / intel pages
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
    // first appearance: 10–25s after page load
    scheduleSpawn(rand(10000, 25000));
  });
})();
