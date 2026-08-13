import React from 'react';
import { Lamp } from './lamp';
import { TextGenerateHeading } from './text-generate-header';
import { WorkStack } from './work-stack';

import { DribbbleShots } from './dribbble-posts';
import { SparklesPreview } from './sparkles-heading';
import { AuroraBackgroundAnimation } from './auora-background';
import { Reveal } from '../Reveal';

const HeroSection = () => {
    return (
        <Reveal className="flex flex-col justify-center">

            {/* data-reveal="off": the hero runs its own entrance (aurora
                background, text generate) and the page-transition reveal
                already brings it in. */}
            <div className="hero-section" data-reveal="off">
                <div className="bg-anim--wrapper relative overflow-hidden">
                    <AuroraBackgroundAnimation />
                    <div className="hero-content--wrapper absolute inset-0">
                        <div className="flex flex-col mx-4 md:mx-20 lg:mx-40 justify-center items-center h-screen">
                            <div className="flex flex-col gap-y-4 md:gap-y-6 justify-center items-center">
                                <p className="text-caption font-normal text-slate-600 dark:text-slate-300 z-1 text-center">
                                    Hi, I&apos;m Shashank Agarwal
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
                    </div>
                </div>

            </div>

            <div id="work" className="projects-section mb-20 md:mb-40 scroll-mt-16">
                <div className="flex flex-col sm:mx-10 md:mx-20 lg:mx-40 items-center">

                    <div className="lamp-wrapper lg:dark:block hidden lg:hidden">
                        <Lamp />
                    </div>

                    <div className='light-wrapper2 lg:block hidden lg:dark:hidden md:mb-4 lg:mb-8'>
                        <h2 className="text-title font-semibold text-slate-400 lowercase text-balance">My Selected Work to Showcase</h2>
                    </div>

                    <div className="w-full my-8">
                        <WorkStack />
                    </div>
                </div>
            </div>


            <div className="ui-section mx-4 my-8 md:m-12 lg:mx-40 lg:my-20">


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
        </Reveal>
    );
};

export default HeroSection;
