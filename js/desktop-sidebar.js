'use strict';

function initDesktop() {
  if (window.innerWidth < 768) return;

  const shell = document.querySelector('.app-shell');
  if (!shell || shell.dataset.desktop) return;
  shell.dataset.desktop = '1';

  const page = location.pathname.split('/').pop() || 'home.html';

  const svgs = {
    home:     '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    events:   '<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
    profile:  '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    logout:   '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
    about:    '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>',
    chats:    '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  };

  function icon(paths) {
    return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
  }

  function navLink(href, id, label, svgPaths) {
    const active = page === href ? 'active' : '';
    return `<a id="sidebar-nav-${id}" class="sb-link ${active}" href="${href}">${icon(svgPaths)}<span>${label}</span></a>`;
  }

  const birdSVG = `<svg width="24" height="19" viewBox="0 0 36 28" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M2 25 Q9 12 18 18 Q27 12 34 25 L18 17 Z" fill="white"/>
  <path d="M0 15 Q6 5 13 10 Q20 5 26 15 L13 9 Z" fill="white"/>
  <path d="M18 8 Q22 2 27 5 Q32 2 36 8 L27 4.5 Z" fill="white"/>
</svg>`;

  const sidebar = document.createElement('aside');
  sidebar.className = 'sb';
  sidebar.innerHTML = `
    <a class="sb-logo" href="home.html">
      <div class="sb-logo-icon">${birdSVG}</div>
      <span class="sb-brand">Flock</span>
    </a>
    <nav class="sb-nav">
      ${navLink('home.html',      'home',      'Discover',  svgs.home)}
      ${navLink('my-events.html', 'my-events', 'My Events', svgs.events)}
      ${navLink('profile.html',   'profile',   'Profile',   svgs.profile)}
      ${navLink('about.html',    'about',     'About',     svgs.about)}
      <button id="sidebar-nav-chats" class="sb-link" onclick="showSidebarChatsPopup()" style="background:none;border:none;cursor:pointer;width:100%;text-align:left">${icon(svgs.chats)}<span>Chats</span></button>
    </nav>
    <div class="sb-foot">
      <button id="sidebar-signout-btn" class="sb-logout" onclick="Flock.logout()">
        ${icon(svgs.logout)} Sign Out
      </button>
    </div>`;

  /* Wrap existing shell children in .page-main */
  const main = document.createElement('div');
  main.className = 'page-main';
  while (shell.firstChild) main.appendChild(shell.firstChild);

  const wrap = document.createElement('div');
  wrap.className = 'page-wrap';
  wrap.appendChild(sidebar);
  wrap.appendChild(main);
  shell.appendChild(wrap);
}

/* Run after all other scripts */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDesktop);
} else {
  initDesktop();
}

function showSidebarChatsPopup() {
  let ov = document.getElementById('sidebar-chats-overlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'sidebar-chats-overlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:300;padding:20px';
    ov.innerHTML = `
      <div style="background:#fff;border-radius:16px;padding:28px 24px;max-width:300px;width:100%;text-align:center">
        <div style="font-size:36px;margin-bottom:12px">💬</div>
        <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:18px;font-weight:700;color:#1C0A00;margin-bottom:8px">Chats</div>
        <div style="font-size:14px;color:#6B3A1F;line-height:1.5;margin-bottom:20px">
          Not yet implemented - the Chats feature is coming soon. You'll be able to message other attendees before and after events.
        </div>
        <button onclick="document.getElementById('sidebar-chats-overlay').remove()"
          id="sidebar-chats-close-btn"
          style="padding:11px 0;width:100%;background:#F97316;color:#fff;border:none;border-radius:10px;font-size:15px;font-weight:600;cursor:pointer">
          Got it
        </button>
      </div>`;
    ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
    document.body.appendChild(ov);
  }
}
