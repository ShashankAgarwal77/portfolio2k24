import React from 'react';
import { SectionHeading } from './section-heading';
import { TextGenerateHeading } from './text-generate-header';
import { WorkShowcase } from './work-showcase';

import { DribbbleShots } from './dribbble-posts';
import { SparklesPreview } from './sparkles-heading';
import { NightSkyHero } from './night-sky';
import { WorkAtmosphere } from './atmosphere';
import { ContactSection } from './contact-section';
import { GreetingRotator } from './greeting-rotator';
import { Reveal } from '../Reveal';

const HeroSection = () => {
    return (
        <Reveal className="flex flex-col justify-center">

            {/* data-reveal="off": the hero runs its own entrance (star
                ignition, text generate) and the page-transition reveal
                already brings it in. */}
            <div className="hero-section" data-reveal="off">
                <NightSkyHero>
                    <div className="flex flex-col mx-4 md:mx-20 lg:mx-40 justify-center items-center h-full">
                            <div className="flex flex-col gap-y-4 md:gap-y-6 justify-center items-center">
                                {/* text-body, not caption: the intro line
                                    earns real presence now that it opens
                                    with the rotating greeting. */}
                                <p className="text-body font-normal text-slate-600 dark:text-slate-300 z-1 text-center">
                                    <GreetingRotator />, I&apos;m Shashank Agarwal
                                </p>
                                <h1 className="text-headline font-semibold z-1 text-center">
                                    <TextGenerateHeading />
                                </h1>
                                <p className="text-body font-normal max-w-2xl text-slate-600 dark:text-slate-400 z-1 text-center text-balance">
                                    Pairing design craft with AI to take products from problem to production
                                </p>

                                <div className="flex flex-wrap gap-4 justify-center items-center my-4">
                                    <a href="https://www.linkedin.com/in/shashank-agarwal11/" target="_blank" rel="noopener noreferrer">
                                        <button className="bg-slate-100 dark:bg-slate-800 no-underline group cursor-pointer relative rounded-full p-px text-white inline-block shadow-xl">
                                            <span className="absolute inset-0 overflow-hidden rounded-full">
                                                <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                            </span>
                                            <div className="text-caption font-semibold relative flex px-4 py-2 md:px-6 md:py-4 justify-center z-10 rounded-full border border-slate-300 dark:border-none dark:bg-zinc-950 ring-1 ring-white/10 text-slate-900 dark:text-white">
                                                Let&apos;s connect
                                            </div>
                                            <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                                        </button>
                                    </a>
                                </div>

                        </div>
                    </div>
                </NightSkyHero>
            </div>

            {/* pt: breathing room after the meadow — the mist's feathered
                top edge fills it, so the heading gets both air and
                atmosphere instead of crowding the seam. */}
            {/* Section rhythm: every section owns its own pt-16 md:pt-24 top
                padding and no bottom margin — spacing between sections can
                never stack or drift. */}
            <div id="work" className="projects-section relative pt-24 md:pt-32 pb-12 md:pb-20 scroll-mt-16">
                {/* The section's environment — WebGL mist feathered into the
                    hero above, stars at night. The content wrapper below is
                    `relative` so it paints above. */}
                <WorkAtmosphere />
                <div className="relative flex flex-col sm:mx-10 md:mx-20 lg:mx-40 items-center">

                    {/* One heading for every theme and breakpoint, arriving
                        with the hero's word-by-word shimmer fade. */}
                    <SectionHeading
                        text="Selected Case Studies"
                        className="text-title font-semibold lowercase text-center text-balance text-slate-500 dark:text-slate-300 mb-3 md:mb-4"
                    />
                    <p className="text-body font-normal max-w-2xl text-center text-balance text-slate-600 dark:text-slate-400 mb-8 md:mb-12">
                        Government security, fintech, cybersecurity, and gig
                        logistics — real products taken from problem to
                        production.
                    </p>

                    {/* Bottom margin only. A top margin here would stack with
                        the heading's own and open a 48px gap, which both reads
                        as a hole and pushes the switcher rail down under the
                        floating dock. */}
                    <div className="w-full mb-4">
                        <WorkShowcase />
                    </div>
                </div>
            </div>


            <div className="ui-section mx-4 md:mx-12 lg:mx-40 pt-16 md:pt-24">


                <div className="flex flex-col gap-y-6 lg:gap-y-12 items-center">

                    <div className="dribbble-heading flex flex-col gap-y-4">

                        <h3 className="text-title font-semibold dark:text-white text-slate-600 text-center text-balance">Here are some of my dribbble shots 🏀</h3>
                        <p className='text-body font-normal text-slate-600 dark:text-slate-400 z-1 text-center'>Click on any of the below project to see the thought process more in detail</p>

                    </div>

                    <div className="sparkles-container hidden md:block">
                        <SparklesPreview />
                    </div>


                    <DribbbleShots />
                </div>
            </div>

            {/* The landing: universe (hero) → clouds (work) → mountains.
                The page's closing contact moment; the shared footer sits
                just below the ridge line. */}
            <ContactSection />
        </Reveal>
    );
};

export default HeroSection;
