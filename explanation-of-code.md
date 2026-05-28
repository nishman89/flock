# Flock — Code Explanation

This document walks through every file in the project, explaining what it does and how it works. Written for QA engineers and developers who want to understand the codebase before testing or extending it.

---

## Project Structure

```
flock/
├── index.html                    Redirect entry point
├── login.html                    Login page
├── signup.html                   Sign-up page
├── onboarding.html               3-step new-user setup
├── home.html                     Events feed
├── event.html                    Single event detail
├── my-events.html                Events the user has joined
├── profile.html                  User profile and preferences
├── checkout-info.html            Checkout step 1 — personal & card details
├── checkout-overview.html        Checkout step 2 — order review
├── checkout-complete.html        Checkout step 3 — confirmation
├── manifest.json                 PWA install configuration
├── sw.js                         Service worker (offline caching)
├── css/
│   └── styles.css                Single shared stylesheet for all pages
├── js/
│   ├── data.js                   All event and interest data
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

All HTML pages follow the same pattern:

```html
<head>
  <!-- PWA meta tags -->
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <div class="app-shell">
    <!-- page structure here -->
  </div>

  <script src="js/data.js"></script>       <!-- load data first -->
  <script src="js/state.js"></script>      <!-- then shared state -->
  <script src="js/pages/{page}.js"></script> <!-- then page logic -->
  <script>if('serviceWorker' in navigator){ navigator.serviceWorker.register('sw.js'); }</script>
</body>
```

Scripts are loaded in order at the bottom of the `<body>`. This means by the time `{page}.js` runs, it can safely reference `EVENTS`, `Flock`, `INTERESTS`, and all other globals from the earlier scripts.

### index.html
A meta-refresh redirect to `login.html`. Exists so opening the root URL goes somewhere sensible rather than a 404.

### login.html
The entry point for returning users. Contains the login form markup with `id` attributes on every input and button for test automation. No page logic lives here — it is all in `js/pages/login.js`.

### signup.html
Sign-up form for new users. Marked as a proof of concept — data is stored in `localStorage` (the browser), not on any server. Contains validation error `<span>` elements pre-written in the HTML, shown and hidden by the JS.

### onboarding.html
A three-step wizard: (1) name and age group, (2) interests, (3) city and preferences. The step content is rendered dynamically into a single `<div id="ob-content">` container by `js/pages/onboarding.js`. The header and footer (progress bar + Continue button) are static HTML.

### home.html
The main events feed. Contains:
- A city dropdown and distance dropdown (filter bar)
- Category scroll tabs (All, Sports, Food & Drink, etc.)
- An empty `<div id="events-container">` that `js/pages/home.js` fills with event cards

### event.html
The detail view for a single event. The event ID is passed via URL query string: `event.html?id=EV001`. The page reads this on load and renders the full event. Contains two dynamic areas:
- `#detail-content` — the main event information
- `#detail-cta` — the Join/Leave/Pay button at the bottom

### my-events.html / profile.html
Both follow the same pattern: an empty container that the corresponding page JS fills by reading from `localStorage` via `Flock` helpers.

### checkout-info.html / checkout-overview.html / checkout-complete.html
A three-step checkout flow for paid events (any event where `price !== 'Free'`). Each page reads the event ID from `localStorage` (set by `Flock.setCheckoutEvent()` before navigating) and renders accordingly.

---

## CSS — `css/styles.css`

One stylesheet for all pages. It is divided into clearly labelled sections:

| Section | What it covers |
|---------|---------------|
| Variables (`:root`) | All colour tokens, font stack, spacing values, shadow definitions |
| PWA / iOS fixes | Overscroll behaviour, tap highlight removal |
| iOS install banner | The "Add to Home Screen" prompt shown on iPhones |
| App shell | The outer wrapper that fills the screen on mobile |
| Desktop layout (`@media ≥ 768px`) | Sidebar, 2-column grid, wider padding |
| Auth pages | Login and sign-up full-screen gradient layout, desktop split-screen |
| Onboarding | Step wizard layout, interest chip grid |
| Header | Sticky top bar |
| Bottom nav | Tab bar (hidden on desktop) |
| Filter bar / category tabs | City/distance dropdowns, horizontal scroll tabs |
| Event cards | The main content cards on the home feed |
| Event detail | Detail page hero, info rows, attendee grid, sticky CTA |
| Checkout | Step indicator, form layout, summary cards, confirmation screen |
| Profile / My Events | Hero gradient, settings rows, interest tag chips |
| Form validation | `.invalid` input state, `.field-error.show` visibility |

