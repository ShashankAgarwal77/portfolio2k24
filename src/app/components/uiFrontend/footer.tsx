import React, { ReactNode } from 'react';

const FooterComp = (): ReactNode => {
    return (
        <footer className='relative w-full bg-gray-800/[0.3] border-t-2 border-gray-900 pt-8 pb-6'>
            <div className="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
                <nav className="flex flex-wrap justify-center -mx-5 -my-2">
                    <div className="px-5 py-2">
                        <a href="/" className="text-base leading-6 text-gray-500 hover:text-gray-200">
                            Home
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="/about" className="text-base leading-6 text-gray-500 hover:text-gray-200">
                            About
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="https://www.linkedin.com/in/shashank-agarwal11/" className="text-base leading-6 text-gray-500 hover:text-gray-200">
                            LinkedIn
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="/photography" className="text-base leading-6 text-gray-500 hover:text-gray-200">
                            Photography
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="/visualarts" className="text-base leading-6 text-gray-500 hover:text-gray-200">
                            Visual Arts
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="https://dribbble.com/boywhodesign" className="text-base leading-6 text-gray-500 hover:text-gray-200">
                            Dribbble
                        </a>
                    </div>
                    
                </nav>
                
                <p className="mt-8 text-base leading-6 text-center text-gray-400">
                    © 2024 Shashank Agarwal. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default FooterComp;
