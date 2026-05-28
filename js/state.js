'use strict';

/* ══════════════════════════════════════════════════════════
   JAGS — pre-seeded demo account
   Applied every time jags logs in so it's always consistent
══════════════════════════════════════════════════════════ */
const JAGS = {
  profile:   { name: 'Jags', fullName: 'Jags Choongh', age: '25–34' },
  interests: ['Football', 'Swimming', 'Dancing', 'Pub & Social', 'Food & Dining', 'Cinema', 'Gym & Fitness'],
  prefs:     { city: 'London', dist: 25, ft: 'Both' }
};

/* ══════════════════════════════════════════════════════════
   STATE HELPERS  (localStorage)
══════════════════════════════════════════════════════════ */
const Flock = {

  /* ── Auth ────────────────────────────────────────────── */
  login(u)      { localStorage.setItem('flock_user', u); },
  getUser()     { return localStorage.getItem('flock_user'); },
  logout()      { localStorage.clear(); window.location.href = 'login.html'; },
  requireAuth() { if (!this.getUser()) window.location.href = 'login.html'; },

  /* ── Onboarding ──────────────────────────────────────── */
  isOnboarded()  { return !!localStorage.getItem('flock_onboarded'); },
  setOnboarded() { localStorage.setItem('flock_onboarded', '1'); },

  /* ── Profile ─────────────────────────────────────────── */
  getProfile() {
    try { return JSON.parse(localStorage.getItem('flock_profile') || '{}'); } catch { return {}; }
  },
  setProfile(p) { localStorage.setItem('flock_profile', JSON.stringify(p)); },

  /* ── Interests ───────────────────────────────────────── */
  getInterests() {
    try { return JSON.parse(localStorage.getItem('flock_interests') || '[]'); } catch { return []; }
  },
  setInterests(a) { localStorage.setItem('flock_interests', JSON.stringify(a)); },

  /* ── Preferences ─────────────────────────────────────── */
  getPrefs() {
    try {
      return JSON.parse(localStorage.getItem('flock_prefs') || '{"city":"London","dist":25,"ft":"Both"}');
    } catch { return { city: 'London', dist: 25, ft: 'Both' }; }
  },
  setPrefs(p) { localStorage.setItem('flock_prefs', JSON.stringify(p)); },

  /* ── My Events ───────────────────────────────────────── */
  getMyEvents() {
    try { return JSON.parse(localStorage.getItem('flock_my_events') || '[]'); } catch { return []; }
  },
  joinEvent(id) {
    const e = this.getMyEvents();
    if (!e.includes(id)) { e.push(id); localStorage.setItem('flock_my_events', JSON.stringify(e)); }
  },
  leaveEvent(id) {
    localStorage.setItem('flock_my_events', JSON.stringify(this.getMyEvents().filter(x => x !== id)));
  },
  isJoined(id) { return this.getMyEvents().includes(id); },

  /* ── Jags demo seed ──────────────────────────────────── */
  seedJags() {
    this.setProfile(JAGS.profile);
    this.setInterests(JAGS.interests);
    this.setPrefs(JAGS.prefs);
    // Preserve any events Jags has joined, but start fresh on first seed
    if (!localStorage.getItem('flock_jags_seeded')) {
      localStorage.setItem('flock_my_events', '[]');
      localStorage.setItem('flock_jags_seeded', '1');
    }
    this.setOnboarded();
  }
};

/* ══════════════════════════════════════════════════════════
   SHARED UI HELPERS
══════════════════════════════════════════════════════════ */
function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
}
