"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import gsap from "gsap";
import * as THREE from "three";
import {
    motion,
    useMotionValueEvent,
    useReducedMotion,
    useScroll,
    useTransform,
} from "framer-motion";
import { LockSimple } from "@phosphor-icons/react";
import { useCaseStudyExpand } from "@/app/components/PageTransition";

import Audit360Thumb from "../../../../public/audit360_thumbnail.png";
import BCASThumb from "../../../../public/bcas_thumbnail.png";
import SecureHubThumb from "../../../../public/securehub_thumbnail.png";
import OroThumbnail from "../../../../public/oro_thumbnail.png";
import HaulkarThumbnail from "../../../../public/haulkar_thumbnail.png";

/* ─────────────────────────────────────────────────────────────────────────
   WorkShowcase — the home page's case-study section as a scroll-driven
   showcase: the full-viewport card pins while the visitor scrolls, and
   scroll position scrubs the WebGL "liquid glass" wipe from one project
   to the next. Every case study is reached by simply continuing to
   scroll — no clicking through options, no autoplay timer racing the
   reader. Scrolling back rewinds the same wipe; the section is a strip
   of film the visitor drags through at their own pace.

   Geometry: the section is a tall runway (~480vh); a sticky h-screen
   viewport inside it holds the card + rail. Progress through the runway
   maps to a position on the strip: each step is DWELL (card at rest,
   readable) then WIPE (the shader scrubs to the next slide). The last
   slide's dwell is the runway's tail, so it holds before unpinning.

   Modes, decided once on mount:
     · webgl — desktop with motion allowed. Canvas paints the slides and
       the shader wipe is scrubbed by scroll. Renders happen only when
       scroll actually moves the wipe — a resting frame costs no GPU.
     · fade  — phones, reduced motion, or no WebGL context. Same scroll
       mapping and content, plain crossfade at the wipe midpoint (which
       prefers-reduced-motion collapses to an instant swap via the
       global CSS rule).

   The GL context and its five textures are created only when the runway
   approaches the viewport (IntersectionObserver, one viewport out) — the
   landing's first paint and the site loader never pay for them.

   The whole slide is a link into the active case study, handed to the
   same card-expand veil transition as before. Per-project accent color
   appears only on that project's own progress line — the One Hue Rule
   scoped to the active slide.
   ───────────────────────────────────────────────────────────────────────── */

type Project = {
    name: string;
    label: string;
    /** Behind the password gate — flagged on the card so the lock isn't a surprise. */
    locked?: boolean;
    title: string;
    outcome: string;
    keypoints: string[];
    image: StaticImageData;
    imageAlt: string;
    href: string;
    /** The project's accent pair from DESIGN.md — spent only on this
        project's own progress line while it is the active slide. The rail
        sits on the page background now, so each theme needs its own end of
        the ramp: deep on light, pale on dark. */
    accentLight: string;
    accentDark: string;
};