### CSS Custom Properties

All colours and key values are defined as custom properties on `:root`:

```css
:root {
  --primary:    #F97316;   /* Flock orange — buttons, active states */
  --primary-dk: #C2410C;   /* Darker orange — hover states */
  --primary-lt: #FED7AA;   /* Light orange — backgrounds */
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

Changing `--primary` here changes every button, active tab, badge and link across the entire app.

### Responsive Strategy

The app uses a **mobile-first** approach. The base CSS is written for narrow screens (< 768px). A single `@media (min-width: 768px)` block at the bottom overrides it for desktop, adding:
- The sidebar (`width: 240px`, `position: sticky`)
- Hiding the bottom nav (`display: none !important`)
- A 2-column event grid (`grid-template-columns: repeat(2, 1fr)`)
- Wider padding on all containers

---

## JavaScript

### `js/data.js`

Contains two exports used across multiple pages:

**`INTERESTS`** — array of `{ emoji, label }` objects used in onboarding and on the profile page:
```javascript
{ emoji: '⚽', label: 'Football' }
```

**`CITIES`** — array of city name strings used in the city dropdown.

**`EVENTS`** — the main data array. Each event object:
```javascript
{
  id:       'EV001',           // unique ID, used in URL params and localStorage
  t:        'Event Title',     // display name
  cat:      'Sports',          // category — must match a filter tab
  interests:['Football'],      // interest labels from INTERESTS array
  city:     'London',          // must match a value in CITIES
  venue:    'The Crown & Anchor',
  addr:     '22 Fleet St EC4Y',
  date:     '2025-07-14',      // ISO date string
  time:     '15:00',
  dur:      '3 hrs',
  price:    'Free',            // 'Free' or '£X' — drives the checkout routing
  going:    24,                // current attendee count (static demo data)
  max:      40,                // capacity
  e:        '⚽',              // emoji displayed in card header
  dist:     1.2,               // distance in miles from city centre (for distance filter)
  desc:     'Description...',
  tags:     ['Football','Sports','Social'],
  ages:     '18+',             // or 'All ages'
  ft:       'Both'             // 'Both', 'Girls', or 'Boys'
}
```

**`SAMPLE_ATTENDEES`** — 12 placeholder attendee objects with names and colours, used to render the "who's going" circles on the event detail page.

---

### `js/state.js`

All persistent state lives in `localStorage` and is accessed through the `Flock` object. This means state survives page navigations (since each page is a separate HTML file) and persists between browser sessions.

```javascript
const Flock = { ... }
```

**Auth methods:**

| Method | What it does |
|--------|-------------|
| `Flock.login(username)` | Writes `flock_user` to localStorage |
| `Flock.getUser()` | Returns the logged-in username, or `null` |
| `Flock.logout()` | Clears all localStorage and redirects to `login.html` |
| `Flock.requireAuth()` | If no user is found, redirects to `login.html`. Called at the top of every protected page. |

**Profile and preferences:**

| Method | Key stored | Shape |
|--------|-----------|-------|
| `Flock.setProfile(obj)` | `flock_profile` | `{ name, fullName, age }` |
| `Flock.getProfile()` | — | Returns profile object or `{}` |
| `Flock.setInterests(arr)` | `flock_interests` | Array of interest label strings |
| `Flock.getInterests()` | — | Returns array or `[]` |
| `Flock.setPrefs(obj)` | `flock_prefs` | `{ city, dist, ft }` |
| `Flock.getPrefs()` | — | Returns prefs or defaults |

**Events:**

| Method | What it does |
|--------|-------------|
| `Flock.joinEvent(id)` | Adds event ID to `flock_my_events` array |
| `Flock.leaveEvent(id)` | Removes event ID from `flock_my_events` |
| `Flock.isJoined(id)` | Returns `true` if the event is in the user's list |
| `Flock.getMyEvents()` | Returns array of joined event IDs |

**Checkout:**

| Method | What it does |
|--------|-------------|
| `Flock.setCheckoutEvent(id)` | Saves the event being purchased to `flock_checkout_event` |
| `Flock.getCheckoutEvent()` | Returns the event ID being checked out |
| `Flock.setCheckoutInfo(obj)` | Saves form data (name, card details) to `flock_checkout_info` |
| `Flock.getCheckoutInfo()` | Returns saved checkout form data |
| `Flock.completeCheckout()` | Calls `joinEvent()` then clears both checkout keys |

**`Flock.seedNish()`**

A special method called every time the demo user `nish` logs in. It always overwrites his profile with pre-set data so the demo is consistent:
- Name: Nish Mandal, Age: 25–34, City: London
- Interests: Football, Swimming, Dancing, Pub & Social, Food & Dining, Cinema, Gym & Fitness
- His joined events list is preserved after first login (so testing joining/leaving works)

---

### `js/desktop-sidebar.js`

This file runs after all other scripts on each app page. It checks the screen width — if `>= 768px`, it programmatically builds the sidebar and restructures the DOM:

```
Before: .app-shell → [header, content, bottom-nav]
After:  .app-shell → .page-wrap → [.sb (sidebar), .page-main → [header, content, bottom-nav]]
```

Because it runs after `state.js` is loaded, it can call `Flock.logout()` from the sidebar's Sign Out button. It reads `location.pathname` to know which nav link to mark as `.active`.

Why JS instead of static HTML? The sidebar is the same across all app pages. Putting it in JS means it only needs to be maintained in one place rather than copied into every HTML file.

---

### `js/pages/login.js`

- Checks if a user is already logged in on page load — if so, skips straight to `home.html` or `onboarding.html`
- Listens to form submit, validates that both fields are filled
- If `nish` / `mandal`: calls `Flock.login()`, `Flock.seedNish()`, redirects to `home.html`
- Any other combination: shows the `#login-error` inline error

