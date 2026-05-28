# Flock — Code Explanation

A detailed walkthrough of every file in the project. Written for developers and QA engineers who want to understand the codebase before testing or extending it.

---

## Project Structure

```
flock/
├── index.html                    Auth router — redirects based on login state
├── login.html                    Login page
├── signup.html                   Sign-up page (proof of concept)
├── onboarding.html               3-step new-user setup wizard
├── home.html                     Events feed with filters
├── event.html                    Single event detail + Join/Leave
├── my-events.html                Events the user has joined
├── profile.html                  User profile and preferences
├── checkout-info.html            Checkout step 1 — personal & card details
├── checkout-overview.html        Checkout step 2 — order review
├── checkout-complete.html        Checkout step 3 — confirmation
├── about.html                    About page
├── manifest.json                 PWA install configuration
├── sw.js                         Service worker (offline caching, flock-v4)
├── css/
│   └── styles.css                Single shared stylesheet for all pages
├── js/
│   ├── data.js                   All event + interest data, d(n) date helper
│   ├── state.js                  Shared state management (localStorage)
│   ├── desktop-sidebar.js        Injects the sidebar on desktop screens
│   └── pages/
│       ├── login.js
│       ├── signup.js
│       ├── onboarding.js
│       ├── home.js
│       ├── event.js
│       ├── my-events.js
│       ├── profile.js
│       ├── checkout-info.js
│       ├── checkout-overview.js
│       └── checkout-complete.js
└── images/
    ├── apple-touch-icon.png      iOS home screen icon (180×180)
    ├── icon-192.png              PWA icon (192×192)
    └── icon-512.png              PWA icon (512×512)
```

---

## HTML Pages

All app pages follow the same pattern:

```html
<head>
  <!-- PWA meta tags -->
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <div class="app-shell">
    <!-- page structure -->
  </div>
  <script src="js/data.js"></script>
  <script src="js/state.js"></script>
  <script src="js/pages/{page}.js"></script>
  <script>if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js'); }</script>
  <script src="js/desktop-sidebar.js"></script>
</body>
```

Scripts load in order at the bottom of `<body>`. By the time `{page}.js` runs, it can safely reference `EVENTS`, `INTERESTS`, `Flock`, and all globals from earlier scripts. `desktop-sidebar.js` always loads last so it can wrap whatever the page JS has already rendered.

### index.html

The entry point for the app. Contains no visible content — just a script that reads `localStorage` and immediately redirects:

```javascript
const user = localStorage.getItem('flock_user');
window.location.replace(user ? 'home.html' : 'login.html');
```

Uses `window.location.replace()` (not `href`) so the redirect does not appear in browser history — pressing Back from `home.html` won't loop the user back to `index.html`.

The `manifest.json` `start_url` points here, so the PWA always routes correctly on launch whether the user is logged in or not.

### login.html

Entry point for returning users. Form markup with `id` attributes on every input and button for test automation. All logic lives in `js/pages/login.js`.

### signup.html

Sign-up form. Proof of concept — data is stored in `localStorage`, not on a server. Contains pre-written validation error `<span>` elements shown/hidden by JS.

### onboarding.html

Three-step wizard: (1) name and age group, (2) interests, (3) city and preferences. Step content renders dynamically into a single `<div id="ob-content">`. The progress bar and Continue button are static HTML.

### home.html

Main events feed. Contains:
- City and distance dropdowns (filter bar)
- Category scroll tabs (All, Sports, Food & Drink, etc.)
- An empty `<div id="events-container">` filled by `home.js`

### event.html

Detail view for a single event. The event ID is passed via URL query string: `event.html?id=EV001`. Contains two dynamic areas:
- `#detail-content` — event information
- `#detail-cta` — the Join/Leave/Pay button (sticky at bottom)

### my-events.html

Lists events the user has joined. Contains a `<div class="my-list" id="my-events-container">` filled by `my-events.js`. The `my-list` class connects to desktop-specific CSS rules that constrain its width to `560px` so cards don't stretch too wide on large screens.

### profile.html

