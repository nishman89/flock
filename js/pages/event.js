'use strict';
Flock.requireAuth();

const id  = new URLSearchParams(location.search).get('id');
const ev  = EVENTS.find(e => e.id === id);
if (!ev) location.href = 'home.html';

const isFree = ev.price === 'Free';

function fmtDate(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function buildAttendees() {
  const shown = Math.min(ev.going, SAMPLE_ATTENDEES.length, 8);
  const extra = ev.going - shown;
  let html = '<div class="attendee-grid">';
  for (let i = 0; i < shown; i++) {
    const a = SAMPLE_ATTENDEES[i];
    html += `<div class="attendee-bubble">
      <div class="att-circle" style="background:${a.color}">${a.name.split(' ').map(x => x[0]).join('')}</div>
      <div class="att-name">${a.name}</div>
    </div>`;
  }
  if (extra > 0) {
    html += `<div class="attendee-bubble more-bubble">
      <div class="att-circle" style="background:var(--border);color:var(--text3)">+${extra}</div>
      <div class="att-name">more</div>
    </div>`;
  }
  html += '</div>';
  return html;
}

function render() {
  const joined    = Flock.isJoined(id);
  const profile   = Flock.getProfile();
  const spotsLeft = ev.max - ev.going;
  const col       = EV_COLS[ev.cat] || '#374151';

  document.getElementById('detail-content').innerHTML = `
    <div class="detail-hero" style="background:${col}">
      <button id="detail-back-btn" class="detail-back" onclick="history.back()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
      <span class="detail-emoji">${ev.e}</span>
    </div>

    <div class="detail-body">
      <div class="detail-cat">${ev.cat.toUpperCase()} · ${ev.dist < 1 ? 'Nearby' : ev.dist + ' miles away'}</div>
      <div class="detail-title">${ev.t}</div>

      <div class="detail-info-grid">
        <div class="detail-info-row">
          <span class="detail-info-icon">📅</span>
          <div class="detail-info-text">
            <span class="detail-info-label">Date &amp; Time</span>
            ${fmtDate(ev.date)} at ${ev.time} · ${ev.dur}
          </div>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-icon">📍</span>
          <div class="detail-info-text">
            <span class="detail-info-label">Venue</span>
            ${ev.venue}<br>
            <span style="color:var(--text3);font-size:13px">${ev.addr}</span>
          </div>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-icon">💰</span>
          <div class="detail-info-text">
            <span class="detail-info-label">Price</span>
            ${ev.price}
          </div>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-icon">👥</span>
          <div class="detail-info-text">
            <span class="detail-info-label">Attendance</span>
            ${ev.going} going · <span style="color:${spotsLeft < 5 ? 'var(--err)' : 'var(--ok)'}">${spotsLeft} spots remaining</span>
          </div>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-icon">🤝</span>
          <div class="detail-info-text">
            <span class="detail-info-label">Open to</span>
            ${ev.ft === 'Both' ? 'Everyone' : ev.ft + ' only'} · ${ev.ages}
          </div>
        </div>
      </div>

      <div class="detail-section-title">About this event</div>
      <p class="detail-desc">${ev.desc}</p>

      <div class="detail-section-title">Tags</div>
      <div class="detail-tags">
        ${ev.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')}
      </div>

      <div class="detail-section-title">Who's going (${ev.going + (joined ? 1 : 0)})</div>
      ${joined ? `
        <div style="display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:10px;background:#F0FDF4;border:1px solid #BBF7D0;margin-bottom:12px">
          <div style="width:36px;height:36px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff">${(profile.name || 'Y')[0].toUpperCase()}</div>
          <div>
            <div style="font-size:13px;font-weight:700;color:var(--ok)">You're going! 🎉</div>
            <div style="font-size:12px;color:var(--text3)">${profile.name || 'You'}</div>
          </div>
        </div>` : ''}
      ${buildAttendees()}
    </div>`;

  const joinLbl = isFree ? 'Join Flock! 🐦' : `Pay &amp; Join — ${ev.price} 💳`;
  document.getElementById('detail-cta').innerHTML = joined
    ? `<button id="leave-event-btn" class="btn btn-join" onclick="toggleJoin()">✓ You're going — tap to leave</button>`
    : `<button id="join-event-btn"  class="btn btn-pr"   onclick="toggleJoin()">${joinLbl}</button>`;
}

function toggleJoin() {
  if (Flock.isJoined(id)) {
    if (confirm('Are you sure you want to leave this event?')) {
      Flock.leaveEvent(id);
      render();
    }
  } else {
    if (!isFree) {
      Flock.setCheckoutEvent(id);
      window.location.href = 'checkout-info.html';
    } else {
      Flock.joinEvent(id);
      render();
    }
  }
}

render();
