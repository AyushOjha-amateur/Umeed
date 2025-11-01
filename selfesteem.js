// selfesteem.js
// Mirror Journal + Confidence Meter + Affirmations + Detox + localStorage persistence

const JOURNAL_KEY = "umeed_mirror_journal_v1";
const TASKS_KEY = "umeed_mirror_tasks_v1";

// Affirmations pool
const AFFIRMATIONS = [
  "You are enough, just as you are.",
  "Your progress is quiet but real.",
  "Kindness toward yourself is strength.",
  "You deserve gentleness and rest.",
  "Small steps are still movement forward.",
  "Your body and mind are on your team."
];

// Reframes for negative detox (simple mapping / fallback)
const REFRAMES = [
  "I am learning to be kinder to myself.",
  "Every step I take teaches me something new.",
  "I am allowed to be imperfect and human.",
  "I’m growing — that’s enough today."
];

// ——— DOM references
const mirrorInput = () => document.getElementById("mirrorInput");
const saveMirrorBtn = () => document.getElementById("saveMirrorBtn");
const mirrorSaved = () => document.getElementById("mirrorSaved");
const viewJournalBtn = () => document.getElementById("viewJournalBtn");
const journalModal = () => document.getElementById("journalModal");
const journalList = () => document.getElementById("journalList");

const meterFill = () => document.getElementById("meterFill");
const meterPct = () => document.getElementById("meterPct");
const taskSaved = () => document.getElementById("taskSaved");

// detox
const detoxInput = () => document.getElementById("detoxInput");
const detoxBtn = () => document.getElementById("detoxBtn");
const detoxCanvas = () => document.getElementById("detoxCanvas");
const detoxMessage = () => document.getElementById("detoxMessage");

// affirm
const affBtn = () => document.getElementById("affBtn");
const affBox = () => document.getElementById("affBox");

// tasks initial
const initialTasks = { c1: false, c2: false, c3: false, c4: false };

// ——— init
document.addEventListener("DOMContentLoaded", () => {
  // load journal entries
  renderJournalList();
  // load tasks
  const savedTasks = JSON.parse(localStorage.getItem(TASKS_KEY) || "{}");
  Object.keys(initialTasks).forEach(k => {
    const done = !!savedTasks[k];
    const li = document.querySelector(`li[data-id="${k}"]`);
    if (li && done) li.classList.add("done"), li.querySelector("input[type=checkbox]").checked = true;
  });
  updateMeter();

  // event bindings
  saveMirrorBtn().addEventListener("click", saveMirrorEntry);
  viewJournalBtn().addEventListener("click", openJournal);
  affBtn().addEventListener("click", showAffirmation);
  detoxBtn().addEventListener("click", doDetox);
});

// ——— Mirror Journal functions
function getJournal() {
  return JSON.parse(localStorage.getItem(JOURNAL_KEY) || "[]");
}
function saveJournal(entries) {
  localStorage.setItem(JOURNAL_KEY, JSON.stringify(entries));
}
function saveMirrorEntry() {
  const text = mirrorInput().value.trim();
  if (!text) {
    flashTemp(mirrorSaved(), "Write something first!", true);
    return;
  }
  const entries = getJournal();
  entries.unshift({ text, at: new Date().toISOString() });
  saveJournal(entries);
  mirrorInput().value = "";
  flashTemp(mirrorSaved(), "Saved ✓");
  renderJournalList();
}
function renderJournalList() {
  const list = journalList();
  list.innerHTML = "";
  const entries = getJournal();
  if (!entries.length) {
    list.innerHTML = `<div class="journal-item"><div>No entries yet — your reflections will appear here.</div></div>`;
    return;
  }
  entries.forEach((e, idx) => {
    const item = document.createElement("div");
    item.className = "journal-item";
    const left = document.createElement("div");
    left.style.flex = "1";
    left.innerHTML = `<div>${escapeHtml(e.text)}</div><div class="journal-meta">${new Date(e.at).toLocaleString()}</div>`;
    const right = document.createElement("div");
    right.innerHTML = `<button class="ghost" onclick="deleteJournal(${idx})">Delete</button>`;
    item.appendChild(left);
    item.appendChild(right);
    list.appendChild(item);
  });
}
function openJournal() {
  journalModal().classList.remove("hidden");
  journalModal().setAttribute("aria-hidden", "false");
  renderJournalList();
}
function closeJournal() {
  journalModal().classList.add("hidden");
  journalModal().setAttribute("aria-hidden", "true");
}
function deleteJournal(index) {
  const entries = getJournal();
  entries.splice(index, 1);
  saveJournal(entries);
  renderJournalList();
  flashTemp(mirrorSaved(), "Deleted");
}
function clearJournal() {
  if (!confirm("Clear all mirror journal entries? This cannot be undone.")) return;
  saveJournal([]);
  renderJournalList();
  closeJournal();
  flashTemp(mirrorSaved(), "Cleared");
}

