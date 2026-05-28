'use strict';
if (Flock.getUser()) {
  window.location.href = Flock.isOnboarded() ? 'home.html' : 'onboarding.html';
}

document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const u = document.getElementById('login-username').value.trim();
  const p = document.getElementById('login-password').value;
  const errU = document.getElementById('err-login-username');
  const errP = document.getElementById('err-login-password');
  const errG = document.getElementById('login-error');

  errU.classList.remove('show'); errP.classList.remove('show'); errG.style.display = 'none';

  let ok = true;
  if (!u) { errU.classList.add('show'); ok = false; }
  if (!p) { errP.classList.add('show'); ok = false; }
  if (!ok) return;

  if (u.toLowerCase() === 'nish' && p === 'mandal') {
    Flock.login('nish');
    Flock.seedNish();          // pre-load Nish' profile every login
    window.location.href = 'home.html';
  } else {
    errG.style.display = 'block';
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.getElementById('login-error').style.display = 'none';
});
