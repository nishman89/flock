# Flock — Code Explanation

A full technical walkthrough of every file in the project. Written so any developer can pick this up, understand it, and extend it.

---

## What is a Flock?

A **Flock** is the core unit of the app — what other apps might call an "event". Each Flock has a fixed capacity, a date, a venue, a category, and a vibe. When a user joins a Flock, the going count goes up and the spots left go down in real time. The terminology is used consistently throughout the codebase and UI.

---

## Project Structure

```
flock/
├── index.html                  Auth router
├── login.html / signup.html / onboarding.html
├── home.html                   Flocks feed
├── event.html                  Flock detail
├── my-events.html              My Flocks
├── profile.html                User profile
├── checkout-info/overview/complete.html
├── about.html
├── manifest.json               PWA config
├── sw.js                       Service worker (flock-v11)
├── css/styles.css              Single shared stylesheet
└── js/
    ├── data.js                 All Flock data + helpers
    ├── state.js                localStorage state management
    ├── desktop-sidebar.js      Desktop sidebar injector
    └── pages/                  One JS file per page
```

---

## HTML Pages

All pages follow the same pattern — scripts load at the bottom in order:

```html
<script src="js/data.js"></script>      <!-- globals: EVENTS, INTERESTS, CITIES, EV_COLS -->
<script src="js/state.js"></script>     <!-- global: Flock object, setActiveNav() -->
<script src="js/pages/{page}.js"></script>
<script src="js/desktop-sidebar.js"></script>
```

### index.html
Auth router — no visible content. Checks `localStorage` and redirects:
```javascript
const user = localStorage.getItem('flock_user');
window.location.replace(user ? 'home.html' : 'login.html');
```
Uses `replace()` not `href` so the router doesn't appear in browser history.
`manifest.json` `start_url` points here so PWA launch always routes correctly.

### signup.html
First name + last name side by side, username, password, confirm password.
- Checks username against `flock_registered` array in localStorage — shows "already taken" inline without a page reload
- `nish` is always reserved
- On success: saves `firstName`/`lastName` to profile, registers username, redirects to `onboarding.html`

### onboarding.html
3-step mandatory wizard. No skip button.
- **Step 1:** First name (pre-filled from signup), last name, date of birth (native date picker), avatar picker (12 emojis)
- **Step 2:** Interest chips — tap to select, minimum 1 required
- **Step 3:** City dropdown, distance chips, "looking to meet" chips
- Each step saves to localStorage before advancing — data is never lost if user navigates away

### home.html
Main feed. Contains empty containers filled by `home.js`:
- Filter bar: city dropdown, distance dropdown, sort dropdown
- Search bar + "Use my location" button
- Category chips: All, ⚡ Soon, Sports, Food & Drink, Gaming, Fitness, Social, Wellness, Outdoors, Music, Arts
- `#events-container` — filled with Flock cards

### event.html
Flock detail. Reads `?id=EV001` from URL. Loads Leaflet from CDN for the map. Key areas:
- `#detail-content` — hero, info rows, description, map, attendees
- `#detail-cta` — sticky bottom CTA (Join/Leave/Waitlist/Pay + Share)

### my-events.html
Lists joined Flocks split into upcoming (sorted soonest first) and past (sorted most recent first). Past Flocks shown dimmed.

### profile.html
No `<header>` — the orange hero fills from the very top. All content rendered by JS. Editable inline:
- City via `<select>` — saves instantly on change
- Looking to meet via chips — saves instantly on tap
- All 19 interests as chips — tap to toggle, saves instantly
- "Edit profile" button opens a bottom-sheet modal for name/DOB/avatar

---

## CSS — `css/styles.css`

One stylesheet for all pages, mobile-first.

### CSS Custom Properties
```css
:root {
  --primary:    #F97316;   /* Flock orange */
  --primary-dk: #C2410C;   /* Darker orange */
  --primary-lt: #FED7AA;   /* Light orange */
  --bg:         #FFF8EF;   /* Warm off-white */
  --card:       #FFFFFF;
  --border:     #FDE8D0;
  --text:       #1C0A00;
  --text2:      #6B3A1F;
  --text3:      #A8784A;
  --ok:         #16A34A;
  --err:        #DC2626;
  --nav-h:      72px;
  --r:          14px;      /* card border-radius */
  --rs:         10px;      /* small border-radius */
}
```

