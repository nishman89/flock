'use strict';

const JAGS = {
  profile:   { firstName: 'Nish', lastName: 'Mandal', dob: '2000-02-02', avatar: '🐦' },
  interests: ['Football', 'Swimming', 'Dancing', 'Pub & Social', 'Food & Dining', 'Cinema', 'Gym & Fitness'],
  prefs:     { city: 'London', dist: 25, friendType: 'Both' }
};

const Flock = {

  login(u)      { localStorage.setItem('flock_user', u); },
  getUser()     { return localStorage.getItem('flock_user'); },
  logout()      { localStorage.clear(); window.location.href = 'login.html?bye=1'; },
  requireAuth() { if (!this.getUser()) window.location.href = 'login.html'; },

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
    try {
      return JSON.parse(localStorage.getItem('flock_prefs') || '{"city":"London","dist":25,"friendType":"Both"}');
    } catch { return { city: 'London', dist: 25, friendType: 'Both' }; }
  },
  setPrefs(p) { localStorage.setItem('flock_prefs', JSON.stringify(p)); },

  getMyEvents() {
    try { return JSON.parse(localStorage.getItem('flock_my_events') || '[]'); } catch { return []; }
  },
  joinEvent(id) {
    const e = this.getMyEvents();
    if (!e.includes(id)) { e.push(id); localStorage.setItem('flock_my_events', JSON.stringify(e)); }
    this.leaveWaitlist(id);
  },
  leaveEvent(id) {
    localStorage.setItem('flock_my_events', JSON.stringify(this.getMyEvents().filter(x => x !== id)));
  },
  isJoined(id) { return this.getMyEvents().includes(id); },

  getWaitlist() {
    try { return JSON.parse(localStorage.getItem('flock_waitlist') || '[]'); } catch { return []; }
  },
  joinWaitlist(id) {
    const w = this.getWaitlist();
    if (!w.includes(id)) { w.push(id); localStorage.setItem('flock_waitlist', JSON.stringify(w)); }
  },
  leaveWaitlist(id) {
    localStorage.setItem('flock_waitlist', JSON.stringify(this.getWaitlist().filter(x => x !== id)));
  },
  isOnWaitlist(id) { return this.getWaitlist().includes(id); },

  seedNish() {
    this.setProfile(JAGS.profile);
    this.setInterests(JAGS.interests);
    this.setPrefs(JAGS.prefs);
    if (!localStorage.getItem('flock_nish_seeded')) {
      localStorage.setItem('flock_my_events', '[]');
      localStorage.setItem('flock_nish_seeded', '1');
    }
    this.setOnboarded();
  },

  setCheckoutEvent(id) { localStorage.setItem('flock_checkout_event', id); },
  getCheckoutEvent()   { return localStorage.getItem('flock_checkout_event'); },
  clearCheckoutEvent() { localStorage.removeItem('flock_checkout_event'); },
  setCheckoutInfo(d)   { localStorage.setItem('flock_checkout_info', JSON.stringify(d)); },
  getCheckoutInfo() {
    try { return JSON.parse(localStorage.getItem('flock_checkout_info') || '{}'); } catch { return {}; }
  },
  clearCheckoutInfo() { localStorage.removeItem('flock_checkout_info'); },
  completeCheckout() {
    const id = this.getCheckoutEvent();
    if (id) this.joinEvent(id);
    this.clearCheckoutEvent();
    this.clearCheckoutInfo();
  }
};

function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
}
