'use strict';
Flock.requireAuth();
setActiveNav('home');

/* ── iOS install prompt ─────────────────────────────────── */
(function () {
  const isIOS       = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());
  const isStandalone= window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  if (isIOS && !isStandalone && !localStorage.getItem('flock_banner')) {
    document.getElementById('ios-banner').style.display = 'flex';
  }
})();
function dismissBanner() {
  localStorage.setItem('flock_banner', '1');
  document.getElementById('ios-banner').style.display = 'none';
}

const prefs   = Flock.getPrefs();
const profile = Flock.getProfile();

/* Greeting */
const hr        = new Date().getHours();
const greetWord = hr < 12 ? 'Morning' : hr < 17 ? 'Afternoon' : 'Evening';
document.getElementById('greeting-text').textContent =
  `Good ${greetWord}${profile.name ? ', ' + profile.name.split(' ')[0] : ''} 👋`;

/* Populate city select */
const citySel = document.getElementById('city-filter');
CITIES.forEach(c => {
  const opt = document.createElement('option');
  opt.value = c; opt.textContent = '📍 ' + c;
  if (c === prefs.city) opt.selected = true;
  citySel.appendChild(opt);
});
document.getElementById('distance-filter').value = prefs.dist || 999;

let activeCity = prefs.city || 'London';
let activeDist = prefs.dist || 999;
let activeCat  = 'All';

function setCat(cat, el) {
  activeCat = cat;
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderEvents();
}

function applyFilters() {
  activeCity = document.getElementById('city-filter').value;
  activeDist = parseInt(document.getElementById('distance-filter').value);
  renderEvents();
}

function fmtDate(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function miniAvatars(count) {
  const shown  = Math.min(count, 3);
  const colors = ['#F97316', '#8B5CF6', '#3B82F6', '#EF4444'];
  let html = '<div class="att-avatars">';
  for (let i = 0; i < shown; i++) {
    html += `<div class="att-avatar" style="background:${colors[i % colors.length]}">${'ABCDE'[i]}</div>`;
  }
  html += '</div>';
  return html;
}

function renderEvents() {
  let items = EVENTS.filter(e => {
    if (e.city !== activeCity) return false;
    if (activeDist !== 999 && e.dist > activeDist) return false;
    if (activeCat !== 'All' && e.cat !== activeCat) return false;
    return true;
  });

  const list = document.getElementById('events-container');

  if (items.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>No events found</h3>
        <p>Try a different city, increasing your distance, or choosing a different category.</p>
      </div>`;
    return;
  }

  list.innerHTML = items.map(e => {
    const col   = EV_COLS[e.cat] || '#374151';
    const spots = e.max - e.going;
    return `
      <a id="event-card-${e.id}" class="event-card" href="event.html?id=${e.id}" data-event-id="${e.id}">
        <div class="card-head" style="background:${col}">
          <span class="card-emoji">${e.e}</span>
          <span class="card-cat-badge">${e.cat}</span>
          <span class="card-price-badge">${e.price}</span>
        </div>
        <div class="card-body">
          <div class="card-title">${e.t}</div>
          <div class="card-meta">
            <span class="meta-item">📅 ${fmtDate(e.date)}</span>
            <span class="meta-item">🕐 ${e.time}</span>
            <span class="meta-item">📍 ${e.venue}</span>
            <span class="meta-item" style="color:${e.dist > 10 ? 'var(--text3)' : 'var(--ok)'}">
              ${e.dist < 1 ? 'Nearby' : e.dist + ' mi away'}
            </span>
          </div>
          <div class="card-foot">
            <div class="attendee-row">
              ${miniAvatars(e.going)}
              <span class="att-count">${e.going} going · <span style="color:${spots < 5 ? 'var(--err)' : 'var(--text3)'}">${spots} left</span></span>
            </div>
            <span class="card-price">${e.price === 'Free' ? 'Free' : e.price}</span>
          </div>
        </div>
      </a>`;
  }).join('');
}

renderEvents();
