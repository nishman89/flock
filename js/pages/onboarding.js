'use strict';
Flock.requireAuth();
if (Flock.isOnboarded()) window.location.href = 'home.html';

let step = 1;
let selectedAvatar  = '🐦';
let selectedInterests = new Set();
let selectedCity    = 'London';
let selectedDist    = 25;
let selectedFriend  = 'Both';

const STEPS = {
  label: ['Step 1 of 3','Step 2 of 3','Step 3 of 3'],
  title: ['Tell us about yourself 👋','What are you into? 🎯','Your preferences 📍'],
};
const DISTANCES = [5, 10, 25, 50];
const AVATARS   = ['🐦','😎','🎉','🏃','🎨','🎸','⚽','🌟','🦊','🐻','🦁','🐧'];

function render() {
  [1,2,3].forEach(i =>
    document.getElementById('prog-' + i).classList.toggle('done', i <= step));
  document.getElementById('step-label').textContent = STEPS.label[step-1];
  document.getElementById('step-title').textContent  = STEPS.title[step-1];

  const c = document.getElementById('ob-content');

  if (step === 1) {
    const p = Flock.getProfile();
    if (p.avatar) selectedAvatar = p.avatar;
    c.innerHTML = `
      <div style="display:flex;gap:12px">
        <div class="field" style="flex:1;margin-bottom:0">
          <label>First name</label>
          <input type="text" id="ob-first" placeholder="e.g. Nish" value="${p.firstName||''}" maxlength="30">
        </div>
        <div class="field" style="flex:1;margin-bottom:0">
          <label>Last name</label>
          <input type="text" id="ob-last" placeholder="e.g. Mandal" value="${p.lastName||''}" maxlength="30">
        </div>
      </div>
      <div class="field" style="margin-top:16px">
        <label>Date of birth</label>
        <input type="date" id="ob-dob" value="${p.dob||''}" max="${new Date().toISOString().slice(0,10)}">
      </div>
      <div class="field" style="margin-top:4px;margin-bottom:6px">
        <label>Pick your avatar</label>
      </div>
      <div class="avatar-grid">
        ${AVATARS.map(av => `
          <div class="avatar-opt ${selectedAvatar===av?'selected':''}" onclick="selectAvatar('${av}',this)">${av}</div>
        `).join('')}
      </div>`;
  }

  if (step === 2) {
    c.innerHTML = `
      <p class="ob-hint">Select everything you enjoy — the more you pick, the better your matches!</p>
      <div class="interest-grid">
        ${INTERESTS.map(i => `
          <div class="interest-chip ${selectedInterests.has(i.label)?'selected':''}"
               onclick="toggleInterest('${i.label}',this)">
            <span class="chip-emoji">${i.e}</span>
            <span>${i.label}</span>
          </div>
        `).join('')}
      </div>`;
  }

  if (step === 3) {
    c.innerHTML = `
      <div class="field">
        <label>Your city</label>
        <select id="ob-city" onchange="selectedCity=this.value">
          ${CITIES.map(city => `<option value="${city}" ${selectedCity===city?'selected':''}>${city}</option>`).join('')}
        </select>
      </div>
      <div class="field" style="margin-bottom:8px">
        <label>Show events within</label>
      </div>
      <div class="dist-chips">
        ${DISTANCES.map(d => `
          <div class="dist-chip ${selectedDist===d?'selected':''}" onclick="selectDist(${d},this)">${d} miles</div>
        `).join('')}
        <div class="dist-chip ${selectedDist===999?'selected':''}" onclick="selectDist(999,this)">Any</div>
      </div>
      <div class="field" style="margin-top:16px;margin-bottom:8px">
        <label>I want to meet</label>
      </div>
      <div class="friend-chips">
        ${['Girls','Boys','Both'].map(f => `
          <div class="friend-chip ${selectedFriend===f?'selected':''}"
               onclick="selectFriend('${f}',this)">${f}</div>
        `).join('')}
      </div>`;
  }
}

function selectAvatar(val, el) {
  selectedAvatar = val;
  document.querySelectorAll('.avatar-opt').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}
function toggleInterest(val, el) {
  if (selectedInterests.has(val)) { selectedInterests.delete(val); el.classList.remove('selected'); }
  else { selectedInterests.add(val); el.classList.add('selected'); }
}
function selectDist(val, el) {
  selectedDist = val;
  document.querySelectorAll('.dist-chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}
function selectFriend(val, el) {
  selectedFriend = val;
  document.querySelectorAll('.friend-chip').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function nextStep() {
  if (step === 1) {
    const firstName = document.getElementById('ob-first').value.trim();
    const lastName  = document.getElementById('ob-last').value.trim();
    const dob       = document.getElementById('ob-dob').value;
    if (!firstName) { alert('Please enter your first name'); return; }
    if (!dob)       { alert('Please enter your date of birth'); return; }
    Flock.setProfile({ firstName, lastName, dob, avatar: selectedAvatar });
    step = 2;
  } else if (step === 2) {
    if (selectedInterests.size < 1) { alert('Please select at least one interest'); return; }
    Flock.setInterests([...selectedInterests]);
    step = 3;
  } else if (step === 3) {
    const city = document.getElementById('ob-city').value;
    Flock.setPrefs({ city, dist: selectedDist, friendType: selectedFriend });
    Flock.setOnboarded();
    window.location.href = 'home.html';
    return;
  }
  document.getElementById('ob-content').scrollTop = 0;
  render();
}

render();
