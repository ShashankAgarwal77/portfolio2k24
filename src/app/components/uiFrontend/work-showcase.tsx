"use client";

import React from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import gsap from "gsap";
import * as THREE from "three";
import { useReducedMotion } from "framer-motion";
import { useCaseStudyExpand } from "@/app/components/PageTransition";

import Audit360Thumb from "../../../../public/audit360_thumbnail.png";
import BCASThumb from "../../../../public/bcas_thumbnail.png";
import SecureHubThumb from "../../../../public/securehub_thumbnail.png";
import OroThumbnail from "../../../../public/oro_thumbnail.png";
import HaulkarThumbnail from "../../../../public/haulkar_thumbnail.png";

/* ─────────────────────────────────────────────────────────────────────────
   WorkShowcase — the home page's case-study section as one full-viewport
   slider: the project's thumbnail full-bleed behind a left-aligned content
   block, a project list with a progress line on the right, and a WebGL
   "liquid glass" wipe between slides (adapted from the Lumina slider, but
   with the bundled three/gsap instead of CDN scripts, and only the glass
   effect — the others in the source were stubs).

   Modes, decided once on mount:
     · webgl — desktop with motion allowed. Canvas paints the slides and a
       shader wipe carries transitions. The render loop only runs during a
       transition; a static frame costs no GPU.
     · fade  — phones, reduced motion, or no WebGL context. Same layout and
       content, plain crossfade (which prefers-reduced-motion collapses to
       an instant swap via the global CSS rule).

   The whole slide is a link into the active case study, handed to the
   same card-expand veil transition the old card stack used. Per-project
   accent color appears only on that project's own progress line — the One
   Hue Rule scoped to the active slide.
   ───────────────────────────────────────────────────────────────────────── */

