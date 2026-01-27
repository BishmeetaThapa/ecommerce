'use client'
import { createContext, useContext, useState, useEffect } from 'react'

const DarkModeContext = createContext({
    darkMode: false,
    setDarkMode: (value: boolean) => { }
})

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
    const [darkMode, setDarkMode] = useState(false)

    useEffect(() => {
        const root = document.documentElement
        if (darkMode) {
            root.classList.add('dark')
            root.style.backgroundColor = '#111827'
            root.style.colorScheme = 'dark'
        } else {
            root.classList.remove('dark')
            root.style.backgroundColor = '#ffffff'
            root.style.colorScheme = 'light'
        }
    }, [darkMode])

    return (
        <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
            <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
                {children}
            </div>
        </DarkModeContext.Provider>
    )
}

export function useDarkMode() {
    return useContext(DarkModeContext)
}
