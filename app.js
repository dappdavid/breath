const STORAGE_KEY = "breathing_programs";

let programs = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
let sessionEnd = null;
let timer = null;

let paused = false;
let currentTimeout = null;
let phaseRemaining = 0;
let phaseStartTime = null;
let currentPhase = null;

const el = id => document.getElementById(id);

/* ---------- TABS ---------- */

document.querySelectorAll(".tab").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

    btn.classList.add("active");
    el(btn.dataset.tab).classList.add("active");
  };
});

/* ---------- STORAGE ---------- */

function savePrograms() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(programs));
  refreshUI();
}

function refreshUI() {
  const selects = [el("programSelect"), el("programList")];
  selects.forEach(s => s.innerHTML = "");

  Object.keys(programs).forEach(name => {
    selects.forEach(select => {
      const opt = document.createElement("option");
      opt.value = name;
      opt.textContent = name;
      select.appendChild(opt.cloneNode(true));
    });
  });

  const hasPrograms = Object.keys(programs).length > 0;
  el("noPrograms").classList.toggle("hidden", hasPrograms);
  el("sessionControls").classList.toggle("hidden", !hasPrograms);
}

/* ---------- PROGRAM CRUD ---------- */


el("saveProgram").onclick = () => {
  const name = el("programName").value.trim();
  if (!name) return alert("Program name required");

  programs[name] = {
    inhale: +el("inhale").value,
    inhaleHold: +el("inhaleHold").value,
    exhale: +el("exhale").value,
    exhaleHold: +el("exhaleHold").value
  };

  savePrograms();
};

el("deleteProgram").onclick = () => {
  const name = el("programList").value;
  if (!name) return;
  delete programs[name];
  savePrograms();
};

/* ---------- TIME FORMAT ---------- */

function formatTime(ms) {
  const total = Math.ceil(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ---------- BREATH ENGINE ---------- */

function runPhase(label, seconds, scale) {
  return new Promise(resolve => {
    currentPhase = { label, scale };
    phaseRemaining = seconds;
    phaseStartTime = Date.now();

    el("phaseLabel").textContent = label;

    el("circle").style.transition = `transform ${seconds}s linear`;
    el("circle").style.transform = `scale(${scale})`;

    currentTimeout = setTimeout(resolve, seconds * 1000);
  });
}

async function startSession(program, minutes) {
  sessionEnd = Date.now() + minutes * 60000;
  paused = false;

  while (Date.now() < sessionEnd) {
    await runPhase("Inhale", program.inhale, 4);
    await runPhase("Hold", program.inhaleHold, 4);
    await runPhase("Exhale", program.exhale, 1);
    await runPhase("Hold", program.exhaleHold, 1);
  }
}

/* ---------- CONTROLS ---------- */

el("startSession").onclick = () => {
  const name = el("programSelect").value;
  if (!programs[name]) return;

  clearInterval(timer);
  startSession(programs[name], +el("duration").value);

  timer = setInterval(() => {
    if (paused) return;
    const remaining = Math.max(0, sessionEnd - Date.now());
    el("remaining").textContent = formatTime(remaining);
  }, 1000);
};

el("pauseResume").onclick = () => {
  if (!currentPhase) return;

  paused = !paused;

  if (paused) {
    clearTimeout(currentTimeout);

    const elapsed = (Date.now() - phaseStartTime) / 1000;
    phaseRemaining = Math.max(0, phaseRemaining - elapsed);

    el("circle").style.transition = "none";
    el("pauseResume").textContent = "Resume";
    el("pauseResume").className = "resume";

  } else {
    phaseStartTime = Date.now();
    el("circle").style.transition = `transform ${phaseRemaining}s linear`;
    el("circle").style.transform = `scale(${currentPhase.scale})`;

    currentTimeout = setTimeout(() => {}, phaseRemaining * 1000);

    el("pauseResume").textContent = "Pause";
    el("pauseResume").className = "pause";
  }
};

el("stopSession").onclick = () => {
  clearInterval(timer);
  clearTimeout(currentTimeout);
  paused = false;

  el("phaseLabel").textContent = "";
  el("remaining").textContent = "";
  el("circle").style.transform = "scale(1)";
};

/* ---------- INIT ---------- */

if (Object.keys(programs).length === 0) {
  programs["4-8-8"] = { inhale: 4, inhaleHold: 0, exhale: 8, exhaleHold: 8 };
  savePrograms();
}

refreshUI();
