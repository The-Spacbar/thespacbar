import * as React from "react"
import CallsignRadioLanding, { type CrShow, type CrTrack } from "./callsign-radio-landing"
import PODCAST_SNAPSHOT from "./podcast.json"

// the spacbar., tuned like a station broadcasting out of Johannesburg. The
// masthead reads "the spacbar." in lowercase, like the logo, with the full stop
// in the meter's red zone. Services are the shows, the studio day is the running
// order, the portfolio is the archive, and the support tuner books airtime (a
// project timeline) instead of taking donations. Every action that would "send"
// something opens a pre-filled email, so nothing pretends to submit.

const EMAIL = "thespacbar@gmail.com"

// The live feed is the #PLAYMRVL podcast, played back to back and joined mid-broadcast.
// The browser reads the RSS directly (Anchor allows it), so new episodes go on air without a
// rebuild; src/podcast.json (npm run podcast) is the fallback if the feed can't be reached.
const PODCAST_RSS = "https://anchor.fm/s/b92db68/podcast/rss"
const PODCAST_PAGE = "https://pca.st/kqxk"

// Instagram. Instagram only lists an account's posts to signed-in visitors or through its
// Graph API, so the carousel shows the posts linked here, each as Instagram's own embed.
// Paste post or reel links (https://www.instagram.com/p/XXXX/), newest first; with none,
// the row stays hidden.
const INSTAGRAM = "https://www.instagram.com/thespacbar_za/"
const INSTAGRAM_POSTS: string[] = []

/** South Africa's flag (2:3, official colours), as tall as the red buttons, linking to Brand South Africa. */
function SouthAfricaFlag() {
  return (
    <a href="https://brandsouthafrica.com" target="_blank" rel="noopener noreferrer" aria-label="South Africa, Brand South Africa (opens in a new tab)" style={{ display: "inline-flex", lineHeight: 0, borderRadius: 3, overflow: "hidden", boxShadow: "0 0 0 1px rgba(0,0,0,.12)" }}>
      <svg viewBox="0 0 90 60" width="66" height="44" aria-hidden="true" focusable="false">
        <defs>
          <clipPath id="za-t">
            <path d="M0 0l45 30L0 60z" />
          </clipPath>
          <clipPath id="za-f">
            <path d="M0 0h90v60H0z" />
          </clipPath>
        </defs>
        <path fill="#E03C31" d="M0 0h90v30H45z" />
        <path fill="#001489" d="M0 60h90V30H45z" />
        <path stroke="#FFFFFF" strokeWidth="20" fill="none" d="M90 30H45L0 0v60l45-30" clipPath="url(#za-f)" />
        <path fill="#000000" stroke="#FFB81C" strokeWidth="20" d="M0 0l45 30L0 60" clipPath="url(#za-t)" />
        <path stroke="#007749" strokeWidth="12" fill="none" d="M0 0l45 30h45M0 60l45-30" clipPath="url(#za-f)" />
      </svg>
    </a>
  )
}

const cleanTitle = (t: string) => t.replace(/[\u200B-\u200D\uFEFF]/g, "").replace(/\s+/g, " ").trim()
const toSeconds = (d: string) => {
  const p = d.trim().split(":").map(Number)
  return p.some(isNaN) ? 0 : p.reduce((a, n) => a * 60 + n, 0)
}
const SNAPSHOT: CrTrack[] = PODCAST_SNAPSHOT.map((e) => ({ url: e.url, title: cleanTitle(e.title), seconds: e.seconds, kind: "talk" as const }))

function parseFeed(xml: string): CrTrack[] {
  const doc = new DOMParser().parseFromString(xml, "application/xml")
  const out: CrTrack[] = []
  Array.from(doc.getElementsByTagName("item")).forEach((item) => {
    const enc = item.getElementsByTagName("enclosure")[0]
    const url = enc && enc.getAttribute("url")
    if (!url) return
    const title = item.getElementsByTagName("title")[0]
    const dur = item.getElementsByTagName("itunes:duration")[0]
    out.push({ url, title: cleanTitle(title ? title.textContent || "" : ""), seconds: dur ? toSeconds(dur.textContent || "") : 0, kind: "talk" })
  })
  return out
}

function usePodcast() {
  const [tracks, setTracks] = React.useState(SNAPSHOT)
  React.useEffect(() => {
    let live = true
    fetch(PODCAST_RSS)
      .then((r) => (r.ok ? r.text() : Promise.reject(new Error(String(r.status)))))
      .then((xml) => {
        const fresh = parseFeed(xml)
        if (live && fresh.length) setTracks(fresh)
      })
      .catch(() => undefined)
    return () => {
      live = false
    }
  }, [])
  return tracks
}

