'use strict';
if (Flock.getUser()) {
  window.location.href = Flock.isOnboarded() ? 'home.html' : 'onboarding.html';
}

function showErr(id, msg) {
  const el = document.getElementById('err-signup-' + id);
  if (el) { if (msg) el.textContent = msg; el.classList.add('show'); }
  const inp = document.getElementById('signup-' + id);
  if (inp) inp.classList.add('invalid');
}

function clearErrs() {
  ['firstname','username','password','confirm'].forEach(k => {
    const el  = document.getElementById('err-signup-' + k);
    const inp = document.getElementById('signup-' + k);
    if (el)  el.classList.remove('show');
    if (inp) inp.classList.remove('invalid');
  });
  const ge = document.getElementById('signup-error');
  if (ge) ge.style.display = 'none';
}

/* Check if a username is already registered in localStorage */
function usernameExists(username) {
  // The only registered user stored is whoever last logged in
  // We store all registered usernames in flock_registered
  try {
    const reg = JSON.parse(localStorage.getItem('flock_registered') || '[]');
    return reg.map(u => u.toLowerCase()).includes(username.toLowerCase());
  } catch { return false; }
}

function registerUsername(username) {
  try {
    const reg = JSON.parse(localStorage.getItem('flock_registered') || '[]');
    if (!reg.map(u => u.toLowerCase()).includes(username.toLowerCase())) {
      reg.push(username);
      localStorage.setItem('flock_registered', JSON.stringify(reg));
    }
  } catch {}
}

document.getElementById('signup-form').addEventListener('submit', function(e) {
  e.preventDefault();
  clearErrs();

  const firstName = document.getElementById('signup-firstname').value.trim();
  const lastName  = document.getElementById('signup-lastname').value.trim();
  const username  = document.getElementById('signup-username').value.trim().toLowerCase();
  const password  = document.getElementById('signup-password').value;
  const confirm   = document.getElementById('signup-confirm').value;

  let valid = true;

  if (!firstName || firstName.length < 2) {
    showErr('firstname', 'Please enter your first name'); valid = false;
  }
  if (!username || username.length < 3) {
    showErr('username', 'Username must be at least 3 characters'); valid = false;
  } else if (/\s/.test(username)) {
    showErr('username', 'No spaces allowed in username'); valid = false;
  } else if (usernameExists(username) || username === 'nish') {
    showErr('username', 'That username is already taken  -  try another'); valid = false;
  }
  if (!password || password.length < 6) {
    showErr('password', 'Password must be at least 6 characters'); valid = false;
  }
  if (password !== confirm) {
    showErr('confirm', 'Passwords do not match'); valid = false;
  }

  if (!valid) return;

  registerUsername(username);
  Flock.login(username);
  Flock.setProfile({ firstName, lastName, dob: '', avatar: '🐦' });
  window.location.href = 'onboarding.html';
});
