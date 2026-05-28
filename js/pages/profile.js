'use strict';
Flock.requireAuth();
setActiveNav('profile');

function render() {
  const profile   = Flock.getProfile();
  const prefs     = Flock.getPrefs();
  const interests = Flock.getInterests();
  const myEvCount = Flock.getMyEvents().length;
  const initials  = profile.name ? profile.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() : 'ME';
  const distLabel = prefs.distance === 999 ? 'Any' : prefs.distance + ' miles';

  document.getElementById('profile-hero').innerHTML = `
    <div class="profile-avatar">${initials}</div>
    <div class="profile-name">${profile.name || 'Your Name'}</div>
    <div class="profile-sub">${profile.age || ''} · ${prefs.city || 'London'}</div>`;

  document.getElementById('profile-body').innerHTML = `
    <div class="profile-section">
      <div class="profile-section-title">My Stats</div>
      <div class="profile-card">
        <div class="profile-row">
          <span class="profile-row-label">Events joined</span>
          <span class="profile-row-val">${myEvCount} 🎉</span>
        </div>
        <div class="profile-row">
          <span class="profile-row-label">Interests</span>
          <span class="profile-row-val">${interests.length} selected</span>
        </div>
      </div>
    </div>

    <div class="profile-section">
      <div class="profile-section-title">Preferences</div>
      <div class="profile-card">
        <div class="profile-row">
          <span class="profile-row-label">📍 City</span>
          <span class="profile-row-val">${prefs.city || 'London'}</span>
        </div>
        <div class="profile-row">
          <span class="profile-row-label">📏 Distance</span>
          <span class="profile-row-val">${distLabel}</span>
        </div>
        <div class="profile-row">
          <span class="profile-row-label">🤝 Interested in meeting</span>
          <span class="profile-row-val">${prefs.friendType || 'Both'}</span>
        </div>
      </div>
    </div>

    ${interests.length > 0 ? `
    <div class="profile-section">
      <div class="profile-section-title">My Interests</div>
      <div class="profile-card">
        <div class="interest-tags">
          ${interests.map(i => {
            const match = INTERESTS.find(x => x.label === i);
            return `<span class="interest-tag">${match ? match.emoji + ' ' : ''}${i}</span>`;
          }).join('')}
        </div>
      </div>
    </div>` : ''}

    <div class="profile-section">
      <div class="profile-section-title">Account</div>
      <div class="profile-card">
        <div class="profile-row">
          <span class="profile-row-label">Username</span>
          <span class="profile-row-val">${Flock.getUser()}</span>
        </div>
        <div class="profile-row" style="cursor:pointer" onclick="window.location.href='onboarding.html'">
          <span class="profile-row-label">Edit interests &amp; preferences</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </div>
      </div>
    </div>

    <div class="profile-section" style="padding-bottom:16px">
      <button class="btn btn-ghost" onclick="if(confirm('Sign out of Flock?'))Flock.logout()">Sign Out</button>
    </div>`;
}

render();
