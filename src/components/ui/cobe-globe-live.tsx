"use client"

// A WebGL globe (cobe v2) for the hero's artwork slot, adapted from the 21st.dev "cobe-globe-live"
// component. Changes from the original:
// - no Tailwind: its three utility classes are inline styles (this project has no Tailwind);
// - no invented "N watching" counter: labels show real place names;
// - `focus` turns the globe to a marker (eased, or instantly under reduced motion) and drag
//   returns there two seconds after you let go; `arcs`, `colors` and `dark` follow props live;
// - labels use CSS Anchor Positioning only where the browser supports it (else they would stack
//   in the corner), and the globe pauses while off screen.

import { useEffect, useRef, useState } from "react"
import createGlobe from "cobe"

type RGB = [number, number, number]

export interface LiveMarker {
  id: string
  location: [number, number]
  /** Shown in the marker's label. */
  label?: string
  /** Pulse the label's dot and print LIVE. */
  live?: boolean
  color?: RGB
  size?: number
}

export interface LiveArc {
  id: string
  from: [number, number]
  to: [number, number]
}

export interface GlobeColors {
  base: RGB
  marker: RGB
  glow: RGB
  arc: RGB
}

interface GlobeLiveProps {
  markers?: LiveMarker[]
  arcs?: LiveArc[]
  /** Marker id to turn to. Without one the globe drifts slowly. */
  focus?: string
  colors?: Partial<GlobeColors>
  dark?: boolean
  /** Reduced motion: no drift, no easing. */
  still?: boolean
  className?: string
  style?: React.CSSProperties
  /** Idle drift, radians per frame, when there is no focus. */
  speed?: number
}

const defaultMarkers: LiveMarker[] = [
  { id: "sf", location: [37.78, -122.44], label: "San Francisco" },
  { id: "london", location: [51.51, -0.13], label: "London" },
  { id: "tokyo", location: [35.68, 139.65], label: "Tokyo" },
]

const LIGHT: GlobeColors = { base: [0.95, 0.95, 0.95], marker: [0.9, 0.2, 0.2], glow: [0.94, 0.93, 0.91], arc: [0.9, 0.3, 0.3] }
const DARK: GlobeColors = { base: [0.32, 0.32, 0.3], marker: [0.95, 0.25, 0.2], glow: [0.12, 0.12, 0.11], arc: [0.95, 0.3, 0.25] }

/** cobe's phi/theta that put a [lat, lon] in the middle of the globe. */
function anglesFor([lat, lon]: [number, number]) {
  return { phi: Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2), theta: (lat * Math.PI) / 180 }
}

/** Shortest way round from a to b, so the globe never spins the long way. */
function nearestAngle(from: number, to: number) {
  const tau = Math.PI * 2
  return from + ((((to - from) % tau) + tau * 1.5) % tau) - Math.PI
}

const anchorsSupported = () => typeof CSS !== "undefined" && typeof CSS.supports === "function" && CSS.supports("anchor-name: --cobe-test")

