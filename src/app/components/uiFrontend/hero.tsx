import React from 'react';
import { CardComp } from './card';
import { Meteors } from '../Animations/meteors';
import { SparklesPreview } from './sparkles';
import { Lamp } from './lamp';
import { BackgroundBeamsDemo } from './background-beams';
import { TextRevealCardPreview } from './text-reveal-card';

const HeroSection = () => {
    return (
        <div>
          <BackgroundBeamsDemo />
            <div className='flex flex-row items-center justify-center h-screen mx-10 md:mx-20 lg:mx-40'>
            <div>
              <h1 className="text-xl md:text-4x lg:text-8xl font-bold text-left text-white relative z-20 lending-4 md:lending-6 lg:lending-8">
              I Design Interfaces & Experiences
              </h1>
              <br />
              <p className=" md:text-4xl text-xl lg:text-4xl font-normal text-left text-gray-400 relative z-20  ">
              Product Designer with over 2 years of experience designing 6 highly cross-funtional (0 to 1) products
              </p>
              {/* <SparklesPreview /> */}
            </div>
            
            <TextRevealCardPreview />

            </div>

            <div className='flex flex-col -gap-4 justify-center items-center  selected_work'>

              <Lamp />

              {/* <div>
                <h2 className="md:text-4xl text-xl lg:text-6xl font-bold text-center text-white relative z-50">
                Selected Work
                </h2>
                <br />
                <p className=" md:text-2xl text-lg lg:text-3xl font-normal text-center text-gray-400 relative z-20 ">
                Here is my selected work to showcase
                </p>
              </div> */}
            
              <div className='flex flex-row justify-center gap-6 -mt-24'>
              <CardComp />
              <CardComp />
              <CardComp />
              </div>

            </div>
 
          {/* Meaty part - Meteor effect */}
          {/* <Meteors number={20} /> */}


            

        </div>
    )
}

export default HeroSection