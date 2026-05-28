'use strict';
if (Flock.getUser()) {
  window.location.href = Flock.isOnboarded() ? 'home.html' : 'onboarding.html';
}

function showErr(id, msg) {
  const el = document.getElementById('err-signup-' + id);
  if (msg) el.textContent = msg;
  el.classList.add('show');
  document.getElementById('signup-' + id).classList.add('invalid');
}

function clearErrs() {
  ['fullname','username','password','confirm'].forEach(function(k) {
    const el = document.getElementById('err-signup-' + k);
    if (el) { el.classList.remove('show'); }
    const inp = document.getElementById('signup-' + k);
    if (inp) { inp.classList.remove('invalid'); }
  });
  document.getElementById('signup-error').style.display = 'none';
}

document.getElementById('signup-form').addEventListener('submit', function(e) {
  e.preventDefault();
  clearErrs();

  const name     = document.getElementById('signup-fullname').value.trim();
  const username = document.getElementById('signup-username').value.trim().toLowerCase();
  const password = document.getElementById('signup-password').value;
  const confirm  = document.getElementById('signup-confirm').value;

  let valid = true;

  if (!name || name.length < 2) {
    showErr('fullname', 'Please enter your full name'); valid = false;
  }
  if (!username || username.length < 3) {
    showErr('username', 'Username must be at least 3 characters'); valid = false;
  } else if (username === 'jags') {
    showErr('username', 'That username is already taken — try another'); valid = false;
  } else if (/\s/.test(username)) {
    showErr('username', 'Username cannot contain spaces'); valid = false;
  }
  if (!password || password.length < 6) {
    showErr('password', 'Password must be at least 6 characters'); valid = false;
  }
  if (password !== confirm) {
    showErr('confirm', 'Passwords do not match'); valid = false;
  }

  if (!valid) return;

  // Create the account in localStorage
  Flock.login(username);
  Flock.setProfile({ name: name.split(' ')[0], fullName: name, age: '' });
  // Not onboarded yet — send to onboarding to set preferences
  window.location.href = 'onboarding.html';
});
