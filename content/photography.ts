/** Photography. Ported verbatim from the v5 data layer; only asset paths were remapped. */

export interface Photo {
  src: string;
  alt: string;
  category: "Portrait" | "Landscape" | "Cityscape";
}

export const portraitPhotos: Photo[] = [
  { src: "/media/photography/portrait/woman-cherry-blossom.webp", alt: "Portrait photography - woman under cherry blossoms", category: "Portrait" },
  { src: "/media/photography/portrait/man-smiling-countryside.webp", alt: "Portrait photography - man smiling outdoors", category: "Portrait" },
  { src: "/media/photography/portrait/woman-guitar-studio-bw.webp", alt: "Portrait photography - woman with guitar in studio", category: "Portrait" },
  { src: "/media/photography/portrait/woman-watercolor-painting.webp", alt: "Portrait photography - woman painting watercolors", category: "Portrait" },
  { src: "/media/photography/portrait/redhaired-woman-keyboard.webp", alt: "Portrait photography - red-haired woman at keyboard", category: "Portrait" },
  { src: "/media/photography/portrait/elderly-man-white-dog.webp", alt: "Portrait photography - elderly man with white dog", category: "Portrait" },
  { src: "/media/photography/portrait/redhaired-woman-pillar-color.webp", alt: "Portrait photography - red-haired woman by pillar", category: "Portrait" },
  { src: "/media/photography/portrait/woman-colonnade-white.webp", alt: "Portrait photography - woman in white colonnade", category: "Portrait" },
  { src: "/media/photography/portrait/blonde-woman-turtleneck.webp", alt: "Portrait photography - blonde woman in turtleneck", category: "Portrait" },
  { src: "/media/photography/portrait/redhaired-woman-pillar.webp", alt: "Portrait photography - red-haired woman by pillar B&W", category: "Portrait" },
  { src: "/media/photography/portrait/man-laughing-skateboard.webp", alt: "Portrait photography - man laughing with skateboard", category: "Portrait" },
  { src: "/media/photography/portrait/woman-bank-junction-london.webp", alt: "Portrait photography - woman at Bank Junction London", category: "Portrait" },
  { src: "/media/photography/portrait/redhaired-woman-vinyl-records.webp", alt: "Portrait photography - red-haired woman with vinyl records", category: "Portrait" },
  { src: "/media/photography/portrait/man-beanie-jacket.webp", alt: "Portrait photography - man in beanie and jacket", category: "Portrait" },
  { src: "/media/photography/portrait/blonde-woman-field-bw.webp", alt: "Portrait photography - blonde woman in field B&W", category: "Portrait" },
  { src: "/media/photography/portrait/blonde-woman-closeup.webp", alt: "Portrait photography - blonde woman closeup", category: "Portrait" },
  { src: "/media/photography/portrait/woman-headphones-vinyl-bw.webp", alt: "Portrait photography - woman with headphones and vinyl B&W", category: "Portrait" },
  { src: "/media/photography/portrait/woman-louvre-gallery.webp", alt: "Portrait photography - woman in Louvre gallery", category: "Portrait" },
  { src: "/media/photography/portrait/woman-pillar-white-outfit.webp", alt: "Portrait photography - woman by pillar in white outfit", category: "Portrait" },
  { src: "/media/photography/portrait/cesca-chair-window-bw.webp", alt: "Portrait photography - woman on Cesca chair by window B&W", category: "Portrait" },
];

