// Refresh assets/instagram.json from the Behold feed for @thespacbar_za.
// The deploy workflow runs this once a day (and on every push), so visitors read the saved copy
// and never use up Behold's monthly view allowance. Run locally with: npm run instagram
//
// Set the feed URL in instagram.config.json ("beholdFeedUrl"), or in the INSTAGRAM_FEED_URL
// environment variable. Without one, or if Behold can't be reached, the existing file is kept.
import { readFileSync, writeFileSync, existsSync } from "node:fs"

const root = new URL("../", import.meta.url)
const out = new URL("assets/instagram.json", root)
const config = JSON.parse(readFileSync(new URL("instagram.config.json", root), "utf8"))
const feed = (process.env.INSTAGRAM_FEED_URL || config.beholdFeedUrl || "").trim()
const max = Number(config.maxPosts) || 12

if (!feed) {
  console.log("No Behold feed URL set in instagram.config.json; keeping the current posts.")
  if (!existsSync(out)) writeFileSync(out, "[]\n")
  process.exit(0)
}

try {
  const res = await fetch(feed)
  if (!res.ok) throw new Error("Behold answered " + res.status)
  const data = await res.json()
  // Behold's JSON is { posts: [...] } (older feeds: a bare array)
  const list = Array.isArray(data) ? data : Array.isArray(data.posts) ? data.posts : []
  const posts = list
    .map((p) => {
      const sizes = p.sizes || {}
      const pick = (k) => (sizes[k] && sizes[k].mediaUrl) || ""
      const video = p.mediaType === "VIDEO" || p.isReel === true
      const image = pick("medium") || pick("large") || pick("small") || (video ? p.thumbnailUrl : p.mediaUrl) || p.thumbnailUrl || ""
      return {
        url: p.permalink || "",
        image,
        video,
        caption: String(p.prunedCaption || p.caption || "").replace(/\s+/g, " ").trim().slice(0, 200),
      }
    })
    .filter((p) => p.url && p.image)
    .slice(0, max)
  if (!posts.length) throw new Error("the feed had no usable posts")
  writeFileSync(out, JSON.stringify(posts, null, 2) + "\n")
  console.log("Saved " + posts.length + " Instagram posts to assets/instagram.json")
} catch (e) {
  // a hiccup at Behold must never break the deploy: keep yesterday's posts
  console.log("Could not refresh Instagram posts (" + e.message + "); keeping the current file.")
  if (!existsSync(out)) writeFileSync(out, "[]\n")
}
