import React from 'react';
import Link from 'next/link';
import { Lamp } from './lamp';
import { BackgroundBeamsDemo } from './background-beams';
import { TextGenerateHeading } from './text-generate-header';
import { ProjectCards } from './project-hero-cards';

import { DribbbleShots } from './dribbble-posts';
import { SparklesPreview } from './sparkles-heading';
import { AuroraBackgroundAnimation } from './auora-background';


const HeroSection = () => {
    return (
        <div className="flex flex-col justify-center overflow-hidden">
            <div className='lg:block md:hidden sm:hidden'>
                {/* <BannerNotification /> */}
            </div>
            
            <div className="hero-section">
                <div className="relative bg-anim--wrapper">
                    <AuroraBackgroundAnimation />
                    <div className="absolute inset-0 hero-content--wrapper">
                        <div className="flex flex-col mx-4 md:mx-20 lg:mx-40 justify-center h-screen">
                            <div className="flex flex-col md:gap-y-6 lg:items-start justify-center" data-aos="fade-up">
                                <p className="md:leading-sung md:text-xl lg:leading-sung lg:text-2xl text-slate-600 dark:text-slate-300 z-1 tracking-wide text-center">
                                    Hi, my name is Shashank Agarwal
                                </p>
                                <h1 className="z-1 text-center lg:text-left font-bold">
                                    <TextGenerateHeading />
                                </h1>
                                <p className="md:leading-relaxed text-lg md:text-xl lg:leading-relaxed lg:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed z-1 tracking-wide text-center">
                                    My portfolio website got featured on Wall of Portfolios! 🎉
                                </p>
                                
                                <button className="bg-slate-100 dark:bg-slate-800 no-underline group cursor-pointer relative rounded-full p-px text-xs font-semibold leading-6  text-white inline-block my-4 shadow-xl">
                                    <span className="absolute inset-0 overflow-hidden rounded-full">
                                        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                                    </span>
                                    <div className="relative flex px-4 py-2 md:px-6 md:py-4 text-lg md:text-xl justify-center z-10 rounded-full border border-slate-300 dark:border-none dark:bg-zinc-950 py-0.5 ring-1 ring-white/10  text-slate-900 dark:text-white">
                                            Check it out!
                                    </div>

                                    <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                                </button>
                                
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <div className="projects-section mb-20 md:mb-40">
                <div className="flex flex-col sm:mx-10 md:mx-20 lg:mx-40 items-center">

                    <div className="lamp-wrapper lg:dark:block hidden lg:hidden">
                        <Lamp />
                    </div>

                    <div className='light-wrapper2 lg:block hidden lg:dark:hidden md:mb-4 lg:mb-8'>
                        <h2 className="text-slate-400 text-3xl lg:text-5xl font-bold lowercase">My Selected Work to Showcase</h2>
                    </div>

                    <div className="mx-4 my-8 max-w-[110rem] items-center">
                        <ProjectCards />
                    </div>
                </div>
            </div>


            <div className="ui-section mx-4 my-8 md:m-12 lg:mx-40 lg:my-20">


                <div className="flex flex-col gap-y-6 lg:gap-y-12 items-center">

                    <div className="dribbble-heading flex flex-col gap-y-4" data-aos="fade-up">

                        <h3 className="dark:text-white text-slate-600 text-center text-3xl md:text-4xl lg:text-5xl font-semibold">Here are some of my dribbble shots 🏀</h3>
                        <p className='text-base md:text-xl lg:text-xl text-center text-slate-500 dark:text-slate-400 tracking-wide font-semibold'>Click on any of the below project to see the thought process more in detail</p>

                    </div>

                    <div className="sparkles-container hidden md:block">
                        <SparklesPreview />
                    </div>


                    <DribbbleShots />
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
