"use client";

import React from "react";

/* ─────────────────────────────────────────────────────────────────────────
   Constellation — stars on cards, joined by lines that never cross a card.

   A section lays its cards out in normal flow (a staggered grid), then
   hands their elements to useConstellation. The hook reads card rects and
   each card's `[data-media]` rect from the DOM (ResizeObserver), asks the
   caller which edges make the figure, and places one star per card on
   whichever candidate point keeps every line clear of every card — its
   own and its neighbours'. ConstellationLines / ConstellationStars draw
   the result; both sit in the section's root, which carries the
   `.constellation` class (styles in globals.css).

   Motion: the figure traces itself once when it first comes into view
   ([data-drawn], staggered by edge order) and stars ignite with it.
   Hover/focus lights a star and its lines in an accent and dims the rest.
   Stroke/opacity/transform only — no WebGL, no blur, no per-frame JS.
   ───────────────────────────────────────────────────────────────────────── */

export type Point = { x: number; y: number };
export type Rect = { x: number; y: number; w: number; h: number };
export type Edge = [number, number];
export type Accent = { light: string; dark: string };

export type Geometry = {
    w: number;
    h: number;
    stars: Point[];
    cards: Rect[];
    edges: Edge[];
};

const inset = (r: Rect, d: number): Rect => ({ x: r.x + d, y: r.y + d, w: r.w - 2 * d, h: r.h - 2 * d });

/** Does segment a→b pass through rect r? (Liang–Barsky clip.) */
function crosses(a: Point, b: Point, r: Rect) {
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const p = [-dx, dx, -dy, dy];
    const q = [a.x - r.x, r.x + r.w - a.x, a.y - r.y, r.y + r.h - a.y];
    let t0 = 0;
    let t1 = 1;
    for (let i = 0; i < 4; i++) {
        if (p[i] === 0) {
            if (q[i] < 0) return false;
            continue;
        }
        const t = q[i] / p[i];
        if (p[i] < 0) {
            if (t > t1) return false;
            if (t > t0) t0 = t;
        } else {
            if (t < t0) return false;
            if (t < t1) t1 = t;
        }
    }
    return t1 - t0 > 1e-3;
}

/** The four corners of a rect: tl, tr, bl, br. */
export const cornersOf = (r: Rect): Point[] => [
    { x: r.x, y: r.y },
    { x: r.x + r.w, y: r.y },
    { x: r.x, y: r.y + r.h },
    { x: r.x + r.w, y: r.y + r.h },
];

/* Try every combination of candidate points (mixed radix — 6^5 or 4^7 is
   a few ms on resize): crossings dominate the score, then total line
   length, so the figure stays tight. A line leaving its own card is
   tested from 24px out against the card grown by 3px — it can't run into
   the card or along its edge, but may leave a corner steeply. Other cards
   get a 12px berth throughout. */
function placeStars(candidates: Point[][], cards: Rect[], edges: Edge[]): Point[] {
    const n = candidates.length;
    const own = cards.map((r) => inset(r, -3));
    const others = cards.map((r) => inset(r, -12));
    const trim = (from: Point, to: Point): Point => {
        const len = Math.hypot(to.x - from.x, to.y - from.y) || 1;
        const t = Math.min(24 / len, 0.5);
        return { x: from.x + (to.x - from.x) * t, y: from.y + (to.y - from.y) * t };
    };
    const total = candidates.reduce((m, c) => m * c.length, 1);
    let best: number[] = Array(n).fill(0);
    let bestScore = Infinity;
    const pick: number[] = Array(n).fill(0);
    for (let combo = 0; combo < total; combo++) {
        for (let i = 0, c = combo; i < n; i++) {
            pick[i] = c % candidates[i].length;
            c = Math.floor(c / candidates[i].length);
        }
        let score = 0;
        for (const [a, b] of edges) {
            const A = candidates[a][pick[a]];
            const B = candidates[b][pick[b]];
            for (let k = 0; k < n; k++) {
                const hit =
                    k === a
                        ? crosses(trim(A, B), B, own[k])
                        : k === b
                          ? crosses(A, trim(B, A), own[k])
                          : crosses(A, B, others[k]);
                if (hit) score += 1e6;
            }
            score += Math.hypot(B.x - A.x, B.y - A.y);
            if (score >= bestScore) break;
        }
        if (score < bestScore) {
            bestScore = score;
            best = pick.slice();
        }
    }
    return candidates.map((c, i) => c[best[i]]);
}

/** The shortest single path through every card centre — a figure that
    fits any layout. A path, not a tree: a star on one corner can serve
    two lines but rarely three spread in different directions (a tree's
    hubs forced lines through their own card). Brute force up to 8 cards
    (8! orders, a few ms), nearest-neighbour beyond. The shortest path
    never crosses itself. Edge order = path order, so it traces end to end. */
export function pathEdges(cards: Rect[]): Edge[] {
    const n = cards.length;
    if (n < 2) return [];
    const c = cards.map((r) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 }));
    const dist = (a: number, b: number) => Math.hypot(c[a].x - c[b].x, c[a].y - c[b].y);

    let order: number[] = [];
    if (n <= 8) {
        let best = Infinity;
        const used = Array(n).fill(false);
        const cur: number[] = [];
        const walk = (len: number) => {
            if (len >= best) return;
            if (cur.length === n) {
                best = len;
                order = cur.slice();
                return;
            }
            for (let i = 0; i < n; i++) {
                if (used[i]) continue;
                used[i] = true;
                cur.push(i);
                walk(len + (cur.length > 1 ? dist(cur[cur.length - 2], i) : 0));
                cur.pop();
                used[i] = false;
            }
        };
        walk(0);
    } else {
        order = [0];
        const left = new Set(cards.map((_, i) => i).slice(1));
        while (left.size) {
            const last = order[order.length - 1];
            let next = -1;
            for (const i of left) if (next < 0 || dist(last, i) < dist(last, next)) next = i;
            order.push(next);
            left.delete(next);
        }
    }
    /* Start from the end nearer the first card, so the trace begins there. */
    if (order.indexOf(0) > n / 2) order.reverse();
    return order.slice(1).map((b, k) => [order[k], b] as Edge);
}

