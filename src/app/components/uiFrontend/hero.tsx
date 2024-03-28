import React from 'react';
import { Lamp } from './lamp';
import { BackgroundBeamsDemo } from './background-beams';
import { TextGenerateHeading } from './text-generate-header';
import { ProjectCards } from './project-hero-cards';

import { EmblaOptionsType } from 'embla-carousel'
import { DribbbleShots } from './dribbble-posts';
import { MeteorsDemo } from './bg-meteors';
import { SparklesPreview } from './sparkles-heading';


const HeroSection = () => {
    const OPTIONS: EmblaOptionsType = { loop: true }
    const SLIDE_COUNT = 5
    const SLIDES = Array.from(Array(SLIDE_COUNT).keys())
    return (
        <div className="flex flex-col justify-center overflow-hidden">
            <div className="hero-section">
                <BackgroundBeamsDemo />
                <div className="flex flex-col mx-4 justify-center h-screen">
                    <div className="flex flex-col md:gap-y-6 lg:items-start justify-center md:mx-20 lg:mx-40 max-w-[100rem]">
                        <p className=" md:leading-sung md:text-xl lg:leading-sung lg:text-2xl text-slate-600 dark:text-slate-300 z-1 tracking-wide">
                            Hi, my name is Shashank Agarwal
                        </p>
                        <h1 className="z-1">
                            <TextGenerateHeading />
                        </h1>
                        <p className=" md:leading-relaxed md:text-lg lg:leading-relaxed lg:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed z-1 tracking-wide">
                            Product Designer with over 2 years of experience designing 6 highly
                            cross-functional (0 to 1) products
                        </p>
                    </div>
                </div>
            </div>

            <div className="projects-section">
                <div className="flex flex-col sm:mx-10 md:mx-20 lg:mx-40 items-center -gap-y-4">
                    <div className="block dark:hidden my-32">
                        <h1 className="md:text-3xl lg:text-5xl text-slate-400 font-bold tracking-loose">
                            Here is my selected work to showcase
                        </h1>
                    </div>
                    <div className="hidden md:block">
                        <Lamp />

                        <div className="block dark:hidden my-12">
                            <h1 className="md:text-3xl lg:text-5xl text-slate-400 font-bold tracking-loose">
                                Here is my selected work to showcase
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-col mx-4 my-8  max-w-[110rem] items-center">
                        <ProjectCards />
                    </div>
                </div>
            </div>

            <div className="ui-section mx-4 my-8 md:m-12 lg:mx-40 lg:my-20">


                <div className="flex flex-col gap-y-6 lg:gap-y-12 items-center">

                    <div className="dribbble-heading flex flex-col gap-y-4">

                        <h3 className="dark:text-white text-slate-600 text-center text-3xl md:text-4xl lg:text-5xl">Here are some of my dribbble shots 🏀</h3>
                        <p className='text-base md:text-xl lg:text-xl text-center text-slate-400 dark:text-slate-400 tracking-wide'>Click on any of the below project to see the thought process more in detail</p>

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
