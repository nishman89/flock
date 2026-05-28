'use strict';
Flock.requireAuth();

const params   = new URLSearchParams(location.search);
const flockId  = params.get('flock');
const roostId  = params.get('roost');
const fl       = FLOCKS.find(f => f.id === flockId);
const roost    = fl && (fl.roosts || []).find(r => r.id === roostId);

if (!fl || !roost) { location.href = 'home.html'; }

const col = EV_COLS[fl.cat] || '#374151';
let _map  = null;

function fmtDate(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function render() {
  const isMember  = Flock.isFlockMember(flockId);
  const attending = Flock.isAttending(flockId, roostId);
  const liveGoing = Flock.getLiveGoing(flockId, roostId, roost.going);
  const spotsLeft = roost.max - liveGoing;
  const isFree    = roost.price === 'Free';

  document.getElementById('detail-content').innerHTML = `
    <div class="detail-hero" style="background:${col}">
      <button class="detail-back" onclick="history.back()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span class="detail-emoji">${fl.e}</span>
    </div>

    <div class="detail-body">
      <!-- Back to Flock link -->
      <a href="event.html?id=${flockId}" class="roost-flock-link">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
        ${fl.name}
        ${isMember ? '<span style="color:var(--ok);font-weight:700">· Member</span>' : ''}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left:auto"><polyline points="9 18 15 12 9 6"/></svg>
      </a>

      <h1 class="detail-title">${roost.title}</h1>

      <div class="detail-info-grid">
        <div class="detail-info-row">
          <span class="detail-info-icon">📅</span>
          <div class="detail-info-text">
            <span class="detail-info-label">Date</span>
            ${fmtDate(roost.date)}
          </div>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-icon">🕐</span>
          <div class="detail-info-text">
            <span class="detail-info-label">Time</span>
            ${roost.time} &middot; ${roost.dur}
          </div>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-icon">📍</span>
          <div class="detail-info-text">
            <span class="detail-info-label">Venue</span>
            ${roost.venue}, ${roost.addr}
          </div>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-icon">👥</span>
          <div class="detail-info-text">
            <span class="detail-info-label">Attendance</span>
            <span class="${spotsLeft <= 0 ? 'txt-err' : spotsLeft < 5 ? 'txt-err' : 'txt-ok'}">
              ${liveGoing} going &middot; ${spotsLeft <= 0 ? 'Full' : spotsLeft + ' spot' + (spotsLeft === 1 ? '' : 's') + ' left'}
            </span>
          </div>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-icon">💰</span>
          <div class="detail-info-text">
            <span class="detail-info-label">Price</span>
            ${roost.price}
          </div>
        </div>
      </div>

      <div class="detail-section-title">Location</div>
      <div class="detail-map-wrap">
        <div id="roost-map" style="height:200px;width:100%;background:var(--bg)"></div>
        <a href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(roost.addr)}"
           target="_blank" rel="noopener" class="detail-directions-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
          Get Directions
        </a>
      </div>

      ${!isMember ? `
      <div style="background:var(--primary-lt);border:1.5px solid var(--primary);border-radius:var(--r);padding:14px 16px;margin-bottom:16px;font-size:14px;color:var(--primary-dk)">
        🐦 <strong>Join ${fl.name}</strong> to attend this Roost.
        <a href="event.html?id=${flockId}" style="color:var(--primary-dk);font-weight:700;text-decoration:underline;margin-left:4px">View Flock →</a>
      </div>` : ''}
    </div>`;

  // CTA
  let ctaHtml = '';
  if (!isMember) {
    ctaHtml = `<a href="event.html?id=${flockId}" class="btn btn-pr" style="margin-bottom:10px;display:flex;align-items:center;justify-content:center;text-decoration:none">Join the Flock to attend 🐦</a>`;
  } else if (attending) {
    ctaHtml = `<button class="btn btn-join" style="margin-bottom:10px" onclick="toggleAttend()">✓ You're going - tap to cancel</button>`;
  } else if (spotsLeft <= 0) {
    ctaHtml = `<button class="btn" style="margin-bottom:10px;opacity:.5;cursor:default" disabled>This Roost is full</button>`;
  } else if (isFree) {
    ctaHtml = `<button class="btn btn-pr" style="margin-bottom:10px" onclick="toggleAttend()">Attend this Roost 🪺</button>`;
  } else {
    ctaHtml = `<button class="btn btn-pr" style="margin-bottom:10px" onclick="toggleAttend()">Pay ${roost.price} & Attend 💳</button>`;
  }
  ctaHtml += `<button class="btn-msg" onclick="showMsgPopup()">💬 Chat with this Roost</button>`;
  ctaHtml += `<button class="btn-share" onclick="shareRoost()">🔗 Share this Roost</button>`;
  document.getElementById('detail-cta').innerHTML = ctaHtml;

  initMap();
}

function initMap() {
  if (!roost.lat || !roost.lng) return;
  if (_map) { _map.remove(); _map = null; }
  _map = L.map('roost-map', { zoomControl: true, scrollWheelZoom: false })
    .setView([roost.lat, roost.lng], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19
  }).addTo(_map);
  const icon = L.divIcon({
    html: `<div style="background:${col};color:#fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,.3)"><span style="transform:rotate(45deg)">${fl.e}</span></div>`,
    iconSize: [32,32], iconAnchor: [16,32], className: ''
  });
  L.marker([roost.lat, roost.lng], { icon })
    .addTo(_map)
    .bindPopup(`<strong>${roost.venue}</strong><br>${roost.addr}`)
    .openPopup();
}

function toggleAttend() {
  if (Flock.isAttending(flockId, roostId)) {
    if (confirm('Cancel attendance at this Roost?')) {
      Flock.unattendRoost(flockId, roostId);
      render();
    }
  } else {
    if (roost.price === 'Free') {
      Flock.attendRoost(flockId, roostId);
      render();
    } else {
      Flock.setCheckoutEvent(flockId + '_' + roostId);
      location.href = 'checkout-info.html';
    }
  }
}

function showMsgPopup() {
  let ov = document.getElementById('msg-popup');
  if (ov) ov.remove();
  ov = document.createElement('div');
  ov.id = 'msg-popup';
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:300;padding:20px';
  ov.innerHTML = `
    <div style="background:var(--card);border-radius:20px;padding:28px 24px;max-width:320px;width:100%;text-align:center">
      <div style="font-size:40px;margin-bottom:12px">🪺</div>
      <div style="font-size:18px;font-weight:700;color:var(--text);margin-bottom:8px">Roost Chat</div>
      <div style="font-size:14px;color:var(--text2);line-height:1.5;margin-bottom:8px">Chat with everyone attending this Roost - coordinate meetup spots, share plans and hype each other up.</div>
      <div style="font-size:13px;color:var(--primary);font-weight:600;background:var(--primary-lt);border-radius:10px;padding:10px;margin-bottom:20px">Coming soon - messaging is on the way 🚀</div>
      <button onclick="document.getElementById('msg-popup').remove()"
        style="padding:12px 0;width:100%;background:var(--primary);color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;font-family:var(--font)">Got it</button>
    </div>`;
  ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
  document.body.appendChild(ov);
}

function shareRoost() {
  const url  = location.href;
  const text = `Check out "${roost.title}" - a Roost by ${fl.name} on Flock`;
  if (navigator.share) {
    navigator.share({ title: roost.title, text, url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.querySelector('.btn-share');
      if (btn) { btn.textContent = '✓ Link copied!'; setTimeout(() => { btn.textContent = '🔗 Share this Roost'; }, 2000); }
    });
  }
}

render();
