'use strict';
Flock.requireAuth();

const id = new URLSearchParams(location.search).get('id');
const fl = FLOCKS.find(f => f.id === id);
if (!fl) location.href = 'home.html';

function fmtDate(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}

let _maps = {};

function render() {
  const isMember = Flock.isFlockMember(id);
  const profile  = Flock.getProfile();
  const col      = EV_COLS[fl.cat] || '#374151';

  // Hero + group info
  document.getElementById('detail-content').innerHTML = `
    <div class="detail-hero" style="background:${col}">
      <button class="detail-back" onclick="history.back()">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
      </button>
      <span class="detail-emoji">${fl.e}</span>
    </div>
    <div class="detail-body">
      <h1 class="detail-title">${fl.name}</h1>
      <div class="detail-info-grid">
        <div class="detail-info-row">
          <span class="detail-info-icon">📍</span>
          <div class="detail-info-text">
            <span class="detail-info-label">City</span>
            ${fl.city}
          </div>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-icon">👥</span>
          <div class="detail-info-text">
            <span class="detail-info-label">Members</span>
            ${fl.members + (isMember ? 1 : 0)} in this Flock
          </div>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-icon">🏷️</span>
          <div class="detail-info-text">
            <span class="detail-info-label">Category</span>
            ${fl.cat}
          </div>
        </div>
        <div class="detail-info-row">
          <span class="detail-info-icon">🤝</span>
          <div class="detail-info-text">
            <span class="detail-info-label">Open to</span>
            ${fl.ft === 'Both' ? 'Everyone' : fl.ft + ' only'} · ${fl.ages}
          </div>
        </div>
      </div>

      <div class="detail-section-title">About this Flock</div>
      <p class="detail-desc">${fl.desc}</p>

      <div class="detail-section-title">Tags</div>
      <div class="detail-tags">
        ${fl.tags.map(t => `<span class="tag-pill">${t}</span>`).join('')}
      </div>

      <div class="detail-section-title">Upcoming Roosts (${fl.roosts.length})</div>
      ${fl.roosts.map((m, i) => roostCard(m, i, isMember)).join('')}
    </div>`;

  // CTA - join/leave the group
  const joinLbl = `Join this Flock 🐦`;
  document.getElementById('detail-cta').innerHTML = isMember
    ? `<button class="btn btn-join" style="margin-bottom:10px" onclick="toggleMembership()">✓ You're a member - tap to leave</button>
       <button class="btn-msg" onclick="showMsgPopup('flock')">💬 Message the Flock</button>
       <button class="btn-share" onclick="shareGroup()">🔗 Share this Flock</button>`
    : `<button class="btn btn-pr" style="margin-bottom:10px" onclick="toggleMembership()">${joinLbl}</button>
       <button class="btn-share" onclick="shareGroup()">🔗 Share this Flock</button>`;

  // Maps now on individual Roost detail page
  Object.keys(_maps).forEach(k => { _maps[k].remove(); });
  _maps = {};
}

function roostCard(m, i, isMember) {
  const attending = Flock.isAttending(id, m.id);
  const liveGoing = Flock.getLiveGoing(id, m.id, m.going);
  const spotsLeft = m.max - liveGoing;
  const col       = EV_COLS[fl.cat] || '#374151';
  const roostUrl  = `roost.html?flock=${id}&roost=${m.id}`;

  return `
    <a class="roost-card roost-card-link" id="roost-${m.id}" href="${roostUrl}">
      <div class="roost-header" style="background:${col}18;border-left:4px solid ${col}">
        <div class="roost-title">${m.title}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${col}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-left:6px;vertical-align:middle;flex-shrink:0"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
        <span class="roost-price ${m.price === 'Free' ? 'free' : ''}">${m.price}</span>
      </div>
      <div class="roost-body">
        <div class="roost-meta" style="margin-top:10px">
          <span>📅 ${fmtDate(m.date)}</span>
          <span>🕐 ${m.time}</span>
          <span>⏱ ${m.dur}</span>
        </div>
        <div class="roost-meta" style="margin-top:6px;margin-bottom:10px">
          <span>📍 ${m.venue}</span>
          <span class="${spotsLeft <= 0 ? 'txt-err' : spotsLeft < 5 ? 'txt-err' : 'txt-ok'}">
            ${liveGoing} going &middot; ${spotsLeft <= 0 ? 'Full' : spotsLeft + ' spot' + (spotsLeft === 1 ? '' : 's') + ' left'}
          </span>
          ${attending ? '<span style="color:var(--ok);font-weight:700">✓ Going</span>' : ''}
        </div>
      </div>
    </a>`;
}

