# Flock Alt - Code Explanation

A full technical walkthrough of the flock_alt codebase. This version redesigns the core concept: a **Flock** is a group, a **Roost** is a specific gathering within that group.

---

## Core Concepts

| Term | Code reference | Description |
|------|---------------|-------------|
| **Flock** | `FLOCKS` array, `FL001`...`FL023` | A persistent group of like-minded people in a city |
| **Roost** | `fl.roosts[]`, `M1`...`M3` | A specific gathering organised by a Flock |
| **Member** | `flock_my_flocks` in localStorage | A user who has joined a Flock |
| **Attending** | `flock_roost_attendance` in localStorage | A member who has committed to a specific Roost |

A user joins a Flock once. They then individually mark which Roosts within that Flock they will attend. Leaving a Flock removes them from all its Roosts automatically.

---

## File Structure

```
flock_alt/
├── home.html + js/pages/home.js         - Browse Flocks
├── roosts.html + js/pages/roosts.js     - Browse all Roosts
├── event.html + js/pages/event.js       - Flock detail + Roost list
├── my-flocks.html + js/pages/my-flocks.js  - Joined Flocks
├── my-roosts.html + js/pages/my-roosts.js  - Attending Roosts
├── onboarding.html + js/pages/onboarding.js - 4-step setup
├── js/data.js      - All Flock/Roost data
├── js/state.js     - localStorage state management
└── js/desktop-sidebar.js - Desktop sidebar injector
```

---

## Data Structure

### `FLOCKS` array in `data.js`

```javascript
{
  id:       'FL001',
  name:     'Arsenal Supporters Club London',
  cat:      'Sports',
  interests: ['Football'],
  city:     'London',
  e:        '⚽',               // emoji for cards and map pins
  members:  84,                 // base member count
  desc:     '...',
  tags:     ['Football','Arsenal','Sports'],
  ages:     '18+',
  ft:       'Both',             // 'Both', 'Girls', 'Boys'
  lat:      51.5550,            // Flock centre (for location matching)
  lng:      -0.1086,
  roosts: [                     // array of upcoming Roosts
    {
      id:     'M1',
      title:  'Arsenal vs Spurs - North London Derby',
      venue:  'The Tollington',
      addr:   '74 Tollington Rd, London N7',
      date:   d(1),             // always upcoming via d(n) helper
      time:   '13:30',
      dur:    '2.5 hrs',
      price:  'Free',           // 'Free' or '£X'
      going:  38,               // base going count
      max:    60,               // capacity
      lat:    51.5561,
      lng:    -0.1127,
    }
  ]
}
```

Each Flock has 2-3 Roosts. IDs are `FL001`-`FL023` for Flocks, `M1`-`M3` for Roosts within each Flock.

---

## State Management - `js/state.js`

All state in localStorage. The global `Flock` object manages everything.

### Flock membership

```javascript
Flock.getMyFlocks()          // ['FL001', 'FL004']
Flock.joinFlock('FL001')     // adds to flock_my_flocks
Flock.leaveFlock('FL001')    // removes from flock_my_flocks AND clears all roost_attendance for this Flock
Flock.isFlockMember('FL001') // true/false
```

Key: `flock_my_flocks` - JSON array of Flock IDs.

### Roost attendance

```javascript
Flock.attendRoost('FL001', 'M1')    // marks attending
Flock.unattendRoost('FL001', 'M1')  // cancels attendance
Flock.isAttending('FL001', 'M1')    // true/false
Flock.getLiveGoing('FL001', 'M1', 38) // 38 + 1 if attending = 39
```

Key: `flock_roost_attendance` - JSON object, keys are `FL001_M1` format.

```javascript
{ 'FL001_M1': true, 'FL004_M1': true }
```

`getLiveGoing(flockId, roostId, base)` returns `base + (isAttending ? 1 : 0)`.
The `+ 1` is only added when the current user is attending - no separate delta needed.

### Demo user seed

```javascript
Flock.seedNish() // called on every nish/mandal login
```

Seeds: profile (Nish Mandal, DOB 2000-02-02), interests, prefs (London).
Pre-joins: FL001 (Arsenal Supporters) + FL004 (London Foodies) + FL024 (Nintendo Collective London).
Pre-attends: FL001_M1 (Arsenal vs Spurs) + FL004_M1 (Brick Lane Street Food Tour) + FL024_M1 (Mario Kart Grand Prix Night) + FL025_M1 (Nintendo Direct Watch Party).

