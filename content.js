/* ============================================================
   CONTENT — edit this file to add work. No other code changes needed.
   1. Put the file in media/archive/ or media/performances/
   2. Add one entry below. Paths are relative to the site root.
   ============================================================ */

/* type: "image" or "pdf". id must be unique, lowercase, no spaces.
   category is the tag shown on the tile, e.g. "Photography", "Artwork", "Writing". */
const ARCHIVE = [
  { id:"example-photo", type:"image", category:"Photography", title:"Title of a photograph", author:"Student name",
    file:"media/archive/example-photo.jpg",
    caption:"Caption or description appears here, beneath the photograph." },
  { id:"example-artwork", type:"image", category:"Artwork", title:"Title of an artwork", author:"Student name",
    file:"media/archive/example-artwork.jpg",
    caption:"Caption or description appears here, beneath the artwork." },
  { id:"example-poem", type:"pdf", category:"Writing", title:"Title of a poem", author:"Student name",
    file:"media/archive/example-poem.pdf",
    caption:"Caption or description appears here, beneath the PDF." }
];

/* type: "image" or "video". Newest first. */
const PERFORMANCES = [
  { type:"image", title:"Spring open mic", file:"media/performances/example.jpg", caption:"Caption (optional)." }
];

/* Events: appear on the Calendar and in the "Upcoming" feed on the home page.
   date is YYYY-MM-DD; time and place are optional. Example:
   { date:"2026-10-24", title:"Fall Open Mic", time:"6:00 PM", place:"Jericho Public Library" } */
const EVENTS = [
];

/* Calendar range: [year, month] with months 1-12. Raise `max` as the year goes on. */
const CAL = { start:[2026,10], min:[2025,1], max:[2026,12] };
