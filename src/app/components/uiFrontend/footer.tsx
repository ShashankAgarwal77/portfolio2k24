import React from 'react';
import Image from 'next/image';

import Logo from '../../../../public/Logo.svg';

/* The footer: the valley floor at night. No band, no backdrop surface —
   the page background runs through it — but it carries the site's night
   language in small ways: a horizon hairline with a soft moonlight bloom,
   the dock's warm-gold glow on link hover, a faint aura behind the logo,
   two last stars (dark mode), and the one-word Gloock signature in the
   tagline. All gradients and text-shadows; no blur filters, no animation
   loops (the old beams background is gone for good — GPU cost). */
const FooterComp = () => {
    return (
        <footer className='relative flex flex-col justify-center items-center w-full overflow-hidden'>

            {/* The horizon: where the ground meets the page's end. */}
            <div aria-hidden="true" className="footer-horizon" />

            {/* Two stars that made it all the way down. Dark mode only. */}
            <div aria-hidden="true" className="footer-stars">
                <span style={{ left: '16%', top: '38%', animationDelay: '0.6s' }} />
                <span style={{ left: '82%', top: '30%', animationDelay: '2.4s' }} />
            </div>

            {/* pb clears the floating dock (fixed bottom, ~5rem tall zone):
                without it the tagline scrolls to rest exactly underneath
                the dock at the page's end. */}
            <div className="relative max-w-screen-xl px-4 pt-10 md:pt-12 pb-28 md:pb-32 mx-auto space-y-6 sm:px-6 lg:px-8">

                <div className='footer-emblem flex flex-col items-center'>
                    <Image src={Logo} alt="Logo" className="w-32 h-12 invert dark:invert-0 opacity-90" />
                </div>

                <nav className="flex flex-wrap justify-center">
                    <div className="px-5 py-2">
                        <a href="/" className="footer-link text-caption font-normal text-slate-500 dark:text-slate-400">
                            Home
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="/about" className="footer-link text-caption font-normal text-slate-500 dark:text-slate-400">
                            About
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="https://www.linkedin.com/in/shashank-agarwal11/" className="footer-link text-caption font-normal text-slate-500 dark:text-slate-400">
                            LinkedIn
                        </a>
                    </div>
                    <div className="px-5 py-2">
                        <a href="https://dribbble.com/boywhodesign" className="footer-link text-caption font-normal text-slate-500 dark:text-slate-400">
                            Dribbble
                        </a>
                    </div>
                </nav>

                <p className="text-caption font-normal text-center text-slate-400 dark:text-slate-500">
                    self created — now updated with <span className="fontGloock">ai</span>
                </p>
            </div>
        </footer>
    );
};

export default FooterComp;
