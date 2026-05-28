'use strict';

const EV_COLS = {
  'Sports':       '#166534',
  'Gaming':       '#4C1D95',
  'Social':       '#831843',
  'Fitness':      '#1E3A5F',
  'Food & Drink': '#78350F',
  'Wellness':     '#065F46',
  'Music':        '#3B0764',
  'Outdoors':     '#365314',
  'Arts':         '#0C4A6E',
};

const INTERESTS = [
  {e:'⚽',label:'Football'},{e:'🏉',label:'Rugby'},
  {e:'🏎️',label:'Formula 1'},{e:'🏋️',label:'Gym & Fitness'},
  {e:'🏃',label:'Running'},{e:'🧘',label:'Yoga & Wellness'},
  {e:'🥾',label:'Hiking & Outdoors'},{e:'🍛',label:'Food & Dining'},
  {e:'☕',label:'Coffee & Cafes'},{e:'🍺',label:'Pub & Social'},
  {e:'🎮',label:'Video Games'},{e:'🃏',label:'Board Games'},
  {e:'🛍️',label:'Shopping'},{e:'🎵',label:'Live Music'},
  {e:'🎬',label:'Cinema'},{e:'📚',label:'Book Club'},
  {e:'🎨',label:'Arts & Culture'},{e:'🏊',label:'Swimming'},
  {e:'💃',label:'Dancing'},
];

const CITIES = ['London','Manchester','Birmingham','Edinburgh','Bristol','Leeds','Liverpool','Glasgow','Cardiff','Newcastle'];

function d(n) {
  const dt = new Date();
  dt.setDate(dt.getDate() + n);
  return dt.toISOString().slice(0, 10);
}

