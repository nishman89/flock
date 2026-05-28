'use strict';
Flock.requireAuth();
setActiveNav('home');

const prefs   = Flock.getPrefs();
const profile = Flock.getProfile();
const hr      = new Date().getHours();
const greetWord = hr < 12 ? 'Morning' : hr < 17 ? 'Afternoon' : 'Evening';
document.getElementById('greeting-text').textContent =
  `Good ${greetWord}${profile.firstName ? ', ' + profile.firstName : ''} 👋`;

const citySel = document.getElementById('city-filter');
CITIES.forEach(c => {
  const opt = document.createElement('option');
  opt.value = c; opt.textContent = '📍 ' + c;
  if (c === prefs.city) opt.selected = true;
  citySel.appendChild(opt);
});

let activeCity  = prefs.city || 'London';
let activeCat   = 'All';
let activeSort  = 'date';
let searchQuery = '';
let userLat     = null;
let userLng     = null;

const CITY_COORDS = {
  'London':     [51.5074,-0.1278], 'Manchester': [53.4808,-2.2426],
  'Birmingham': [52.4862,-1.8904], 'Edinburgh':  [55.9533,-3.1883],
  'Bristol':    [51.4545,-2.5879], 'Leeds':      [53.8008,-1.5491],
  'Liverpool':  [53.4084,-2.9916], 'Glasgow':    [55.8642,-4.2518],
  'Cardiff':    [51.4816,-3.1791], 'Newcastle':  [54.9783,-1.6178],
};

function haversine(lat1,lng1,lat2,lng2) {
  const R=3958.8, dLat=(lat2-lat1)*Math.PI/180, dLng=(lng2-lng1)*Math.PI/180;
  const a=Math.sin(dLat/2)**2+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
  return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
}

function useMyLocation() {
  if (!navigator.geolocation) { setLocationBtn('error','Not supported'); return; }
  setLocationBtn('loading','Getting location...');
  navigator.geolocation.getCurrentPosition(
    pos => {
      userLat = pos.coords.latitude; userLng = pos.coords.longitude;
      let nearest = CITIES[0], minD = Infinity;
      CITIES.forEach(city => {
        const cc = CITY_COORDS[city]; if (!cc) return;
        const d = haversine(userLat,userLng,cc[0],cc[1]);
        if (d < minD) { minD = d; nearest = city; }
      });
      activeCity = nearest;
      document.getElementById('city-filter').value = nearest;
      setLocationBtn('located','📍 ' + nearest);
      render();
    },
    err => {
      userLat = null; userLng = null;
      setLocationBtn('error', err.code === 1 ? 'Location blocked' : 'Could not locate');
      setTimeout(() => setLocationBtn('','Use my location'), 3000);
    },
    { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false }
  );
}

function setLocationBtn(state, text) {
  const btn = document.getElementById('location-btn');
  const span = document.getElementById('location-btn-text');
  if (!btn||!span) return;
  btn.className = 'location-btn' + (state ? ' '+state : '');
  btn.disabled  = state === 'loading';
  span.textContent = text;
}

function setCat(cat, el) {
  activeCat = cat;
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  render();
}

function applyFilters() {
  activeCity = document.getElementById('city-filter').value;
  activeSort = document.getElementById('sort-filter').value;
  render();
}

function applySearch(input) {
  searchQuery = input.value.trim().toLowerCase();
  document.getElementById('search-clear').classList.toggle('show', searchQuery.length > 0);
  render();
}

function clearSearch() {
  searchQuery = '';
  document.getElementById('search-input').value = '';
  document.getElementById('search-clear').classList.remove('show');
  render();
}

function fmtDate(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function render() {
  const today = new Date(); today.setHours(0,0,0,0);
  let items = [];

  FLOCKS.forEach(f => {
    if (f.city !== activeCity) return;
    if (activeCat !== 'All' && f.cat !== activeCat) return;
    (f.roosts || []).forEach(r => {
      if (new Date(r.date + 'T00:00:00') < today) return;
      if (searchQuery) {
        const hay = [r.title, f.name, r.venue, ...(f.tags||[])].join(' ').toLowerCase();
        if (!hay.includes(searchQuery)) return;
      }
      const dist = (userLat && r.lat) ? haversine(userLat,userLng,r.lat,r.lng) : null;
      items.push({ ...r, flockId: f.id, flockName: f.name, flockE: f.e, cat: f.cat, _dist: dist });
    });
  });

  items.sort((a,b) => {
    if (activeSort === 'going')  return b.going - a.going;
    if (activeSort === 'spots')  return (a.max - a.going) - (b.max - b.going);
    return new Date(a.date) - new Date(b.date);
  });

  const list = document.getElementById('events-container');
  if (items.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">🪺</div><h3>No Roosts found</h3><p>Try a different city or category.</p></div>`;
    return;
  }

  list.innerHTML = items.map(r => {
    const col      = EV_COLS[r.cat] || '#374151';
    const spots    = r.max - r.going;
    const full     = spots <= 0;
    const attending = Flock.isAttending(r.flockId, r.id);
    const member   = Flock.isFlockMember(r.flockId);
    return `
      <a id="roost-card-${r.flockId}-${r.id}" class="event-card" href="event.html?id=${r.flockId}">
        <div class="card-head" style="background:${col}">
          <span class="card-emoji">${r.flockE}</span>
          <span class="card-cat-badge">${r.cat}</span>
          <span class="card-price-badge">${attending ? '✓ Going' : full ? '🔴 Full' : r.price}</span>
        </div>
        <div class="card-body">
          <div class="card-title">${r.title}</div>
          <div style="font-size:12px;color:var(--primary-dk);font-weight:600;margin-bottom:6px">
            🐦 ${r.flockName}${member ? ' <span style="color:var(--ok)">· Member</span>' : ''}
          </div>
          <div class="card-meta">
            <span class="meta-item">📅 ${fmtDate(r.date)}</span>
            <span class="meta-item">🕐 ${r.time}</span>
            <span class="meta-item">📍 ${r.venue}</span>
            ${r._dist ? `<span class="meta-item">${r._dist.toFixed(1)} mi away</span>` : ''}
          </div>
          <div class="card-foot">
            <span class="att-count">${r.going} going &middot; <span style="color:${spots<5?'var(--err)':'var(--text3)'}">${full?'Full':spots+' left'}</span></span>
            <span class="card-price">${r.price}</span>
          </div>
        </div>
      </a>`;
  }).join('');
}

render();
