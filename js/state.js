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

  /* ── Flock group membership ──────────────────────────────── */
  getMyFlocks() {
    try { return JSON.parse(localStorage.getItem('flock_my_flocks') || '[]'); } catch { return []; }
  },
  joinFlock(id) {
    const f = this.getMyFlocks();
    if (!f.includes(id)) { f.push(id); localStorage.setItem('flock_my_flocks', JSON.stringify(f)); }
  },
  leaveFlock(id) {
    localStorage.setItem('flock_my_flocks', JSON.stringify(this.getMyFlocks().filter(x => x !== id)));
    // also clear any roost attendance for this flock
    const att = this.getRoostAttendance();
    Object.keys(att).filter(k => k.startsWith(id + '_')).forEach(k => delete att[k]);
    localStorage.setItem('flock_roost_attendance', JSON.stringify(att));
  },
  isFlockMember(id) { return this.getMyFlocks().includes(id); },

  /* ── Roost attendance ───────────────────────────────────── */
  getRoostAttendance() {
    try { return JSON.parse(localStorage.getItem('flock_roost_attendance') || '{}'); } catch { return {}; }
  },
  attendRoost(flockId, roostId) {
    const att = this.getRoostAttendance();
    att[flockId + '_' + roostId] = true;
    localStorage.setItem('flock_roost_attendance', JSON.stringify(att));
  },
  unattendRoost(flockId, roostId) {
    const att = this.getRoostAttendance();
    delete att[flockId + '_' + roostId];
    localStorage.setItem('flock_roost_attendance', JSON.stringify(att));
  },
  isAttending(flockId, roostId) {
    return !!this.getRoostAttendance()[flockId + '_' + roostId];
  },
  getLiveGoing(flockId, roostId, base) {
    return base + (this.isAttending(flockId, roostId) ? 1 : 0);
  },

  seedNish() {
    this.setProfile(JAGS.profile);
    this.setInterests(JAGS.interests);
    this.setPrefs(JAGS.prefs);
    if (!localStorage.getItem('flock_nish_seeded')) {
      // Nish is a member of 3 Flocks
      localStorage.setItem('flock_my_flocks', JSON.stringify(['FL001','FL004','FL024']));
      // And attending specific Roosts within those Flocks
      localStorage.setItem('flock_roost_attendance', JSON.stringify({
        'FL001_M1': true,   // Arsenal vs Spurs - North London Derby
        'FL004_M1': true,   // Brick Lane Street Food Tour
        'FL024_M1': true,   // Mario Kart Grand Prix Night
      }));
      localStorage.setItem('flock_nish_seeded', '1');
    }
    this.setOnboarded();
  },

  /* ── Checkout (paid roosts) ─────────────────────────────── */
  setCheckoutEvent(id) { localStorage.setItem('flock_checkout_event', id); },
  getCheckoutEvent()   { return localStorage.getItem('flock_checkout_event'); },
  clearCheckoutEvent() { localStorage.removeItem('flock_checkout_event'); },
  setCheckoutInfo(d)   { localStorage.setItem('flock_checkout_info', JSON.stringify(d)); },
  getCheckoutInfo() {
    try { return JSON.parse(localStorage.getItem('flock_checkout_info') || '{}'); } catch { return {}; }
  },
  clearCheckoutInfo() { localStorage.removeItem('flock_checkout_info'); },
  completeCheckout() {
    const key = this.getCheckoutEvent(); // format: "FL001_M2"
    if (key) {
      const [flockId, roostId] = key.split('_M');
      this.joinFlock(flockId);
      this.attendRoost(flockId, 'M' + roostId);
    }
    this.clearCheckoutEvent();
    this.clearCheckoutInfo();
  }
};

function setActiveNav(page) {
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });
}