export function GlobeLive({ markers = defaultMarkers, arcs = [], focus, colors, dark = false, still = false, className = "", style, speed = 0.003 }: GlobeLiveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null)
  const drag = useRef<{ x: number; y: number; phi: number; theta: number } | null>(null)
  const view = useRef({ phi: 0, theta: 0.25 })
  const target = useRef<{ phi: number; theta: number } | null>(null)
  const resumeAt = useRef(0)
  const [labels, setLabels] = useState(false)

  const palette: GlobeColors = { ...(dark ? DARK : LIGHT), ...(colors || {}) }
  const opts = useRef({ markers, arcs, palette, dark, still, speed })
  opts.current = { markers, arcs, palette, dark, still, speed }

  useEffect(() => setLabels(anchorsSupported()), [])

  // where to turn to
  useEffect(() => {
    const m = markers.find((x) => x.id === focus)
    if (!m) {
      target.current = null
      return
    }
    const a = anglesFor(m.location)
    // keep a slight tilt towards the viewer so the focus sits a little above centre
    target.current = { phi: nearestAngle(view.current.phi, a.phi), theta: Math.max(-0.6, Math.min(0.9, a.theta * 0.75)) }
    resumeAt.current = 0
    if (still) view.current = { ...target.current }
  }, [focus, markers, still])

  // build the globe once; everything else streams in through update()
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let raf = 0
    let visible = true
    let ro: ResizeObserver | null = null

    const toCobe = () => {
      const o = opts.current
      return {
        dark: o.dark ? 1 : 0,
        baseColor: o.palette.base,
        markerColor: o.palette.marker,
        glowColor: o.palette.glow,
        arcColor: o.palette.arc,
        markers: o.markers.map((m) => ({ location: m.location, size: m.size || 0.04, id: m.id, color: m.color })),
        arcs: o.arcs.map((a) => ({ from: a.from, to: a.to, id: a.id })),
      }
    }

    const init = () => {
      const width = canvas.offsetWidth
      if (!width || globeRef.current) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      globeRef.current = createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: width * dpr,
        height: width * dpr,
        phi: view.current.phi,
        theta: view.current.theta,
        diffuse: 1.4,
        mapSamples: 16000,
        mapBrightness: opts.current.dark ? 5 : 8,
        markerElevation: 0.02,
        arcWidth: 0.6,
        arcHeight: 0.3,
        opacity: 0.85,
        ...toCobe(),
      })
      const frame = () => {
        raf = requestAnimationFrame(frame)
        if (!visible || !globeRef.current) return
        const o = opts.current
        const v = view.current
        const t = target.current
        if (!drag.current) {
          if (t && Date.now() >= resumeAt.current) {
            if (o.still) {
              v.phi = t.phi
              v.theta = t.theta
            } else {
              v.phi += (t.phi - v.phi) * 0.06
              v.theta += (t.theta - v.theta) * 0.06
            }
          } else if (!t && !o.still) v.phi += o.speed
        }
        globeRef.current.update({ phi: v.phi, theta: v.theta, ...toCobe() })
      }
      frame()
      requestAnimationFrame(() => (canvas.style.opacity = "1"))
    }

    if (canvas.offsetWidth > 0) init()
    else if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver((es) => {
        if (es[0] && es[0].contentRect.width > 0) {
          ro && ro.disconnect()
          init()
        }
      })
      ro.observe(canvas)
    }
    // pause the WebGL loop while the globe is off screen
    const io = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver((es) => (visible = !!es[0] && es[0].isIntersecting)) : null
    if (io) io.observe(canvas)

    return () => {
      cancelAnimationFrame(raf)
      if (ro) ro.disconnect()
      if (io) io.disconnect()
      if (globeRef.current) globeRef.current.destroy()
      globeRef.current = null
    }
  }, [])

  // dragging
  useEffect(() => {
    const move = (e: PointerEvent) => {
      const d = drag.current
      if (!d) return
      view.current.phi = d.phi + (e.clientX - d.x) / 200
      view.current.theta = Math.max(-1.2, Math.min(1.2, d.theta + (e.clientY - d.y) / 400))
    }
    const up = () => {
      if (!drag.current) return
      drag.current = null
      if (canvasRef.current) canvasRef.current.style.cursor = "grab"
      // settle back on the selected place after a moment
      resumeAt.current = Date.now() + 2000
      if (target.current) target.current = { ...target.current, phi: nearestAngle(view.current.phi, target.current.phi) }
    }
    window.addEventListener("pointermove", move, { passive: true })
    window.addEventListener("pointerup", up, { passive: true })
    window.addEventListener("pointercancel", up, { passive: true })
    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", up)
      window.removeEventListener("pointercancel", up)
    }
  }, [])

  return (
    <div className={className} style={{ position: "relative", aspectRatio: "1 / 1", userSelect: "none", ...style }}>
      <style>{`@keyframes cobe-live-pulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, y: e.clientY, phi: view.current.phi, theta: view.current.theta }
          e.currentTarget.style.cursor = "grabbing"
        }}
        style={{ width: "100%", height: "100%", cursor: "grab", opacity: 0, transition: "opacity 1.2s ease", borderRadius: "50%", touchAction: "none", display: "block" }}
      />
      {labels
        ? markers
            .filter((m) => m.label)
            .map((m) => (
              <div
                key={m.id}
                aria-hidden="true"
                style={
                  {
                    position: "absolute",
                    positionAnchor: `--cobe-${m.id}`,
                    bottom: "anchor(top)",
                    left: "anchor(center)",
                    translate: "-50% 0",
                    marginBottom: 8,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    padding: "0.35rem 0.6rem",
                    background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                    borderRadius: 4,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                    pointerEvents: "none",
                    whiteSpace: "nowrap",
                    opacity: `var(--cobe-visible-${m.id}, 0)`,
                    filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
                    transition: "opacity 0.4s, filter 0.4s",
                  } as React.CSSProperties
                }
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: m.live ? "#ff3b30" : "rgba(255,255,255,.55)",
                    boxShadow: m.live ? "0 0 8px #ff3b30" : "none",
                    animation: m.live && !still ? "cobe-live-pulse 1.5s ease-in-out infinite" : "none",
                  }}
                />
                {m.live ? <span style={{ fontFamily: "monospace", fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.1em", color: "#ff3b30" }}>LIVE</span> : null}
                <span
                  style={{
                    fontFamily: "system-ui, sans-serif",
                    fontSize: "0.65rem",
                    color: "rgba(255,255,255,0.8)",
                    paddingLeft: m.live ? "0.4rem" : 0,
                    borderLeft: m.live ? "1px solid rgba(255,255,255,0.2)" : "none",
                  }}
                >
                  {m.label}
                </span>
              </div>
            ))
        : null}
    </div>
  )
}
