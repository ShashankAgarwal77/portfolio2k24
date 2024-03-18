"use client";

import { useEffect, useState } from 'react'

const ThemeSwitcher = () => {
    const [darkMode, setDarkMode] = useState(true) // Set initial state to true

    // On component mount, check if dark mode is already enabled
    useEffect(() => {
        if (!document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.add('dark') // Add 'dark' class if not present
        }
    }, [])

    const toggleDarkMode = () => {
        if (darkMode) {
            document.documentElement.classList.remove('dark')
        } else {
            document.documentElement.classList.add('dark')
        }
        setDarkMode(!darkMode)
    }

    return (
            <button onClick={toggleDarkMode} className='bg-slate-200 dark:bg-slate-900 p-4 rounded-xl'>
                {darkMode ? '🌞' : '🌙'}
            </button>
    )
}

export default ThemeSwitcher;
