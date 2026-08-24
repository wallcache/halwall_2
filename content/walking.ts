/**
 * Walking. Two long-distance journals, previously inline in three page files.
 * This is the content most at risk of being lost in a rebuild, so it moves first.
 */

export interface JournalImage {
  src: string;
  caption: string;
}

export interface JournalDay {
  day: number;
  title: string;
  date: string;
  /** Cwm Llwch was logged without per-day mileage, so these are optional. */
  distance?: string;
  from?: string;
  to?: string;
  description: string;
  highlights: string[];
  images: JournalImage[];
}

export interface Walk {
  slug: string;
  name: string;
  year: string;
  distance: string;
  duration: string;
  route: string;
  summary: string;
  days: JournalDay[];
}

const westHighlandWayDays: JournalDay[] = [
  {
    day: 1,
    title: "The Beginning",
    date: "Day 1",
    distance: "12 miles",
    from: "Milngavie",
    to: "Drymen",
    description: "Started from the obelisk in Milngavie town centre. The first day eases you in gently through Mugdock Country Park and past Craigallian Loch. Rolling farmland and woodland paths lead to the village of Drymen.",
    highlights: ["Mugdock Country Park", "Craigallian Loch", "First glimpse of the Highlands"],
    images: [
      { src: "/media/walking/west-highland-way/img-6687.webp", caption: "Stop-off in Edinburgh on the way up from London" },
      { src: "/media/walking/west-highland-way/img-6708.webp", caption: "First night camping just before Conic Hill " },
    ],
  },
  {
    day: 2,
    title: "Conic Hill",
    date: "Day 2",
    distance: "14 miles",
    from: "Drymen",
    to: "Rowardennan",
    description: "The climb up Conic Hill rewards with the first stunning views of Loch Lomond and the islands below. Descending to Balmaha, then following the loch shore through ancient oak woodland to Rowardennan.",
    highlights: ["Conic Hill summit", "Loch Lomond views", "Highland Boundary Fault"],
    images: [
      { src: "/media/walking/west-highland-way/img-6733.webp", caption: "Sunset views from the tent" },
      { src: "/media/walking/west-highland-way/img-6739.webp", caption: "A dreaded Scottish tick found in the morning" },
      { src: "/media/walking/west-highland-way/img-6761.webp", caption: "First stop for foot repair" },
      { src: "/media/walking/west-highland-way/img-6763.webp", caption: "Trail surgery - cutting insoles to make room for my toes" },
    ],
  },
  {
    day: 3,
    title: "The Loch Shore",
    date: "Day 3",
    distance: "14 miles",
    from: "Rowardennan",
    to: "Inverarnan",
    description: "The toughest day on the trail. Rocky, rooty paths cling to the loch shore, constantly undulating. The terrain is relentless but the views across the water make every step worthwhile.",
    highlights: ["Rob Roy's Cave", "Inversnaid Falls", "Wild loch shore walking"],
    images: [
      { src: "/media/walking/west-highland-way/img-6788.webp", caption: "Wild camping on Loch Lomond's shore" },
      { src: "/media/walking/west-highland-way/img-6805.webp", caption: "The Dharma Bums waiting for bed time" },
      { src: "/media/walking/west-highland-way/img-6813.webp", caption: "Loch Lomond views at dusk" },
      { src: "/media/walking/west-highland-way/img-6829.webp", caption: "Leave no trace, the campsite in the morning" },
    ],
  },
  {
    day: 4,
    title: "Glen Falloch",
    date: "Day 4",
    distance: "13 miles",
    from: "Inverarnan",
    to: "Tyndrum",
    description: "Leaving Loch Lomond behind, the path follows the River Falloch through the glen. Waterfalls cascade down from the hills. The landscape opens up as you approach Tyndrum.",
    highlights: ["Falls of Falloch", "Glen Falloch", "Real Food Cafe in Tyndrum"],
    images: [
      { src: "/media/walking/west-highland-way/img-6833.webp", caption: "Morning stop off for coffee (honestly, best coffee ever)" },
      { src: "/media/walking/west-highland-way/img-6880.webp", caption: "Launderette stop - trail life essentials" },
    ],
  },
  {
    day: 5,
    title: "Rannoch Moor",
    date: "Day 5",
    distance: "19 miles",
    from: "Tyndrum",
    to: "Kingshouse",
    description: "The longest day takes you across the vast emptiness of Rannoch Moor. Ancient Caledonian pines give way to endless bog and heather. The Kingshouse Hotel appears like a mirage after hours of wilderness.",
    highlights: ["Bridge of Orchy", "Rannoch Moor crossing", "Views of Buachaille Etive Mor"],
    images: [
      { src: "/media/walking/west-highland-way/img-6926.webp", caption: "Navigating across Rannoch Moor" },
      { src: "/media/walking/west-highland-way/img-6988.webp", caption: "Evening brew at my campsite" },
      { src: "/media/walking/west-highland-way/img-7042.webp", caption: "Red deer at dusk - a magical encounter" },
      { src: "/media/walking/west-highland-way/img-7119.webp", caption: "Pushing through the mist on the moor, a bullfinch visits" },
      { src: "/media/walking/west-highland-way/img-7145.webp", caption: "Pit stop at Glen Coe mountain resort" },
    ],
  },
  {
    day: 6,
    title: "The Devil's Staircase",
    date: "Day 6",
    distance: "9 miles",
    from: "Kingshouse",
    to: "Kinlochleven",
    description: "The famous zigzag climb up the Devil's Staircase is the highest point on the Way. From the top, the view back to the Buachaille and across Glencoe is unforgettable. A steep descent into Kinlochleven.",
    highlights: ["Devil's Staircase summit", "Glencoe panorama", "Kinlochleven aluminium history"],
    images: [
      { src: "/media/walking/west-highland-way/img-7166.webp", caption: "The iconic Buachaille Etive Mor from Kingshouse" },
      { src: "/media/walking/west-highland-way/img-7172.webp", caption: "Reading with rain on the tent" },
      { src: "/media/walking/west-highland-way/img-7194.webp", caption: "Etive Mor valleys" },
      { src: "/media/walking/west-highland-way/img-7205.webp", caption: "The dramatic road through Glencoe" },
    ],
  },
  {
    day: 7,
    title: "The Final Push",
    date: "Day 7",
    distance: "15 miles",
    from: "Kinlochleven",
    to: "Fort William",
    description: "The last day climbs through the Lairig Mor before a long forest descent towards Fort William. Ben Nevis looms ahead. Touching the statue at the end brings a rush of emotion and accomplishment.",
    highlights: ["Lairig Mor", "First view of Ben Nevis", "The finish line statue"],
    images: [
      { src: "/media/walking/west-highland-way/img-7220.webp", caption: "Visited my grand uncle" },
      { src: "/media/walking/west-highland-way/img-7221.webp", caption: "And visited my great-great-grandfather, Belzie's grave" },
      { src: "/media/walking/west-highland-way/img-7227.webp", caption: "Alan treated me to a good meal" },
      { src: "/media/walking/west-highland-way/img-7249.webp", caption: "The path through the Lairig Mor" },
      { src: "/media/walking/west-highland-way/img-7258.webp", caption: "One last brew with a view of Ben Nevis" },
      { src: "/media/walking/west-highland-way/img-7267.webp", caption: "The finish line - 96 miles complete!" },
    ],
  },
];

