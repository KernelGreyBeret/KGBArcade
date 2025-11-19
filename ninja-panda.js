// ninja-panda.js
(() => {
  const IMG_URL = "ninja-panda.png"; // change if you put it elsewhere

  function injectStyles() {
    const css = `
      .ninja-panda {
        position: fixed;
        width: 80px;
        height: 80px;
        z-index: 9999;
        pointer-events: auto;
        transform: translate3d(0,0,0);
      }
      .ninja-panda img {
        width: 100%;
        height: 100%;
        display: block;
        filter: drop-shadow(0 4px 10px rgba(0,0,0,0.6));
      }

      .ninja-panda .np-speech {
        position: absolute;
        left: 50%;
        bottom: 100%;
        transform: translate(-50%, 10px);
        background: rgba(0,0,0,0.8);
        color: #fff;
        font: 700 11px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        padding: 6px 10px;
        border-radius: 10px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.2s ease, transform 0.2s ease;
      }
      .ninja-panda:hover .np-speech {
        opacity: 1;
        transform: translate(-50%, -4px);
      }

      /* Left → right dash */
      @keyframes np-run-right {
        from { left: -120px; }
        to   { left: calc(100vw + 120px); }
      }

      /* Right → left dash */
      @keyframes np-run-left {
        from { right: -120px; }
        to   { right: calc(100vw + 120px); }
      }

      .np-run-right {
        animation: np-run-right 6s linear forwards;
      }
      .np-run-left {
        animation: np-run-left 6s linear forwards;
      }

      .np-caught {
        animation: np-caught 0.55s ease-out forwards;
      }
      @keyframes np-caught {
        to {
          transform: scale(0) rotate(420deg);
          opacity: 0;
        }
      }

      /* Tiny toast for rewards */
      .np-toast {
        position: fixed;
        left: 50%;
        bottom: 18px;
        transform: translate(-50%, 20px);
        background: rgba(6, 10, 18, 0.96);
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

      /* Screen shake when he "fights back" */
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

  function spawnPanda() {
    if (activePanda) return;

    const panda = document.createElement("div");
    panda.className = "ninja-panda";

    panda.innerHTML = `
      <img src="${IMG_URL}" alt="Ninja Panda">
      <div class="np-speech">No one is coming<br>it’s up to us</div>
    `;

    document.body.appendChild(panda);
    activePanda = panda;

    const fromLeft = Math.random() < 0.5;
    const top = rand(20, Math.max(100, window.innerHeight - 140));
    panda.style.top = top + "px";
    if (fromLeft) {
      panda.style.left = "-120px";
      panda.classList.add("np-run-right");
    } else {
      panda.style.right = "-120px";
      panda.classList.add("np-run-left");
    }

    let clickedOnce = false;
    let caught = false;

    // First click = he "fights back" with a shake.
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

    // despawn if he gets away
    setTimeout(() => {
      if (activePanda === panda) {
        panda.remove();
        activePanda = null;
        scheduleSpawn(); // schedule next run
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

    showToast(
      now === 1
        ? "Ninja Panda Found — Secret Unlocked!"
        : `Ninja Panda Caught ×${now}`
    );

    // here’s where you can plug in a prize hook
    // e.g. window.location = "/secret-intel.html";
    // or reveal a hidden div, etc.

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