User profile page. No `<header>` element — the profile hero image fills from the very top of the content area. All content rendered by `profile.js`.

### checkout-info.html / checkout-overview.html / checkout-complete.html

Three-step checkout for paid events (`price !== 'Free'`). Each page reads the event ID from `localStorage` via `Flock.getCheckoutEvent()`.

---

## CSS — `css/styles.css`

One stylesheet for all pages, divided into clearly labelled sections.

### CSS Custom Properties

```css
:root {
  --primary:    #F97316;   /* Flock orange — buttons, active states */
  --primary-dk: #C2410C;   /* Darker orange — hover states */
  --primary-lt: #FED7AA;   /* Light orange — active nav backgrounds */
  --bg:         #FFF8EF;   /* Page background (warm off-white) */
  --card:       #FFFFFF;   /* Card and header background */
  --border:     #FDE8D0;   /* Borders and dividers */
  --text:       #1C0A00;   /* Primary text */
  --text2:      #6B3A1F;   /* Secondary text */
  --text3:      #A8784A;   /* Muted / hint text */
  --ok:         #16A34A;   /* Success green */
  --err:        #DC2626;   /* Error red */
  --nav-h:      72px;      /* Bottom nav height */
}
```

### Responsive Strategy

Mobile-first. The base CSS targets narrow screens. A single `@media (min-width: 768px)` block overrides for desktop.

**Mobile (< 768px):**
- `.app-shell` is full width (max-width: 480px centred at 600px+)
- Bottom nav is `position: fixed; bottom: 0; left: 0; right: 0` — always visible regardless of scroll position
- `.content` has `padding-bottom` equal to the nav height so content is never hidden behind the nav
- `.sb`, `.page-wrap`, `.page-main` are set to `display: none` / `display: contents` by default — this ensures that if the desktop sidebar was injected (by JS when the window was wide) and then the window is resized narrower, the sidebar HTML disappears cleanly rather than rendering as unstyled links

**Desktop (≥ 768px):**
- `.app-shell` goes full width (`max-width: none !important`)
- Desktop sidebar injects into the DOM (via `desktop-sidebar.js`)
- `.page-wrap` becomes `display: flex` — sidebar left, `.page-main` right
- `.sb` becomes `display: flex; width: 240px` — the sticky sidebar
- Bottom nav is `display: none !important`
- `.page-wrap .my-list` gets `max-width: 560px` to keep the My Events cards a similar width to the home 2-column grid cards

### Bottom Nav

```css
.bottom-nav {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  z-index: 100;
}
```

`position: fixed` (not `sticky`) ensures it is always pinned to the bottom of the viewport regardless of how long the page content is.

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

Returns an ISO date string `n` days from today. Used for every event's `date` field so dates are always upcoming and never stale. Example: `d(1)` = tomorrow, `d(7)` = one week from now.

#### `INTERESTS`

Array of `{ e, label }` objects used in onboarding and profile:
```javascript
{ e: '⚽', label: 'Football' }
```
Note: the emoji is stored as `e`, not `emoji`. Profile code cross-references this using `match.e`.

#### `EVENTS`

34-item array. Each event object:

```javascript
{
  id:       'EV001',         // unique ID — used in URL params and localStorage
  t:        'Event Title',   // display name
  cat:      'Sports',        // category — must match a filter tab label
  interests:['Football'],    // interest labels from INTERESTS array
  city:     'London',        // must match a value in CITIES
  venue:    'The Crown & Anchor',
  addr:     '22 Fleet St EC4Y',
  date:     d(1),            // always 1 day from today — uses d() helper
  time:     '15:00',
  dur:      '3 hrs',
  price:    'Free',          // 'Free' or '£X' — single value, no ranges
  going:    24,              // current attendee count (static demo)
  max:      40,              // capacity
  e:        '⚽',            // emoji shown in card and detail header
  dist:     1.2,             // miles from city centre (for distance filter)
  desc:     '...',
  tags:     ['Football','Sports','Social'],
  ages:     '18+',           // or 'All ages'
  ft:       'Both'           // 'Both', 'Girls', or 'Boys'
}
```

