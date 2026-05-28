# Flock 🐦

**Make genuine friends through shared Flocks and Roosts.**

A mobile-first web app that connects you with local people who share your interests. Join a **Flock** (a group), show up to a **Roost** (a specific gathering), and make real friends through repeated shared experiences.

> "Birds of a feather Flock together." That's not just a saying - it's the whole idea.

---

## The Language

| Term | What it means |
|------|--------------|
| **Flock** | A group of like-minded people, e.g. "Arsenal Supporters Club London" or "Edinburgh Whisky Society" |
| **Roost** | A specific gathering organised by a Flock - a time, a place, and a plan |

You join a **Flock** (the community). You attend a **Roost** (the event). You see the same faces across multiple Roosts and make genuine friends.

---

## Demo Login

| Field    | Value    |
|----------|----------|
| Username | `nish`   |
| Password | `mandal` |

Nish Mandal · DOB 02/02/2000 · London
Pre-joined: Arsenal Supporters Club London (FL001) + London Foodies (FL004) + Nintendo Collective London (FL024)
Pre-attending: Arsenal vs Spurs Roost + Brick Lane Street Food Tour Roost + Mario Kart Grand Prix Night Roost + Nintendo Direct Watch Party Roost

---

## Code Documentation

📄 **[explanation-of-code.md](explanation-of-code.md)**

---

## Getting a Live URL

### GitHub Pages (free)
1. Create a free account at **[github.com](https://github.com)**
2. Create a new repository called `flock-alt` (set to **Public**)
3. Upload all files from this folder
4. Go to **Settings → Pages → Source → main branch → Save**
5. Live at: `https://yourusername.github.io/flock-alt`

### Netlify (free, easier)
1. Go to **[netlify.com](https://netlify.com)** and sign up
2. Drag and drop the entire `flock_alt` folder onto the deploy area
3. Instantly live

> Geolocation ("Use my location") requires HTTPS - both GitHub Pages and Netlify provide this automatically.

---

## Installing as an iPhone App (PWA)

Open the live URL in **Safari on iPhone**:
1. Tap the **Share** button
2. Tap **"Add to Home Screen"**
3. Tap **"Add"**

Opens full screen, works offline once cached.

---

## Pages

| File | Description |
|------|-------------|
| `index.html` | Entry point - routes to `home.html` if signed in, `login.html` if not |
| `login.html` | Login |
| `signup.html` | Sign up - first name, last name, username, password |
| `onboarding.html` | 4-step setup: name/DOB/avatar - interests - suggested Flocks - preferences |
| `home.html` | Browse Roosts (primary discovery) |
| `flocks.html` | Browse Flocks (groups) (individual gatherings across all Flocks) |
| `event.html` | Flock detail - group info + list of Roosts with maps and attend buttons |
| `my-flocks.html` | Flocks you've joined |
| `my-roosts.html` | Roosts you're attending |
| `profile.html` | Profile - edit name/DOB/avatar, city, interests, looking to meet |
| `about.html` | About Flock - explains Flocks, Roosts, and how it all works |
| `checkout-info/overview/complete.html` | 3-step checkout for paid Roosts |

---

## Features

**Flocks (Groups)**
- 23 Flocks across 10 UK cities: London, Manchester, Birmingham, Edinburgh, Bristol, Leeds, Liverpool, Glasgow, Cardiff, Newcastle
- Each Flock has a name, category, member count, description and 2-3 upcoming Roosts
- Join/leave a Flock - member count updates live
- Browse by city and category
- Sort by: Most members, Next Roost, A-Z

**Roosts (Gatherings)**
- Browse all upcoming Roosts across all Flocks
- Each Roost has date, time, venue, going count, spots left, price
- Interactive Leaflet/OpenStreetMap map on every Roost
- "Get Directions" button deep-links to Google Maps
- Attend/cancel a Roost (must be a Flock member first)
- Going count increments when you attend, decrements when you cancel
- Paid Roosts go through a 3-step checkout

**My Flocks / My Roosts**
- My Flocks: shows joined groups with next Roost and attendance status
- My Roosts: shows specific Roosts you've committed to, split upcoming/past

**Onboarding (4 steps)**
- Name, date of birth, avatar picker
- Interest selection (19 interests)
- **Suggested Flocks** - interest-matched groups shown with join/skip option
- City, distance, who you want to meet

**Profile**
- Age auto-calculated from DOB
- City, looking to meet editable inline
- All 19 interests toggleable inline
- Edit name/DOB/avatar via bottom-sheet modal

**Location**
- "Use my location" button - finds nearest city, calculates real distances

**Technical**
- 100% static - no backend, no API keys
- All state in localStorage
- PWA: installable, offline-capable (service worker `flock-alt-v7`)
- Responsive: fixed bottom nav on mobile, sticky sidebar on desktop

---

## Navigation

| Nav item | Mobile | Desktop | Page |
|----------|--------|---------|------|
| 🪺 Roosts | ✓ | ✓ | `home.html` - browse Roosts |
| 🐦 Flocks | ✓ | ✓ | `flocks.html` - browse Flocks |
| ❤ My Flocks | ✓ | ✓ | `my-flocks.html` - joined groups |
| ☰ My Roosts | ✓ | ✓ | `my-roosts.html` - attending gatherings |
| 👤 Profile | ✓ | ✓ | `profile.html` |
| ℹ About | - | ✓ | `about.html` |
| 💬 Chats | - | ✓ | Coming soon popup |

---

## File Structure

```
flock_alt/
├── index.html
├── login.html / signup.html / onboarding.html
├── home.html              - Browse Roosts (primary)
├── flocks.html            - Browse Flocks
├── event.html             - Flock detail + Roosts
├── my-flocks.html         - My Flocks
├── my-roosts.html         - My Roosts
├── profile.html
├── about.html
├── checkout-info/overview/complete.html
├── manifest.json          - PWA config
├── sw.js                  - Service worker (flock-alt-v7)
├── css/styles.css
└── js/
    ├── data.js            - 23 Flocks with Roosts, INTERESTS, CITIES
    ├── state.js           - localStorage state (Flock object)
    ├── desktop-sidebar.js - Sidebar injector
    └── pages/
        ├── login.js / signup.js / onboarding.js
        ├── home.js        - Browse Flocks
        ├── roosts.js      - Browse Roosts
        ├── event.js       - Flock detail + Roost cards
        ├── my-flocks.js   - Joined groups
        ├── my-roosts.js   - Attended Roosts
        └── profile.js / about.js / checkout-*.js
```

---

*Flock - proof of concept. No backend. No API keys. Just a Flock and a Roost.*