const RED = "#E21C1C"
const BLUE = "#1A80D4"
const GREEN = "#0EA836"
const YELLOW = "#F8C800"
const PINK = "#F9ACBB"
const INK = "#0D0D0D"

function mail(subject: string, body: string) {
  if (typeof window === "undefined") return false
  window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body)
  return true
}

const SHOWS: CrShow[] = [
  {
    id: "render",
    title: "Overnight Render",
    host: "The render farm",
    genres: ["Post"],
    blurb: "Exports, renders and uploads running while Johannesburg sleeps. The machines take the night shift.",
    ink: [BLUE, PINK],
    art: "dots",
    hidden: true,
  },
  {
    id: "call",
    title: "Call Sheet",
    host: "Content production",
    genres: ["Production", "Logistics"],
    blurb: "Crew calls, locations, permits and the weather over Jozi. Every shoot starts here, before the coffee is finished.",
    ink: [YELLOW, BLUE],
    art: "stripes",
    kind: "talk",
    slot: "Weekdays 07:00",
  },
  {
    id: "brief",
    title: "The Brief Room",
    host: "Brand strategy, with Simz Mahlangu",
    genres: ["Strategy", "Brand"],
    blurb: "Your problem, said out loud. We pull the brief apart until the real question falls out, then build the brand thinking around it.",
    ink: [RED, BLUE],
    art: "blocks",
    kind: "talk",
    slot: "Weekdays 09:00",
  },
  {
    id: "idea",
    title: "Big Idea Hour",
    host: "Creative direction",
    genres: ["Campaign", "Creative direction"],
    blurb: "Concepts, scripts and campaign worlds. The hour where a line on a whiteboard becomes something the whole country talks about.",
    ink: [PINK, GREEN],
    art: "rings",
    slot: "Weekdays 11:00",
  },
  {
    id: "set",
    title: "On Set",
    host: "Film direction",
    genres: ["Film", "Direction"],
    blurb: "Trailers, commercials and branded film, directed with the final cut in mind before the camera rolls.",
    ink: [RED, YELLOW],
    art: "bars",
    slot: "Weekdays 13:00",
  },
  {
    id: "frame",
    title: "Frame by Frame",
    host: "Photography and art direction",
    genres: ["Photography", "Art direction"],
    blurb: "Key art, stills and campaign photography. One frame that has to carry the whole story on its own.",
    ink: [GREEN, BLUE],
    art: "dots",
    slot: "Weekdays 15:00",
  },
  {
    id: "suite",
    title: "The Edit Suite",
    host: "Post-production",
    genres: ["Trailer", "Edit", "Grade"],
    blurb: "Edit, grade, sound and motion. Where the footage stops being footage and starts being a film.",
    ink: [BLUE, RED],
    art: "stripes",
    slot: "Weekdays 17:00",
  },
  {
    id: "long",
    title: "Long Form",
    host: "Documentary and series",
    genres: ["Documentary", "Series"],
    blurb: "Stories with room to breathe. Real people, given the time and the care their lives deserve.",
    ink: [YELLOW, RED],
    art: "blocks",
    kind: "talk",
    slot: "Weeknights 20:00",
  },
  {
    id: "night",
    title: "Night Shift",
    host: "Music video",
    genres: ["Music video", "Art direction"],
    blurb: "Music videos for artists who want the picture to hit as hard as the record.",
    ink: [PINK, BLUE],
    art: "rings",
    slot: "Late, most nights",
  },
]

const SCHEDULE = [
  { start: "00:00", show: "render" },
  { start: "07:00", show: "call" },
  { start: "09:00", show: "brief" },
  { start: "11:00", show: "idea" },
  { start: "13:00", show: "set" },
  { start: "15:00", show: "frame" },
  { start: "17:00", show: "suite" },
  { start: "20:00", show: "long" },
  { start: "22:00", show: "night" },
]