const PROJECTS: Project[] = [
    {
        name: "Audit360",
        label: "Audit360 · Government of India",
        title: "Rewriting a national UX standard so a machine could read it",
        outcome:
            "A 480-guideline government standard couldn't be measured by anything. I rebuilt it as a 22-field schema, then shipped the platform that runs on it.",
        keypoints: ["Government Compliance Platform", "480-Rule Standard Rewritten", "Team of Four, In Production"],
        image: Audit360Thumb,
        imageAlt: "Audit360 UX compliance dashboard, shown on a laptop at a desk lit by purple ambient light",
        href: "/case-study/audit360",
        locked: true,
        accentLight: "#6d28d9",
        accentDark: "#ede9fe",
    },
    {
        name: "BCAS",
        label: "BCAS · Government of India",
        title: "Winning a national aviation-security pitch with zero engineers",
        outcome:
            "An AI-first workflow turned a forked prototype into a production-ready government platform.",
        keypoints: ["Government Security Platform", "AI-Powered Design Workflow", "4 Designers, 0 Engineers"],
        image: BCASThumb,
        imageAlt: "BCAS aviation security platform dashboard, shown on a monitor overlooking an Indian monument at sunset",
        href: "/case-study/bcas",
        accentLight: "#005197",
        accentDark: "#e0edfa",
    },
    {
        name: "Secure Hub",
        label: "Secure Hub · Cybersecurity",
        title: "Designing the way companies manage & monitor employees",
        outcome:
            "A first-principles take on employee monitoring for a cybersecurity web platform.",
        keypoints: ["Web Application Design", "Cyber Security Domain", "First Principles Thinking"],
        image: SecureHubThumb,
        imageAlt: "Secure Hub employee monitoring dashboard, shown on a monitor at a lakeside desk",
        href: "/case-study/securehub",
        accentLight: "#134e4a",
        accentDark: "#ccfbf1",
    },
    {
        name: "Oro",
        label: "Oro · Fintech",
        title: "Digitizing and maximizing India's gold-loan potential",
        outcome:
            "Redefined how people get gold loans in India — and lifted conversion along the way.",
        keypoints: ["Mobile Application Design", "Finance Tech Domain", "Achieved Higher Conversion"],
        image: OroThumbnail,
        imageAlt: "Oro gold loan mobile app screens, held in hand against a Hyderabad sunset skyline",
        href: "/case-study/oro",
        accentLight: "#b45309",
        accentDark: "#fde68a",
    },
    {
        name: "Haulkar",
        label: "Haulkar · Gig Logistics",
        title: "Simplifying gig jobs in logistics",
        outcome:
            "A mobile platform for temporary delivery jobs that eases discovery and cuts attrition.",
        keypoints: ["Mobile Application Design", "Simplify Job Discovery", "Decrease Attrition Rate"],
        image: HaulkarThumbnail,
        imageAlt: "Haulkar gig logistics app screens, held in hand by a delivery rider",
        href: "/case-study/haulkar",
        accentLight: "#1d4ed8",
        accentDark: "#93c5fd",
    },
];

const STEPS = PROJECTS.length - 1;
/** Scroll runway consumed by one dwell+wipe step, in vh. */
const STEP_VH = 80;
/** Extra runway after the last wipe so the final slide holds while pinned. */
const TAIL_VH = 60;
/** Fraction of a step the card rests before the wipe begins. */
const DWELL = 0.4;

/* The Lumina glass wipe, reduced to what it actually uses: a circular
   refraction front expanding from the centre, chromatic fringing on the
   incoming image, a faint rim at the wavefront. */
const VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`;

const FRAGMENT = /* glsl */ `
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uProgress;
uniform vec2 uResolution;
uniform vec2 uTexture1Size;
uniform vec2 uTexture2Size;
varying vec2 vUv;

vec2 getCoverUV(vec2 uv, vec2 textureSize) {
    vec2 s = uResolution / textureSize;
    float scale = max(s.x, s.y);
    vec2 scaledSize = textureSize * scale;
    vec2 offset = (uResolution - scaledSize) * 0.5;
    return (uv * uResolution - offset) / scaledSize;
}

