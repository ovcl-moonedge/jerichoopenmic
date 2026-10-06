/* ============================================================
   CONTENT — edit this file to add work. No other code changes needed.
   1. Put the file in media/archive/ or media/performances/
   2. Add one entry below. Paths are relative to the site root.
   ============================================================ */

/* type: "image" or "pdf". id must be unique, lowercase, no spaces.
   category is the tag shown on the tile, e.g. "Photography", "Artwork", "Writing".
   school is optional: shown under the author on the tile and on the item page. */
const ARCHIVE = [
  { id:"example-photo", type:"image", category:"Photography", title:"Title of a photograph", author:"Student name", school:"School name",
    file:"media/archive/example-photo.jpg",
    caption:"Caption or description appears here, beneath the photograph." },
  { id:"Kim Hak-Sun", type:"image", category:"Artwork", title:"Kim Hak-Sun", author:"Clare Yoo", school:"Jericho High School",
    file:"media/archive/clare-yoo-kim-hak-sun.png",
    caption:"Kim Hak-Sun - A South Korean human rights activist. April, 2026" },
  { id:"cheryn-yun-gratitude", type:"pdf", category:"Writing", title:"Gratitude", author:"Isabella-Cheryn Yun", school:"Bronx High School of Science",
    file:"media/archive/cheryn-yun-gratitude.pdf",
    caption:"Literary prose. November, 2025" }
];

/* type: "image" or "video". Newest first. */
const PERFORMANCES = [
  { type:"image", title:"Spring open mic", file:"media/performances/example.jpg", caption:"Caption (optional)." }
];

/* Events: appear on the Calendar (click one to open its details) and in the home page's "Upcoming" feed.
   date is YYYY-MM-DD. time, place and notes are optional. Several events can share a date. Example:
   { date:"2026-10-24", title:"Fall Open Mic", time:"6:00 PM", place:"Jericho Public Library", notes:"Sign-ups start at 5:30." },
   Keep a comma after every entry. */
const EVENTS = [
];

/* Wording shown when a section has nothing in it yet. Edit freely, keep the quotation marks. */
const TEXT = {
  feedEmpty:"Nothing scheduled yet. Check back soon.",
  archiveEmpty:"Nothing here yet.",
  performancesEmpty:"Nothing here yet."
};

/* Calendar range: [year, month] with months 1-12. Raise `max` as the year goes on. */
const CAL = { start:[2026,10], min:[2025,1], max:[2026,12] };
