import React, { ReactNode } from 'react';
import Image from 'next/image'; // Import next/image component

import Logo from '../../../../public/Logo.svg';
import { BackgroundBeamsAnimation } from './bg-beams';

const FooterComp = () => {
    return (
        <footer className='relative flex flex-col justify-center items-center w-full h-fit bg-slate-900/[0.1] dark:bg-slate-800/[0.3] overflow-hidden'>

            <div className="absolute inset-0 z-0">
                <BackgroundBeamsAnimation />
            </div>

            <div className="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8 z-10 py-20">

                <div className='flex flex-col items-center'>
                    <Image src={Logo} alt="Logo" className="w-40 h-16 invert dark:invert-0" />
                </div>

                <nav className="flex flex-wrap justify-center z-1000">

                    <div className="px-5 py-2">
                        <a href="/" className="text-lg leading-6 text-slate-500 hover:text-slate-900 dark:text-slate-500 dark:hover:text-gray-200 tracking-wide">
                            Home
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="/about" className="text-lg leading-6 text-slate-500 hover:text-slate-900 dark:text-slate-500 dark:hover:text-gray-200 tracking-wide">
                            About
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="https://www.linkedin.com/in/shashank-agarwal11/" className="text-lg leading-6 text-slate-500 hover:text-slate-900 dark:text-slate-500 dark:hover:text-gray-200 tracking-wide">
                            LinkedIn
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="/photography" className="text-lg leading-6 text-slate-500 hover:text-slate-900 dark:text-slate-500 dark:hover:text-gray-200 tracking-wide">
                            Photography
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="/visualarts" className="text-lg leading-6 text-slate-500 hover:text-slate-900 dark:text-slate-500 dark:hover:text-gray-200 tracking-wide">
                            Visual Arts
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="https://dribbble.com/boywhodesign" className="text-lg leading-6 text-slate-500 hover:text-slate-900 dark:text-slate-500 dark:hover:text-gray-200 tracking-wide">
                            Dribbble
                        </a>
                    </div>

                </nav>

                <p className="text-lg leading-6 tracking-wide text-center text-slate-400 dark:text-slate-600">
                    © 2024 Shashank Agarwal. Created with Chai 🍵 & Patience 🧘‍♂️
                </p>
            </div>


        </footer>
    );
};

export default FooterComp;
