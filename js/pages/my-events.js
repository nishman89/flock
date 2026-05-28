'use strict';
Flock.requireAuth();
setActiveNav('my-events');

function fmtDate(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function render() {
  const ids    = Flock.getMyEvents();
  const events = EVENTS.filter(e => ids.includes(e.id));
  const el     = document.getElementById('my-events-container');

  if (events.length === 0) {
    el.innerHTML = `
      <div id="my-events-empty" class="empty-state">
        <div class="empty-icon">🐦</div>
        <h3>No events yet</h3>
        <p>Discover events near you and join the flock!</p>
        <a href="home.html" class="btn btn-primary" style="margin-top:8px;max-width:200px;padding:12px;display:block">Browse Events</a>
      </div>`;
    return;
  }

  el.innerHTML = `
    <p style="font-size:13px;color:var(--text3);font-weight:600;margin-bottom:12px">
      ${events.length} event${events.length !== 1 ? 's' : ''} coming up
    </p>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${events.map(e => {
        const col = EV_COLS[e.cat] || '#F97316';
        return `
          <a id="my-event-card-${e.id}" class="my-event-card" href="event.html?id=${e.id}">
            <div class="my-event-accent" style="background:${col}"></div>
            <div class="my-event-body">
              <div class="my-event-title">${e.e} ${e.t}</div>
              <div class="my-event-meta">
                <span>📅 ${fmtDate(e.date)}</span>
                <span>🕐 ${e.time}</span>
              </div>
              <div class="my-event-venue">📍 ${e.venue}, ${e.city}</div>
            </div>
            <div style="display:flex;align-items:center;padding-right:14px;color:var(--text3)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </a>`;
      }).join('')}
    </div>`;
}

render();