Events are spread across offsets of 1–10 days so there is always a natural-feeling mix of "tomorrow", "in a few days" and "next week".

Price is always a single value (`'Free'`, `'£5'`, `'£10'` etc.) — never a range like `'£10–25'`.

---

### `js/state.js`

All persistent state lives in `localStorage`, accessed through the `Flock` object. State survives page navigations and persists between sessions.

**Auth:**

| Method | What it does |
|--------|-------------|
| `Flock.login(username)` | Writes `flock_user` to localStorage |
| `Flock.getUser()` | Returns the logged-in username, or `null` |
| `Flock.logout()` | Clears all localStorage, redirects to `login.html?bye=1` |
| `Flock.requireAuth()` | If no user found, redirects to `login.html` |

**Profile and preferences:**

| Method | Key | Shape |
|--------|-----|-------|
| `Flock.setProfile(obj)` | `flock_profile` | `{ name, fullName, age }` |
| `Flock.getProfile()` | — | Returns profile object or `{}` |
| `Flock.setInterests(arr)` | `flock_interests` | Array of interest label strings |
| `Flock.getInterests()` | — | Returns array or `[]` |
| `Flock.setPrefs(obj)` | `flock_prefs` | `{ city, distance, friendType }` |
| `Flock.getPrefs()` | — | Returns prefs or defaults |

**Events:**

| Method | What it does |
|--------|-------------|
| `Flock.joinEvent(id)` | Adds event ID to `flock_my_events` array |
| `Flock.leaveEvent(id)` | Removes event ID from `flock_my_events` |
| `Flock.isJoined(id)` | Returns `true` if event is in the user's list |
| `Flock.getMyEvents()` | Returns array of joined event IDs |

**Checkout:**

| Method | What it does |
|--------|-------------|
| `Flock.setCheckoutEvent(id)` | Saves the event being purchased |
| `Flock.getCheckoutEvent()` | Returns the event ID being checked out |
| `Flock.setCheckoutInfo(obj)` | Saves form data (name, card details) |
| `Flock.getCheckoutInfo()` | Returns saved checkout form data |
| `Flock.completeCheckout()` | Calls `joinEvent()` then clears checkout keys |

**`Flock.seedNish()`**

Called every time the demo user `nish` logs in. Overwrites his profile with preset data for a consistent demo:
- Name: Nish Mandal, Age: 25–34, City: London
- Interests: Football, Swimming, Dancing, Pub & Social, Food & Dining, Cinema, Gym & Fitness

---

### `js/desktop-sidebar.js`

Runs after all other page scripts. If `window.innerWidth >= 768`, it builds the sidebar and restructures the DOM:

```
Before: .app-shell → [header?, content, bottom-nav]
After:  .app-shell → .page-wrap → [.sb (sidebar), .page-main → [header?, content, bottom-nav]]
```

The sidebar is built in JS rather than duplicated in every HTML file — one place to maintain. It reads `location.pathname` to mark the correct nav link as `.active`.

**Resize safety:** `.sb`, `.page-wrap`, and `.page-main` all have default `display: none` / `display: contents` in the CSS outside the `@media (min-width: 768px)` block. This means if the user resizes the browser below 768px after the sidebar has been injected, the sidebar HTML becomes invisible (instead of rendering as raw unstyled links) and the mobile bottom nav reappears.

---

### `js/pages/login.js`

- On load: if user is already logged in, redirects immediately to `home.html`
- On submit: validates fields are filled
- If `nish` / `mandal`: calls `Flock.login()` + `Flock.seedNish()`, redirects to `home.html`
- Any other credentials: shows `#login-error`

---

### `js/pages/home.js`

1. **Greeting** — reads the hour to display "Good Morning/Afternoon/Evening, [name]"
2. **Populates city dropdown** — from `CITIES`, defaulting to saved preference
3. **`renderEvents()`** — filters `EVENTS` by `activeCity`, `activeDist`, `activeCat`, renders each as an `<a>` card linking to `event.html?id=EV001`
4. **`setCat()`** / **`applyFilters()`** — update filter state and re-render

---

### `js/pages/event.js`

