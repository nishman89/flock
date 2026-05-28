'use strict';
Flock.requireAuth();

/* Generate a booking reference */
const ref = 'FLK-' + Math.random().toString(36).slice(2,6).toUpperCase() +
            '-' + Math.random().toString(36).slice(2,6).toUpperCase();
document.getElementById('booking-ref').textContent = ref;

const profile = Flock.getProfile();
if (profile.name) {
  document.getElementById('confirm-name').textContent = profile.name;
}
