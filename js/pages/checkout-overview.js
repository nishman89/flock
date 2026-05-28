'use strict';
Flock.requireAuth();

const eventId = Flock.getCheckoutEvent();
if (!eventId) window.location.href = 'home.html';
const ev   = EVENTS.find(e => e.id === eventId);
const info = Flock.getCheckoutInfo();
if (!ev || !info.firstName) window.location.href = 'checkout-info.html';

function fmtD(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
}

/* Parse ticket price — strip £ and take first number */
function parsePrice(str) {
  const m = str.replace('£','').match(/[\d.]+/);
  return m ? parseFloat(m[0]) : 0;
}

const ticket    = parsePrice(ev.price);
const booking   = 0.99;
const subtotal  = ticket + booking;
const vat       = +(subtotal * 0.20).toFixed(2);
const total     = +(subtotal + vat).toFixed(2);

/* Render event summary */
document.getElementById('ov-event-emoji').textContent = ev.emoji;
document.getElementById('ov-event-name').textContent  = ev.title;
document.getElementById('ov-event-detail').textContent =
  fmtD(ev.date) + ' · ' + ev.time + ' · ' + ev.venue;

/* Render your details */
const masked = '**** **** **** ' + info.cardNum.slice(-4);
document.getElementById('ov-name').textContent    = info.firstName + ' ' + info.lastName;
document.getElementById('ov-postcode').textContent= info.postcode;
document.getElementById('ov-card').textContent    = masked;

/* Render price breakdown */
document.getElementById('ov-ticket').textContent  = '£' + ticket.toFixed(2);
document.getElementById('ov-booking').textContent = '£' + booking.toFixed(2);
document.getElementById('ov-vat').textContent     = '£' + vat.toFixed(2);
document.getElementById('ov-total').textContent   = '£' + total.toFixed(2);

document.getElementById('confirm-pay-btn').addEventListener('click', function () {
  Flock.completeCheckout();
  window.location.href = 'checkout-complete.html';
});
