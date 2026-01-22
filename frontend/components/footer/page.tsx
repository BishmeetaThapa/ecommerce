'use client'
import { useDarkMode } from '../DarkModeProvider/page'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'

export default function Footer() {
  const { darkMode } = useDarkMode()

  return (
    <footer
      className={`w-full mt-10 px-6 py-12 transition-colors duration-500 ${
        darkMode
          ? 'bg-gradient-to-t from-gray-900 via-gray-800 to-gray-900 text-gray-300 border-t border-gray-700'
          : 'bg-gradient-to-t from-pink-50 via-rose-50 to-amber-50 text-gray-700 border-t border-pink-100'
      }`}
    >
      {/* Top Section */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12">

        {/* About Section */}
        <div className="flex flex-col gap-3">
          <h2 className={`text-2xl font-extrabold ${darkMode ? 'text-pink-300' : 'text-pink-600'}`}>EverGlow</h2>
          <p className="text-sm max-w-xs leading-relaxed">
            EverGlow Beauty brings you premium skincare and makeup products to illuminate your natural beauty.
            Discover, explore, and glow with confidence!
          </p>

          {/* Social Media Buttons */}
          <div className="flex gap-4 mt-4">
            <a
              href="#"
              className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors hover:bg-pink-500 hover:text-white ${
                darkMode ? 'border-gray-600' : 'border-gray-300'
              }`}
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="#"
              className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors hover:bg-pink-500 hover:text-white ${
                darkMode ? 'border-gray-600' : 'border-gray-300'
              }`}
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors hover:bg-pink-500 hover:text-white ${
                darkMode ? 'border-gray-600' : 'border-gray-300'
              }`}
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className={`w-10 h-10 flex items-center justify-center rounded-full border transition-colors hover:bg-pink-500 hover:text-white ${
                darkMode ? 'border-gray-600' : 'border-gray-300'
              }`}
              aria-label="YouTube"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Links Section */}
        <div className="flex flex-col sm:flex-row gap-12">
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Shop</h3>
            <a href="#" className="hover:text-pink-500 transition-colors">All Products</a>
            <a href="#" className="hover:text-pink-500 transition-colors">New Arrivals</a>
            <a href="#" className="hover:text-pink-500 transition-colors">Best Sellers</a>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Company</h3>
            <a href="#" className="hover:text-pink-500 transition-colors">About Us</a>
            <a href="#" className="hover:text-pink-500 transition-colors">Careers</a>
            <a href="#" className="hover:text-pink-500 transition-colors">Contact</a>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold text-sm uppercase tracking-wider">Support</h3>
            <a href="#" className="hover:text-pink-500 transition-colors">FAQs</a>
            <a href="#" className="hover:text-pink-500 transition-colors">Shipping</a>
            <a href="#" className="hover:text-pink-500 transition-colors">Returns</a>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-12 border-t border-gray-300 dark:border-gray-700 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm">&copy; 2026 EverGlow Beauty. All rights reserved.</p>

        {/* Newsletter Subscribe */}
        <div className="flex gap-2 w-full max-w-md md:w-auto">
          <input
            type="email"
            placeholder="Your email"
            className={`flex-1 px-4 py-2 rounded-l-full border focus:outline-none transition-colors duration-300 ${
              darkMode
                ? 'bg-gray-800 border-gray-600 text-gray-200 placeholder-gray-400 focus:ring-pink-400'
                : 'bg-white border-gray-300 text-gray-700 placeholder-gray-500 focus:ring-pink-500'
            }`}
          />
          <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 rounded-r-full transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </footer>
  )
}
