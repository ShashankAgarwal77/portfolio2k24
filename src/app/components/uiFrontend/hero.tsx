import React from 'react';
import { OroCard } from './oro-card';
import { Lamp } from './lamp';
import { BackgroundBeamsDemo } from './background-beams';
import { TextGenerateHeading } from './text-generate-header';
import { HonestCard } from './honest-card';

const HeroSection = () => {
    return (
        <div className='flex flex-col justify-center sm:overflow-hidden md:overflow-hidden lg:overflow-hidden'>
            <BackgroundBeamsDemo />
            <div className='flex flex-col items-center justify-center lg:h-screen'>
                <div className='flex flex-col sm:gap-y-4 md:gap-y-6 items-left justify-center sm:mx-10 md:mx-20 lg:mx-40'>
                    <p className="md:leading-sung md:text-xl lg:leading-sung lg:text-2xl text-slate-300 z-1 tracking-wide">
                        Hi, my name is Shashank Agarwal
                    </p>
                    <h1 className="relative z-1">
                        <TextGenerateHeading />
                    </h1>
                    <p className="md:leading-relaxed md:text-lg lg:leading-relaxed lg:text-2xl text-slate-400 leading-relaxed z-1 tracking-wide">
                        Product Designer with over 2 years of experience designing 6 highly cross-functional (0 to 1) products
                    </p>
                </div>
                
            </div>
            
            <div className='flex flex-col sm:mx-10 md:mx-20 lg:mx-40 items-center -gap-y-4'> {/* Removed justify-center */}
                <Lamp />
                <div className='w-full flex flex-col items-center mb-16'> {/* Modified justify-center to items-center */}
                    <OroCard />
                    <HonestCard />
                </div>

            </div>
            
        </div>

    )
}

export default HeroSection;
