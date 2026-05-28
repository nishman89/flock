'use strict';
Flock.requireAuth();

const eventId = Flock.getCheckoutEvent();
if (!eventId) window.location.href = 'home.html';
const ev = EVENTS.find(e => e.id === eventId);
if (!ev)    window.location.href = 'home.html';

/* Pre-fill from saved checkout info if returning from overview */
const saved = Flock.getCheckoutInfo();

document.getElementById('co-event-emoji').textContent = ev.emoji;
document.getElementById('co-event-name').textContent  = ev.title;
document.getElementById('co-event-date').textContent  = fmtD(ev.date) + ' · ' + ev.time;
document.getElementById('co-event-price').textContent = ev.price;

if (saved.firstName) document.getElementById('co-firstname').value = saved.firstName;
if (saved.lastName)  document.getElementById('co-lastname').value  = saved.lastName;
if (saved.postcode)  document.getElementById('co-postcode').value  = saved.postcode;
if (saved.cardNum)   document.getElementById('co-cardnum').value   = saved.cardNum;
if (saved.expiry)    document.getElementById('co-expiry').value    = saved.expiry;
if (saved.cvv)       document.getElementById('co-cvv').value       = saved.cvv;

/* Card number formatting */
document.getElementById('co-cardnum').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 16);
  this.value = v.replace(/(.{4})/g, '$1 ').trim();
});
document.getElementById('co-expiry').addEventListener('input', function () {
  let v = this.value.replace(/\D/g, '').slice(0, 4);
  if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
  this.value = v;
});
document.getElementById('co-cvv').addEventListener('input', function () {
  this.value = this.value.replace(/\D/g, '').slice(0, 3);
});

function clearErrs() {
  document.querySelectorAll('.co-err').forEach(e => e.classList.remove('show'));
  document.querySelectorAll('.co-input').forEach(e => e.classList.remove('invalid'));
}

function showErr(field, msg) {
  const err = document.getElementById('err-co-' + field);
  const inp = document.getElementById('co-' + field);
  if (err) { err.textContent = msg; err.classList.add('show'); }
  if (inp) inp.classList.add('invalid');
}

document.getElementById('checkout-info-form').addEventListener('submit', function (e) {
  e.preventDefault();
  clearErrs();

  const fn  = document.getElementById('co-firstname').value.trim();
  const ln  = document.getElementById('co-lastname').value.trim();
  const pc  = document.getElementById('co-postcode').value.trim();
  const cn  = document.getElementById('co-cardnum').value.replace(/\s/g, '');
  const exp = document.getElementById('co-expiry').value.trim();
  const cvv = document.getElementById('co-cvv').value.trim();

  let ok = true;
  if (!fn)           { showErr('firstname', 'First name is required');               ok = false; }
  if (!ln)           { showErr('lastname',  'Last name is required');                ok = false; }
  if (!pc)           { showErr('postcode',  'Postcode is required');                 ok = false; }
  if (cn.length < 16){ showErr('cardnum',   'Enter a valid 16-digit card number');   ok = false; }
  if (!/^\d{2}\/\d{2}$/.test(exp)) { showErr('expiry', 'Use MM/YY format');         ok = false; }
  if (cvv.length < 3){ showErr('cvv',       'Enter a valid 3-digit CVV');            ok = false; }
  if (!ok) return;

  Flock.setCheckoutInfo({ firstName: fn, lastName: ln, postcode: pc,
                          cardNum: cn, expiry: exp, cvv: cvv });
  window.location.href = 'checkout-overview.html';
});

function fmtD(d) {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}