// The portfolio, as the archive, in the same order as the Behance profile. Titles are exactly as on Behance; each tile opens its film in a
// video window of its own (the radio player only ever plays the podcast). `date` carries the client;
// `minutes: 0` hides a running time. One of the two African Queen Orchestra videos on Behance
// (YouTube wCnXgzMOeKE) has been taken down, so only the one that still plays is listed.
const CDN = "https://mir-s3-cdn-cf.behance.net/projects/404/"
const BE = "https://www.behance.net/gallery/"
const YT = "https://www.youtube.com/embed/"
const EPISODES = [
  {
    id: "nowaste",
    show: "night",
    title: "TheHawk - NO WASTE",
    date: "TheHawk",
    minutes: 0,
    image: CDN + "466a9d244254055.Y3JvcCwyNzYxLDIxNjAsNTQwLDA.png",
    videos: [YT + "6L1fAept2EY"],
    href: BE + "244254055/TheHawk-NO-WASTE",
  },
  {
    id: "fullhouse",
    show: "idea",
    title: "#ITSAFULLHOUSE | NETFLIX SUMMER",
    date: "Netflix",
    minutes: 0,
    image: CDN + "dc52b2191036337.Y3JvcCwxMzgwLDEwODAsNTgsMA.jpeg",
    videos: [YT + "w1ifw5XtOy0"],
    href: BE + "191036337/ITSAFULLHOUSE-NETFLIX-SUMMER",
  },
  {
    id: "kings",
    show: "set",
    title: "KINGS OF JO'BURG | Season 2 Trailer | Netflix",
    date: "Netflix",
    minutes: 0,
    image: CDN + "7504dc192548399.Y3JvcCwxODQxLDE0NDAsMzU1LDA.jpg",
    videos: ["https://player.vimeo.com/video/797366944?h=5e995de28f"],
    href: BE + "192548399/KINGS-OF-JOBURG-Season-2-Trailer-Netflix",
  },
  {
    id: "summer",
    show: "idea",
    title: "NETFLIX SUMMER",
    date: "Netflix",
    minutes: 0,
    image: CDN + "3a00f4191035767.Y3JvcCw5MjAsNzIwLDIwLDA.jpg",
    videos: [YT + "_w6oE_p3F0c"],
    href: BE + "191035767/NETFLIX-SUMMER",
  },
  {
    id: "yfa",
    show: "suite",
    title: "Young, Famous, & African: Season 2 | Netflix",
    date: "Netflix",
    minutes: 0,
    image: CDN + "fe5c19190953063.Y3JvcCwxMTUwLDkwMCwyMjUsMA.jpg",
    videos: [YT + "QeKsHElEPuY"],
    href: BE + "190953063/Young-Famous-African-Season-2-Netflix",
  },
  {
    id: "aqo",
    show: "call",
    title: "African Queen Orchestra | Queen Charlotte | Netflix",
    date: "Netflix / Shondaland",
    minutes: 0,
    image: CDN + "f9731f191451293.Y3JvcCwxNTAwLDExNzMsMCw0ODI.jpg",
    videos: [YT + "ZdjpLYAs1_M"],
    href: BE + "191451293/African-Queen-Orchestra-Queen-Charlotte-Netflix",
  },
  {
    id: "wife",
    show: "long",
    title: "The Wife: Behind The Veil",
    date: "Showmax",
    minutes: 0,
    image: CDN + "a56162151876065.Y3JvcCwxNzQwLDEzNjEsMTIwLDA.jpg",
    videos: [YT + "RolGwyD6c1k"],
    href: BE + "151876065/The-Wife-Behind-The-Veil",
  },
]

