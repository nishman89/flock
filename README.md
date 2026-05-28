# Flock 🐦

**Make genuine friends through shared Flocks.**

A mobile-first web app that connects you with local people who share your interests. Join a Flock — a football watch party, a food tour, a board game night, a hike — show up, and meet people who are actually like you.

> "Birds of a feather Flock together." That's not just a saying — it's the whole idea.

---

## What's a Flock?

A **Flock** is what we call every event on the app. Each Flock has a fixed number of spots, a time, a place, and a shared vibe. You join a Flock, show up, and meet your people. When you join, the going count increases and the spots decrease in real time — so you always know exactly how many spaces are left.

---

## Code Documentation

For a detailed technical walkthrough of every file, function and data structure, see:

📄 **[explanation-of-code.md](explanation-of-code.md)**

---

## Demo Login

| Field    | Value    |
|----------|----------|
| Username | `nish`   |
| Password | `mandal` |

Nish Mandal · DOB 02/02/2000 · London

---

## Getting a Live URL

### Option 1 — GitHub Pages (free)

1. Create a free account at **[github.com](https://github.com)**
2. Create a new repository called `flock` (set to **Public**)
3. Upload all the files from this folder
4. Go to **Settings → Pages → Source → select `main` branch → Save**
5. Your URL: `https://yourusername.github.io/flock`

### Option 2 — Netlify (free, even easier)

1. Go to **[netlify.com](https://netlify.com)** and sign up free
2. Drag and drop the entire `flock` folder onto the deploy area
3. Instantly live at something like `https://flock-abc123.netlify.app`

> **Note:** Geolocation ("Use my location") requires HTTPS to work on mobile. Both GitHub Pages and Netlify provide this automatically.

---

## Installing as an iPhone App (PWA)

Once you have a live HTTPS URL, open it in **Safari on iPhone**:

1. Tap the **Share** button (box with arrow at the bottom of the screen)
2. Scroll down and tap **"Add to Home Screen"**
3. Tap **"Add"** in the top right

Flock now lives on your home screen and opens full screen with no browser chrome — exactly like a native app. Works offline once cached.

---

## Pages

| File | Description |
|------|-------------|
| `index.html` | Entry point — routes to `home.html` if signed in, `login.html` if not |
| `login.html` | Login with username + password |
| `signup.html` | Sign up — first name, last name, username, password |
| `onboarding.html` | 3-step setup: name/DOB/avatar → interests → city/preferences |
| `home.html` | Flocks feed — search, sort, filter by city/distance/category |
| `event.html` | Flock detail — map, attendees, join/leave, share, waitlist |
| `my-events.html` | My Flocks — upcoming and past |
| `profile.html` | Profile — edit name/DOB/avatar, city, interests, looking to meet |
| `checkout-info.html` | Checkout step 1 — personal & card details (paid Flocks) |
| `checkout-overview.html` | Checkout step 2 — order review |
| `checkout-complete.html` | Checkout step 3 — confirmation |
| `about.html` | About Flock — what a Flock is, how it works, who it's for |

---

## Features

**Flocks & Discovery**
- 52 Flocks across 10 UK cities: London, Manchester, Birmingham, Edinburgh, Bristol, Leeds, Liverpool, Glasgow, Cardiff, Newcastle
- Dates always 1–10 days from today — dynamically generated, never stale
- Search by keyword (title, venue, tags, description)
- Sort by: Soonest, Nearest, Popular, Spots left
- Filter by city, distance (5–50 miles or any) and category
- Category tabs: All, ⚡ Soon, Sports, Food & Drink, Gaming, Fitness, Social, Wellness, Outdoors, Music, Arts
- 🔁 Recurring badge on weekly Flocks
- 🔴 Full badge when a Flock is at capacity

**Joining**
- Join and leave Flocks — going count increases/decreases live
- Spots remaining updates instantly and persists across page loads
- Waitlist for full Flocks
- Free Flocks: join instantly; Paid Flocks: 3-step checkout flow
- Share button: native share sheet on mobile, copy link on desktop

**Maps**
- Interactive Leaflet/OpenStreetMap map on every Flock detail page
- Custom emoji pin matching the Flock category
- "Get Directions" button deep-links to Google Maps

**Location**
- "Use my location" button — finds nearest city using GPS/wifi
- Calculates real distances to Flocks when location is granted
- Helpful error messages if permission is denied (with OS-specific instructions)

**Profile**
- First name, last name, date of birth (age auto-calculated)
- 12 emoji avatars to pick from
- Edit profile via bottom-sheet modal
- City and "looking to meet" editable inline
- All 19 interests editable inline — tap to add/remove
- Flocks joined count

**Accounts & Onboarding**
- Signup: first name + last name + username + password
- Username uniqueness checked against localStorage registry
- 3-step onboarding (mandatory — no skip)
- Name from signup pre-fills into onboarding step 1
- `index.html` routes to home or login based on session

**Technical**
- 100% static — no backend, no API keys, no server
- All data in localStorage
- PWA: installable, offline-capable (service worker `flock-v11`)
- Responsive: fixed bottom nav on mobile, sticky sidebar on desktop ≥ 768px
- Sidebar collapses cleanly on resize (no broken links)

---

## File Structure

```
flock/
├── index.html                  ← Auth router
├── login.html
├── signup.html
├── onboarding.html
├── home.html
├── event.html
├── my-events.html
├── profile.html
├── checkout-info.html
├── checkout-overview.html
├── checkout-complete.html
├── about.html
├── manifest.json               ← PWA config (start_url: index.html)
├── sw.js                       ← Service worker (flock-v11)
├── css/
│   └── styles.css              ← Single stylesheet for all pages
├── js/
│   ├── data.js                 ← 52 Flocks, INTERESTS, CITIES, d(n) helper
│   ├── state.js                ← localStorage state (Flock object)
│   ├── desktop-sidebar.js      ← Injects sidebar on screens ≥ 768px
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
│       ├── checkout-complete.js
│       └── about.js
└── images/
    ├── apple-touch-icon.png    ← iOS home screen icon (180×180)
    ├── icon-192.png            ← PWA icon
    └── icon-512.png            ← PWA icon
```

---

*Flock — proof of concept. No backend. No API keys. Just a Flock.*
