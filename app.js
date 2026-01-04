const STORAGE_KEY = "breathing_programs";

let programs = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
let sessionEnd = null;
let timer = null;

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

/* ---------- BREATH ENGINE ---------- */

function phase(label, seconds, scale) {
  return new Promise(res => {
    el("phase").textContent = label;
    el("circle").style.transitionDuration = seconds + "s";
    el("circle").style.transform = `scale(${scale})`;
    setTimeout(res, seconds * 1000);
  });
}

async function startSession(program, minutes) {
  sessionEnd = Date.now() + minutes * 60000;

  while (Date.now() < sessionEnd) {
    await phase("Inhale", program.inhale, 4);
    await phase("Hold", program.inhaleHold, 4);
    await phase("Exhale", program.exhale, 1);
    await phase("Hold", program.exhaleHold, 1);
  }
}

el("startSession").onclick = () => {
  const name = el("programSelect").value;
  if (!programs[name]) return;

  startSession(programs[name], +el("duration").value);

  timer = setInterval(() => {
    const remaining = Math.max(0, sessionEnd - Date.now());
    el("remaining").textContent = Math.ceil(remaining / 1000) + " sec remaining";
  }, 1000);
};

el("stopSession").onclick = () => {
  clearInterval(timer);
  el("phase").textContent = "";
  el("remaining").textContent = "";
};

/* ---------- INIT ---------- */

if (Object.keys(programs).length === 0) {
  programs["4-8-8"] = { inhale: 4, inhaleHold: 0, exhale: 8, exhaleHold: 8 };
  savePrograms();
}

refreshUI();