export default function Spacbar() {
  const podcast = usePodcast()
  return (
    <CallsignRadioLanding
      playlist={podcast}
      playlistSync
      preset="daytime"
      mastheadCase="lower"
      theme="light"
      station={{
        name: "the spacbar.",
        callsign: "the spacbar",
        frequency: ".",
        city: "Johannesburg",
        tagline: "A production and creative agency broadcasting from Johannesburg. Film, campaigns, photography and post, made at the sharp edge of culture.",
        timeZone: "Africa/Johannesburg",
      }}
      links={[
        { label: "On air", href: "#listen" },
        { label: "Running order", href: "#schedule" },
        { label: "Services", href: "#residents" },
        { label: "Work", href: "#archive" },
        { label: "Book airtime", href: "#support" },
      ]}
      memberCta="Start a project"
      shows={SHOWS}
      schedule={SCHEDULE}
      episodes={EPISODES}
      palette={{
        light: {
          ground: "#EDE5D5",
          ink: INK,
          muted: "#4D473D",
          line: "rgba(13,13,13,.16)",
          dim: "rgba(13,13,13,.18)",
          tally: "#C8141B",
          onTally: "#FFFFFF",
          panel: "#E4DAC6",
          paper: "#F6F1E7",
        },
        dark: {
          ground: INK,
          ink: "#EDE5D5",
          muted: "#A39D90",
          line: "rgba(237,229,213,.15)",
          dim: "rgba(237,229,213,.2)",
          tally: "#F0342C",
          onTally: "#FFFFFF",
          panel: "#181715",
          paper: "#F6F1E7",
        },
      }}
      listen={{
        title: "Tune in",
        ways: [
          { value: "09+", unit: "Years on air", text: "Making culture-first work out of Johannesburg since 2017." },
          { value: "50+", unit: "Projects delivered", text: "Trailers, campaigns, documentaries and music videos for Netflix, Showmax and more." },
          { value: "011", unit: "Studio", text: "Johannesburg, South Africa. Pull up a chair." },
          { value: "HELLO", unit: "Email", text: EMAIL, href: "mailto:" + EMAIL },
        ],
      }}
      social={{
        title: "Instagram",
        text: "On set, in the edit and everywhere in between.",
        handle: "@thespacbar_za",
        href: INSTAGRAM,
        cta: "@thespacbar_za",
        posts: INSTAGRAM_POSTS,
      }}
      residents={{
        title: "Services",
        text: "Every discipline has its slot in the day. Film direction, creative direction, photography, post and the strategy that holds them together.",
      }}
      archive={{
        title: "Selected work",
        text: "Recent transmissions for Netflix, Showmax, Shondaland and TheHawk. Filter by discipline.",
      }}
      support={{
        title: "Book airtime",
        text: "Drag the dial to the time you have. The list underneath grows with it, and we will tell you straight what fits.",
        currency: "",
        min: 1,
        max: 12,
        start: 4,
        tiers: [
          { name: "Quick cut", amount: 1, perks: ["Edits and social cutdowns from your footage", "Colour grade and sound mix"] },
          { name: "Campaign sprint", amount: 3, perks: ["Creative direction and a campaign idea", "A photography or one-day film shoot"] },
          { name: "Full production", amount: 6, perks: ["Film direction, crew and a multi-day shoot", "Hero film, trailer and the cutdowns"] },
          { name: "Long form", amount: 10, perks: ["Documentary or series production", "Post-production all the way to delivery"] },
        ],
        fallbackPerk: "Edits and social cutdowns from your footage",
        fallbackTier: "Quick cut",
        doneTitle: "Brief drafted. {tier}, coming up.",
        doneText: "Your email app should have opened with the details. Hit send and we will come back to you.",
      }}
      footer={{
        // Footer labels are lower case with a full stop, like the logo; full sentences stay as sentences.
        headingCase: "as-written",
        columns: [
          {
            title: "tune in.",
            links: [
              { label: "on air.", href: "#listen" },
              { label: "running order.", href: "#schedule" },
              { label: "services.", href: "#residents" },
              { label: "selected work.", href: "#archive" },
            ],
          },
          {
            title: "elsewhere.",
            links: [
              { label: "#playmrvl podcast.", href: PODCAST_PAGE },
              { label: "behance.", href: "https://www.behance.net/holasimzmrvl" },
              { label: "instagram.", href: INSTAGRAM },
            ],
          },
        ],
        addressTitle: "studio.",
        address: ["the spacbar.", "johannesburg.", "south africa."],
        email: EMAIL,
        newsletterTitle: "the transmission.",
        newsletterText: "One email when new work goes to air. No spam, no static.",
        successText: "Your email app has the request. Send it and you are on the frequency.",
        legal: "the spacbar. production and creative agency, est. 2017.",
        legalEnd: <SouthAfricaFlag />,
      }}
      labels={{
        today: "Today at",
        later: "Later at the studio",
        earlier: "Earlier at the studio",
        listenBack: "Watch the film",
        remindAt: "Book a call at",
        reminderSet: "Email drafted for",
        reminderRetry: "Try booking again",
        archive: "Work",
        viewProject: "View on Behance",
        monthly: "Retainer",
        once: "One project",
        perMonth: "weeks, on retainer",
        perOnce: "weeks, one project",
        give: "Book",
        sending: "Opening your email",
        changeAmount: "Change the timeline",
        emptyArchive: "Nothing in this discipline yet. Pick another one.",
        emailLabel: "email address.",
        subscribe: "tune in.",
        subscribing: "opening your email.",
      }}
      onRemind={(show, start) =>
        mail("Booking the " + start + " slot: " + show.title, "Hi the spacbar.,\n\nI'd like a call at " + start + " (Johannesburg time) about " + show.host.toLowerCase() + ".\n\nProject:\nTimeline:\nBudget range:\n\nThanks,\n")
      }
      onSupport={(weeks, cadence, tier) =>
        mail(
          "New brief: " + (tier ? tier.name : "Quick cut") + ", " + weeks + " weeks",
          "Hi the spacbar.,\n\nWe have about " + weeks + " weeks" + (cadence === "monthly" ? " a month, on retainer" : " for one project") + ".\nWhat we have in mind: " + (tier ? tier.name : "Quick cut") + ".\n\nThe brief:\nDeliverables:\nBudget range:\n\nThanks,\n"
        )
      }
      onSubscribe={(email) => mail("Subscribe me to The transmission", "Please add " + email + " to The transmission.")}
    />
  )
}
