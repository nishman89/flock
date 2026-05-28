'use strict';
Flock.requireAuth();
setActiveNav('roosts');

const prefs   = Flock.getPrefs();
const profile = Flock.getProfile();

const hr = new Date().getHours();
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
document.getElementById('sort-filter').innerHTML = `
  <option value="date">Soonest</option>
  <option value="going">Most popular</option>
  <option value="spots">Spots left</option>`;

let activeCity  = prefs.city || 'London';
let activeCat   = 'All';
let activeSort  = 'date';
let searchQuery = '';

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
    f.roosts.forEach(m => {
      if (new Date(m.date + 'T00:00:00') < today) return;
      if (searchQuery) {
        const hay = [m.title, f.name, m.venue, ...(f.tags||[])].join(' ').toLowerCase();
        if (!hay.includes(searchQuery)) return;
      }
      items.push({ ...m, flockId: f.id, flockName: f.name, flockE: f.e, cat: f.cat });
    });
  });

  items.sort((a, b) => {
    if (activeSort === 'going')  return b.going - a.going;
    if (activeSort === 'spots')  return (a.max - a.going) - (b.max - b.going);
    return new Date(a.date) - new Date(b.date);
  });

  const list = document.getElementById('events-container');
  if (items.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><h3>No events found</h3><p>Try a different city or category.</p></div>`;
    return;
  }

  list.innerHTML = items.map(e => {
    const col   = EV_COLS[e.cat] || '#374151';
    const spots = e.max - e.going;
    const full  = spots <= 0;
    const attending = Flock.isAttending(e.flockId, e.id);
    return `
      <a id="event-card-${e.flockId}-${e.id}" class="event-card" href="event.html?id=${e.flockId}">
        <div class="card-head" style="background:${col}">
          <span class="card-emoji">${e.flockE}</span>
          <span class="card-cat-badge">${e.cat}</span>
          <span class="card-price-badge">${attending ? '✓ Going' : full ? '🔴 Full' : e.price}</span>
        </div>
        <div class="card-body">
          <div class="card-title">${e.title}</div>
          <div style="font-size:12px;color:var(--text3);font-weight:600;margin-bottom:6px">📍 ${e.flockName}</div>
          <div class="card-meta">
            <span class="meta-item">📅 ${fmtDate(e.date)}</span>
            <span class="meta-item">🕐 ${e.time}</span>
            <span class="meta-item">📍 ${e.venue}</span>
          </div>
          <div class="card-foot">
            <span class="att-count">${e.going} going &middot; <span style="color:${spots < 5 ? 'var(--err)' : 'var(--text3)'}">${full ? 'Full' : spots + ' left'}</span></span>
            <span class="card-price">${e.price}</span>
          </div>
        </div>
      </a>`;
  }).join('');
}

render();
