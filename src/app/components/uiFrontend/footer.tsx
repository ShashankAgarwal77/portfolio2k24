import React from 'react';
import Image from 'next/image';

import Logo from '../../../../public/Logo.svg';

/* The footer is deliberately invisible as a surface: no band, no backdrop,
   no decoration — just quiet text on the page background. On the home page
   it reads as resting at the base of the contact section's mountains; on
   case-study pages it is simply a clean, minimal close. (It used to carry
   a tinted band + an animated beams background — both removed in the
   ethereal redesign: the band broke the page's single-background illusion
   and the beams were a standing GPU cost on every page.) */
const FooterComp = () => {
    return (
        <footer className='relative flex flex-col justify-center items-center w-full'>
            <div className="max-w-screen-xl px-4 py-10 md:py-12 mx-auto space-y-6 sm:px-6 lg:px-8">

                <div className='flex flex-col items-center'>
                    <Image src={Logo} alt="Logo" className="w-32 h-12 invert dark:invert-0 opacity-80" />
                </div>

                <nav className="flex flex-wrap justify-center">
                    <div className="px-5 py-2">
                        <a href="/" className="text-caption font-normal text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                            Home
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="/about" className="text-caption font-normal text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                            About
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="https://www.linkedin.com/in/shashank-agarwal11/" className="text-caption font-normal text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                            LinkedIn
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="https://dribbble.com/boywhodesign" className="text-caption font-normal text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                            Dribbble
                        </a>
                    </div>
                </nav>

                <p className="text-caption font-normal text-center text-slate-400 dark:text-slate-500">
                    self created and now updated with ai
                </p>
            </div>
        </footer>
    );
};

export default FooterComp;