Seed only runs once (guarded by `flock_nish_seeded` flag) so user's subsequent changes persist.

---

## Pages

### `home.js` - Browse Flocks

Renders Flock group cards. Each card shows:
- Group name, emoji, category badge
- Member count, next Roost date and venue
- "✓ Member" badge if already joined

Filters: city dropdown, category chips (All/Sports/Gaming etc), sort (Most members / Next Roost / A-Z), search (matches name, description, tags).

No distance filter - Flocks are city-level communities, not distance-based.

### `roosts.js` - Browse Roosts

Flattens all Roosts from all Flocks in the selected city into a single list. Each card shows:
- Roost title, parent Flock name
- Date, time, venue, going count, spots left, price
- "✓ Going" badge if attending

Clicking any card goes to `event.html?id=FL001` (the parent Flock detail page) where you can join the Flock and attend the Roost.

Filters: city, category chips, sort (Soonest / Most popular / Spots left), search.

### `event.js` - Flock Detail

Reads `?id=FL001` from URL. Renders:

**Top section (group info):**
- Coloured hero with emoji + back button
- Group name, city, member count (live: base + 1 if member), category, open to
- Description and tags
- Join/Leave Flock CTA button (sticky at bottom)

**Roost cards** (one per Roost in `fl.roosts`):

```javascript
function roostCard(roost, index, isMember)
```

Each card has:
- Coloured header strip with title and price pill
- Date, time, duration meta row
- Venue + going count / spots left row
- Leaflet map (170px tall, custom emoji pin, scroll wheel disabled)
- Get Directions link (deep-links to Google Maps)
- Attend/cancel button (disabled if not a member - shows "Join Flock to attend")

**Button states:**

| State | Button |
|-------|--------|
| Not a member | "Join Flock to attend" (locked, grey) |
| Member, not attending, free | "Attend this Roost" (orange) |
| Member, not attending, paid | "Pay £X & Attend" (orange) |
| Member, attending | "✓ Going - tap to cancel" (soft green) |
| Full | "Full" (grey, disabled) |

**Maps:**
Leaflet + OpenStreetMap, one map per Roost. Maps are destroyed and re-created on re-render (join/leave/attend) to prevent duplicate instances. Stored in `_maps` object keyed by Roost ID.

### `my-flocks.js` - My Flocks

Lists joined Flocks. For each:
- Flock name, emoji, member count (+1 for self), upcoming Roost count
- Next Roost title, date, time, venue
- "✓ Going" indicator if attending the next Roost

### `my-roosts.js` - My Roosts

Collects all Roosts across all Flocks that `Flock.isAttending()` returns true for. Splits into:
- Upcoming (date >= today, sorted soonest first)
- Past (date < today, sorted most recent first)

Each card shows Roost title, parent Flock name, date, time, venue.

### `onboarding.js` - 4-Step Setup

**Step 1:** First name, last name, DOB (native date picker), avatar (12 emoji options). Pre-fills from signup data.

**Step 2:** Interest chips (19 options). Minimum 1 required.

**Step 3 - Suggested Flocks (new):**
- Filters `FLOCKS` by user's city (from saved prefs) and selected interests
- Shows up to 6 matching Flocks as tappable cards
- Each card: emoji, name, member count, category, join toggle
- "Skip for now" button visible only on this step
- On Continue: calls `Flock.joinFlock(id)` for each selected Flock before advancing
- If no interest-matched Flocks found, falls back to showing popular Flocks

**Step 4:** City dropdown, distance chips (5/10/25/50/Any miles), "looking to meet" chips (Girls/Boys/Both). Saves to `flock_prefs`.

---

## CSS - Key New Classes

### Roost cards
```css
.roost-card          /* card container with border + shadow */
.roost-header        /* coloured strip with title + price pill */
.roost-title         /* 15px bold, flex:1 */
.roost-price         /* orange pill; .free = green */
.roost-body          /* padding: 0 16px 14px */
.roost-meta          /* flex row of metadata items */
.roost-attend-btn    /* full-width CTA */
.roost-attend-btn.attending  /* soft green "✓ Going" state */
.roost-attend-btn.locked     /* grey, cursor:default */
.roost-attend-btn.full       /* grey, cursor:default */
```

### Onboarding Flock suggestion cards
```css
.ob-flock-card       /* tappable Flock card in onboarding step 3 */
.ob-flock-card.joined /* highlighted when selected */
.ob-flock-emoji      /* 40x40 rounded square with category colour */
.ob-flock-join       /* pill button; .joined = orange */
```