Reads `?id=EV001` from the URL, finds the event in `EVENTS`.

**`render()`** builds:
- Gradient hero with emoji and back button
- All event metadata rows
- "Who's going" attendee bubbles (up to 8 + overflow count)
- If the user has joined, their avatar appears first with "You!" label

**`toggleJoin()`:**
- Already joined → confirm, call `Flock.leaveEvent(id)`, re-render
- Free event → `Flock.joinEvent(id)`, re-render
- Paid event → `Flock.setCheckoutEvent(id)`, navigate to `checkout-info.html`

CTA button label changes:
- `Join Flock! 🐦` (free, not joined)
- `Pay & Join — £5 💳` (paid, not joined)
- `✓ You're going — tap to leave` (joined)

---

### `js/pages/my-events.js`

- Gets joined event IDs from `Flock.getMyEvents()`
- Looks each up in `EVENTS`
- Renders a list of event cards or an empty state
- Each card is an `<a>` tag to `event.html?id={id}`

---

### `js/pages/profile.js`

- Reads profile, preferences and interests from localStorage
- Renders orange hero (avatar initials, name, city/age)
- Renders stats, preferences, interest tags
- For interest tags: cross-references stored label strings with `INTERESTS` from `data.js` to recover the emoji using `match.e` (the field is `e`, not `emoji`)
- "Edit interests & preferences" links back to `onboarding.html`

---

## PWA Setup

### `manifest.json`

```json
{
  "name": "Flock",
  "display": "standalone",
  "start_url": "index.html",
  "theme_color": "#F97316"
}
```

`start_url` points to `index.html` (the auth router) so the app always navigates correctly when launched from the home screen, whether logged in or not.

### `sw.js` — Service Worker

Cache-first strategy, currently `flock-v4`:

1. **`install`** — downloads and caches all HTML, CSS, JS and `manifest.json`
2. **`activate`** — takes control of all open tabs immediately (`skipWaiting` + `clients.claim`)
3. **`fetch`** — returns cached version if available; otherwise fetches from network and caches the response

To deploy updates: bump the `CACHE` constant (e.g. `flock-v4` → `flock-v5`). The browser detects the new service worker, installs it, and discards the old cache.

---

## Data Flow — End to End

```
1. User opens index.html
   └── Checks localStorage for flock_user
       ├── Found → redirect to home.html
       └── Not found → redirect to login.html

2. login.html — user enters nish / mandal
   └── Flock.login('nish') + Flock.seedNish()
       └── localStorage set: flock_user, flock_profile, flock_interests, flock_prefs
           └── redirect to home.html

3. home.html
   └── Flock.requireAuth() → passes
       └── Filters EVENTS by city/distance/category, renders cards

4. User clicks a paid event card (e.g. EV004 £5)
   └── event.html?id=EV004
       └── User taps "Pay & Join — £5 💳"
           └── Flock.setCheckoutEvent('EV004') → checkout-info.html

5. Checkout flow
   └── checkout-info.js: validates form, Flock.setCheckoutInfo({...})
       └── checkout-overview.js: renders summary, user confirms
           └── Flock.completeCheckout() → joinEvent('EV004'), clears checkout keys
               └── checkout-complete.html

6. User visits my-events.html
   └── Flock.getMyEvents() → ['EV004']
       └── Looks up EV004 in EVENTS, renders card
```

---

## `id` Attribute Reference for Test Automation

Key conventions:
- Page inputs: `{page}-{field}` e.g. `login-username`, `signup-password`
- Submit buttons: `{page}-submit-btn`
- Inline errors: `err-{page}-{field}` e.g. `err-signup-username`
- Navigation: `nav-discover`, `nav-my-events`, `nav-profile`
- Category tabs: `tab-all`, `tab-sports`, `tab-food` etc.
- Event cards: `event-card-EV001`, `event-card-EV002` etc.
- Action buttons: `join-event-btn`, `leave-event-btn`, `confirm-pay-btn`
- Sidebar nav: `sidebar-nav-home`, `sidebar-nav-my-events`, `sidebar-nav-profile`
