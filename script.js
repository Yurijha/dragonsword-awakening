const $ = (s) => document.querySelector(s);
const video = $("#hero-video"),
  motion = $("#motion-toggle");
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
let motionWanted = false;
function updateMotion() {
  motion.setAttribute("aria-pressed", String(motionWanted));
  motion.textContent = motionWanted
    ? "Pause background Ⅱ"
    : "Play background ▷";
  video.classList.toggle("playing", motionWanted);
}
async function playBackground() {
  try {
    await video.play();
    motionWanted = true;
  } catch {
    motionWanted = false;
  }
  updateMotion();
}
motion.addEventListener("click", () => {
  if (motionWanted) {
    video.pause();
    motionWanted = false;
    updateMotion();
  } else playBackground();
});
if (!reduced.matches && !navigator.connection?.saveData) playBackground();
const sections = [...document.querySelectorAll("main>section")];
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        document.querySelectorAll(".rail a").forEach((a) => {
          const active = a.hash === "#" + e.target.id;
          a.classList.toggle("active", active);
          if (active) a.setAttribute("aria-current", "location");
          else a.removeAttribute("aria-current");
        });
      }
    });
  },
  { threshold: 0.45 },
);
sections.forEach((s) => observer.observe(s));
window.addEventListener(
  "scroll",
  () => $(".header").classList.toggle("scrolled", scrollY > 50),
  { passive: true },
);
const menu = $(".menu-toggle"),
  nav = $("#mobile-nav");
function closeMenu() {
  nav.hidden = true;
  menu.setAttribute("aria-expanded", "false");
  menu.setAttribute("aria-label", "Open navigation");
  menu.textContent = "☰";
}
menu.addEventListener("click", () => {
  const open = nav.hidden;
  nav.hidden = !open;
  menu.setAttribute("aria-expanded", String(open));
  menu.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
  menu.textContent = open ? "✕" : "☰";
});
nav
  .querySelectorAll("a")
  .forEach((a) => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});
const worlds = {
  world: ["world.jpg", "A vast city beneath a glowing blue sky"],
  forest: ["forest.jpg", "Exploration amid the forests of Orbis"],
  ruins: ["ruins.jpg", "Ancient ruins and hidden paths in Orbis"],
};
document.querySelectorAll("[data-world]").forEach((b) =>
  b.addEventListener("click", () => {
    document.querySelectorAll("[data-world]").forEach((x) => {
      x.classList.toggle("selected", x === b);
      x.setAttribute("aria-pressed", String(x === b));
    });
    const [src, alt] = worlds[b.dataset.world];
    $("#world-image").src = src;
    $("#world-image").alt = alt;
  }),
);
const characters = [
  { name: "Lute", image: "lute.png", position: "50% 40%" },
  { name: "Reina", image: "reina.jpeg", position: "50% 0%" },
  { name: "Theresia", image: "theresia.webp", position: "50% 0%" },
  { name: "Kalien", image: "kalien.webp", position: "64% 40%" },
];
document.querySelectorAll("[data-character]").forEach((b) =>
  b.addEventListener("click", () => {
    const i = Number(b.dataset.character),
      c = characters[i];
    document.querySelectorAll("[data-character]").forEach((x) => {
      x.classList.toggle("selected", x === b);
      x.setAttribute("aria-pressed", String(x === b));
    });
    $("#character-image").src = c.image;
    $("#character-image").style.objectPosition = c.position;
    $("#character-image").alt = `Official ${c.name} gameplay preview`;
    $("#character-name").textContent = c.name;
    $("#character-number").textContent =
      `${String(i + 1).padStart(2, "0")} / ${String(characters.length).padStart(2, "0")}`;
    $("#character-link").setAttribute(
      "aria-label",
      `View ${c.name}'s official gameplay on Steam`,
    );
  }),
);
const dialog = $("#trailer-dialog"),
  trailer = $("#trailer-video");
document.querySelectorAll("[data-trailer]").forEach((b) =>
  b.addEventListener("click", () => {
    dialog.showModal();
    video.pause();
    trailer.play().catch(() => {});
  }),
);
$("#close-trailer").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (e) => {
  if (e.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener("close", () => {
  trailer.pause();
  if (motionWanted) video.play().catch(() => {});
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    video.pause();
    trailer.pause();
  } else if (motionWanted && !dialog.open) video.play().catch(() => {});
});

// Combat mirrors the hero: the image remains underneath while the muted background plays.
const combat = $("#combat"),
  combatToggle = $("#combat-toggle"),
  combatFrame = $(".combat-player"),
  combatStatus = $("#combat-status");
let combatPlayer, combatRequested = false, combatLoading, combatInitializing = false;
function showCombatPlayback(active) {
  combatFrame.classList.toggle("playing", active);
  combatFrame.setAttribute("aria-hidden", String(!active));
  combatToggle.setAttribute("aria-pressed", String(active));
  combatToggle.textContent = active ? "Pause combat Ⅱ" : "Play combat ▷";
}
function stopCombat() {
  combatRequested = false;
  combatPlayer?.pauseVideo?.();
  showCombatPlayback(false);
}
function combatError() {
  stopCombat();
  combatToggle.disabled = false;
  combatStatus.textContent = "";
}
function loadCombatAPI() {
  if (window.YT?.Player) return Promise.resolve();
  if (combatLoading) return combatLoading;
  combatLoading = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const timeout = setTimeout(() => reject(new Error("YouTube timed out")), 15000);
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timeout);
      resolve();
    };
    script.src = "https://www.youtube.com/iframe_api";
    script.onerror = () => {
      clearTimeout(timeout);
      reject(new Error("YouTube unavailable"));
    };
    document.head.append(script);
  }).catch((error) => {
    combatLoading = null;
    throw error;
  });
  return combatLoading;
}
async function startCombat() {
  if (combatPlayer?.playVideo) {
    combatRequested = true;
    showCombatPlayback(true);
    combatPlayer.playVideo();
    return;
  }
  if (combatInitializing) return;
  combatInitializing = true;
  combatRequested = true;
  combatStatus.textContent = "";
  try {
    await loadCombatAPI();
    combatPlayer = new YT.Player("combat-video", {
      host: "https://www.youtube-nocookie.com",
      videoId: "PetI2TFvfw4",
      playerVars: { playsinline: 1, rel: 0, origin: location.origin },
      events: {
        onReady: (event) => {
          combatInitializing = false;
          combatStatus.textContent = "";
          if (combatRequested && !document.hidden) {
            event.target.mute();
            showCombatPlayback(true);
            event.target.playVideo();
          }
        },
        onStateChange: (event) => {
          if (event.data === YT.PlayerState.PLAYING) {
            if (!combatRequested) event.target.pauseVideo();
            else showCombatPlayback(true);
          } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
            combatRequested = false;
            showCombatPlayback(false);
          }
        },
        onError: combatError,
      },
    });
  } catch {
    combatInitializing = false;
    combatError();
  }
}
combatToggle.addEventListener("click", () => {
  if (combatRequested) stopCombat();
  else startCombat();
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopCombat();
});
new IntersectionObserver((entries) => {
  if (!entries[0].isIntersecting && combatRequested) stopCombat();
  if (entries[0].isIntersecting && !combatRequested && !reduced.matches && !navigator.connection?.saveData)
    startCombat();
}).observe(combat);