### Responsive Strategy
Mobile-first. Single breakpoint at `768px`.

**Mobile (< 768px):**
- `.app-shell` full width, max 480px, centred at wider screens
- `.bottom-nav` — `position: fixed; bottom: 0; left: 0; right: 0; z-index: 100` — always visible regardless of scroll
- `.content` has `padding-bottom` equal to nav height so nothing is hidden behind it
- `.sb`, `.page-wrap`, `.page-main` default to `display: none` / `display: contents` — prevents broken sidebar HTML showing on resize

**Desktop (≥ 768px):**
- `.sb` — `display: flex; width: 240px; position: sticky; top: 0; height: 100vh`
- `.page-wrap` — `display: flex` (sidebar + main side by side)
- `.bottom-nav` — `display: none !important`
- `.page-wrap .my-list` — `max-width: 560px` (keeps My Flocks cards proportional)
- Home events grid — `grid-template-columns: repeat(2, 1fr)`

---

## JavaScript

### `js/data.js`

#### `d(n)` — dynamic date helper
```javascript
function d(n) {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
}
```
Returns an ISO date string `n` days from today. Every Flock uses this so dates are always upcoming and never stale.

#### `INTERESTS`
19 items. Each: `{ e: '⚽', label: 'Football' }`. The emoji field is `e` — not `emoji`. Any code referencing interests must use `match.e`.

Includes: Football, Rugby, Formula 1, Gym & Fitness, Running, Yoga & Wellness, Hiking & Outdoors, Food & Dining, Coffee & Cafés, Pub & Social, Video Games, Board Games, Shopping, Live Music, Cinema, Book Club, Arts & Culture, Swimming, Dancing.

#### `CITIES`
```javascript
['London','Manchester','Birmingham','Edinburgh','Bristol','Leeds','Liverpool','Glasgow','Cardiff','Newcastle']
```

#### `EVENTS`
52 Flock objects. Each:
```javascript
{
  id:         'EV001',
  t:          'Premier League Watch Party',  // title
  cat:        'Sports',                      // matches a filter tab
  interests:  ['Football'],
  city:       'London',                      // must match CITIES
  venue:      'The Crown & Anchor',
  addr:       '22 Fleet St EC4Y',
  date:       d(1),                          // always upcoming
  time:       '15:00',
  dur:        '2 hrs',
  price:      'Free',                        // 'Free' or '£X' — never a range
  going:      24,                            // base count (real count = going + delta)
  max:        40,
  e:          '⚽',                          // emoji for pin and card
  dist:       1.2,                           // miles from city centre (fallback)
  lat:        51.5148,                       // for real-distance calc + map
  lng:        -0.1069,
  desc:       '...',
  tags:       ['Football','Sports','Social'],
  ages:       '18+',
  ft:         'Both',                        // 'Both', 'Girls', 'Boys'
  recurring:  true,                          // optional — shows 🔁 Weekly badge
}
```

---

### `js/state.js`

All state lives in `localStorage`. The `Flock` object is a global namespace for all state methods.

#### Auth
| Method | Key | Notes |
|--------|-----|-------|
| `Flock.login(u)` | `flock_user` | Saves username |
| `Flock.getUser()` | — | Returns username or null |
| `Flock.logout()` | — | `localStorage.clear()`, redirect to login |
| `Flock.requireAuth()` | — | Redirects to login if no user |
| `Flock.isOnboarded()` | `flock_onboarded` | Returns boolean |
| `Flock.setOnboarded()` | — | Marks onboarding complete |

#### Profile
Stored as `flock_profile`: `{ firstName, lastName, dob, avatar }`. DOB is ISO string `YYYY-MM-DD`. Age is always calculated from DOB at render time — never stored.

#### Preferences
Stored as `flock_prefs`: `{ city, dist, friendType }`.
- `city` — string matching CITIES
- `dist` — number (5, 10, 25, 50, or 999 = any)
- `friendType` — `'Girls'`, `'Boys'`, or `'Both'`

#### Interests
Stored as `flock_interests`: array of label strings e.g. `['Football', 'Cinema']`.

#### Flocks (joined)
| Method | Key | Notes |
|--------|-----|-------|
| `Flock.getMyEvents()` | `flock_my_events` | Array of joined Flock IDs |
| `Flock.joinEvent(id)` | — | Adds ID, increments going delta, clears waitlist |
| `Flock.leaveEvent(id)` | — | Removes ID, decrements going delta |
| `Flock.isJoined(id)` | — | Returns boolean |

