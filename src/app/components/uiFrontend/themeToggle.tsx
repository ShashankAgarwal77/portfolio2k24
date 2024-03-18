"use client";

import { useEffect, useState } from 'react'

const ThemeSwitcher = () => {
    const [darkMode, setDarkMode] = useState(() => {
        // On initial render, check if dark mode is already enabled or stored in localStorage
        const existingPreference = localStorage.getItem('darkMode')
        return existingPreference ? JSON.parse(existingPreference) : true
    })

    // When darkMode state changes, store it in localStorage and update class on document element
    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode))
        if (darkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [darkMode])

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
    }

    return (
        <button onClick={toggleDarkMode} className='bg-slate-200 dark:bg-slate-900 p-4 rounded-xl'>
            {darkMode ? '🌞' : '🌙'}
        </button>
    )
}

export default ThemeSwitcher;
