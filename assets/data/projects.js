/* ============================================================
   rayul.ca — project data (single source for Work and Index)

   Add a project: copy one line in PROJECTS, give it a unique id,
   fill in the fields, and drop its still at assets/images/thumbs/<id>.jpg
   (or run scripts/fetch-thumbs.sh). Newest first.

   roles use these words, in this order:
   direction, dp, edit, colour, vfx

   WORK     = the projects on the Work page, in order
   FEATURED = shown right after the newest project on Index (ALL)
   ============================================================ */
(function () {
var PROJECTS = [
  { id: "chichu-s27-echo", client: "Chichu", title: "S27 Echo", type: "Fashion Campaign", year: "2026", roles: ["dp", "edit", "colour"], vimeo: {"id": "1244403099"}, youtube: null, thumb: "assets/images/thumbs/chichu-s27-echo.jpg" },
  { id: "livingthing-oh-well", client: "Livingthing", title: "Oh Well", type: "Visualizer", year: "2026", roles: ["direction", "edit", "colour"], vimeo: null, youtube: "y2ALfDG0f6M", thumb: "assets/images/thumbs/livingthing-oh-well.jpg" },
  { id: "project-yt-idle-crow", client: "i-dle", title: "Crow", type: "Performance Video", year: "2026", roles: ["colour"], vimeo: null, youtube: "w6FzChNkVrY", thumb: "assets/images/thumbs/project-yt-idle-crow.jpg" },
  { id: "vimeo-girl-dont-cry-live", client: "Livingthing", title: "Girl Don't Cry Live", type: "Live Session", year: "2026", roles: ["direction", "edit", "colour"], vimeo: {"id": "1189542781"}, youtube: null, thumb: "assets/images/thumbs/vimeo-girl-dont-cry-live.jpg" },
  { id: "project-yt-1", client: "Drake", title: "8am in Charlotte", type: "Music Video", year: "2023", roles: ["vfx"], vimeo: null, youtube: "VEW9E1EIQ1M", thumb: "assets/images/thumbs/project-yt-1.jpg" },
  { id: "vimeo-vitaly-oblivion-s25", client: "Vitaly", title: "Oblivion S25", type: "Fashion Film", year: "2025", roles: ["dp", "edit", "colour"], vimeo: {"id": "1086260829"}, youtube: null, thumb: "assets/images/thumbs/vimeo-vitaly-oblivion-s25.jpg" },
  { id: "project-yt-2", client: "Drake", title: "Polar Opposites", type: "Music Video", year: "2023", roles: ["vfx"], vimeo: null, youtube: "0bxhAxRmrJw", thumb: "assets/images/thumbs/project-yt-2.jpg" },
  { id: "vimeo-saint-andre-grimoire", client: "Saint Andre", title: "Grimoire", type: "Music Video", year: "2025", roles: ["direction", "dp", "colour"], vimeo: {"id": "1180380678"}, youtube: null, thumb: "assets/images/thumbs/vimeo-saint-andre-grimoire.jpg" },
  { id: "vimeo-4ye-holiday-s25", client: "4YE", title: "Holiday Campaign S25", type: "Fashion Film", year: "2025", roles: ["dp", "edit", "colour"], vimeo: {"id": "1152323624"}, youtube: null, thumb: "assets/images/thumbs/vimeo-4ye-holiday-s25.jpg" },
  { id: "vimeo-spencer-badu-s25", client: "Spencer Badu", title: "S25", type: "Fashion Film", year: "2025", roles: ["dp", "edit", "colour"], vimeo: {"id": "1068478051"}, youtube: null, thumb: "assets/images/thumbs/vimeo-spencer-badu-s25.jpg" },
  { id: "project-yt-3", client: "Poova Vaa", title: "Vidusan, Supaveen", type: "Music Video", year: "2025", roles: ["dp"], vimeo: null, youtube: "Y4SNF4iRMJA", thumb: "assets/images/thumbs/project-yt-3.jpg" },
  { id: "project-yt-4", client: "MAL1K", title: "360", type: "Music Video", year: "2025", roles: ["dp"], vimeo: null, youtube: "", thumb: "assets/images/malik-360-thumb.jpg" },
  { id: "project-yt-5", client: "Diljit Dosanjh", title: "Ghost", type: "Music Video", year: "2025", roles: ["colour"], vimeo: null, youtube: "SJzhhWdJ5kw", thumb: "assets/images/thumbs/project-yt-5.jpg" },
  { id: "project-yt-6", client: "Tesher", title: "Ve Mundeya", type: "Music Video", year: "2025", roles: ["vfx"], vimeo: null, youtube: "iUcrHEb3YvE", thumb: "assets/images/thumbs/project-yt-6.jpg" },
  { id: "vimeo-gray-hawken-golden-state", client: "Gray Hawken", title: "Golden State", type: "Music Video", year: "2024", roles: ["direction", "edit", "colour"], vimeo: {"id": "1072859381"}, youtube: null, thumb: "assets/images/thumbs/vimeo-gray-hawken-golden-state.jpg" },
  { id: "vimeo-chris-larocca-ladybug", client: "Chris Larocca", title: "Ladybug", type: "Music Video", year: "2024", roles: ["direction", "edit", "colour"], vimeo: {"id": "1072858613"}, youtube: null, thumb: "assets/images/thumbs/vimeo-chris-larocca-ladybug.jpg" },
  { id: "vimeo-lafrance-s24-two-brothers", client: "Lafrance S24", title: "Two Brothers", type: "Fashion Film", year: "2024", roles: ["direction", "dp", "edit", "colour"], vimeo: {"id": "1019260930"}, youtube: null, thumb: "assets/images/thumbs/vimeo-lafrance-s24-two-brothers.jpg" },
  { id: "vimeo-cherry-blu-shirt-never-fit", client: "Cherry Blu", title: "Shirt Never Fit", type: "Music Video", year: "2024", roles: ["direction", "edit", "vfx"], vimeo: {"id": "1033728951"}, youtube: null, thumb: "assets/images/thumbs/vimeo-cherry-blu-shirt-never-fit.jpg" },
  { id: "vimeo-adroc-after-rest", client: "Adroc", title: "After Rest", type: "Music Video", year: "2024", roles: ["direction", "dp", "edit", "colour"], vimeo: {"id": "928892869"}, youtube: null, thumb: "assets/images/thumbs/vimeo-adroc-after-rest.jpg" },
  { id: "vimeo-jiwoo-afterimage", client: "Jiwoo", title: "Afterimage", type: "Music Video", year: "2024", roles: ["direction", "edit", "colour"], vimeo: {"id": "936429043"}, youtube: null, thumb: "assets/images/thumbs/vimeo-jiwoo-afterimage.jpg" },
  { id: "vimeo-lou-val-in-ur-motions", client: "Lou Val", title: "In Ur Motions", type: "Music Video", year: "2023", roles: ["dp", "edit", "colour"], vimeo: {"id": "907972764"}, youtube: null, thumb: "assets/images/thumbs/vimeo-lou-val-in-ur-motions.jpg" },
  { id: "vimeo-amaal-nuux-the-middle", client: "Amaal Nuux", title: "The Middle", type: "Music Video", year: "2023", roles: ["direction", "edit", "colour"], vimeo: {"id": "838913497"}, youtube: null, thumb: "assets/images/thumbs/vimeo-amaal-nuux-the-middle.jpg" },
  { id: "vimeo-spencer-badu-naso-s23", client: "Spencer Badu × Naso", title: "S23 Bag Campaign", type: "Fashion Film", year: "2023", roles: ["direction", "edit", "colour"], vimeo: {"id": "840272063"}, youtube: null, thumb: "assets/images/thumbs/vimeo-spencer-badu-naso-s23.jpg" },
  { id: "vimeo-spencer-badu-s23", client: "Spencer Badu", title: "S23", type: "Fashion Film", year: "2023", roles: ["dp", "edit", "colour"], vimeo: {"id": "795354913"}, youtube: null, thumb: "assets/images/thumbs/vimeo-spencer-badu-s23.jpg" },
  { id: "vimeo-vitaly-bpm-s23", client: "Vitaly", title: "BPM S23", type: "Fashion Film", year: "2023", roles: ["dp", "edit", "colour"], vimeo: {"id": "855555364"}, youtube: null, thumb: "assets/images/thumbs/vimeo-vitaly-bpm-s23.jpg" },
  { id: "vimeo-concorde-ep-trailer", client: "Concorde", title: "EP Trailer", type: "EP Trailer", year: "2022", roles: ["direction", "dp", "edit", "colour"], vimeo: {"id": "790929123"}, youtube: null, thumb: "assets/images/thumbs/vimeo-concorde-ep-trailer.jpg" },
  { id: "vimeo-mileena-eve-2", client: "Mileena", title: "EVE 2", type: "Music Video", year: "2022", roles: ["dp", "edit", "colour"], vimeo: {"id": "788843088"}, youtube: null, thumb: "assets/images/thumbs/vimeo-mileena-eve-2.jpg" },
  { id: "vimeo-2-sides-kavale", client: "2 Sides", title: "Kavale", type: "Music Video", year: "2022", roles: ["direction", "edit", "colour"], vimeo: {"id": "786423131"}, youtube: null, thumb: "assets/images/thumbs/vimeo-2-sides-kavale.jpg" },
  { id: "vimeo-adroc-kindred", client: "Adroc", title: "Kindred", type: "Music Video", year: "2022", roles: ["direction", "colour", "vfx"], vimeo: {"id": "755993448"}, youtube: null, thumb: "assets/images/thumbs/vimeo-adroc-kindred.jpg" },
  { id: "vimeo-wizkid-rolling-loud", client: "Wizkid", title: "Rolling Loud Toronto", type: "Concert Film", year: "2022", roles: ["dp", "edit", "colour"], vimeo: {"id": "749777779"}, youtube: null, thumb: "assets/images/thumbs/vimeo-wizkid-rolling-loud.jpg" },
  { id: "vimeo-ethereal-toussaint", client: "Ethereal", title: "Toussaint", type: "Music Video", year: "2022", roles: ["direction", "edit", "colour"], vimeo: {"id": "740914790"}, youtube: null, thumb: "assets/images/thumbs/vimeo-ethereal-toussaint.jpg" },
  { id: "vimeo-seago-lawn-visualizer", client: "Seago", title: "Lawn Visualizer", type: "Music Video", year: "2022", roles: ["direction", "dp", "edit", "colour"], vimeo: {"id": "711863471"}, youtube: null, thumb: "assets/images/thumbs/vimeo-seago-lawn-visualizer.jpg" },
  { id: "vimeo-radio-silence-stefan-ensea", client: "Radio Silence", title: "Stefan, Ensea", type: "Music Video", year: "2022", roles: ["direction", "dp", "edit", "colour"], vimeo: {"id": "694750305"}, youtube: null, thumb: "assets/images/thumbs/vimeo-radio-silence-stefan-ensea.jpg" },
  { id: "vimeo-baduhaus-s22", client: "BADUHAUS", title: "S22", type: "Fashion Film", year: "2022", roles: ["dp", "edit", "colour"], vimeo: {"id": "703899499"}, youtube: null, thumb: "assets/images/thumbs/vimeo-baduhaus-s22.jpg" },
  { id: "vimeo-fanatica-santi", client: "Fanatica", title: "Santi", type: "Music Video", year: "2022", roles: ["direction", "dp", "edit", "colour"], vimeo: {"id": "804531057"}, youtube: null, thumb: null },
  { id: "vimeo-presence", client: "Presence", title: "", type: "Short Film", year: "2021", roles: ["direction", "edit", "colour"], vimeo: {"id": "512031476"}, youtube: null, thumb: "assets/images/thumbs/vimeo-presence.jpg" },
  { id: "vimeo-intermission-fashion-film", client: "Intermission", title: "Fashion Film", type: "Fashion Film", year: "2020", roles: ["direction", "dp", "edit", "colour"], vimeo: {"id": "478246234"}, youtube: null, thumb: "assets/images/thumbs/vimeo-intermission-fashion-film.jpg" },
  { id: "vimeo-vitaly-s19-campaign", client: "Vitaly", title: "S19 Campaign", type: "Fashion Film", year: "2019", roles: ["dp", "edit", "colour"], vimeo: {"id": "375209102"}, youtube: null, thumb: "assets/images/thumbs/vimeo-vitaly-s19-campaign.jpg" },
  { id: "vimeo-its-not-you-its-me", client: "its not you, its me.", title: "", type: "Short Film", year: "2018", roles: ["dp", "edit", "colour"], vimeo: {"id": "310207652"}, youtube: null, thumb: "assets/images/thumbs/vimeo-its-not-you-its-me.jpg" },
];

var SHOWREEL = { vimeo: { id: "1183593139", hash: "37c2129f54" }, thumb: null };

var WORK = ["vimeo-vitaly-oblivion-s25", "vimeo-saint-andre-grimoire", "vimeo-spencer-badu-s25", "vimeo-gray-hawken-golden-state", "livingthing-oh-well", "chichu-s27-echo", "vimeo-presence", "project-yt-idle-crow", "vimeo-adroc-after-rest", "vimeo-jiwoo-afterimage", "vimeo-amaal-nuux-the-middle", "vimeo-spencer-badu-s23", "vimeo-vitaly-bpm-s23"];

var FEATURED = ["project-yt-idle-crow", "project-yt-1", "vimeo-presence", "project-yt-2", "vimeo-jiwoo-afterimage", "vimeo-wizkid-rolling-loud", "project-yt-5"];

window.RAYUL = { projects: PROJECTS, showreel: SHOWREEL, work: WORK, featured: FEATURED };
})();
