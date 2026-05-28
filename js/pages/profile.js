'use strict';
Flock.requireAuth();
setActiveNav('profile');

function calcAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth)) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

function savePrefs(patch) {
  Flock.setPrefs({ ...Flock.getPrefs(), ...patch });
}

function toggleInterest(label) {
  const current = Flock.getInterests();
  const updated = current.includes(label)
    ? current.filter(i => i !== label)
    : [...current, label];
  Flock.setInterests(updated);
  render();
}

function render() {
  const profile   = Flock.getProfile();
  const prefs     = Flock.getPrefs();
  const interests = Flock.getInterests();
  const myEvCount = Flock.getMyEvents().length;

  const firstName = profile.firstName || '';
  const lastName  = profile.lastName  || '';
  const fullName  = [firstName, lastName].filter(Boolean).join(' ') || 'Your Name';
  const initials  = ((firstName[0] || '') + (lastName[0] || '')).toUpperCase() || '?';
  const age       = calcAge(profile.dob);
  const subLine   = [age ? age + ' years old' : '', prefs.city || 'London'].filter(Boolean).join(' · ');

  const avatarDisp = profile.avatar
    ? `<div class="profile-avatar" style="font-size:36px;line-height:1">${profile.avatar}</div>`
    : `<div class="profile-avatar">${initials}</div>`;

  document.getElementById('profile-hero').innerHTML = `
    ${avatarDisp}
    <div class="profile-name">${fullName}</div>
    <div class="profile-sub">${subLine}</div>
    <button class="profile-edit-btn" onclick="openEditProfile()">✎ Edit profile</button>`;

  const cityOpts = CITIES.map(c =>
    `<option value="${c}" ${prefs.city === c ? 'selected' : ''}>${c}</option>`
  ).join('');

  const friendOpts = ['Girls','Boys','Both'].map(f => `
    <span class="inline-chip ${prefs.friendType === f ? 'active' : ''}"
          onclick="savePrefs({friendType:'${f}'});render()">${f}</span>
  `).join('');

  const interestChips = INTERESTS.map(i => `
    <span class="inline-chip ${interests.includes(i.label) ? 'active' : ''}"
          onclick="toggleInterest('${i.label}')">
      ${i.e} ${i.label}
    </span>
  `).join('');

  document.getElementById('profile-body').innerHTML = `
    <div class="profile-section">
      <div class="profile-section-title">My Stats</div>
      <div class="profile-card">
        <div class="profile-row">
          <span class="profile-row-label">Events joined</span>
          <span class="profile-row-val">${myEvCount} 🎉</span>
        </div>
        <div class="profile-row">
          <span class="profile-row-label">Interests selected</span>
          <span class="profile-row-val">${interests.length}</span>
        </div>
      </div>
    </div>

    <div class="profile-section">
      <div class="profile-section-title">Preferences</div>
      <div class="profile-card">
        <div class="profile-row" style="gap:12px">
          <span class="profile-row-label">📍 City</span>
          <div class="inline-select-wrap">
            <select class="inline-select" onchange="savePrefs({city:this.value});render()">
              ${cityOpts}
            </select>
          </div>
        </div>
        <div class="profile-row" style="flex-wrap:wrap;gap:8px;padding:12px 16px">
          <span class="profile-row-label" style="width:100%;margin-bottom:4px">🤝 Looking to meet</span>
          <div style="display:flex;gap:8px">${friendOpts}</div>
        </div>
      </div>
    </div>

    <div class="profile-section">
      <div class="profile-section-title">My Interests</div>
      <p style="font-size:13px;color:var(--text3);margin:0 0 10px">Tap to add or remove</p>
      <div class="inline-chips-wrap">${interestChips}</div>
    </div>

    <div class="profile-section">
      <div class="profile-section-title">Account</div>
      <div class="profile-card">
        <div class="profile-row">
          <span class="profile-row-label">Username</span>
          <span class="profile-row-val">${Flock.getUser()}</span>
        </div>
      </div>
    </div>

    <div class="profile-section" style="padding-bottom:16px">
      <button id="signout-btn" class="btn btn-ghost" onclick="if(confirm('Sign out of Flock?'))Flock.logout()">Sign Out</button>
    </div>`;
}

/* ── Edit profile modal (name / DOB / avatar only) ────────── */
function openEditProfile() {
  const p = Flock.getProfile();
  const AVATARS = ['🐦','😎','🎉','🏃','🎨','🎸','⚽','🌟','🦊','🐻','🦁','🐧'];
  const ov = document.createElement('div');
  ov.id = 'edit-profile-overlay';
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:flex-end;justify-content:center;z-index:300';
  ov.innerHTML = `
    <div style="background:var(--card);border-radius:20px 20px 0 0;padding:24px 20px 40px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto">
      <div style="font-size:17px;font-weight:700;color:var(--text);margin-bottom:20px;display:flex;justify-content:space-between;align-items:center">
        Edit Profile
        <button onclick="document.getElementById('edit-profile-overlay').remove()" style="background:none;border:none;font-size:20px;color:var(--text3);cursor:pointer">✕</button>
      </div>
      <div style="display:flex;gap:12px;margin-bottom:16px">
        <div class="field" style="flex:1;margin-bottom:0">
          <label>First name</label>
          <input type="text" id="ep-first" value="${p.firstName||''}" maxlength="30" placeholder="First name">
        </div>
        <div class="field" style="flex:1;margin-bottom:0">
          <label>Last name</label>
          <input type="text" id="ep-last" value="${p.lastName||''}" maxlength="30" placeholder="Last name">
        </div>
      </div>
      <div class="field" style="margin-bottom:16px">
        <label>Date of birth</label>
        <input type="date" id="ep-dob" value="${p.dob||''}" max="${new Date().toISOString().slice(0,10)}">
      </div>
      <div class="field" style="margin-bottom:8px"><label>Avatar</label></div>
      <div class="avatar-grid" style="margin-bottom:24px">
        ${AVATARS.map(av => `<div class="avatar-opt ${(p.avatar||'🐦')===av?'selected':''}" onclick="selectEditAvatar('${av}',this)">${av}</div>`).join('')}
      </div>
      <button onclick="saveEditProfile()" class="btn btn-primary" style="width:100%">Save changes</button>
    </div>`;
  ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
  document.body.appendChild(ov);
}

function selectEditAvatar(val, el) {
  document.querySelectorAll('#edit-profile-overlay .avatar-opt').forEach(c => c.classList.remove('selected'));
  el.classList.add('selected');
}

function saveEditProfile() {
  const firstName = document.getElementById('ep-first').value.trim();
  const lastName  = document.getElementById('ep-last').value.trim();
  const dob       = document.getElementById('ep-dob').value;
  if (!firstName) { alert('First name is required'); return; }
  if (!dob)       { alert('Date of birth is required'); return; }
  const sel = document.querySelector('#edit-profile-overlay .avatar-opt.selected');
  const avatar = sel ? sel.textContent.trim() : (Flock.getProfile().avatar || '🐦');
  Flock.setProfile({ ...Flock.getProfile(), firstName, lastName, dob, avatar });
  document.getElementById('edit-profile-overlay').remove();
  render();
}

render();
