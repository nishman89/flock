'use strict';
Flock.requireAuth();
setActiveNav('my-flocks');

function fmtDate(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function render() {
  const myIds  = Flock.getMyFlocks();
  const flocks = FLOCKS.filter(f => myIds.includes(f.id));
  const el     = document.getElementById('my-flocks-container');

  if (flocks.length === 0) {
    el.innerHTML = `
      <div id="my-flocks-empty" class="empty-state">
        <div class="empty-icon">🐦</div>
        <h3>No Flocks yet</h3>
        <p>Find groups that match your interests and join your first Flock!</p>
        <a href="home.html" class="btn btn-primary" style="margin-top:8px;max-width:200px;padding:12px;display:block">Browse Flocks</a>
      </div>`;
    return;
  }

  const today = new Date(); today.setHours(0,0,0,0);
  el.innerHTML = `
    <p style="font-size:13px;color:var(--text3);font-weight:600;margin-bottom:12px">
      ${flocks.length} Flock${flocks.length !== 1 ? 's' : ''} joined
    </p>
    ${flocks.map(f => {
      const col      = EV_COLS[f.cat] || '#F97316';
      const upcoming = f.roosts.filter(m => new Date(m.date + 'T00:00:00') >= today);
      const next     = upcoming[0];
      const attending = next ? Flock.isAttending(f.id, next.id) : false;
      return `
        <a class="my-event-card" href="event.html?id=${f.id}">
          <div class="my-event-accent" style="background:${col}"></div>
          <div class="my-event-body">
            <div class="my-event-title">${f.e} ${f.name}</div>
            <div class="my-event-meta">
              <span>👥 ${f.members + 1} members</span>
              <span>${upcoming.length} upcoming Roost${upcoming.length !== 1 ? 's' : ''}</span>
            </div>
            ${next ? `<div class="my-event-venue" style="margin-top:6px">
              Next: ${next.title} &middot; ${fmtDate(next.date)}
              ${attending ? ' <span style="color:var(--ok);font-weight:700">✓ Going</span>' : ''}
            </div>` : '<div class="my-event-venue">No upcoming Roosts</div>'}
          </div>
          <div style="display:flex;align-items:center;padding-right:14px;color:var(--text3)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </div>
        </a>`;
    }).join('')}`;
}

render();