export function useConstellation({
    rootRef,
    itemRefs,
    count,
    candidates,
    edges,
}: {
    rootRef: React.RefObject<HTMLElement | null>;
    itemRefs: React.RefObject<(HTMLElement | null)[]>;
    /** Number of cards — re-measures when it changes (e.g. after a fetch). */
    count: number;
    /** Where a card's star may sit. Must be a stable (module-level) function. */
    candidates: (media: Rect, card: Rect) => Point[];
    /** The figure for the measured layout. Must be stable. Return [] for stars only. */
    edges: (cards: Rect[], wide: boolean) => Edge[];
}) {
    const [geo, setGeo] = React.useState<Geometry | null>(null);
    const [drawn, setDrawn] = React.useState(false);

    React.useEffect(() => {
        const root = rootRef.current;
        if (!root || count === 0) return;
        const wide = window.matchMedia("(min-width: 1024px)");

        const measure = () => {
            const rb = root.getBoundingClientRect();
            const rel = (el: Element | null | undefined): Rect => {
                const r = el?.getBoundingClientRect();
                return r
                    ? { x: r.left - rb.left, y: r.top - rb.top, w: r.width, h: r.height }
                    : { x: 0, y: 0, w: 0, h: 0 };
            };
            const items = itemRefs.current.slice(0, count);
            const cards = items.map(rel);
            const media = items.map((el) => rel(el?.querySelector("[data-media]")));
            const e = edges(cards, wide.matches);
            setGeo({
                w: rb.width,
                h: rb.height,
                stars: placeStars(
                    media.map((m, i) => candidates(m, cards[i])),
                    cards,
                    e
                ),
                cards,
                edges: e,
            });
        };

        measure();
        const ro = new ResizeObserver(measure);
        ro.observe(root);
        itemRefs.current.slice(0, count).forEach((el) => el && ro.observe(el));
        wide.addEventListener("change", measure);
        return () => {
            ro.disconnect();
            wide.removeEventListener("change", measure);
        };
    }, [rootRef, itemRefs, count, candidates, edges]);

    /* Trace the figure once, the first time it's on screen. */
    React.useEffect(() => {
        const root = rootRef.current;
        if (!root || !geo || drawn) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (!e.isIntersecting) return;
                setDrawn(true);
                io.disconnect();
            },
            { threshold: 0.15 }
        );
        io.observe(root);
        return () => io.disconnect();
    }, [rootRef, geo, drawn]);

    return { geo, drawn };
}

/** The lines — render first inside the root, before the cards. Masked by
    the card rects as a fallback for a layout with no clean placement. */
export function ConstellationLines({
    geo,
    active,
    accent,
}: {
    geo: Geometry | null;
    active: number | null;
    accent?: Accent;
}) {
    const maskId = `constellation-${React.useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
    if (!geo) return null;
    return (
        <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            viewBox={`0 0 ${geo.w} ${geo.h}`}
            style={
                accent
                    ? ({ "--accent-light": accent.light, "--accent-dark": accent.dark } as React.CSSProperties)
                    : undefined
            }
        >
            <defs>
                <mask id={maskId} maskUnits="userSpaceOnUse">
                    <rect x={-50} y={-50} width={geo.w + 100} height={geo.h + 100} fill="white" />
                    {geo.cards.map((r, i) => (
                        <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="black" />
                    ))}
                </mask>
            </defs>
            <g mask={`url(#${maskId})`}>
                {geo.edges.map(([a, b], k) => {
                    const A = geo.stars[a];
                    const B = geo.stars[b];
                    if (!A || !B) return null;
                    const state =
                        active === null ? "idle" : active === a || active === b ? "lit" : "dim";
                    return (
                        <line
                            key={`${a}-${b}`}
                            x1={A.x}
                            y1={A.y}
                            x2={B.x}
                            y2={B.y}
                            pathLength={1}
                            data-state={state}
                            className="constellation__line"
                            style={{ "--d": `${0.15 + k * 0.28}s` } as React.CSSProperties}
                        />
                    );
                })}
            </g>
        </svg>
    );
}

/** The stars — render last inside the root so they sit above the cards. */
export function ConstellationStars({
    geo,
    active,
    accentOf,
}: {
    geo: Geometry | null;
    active: number | null;
    accentOf: (i: number) => Accent;
}) {
    if (!geo) return null;
    return (
        <>
            {geo.stars.map((s, i) => {
                const accent = accentOf(i);
                return (
                    <span
                        key={i}
                        aria-hidden="true"
                        data-lit={i === active ? "" : undefined}
                        className="constellation__star pointer-events-none absolute"
                        style={
                            {
                                left: s.x,
                                top: s.y,
                                "--d": `${0.1 + i * 0.22}s`,
                                "--accent-light": accent.light,
                                "--accent-dark": accent.dark,
                            } as React.CSSProperties
                        }
                    />
                );
            })}
        </>
    );
}
