# Flock 🐦

**Make friends through shared events.**

A mobile-first web app that matches you with local events based on your interests — watch football, play board games, go hiking, explore new restaurants — and make genuine friends along the way.

---

## Code Documentation

For a detailed walkthrough of every file, class, method and data structure, see:

📄 **[explanation-of-code.md](explanation-of-code.md)**

---

## Login Credentials

| Field    | Value    |
|----------|----------|
| Username | `nish`   |
| Password | `mandal` |

---

## Getting a Live URL

### Option 1 — GitHub Pages (free)

1. Create a free account at **[github.com](https://github.com)**
2. Create a new repository called `flock` (set to **Public**)
3. Upload all the files from this folder
4. Go to **Settings → Pages → Source → select `main` branch → Save**
5. Your URL will be: `https://yourusername.github.io/flock`

### Option 2 — Netlify (also free, even easier)

1. Go to **[netlify.com](https://netlify.com)** and create a free account
2. On your dashboard, drag and drop the entire `flock` folder onto the deploy area
3. Netlify gives you a live URL like `https://flock-abc123.netlify.app`

---

## Installing as a Native-Feel iPhone App

Once you have a live URL, open it in **Safari on your iPhone**, then:

1. Tap the **Share** button (box with arrow at the bottom)
2. Scroll down and tap **"Add to Home Screen"**
3. Tap **"Add"** in the top right

Flock will now live on your home screen and open **full screen with no browser chrome**, exactly like a native app. It also works offline once loaded.

---

## Pages

| File | Description |
|------|-------------|
| `index.html` | Entry point — routes to `home.html` if signed in, otherwise `login.html` |
| `login.html` | Login page |
| `signup.html` | Sign up (proof of concept — no server) |
| `onboarding.html` | 3-step setup: name/age → interests → city/preferences |
| `home.html` | Events feed with filters |
| `event.html` | Event detail with Join/Leave |
| `my-events.html` | Events you've joined |
| `profile.html` | Your profile, interests and preferences |
| `checkout-info.html` | Checkout step 1 — personal & card details |
| `checkout-overview.html` | Checkout step 2 — order review |
| `checkout-complete.html` | Checkout step 3 — confirmation |
| `about.html` | About Flock |

---

## Features

- **34 events** across London, Manchester, Birmingham, Edinburgh, Bristol, Leeds and Liverpool
- Dates always within the next 1–10 days (generated dynamically — never stale)
- Filter by city, distance and category
- Category tabs: Sports, Food & Drink, Gaming, Fitness, Social, Wellness, Outdoors, Music, Arts
- Join and leave events — tracked across all pages
- 3-step onboarding: name, age, interests, city and preferences
- Profile page shows your stats and interests with correct emojis
- Responsive: mobile bottom nav + desktop sidebar — both always visible
- Fully offline-capable once cached (service worker)
- Installable as a PWA on iOS and Android

---

## File Structure

```
flock/
├── index.html                 ← Entry point / auth router
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
├── manifest.json              ← PWA install config (start_url: index.html)
├── sw.js                      ← Service worker (cache: flock-v4)
├── css/
│   └── styles.css
├── js/
│   ├── data.js                ← Events data + d(n) date helper
│   ├── state.js               ← localStorage helpers (Flock object)
│   ├── desktop-sidebar.js     ← Injects sidebar on screens ≥ 768px
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
    ├── apple-touch-icon.png
    ├── icon-192.png
    └── icon-512.png
```

---

*Flock — proof of concept*
