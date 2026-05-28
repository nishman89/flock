'use strict';
Flock.requireAuth();
setActiveNav('my-roosts');

function fmtDate(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

function render() {
  const el    = document.getElementById('my-roosts-container');
  const today = new Date(); today.setHours(0,0,0,0);

  // Collect all roosts the user is attending
  const upcoming = [], past = [];
  FLOCKS.forEach(f => {
    f.roosts.forEach(m => {
      if (!Flock.isAttending(f.id, m.id)) return;
      const evDate = new Date(m.date + 'T00:00:00');
      const item = { ...m, flockId: f.id, flockName: f.name, flockE: f.e, cat: f.cat };
      (evDate >= today ? upcoming : past).push(item);
    });
  });

  upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
  past.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (upcoming.length === 0 && past.length === 0) {
    el.innerHTML = `
      <div id="my-roosts-empty" class="empty-state">
        <div class="empty-icon">📅</div>
        <h3>No Roosts yet</h3>
        <p>Join a Flock and mark yourself as attending a roost to see it here.</p>
        <a href="roosts.html" class="btn btn-primary" style="margin-top:8px;max-width:200px;padding:12px;display:block">Browse Roosts</a>
      </div>`;
    return;
  }

  function card(e, isPast) {
    const col = EV_COLS[e.cat] || '#F97316';
    return `
      <a class="my-event-card${isPast ? ' past' : ''}" href="event.html?id=${e.flockId}">
        <div class="my-event-accent" style="background:${col}"></div>
        <div class="my-event-body">
          <div class="my-event-title">${e.flockE} ${e.title}</div>
          <div class="my-event-meta">
            <span>📅 ${fmtDate(e.date)}</span>
            <span>🕐 ${e.time}</span>
          </div>
          <div class="my-event-venue">📍 ${e.venue} &middot; ${e.flockName}</div>
        </div>
        <div style="display:flex;align-items:center;padding-right:14px;color:var(--text3)">
          ${isPast
            ? '<span style="font-size:11px;font-weight:600">Past</span>'
            : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>'}
        </div>
      </a>`;
  }

  let html = '';
  if (upcoming.length > 0) {
    html += `<p style="font-size:13px;color:var(--text3);font-weight:600;margin-bottom:12px">
      ${upcoming.length} Roost${upcoming.length !== 1 ? 's' : ''} coming up
    </p><div style="display:flex;flex-direction:column;gap:10px">
      ${upcoming.map(e => card(e, false)).join('')}
    </div>`;
  }
  if (past.length > 0) {
    html += `<div class="past-section-title">Past Roosts</div>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${past.map(e => card(e, true)).join('')}
    </div>`;
  }
  el.innerHTML = html;
}

render();
