'use strict';
Flock.requireAuth();
if (Flock.isOnboarded()) window.location.href = 'home.html';

let step = 1;
let selectedAge = '';
let selectedInterests = new Set();
let selectedCity = 'London';
let selectedDist = 25;
let selectedFriend = 'Both';

const STEPS = {
  label: ['Step 1 of 3','Step 2 of 3','Step 3 of 3'],
  title: ['Tell us about yourself 👋','What are you into? 🎯','Your preferences 📍'],
};

const AGE_GROUPS = ['Under 18','18–24','25–34','35–49','50+'];
const DISTANCES  = [5, 10, 25, 50];

function render() {
  // Progress bars
  [1,2,3].forEach(i => {
    document.getElementById('prog-' + i).classList.toggle('done', i <= step);
  });
  document.getElementById('step-label').textContent = STEPS.label[step-1];
  document.getElementById('step-title').textContent  = STEPS.title[step-1];

  const c = document.getElementById('ob-content');

  if (step === 1) {
    const savedProfile = Flock.getProfile();
    c.innerHTML = `
      <div class="field">
        <label>Your name</label>
        <input type="text" id="ob-name" placeholder="e.g. Nish" value="${savedProfile.name||''}" maxlength="40">
      </div>
      <div class="field" style="margin-bottom:0">
        <label>Your age group</label>
      </div>
      <div class="age-chips">
        ${AGE_GROUPS.map(a => `
          <div class="age-chip ${(selectedAge||savedProfile.age)===a?'selected':''}"
               onclick="selectAge('${a}',this)">${a}</div>
        `).join('')}
      </div>`;
    if (!selectedAge && savedProfile.age) selectedAge = savedProfile.age;
  }

  if (step === 2) {
    c.innerHTML = `
      <p class="ob-hint">Select everything you enjoy — the more you pick, the better your event matches!</p>
      <div class="interest-grid">
        ${INTERESTS.map(i => `
          <div class="interest-chip ${selectedInterests.has(i.label)?'selected':''}"
               onclick="toggleInterest('${i.label}',this)">
            <span class="chip-emoji">${i.emoji}</span>
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
          ${CITIES.map(c => `<option value="${c}" ${selectedCity===c?'selected':''}>${c}</option>`).join('')}
        </select>
      </div>
      <div class="field" style="margin-bottom:8px">
        <label>Distance — show events within</label>
      </div>
      <div class="dist-chips">
        ${DISTANCES.map(d => `
          <div class="dist-chip ${selectedDist===d?'selected':''}"
               onclick="selectDist(${d},this)">${d} miles</div>
        `).join('')}
        <div class="dist-chip ${selectedDist===999?'selected':''}"
             onclick="selectDist(999,this)">Any</div>
      </div>
      <div class="field" style="margin-bottom:8px">
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

function selectAge(val, el) {
  selectedAge = val;
  document.querySelectorAll('.age-chip').forEach(c => c.classList.remove('selected'));
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
    const name = document.getElementById('ob-name').value.trim();
    if (!name) { alert('Please enter your name'); return; }
    if (!selectedAge) { alert('Please select your age group'); return; }
    Flock.setProfile({ name, age: selectedAge });
    step = 2;
  } else if (step === 2) {
    if (selectedInterests.size < 1) { alert('Please select at least one interest'); return; }
    Flock.setInterests([...selectedInterests]);
    step = 3;
  } else if (step === 3) {
    const city = document.getElementById('ob-city').value;
    Flock.setPrefs({ city, distance: selectedDist, friendType: selectedFriend });
    Flock.setOnboarded();
    window.location.href = 'home.html';
    return;
  }
  document.getElementById('ob-content').scrollTop = 0;
  render();
}

render();