const cwmLlwchDays: JournalDay[] = [
  {
    day: 1,
    title: "Ascent to the Cwm",
    date: "Day 1",
    description: "Started from the Pont ar Daf car park on the A470. The path climbs steadily alongside the Blaen Taf Fawr stream, gaining height with every step. The landscape transforms from farmland to open moorland as the peaks of Corn Du and Pen y Fan emerge from the clouds ahead. Breaking away from the main tourist path, we descended into the hidden valley of Cwm Llwch. The glacial lake appeared below — dark, still waters surrounded by the steep walls of the cwm. We pitched camp on the grassy banks as the sun began to set behind the ridgeline.",
    highlights: ["Corn Du views", "Cwm Llwch lake", "Wild camping spot"],
    images: [
      { src: "/media/walking/cwm-llwch/img-2491.webp", caption: "Through the gate and onto the mountain" },
      { src: "/media/walking/cwm-llwch/img-2525.webp", caption: "The outflow from Cwm Llwch" },
      { src: "/media/walking/cwm-llwch/wal02519.webp", caption: "Running free below Pen y Fan" },
      { src: "/media/walking/cwm-llwch/img-2550.webp", caption: "Camp setup complete" },
      { src: "/media/walking/cwm-llwch/img-2565.webp", caption: "Our spot by the lake" },
      { src: "/media/walking/cwm-llwch/img-2482.webp", caption: "Evening coffee ritual" },
      { src: "/media/walking/cwm-llwch/img-2566.webp", caption: "Trail dinner - chicken korma" },
      { src: "/media/walking/cwm-llwch/img-2599.webp", caption: "A dip in the glacial lake" },
      { src: "/media/walking/cwm-llwch/img-2465.webp", caption: "Tent reading with the best company" },
      { src: "/media/walking/cwm-llwch/img-2572.webp", caption: "Sleeping arrangements sorted" },
    ],
  },
  {
    day: 2,
    title: "Summit and Return",
    date: "Day 2",
    description: "Woke to a layer of mist hanging over the lake. After packing up camp, we climbed the steep path up to the ridge between Corn Du and Pen y Fan. The clouds parted just as we reached the summit of Pen y Fan — the highest point in southern Britain. Views stretched across the Brecon Beacons and beyond into England. The descent via the Storey Arms route was busy with day walkers, a contrast to the solitude of our wild camp the night before. A perfect two-day adventure in the Welsh mountains.",
    highlights: ["Pen y Fan summit", "Corn Du traverse", "Storey Arms descent"],
    images: [
      { src: "/media/walking/cwm-llwch/img-2587.webp", caption: "Morning mist lifting over the cwm" },
      { src: "/media/walking/cwm-llwch/wal02185.webp", caption: "Ready for the summit push" },
      { src: "/media/walking/cwm-llwch/img-2528.webp", caption: "On the ridge in the wind" },
      { src: "/media/walking/cwm-llwch/wal02227.webp", caption: "Watching the light change over the Beacons" },
    ],
  },
];