export const landscapePhotos: Photo[] = [
  { src: "/media/photography/landscape/calm-sea-overcast.webp", alt: "Landscape photography - calm sea overcast sky", category: "Landscape" },
  { src: "/media/photography/landscape/snowy-countryside-sunburst.webp", alt: "Landscape photography - snowy countryside sunburst", category: "Landscape" },
  { src: "/media/photography/landscape/countryside-storm-clouds-bw.webp", alt: "Landscape photography - countryside storm clouds B&W", category: "Landscape" },
  { src: "/media/photography/landscape/coastal-path-hedgerow.webp", alt: "Landscape photography - coastal path hedgerow", category: "Landscape" },
  { src: "/media/photography/landscape/moorland-open-road.webp", alt: "Landscape photography - moorland open road", category: "Landscape" },
  { src: "/media/photography/landscape/moorland-hikers-mist.webp", alt: "Landscape photography - moorland hikers in mist", category: "Landscape" },
  { src: "/media/photography/landscape/coastal-camping-cliffs.webp", alt: "Landscape photography - coastal camping on cliffs", category: "Landscape" },
  { src: "/media/photography/landscape/hilltop-silhouette-moon.webp", alt: "Landscape photography - hilltop silhouette with moon", category: "Landscape" },
  { src: "/media/photography/landscape/dramatic-clouds-plane.webp", alt: "Landscape photography - dramatic clouds with plane", category: "Landscape" },
  { src: "/media/photography/landscape/autumn-trees-rainbow.webp", alt: "Landscape photography - autumn trees with rainbow", category: "Landscape" },
  { src: "/media/photography/landscape/arthurs-seat-edinburgh-sunset.webp", alt: "Landscape photography - Arthur's Seat Edinburgh sunset", category: "Landscape" },
  { src: "/media/photography/landscape/lone-sheep-field-bw.webp", alt: "Landscape photography - lone sheep in field B&W", category: "Landscape" },
  { src: "/media/photography/landscape/tent-closeup-detail.webp", alt: "Landscape photography - tent closeup detail", category: "Landscape" },
  { src: "/media/photography/landscape/cotswolds-village-autumn.webp", alt: "Landscape photography - Cotswolds village in autumn", category: "Landscape" },
  { src: "/media/photography/landscape/lake-storm-reflections-bw.webp", alt: "Landscape photography - lake storm reflections B&W", category: "Landscape" },
  { src: "/media/photography/landscape/stormy-clouds-aircraft.webp", alt: "Landscape photography - stormy clouds with aircraft", category: "Landscape" },
  { src: "/media/photography/landscape/mediterranean-coast-boat.webp", alt: "Landscape photography - Mediterranean coast with boat", category: "Landscape" },
  { src: "/media/photography/landscape/cotswolds-aerial-panorama.webp", alt: "Landscape photography - Cotswolds aerial panorama", category: "Landscape" },
  { src: "/media/photography/landscape/countryside-aerial-golden-hour.webp", alt: "Landscape photography - countryside aerial golden hour", category: "Landscape" },
  { src: "/media/photography/landscape/bridge-sunset-silhouettes.webp", alt: "Landscape photography - bridge sunset silhouettes", category: "Landscape" },
  { src: "/media/photography/landscape/coastal-sunset-balcony.webp", alt: "Landscape photography - coastal sunset from balcony", category: "Landscape" },
  { src: "/media/photography/landscape/light-through-window.webp", alt: "Landscape photography - light through window", category: "Landscape" },
];

