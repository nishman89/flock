# Flock 🐦

**Make friends through shared events.**

A mobile-first web app that matches you with local events based on your interests  -  watch football, play board games, go hiking, explore new restaurants  -  and make genuine friends along the way.



## Code Documentation

For a detailed walkthrough of every file, class, method and data structure, see:

📄 **[explanation-of-code.md](explanation-of-code.md)**

It covers:
- What every HTML page does
- The full `Flock` state object API
- How the CSS responsive strategy works
- The data structure for events and interests
- The end-to-end data flow from login through to checkout
- The PWA setup (manifest, service worker, iOS meta tags)
- The `id` attribute naming convention for test automation

## Login Credentials

| Field    | Value    |
|----------|----------|
| Username | `nish`   |
| Password | `mandal`|


## Getting a Live URL (so you can open it on your iPhone)

### Option 1  -  Netlify (easiest, free, 30 seconds)

1. Go to **[netlify.com](https://netlify.com)** and create a free account
2. On your dashboard, scroll to the bottom  -  you'll see **"Deploy manually"**
3. Drag and drop the entire **`flock`** folder onto that area
4. Netlify gives you a live URL like `https://flock-abc123.netlify.app`
5. Open that URL in **Safari on your iPhone**  -  done!

### Option 2  -  GitHub Pages (free)

1. Create a free account at **[github.com](https://github.com)**
2. Create a new repository called `flock`
3. Upload all the files from this folder
4. Go to Settings → Pages → Source → select `main` branch → Save
5. Your URL will be `https://yourusername.github.io/flock`


## Making It Look Like a Native iPhone App

Once you have a live URL, open it in **Safari on your iPhone**, then:

1. Tap the **Share** button (the box with an arrow at the bottom)
2. Scroll down and tap **"Add to Home Screen"**
3. Tap **"Add"** in the top right
4. Flock now lives on your home screen  -  tap it and it opens **full screen with no browser chrome**, exactly like a native app

The app already handles:
- Full-screen mode (hides Safari address bar and toolbar)
- iPhone notch / Dynamic Island safe areas
- Home indicator safe area (bottom of screen)
- Orange status bar colour matching the app
- Offline caching (works without internet once loaded)
- App icon on home screen


## Pages

| File | Description |
|------|-------------|
| `login.html` | Login page |
| `signup.html` | Sign up (POC  -  not implemented) |
| `onboarding.html` | 3-step setup: name/age → interests → city/preferences |
| `home.html` | Events feed with city, distance and category filters |
| `event.html` | Event detail with Join/Leave |
| `my-events.html` | Events you've joined |
| `profile.html` | Your profile, interests and preferences |


## Features

- **18 events** across London, Manchester, Birmingham, Edinburgh, Bristol, Leeds and Liverpool
- Filter by city, distance (5–50 miles or any) and category
- Category tabs: Sports, Food & Drink, Gaming, Fitness, Social, Wellness, Outdoors, Music, Arts
- Join and leave events  -  tracked across all pages
- 3-step onboarding collects name, age, interests, city and preferences
- Profile page shows your stats and interests
- Fully offline-capable once cached


## File Structure

```
flock/
├── login.html
├── signup.html
├── onboarding.html
├── home.html
├── event.html
├── my-events.html
├── profile.html
├── manifest.json          ← PWA install config
├── sw.js                  ← Service worker (offline caching)
├── css/
│   └── styles.css
├── js/
│   ├── state.js           ← localStorage helpers
│   └── data.js            ← Events and interests data
└── images/
    ├── apple-touch-icon.png  ← iPhone home screen icon
    ├── icon-192.png
    └── icon-512.png
```


*Flock  -  proof of concept*
