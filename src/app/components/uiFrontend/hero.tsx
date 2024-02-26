import React from 'react';
import { CardComp } from './card';
import { Lamp } from './lamp';
import { BackgroundBeamsDemo } from './background-beams';

const HeroSection = () => {
    return (
        <div className='flex flex-col justify-center overflow-hidden'>
            <BackgroundBeamsDemo />
            <div className='flex flex-col items-center justify-center h-screen gap-y-8 mx-10 md:mx-20 lg:mx-40'>
                <p className="md:text-xl sm:text-xl lg:text-2xl font-normal text-center text-gray-400 relative z-20">
                    Hi, My name Shashank Agarwal
                </p>
                <h1 className="sm:text-xl md:text-4xl lg:text-8xl text-center text-white relative z-20">
                    I craft products, interactions & stories
                </h1>
                <p className="md:text-xl sm:text-xl lg:text-2xl font-normal text-center text-gray-400 relative z-20">
                    Product Designer with over 2 years of experience designing 6 highly cross-functional (0 to 1) products
                </p>
            </div>

            <div className='flex flex-col gap-4 mx-40 items-center'> {/* Removed justify-center */}

                <Lamp />

                <div className='w-full flex flex-col items-center'> {/* Modified justify-center to items-center */}
                    <CardComp />
                    <CardComp />
                    <CardComp />

                </div>

            </div>

        </div>
    )
}

export default HeroSection;