---

### `js/pages/signup.js`

Validates the sign-up form with rules:
- Full name: at least 2 characters
- Username: at least 3 characters, no spaces, not already `nish`
- Password: at least 6 characters
- Confirm password: must match password

On success: calls `Flock.login(username)`, sets a basic profile (first name only), and redirects to `onboarding.html`. The user then sets their interests and preferences before reaching the home feed.

---

### `js/pages/onboarding.js`

Manages a 3-step wizard using a `step` variable (1, 2, or 3). Each time `nextStep()` is called:
1. Validates the current step
2. Saves data to the `S` state object (local to the script)
3. Re-renders the header (progress bars and title) and body content

On step 3 completion, it writes everything to `localStorage` via the `Flock` helpers and sets `Flock.setOnboarded()` before redirecting to `home.html`.

Interest chips use a `Set` (`S.obInts`) for O(1) add/delete and easy duplicate prevention.

---

### `js/pages/home.js`

Runs on `home.html`. Key responsibilities:

1. **Greeting** — reads the current hour to produce "Good Morning/Afternoon/Evening, [name]"
2. **Populates dropdowns** — reads `CITIES` from `data.js` to build the city `<select>`, sets the initial value from `Flock.getPrefs()`
3. **`renderEvents()`** — the main render function:
   - Filters `EVENTS` by `activeCity`, `activeDist` and `activeCat`
   - Renders each matching event as an `<a>` tag (so tapping navigates to `event.html?id=EV001`)
   - Generates 3 small avatar dots and an attendee count for the card footer
4. **`setCat(cat, el)`** — updates `activeCat` and re-renders
5. **`applyFilters()`** — called by the dropdowns' `onchange`, updates `activeCity` / `activeDist` and re-renders

---

### `js/pages/event.js`

Reads the event ID from `new URLSearchParams(location.search).get('id')` and finds the matching event in `EVENTS`.

**`render()`** rebuilds the entire page content including:
- The gradient hero with emoji and back button
- All event metadata (date, venue, price, spots, age group)
- The description and tags
- The "who's going" attendee bubble grid (up to 8 named bubbles + overflow count)
- If the user has joined, their own avatar appears first with "You!" label

**`toggleJoin()`**:
- If already joined → confirms, then calls `Flock.leaveEvent(id)` and re-renders
- If free event → calls `Flock.joinEvent(id)` and re-renders
- If paid event → calls `Flock.setCheckoutEvent(id)` and navigates to `checkout-info.html`

The CTA button label changes based on state:
- Not joined, free: `Join Flock! 🐦`
- Not joined, paid: `Pay & Join — £5 💳`
- Already joined: `✓ You're going — tap to leave`

---

### `js/pages/checkout-info.js`

- Reads the event being purchased from `Flock.getCheckoutEvent()`
- Displays the event summary at the top of the form
- Auto-formats card number input (adds spaces every 4 digits), expiry (inserts `/` after 2 digits) and restricts CVV to 3 digits
- Validates all 6 fields on submit; shows inline errors for each failing field
- On success: calls `Flock.setCheckoutInfo(data)` and navigates to `checkout-overview.html`

---

### `js/pages/checkout-overview.js`