function initMap(m, i) {
  if (!m.lat || !m.lng) return;
  if (_maps[m.id]) { _maps[m.id].remove(); }
  const map = L.map('map-' + m.id, { zoomControl: false, scrollWheelZoom: false })
    .setView([m.lat, m.lng], 15);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>', maxZoom: 19
  }).addTo(map);
  const icon = L.divIcon({
    html: `<div style="background:${EV_COLS[fl.cat]||'#F97316'};color:#fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);width:28px;height:28px;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,.3)"><span style="transform:rotate(45deg)">${fl.e}</span></div>`,
    iconSize: [28, 28], iconAnchor: [14, 28], className: ''
  });
  L.marker([m.lat, m.lng], { icon }).addTo(map)
    .bindPopup(`<strong>${m.venue}</strong><br>${m.addr}`).openPopup();
  _maps[m.id] = map;
}

function toggleMembership() {
  if (Flock.isFlockMember(id)) {
    if (confirm('Leave this Flock? You will be removed from all its upcoming Roosts.')) {
      Flock.leaveFlock(id);
      render();
    }
  } else {
    Flock.joinFlock(id);
    render();
  }
}

function toggleRoost(roostId, price) {
  if (Flock.isAttending(id, roostId)) {
    if (confirm('Cancel attendance at this roost?')) {
      Flock.unattendRoost(id, roostId);
      render();
    }
  } else {
    const isFree = price === 'Free';
    if (isFree) {
      Flock.attendRoost(id, roostId);
      render();
    } else {
      Flock.setCheckoutEvent(id + '_' + roostId);
      window.location.href = 'checkout-info.html';
    }
  }
}

function promptJoinFirst() {
  if (confirm('Join this Flock first to attend roosts?')) {
    Flock.joinFlock(id);
    render();
  }
}

function showMsgPopup(type) {
  const isRoost = type === 'roost';
  const title   = isRoost ? 'Roost Chat' : 'Flock Chat';
  const desc    = isRoost
    ? 'Chat with everyone attending this Roost - coordinate meetup spots, share plans and hype each other up.'
    : 'Message all members of this Flock - share news, plan Roosts and keep the conversation going between meetups.';
  let ov = document.getElementById('msg-popup');
  if (ov) ov.remove();
  ov = document.createElement('div');
  ov.id = 'msg-popup';
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);display:flex;align-items:center;justify-content:center;z-index:300;padding:20px';
  ov.innerHTML = `
    <div style="background:var(--card);border-radius:20px;padding:28px 24px;max-width:320px;width:100%;text-align:center">
      <div style="font-size:40px;margin-bottom:12px">${isRoost ? '🪺' : '🐦'}</div>
      <div style="font-size:18px;font-weight:700;color:var(--text);margin-bottom:8px">${title}</div>
      <div style="font-size:14px;color:var(--text2);line-height:1.5;margin-bottom:8px">${desc}</div>
      <div style="font-size:13px;color:var(--primary);font-weight:600;background:var(--primary-lt);border-radius:10px;padding:10px;margin-bottom:20px">
        Coming soon - messaging is on the way 🚀
      </div>
      <button onclick="document.getElementById('msg-popup').remove()"
        style="padding:12px 0;width:100%;background:var(--primary);color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;font-family:var(--font)">
        Got it
      </button>
    </div>`;
  ov.addEventListener('click', e => { if (e.target === ov) ov.remove(); });
  document.body.appendChild(ov);
}

function shareGroup() {
  const url  = location.href;
  const text = `Check out "${fl.name}" on Flock - ${fl.members} members, ${fl.roosts.length} upcoming Roosts`;
  if (navigator.share) {
    navigator.share({ title: fl.name, text, url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => {
      const btn = document.querySelector('.btn-share');
      if (btn) { btn.textContent = '✓ Link copied!'; setTimeout(() => { btn.textContent = '🔗 Share this Flock'; }, 2000); }
    });
  }
}

render();
