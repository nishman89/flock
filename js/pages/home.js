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
  `Good ${greetWord}${profile.firstName ? ', ' + profile.firstName : ''} 👋`;

/* Populate city select */
const citySel = document.getElementById('city-filter');
CITIES.forEach(c => {
  const opt = document.createElement('option');
  opt.value = c; opt.textContent = '📍 ' + c;
  if (c === prefs.city) opt.selected = true;
  citySel.appendChild(opt);
});
document.getElementById('distance-filter').value = prefs.dist || 999;

let activeCity  = prefs.city || 'London';
let activeDist  = prefs.dist || 999;
let activeCat   = 'All';
let activeSort  = 'date';
let searchQuery = '';
let userLat     = null;
let userLng     = null;

/* City centre coordinates for nearest-city detection */
const CITY_COORDS = {
  'London':     [51.5074, -0.1278],
  'Manchester': [53.4808, -2.2426],
  'Birmingham': [52.4862, -1.8904],
  'Edinburgh':  [55.9533, -3.1883],
  'Bristol':    [51.4545, -2.5879],
  'Leeds':      [53.8008, -1.5491],
  'Liverpool':  [53.4084, -2.9916],
  'Glasgow':    [55.8642, -4.2518],
  'Cardiff':    [51.4816, -3.1791],
  'Newcastle':  [54.9783, -1.6178],
};

function haversine(lat1, lng1, lat2, lng2) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2)**2 +
            Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLng/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function useMyLocation() {
  if (!navigator.geolocation) {
    setLocationBtn('error', '⚠ Not supported');
    return;
  }
  setLocationBtn('loading', 'Getting location…');

  navigator.geolocation.getCurrentPosition(
    pos => {
      userLat = pos.coords.latitude;
      userLng = pos.coords.longitude;

      /* Find nearest city */
      let nearest = CITIES[0]; let minD = Infinity;
      CITIES.forEach(city => {
        const cc = CITY_COORDS[city];
        if (!cc) return;
        const d = haversine(userLat, userLng, cc[0], cc[1]);
        if (d < minD) { minD = d; nearest = city; }
      });

      activeCity = nearest;
      document.getElementById('city-filter').value = nearest;
      setLocationBtn('located', '📍 ' + nearest);
      renderEvents();
    },
    err => {
      userLat = null; userLng = null;
      if (err.code === 1) {
        // Permission denied  -  guide user to fix it
        setLocationBtn('error', '⚠ Location blocked');
        // Show a helpful tip below the button
        const btn = document.getElementById('location-btn');
        if (btn) {
          let tip = document.getElementById('location-tip');
          if (!tip) {
            tip = document.createElement('p');
            tip.id = 'location-tip';
            tip.style.cssText = 'font-size:12px;color:var(--text3);margin:4px 0 0;text-align:center';
            btn.parentNode.insertBefore(tip, btn.nextSibling);
          }
          const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
          tip.textContent = isIOS
            ? 'To allow: Settings → Safari → Location → Allow'
            : 'Tap the 🔒 in your browser address bar and allow Location.';
          setTimeout(() => { tip.remove(); setLocationBtn('', 'Use my location'); }, 6000);
        }
      } else {
        setLocationBtn('error', '⚠ Could not get location');
        setTimeout(() => setLocationBtn('', 'Use my location'), 3000);
      }
    },
    { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false }
  );
}

function setLocationBtn(state, text) {
  const btn  = document.getElementById('location-btn');
  const span = document.getElementById('location-btn-text');
  if (!btn || !span) return;
  btn.className = 'location-btn' + (state ? ' ' + state : '');
  btn.disabled  = state === 'loading';
  span.textContent = text;
}

function setCat(cat, el) {
  activeCat = cat;
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderEvents();
}

function applyFilters() {
  activeCity = document.getElementById('city-filter').value;
  activeDist = parseInt(document.getElementById('distance-filter').value);
  activeSort = document.getElementById('sort-filter').value;
  renderEvents();
}

function applySearch(input) {
  searchQuery = input.value.trim().toLowerCase();
  const clearBtn = document.getElementById('search-clear');
  if (clearBtn) clearBtn.classList.toggle('show', searchQuery.length > 0);
  renderEvents();
}

function clearSearch() {
  searchQuery = '';
  const inp = document.getElementById('search-input');
  const clearBtn = document.getElementById('search-clear');
  if (inp) inp.value = '';
  if (clearBtn) clearBtn.classList.remove('show');
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
  const today = new Date(); today.setHours(0,0,0,0);
  const soon  = new Date(today); soon.setDate(soon.getDate() + 2);

  let items = EVENTS.filter(e => {
    if (e.city !== activeCity) return false;
    const dist = (userLat && e.lat) ? haversine(userLat, userLng, e.lat, e.lng) : e.dist;
    if (activeDist !== 999 && dist > activeDist) return false;
    if (activeCat === 'Soon') {
      const evDate = new Date(e.date + 'T00:00:00');
      if (evDate > soon) return false;
    } else if (activeCat !== 'All' && e.cat !== activeCat) return false;
    if (searchQuery) {
      const hay = [e.t, e.venue, e.desc, ...(e.tags || [])].join(' ').toLowerCase();
      if (!hay.includes(searchQuery)) return false;
    }
    return true;
  }).map(e => ({
    ...e,
    _dist: (userLat && e.lat) ? haversine(userLat, userLng, e.lat, e.lng) : e.dist
  }));

  items = [...items].sort((a, b) => {
    if (activeSort === 'dist')  return a._dist - b._dist;
    if (activeSort === 'going') return b.going - a.going;
    if (activeSort === 'spots') return (a.max - a.going) - (b.max - b.going);
    return new Date(a.date) - new Date(b.date);
  });

  const list = document.getElementById('events-container');

  if (items.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <h3>No Flocks found</h3>
        <p>Try a different city, increasing your distance, or a different category to find your Flock.</p>
      </div>`;
    return;
  }

  list.innerHTML = items.map(e => {
    const col   = EV_COLS[e.cat] || '#374151';
    const spots = e.max - e.going;
    const full  = spots <= 0;
    const dist  = e._dist;
    const recurringBadge = e.recurring ? `<span class="recurring-badge">🔁 Weekly</span>` : '';
    return `
      <a id="event-card-${e.id}" class="event-card" href="event.html?id=${e.id}" data-event-id="${e.id}">
        <div class="card-head" style="background:${col}">
          <span class="card-emoji">${e.e}</span>
          <span class="card-cat-badge">${e.cat}</span>
          <span class="card-price-badge">${full ? '🔴 Full' : e.price}</span>
        </div>
        <div class="card-body">
          <div class="card-title">${e.t}</div>
          ${recurringBadge}
          <div class="card-meta">
            <span class="meta-item">📅 ${fmtDate(e.date)}</span>
            <span class="meta-item">🕐 ${e.time}</span>
            <span class="meta-item">📍 ${e.venue}</span>
            <span class="meta-item" style="color:${dist > 10 ? 'var(--text3)' : 'var(--ok)'}">
              ${dist < 1 ? 'Nearby' : dist.toFixed(1) + ' mi away'}
            </span>
          </div>
          <div class="card-foot">
            <div class="attendee-row">
              ${miniAvatars(e.going)}
              <span class="att-count">${e.going} going · <span style="color:${spots < 5 ? 'var(--err)' : 'var(--text3)'}">${full ? 'Full' : spots + ' left'}</span></span>
            </div>
            <span class="card-price">${e.price === 'Free' ? 'Free' : e.price}</span>
          </div>
        </div>
      </a>`;
  }).join('');
}

renderEvents();