- Reads the event and the saved form data
- If either is missing (e.g. user navigated directly), redirects back
- Calculates the price breakdown: ticket + £0.99 booking fee + 20% VAT = total
- Masks the card number to show only the last 4 digits
- On "Confirm & Pay": calls `Flock.completeCheckout()` (which calls `joinEvent()` internally) then navigates to `checkout-complete.html`

---

### `js/pages/checkout-complete.js`

- Generates a random booking reference: `FLK-XXXX-XXXX`
- Reads the user's first name to personalise the confirmation message

---

### `js/pages/my-events.js`

- Gets the array of joined event IDs from `Flock.getMyEvents()`
- Looks each ID up in `EVENTS` to get the full event object
- Renders either a list of event cards or an empty state with a "Browse Events" button
- Each card is an `<a>` tag linking to `event.html?id={id}`

---

### `js/pages/profile.js`

- Reads profile, preferences and interests from `localStorage`
- Renders the orange hero section (avatar initials, name, city/age sub-line)
- Renders stats (events joined count, interests count)
- Renders preference rows (city, distance, who I want to meet)
- Renders interest tags by cross-referencing the stored labels with `INTERESTS` in `data.js` to recover the emoji
- "Edit interests & preferences" row links back to `onboarding.html`
- Sign Out button calls `Flock.logout()`

---

## PWA Setup

### `manifest.json`

Tells the browser the app is installable. Key fields:

```json
{
  "name": "Flock",
  "display": "standalone",      // hides browser chrome when installed
  "start_url": "login.html",    // opens here when launched from home screen
  "theme_color": "#F97316"      // colours the iOS status bar and Android toolbar
}
```

### `sw.js` — Service Worker

A service worker is a background script that intercepts network requests. Flock's service worker implements a **cache-first** strategy:

1. **`install`** event: downloads and caches all HTML, CSS and JS files
2. **`activate`** event: takes control of all open tabs immediately
3. **`fetch`** event: for every request, checks the cache first. If found, returns the cached version (fast, works offline). If not found, fetches from the network and adds it to the cache for next time.

This means after the first load, Flock works entirely offline. The cache is named `flock-v2` — incrementing the version number (e.g. to `flock-v3`) forces the browser to discard the old cache and re-download everything, which is how you deploy updates.

### iOS Meta Tags

These appear in the `<head>` of every page:

```html
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
```

The first tag enables full-screen mode when opened from the iOS home screen. The second makes the status bar transparent so the orange header extends behind it, giving a truly native feel.

---

## Data Flow — End to End

Here is how data moves through the app for a typical user journey:

```
1. User lands on login.html
   └── Enters nish / mandal
       └── login.js calls Flock.login('nish') + Flock.seedNish()
           └── localStorage: flock_user='nish', flock_profile={...}, flock_interests=[...], flock_prefs={...}

2. Redirected to home.html
   └── home.js calls Flock.requireAuth() → passes
       └── Reads flock_prefs to set activeCity='London', activeDist=25
           └── Filters EVENTS array, renders cards

3. User clicks event card (e.g. EV004, £5 paid)
   └── Navigates to event.html?id=EV004
       └── event.js reads URL param, finds event in EVENTS
           └── Renders detail page
               └── User clicks "Pay & Join — £5 💳"
                   └── event.js calls Flock.setCheckoutEvent('EV004')
                       └── Navigates to checkout-info.html

4. Checkout info → overview → complete
   └── checkout-info.js validates form, calls Flock.setCheckoutInfo({...})
       └── checkout-overview.js reads both, renders summary
           └── User confirms → Flock.completeCheckout()
               └── Calls Flock.joinEvent('EV004'), clears checkout keys
                   └── Navigates to checkout-complete.html

5. User visits my-events.html
   └── my-events.js reads Flock.getMyEvents() → ['EV004']
       └── Finds EV004 in EVENTS, renders it
```

---

## `id` Attribute Reference for Test Automation

All key elements have `id` attributes. See the table in `README.md` for the full list.

Key conventions:
- Page-level inputs: `{page}-{field}` e.g. `login-username`, `signup-password`
- Submit buttons: `{page}-submit-btn` e.g. `login-submit-btn`, `signup-submit-btn`
- Inline errors: `err-{page}-{field}` e.g. `err-signup-username`
- Navigation: `nav-discover`, `nav-my-events`, `nav-profile`
- Category tabs: `tab-all`, `tab-sports`, `tab-food` etc.
- Event cards: `event-card-EV001`, `event-card-EV002` etc. (dynamically set)
- Checkout back buttons: `checkout-back-btn`, `overview-back-btn`
- Action buttons: `join-event-btn`, `leave-event-btn`, `confirm-pay-btn`
