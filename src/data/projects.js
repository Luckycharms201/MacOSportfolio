/* ============================================================================
   Projects + dock data.

   Images are generated as inline SVG data-URIs so the site runs immediately
   with zero network requests. To use real images, just replace the `thumbnail`
   and `images[]` strings with paths (e.g. "/projects/reel-1.jpg") — drop the
   files in /public and they'll work in dev and build.
============================================================================ */

// --- placeholder image helpers ------------------------------------------------
const svg = (markup) =>
  "data:image/svg+xml;utf8," + encodeURIComponent(markup);

/** A landscape gradient panel with a label — used for window galleries. */
const panel = (label, c1, c2, sub = "") =>
  svg(`<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/>
      </linearGradient>
    </defs>
    <rect width='800' height='600' fill='url(#g)'/>
    <circle cx='640' cy='120' r='180' fill='white' opacity='0.08'/>
    <circle cx='120' cy='520' r='150' fill='black' opacity='0.08'/>
    <text x='50%' y='47%' fill='white' font-family='-apple-system,Helvetica,Arial' font-size='52' font-weight='700' text-anchor='middle'>${label}</text>
    <text x='50%' y='57%' fill='white' opacity='0.8' font-family='-apple-system,Helvetica,Arial' font-size='24' text-anchor='middle'>${sub}</text>
  </svg>`);

/** A rounded square thumbnail with a 2-letter app badge. */
const thumb = (label, c1, c2) =>
  svg(`<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/>
      </linearGradient>
    </defs>
    <rect width='240' height='240' rx='48' fill='url(#g)'/>
    <text x='50%' y='58%' fill='white' font-family='-apple-system,Helvetica,Arial' font-size='96' font-weight='800' text-anchor='middle'>${label}</text>
  </svg>`);

// --- the projects -------------------------------------------------------------
export const projects = [
  {
    id: 1,
    title: "Motion Reel",
    app: "Ae",
    thumbnail: thumb("Ae", "#9a4dff", "#3b2bd6"),
    images: [
      panel("Motion Reel", "#9a4dff", "#3b2bd6", "After Effects · 2024"),
      panel("Title Sequence", "#7c5cff", "#21a3d4", "Animated lower-thirds"),
      panel("Explainer", "#b14dff", "#5b2bd6", "Concept → kinetic story"),
    ],
    description:
      "A reel of animated explainers and social cuts built end-to-end in After Effects — turning dense concepts into a few seconds of clear, kinetic storytelling. Pacing, type, and easing all tuned by hand.",
  },
  {
    id: 2,
    title: "Brand System",
    app: "Ai",
    thumbnail: thumb("Ai", "#ff9a3d", "#d6552b"),
    images: [
      panel("Brand System", "#ff9a3d", "#d6552b", "Affinity Designer"),
      panel("Logo Suite", "#ffb13d", "#d6792b", "Marks & lockups"),
      panel("Type & Color", "#ff7a3d", "#d62b6b", "Tokens that scale"),
    ],
    description:
      "A cohesive visual identity built in the Affinity suite: logo system, type scale, color tokens, and reusable templates so a team can stay on-brand without a designer in the room.",
  },
  {
    id: 3,
    title: "Photo Edits",
    app: "Ps",
    type: "image", // render the desktop icon as a macOS image-file thumbnail
    thumbnail: "/do-not-disturb.jpg",
    images: [
      "/do-not-disturb.jpg",
      panel("Color Grade", "#3dd0ff", "#1b6bd6", "Mood & tone"),
      panel("Retouch", "#3da5ff", "#1b3bd6", "Compositing"),
    ],
    description:
      "Retouching, compositing, and color grading work — cleaning up, recoloring, and assembling imagery to match a campaign's mood and tone.",
  },
  {
    id: 4,
    title: "Data Story",
    app: "Py",
    thumbnail: thumb("Py", "#2bd4c4", "#1b7bd6"),
    images: [
      panel("Data Story", "#2bd4c4", "#1b7bd6", "Python · Pandas"),
      panel("Content Analytics", "#2bd47a", "#1bb0d6", "What actually resonates"),
      panel("Dashboard", "#2bd4c4", "#2b6bd6", "Evidence, not vibes"),
    ],
    description:
      "Python pipelines that pull, clean, and analyze content performance — surfacing what actually resonates so strategy is driven by evidence, not vibes. Pandas, notebooks, and a sprinkle of LLM tooling.",
  },
  {
    id: 5,
    title: "Content Strategy",
    app: "Dx",
    thumbnail: thumb("Dx", "#ff5f8f", "#a02bd6"),
    images: [
      panel("Content Strategy", "#ff5f8f", "#a02bd6", "Messaging & editorial"),
      panel("Editorial Calendar", "#ff5fb0", "#6b2bd6", "Voice, consistent"),
    ],
    description:
      "Messaging frameworks, content calendars, and narrative structures that keep voice consistent and audiences engaged across channels — the connective tissue between the design and the data.",
  },
];

// --- dock apps ----------------------------------------------------------------
// `projectId` (when set) opens the matching project window on click.
export const dockApps = [
  { label: "Fi", grad: "linear-gradient(145deg,#4aa3ff,#1f6fe0)", projectId: null },
  { label: "Ae", grad: "linear-gradient(145deg,#9a4dff,#3b2bd6)", projectId: 1 },
  { label: "Ps", grad: "linear-gradient(145deg,#3da5ff,#1b3bd6)", projectId: 3 },
  { label: "Ai", grad: "linear-gradient(145deg,#ff9a3d,#d6552b)", projectId: 2 },
  { label: "Py", grad: "linear-gradient(145deg,#2bd4c4,#1b7bd6)", projectId: 4 },
  { label: "Dx", grad: "linear-gradient(145deg,#ff5f8f,#a02bd6)", projectId: 5 },
  { divider: true },
  { label: "Sa", grad: "linear-gradient(145deg,#7fd0ff,#2b8bd6)", projectId: null },
  { label: "Ma", grad: "linear-gradient(145deg,#5fb8ff,#2b6bd6)", projectId: null },
  { label: "Tr", grad: "linear-gradient(145deg,#cfd4dc,#9aa1ad)", projectId: null },
];

// --- faded desktop background -------------------------------------------------
// Real photo in /public. Swap this path to change it.
export const bgPortrait = "/dndwebpage.png";
