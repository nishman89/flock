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

function buildAttendees(liveGoing) {
  const shown = Math.min(liveGoing, SAMPLE_ATTENDEES.length, 8);
  const extra = liveGoing - shown;
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
  const joined     = Flock.isJoined(id);
  const profile    = Flock.getProfile();
  const liveGoing  = Flock.getGoingCount(id, ev.going) + (joined ? 1 : 0);
  const spotsLeft  = ev.max - liveGoing;
  const col        = EV_COLS[ev.cat] || '#374151';

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
            ${liveGoing} going · <span style="color:${spotsLeft <= 0 ? 'var(--err)' : spotsLeft < 5 ? 'var(--err)' : 'var(--ok)'">${spotsLeft <= 0 ? 'Full' : spotsLeft + ' spot' + (spotsLeft === 1 ? '' : 's') + ' left'}</span>
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

      <div class="detail-section-title">About this Flock</div>
      <p class="detail-desc">${ev.desc}</p>

      <div class="detail-section-title">Tags</div>
      <div class="detail-tags">
        ${ev.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')}
      </div>

      <div class="detail-section-title">Location</div>
      <div class="detail-map-wrap">
        <div id="event-map"></div>
        <a id="directions-btn"
           href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(ev.addr)}"
           target="_blank" rel="noopener"
           class="detail-directions-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          Get Directions
        </a>
      </div>

      <div class="detail-section-title">Who's going (${liveGoing})</div>
      ${joined ? `
        <div style="display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:10px;background:#F0FDF4;border:1px solid #BBF7D0;margin-bottom:12px">
          <div style="width:36px;height:36px;border-radius:50%;background:var(--primary);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff">${(profile.firstName || 'Y')[0].toUpperCase()}</div>
          <div>
            <div style="font-size:13px;font-weight:700;color:var(--ok)">You're going! 🎉</div>
            <div style="font-size:12px;color:var(--text3)">${profile.firstName || 'You'}</div>
          </div>
        </div>` : ''}
      ${buildAttendees(liveGoing)}
    </div>`;

  const joinLbl = isFree ? 'Join Flock! 🐦' : `Pay &amp; Join — ${ev.price} 💳`;
  const onWaitlist = Flock.isOnWaitlist(id);
  const full = liveGoing >= ev.max && !joined;

  let ctaHtml = '';
  if (joined) {
    ctaHtml += `<button id="leave-event-btn" class="btn btn-join" style="margin-bottom:10px" onclick="toggleJoin()">✓ You're in this Flock — tap to leave</button>`;
  } else if (full) {
    ctaHtml += onWaitlist
      ? `<button class="btn-waitlist" style="cursor:default">⏳ You're on the waitlist</button>`
      : `<button id="waitlist-btn" class="btn-waitlist" onclick="toggleWaitlist()">🔔 Join Waitlist</button>`;
  } else {
    ctaHtml += `<button id="join-event-btn" class="btn btn-pr" style="margin-bottom:10px" onclick="toggleJoin()">${joinLbl}</button>`;
  }
  ctaHtml += `<button id="chat-btn" class="btn btn-chat" style="margin-bottom:10px" onclick="showChatPopup()">💬 Chat with your Flock</button>`;
  ctaHtml += `<button id="share-btn" class="btn-share" onclick="shareEvent()">🔗 Share this event</button>`;
  document.getElementById('detail-cta').innerHTML = ctaHtml;
}

function toggleJoin() {
  if (Flock.isJoined(id)) {
    if (confirm('Are you sure you want to leave this Flock?')) {
      Flock.leaveEvent(id);
      renderAndMap();
    }
  } else {
    if (!isFree) {
      Flock.setCheckoutEvent(id);
      window.location.href = 'checkout-info.html';
    } else {
      Flock.joinEvent(id);
      renderAndMap();
    }
  }
}

function showChatPopup() {
  let overlay = document.getElementById('chat-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'chat-overlay';
    overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:200;padding:20px;animation:fadeIn .15s ease';
    overlay.innerHTML = `
      <div style="background:#fff;border-radius:16px;padding:28px 24px;max-width:300px;width:100%;text-align:center;animation:slideUp .2s ease">
        <div style="font-size:36px;margin-bottom:12px">💬</div>
        <div style="font-family:var(--font);font-size:18px;font-weight:700;color:var(--text);margin-bottom:8px">Event Chat</div>
        <div style="font-size:14px;color:var(--text2);line-height:1.5;margin-bottom:20px">
          Not yet implemented - chat functionality is coming soon! Once live, you'll be able to message other attendees before and after the event.
        </div>
        <button id="chat-close-btn" onclick="document.getElementById('chat-overlay').remove()"
          style="padding:11px 28px;background:var(--primary);color:#fff;border:none;border-radius:10px;font-family:var(--font);font-size:15px;font-weight:600;cursor:pointer;width:100%">
          Got it
        </button>
      </div>`;
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) overlay.remove();
    });
    document.body.appendChild(overlay);
  }
}

let _map = null;

function initMap() {
  if (!ev.lat || !ev.lng) return;
  if (_map) { _map.remove(); _map = null; }
  _map = L.map('event-map', { zoomControl: true, scrollWheelZoom: false })
    .setView([ev.lat, ev.lng], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 19
  }).addTo(_map);
  const icon = L.divIcon({
    html: `<div style="background:var(--primary);color:#fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,.3)"><span style="transform:rotate(45deg)">${ev.e}</span></div>`,
    iconSize: [32, 32], iconAnchor: [16, 32], className: ''
  });
  L.marker([ev.lat, ev.lng], { icon })
    .addTo(_map)
    .bindPopup(`<strong>${ev.venue}</strong><br>${ev.addr}`)
    .openPopup();
}

function toggleWaitlist() {
  if (Flock.isOnWaitlist(id)) {
    Flock.leaveWaitlist(id);
  } else {
    Flock.joinWaitlist(id);
  }
  renderAndMap();
}

function shareEvent() {
  const url  = location.href;
  const text = `Check out "${ev.t}" on Flock — ${ev.venue}, ${fmtDate(ev.date)} at ${ev.time}`;
  if (navigator.share) {
    navigator.share({ title: ev.t, text, url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.getElementById('share-btn');
      if (btn) { btn.textContent = '✓ Link copied!'; setTimeout(() => { btn.textContent = '🔗 Share this event'; }, 2000); }
    });
  }
}

function renderAndMap() {
  render();
  initMap();
}

renderAndMap();