void main() {
    vec2 uv1 = getCoverUV(vUv, uTexture1Size);
    vec2 uv2 = getCoverUV(vUv, uTexture2Size);

    float maxR = length(uResolution) * 0.85;
    float br = uProgress * maxR;
    vec2 p = vUv * uResolution;
    vec2 c = uResolution * 0.5;
    float d = length(p - c);
    float nd = d / max(br, 0.001);
    float inside = smoothstep(br + 3.0, br - 3.0, d);

    vec4 img;
    if (inside > 0.0) {
        float t = uProgress * 5.0;
        float ro = 0.08 * pow(smoothstep(0.3, 1.0, nd), 1.5);
        vec2 dir = (d > 0.0) ? (p - c) / d : vec2(0.0);
        vec2 distUV = uv2 - dir * ro;
        distUV += vec2(sin(t + nd * 10.0), cos(t * 0.8 + nd * 8.0)) * 0.015 * nd * inside;
        float ca = 0.02 * pow(smoothstep(0.3, 1.0, nd), 1.2);
        img = vec4(
            texture2D(uTexture2, distUV + dir * ca * 1.2).r,
            texture2D(uTexture2, distUV + dir * ca * 0.2).g,
            texture2D(uTexture2, distUV - dir * ca * 0.8).b,
            1.0
        );
        float rim = smoothstep(0.95, 1.0, nd) * (1.0 - smoothstep(1.0, 1.01, nd));
        img.rgb += rim * 0.08;
    } else {
        img = texture2D(uTexture2, uv2);
    }
    if (uProgress > 0.95) img = mix(img, texture2D(uTexture2, uv2), (uProgress - 0.95) / 0.05);

    gl_FragColor = mix(texture2D(uTexture1, uv1), img, inside);
}`;

type Mode = "static" | "webgl" | "fade";

type GL = {
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    material: THREE.ShaderMaterial;
    textures: THREE.Texture[];
    sizes: THREE.Vector2[];
};

/** Map runway progress (0..1) to a continuous position on the film strip
    (0..STEPS). The tail is dead scroll after the last wipe. */
function stripPosition(p: number): number {
    const total = STEPS * STEP_VH + TAIL_VH;
    const s = Math.min((p * total) / STEP_VH, STEPS);
    const i = Math.min(Math.floor(s), STEPS - 1);
    const t = s - i;
    const wipe = t <= DWELL ? 0 : (t - DWELL) / (1 - DWELL);
    return i + Math.min(wipe, 1);
}

export function WorkShowcase() {
    const prefersReducedMotion = useReducedMotion();
    const expand = useCaseStudyExpand();

    const runwayRef = React.useRef<HTMLElement>(null);
    const cardRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const titleRef = React.useRef<HTMLHeadingElement>(null);
    const fillRefs = React.useRef<(HTMLSpanElement | null)[]>([]);

    const [mode, setMode] = React.useState<Mode>("static");
    const [near, setNear] = React.useState(false);
    const [index, setIndex] = React.useState(0);
    const [prevIndex, setPrevIndex] = React.useState(0);
    const [glReady, setGlReady] = React.useState(false);

    const gl = React.useRef<GL | null>(null);
    const indexRef = React.useRef(0);
    const posRef = React.useRef(0);
    const lastPaintedPos = React.useRef(-1);
    /* Scrub smoothing: wheel detents land in ~100px steps, which would
       jump the wipe a quarter of its span per tick. The painted position
       chases the scroll position through a short rAF lerp (~120ms settle)
       so the scrub reads as continuous whatever the input device. */
    const targetPos = React.useRef(0);
    const smoothRaf = React.useRef(0);
    const hadScrollEvent = React.useRef(false);
    const reducedRef = React.useRef(false);
    reducedRef.current = !!prefersReducedMotion;
    const firstRender = React.useRef(true);

    /* Pinned progress through the runway: 0 when its top reaches the
       viewport top, 1 when its bottom meets the viewport bottom. */
    const { scrollYProgress } = useScroll({
        target: runwayRef,
        offset: ["start start", "end end"],
    });

    /* Surfacing parallax on approach: the card rides the tail of the cloud
       band's parting as the section scrolls in, before the pin engages. */
    const { scrollYProgress: surfaceProgress } = useScroll({
        target: runwayRef,
        offset: ["start end", "start 0.35"],
    });
    const surfaceY = useTransform(surfaceProgress, [0, 1], [44, 0]);

    /* ── mode decision, once, on the client ── */
    React.useEffect(() => {
        const coarse =
            window.matchMedia("(max-width: 767px)").matches ||
            window.matchMedia("(pointer: coarse)").matches;
        setMode(prefersReducedMotion || coarse ? "fade" : "webgl");
    }, [prefersReducedMotion]);

    /* ── defer all GL cost until the section is one viewport away ── */
    React.useEffect(() => {
        const runway = runwayRef.current;
        if (!runway) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    setNear(true);
                    io.disconnect();
                }
            },
            { rootMargin: "100% 0px" }
        );
        io.observe(runway);
        return () => io.disconnect();
    }, []);

    /* ── paint one position on the strip: textures + wipe + rail fills ── */
    const paintStrip = React.useCallback((pos: number, force = false) => {
        /* Dwell zones map every scrolled frame to the same position —
           skip the GL render and rail writes entirely when nothing moved. */
        if (!force && Math.abs(pos - lastPaintedPos.current) < 0.0005) return;
        lastPaintedPos.current = pos;

        const i = Math.min(Math.floor(pos), STEPS - 1);
        const wipe = pos - i;

        const api = gl.current;
        if (api) {
            const u = api.material.uniforms;
            u.uTexture1.value = api.textures[i];
            u.uTexture1Size.value = api.sizes[i];
            u.uTexture2.value = api.textures[i + 1];
            u.uTexture2Size.value = api.sizes[i + 1];
            u.uProgress.value = wipe;
            api.renderer.render(api.scene, api.camera);
        }

        /* Rail: each segment fills as its slide approaches; passed segments
           stay full. Only the active slide's segment carries an accent, so
           the rest are invisible for free. Direct DOM writes — this runs
           every scrolled frame. */
        for (let s = 0; s < PROJECTS.length; s++) {
            const fill = fillRefs.current[s];
            if (fill) {
                const amt = Math.max(0, Math.min(pos - s + 1, 1));
                fill.style.width = `${amt * 100}%`;
            }
        }
    }, []);

    /* ── WebGL lifecycle ── */
    React.useEffect(() => {
        if (mode !== "webgl" || !near) return;
        const canvas = canvasRef.current;
        const card = cardRef.current;
        if (!canvas || !card) return;

        let disposed = false;
        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false });
        } catch {
            setMode("fade"); // no context — the crossfade layer is already rendered
            return;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                uTexture1: { value: null },
                uTexture2: { value: null },
                uProgress: { value: 0 },
                uResolution: { value: new THREE.Vector2(1, 1) },
                uTexture1Size: { value: new THREE.Vector2(1, 1) },
                uTexture2Size: { value: new THREE.Vector2(1, 1) },
            },
            vertexShader: VERTEX,
            fragmentShader: FRAGMENT,
        });
        scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

        const renderOnce = () => {
            if (!disposed) renderer.render(scene, camera);
        };

        const size = () => {
            const r = card.getBoundingClientRect();
            renderer.setSize(r.width, r.height, false);
            /* 1.5, not 2: the canvas shows photographs in motion, where the
               extra density is invisible — but on a 2x display it would
               nearly double the fragment work of every scrubbed frame. */
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
            material.uniforms.uResolution.value.set(r.width, r.height);
            renderOnce();
        };
        size();
        const ro = new ResizeObserver(size);
        ro.observe(card);

        const loader = new THREE.TextureLoader();
        Promise.all(
            PROJECTS.map(
                (p) =>
                    new Promise<THREE.Texture>((resolve, reject) =>
                        loader.load(p.image.src, resolve, undefined, reject)
                    )
            )
        )
            .then((textures) => {
                if (disposed) return;
                textures.forEach((t) => {
                    t.minFilter = THREE.LinearFilter;
                    t.magFilter = THREE.LinearFilter;
                });
                const sizes = textures.map(
                    (t) => new THREE.Vector2(t.image.width, t.image.height)
                );
                gl.current = { renderer, scene, camera, material, textures, sizes };
                paintStrip(posRef.current, true);
                setGlReady(true);
            })
            .catch(() => {
                if (!disposed) setMode("fade"); // a texture failed — keep <Image> slides
            });

        return () => {
            disposed = true;
            ro.disconnect();
            gl.current?.textures.forEach((t) => t.dispose());
            material.dispose();
            renderer.dispose();
            gl.current = null;
            setGlReady(false);
        };
    }, [mode, near, paintStrip]);

    /* The content block swaps at the wipe midpoint, when the incoming
       image owns the card's centre. */
    const syncDisplayed = React.useCallback((pos: number) => {
        const displayed = Math.round(pos);
        if (displayed !== indexRef.current) {
            setPrevIndex(indexRef.current);
            indexRef.current = displayed;
            setIndex(displayed);
        }
    }, []);

    /* One lerp step per frame toward the scroll position; the loop only
       lives while there is distance left to close. */
    const smoothTick = React.useCallback(() => {
        const t = targetPos.current;
        const s = posRef.current;
        const next = Math.abs(t - s) < 0.001 ? t : s + (t - s) * 0.18;
        posRef.current = next;
        paintStrip(next);
        syncDisplayed(next);
        smoothRaf.current = next === t ? 0 : requestAnimationFrame(smoothTick);
    }, [paintStrip, syncDisplayed]);

    /* ── scroll drives everything ── */
    useMotionValueEvent(scrollYProgress, "change", (p) => {
        const pos = stripPosition(p);
        targetPos.current = pos;

        /* Reduced motion tracks 1:1; the first event after mount snaps
           (a refresh mid-runway must not animate a catch-up). */
        if (reducedRef.current || !hadScrollEvent.current) {
            hadScrollEvent.current = true;
            posRef.current = pos;
            paintStrip(pos);
            syncDisplayed(pos);
            return;
        }
        if (!smoothRaf.current) smoothRaf.current = requestAnimationFrame(smoothTick);
    });

    /* Initial rail state (before any scroll): first segment full. */
    React.useEffect(() => {
        paintStrip(0, true);
        return () => {
            if (smoothRaf.current) cancelAnimationFrame(smoothRaf.current);
        };
    }, [paintStrip]);

    /* ── content reveal per slide — the site's blur-to-sharp signature,
          word-staggered on the title like the hero heading ── */
    React.useLayoutEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        if (prefersReducedMotion) return;
        const words = titleRef.current?.children;
        const block = contentRef.current;
        if (!words || !block) return;
        const rest = Array.from(block.children).filter((el) => el !== titleRef.current);
        const tl = gsap.timeline();
        tl.fromTo(
            words,
            { opacity: 0, y: 14, filter: "blur(8px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, stagger: 0.045, ease: "power3.out", delay: 0.05, clearProps: "filter" }
        ).fromTo(
            rest,
            { opacity: 0, y: 10, filter: "blur(6px)" },
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.6, stagger: 0.08, ease: "power3.out", clearProps: "filter" },
            "-=0.55"
        );
        return () => {
            tl.kill();
        };
    }, [index, prefersReducedMotion]);

    /* ── rail click: scroll the runway to that slide's dwell ── */
    const scrollToSlide = (i: number) => {
        const runway = runwayRef.current;
        if (!runway) return;
        const top =
            runway.getBoundingClientRect().top +
            window.scrollY +
            (i * STEP_VH * window.innerHeight) / 100 +
            2;
        window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    };

    /* ── click-through into the case study, via the veil transition ── */
    const handleOpen = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (!expand || prefersReducedMotion) return;
        if (e.defaultPrevented || e.button !== 0) return;
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const card = cardRef.current;
        if (!card) return;
        e.preventDefault();
        const p = PROJECTS[index];
        const r = card.getBoundingClientRect();
        expand({
            href: p.href,
            image: p.image,
            label: p.label,
            title: p.title,
            outcome: p.outcome,
            keypoints: p.keypoints,
            hovered: false,
            rect: { top: r.top, left: r.left, width: r.width, height: r.height },
        });
    };

    const active = PROJECTS[index];

    return (
        <section
            ref={runwayRef}
            className="relative w-screen ml-[calc(50%-50vw)]"
            style={{ height: `${100 + STEPS * STEP_VH + TAIL_VH}vh` }}
            aria-label="Selected case studies"
        >
            {/* The pinned stage: card + switcher rail share one viewport for
                the whole runway. */}
            <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-5 md:gap-7">
            {/* Surfacing: the card rises the last few centimetres as the
                section scrolls in — position-linked, so it can't double-fire
                against the section's own blur reveal. The breath wrapper is
                separate because framer and the CSS breathing animation would
                otherwise fight over the same transform. */}
            <motion.div
                className="relative w-[88vw] md:w-[72vw]"
                style={prefersReducedMotion ? undefined : { y: surfaceY }}
            >
            <div className="showcase-breath relative">
            {/* The showcase card: hairline border in the page's own frame
                language (Flat-Card Rule — square corners, but with the
                documented moonlight-rim exception: it floats over the night
                atmosphere, like the CTA over the sky). bg-slate-950 is the
                fallback behind the image. */}
            <div
                ref={cardRef}
                className="showcase-halo relative h-[55vh] md:h-[60vh] w-full overflow-hidden border border-black/20 bg-slate-950 dark:border-white/15"
            >
            {/* Media stack: crossfade <Image> slides always exist (SSR, LCP,
                fade mode); the canvas sits above them and takes over once
                its textures are ready. */}
            {[prevIndex, index]
                .filter((v, i, a) => a.indexOf(v) === i)
                .map((i) => (
                    <Image
                        key={PROJECTS[i].href}
                        src={PROJECTS[i].image}
                        alt={i === index ? PROJECTS[i].imageAlt : ""}
                        fill
                        priority={i === 0}
                        sizes="(min-width: 768px) 72vw, 88vw"
                        className={`object-cover transition-opacity duration-700 ease-out ${
                            i === index ? "opacity-100" : "opacity-0"
                        }`}
                    />
                ))}
            <canvas
                ref={canvasRef}
                className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
                    mode === "webgl" && glReady ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden="true"
            />

            {/* Same scrim language as the old cards — but night-indigo, not
                pure black, so the card belongs to the same air as the sky
                around it. slate-950 is the sky's own void. */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-slate-950/10 md:from-slate-950/90 md:via-slate-950/50 md:to-transparent" />

            {/* The whole slide opens the active case study. */}
            <Link
                href={active.href}
                onClick={handleOpen}
                aria-label={`Open the ${active.label} case study`}
                className="group absolute inset-0 z-10 block"
            >
                <div
                    ref={contentRef}
                    className="flex h-full max-w-xl flex-col justify-center gap-4 p-6 md:p-10 lg:p-14"
                >
                    <p className="text-label font-semibold uppercase text-white/70 inline-flex items-center gap-2">
                        {active.label}
                        {active.locked && (
                            <>
                                <LockSimple size={13} weight="bold" aria-hidden="true" />
                                <span className="sr-only">(password protected)</span>
                            </>
                        )}
                    </p>
                    <h3 ref={titleRef} className="text-title font-semibold text-white text-balance">
                        {active.title.split(" ").map((word, i) => (
                            <span key={`${active.href}-${i}`} className="inline-block whitespace-pre">
                                {word}{" "}
                            </span>
                        ))}
                    </h3>
                    <p className="text-body font-normal text-white/75">{active.outcome}</p>
                    <ul className="flex flex-wrap gap-2">
                        {active.keypoints.map((keypoint) => (
                            <li
                                key={keypoint}
                                className="text-label font-semibold uppercase rounded-md border border-white/20 bg-black/40 px-3 py-1.5 text-white/85"
                            >
                                {keypoint}
                            </li>
                        ))}
                    </ul>
                    <span className="text-caption font-semibold mt-2 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-slate-100 px-5 py-3 text-slate-900 shadow-xl motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-1">
                        Read Full Case Study ➜
                    </span>
                </div>
            </Link>

                {/* Counter */}
                <p
                    className="text-label absolute right-6 top-6 z-20 font-semibold uppercase text-white/60 md:right-10 md:top-10"
                    aria-hidden="true"
                >
                    <span className="tabular-nums text-white">{String(index + 1).padStart(2, "0")}</span>
                    {" / "}
                    <span className="tabular-nums">{String(PROJECTS.length).padStart(2, "0")}</span>
                </p>
            </div>

            {/* Fog crossing the card's lower corners — in FRONT of it, so
                the rectangle reads as an object inside the cloudscape
                rather than a screenshot on top of it. Siblings of the card
                (not children): the card's overflow-hidden would clip the
                spill past its edges, which is the whole point. */}
            <div aria-hidden="true" className="showcase-wisp showcase-wisp--l" />
            <div aria-hidden="true" className="showcase-wisp showcase-wisp--r" />
            </div>
            </motion.div>

            {/* The switcher rail: one segment per case study, horizontal,
                just below the card and outside it — on the page background,
                where its contrast doesn't depend on the photograph behind
                it. The fills mirror scroll position now: passed slides stay
                full, the active slide's line is the strip's read head. Each
                project's accent appears only on its own line, deep on the
                light theme and pale on the dark one. Clicking a name still
                jumps — it scrolls the runway to that slide's dwell. */}
            <nav
                aria-label="Case studies in this showcase"
                className="grid w-[88vw] md:w-[72vw] grid-cols-5 items-start gap-3 md:gap-5"
            >
                {PROJECTS.map((p, i) => {
                    const isActive = i === index;
                    return (
                        <button
                            key={p.href}
                            type="button"
                            onClick={() => scrollToSlide(i)}
                            aria-current={isActive ? "true" : undefined}
                            aria-label={`Scroll to ${p.name}`}
                            className="group/nav flex flex-col items-stretch gap-2 pb-1 text-left"
                        >
                            <span className="relative block h-px w-full overflow-hidden bg-black/15 dark:bg-white/25">
                                <span
                                    ref={(el) => {
                                        fillRefs.current[i] = el;
                                    }}
                                    className="rail-fill absolute inset-y-0 left-0 w-0 bg-[color:var(--rail-light)] dark:bg-[color:var(--rail-dark)]"
                                    style={
                                        {
                                            "--rail-light": isActive ? p.accentLight : "transparent",
                                            "--rail-dark": isActive ? p.accentDark : "transparent",
                                        } as React.CSSProperties
                                    }
                                />
                            </span>
                            <span
                                className={`text-label hidden font-semibold uppercase transition-colors duration-300 sm:block ${
                                    isActive
                                        ? "text-slate-900 dark:text-white"
                                        : "text-slate-500 group-hover/nav:text-slate-800 dark:text-white/45 dark:group-hover/nav:text-white/80"
                                }`}
                            >
                                {p.name}
                            </span>
                        </button>
                    );
                })}
            </nav>
            </div>
        </section>
    );
}
