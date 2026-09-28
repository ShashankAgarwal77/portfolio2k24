import { useEffect, useState } from 'react';

/* Phosphor light, matching the rest of the dock set. MoonStars over a
   plain crescent: the toggle invites you into the starry night. */
import { Sun, MoonStars } from "@phosphor-icons/react";

const ThemeSwitcher = () => {
    const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage for theme preference, default to true (dark mode) if not found
        const existingPreference = typeof window !== 'undefined' ? localStorage.getItem('darkMode') : null;
        return existingPreference ? JSON.parse(existingPreference) : true;
    });

    /* The server can't read localStorage, so it always renders the dark-
       default icon; committing the real icon only after mount keeps the
       hydrated tree identical to the SSR one (React 19 reports the
       mismatch as an error). The boot script has already applied the real
       theme class pre-paint — only this little icon waits a frame. */
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    // Update localStorage and document element class when darkMode state changes
    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const showDark = mounted ? darkMode : true;

    return (
        <button onClick={toggleDarkMode} className='h-full w-full flex items-center justify-center'>
            {showDark
                ? <Sun weight="light" className='h-full w-full text-slate-200' />
                : <MoonStars weight="light" className='h-full w-full text-slate-600' />}
        </button>
    );
};

export default ThemeSwitcher;
