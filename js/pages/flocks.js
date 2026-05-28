'use strict';
Flock.requireAuth();
setActiveNav('flocks');

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

// Override sort options for group browsing
document.getElementById('sort-filter').innerHTML = `
  <option value="members">Most members</option>
  <option value="next">Next Roost</option>
  <option value="name">A - Z</option>`;

let activeCity  = prefs.city || 'London';
let activeCat   = 'All';
let activeSort  = 'members';
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
  let items = FLOCKS.filter(f => {
    if (f.city !== activeCity) return false;
    if (activeCat !== 'All' && f.cat !== activeCat) return false;
    if (searchQuery) {
      const hay = [f.name, f.desc, ...(f.tags||[])].join(' ').toLowerCase();
      if (!hay.includes(searchQuery)) return false;
    }
    return true;
  });

  items = [...items].sort((a, b) => {
    if (activeSort === 'members') return b.members - a.members;
    if (activeSort === 'name')    return a.name.localeCompare(b.name);
    // next Roost soonest
    const nA = (a.roosts||[])[0]?.date || '9999';
    const nB = (b.roosts||[])[0]?.date || '9999';
    return nA.localeCompare(nB);
  });

  const list = document.getElementById('events-container');

  if (items.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">🐦</div><h3>No Flocks found</h3><p>Try a different city or category.</p></div>`;
    return;
  }

  list.innerHTML = items.map(f => {
    const col    = EV_COLS[f.cat] || '#374151';
    const next   = (f.roosts||[])[0];
    const member = Flock.isFlockMember(f.id);
    const liveMembers = f.members + (member ? 1 : 0);
    return `
      <a id="flock-card-${f.id}" class="event-card" href="event.html?id=${f.id}">
        <div class="card-head" style="background:${col}">
          <span class="card-emoji">${f.e}</span>
          <span class="card-cat-badge">${f.cat}</span>
          ${member ? '<span class="card-price-badge" style="background:rgba(22,163,74,.85)">✓ Member</span>' : ''}
        </div>
        <div class="card-body">
          <div class="card-title">${f.name}</div>
          <div class="card-meta">
            <span class="meta-item">👥 ${liveMembers} members</span>
            <span class="meta-item">${(f.roosts||[]).length} Roost${(f.roosts||[]).length !== 1 ? 's' : ''}</span>
            ${next ? `<span class="meta-item">📅 Next: ${fmtDate(next.date)}</span>` : ''}
          </div>
          <div class="card-foot">
            <span style="font-size:13px;color:var(--text3)">${next ? next.venue : 'No upcoming Roosts'}</span>
            <span class="card-price">${next?.price === 'Free' ? 'Free' : next?.price || ''}</span>
          </div>
        </div>
      </a>`;
  }).join('');
}

render();
