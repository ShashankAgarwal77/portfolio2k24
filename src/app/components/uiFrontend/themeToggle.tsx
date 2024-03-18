import { useEffect, useState } from 'react';

const ThemeSwitcher = () => {
    const [darkMode, setDarkMode] = useState(() => {
        // Check localStorage for theme preference, default to true (dark mode) if not found
        const existingPreference = typeof window !== 'undefined' ? localStorage.getItem('darkMode') : null;
        return existingPreference ? JSON.parse(existingPreference) : true;
    });

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

    return (
        <button onClick={toggleDarkMode} className='bg-slate-200 dark:bg-slate-900 p-4 rounded-xl'>
            {darkMode ? '🌞' : '🌙'}
        </button>
    );
};

export default ThemeSwitcher;