export const walks: Walk[] = [
  {
    slug: "west-highland-way",
    name: "The West Highland Way",
    year: "2024",
    distance: "96 miles",
    duration: "7 days",
    route: "Milngavie to Fort William",
    summary:
      "Ninety-six miles from the outskirts of Glasgow to the foot of Ben Nevis, carrying everything and wildcamping most nights. Loch Lomond's shore is the hardest day and nobody warns you about it.",
    days: westHighlandWayDays,
  },
  {
    slug: "cwm-llwch",
    name: "Cwm Llwch",
    year: "2025",
    distance: "~10 miles",
    duration: "2 days",
    route: "Brecon Beacons",
    summary:
      "A short wildcamping trip into the Brecon Beacons, up to the glacial lake beneath Pen y Fan and back out over the ridge.",
    days: cwmLlwchDays,
  },
];

export const getWalk = (slug: string) => walks.find((w) => w.slug === slug);

/** Japhy earns a section. He is in a lot of the photography and all of the walking. */
export const japhy = {
  name: "Japhy",
  breed: "Wirehaired Vizsla",
  born: "4 July 2024",
  note:
    "Named for Japhy Ryder in Kerouac's The Dharma Bums, which is roughly the correct amount of pressure to put on a dog.",
  video: "/media/video/japhy.mp4",
} as const;