#### Going count deltas
Stored as `flock_going_deltas`: `{ 'EV001': 1, 'EV003': -1, ... }`.

The base `going` count in `data.js` is static. When a user joins or leaves, a delta is written here. The rendered count is always `base + delta`.

```javascript
Flock.getGoingCount('EV001', 24) // → 25 if user joined, 24 if not
```

This means:
- Counts persist across page loads and refreshes
- If the user joins and leaves, the count returns to the original
- The "spots left" is always `max - (base + delta + joined ? 1 : 0)`

#### Waitlist
Stored as `flock_waitlist`: array of Flock IDs. Cleared for an ID when `joinEvent()` is called.

#### Username registry
Stored as `flock_registered`: array of all usernames created via signup. Used to check uniqueness before account creation. `nish` is always reserved in signup.js logic.

#### Checkout
Three keys: `flock_checkout_event` (ID), `flock_checkout_info` (form data object), cleared on `completeCheckout()`.

---

### `js/desktop-sidebar.js`

Runs after all page scripts. If `window.innerWidth >= 768`, wraps the page in a sidebar layout:

```
Before: .app-shell → [header, content, bottom-nav]
After:  .app-shell → .page-wrap → [.sb (sidebar), .page-main → [header, content, bottom-nav]]
```

Reads `location.pathname` to mark the correct nav link `.active`. If the window is resized below 768px, the sidebar becomes invisible via CSS (no broken links) and the bottom nav reappears.

---

### `js/pages/home.js`

#### Geolocation
```javascript
function useMyLocation() {
  navigator.geolocation.getCurrentPosition(success, error, options);
}
```
On success: runs Haversine formula against `CITY_COORDS` (lat/lng for all 10 cities) to find nearest, updates city dropdown, re-renders. On location known, calculates real distances from user to each Flock venue rather than using the hardcoded `dist` field.

Haversine formula (returns miles):
```javascript
function haversine(lat1, lng1, lat2, lng2) { ... }
```

On error code 1 (permission denied): shows OS-specific instructions (iOS: Settings → Safari → Location; Android: address bar padlock). Auto-dismisses after 6 seconds.

**Requires HTTPS** — works automatically on GitHub Pages and Netlify. Will silently fail on `file://` or `http://`.

#### Filters and search
- `activeCity`, `activeDist`, `activeCat`, `activeSort`, `searchQuery`, `userLat`, `userLng` — module-level state
- `renderEvents()` — filters, sorts, renders all in one pass
- `⚡ Soon` category — shows Flocks within the next 2 days
- Search matches against: title, venue, description, tags
- Sort options: `date` (soonest), `dist` (nearest — uses real distance if location granted), `going` (most popular), `spots` (fewest spots left)

#### Going count on cards
Cards show `e._dist` (real or fallback distance) and the base `e.going` count. The live going delta is only applied on the Flock detail page — home cards show the base count for performance.

---

### `js/pages/event.js`

#### Going count
```javascript
const liveGoing = Flock.getGoingCount(id, ev.going) + (joined ? 1 : 0);
const spotsLeft = ev.max - liveGoing;
```
The `+ (joined ? 1 : 0)` is because the delta only records the *other users' changes* — the current user's join is always reflected via `isJoined()`.

#### Leaflet map
Initialised after render. Destroyed and re-initialised on re-render (join/leave) to avoid duplicate map instances. Custom emoji pin using `L.divIcon`:
```javascript
const icon = L.divIcon({
  html: `<div style="background:var(--primary)..."><span style="transform:rotate(45deg)">${ev.e}</span></div>`,
  iconSize: [32, 32], iconAnchor: [16, 32]
});
```
`scrollWheelZoom: false` prevents accidental zoom while scrolling the page on desktop.

#### CTA states
| State | Button shown |
|-------|-------------|
| Free, not joined | "Join Flock! 🐦" |
| Paid, not joined | "Pay & Join — £X 💳" |
| Joined | "✓ You're in this Flock — tap to leave" |
| Full, not on waitlist | "🔔 Join Waitlist" |
| Full, on waitlist | "⏳ You're on the waitlist" |

#### Share
Uses `navigator.share` (native sheet on iOS/Android). Falls back to `navigator.clipboard.writeText` on desktop with a "✓ Link copied!" confirmation.

