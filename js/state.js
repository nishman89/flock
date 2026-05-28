'use strict';

const Flock = {
  login(u)     { localStorage.setItem('flock_user', u); },
  getUser()    { return localStorage.getItem('flock_user'); },
  logout()     { localStorage.clear(); window.location.href = 'login.html'; },
  requireAuth(){ if (!this.getUser()) window.location.href = 'login.html'; },

  isOnboarded()  { return !!localStorage.getItem('flock_onboarded'); },
  setOnboarded() { localStorage.setItem('flock_onboarded', '1'); },

  getProfile() {
    try { return JSON.parse(localStorage.getItem('flock_profile') || '{}'); } catch { return {}; }
  },
  setProfile(p) { localStorage.setItem('flock_profile', JSON.stringify(p)); },

  getInterests() {
    try { return JSON.parse(localStorage.getItem('flock_interests') || '[]'); } catch { return []; }
  },
  setInterests(a) { localStorage.setItem('flock_interests', JSON.stringify(a)); },

  getPrefs() {
    try { return JSON.parse(localStorage.getItem('flock_prefs') || '{"city":"London","distance":25,"friendType":"Both"}'); }
    catch { return {city:'London',distance:25,friendType:'Both'}; }
  },
  setPrefs(p) { localStorage.setItem('flock_prefs', JSON.stringify(p)); },

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
};

/* Shared nav active state helper — call on each app page */
function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
}
