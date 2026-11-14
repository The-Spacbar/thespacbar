import * as React from "react"
import CallsignRadioLanding, { type CrShow } from "./callsign-radio-landing"

// the spacbar., tuned like a station. The agency runs as 011 FM out of
// Johannesburg: services are the shows, the studio day is the running order,
// the portfolio is the archive, and the support tuner books airtime (a project
// timeline) instead of taking donations. Every action that would "send"
// something opens a pre-filled email, so nothing pretends to submit.

const EMAIL = "hello@thespacbar.com"

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

// The portfolio, as the archive. `date` carries the client; `minutes: 0` hides a running time.
const CDN = "https://mir-s3-cdn-cf.behance.net/projects/404/"
const EPISODES = [
  { id: "kings", show: "set", title: "Kings of Jo'burg, season two trailer", date: "Netflix", minutes: 0, image: CDN + "7504dc192548399.Y3JvcCwxODQxLDE0NDAsMzU1LDA.jpg" },
  { id: "fullhouse", show: "idea", title: "#itsafullhouse", date: "Netflix", minutes: 0, image: CDN + "dc52b2191036337.Y3JvcCwxMzgwLDEwODAsNTgsMA.jpeg" },
  { id: "yfa", show: "suite", title: "Young, Famous & African, season two trailer", date: "Netflix", minutes: 0, image: CDN + "fe5c19190953063.Y3JvcCwxMTUwLDkwMCwyMjUsMA.jpg" },
  { id: "aqo", show: "call", title: "African Queen Orchestra", date: "Netflix / Shondaland", minutes: 0, image: CDN + "f9731f191451293.Y3JvcCwxNTAwLDExNzMsMCw0ODI.jpg" },
  { id: "wife", show: "long", title: "The Wife: Behind the Veil", date: "Showmax", minutes: 0, image: CDN + "a56162151876065.Y3JvcCwxNzQwLDEzNjEsMTIwLDA.jpg" },
  { id: "summer", show: "idea", title: "Netflix summer campaign", date: "Netflix", minutes: 0, image: CDN + "3a00f4191035767.Y3JvcCw5MjAsNzIwLDIwLDA.jpg" },
  { id: "nowaste", show: "night", title: "No Waste", date: "TheHawk", minutes: 0, image: CDN + "466a9d244254055.Y3JvcCwyNzYxLDIxNjAsNTQwLDA.png" },
]

export default function Spacbar() {
  return (
    <CallsignRadioLanding
      preset="daytime"
      theme="light"
      station={{
        name: "the spacbar.",
        callsign: "SPACBAR",
        frequency: "011",
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
          { value: "08+", unit: "Years on air", text: "Making culture-first work out of Johannesburg since 2018." },
          { value: "50+", unit: "Projects delivered", text: "Trailers, campaigns, documentaries and music videos for Netflix, Showmax and more." },
          { value: "011", unit: "Studio", text: "Johannesburg, South Africa. Pull up a chair." },
          { value: "HELLO", unit: "Email", text: EMAIL, href: "mailto:" + EMAIL },
        ],
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
        columns: [
          {
            title: "Tune in",
            links: [
              { label: "On air", href: "#listen" },
              { label: "Running order", href: "#schedule" },
              { label: "Services", href: "#residents" },
              { label: "Selected work", href: "#archive" },
            ],
          },
          {
            title: "Elsewhere",
            links: [
              { label: "Behance", href: "https://www.behance.net/holasimzmrvl" },
              { label: "Instagram", href: "https://instagram.com/simzmrvlco" },
              { label: "Twitter", href: "https://twitter.com/HOLASIMZMRVL" },
              { label: "YouTube", href: "https://www.youtube.com/channel/UClEk6tPYsauNfT83fTtjrEg" },
            ],
          },
        ],
        addressTitle: "Studio",
        address: ["the spacbar.", "Johannesburg", "South Africa"],
        email: EMAIL,
        newsletterTitle: "The transmission",
        newsletterText: "One email when new work goes to air. No spam, no static.",
        successText: "Your email app has the request. Send it and you are on the frequency.",
        legal: "the spacbar. Production and creative agency, est. 2018.",
      }}
      labels={{
        today: "Today at",
        later: "Later at the studio",
        earlier: "Earlier at the studio",
        listenBack: "Replay the work",
        remindAt: "Book a call at",
        reminderSet: "Email drafted for",
        reminderRetry: "Try booking again",
        archive: "Work",
        monthly: "Retainer",
        once: "One project",
        perMonth: "weeks, on retainer",
        perOnce: "weeks, one project",
        give: "Book",
        sending: "Opening your email",
        changeAmount: "Change the timeline",
        emptyArchive: "Nothing in this discipline yet. Pick another one.",
        subscribe: "Tune in",
        subscribing: "Opening your email",
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
