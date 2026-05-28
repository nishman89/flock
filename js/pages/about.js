'use strict';

const loggedIn = !!Flock.getUser();

/* Logo links home if logged in */
document.getElementById('about-logo-link').href = loggedIn ? 'home.html' : 'about.html';

/* Header action  -  sign in button for guests */
if (!loggedIn) {
  document.getElementById('about-header-action').innerHTML =
    '<a href="login.html" id="about-signin-link" class="btn btn-primary" style="padding:9px 18px;font-size:14px;width:auto;display:inline-block">Sign In</a>';
}

/* Show bottom nav only when logged in */
if (loggedIn) {
  setActiveNav('about');
}

/* CTA: always show Browse Roosts  -  goes to home if logged in, login if not */
const ctaHref = loggedIn ? 'home.html' : 'login.html';
const ctaSub  = loggedIn
  ? 'Find Roosts near you right now'
  : 'Sign in or create a free account to get started';

document.getElementById('about-cta').innerHTML = `
  <a href="${ctaHref}" id="about-browse-btn" class="btn btn-primary"
     style="max-width:280px;margin:0 auto;display:block;margin-bottom:10px">
    Browse Roosts
  </a>
  <p style="font-size:13px;color:var(--text3)">${ctaSub}</p>
  ${!loggedIn ? '<p style="font-size:13px;color:var(--text3);margin-top:4px">New here? <a href="signup.html" id="about-signup-link" style="color:var(--primary);font-weight:600">Create a free account</a></p>' : ''}
`;
