// Snapshot the #PLAYMRVL podcast feed into src/podcast.json.
// The site also reads the feed live in the browser (Anchor sends CORS headers), so new
// episodes appear on their own; this snapshot is the fallback if that request fails.
// Run: npm run podcast
import { writeFileSync } from "node:fs"

const FEED = "https://anchor.fm/s/b92db68/podcast/rss"

const decode = (s) =>
  s
    .replace(/^<!\[CDATA\[|\]\]>$/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/[​-‍﻿]/g, "")
    .trim()

const seconds = (d) => {
  if (!d) return 0
  const p = d.trim().split(":").map(Number)
  return p.some(isNaN) ? 0 : p.reduce((a, n) => a * 60 + n, 0)
}

const res = await fetch(FEED)
if (!res.ok) throw new Error("Feed returned " + res.status)
const xml = await res.text()
const tracks = []
for (const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
  const item = m[1]
  const tag = (name) => {
    const t = new RegExp("<" + name + "(?:\\s[^>]*)?>([\\s\\S]*?)</" + name + ">").exec(item)
    return t ? decode(t[1]) : ""
  }
  const url = (/<enclosure[^>]*\burl="([^"]+)"/.exec(item) || [])[1]
  if (!url) continue
  tracks.push({
    url: decode(url),
    title: tag("title"),
    seconds: seconds(tag("itunes:duration")),
    explicit: tag("itunes:explicit") === "true" || tag("itunes:explicit") === "yes",
    date: tag("pubDate"),
  })
}
if (!tracks.length) throw new Error("No episodes with audio in the feed")
writeFileSync(new URL("../src/podcast.json", import.meta.url), JSON.stringify(tracks, null, 2) + "\n")
console.log("Saved " + tracks.length + " episodes to src/podcast.json")
