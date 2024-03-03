import React, { ReactNode } from 'react';
import Image from 'next/image'; // Import next/image component

import Logo from '@/app/Assets/Images/Logo.svg';

const FooterComp = () => {
    return (
        <footer className='relative flex flex-col justify-center items-center w-full h-fit bg-gray-800/[0.3] border-t-2 border-gray-900 py-4'>
            <div className="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
                
                <div className='flex flex-col items-center'>
                <Image src={Logo} alt="Logo" className="w-40 h-16 invert dark:invert-0" />


                </div>

                <nav className="flex flex-wrap justify-center">
                    
                    <div className="px-5 py-2">
                        <a href="/" className="text-lg leading-6 text-gray-500 hover:text-gray-200 tracking-wide">
                            Home
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="/about" className="text-lg leading-6 text-gray-500 hover:text-gray-200 tracking-wide">
                            About
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="https://www.linkedin.com/in/shashank-agarwal11/" className="text-lg leading-6 text-gray-500 hover:text-gray-200 tracking-wide">
                            LinkedIn
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="/photography" className="text-lg leading-6 text-gray-500 hover:text-gray-200 tracking-wide">
                            Photography
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="/visualarts" className="text-lg leading-6 text-gray-500 hover:text-gray-200 tracking-wide">
                            Visual Arts
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="https://dribbble.com/boywhodesign" className="text-lg leading-6 text-gray-500 hover:text-gray-200 tracking-wide">
                            Dribbble
                        </a>
                    </div>
                    
                </nav>
                
                <p className="mt-8 text-base leading-6 tracking-wide text-center text-gray-600">
                    © 2024 Shashank Agarwal. Created with Chai 🍵 & Patience 🧘‍♂️
                </p>
            </div>

            
        </footer>
    );
};

export default FooterComp;
