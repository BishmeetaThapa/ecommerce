'use client'
import { Heart, ShoppingCart, Sun, Moon, Search } from 'lucide-react'
import { useDarkMode } from '../DarkModeProvider/page'

export default function Navbar() {
  const { darkMode, setDarkMode } = useDarkMode()

  return (
    <nav className={`w-full px-6 py-4 flex items-center justify-between shadow-lg transition-colors duration-500 ${
      darkMode ? 'bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700' 
               : 'bg-gradient-to-r from-pink-50 via-rose-50 to-amber-50 border-b border-pink-100'
    }`}>
      
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 w-14 h-14 flex items-center justify-center text-white font-extrabold text-xl shadow-xl">
          EG
        </div>
        <span className={`text-2xl font-extrabold tracking-wide ${
          darkMode ? 'text-pink-300' : 'text-pink-600'
        }`}>
          EverGlow
        </span>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl mx-6">
        <div className={`flex items-center bg-white dark:bg-gray-800 border rounded-full px-4 py-2 shadow-inner focus-within:ring-2 transition-colors duration-300 ${
          darkMode 
            ? 'border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-pink-400' 
            : 'border-gray-300 text-gray-700 placeholder-gray-500 focus:ring-pink-500'
        }`}>
          <Search className={`w-5 h-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder="Search products and brands"
            className="w-full bg-transparent outline-none placeholder:text-sm text-sm"
          />
        </div>
      </div>

      {/* Action Icons */}
      <div className="flex items-center gap-5">

        {/* Account */}
        <div className="flex flex-col text-right">
          <span className={`text-xs font-medium transition-colors ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Hello, Sign in</span>
          <strong className={`text-sm font-semibold transition-colors ${
            darkMode ? 'text-pink-300' : 'text-pink-600'
          }`}>Accounts & Loyalty</strong>
        </div>

        {/* Icons */}
        <ShoppingCart className={`w-6 h-6 cursor-pointer transition-colors duration-300 ${
          darkMode ? 'text-gray-300 hover:text-pink-300' : 'text-gray-700 hover:text-pink-600'
        }`} />
        <Heart className={`w-6 h-6 cursor-pointer transition-colors duration-300 ${
          darkMode ? 'text-gray-300 hover:text-pink-300' : 'text-gray-700 hover:text-pink-600'
        }`} />

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`p-2 rounded-full transition-transform hover:scale-110 duration-300 ${
            darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
          }`}
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </button>

      </div>
    </nav>
  )
}
