import React from 'react';
import { Lamp } from './lamp';
import { BackgroundBeamsDemo } from './background-beams';
import { TextGenerateHeading } from './text-generate-header';
import { ProjectCards } from './project-hero-cards';
import { ImagesSliderDemo } from './ui-parallex-showcase';
import { BackgroundGradientAnimationDemo } from './bg-gradient';

import { EmblaOptionsType } from 'embla-carousel'
import { DribbbleShots } from './dribbble-posts';


const HeroSection = () => {
    const OPTIONS: EmblaOptionsType = { loop: true }
    const SLIDE_COUNT = 5
    const SLIDES = Array.from(Array(SLIDE_COUNT).keys())
    return (
        <div className="flex flex-col justify-center overflow-hidden">
            <div className="hero-section">
                <BackgroundBeamsDemo />
                <div className="flex flex-col items-center justify-center h-screen">
                    <div className="flex flex-col md:gap-y-6 lg:items-start justify-center md:mx-20 lg:mx-40 max-w-[100rem]">
                        <p className="text-center md:text-left md:leading-sung md:text-xl lg:leading-sung lg:text-2xl text-slate-600 dark:text-slate-300 z-1 tracking-wide">
                            Hi, my name is Shashank Agarwal
                        </p>
                        <h1 className="text-center md:text-left z-1">
                            <TextGenerateHeading />
                        </h1>
                        <p className="text-center md:text-left md:leading-relaxed md:text-lg lg:leading-relaxed lg:text-2xl text-slate-600 dark:text-slate-400 leading-relaxed z-1 tracking-wide">
                            Product Designer with over 2 years of experience designing 6 highly
                            cross-functional (0 to 1) products
                        </p>
                    </div>
                </div>
            </div>

            <div className="projects-section">
                <div className="flex flex-col sm:mx-10 md:mx-20 lg:mx-40 items-center -gap-y-4">
                    <div className="hidden dark:block">
                        <Lamp />

                        <div className="block dark:hidden my-12">
                            <h1 className="md:text-3xl lg:text-5xl text-slate-400 font-bold tracking-loose">
                                Here is my selected work to showcase
                            </h1>
                        </div>
                    </div>

                    <div className="flex flex-col mx-auto w-full max-w-[110rem] items-center">
                        <ProjectCards />
                    </div>
                </div>
            </div>

            <div className="ui-section">
                <div className="flex flex-col my-32 md:mx-20 lg:mx-40 max-w-[100rem] items-center">
                    <DribbbleShots />
                    {/* <BackgroundGradientAnimationDemo /> */}

                </div>
            </div>


            {/* <div className="ui-section h-screen">
                <div className="flex flex-col items-center mt-32 gap-y-8 w-full">
                    <BackgroundGradientAnimationDemo />
                </div>
            </div> */}
        </div>
    );
};

export default HeroSection;
