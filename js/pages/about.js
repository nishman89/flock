'use strict';

const loggedIn = !!Flock.getUser();

/* Logo links to home if logged in, stays on about if not */
document.getElementById('about-logo-link').href = loggedIn ? 'home.html' : 'about.html';

/* Show nav or sign-in button depending on login state */
if (loggedIn) {
  document.getElementById('about-bottom-nav').style.display = 'flex';
} else {
  document.getElementById('about-header-action').innerHTML =
    '<a href="login.html" id="about-signin-link" class="btn btn-primary" style="padding:9px 18px;font-size:14px;width:auto;display:inline-block">Sign In</a>';
}

/* CTA block */
document.getElementById('about-cta').innerHTML = loggedIn
  ? `<a href="home.html" id="about-browse-btn" class="btn btn-primary" style="max-width:280px;margin:0 auto;display:block">Browse Events</a>
     <p style="margin-top:12px;font-size:13px;color:var(--text3)">Find events near you right now</p>`
  : `<a href="signup.html" id="about-signup-btn" class="btn btn-primary" style="max-width:280px;margin:0 auto;display:block;margin-bottom:10px">Join Flock — it's free</a>
     <p style="font-size:13px;color:var(--text3)">Already have an account? <a href="login.html" style="color:var(--primary);font-weight:600">Sign in</a></p>`;
