'use strict';
Flock.requireAuth();
setActiveNav('my-events');

function fmtDate(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function eventCard(e, past) {
  const col = EV_COLS[e.cat] || '#F97316';
  return `
    <a id="my-event-card-${e.id}" class="my-event-card${past ? ' past' : ''}" href="event.html?id=${e.id}">
      <div class="my-event-accent" style="background:${col}"></div>
      <div class="my-event-body">
        <div class="my-event-title">${e.e} ${e.t}</div>
        <div class="my-event-meta">
          <span>📅 ${fmtDate(e.date)}</span>
          <span>🕐 ${e.time}</span>
        </div>
        <div class="my-event-venue">📍 ${e.venue}, ${e.city}</div>
        ${e.recurring ? '<span class="recurring-badge">🔁 Weekly</span>' : ''}
      </div>
      <div style="display:flex;align-items:center;padding-right:14px;color:var(--text3)">
        ${past
          ? `<span style="font-size:11px;font-weight:600;color:var(--text3)">Past</span>`
          : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>`
        }
      </div>
    </a>`;
}

function render() {
  const ids    = Flock.getMyEvents();
  const events = EVENTS.filter(e => ids.includes(e.id));
  const el     = document.getElementById('my-events-container');

  if (events.length === 0) {
    el.innerHTML = `
      <div id="my-events-empty" class="empty-state">
        <div class="empty-icon">🐦</div>
        <h3>No Flocks yet</h3>
        <p>Discover Flocks near you and join in!</p>
        <a href="home.html" class="btn btn-primary" style="margin-top:8px;max-width:200px;padding:12px;display:block">Browse Flocks</a>
      </div>`;
    return;
  }

  const today    = new Date(); today.setHours(0,0,0,0);
  const upcoming = events.filter(e => new Date(e.date + 'T00:00:00') >= today);
  const past     = events.filter(e => new Date(e.date + 'T00:00:00') <  today);

  upcoming.sort((a,b) => new Date(a.date) - new Date(b.date));
  past.sort((a,b) => new Date(b.date) - new Date(a.date));

  let html = '';

  if (upcoming.length > 0) {
    html += `<p style="font-size:13px;color:var(--text3);font-weight:600;margin-bottom:12px">
      ${upcoming.length} event${upcoming.length !== 1 ? 's' : ''} coming up
    </p>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${upcoming.map(e => eventCard(e, false)).join('')}
    </div>`;
  }

  if (past.length > 0) {
    html += `<div class="past-section-title">Past Flocks</div>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${past.map(e => eventCard(e, true)).join('')}
    </div>`;
  }

  el.innerHTML = html;
}

render();