export const cityscapePhotos: Photo[] = [
  { src: "/media/photography/cityscape/riverbank-bridge-sunset.webp", alt: "Cityscape photography - riverbank bridge sunset", category: "Cityscape" },
  { src: "/media/photography/cityscape/london-city-hall.webp", alt: "Cityscape photography - London City Hall", category: "Cityscape" },
  { src: "/media/photography/cityscape/skyscrapers-lookup-bw.webp", alt: "Cityscape photography - skyscrapers lookup B&W", category: "Cityscape" },
  { src: "/media/photography/cityscape/canary-wharf-through-window.webp", alt: "Cityscape photography - Canary Wharf through window", category: "Cityscape" },
  { src: "/media/photography/cityscape/canary-wharf-window-sunset.webp", alt: "Cityscape photography - Canary Wharf window sunset", category: "Cityscape" },
  { src: "/media/photography/cityscape/rooftop-penthouse-dusk.webp", alt: "Cityscape photography - rooftop penthouse at dusk", category: "Cityscape" },
  { src: "/media/photography/cityscape/london-bridge-bus-stop.webp", alt: "Cityscape photography - London Bridge bus stop", category: "Cityscape" },
  { src: "/media/photography/cityscape/autumn-yellow-tree-taxi.webp", alt: "Cityscape photography - autumn yellow tree with taxi", category: "Cityscape" },
  { src: "/media/photography/cityscape/tower-bridge-fog-silhouette.webp", alt: "Cityscape photography - Tower Bridge fog silhouette", category: "Cityscape" },
  { src: "/media/photography/cityscape/tower-bridge-thames.webp", alt: "Cityscape photography - Tower Bridge over Thames", category: "Cityscape" },
  { src: "/media/photography/cityscape/shard-fog-birds.webp", alt: "Cityscape photography - The Shard in fog with birds", category: "Cityscape" },
  { src: "/media/photography/cityscape/london-skyline-shard-view.webp", alt: "Cityscape photography - London skyline Shard view", category: "Cityscape" },
  { src: "/media/photography/cityscape/shard-silhouette-plane.webp", alt: "Cityscape photography - Shard silhouette with plane", category: "Cityscape" },
  { src: "/media/photography/cityscape/skyscrapers-lookup-fog.webp", alt: "Cityscape photography - skyscrapers lookup in fog", category: "Cityscape" },
  { src: "/media/photography/cityscape/shard-view-window-dusk.webp", alt: "Cityscape photography - Shard view from window at dusk", category: "Cityscape" },
  { src: "/media/photography/cityscape/oslo-library-architecture.webp", alt: "Cityscape photography - Oslo library architecture", category: "Cityscape" },
  { src: "/media/photography/cityscape/shad-thames-bridges.webp", alt: "Cityscape photography - Shad Thames bridges", category: "Cityscape" },
  { src: "/media/photography/cityscape/skyscrapers-foggy-lookup.webp", alt: "Cityscape photography - skyscrapers foggy lookup", category: "Cityscape" },
  { src: "/media/photography/cityscape/waterloo-bridge-red-bus.webp", alt: "Cityscape photography - Waterloo Bridge red bus", category: "Cityscape" },
  { src: "/media/photography/cityscape/city-hall-shard-stormy-sunset.webp", alt: "Cityscape photography - City Hall and Shard stormy sunset", category: "Cityscape" },
  { src: "/media/photography/cityscape/london-shard-light-trails.webp", alt: "Cityscape photography - London Shard light trails", category: "Cityscape" },
  { src: "/media/photography/cityscape/rooftop-penthouse-twilight.webp", alt: "Cityscape photography - rooftop penthouse at twilight", category: "Cityscape" },
  { src: "/media/photography/cityscape/city-aerial-night.webp", alt: "Cityscape photography - city aerial at night", category: "Cityscape" },
  { src: "/media/photography/cityscape/shard-aerial-view.webp", alt: "Cityscape photography - Shard aerial view", category: "Cityscape" },
  { src: "/media/photography/cityscape/city-street-motion-blur.webp", alt: "Cityscape photography - city street motion blur", category: "Cityscape" },
  { src: "/media/photography/cityscape/london-skyline-train-bridge.webp", alt: "Cityscape photography - London skyline train bridge", category: "Cityscape" },
  { src: "/media/photography/cityscape/pink-blossom-tree.webp", alt: "Cityscape photography - pink blossom tree", category: "Cityscape" },
  { src: "/media/photography/cityscape/skateboard-trick-stpauls.webp", alt: "Cityscape photography - skateboard trick at St Paul's", category: "Cityscape" },
  { src: "/media/photography/cityscape/shard-fog-birds-alt.webp", alt: "Cityscape photography - Shard fog with birds alternative", category: "Cityscape" },
  { src: "/media/photography/cityscape/interior-scene.webp", alt: "Cityscape photography - interior scene", category: "Cityscape" },
];

export interface PhotographyProject {
  name: string;
  slug: string;
  description: string;
  images: string[];
  /** Served through a gated route handler, not from public/. See app/api/gated. */
  gated?: boolean;
}

export const photographyProjects: PhotographyProject[] = [
  {
    name: "The Coffee Community",
    slug: "the-coffee-community",
    description: "The Coffee Community runs three specialty coffee trucks across London. I shoot their events and provide content for their active social media.",
    images: Array.from({ length: 30 }, (_, i) => `/media/photography/the-coffee-community/tcc${i + 1}.webp`),
  },
  {
    name: "We Met At Eight",
    slug: "wemetateight",
    description: "Event photography for We Met At Eight, London's dating events company.",
    images: Array.from({ length: 20 }, (_, i) => `/media/photography/wemetateight/wma8${i + 1}.webp`),
  },
  {
    name: "Vivienne Westwood for Harrods",
    slug: "vw-harrods",
    description: "Campaign photography for Vivienne Westwood at Harrods.",
    images: Array.from({ length: 30 }, (_, i) => `/api/gated/vw-harrods/vw-harrods-hw${i + 1}.webp`),
    gated: true,
  },
];

export const allPhotos: Photo[] = [...portraitPhotos, ...landscapePhotos, ...cityscapePhotos];
export const getPhotographyProject = (slug: string) => photographyProjects.find((p) => p.slug === slug);
