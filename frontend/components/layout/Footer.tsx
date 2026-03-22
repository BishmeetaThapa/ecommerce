'use client'
import { useDarkMode } from '@/components/providers/DarkModeProvider'
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import Link from 'next/link'

export default function Footer() {
    const { darkMode } = useDarkMode()

    const features = [
        { icon: Truck, title: "Free Shipping", desc: "On orders above Rs. 1000" },
        { icon: ShieldCheck, title: "100% Authentic", desc: "Sourced directly from brands" },
        { icon: RotateCcw, title: "Easy Returns", desc: "15-day return policy" },
    ]

    return (
        <footer className="w-full mt-24 flex flex-col items-center">
            {/* Trust Badges Pre-Footer */}
            <div className={`w-full max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-12 mb-8 rounded-3xl ${darkMode ? 'bg-gray-800/50' : 'bg-pink-50/80'} border ${darkMode ? 'border-gray-700' : 'border-pink-100'}`}>
                {features.map((F, i) => (
                    <div key={i} className="flex flex-col items-center text-center gap-3">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center text-pink-500 transition-transform duration-300 hover:scale-110 ${darkMode ? 'bg-gray-800 shadow-xl shadow-black/20' : 'bg-white shadow-xl shadow-pink-100/50'}`}>
                            <F.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <h4 className={`text-lg font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{F.title}</h4>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{F.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Main Footer */}
            <div className={`w-full transition-colors duration-500 ${darkMode ? 'bg-gray-950 text-gray-400' : 'bg-white text-gray-600'} border-t ${darkMode ? 'border-gray-800' : 'border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]'}`}>
                <div className="max-w-[1400px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    
                    {/* Brand Info */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-4xl font-black bg-gradient-to-r from-pink-500 to-rose-400 bg-clip-text text-transparent w-fit">
                            EverGlow
                        </h2>
                        <p className="text-sm leading-relaxed max-w-sm">
                            Your ultimate destination for premium beauty and skincare. We believe everyone deserves to glow from 
                            the inside out with authentic, expertly curated products.
                        </p>
                        <div className="flex flex-col gap-4 mt-2">
                            <div className="flex items-center gap-3 text-sm group cursor-pointer">
                                <div className="p-2 rounded-full bg-pink-50 dark:bg-gray-800 text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-colors duration-300">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <span className="group-hover:text-pink-500 transition-colors">+977 9800000000</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm group cursor-pointer">
                                <div className="p-2 rounded-full bg-pink-50 dark:bg-gray-800 text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-colors duration-300">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <span className="group-hover:text-pink-500 transition-colors">support@everglow.com</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm group cursor-pointer">
                                <div className="p-2 rounded-full bg-pink-50 dark:bg-gray-800 text-pink-500 group-hover:bg-pink-500 group-hover:text-white transition-colors duration-300">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <span className="group-hover:text-pink-500 transition-colors">Kathmandu, Nepal</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="flex flex-col gap-6 lg:pl-8">
                        <h3 className={`text-lg font-bold tracking-wide uppercase ${darkMode ? 'text-white' : 'text-gray-900'}`}>Quick Links</h3>
                        <div className="flex flex-col gap-4">
                            {['Shop All', 'New Arrivals', 'Best Sellers', 'Trending Brands'].map((link) => (
                                <Link key={link} href="/products" className="text-sm hover:text-pink-500 w-fit relative group font-medium transition-colors">
                                    {link}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Customer Care */}
                    <div className="flex flex-col gap-6">
                        <h3 className={`text-lg font-bold tracking-wide uppercase ${darkMode ? 'text-white' : 'text-gray-900'}`}>Customer Care</h3>
                        <div className="flex flex-col gap-4">
                            {['My Account', 'Track Order', 'Return Policy', 'FAQs', 'Contact Us'].map((link) => (
                                <Link key={link} href="#" className="text-sm hover:text-pink-500 w-fit relative group font-medium transition-colors">
                                    {link}
                                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Newsletter & Socials */}
                    <div className="flex flex-col gap-6">
                        <h3 className={`text-lg font-bold tracking-wide uppercase ${darkMode ? 'text-white' : 'text-gray-900'}`}>Stay in the Glow</h3>
                        <p className="text-sm leading-relaxed">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals delivered directly to your inbox.</p>
                        
                        <div className="relative flex items-center w-full mt-2 group">
                            <input
                                type="email"
                                placeholder="Enter your email..."
                                className={`w-full pl-5 pr-32 py-4 rounded-xl border-2 focus:outline-none transition-all duration-300 ${
                                    darkMode ? 'bg-gray-900 border-gray-800 text-white focus:border-pink-500' : 'bg-gray-50 border-gray-100 text-gray-900 focus:bg-white focus:border-pink-500'
                                }`}
                            />
                            <button className="absolute right-2 top-2 bottom-2 bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 rounded-lg transition-transform hover:scale-105 active:scale-95 text-sm shadow-lg shadow-pink-500/30">
                                Subscribe
                            </button>
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                            {[Facebook, Instagram, Twitter, Youtube].map((Icon, idx) => (
                                <button key={idx} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:-translate-y-1 ${darkMode ? 'bg-gray-800 hover:bg-pink-500 hover:text-white text-gray-400' : 'bg-gray-100 hover:bg-pink-500 hover:shadow-lg hover:shadow-pink-500/30 text-gray-600 hover:text-white'}`}>
                                    <Icon className="w-5 h-5" />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Copyright Line */}
                <div className={`border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'} py-6`}>
                    <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold tracking-wide">
                        <p>&copy; {new Date().getFullYear()} EverGlow Beauty. Crafted with ❤️ in Nepal.</p>
                        <div className="flex items-center gap-6">
                            <span className="hover:text-pink-500 cursor-pointer transition-colors relative group">
                                Privacy Policy
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
                            </span>
                            <span className="hover:text-pink-500 cursor-pointer transition-colors relative group">
                                Terms of Service
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-pink-500 transition-all duration-300 group-hover:w-full"></span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