// A Flock is a group. Each group has members and a list of upcoming Roosts.
const FLOCKS = [

  // ── London ────────────────────────────────────────────────
  {
    id:'FL001', name:'Arsenal Supporters Club London', cat:'Sports',
    interests:['Football'], city:'London', e:'⚽', members:84,
    desc:'The go-to group for Gunners fans in London. We watch every match together, debate every transfer and celebrate every win. Come as a stranger, leave as a mate.',
    tags:['Football','Arsenal','Sports'], ages:'18+', ft:'Both',
    lat:51.5550, lng:-0.1086,
    roosts:[
      {id:'M1', title:'Arsenal vs Spurs - North London Derby', venue:'The Tollington', addr:'74 Tollington Rd, London N7', date:d(1), time:'13:30', dur:'2.5 hrs', price:'Free', going:38, max:60, lat:51.5561, lng:-0.1127},
      {id:'M2', title:'Champions League Watch Party', venue:'The Gunners', addr:'145 Blackstock Rd, London N4', date:d(7), time:'20:00', dur:'2 hrs', price:'Free', going:24, max:50, lat:51.5584, lng:-0.1053},
      {id:'M3', title:'Pre-season Prediction Night', venue:'The Tollington', addr:'74 Tollington Rd, London N7', date:d(14), time:'19:00', dur:'2 hrs', price:'Free', going:15, max:40, lat:51.5561, lng:-0.1127},
    ]
  },
  {
    id:'FL002', name:'London Board Gamers', cat:'Gaming',
    interests:['Board Games'], city:'London', e:'🃏', members:52,
    desc:'From Catan to Twilight Imperium, we play it all. Friendly group welcoming all levels - first-timers and veterans alike. Games are provided but bring your own if you have a favourite.',
    tags:['Board Games','Gaming','Social'], ages:'All ages', ft:'Both',
    lat:51.5131, lng:-0.1394,
    roosts:[
      {id:'M1', title:'Weekly Games Night', venue:'Draughts Bar Hackney', addr:'337 Acton Mews, London E8', date:d(2), time:'18:30', dur:'3 hrs', price:'£5', going:12, max:20, lat:51.5395, lng:-0.0574},
      {id:'M2', title:'Mega Session - Twilight Imperium', venue:'Draughts Bar Hackney', addr:'337 Acton Mews, London E8', date:d(9), time:'12:00', dur:'8 hrs', price:'£8', going:7, max:8, lat:51.5395, lng:-0.0574},
    ]
  },
  {
    id:'FL003', name:'East London Runners', cat:'Fitness',
    interests:['Running','Gym & Fitness'], city:'London', e:'🏃', members:63,
    desc:'A welcoming running group for all paces. We run together, no one gets left behind. Coffee afterwards is mandatory. Weekly 5K and occasional longer Sunday runs.',
    tags:['Running','Fitness','Outdoors'], ages:'All ages', ft:'Both',
    lat:51.5361, lng:-0.0434,
    roosts:[
      {id:'M1', title:'Wednesday 5K - Victoria Park', venue:'Victoria Park', addr:'Grove Rd, London E3', date:d(3), time:'07:00', dur:'1 hr', price:'Free', going:22, max:35, lat:51.5361, lng:-0.0434},
      {id:'M2', title:'Sunday Long Run - 10 Miles', venue:'Victoria Park', addr:'Grove Rd, London E3', date:d(6), time:'08:00', dur:'2 hrs', price:'Free', going:14, max:25, lat:51.5361, lng:-0.0434},
      {id:'M3', title:'Parkrun Social', venue:'Mile End Park', addr:'Grove Rd, London E3', date:d(10), time:'09:00', dur:'1 hr', price:'Free', going:18, max:40, lat:51.5199, lng:-0.0351},
    ]
  },
  {
    id:'FL004', name:'London Foodies', cat:'Food & Drink',
    interests:['Food & Dining'], city:'London', e:'🍛', members:97,
    desc:'We eat our way around London one neighbourhood at a time. Street food markets, hidden gems, Michelin stars - we do it all. New members always welcome.',
    tags:['Food','Social','London'], ages:'All ages', ft:'Both',
    lat:51.5217, lng:-0.0724,
    roosts:[
      {id:'M1', title:'Brick Lane Street Food Tour', venue:'Brick Lane', addr:'Brick Lane, London E1', date:d(4), time:'18:30', dur:'3 hrs', price:'Free', going:20, max:25, lat:51.5217, lng:-0.0724},
      {id:'M2', title:'Borough Market Morning', venue:'Borough Market', addr:'8 Southwark St, London SE1', date:d(8), time:'10:00', dur:'2.5 hrs', price:'Free', going:16, max:20, lat:51.5054, lng:-0.0910},
    ]
  },
  {
    id:'FL005', name:'London Hikers', cat:'Outdoors',
    interests:['Hiking & Outdoors'], city:'London', e:'🥾', members:44,
    desc:'Day hikes, evening walks, and weekend escapes from the city. We explore the North Downs, South Downs, Chilterns and beyond. All fitness levels, just good boots required.',
    tags:['Hiking','Nature','Outdoors'], ages:'All ages', ft:'Both',
    lat:51.4800, lng:-0.3100,
    roosts:[
      {id:'M1', title:'Box Hill Circular Walk', venue:'Box Hill & Westhumble Station', addr:'Station Rd, Westhumble RH5', date:d(5), time:'09:30', dur:'4 hrs', price:'Free', going:15, max:22, lat:51.2485, lng:-0.3110},
      {id:'M2', title:'Hampstead Heath Evening Walk', venue:'Hampstead Heath', addr:'East Heath Rd, London NW3', date:d(3), time:'18:00', dur:'2 hrs', price:'Free', going:19, max:30, lat:51.5608, lng:-0.1632},
    ]
  },

  // ── Manchester ────────────────────────────────────────────
  {
    id:'FL006', name:'Manchester City Supporters', cat:'Sports',
    interests:['Football'], city:'Manchester', e:'🔵', members:71,
    desc:'Blues through and through. We watch every City game together, home and away. Premiership, Champions League, cups - we never miss a kick.',
    tags:['Football','Man City','Sports'], ages:'18+', ft:'Both',
    lat:53.4831, lng:-2.2004,
    roosts:[
      {id:'M1', title:'Derby Day - City vs United', venue:'The Printworks', addr:'27 Withy Grove, Manchester M4', date:d(2), time:'16:30', dur:'2.5 hrs', price:'Free', going:48, max:80, lat:53.4842, lng:-2.2384},
      {id:'M2', title:'Champions League Night', venue:'The Footage', addr:'37 Withy Grove, Manchester M4', date:d(8), time:'20:00', dur:'2 hrs', price:'Free', going:30, max:60, lat:53.4840, lng:-2.2370},
    ]
  },
  {
    id:'FL007', name:'Northern Quarter Social Club', cat:'Social',
    interests:['Pub & Social'], city:'Manchester', e:'🍺', members:58,
    desc:'Weekly socials in Manchester\'s coolest neighbourhood. Pub crawls, quiz nights, rooftop bars - always a good time, always a different venue. Solo joiners especially welcome.',
    tags:['Social','Pub','Manchester'], ages:'18+', ft:'Both',
    lat:53.4841, lng:-2.2319,
    roosts:[
      {id:'M1', title:'Thursday Quiz Night', venue:'The Refuge', addr:'Oxford St, Manchester M60', date:d(4), time:'19:30', dur:'2 hrs', price:'£3', going:20, max:40, lat:53.4776, lng:-2.2373},
      {id:'M2', title:'Saturday Pub Crawl', venue:'Elnecot', addr:'41 Blossom St, Manchester M4', date:d(6), time:'18:00', dur:'4 hrs', price:'Free', going:18, max:30, lat:53.4851, lng:-2.2285},
      {id:'M3', title:'Vinyl Record Sunday', venue:'Vinyl Exchange', addr:'18 Market St, Manchester M1', date:d(10), time:'11:00', dur:'3 hrs', price:'Free', going:12, max:25, lat:53.4808, lng:-2.2374},
    ]
  },

  // ── Birmingham ────────────────────────────────────────────
  {
    id:'FL008', name:'Brum Fitness Crew', cat:'Fitness',
    interests:['Gym & Fitness','Running'], city:'Birmingham', e:'🏋️', members:39,
    desc:'Group workouts, park runs and gym sessions for all fitness levels. We motivate each other, celebrate progress and grab a shake afterwards. No judgement, just gains.',
    tags:['Fitness','Gym','Health'], ages:'All ages', ft:'Both',
    lat:53.4808, lng:-2.2426,
    roosts:[
      {id:'M1', title:'Cannon Hill Park Run', venue:'Cannon Hill Park', addr:'Russell Rd, Birmingham B13', date:d(1), time:'09:00', dur:'1 hr', price:'Free', going:16, max:30, lat:52.4502, lng:-1.9007},
      {id:'M2', title:'Group Gym Session', venue:'PureGym Birmingham', addr:'Corporation St, Birmingham B2', date:d(5), time:'18:00', dur:'1.5 hrs', price:'£6', going:8, max:12, lat:52.4797, lng:-1.8967},
    ]
  },
  {
    id:'FL009', name:'Birmingham Foodies', cat:'Food & Drink',
    interests:['Food & Dining'], city:'Birmingham', e:'🍜', members:46,
    desc:'Brum has one of the best food scenes in the UK and we are determined to eat all of it. Balti Triangle tours, Digbeth street food, fine dining - all welcome.',
    tags:['Food','Birmingham','Social'], ages:'All ages', ft:'Both',
    lat:52.4756, lng:-1.9106,
    roosts:[
      {id:'M1', title:'Balti Triangle Food Tour', venue:'Ladypool Rd', addr:'Ladypool Rd, Birmingham B12', date:d(3), time:'18:30', dur:'3 hrs', price:'Free', going:14, max:20, lat:52.4629, lng:-1.8875},
      {id:'M2', title:'Digbeth Street Food Night', venue:'Digbeth Dining Club', addr:'152 Fazeley St, Birmingham B5', date:d(9), time:'17:00', dur:'3 hrs', price:'Free', going:20, max:35, lat:52.4747, lng:-1.8851},
    ]
  },

  // ── Edinburgh ─────────────────────────────────────────────
  {
    id:'FL010', name:'Edinburgh Whisky Society', cat:'Food & Drink',
    interests:['Food & Dining','Pub & Social'], city:'Edinburgh', e:'🥃', members:33,
    desc:'Monthly tastings, distillery visits and everything in between for whisky lovers. Beginners and connoisseurs equally welcome - no snobbery, just a love of good dram.',
    tags:['Whisky','Tasting','Culture'], ages:'18+', ft:'Both',
    lat:55.9495, lng:-3.1934,
    roosts:[
      {id:'M1', title:'Monthly Tasting - Highland Malts', venue:'The Scotch Whisky Experience', addr:'354 Castlehill, Edinburgh EH1', date:d(5), time:'19:30', dur:'2 hrs', price:'£18', going:14, max:20, lat:55.9495, lng:-3.1934},
      {id:'M2', title:'Pub Crawl - Old Town Whisky Bars', venue:'The Royal Mile Tavern', addr:'127 High St, Edinburgh EH1', date:d(12), time:'18:00', dur:'3 hrs', price:'Free', going:18, max:30, lat:55.9503, lng:-3.1883},
    ]
  },
  {
    id:'FL011', name:'Edinburgh Outdoor Adventurers', cat:'Outdoors',
    interests:['Hiking & Outdoors'], city:'Edinburgh', e:'🏔️', members:55,
    desc:'Hikes, scrambles and wild swims across Scotland\'s stunning landscape. From Arthur\'s Seat to the Cairngorms, we explore it all. Beginners and experienced hikers welcome.',
    tags:['Hiking','Nature','Scotland'], ages:'All ages', ft:'Both',
    lat:55.9439, lng:-3.1760,
    roosts:[
      {id:'M1', title:'Arthur\'s Seat Morning Hike', venue:'Holyrood Park', addr:'Queen\'s Dr, Edinburgh EH8', date:d(1), time:'09:00', dur:'2.5 hrs', price:'Free', going:16, max:25, lat:55.9445, lng:-3.1637},
      {id:'M2', title:'Meadows Frisbee & Picnic', venue:'The Meadows', addr:'Melville Dr, Edinburgh EH9', date:d(4), time:'13:00', dur:'2 hrs', price:'Free', going:14, max:30, lat:55.9374, lng:-3.1875},
    ]
  },

  // ── Bristol ───────────────────────────────────────────────
  {
    id:'FL012', name:'Bristol Music Lovers', cat:'Music',
    interests:['Live Music'], city:'Bristol', e:'🎵', members:48,
    desc:'Bristol has one of the most vibrant music scenes in the UK. We go to gigs together, discover new artists and explore venues from Thekla to Colston Hall. All genres welcome.',
    tags:['Music','Live','Gigs'], ages:'18+', ft:'Both',
    lat:51.4497, lng:-2.5902,
    roosts:[
      {id:'M1', title:'Live Indie Night - Thekla', venue:'Thekla', addr:'East Mud Dock, Bristol BS1', date:d(5), time:'20:00', dur:'3 hrs', price:'£12', going:28, max:40, lat:51.4497, lng:-2.5902},
      {id:'M2', title:'Jazz at the Grain Barge', venue:'Grain Barge', addr:'Mardyke Wharf, Bristol BS8', date:d(11), time:'19:30', dur:'2.5 hrs', price:'£8', going:18, max:30, lat:51.4519, lng:-2.6191},
    ]
  },
  {
    id:'FL013', name:'Bristol Yoga & Wellness', cat:'Wellness',
    interests:['Yoga & Wellness'], city:'Bristol', e:'🧘', members:36,
    desc:'Outdoor yoga, meditation circles and wellness walks around Bristol\'s parks and harbourside. All levels welcome - bring a mat and an open mind.',
    tags:['Yoga','Wellness','Outdoors'], ages:'All ages', ft:'Both',
    lat:51.4561, lng:-2.5973,
    roosts:[
      {id:'M1', title:'Sunday Yoga - Clifton Down', venue:'Clifton Down', addr:'Clifton Down, Bristol BS8', date:d(2), time:'09:30', dur:'1 hr', price:'Free', going:18, max:25, lat:51.4623, lng:-2.6203},
      {id:'M2', title:'Harbourside Meditation Walk', venue:'Bristol Harbourside', addr:'Canons Rd, Bristol BS1', date:d(7), time:'18:00', dur:'1.5 hrs', price:'Free', going:12, max:20, lat:51.4497, lng:-2.5950},
    ]
  },

  // ── Leeds ─────────────────────────────────────────────────
  {
    id:'FL014', name:'Leeds United Supporters', cat:'Sports',
    interests:['Football'], city:'Leeds', e:'🤍', members:88,
    desc:'MOT. Leeds fans watching every game together. Promotion battles, away days and everything in between. If you bleed white and yellow, this is your Flock.',
    tags:['Football','Leeds United','Sports'], ages:'18+', ft:'Both',
    lat:53.7771, lng:-1.5724,
    roosts:[
      {id:'M1', title:'Leeds vs Sheffield Wed - Big Screen', venue:'Mojo Bar', addr:'18 Merrion St, Leeds LS2', date:d(3), time:'15:00', dur:'2 hrs', price:'Free', going:35, max:60, lat:53.8002, lng:-1.5458},
      {id:'M2', title:'Pre-Season Predictions Night', venue:'The Lamb & Flag', addr:'Church Row, Leeds LS2', date:d(9), time:'19:00', dur:'2 hrs', price:'Free', going:18, max:35, lat:53.8010, lng:-1.5432},
    ]
  },
  {
    id:'FL015', name:'Leeds Street Food Club', cat:'Food & Drink',
    interests:['Food & Dining'], city:'Leeds', e:'🍔', members:41,
    desc:'Leeds has a brilliant and rapidly growing food scene. We hit Trinity Kitchen, Kirkgate Market, pop-ups and everything in between. Always a great excuse to eat too much.',
    tags:['Street Food','Foodie','Leeds'], ages:'All ages', ft:'Both',
    lat:53.7980, lng:-1.5443,
    roosts:[
      {id:'M1', title:'Trinity Kitchen Crawl', venue:'Trinity Kitchen', addr:'27 Boar Ln, Leeds LS1', date:d(2), time:'12:30', dur:'2 hrs', price:'Free', going:14, max:20, lat:53.7980, lng:-1.5443},
      {id:'M2', title:'Kirkgate Market Morning', venue:'Kirkgate Market', addr:'34 George St, Leeds LS2', date:d(8), time:'10:00', dur:'2 hrs', price:'Free', going:10, max:18, lat:53.7975, lng:-1.5391},
    ]
  },

  // ── Liverpool ─────────────────────────────────────────────
  {
    id:'FL016', name:'Liverpool Beatles & Music Fans', cat:'Music',
    interests:['Live Music','Pub & Social'], city:'Liverpool', e:'🎸', members:62,
    desc:'From the Cavern Club to the Kazimier, Liverpool\'s music heritage is unmatched. We explore it together - tours, gigs, pub crawls and everything Scouse.',
    tags:['Beatles','Music','Liverpool'], ages:'All ages', ft:'Both',
    lat:53.4082, lng:-2.9793,
    roosts:[
      {id:'M1', title:'Beatles Pub Crawl', venue:'The Cavern Club', addr:'10 Mathew St, Liverpool L2', date:d(3), time:'19:00', dur:'3 hrs', price:'Free', going:22, max:35, lat:53.4082, lng:-2.9793},
      {id:'M2', title:'Live Night at Sound', venue:'Sound Basement', addr:'4 Stanley St, Liverpool L1', date:d(10), time:'20:00', dur:'3 hrs', price:'£8', going:18, max:30, lat:53.4058, lng:-2.9836},
    ]
  },
  {
    id:'FL017', name:'Liverpool Waterfront Runners', cat:'Fitness',
    interests:['Running'], city:'Liverpool', e:'🏃', members:34,
    desc:'Morning runs along the Albert Dock, Pier Head and waterfront. All paces welcome - we stick together and grab coffee after every run at the dock cafe.',
    tags:['Running','Waterfront','Fitness'], ages:'All ages', ft:'Both',
    lat:53.3998, lng:-2.9952,
    roosts:[
      {id:'M1', title:'Albert Dock 5K', venue:'Albert Dock', addr:'Albert Dock, Liverpool L3', date:d(2), time:'08:00', dur:'1 hr', price:'Free', going:16, max:25, lat:53.3998, lng:-2.9952},
      {id:'M2', title:'Sunday Long Run - 8 Miles', venue:'Pier Head', addr:'Pier Head, Liverpool L3', date:d(7), time:'08:30', dur:'1.5 hrs', price:'Free', going:10, max:20, lat:53.4042, lng:-2.9975},
    ]
  },

  // ── Glasgow ───────────────────────────────────────────────
  {
    id:'FL018', name:'Glasgow Comedy & Social', cat:'Social',
    interests:['Pub & Social'], city:'Glasgow', e:'🎤', members:53,
    desc:'Glasgow has the best patter in Britain and we want to keep the night alive. Comedy clubs, rooftop bars, quiz nights and random adventures in the West End.',
    tags:['Comedy','Social','Glasgow'], ages:'18+', ft:'Both',
    lat:55.8699, lng:-4.2887,
    roosts:[
      {id:'M1', title:'Stand Comedy Club Night', venue:'The Stand', addr:'333 Woodlands Rd, Glasgow G3', date:d(4), time:'20:00', dur:'2.5 hrs', price:'£10', going:28, max:45, lat:55.8699, lng:-4.2887},
      {id:'M2', title:'West End Pub Quiz', venue:'Tennent\'s Bar', addr:'191 Byres Rd, Glasgow G12', date:d(8), time:'19:00', dur:'2 hrs', price:'£3', going:20, max:40, lat:55.8733, lng:-4.2909},
    ]
  },
  {
    id:'FL019', name:'Glasgow Art & Culture Collective', cat:'Arts',
    interests:['Arts & Culture'], city:'Glasgow', e:'🎨', members:29,
    desc:'Museum visits, gallery tours, street art walks and creative workshops. Glasgow has a world-class art scene and we are determined to see all of it, together.',
    tags:['Art','Culture','Glasgow'], ages:'All ages', ft:'Both',
    lat:55.8686, lng:-4.2888,
    roosts:[
      {id:'M1', title:'Kelvingrove Gallery Tour', venue:'Kelvingrove Art Gallery', addr:'Argyle St, Glasgow G3', date:d(2), time:'14:00', dur:'2 hrs', price:'Free', going:14, max:20, lat:55.8686, lng:-4.2888},
      {id:'M2', title:'Street Art Walk - East End', venue:'Barras Market', addr:'244 Gallowgate, Glasgow G4', date:d(7), time:'13:00', dur:'2 hrs', price:'Free', going:10, max:18, lat:55.8543, lng:-4.2342},
    ]
  },

  // ── Cardiff ───────────────────────────────────────────────
  {
    id:'FL020', name:'Cardiff Rugby Lads', cat:'Sports',
    interests:['Rugby'], city:'Cardiff', e:'🏉', members:76,
    desc:'Wales till we die. We watch every game together - Six Nations, World Cup, Pro14. Red shirts, loud singing and the best atmosphere in any pub in Cardiff. Cymru am byth.',
    tags:['Rugby','Wales','Sports'], ages:'18+', ft:'Both',
    lat:51.4779, lng:-3.1782,
    roosts:[
      {id:'M1', title:'Wales vs England - Six Nations', venue:'The Cambrian Tap', addr:'4 St Mary St, Cardiff CF10', date:d(2), time:'14:30', dur:'2.5 hrs', price:'Free', going:55, max:80, lat:51.4779, lng:-3.1782},
      {id:'M2', title:'Pro14 Watch Party', venue:'Brewhouse & Kitchen', addr:'Sophia Close, Cardiff CF24', date:d(9), time:'19:30', dur:'2 hrs', price:'Free', going:22, max:40, lat:51.4855, lng:-3.1686},
    ]
  },
  {
    id:'FL021', name:'Cardiff Bay Walkers', cat:'Outdoors',
    interests:['Hiking & Outdoors'], city:'Cardiff', e:'🌊', members:31,
    desc:'Evening and weekend walks around Cardiff Bay, Roath Park, Pontcanna Fields and the Vale of Glamorgan. Fresh air, good chat and always somewhere nice to end up.',
    tags:['Walking','Outdoors','Cardiff'], ages:'All ages', ft:'Both',
    lat:51.4635, lng:-3.1637,
    roosts:[
      {id:'M1', title:'Bay Barrage Evening Walk', venue:'Roald Dahl Plass', addr:'Roald Dahl Plass, Cardiff CF10', date:d(3), time:'18:30', dur:'1.5 hrs', price:'Free', going:15, max:25, lat:51.4635, lng:-3.1637},
      {id:'M2', title:'Roath Park Morning Walk', venue:'Roath Park', addr:'Roath Park, Cardiff CF23', date:d(7), time:'09:00', dur:'1.5 hrs', price:'Free', going:12, max:22, lat:51.5008, lng:-3.1534},
    ]
  },

  // ── Newcastle ─────────────────────────────────────────────
  {
    id:'FL022', name:'Toon Army Social Club', cat:'Sports',
    interests:['Football'], city:'Newcastle', e:'⚫', members:92,
    desc:'Howay the lads. Every Newcastle United game watched together in the most passionate footballing city in England. St James\' Park is our cathedral, The Strawberry our living room.',
    tags:['Football','NUFC','Newcastle'], ages:'18+', ft:'Both',
    lat:54.9749, lng:-1.6192,
    roosts:[
      {id:'M1', title:'Newcastle vs Sunderland - The Derby', venue:'The Strawberry', addr:'5 Strawberry Pl, Newcastle NE1', date:d(1), time:'15:00', dur:'2.5 hrs', price:'Free', going:60, max:80, lat:54.9749, lng:-1.6192},
      {id:'M2', title:'Champions League Watch Party', venue:'The Forth Hotel', addr:'Pink Ln, Newcastle NE1', date:d(8), time:'20:00', dur:'2 hrs', price:'Free', going:35, max:60, lat:54.9706, lng:-1.6125},
    ]
  },
  {
    id:'FL023', name:'Ouseburn Quiz & Social', cat:'Social',
    interests:['Pub & Social'], city:'Newcastle', e:'🧠', members:44,
    desc:'The best quiz nights, live music and social evenings in the Ouseburn Valley. A friendly, welcoming crowd who love good chat as much as they love winning. Come solo.',
    tags:['Quiz','Social','Pub'], ages:'18+', ft:'Both',
    lat:54.9688, lng:-1.5898,
    roosts:[
      {id:'M1', title:'Geordie Quiz Night', venue:'The Cumberland Arms', addr:'Byker Bank, Newcastle NE6', date:d(4), time:'19:30', dur:'2 hrs', price:'£3', going:24, max:40, lat:54.9688, lng:-1.5898},
      {id:'M2', title:'Ouseburn Photography Walk', venue:'Lime Street', addr:'Lime St, Newcastle NE1', date:d(9), time:'14:00', dur:'2 hrs', price:'Free', going:9, max:16, lat:54.9701, lng:-1.5950},
    ]
  },

  // ── London (Mario Kart) ───────────────────────────────────
  {
    id:'FL024', name:'Mario Kart Enthusiasts London', cat:'Gaming',
    interests:['Video Games'], city:'London', e:'🎮', members:28,
    desc:'London\'s most competitive (and most chaotic) Mario Kart community. We meet up, plug in the Switch, argue about which track is hardest and eat too many snacks. All skill levels welcome - beginners get a one-race handicap. Smash Bros sessions occasionally too.',
    tags:['Mario Kart','Gaming','Nintendo','Switch'], ages:'All ages', ft:'Both',
    lat:51.5131, lng:-0.1394,
    roosts:[
      {id:'M1', title:'Mario Kart Grand Prix Night', venue:'Draughts Bar Hackney', addr:'337 Acton Mews, London E8', date:d(2), time:'18:30', dur:'3 hrs', price:'£5', going:14, max:16, lat:51.5395, lng:-0.0574},
      {id:'M2', title:'200cc Tournament - Winner Takes All', venue:'Draughts Bar Hackney', addr:'337 Acton Mews, London E8', date:d(9), time:'18:00', dur:'4 hrs', price:'£5', going:9, max:16, lat:51.5395, lng:-0.0574},
      {id:'M3', title:'Smash Bros + Mario Kart Double Bill', venue:'Loading Bar Stoke Newington', addr:'157 Stoke Newington High St, London N16', date:d(14), time:'17:00', dur:'4 hrs', price:'£6', going:11, max:20, lat:51.5631, lng:-0.0739},
    ]
  },
];
  {name:'Alex K', color:'#F97316'},{name:'Sam T', color:'#8B5CF6'},
  {name:'Jordan L', color:'#3B82F6'},{name:'Morgan P', color:'#EF4444'},
  {name:'Casey M', color:'#10B981'},{name:'Riley B', color:'#F59E0B'},
  {name:'Quinn A', color:'#6366F1'},{name:'Drew N', color:'#EC4899'},
];