---

### `js/pages/my-events.js`

Splits joined Flocks into upcoming (date ≥ today) and past (date < today). Upcoming sorted soonest first. Past sorted most-recent first. Past Flocks shown with `.past` class (dimmed opacity). Each card links to `event.html?id={id}`.

---

### `js/pages/profile.js`

#### Age calculation
```javascript
function calcAge(dob) {
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}
```
Correctly handles birthdays that haven't occurred yet this year.

#### Inline editing
- **City** — `<select>` with `onchange="savePrefs({city:this.value});render()"` — saves and re-renders immediately
- **Looking to meet** — chips with `onclick="savePrefs({friendType:'X'});render()"`
- **Interests** — all 19 INTERESTS rendered as chips, `toggleInterest(label)` adds/removes from the array and re-renders

#### Edit profile modal
Bottom-sheet (`align-items: flex-end`) with first name, last name, DOB, and avatar grid. Closes on backdrop tap. Saves via `Flock.setProfile({...existing, firstName, lastName, dob, avatar})` to preserve any extra fields.

---

### `js/pages/onboarding.js`

Step 1 reads existing profile (pre-filled from signup). Avatar defaults to 🐦. Step 3 saves prefs with keys `{ city, dist, friendType }` — these match `getPrefs()` defaults exactly.

`setOnboarded()` is called only at the end of step 3, or by `seedNish()`. `requireAuth()` + `isOnboarded()` check at the top means already-onboarded users are immediately redirected to home.

---

### `js/pages/signup.js`

Username uniqueness check:
```javascript
function usernameExists(username) {
  const reg = JSON.parse(localStorage.getItem('flock_registered') || '[]');
  return reg.map(u => u.toLowerCase()).includes(username.toLowerCase());
}
```
`nish` is always reserved via an explicit `|| username === 'nish'` check. On successful signup, `registerUsername()` adds the new username to `flock_registered`.

---

## PWA

### `manifest.json`
- `start_url: "index.html"` — so PWA launch always routes correctly (auth check)
- `display: "standalone"` — no browser chrome when installed
- `theme_color: "#F97316"` — orange status bar on Android

### `sw.js` — Service Worker (flock-v11)
Cache-first strategy. On install, pre-caches all HTML, CSS, JS and manifest. On activate, takes control immediately. On fetch, serves from cache then updates cache in background.

To deploy a new version: bump `CACHE = 'flock-v12'`. Browser installs new SW, discards old cache.

---

## Data Flow

```
1. User opens index.html
   ├── flock_user in localStorage → home.html
   └── no user → login.html

2. Login: nish / mandal
   └── Flock.login() + Flock.seedNish()
       └── Sets profile {firstName:'Nish', lastName:'Mandal', dob:'2000-02-02', avatar:'🐦'}
           └── home.html

3. Browse Flocks
   └── Filter by city/distance/category/search/sort
       └── Click a Flock card → event.html?id=EV001

4. Join a free Flock
   └── Flock.joinEvent('EV001')
       └── flock_my_events: ['EV001']
           flock_going_deltas: { EV001: 1 }
               └── liveGoing = 24 + 1 + 1 (joined) = 26
                   spotsLeft = 40 - 26 = 14

5. Join a paid Flock
   └── Flock.setCheckoutEvent('EV004') → checkout-info.html
       └── Fill card details → checkout-overview.html
           └── Confirm → Flock.completeCheckout() → joinEvent() + clear checkout keys
               └── checkout-complete.html

6. Profile
   └── Edit city → savePrefs({city:'Manchester'}) → re-render
   └── Toggle interest → toggleInterest('Rugby') → setInterests([...]) → re-render
   └── Edit profile modal → setProfile({firstName, lastName, dob, avatar}) → re-render
```

---

## Key Conventions for Test Automation

- Page inputs: `signup-firstname`, `signup-lastname`, `signup-username`, `signup-password`, `signup-confirm`
- Submit buttons: `signup-submit-btn`, `login-submit-btn`
- Error spans: `err-signup-firstname`, `err-signup-username` etc.
- Nav items: `data-page="home"`, `data-page="my-events"`, `data-page="profile"`
- Flock cards: `id="event-card-EV001"` etc.
- CTA buttons: `join-event-btn`, `leave-event-btn`, `waitlist-btn`, `share-btn`