type Project = {
    name: string;
    label: string;
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

const SLIDE_MS = 6000;
const TICK_MS = 50;
const TRANSITION_S = 1.5;
const FADE_MS = 700;

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

export function WorkShowcase() {
    const prefersReducedMotion = useReducedMotion();
    const expand = useCaseStudyExpand();

    const sectionRef = React.useRef<HTMLElement>(null);
    const cardRef = React.useRef<HTMLDivElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const titleRef = React.useRef<HTMLHeadingElement>(null);
    const fillRefs = React.useRef<(HTMLSpanElement | null)[]>([]);

    const [mode, setMode] = React.useState<Mode>("static");
    const [index, setIndex] = React.useState(0);
    const [prevIndex, setPrevIndex] = React.useState(0);
    const [glReady, setGlReady] = React.useState(false);

    const gl = React.useRef<GL | null>(null);
    const indexRef = React.useRef(0);
    indexRef.current = index;
    const transitioning = React.useRef(false);
    const paused = React.useRef(true); // starts paused until scrolled into view
    const progress = React.useRef(0);
    const goToRef = React.useRef<(i: number) => void>(() => {});
    const firstRender = React.useRef(true);

    /* ── mode decision, once, on the client ── */
    React.useEffect(() => {
        const coarse =
            window.matchMedia("(max-width: 767px)").matches ||
            window.matchMedia("(pointer: coarse)").matches;
        setMode(prefersReducedMotion || coarse ? "fade" : "webgl");
    }, [prefersReducedMotion]);

    /* ── WebGL lifecycle ── */
    React.useEffect(() => {
        if (mode !== "webgl") return;
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
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
                const i = indexRef.current;
                material.uniforms.uTexture1.value = textures[i];
                material.uniforms.uTexture1Size.value = sizes[i];
                renderOnce();
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
    }, [mode]);

    /* ── slide change ── */
    const goTo = React.useCallback(
        (target: number) => {
            const from = indexRef.current;
            if (transitioning.current || target === from) return;
            transitioning.current = true;
            progress.current = 0;
            const fill = fillRefs.current[from];
            if (fill) fill.style.width = "0%";

            setPrevIndex(from);
            setIndex(target);

            const api = gl.current;
            if (mode === "webgl" && api) {
                const u = api.material.uniforms;
                u.uTexture1.value = api.textures[from];
                u.uTexture1Size.value = api.sizes[from];
                u.uTexture2.value = api.textures[target];
                u.uTexture2Size.value = api.sizes[target];
                /* The render loop exists only for the duration of the wipe. */
                let running = true;
                const renderLoop = () => {
                    if (!running) return;
                    api.renderer.render(api.scene, api.camera);
                    requestAnimationFrame(renderLoop);
                };
                requestAnimationFrame(renderLoop);
                const settle = () => {
                    u.uProgress.value = 0;
                    u.uTexture1.value = api.textures[target];
                    u.uTexture1Size.value = api.sizes[target];
                    api.renderer.render(api.scene, api.camera);
                    running = false;
                    transitioning.current = false;
                };
                const tween = gsap.fromTo(
                    u.uProgress,
                    { value: 0 },
                    {
                        value: 1,
                        duration: TRANSITION_S,
                        ease: "power2.inOut",
                        onComplete: () => {
                            window.clearTimeout(deadline);
                            settle();
                        },
                    }
                );
                /* gsap's ticker is rAF-driven and pauses in hidden tabs, so
                   the completion callback can be deferred indefinitely. The
                   transition lock must not be — same rule as the veil. */
                const deadline = window.setTimeout(() => {
                    if (!transitioning.current) return;
                    tween.kill();
                    settle();
                }, TRANSITION_S * 1000 + 2000);
            } else {
                /* fade mode: the crossfade is CSS; just release the lock when
                   it has finished. */
                window.setTimeout(() => {
                    transitioning.current = false;
                }, FADE_MS);
            }
        },
        [mode]
    );
    goToRef.current = goTo;

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
            { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.7, stagger: 0.045, ease: "power3.out", delay: 0.1, clearProps: "filter" }
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

    /* ── autoplay: accumulate while visible, on-screen, and unhovered.
          The fill width is written straight to the DOM — sixty state
          updates a second have no business going through React. ── */
    React.useEffect(() => {
        if (mode === "static" || prefersReducedMotion) return;
        const section = sectionRef.current;
        if (!section) return;

        const onScreen = { current: false };
        const io = new IntersectionObserver(
            ([e]) => {
                onScreen.current = e.isIntersecting;
            },
            { threshold: 0.35 }
        );
        io.observe(section);

        const hover = { current: false };
        const enter = () => (hover.current = true);
        const leave = () => (hover.current = false);
        section.addEventListener("mouseenter", enter);
        section.addEventListener("mouseleave", leave);
        section.addEventListener("focusin", enter);
        section.addEventListener("focusout", leave);

        const timer = window.setInterval(() => {
            paused.current =
                !onScreen.current ||
                hover.current ||
                document.visibilityState === "hidden" ||
                transitioning.current;
            if (paused.current) return;
            progress.current += (100 / SLIDE_MS) * TICK_MS;
            const fill = fillRefs.current[indexRef.current];
            if (fill) fill.style.width = `${Math.min(progress.current, 100)}%`;
            if (progress.current >= 100) {
                progress.current = 0;
                goToRef.current((indexRef.current + 1) % PROJECTS.length);
            }
        }, TICK_MS);

        return () => {
            window.clearInterval(timer);
            io.disconnect();
            section.removeEventListener("mouseenter", enter);
            section.removeEventListener("mouseleave", leave);
            section.removeEventListener("focusin", enter);
            section.removeEventListener("focusout", leave);
        };
    }, [mode, prefersReducedMotion]);

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
            ref={sectionRef}
            className="relative flex w-screen ml-[calc(50%-50vw)] flex-col items-center gap-5 md:gap-6"
            aria-roledescription="carousel"
            aria-label="Selected case studies"
        >
            {/* The showcase card: 75% of the viewport, hairline border in the
                page's own frame language (Flat-Card Rule — border, no shadow,
                square corners). bg-slate-950 is the fallback behind the image. */}
            <div
                ref={cardRef}
                className="relative h-[75vh] w-[75vw] overflow-hidden border border-black/20 bg-slate-950 dark:border-white/15"
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
                        sizes="75vw"
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

            {/* Same scrim language as the old cards: legible text left, the
                product shot stays visible right. */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10 md:from-black/85 md:via-black/45 md:to-transparent" />

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
                    <p className="text-label font-semibold uppercase text-white/70">
                        {active.label}
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

            {/* The switcher rail: one segment per case study, horizontal,
                just below the card and outside it — on the page background,
                where its contrast doesn't depend on the photograph behind
                it. Each project's accent appears only on its own progress
                line, deep on the light theme and pale on the dark one. */}
            <nav
                aria-label="Case studies in this showcase"
                className="grid w-[75vw] grid-cols-5 items-start gap-3 md:gap-5"
            >
                {PROJECTS.map((p, i) => {
                    const isActive = i === index;
                    return (
                        <button
                            key={p.href}
                            type="button"
                            onClick={() => goToRef.current(i)}
                            aria-current={isActive ? "true" : undefined}
                            aria-label={`Show ${p.name}`}
                            className="group/nav flex flex-col items-stretch gap-2 pb-1 text-left"
                        >
                            <span className="relative block h-px w-full overflow-hidden bg-black/15 dark:bg-white/25">
                                <span
                                    ref={(el) => {
                                        fillRefs.current[i] = el;
                                    }}
                                    className="absolute inset-y-0 left-0 w-0 bg-[color:var(--rail-light)] dark:bg-[color:var(--rail-dark)]"
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
        </section>
    );
}