---

## Navigation

5 items in mobile bottom nav, 7 in desktop sidebar:

| ID | href | data-page | Label |
|----|------|-----------|-------|
| `nav-flocks` | `home.html` | `home` | Flocks |
| `nav-roosts` | `roosts.html` | `roosts` | Roosts |
| `nav-my-flocks` | `my-flocks.html` | `my-flocks` | My Flocks |
| `nav-my-roosts` | `my-roosts.html` | `my-roosts` | My Roosts |
| `nav-profile` | `profile.html` | `profile` | Profile |
| `nav-about` | `about.html` | `about` | About (sidebar only) |
| `sidebar-nav-chats` | button | - | Chats (sidebar only) |

Active page detection in `desktop-sidebar.js`:
```javascript
const pageMap = { 'event.html': 'home.html' };
const effectivePage = pageMap[page] || page;
```
So viewing a Flock detail (`event.html`) highlights "Flocks" in the sidebar.

---

## Service Worker

Cache: `flock-alt-v7`. Cache-first strategy. Caches all HTML, CSS, JS, manifest.

To deploy updates: bump `CACHE` to `flock-alt-v8`.

---

## Test Automation - Key Selectors

| Element | Selector |
|---------|----------|
| Flock cards (home) | `[id^="event-card-FL"]` |
| Roost cards | `#roost-M1`, `#roost-M2` etc |
| Join Flock button | `.btn.btn-pr` (when not member) |
| Leave Flock button | `.btn.btn-join` (when member) |
| Attend Roost button | `.roost-attend-btn` (not attending) |
| Cancel Roost button | `.roost-attend-btn.attending` |
| Flock container | `#my-flocks-container` |
| Roost container | `#my-roosts-container` |
| Onboarding Flock cards | `.ob-flock-card` |
| Onboarding skip | `#skip-btn` (visible on step 3 only) |
| Progress bars | `#prog-1` through `#prog-4` |

---

## Data Flow

```
1. User signs up → onboarding
   Step 1: name/DOB/avatar saved to flock_profile
   Step 2: interests saved to flock_interests
   Step 3: suggested Flocks shown - user joins 0-6
           joinFlock() called for each → flock_my_flocks updated
   Step 4: prefs saved → redirect to home.html

2. Browse Flocks (home.html)
   - FLOCKS filtered by city + category + search
   - Cards show member count and next Roost date

3. Click Flock card → event.html?id=FL001
   - Group info rendered
   - Each Roost rendered as roostCard()
   - Join Flock button in sticky CTA

4. Join Flock
   - Flock.joinFlock('FL001')
   - flock_my_flocks: ['FL001']
   - Member count: 84 + 1 = 85
   - Roost attend buttons unlock

5. Attend a Roost
   - Free: Flock.attendRoost('FL001','M1')
     flock_roost_attendance: { 'FL001_M1': true }
     liveGoing: 38 + 1 = 39, spotsLeft: 60 - 39 = 21
   - Paid: setCheckoutEvent('FL001_M1') → checkout flow
     completeCheckout() splits key → joinFlock() + attendRoost()

6. My Flocks (my-flocks.html)
   - getMyFlocks() → ['FL001']
   - Shows FL001 with next Roost and attending status

7. My Roosts (my-roosts.html)
   - Scans all FLOCKS, all roosts, checks isAttending()
   - Shows M1 of FL001 as upcoming Roost

8. Leave Flock
   - Flock.leaveFlock('FL001')
   - Removes from flock_my_flocks
   - Clears all FL001_* keys from flock_roost_attendance
   - Member count returns to 84, attend buttons lock
```

---

## Messaging (Coming Soon)

Both Flock-level and Roost-level messaging buttons are present in the UI but show a "coming soon" popup when tapped.

### Flock messaging
Available in the sticky CTA on the Flock detail page (`event.html`) when the user is a member. Button: "💬 Message the Flock". Intended for general group chat between all Flock members.

### Roost messaging
Available on each Roost card within the Flock detail page, also only when a member. Button: "💬 Chat with this Roost". Intended for coordinating attendance at a specific Roost - meetup spots, plans, hype.

### Implementation
Both call `showMsgPopup(type)` in `event.js` where `type` is `'flock'` or `'roost'`. The popup explains what the feature will do and shows a "Coming soon" notice. Backdrop click closes it.

When messaging is built, replace `showMsgPopup()` with a real chat interface. The two-level model (Flock chat + per-Roost chat) maps naturally to group channels and event threads.