// ——— tasks & meter
function toggleTask(id) {
  const li = document.querySelector(`li[data-id="${id}"]`);
  if (!li) return;
  li.classList.toggle("done");
  const checked = li.querySelector("input[type=checkbox]").checked;
  saveTaskState(id, checked);
  flashTemp(taskSaved(), "✔️ Saved");
  updateMeter();
}
function saveTaskState(id, val) {
  const data = JSON.parse(localStorage.getItem(TASKS_KEY) || "{}");
  data[id] = !!val;
  localStorage.setItem(TASKS_KEY, JSON.stringify(data));
}
function clearDailyTasks() {
  if (!confirm("Clear all daily tasks?")) return;
  document.querySelectorAll(".task-list li").forEach(li => {
    li.classList.remove("done");
    const cb = li.querySelector("input[type=checkbox]");
    if (cb) cb.checked = false;
  });
  localStorage.removeItem(TASKS_KEY);
  updateMeter();
  flashTemp(taskSaved(), "Cleared");
}
function updateMeter() {
  const data = JSON.parse(localStorage.getItem(TASKS_KEY) || "{}");
  const keys = Object.keys(initialTasks);
  const doneCount = keys.reduce((count, k) => count + (data[k] ? 1 : 0), 0);
  const pct = Math.round((doneCount / keys.length) * 100);
  meterFill().style.width = `${pct}%`;
  meterPct().textContent = `${pct}%`;
  // gentle encouragement
  if (pct === 100) flashTemp(taskSaved(), "🌟 All done — gentle wins!");
}

// ——— Affirmation
function showAffirmation() {
  const text = AFFIRMATIONS[Math.floor(Math.random() * AFFIRMATIONS.length)];
  affBox().style.opacity = 0;
  setTimeout(()=> {
    affBox().textContent = text;
    affBox().style.opacity = 1;
  }, 200);
}

// ——— Detox: float text up and replace with reframe
function doDetox() {
  const t = detoxInput().value.trim();
  if (!t) {
    flashTemp(detoxMessage(), "Type a thought to release");
    return;
  }
  // floating negative bubble
  const el = document.createElement("div");
  el.className = "float-text";
  el.textContent = t;
  detoxCanvas().appendChild(el);
  detoxInput().value = "";
  // remove after animation
  setTimeout(()=> {
    el.remove();
    // show reframe
    const re = REFRAMES[Math.floor(Math.random()*REFRAMES.length)];
    detoxMessage().textContent = re;
    setTimeout(()=> detoxMessage().textContent = "", 4000);
  }, 2200);
}

// ——— helpers
function flashTemp(el, msg = "Saved", isWarning=false) {
  if (!el) return;
  const old = el.textContent;
  el.textContent = msg;
  el.classList.remove("hidden");
  if (isWarning) el.style.color = "#b21f2d";
  setTimeout(()=> {
    el.classList.add("hidden");
    el.textContent = old;
    if (isWarning) el.style.color = "";
  }, 1500);
}
function markTaskDone(id, save=true) {
  const li = document.querySelector(`li[data-id="${id}"]`);
  if (!li) return;
  li.classList.add("done");
  li.querySelector("input[type=checkbox]").checked = true;
  if (save) saveTaskState(id, true);
}
function escapeHtml(s){ return (s+"").replace(/[&<>"'`]/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;' })[c]); }
