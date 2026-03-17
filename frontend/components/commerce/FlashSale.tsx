'use client'
import React, { useEffect, useState } from 'react'
import { useDarkMode } from '@/components/providers/DarkModeProvider'
import { Clock, Zap, ArrowRight } from 'lucide-react'
import axios from 'axios'
import Link from 'next/link'
import ItemCard from './ItemCard'

interface Product {
    _id: string
    id: string | number
    slug: string
    name: string
    price: number
    description?: string
    category?: string
    image_link: string
    images?: Array<{ url: string; isPrimary?: boolean }>
    brand?: string
    stock?: number
    originalPrice?: number
    discount?: number
    salePrice?: number | null
    isOnSale?: boolean
}

const FlashSale = () => {
    const { darkMode } = useDarkMode()
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

    // Flash sale ends in 24 hours from now
    const endTime = new Date()
    endTime.setHours(endTime.getHours() + 24)

    useEffect(() => {
        const fetchFlashProducts = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/products`
                )
                // Filter for products on sale or get random products if no sale items
                let saleProducts = response.data.filter((item: any) => item.isOnSale === true)

                // If no sale products, show random products as sale items
                if (saleProducts.length === 0) {
                    const shuffled = [...response.data].sort(() => 0.5 - Math.random())
                    saleProducts = shuffled.slice(0, 4)
                }

                const flashProducts = saleProducts.slice(0, 4).map((item: any) => ({
                    ...item,
                    id: item._id || item.id,
                    image_link: item.images?.[0]?.url || 'https://via.placeholder.com/400',
                    brand: item.brand || 'EverGlow',
                    originalPrice: item.salePrice ? Number(item.price) : Number(item.price) * 1.5,
                    discount: item.salePrice ? Math.round((1 - item.salePrice / item.price) * 100) : Math.floor(Math.random() * 30) + 20
                }))
                setProducts(flashProducts)
            } catch (err) {
                console.error('Failed to fetch products:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchFlashProducts()
    }, [])

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date()
            const diff = endTime.getTime() - now.getTime()

            if (diff <= 0) {
                clearInterval(timer)
                return
            }

            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((diff % (1000 * 60)) / 1000)

            setTimeLeft({ hours, minutes, seconds })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    if (loading) {
        return (
            <section className={`py-12 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500'}`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white/20 h-64 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    if (products.length === 0) return null

    return (
        <section className={`py-12 relative overflow-hidden ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500'}`}>
            {/* Background decorations */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-24 translate-y-24"></div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-yellow-400 text-black px-3 py-1 rounded-full font-bold text-sm flex items-center gap-1 animate-pulse">
                                <Zap size={16} fill="black" />
                                FLASH SALE
                            </div>
                            <span className="text-white/90 font-medium">Up to 50% OFF</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white">Deal of the Day</h2>
                    </div>

                    {/* Countdown Timer */}
                    <div className="flex items-center gap-2">
                        <Clock size={20} className="text-white" />
                        <div className="flex gap-2">
                            {[
                                { value: timeLeft.hours, label: 'HRS' },
                                { value: timeLeft.minutes, label: 'MIN' },
                                { value: timeLeft.seconds, label: 'SEC' }
                            ].map((item, i) => (
                                <div key={i} className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-center min-w-[60px]">
                                    <div className="text-2xl font-black text-white">
                                        {String(item.value).padStart(2, '0')}
                                    </div>
                                    <div className="text-[10px] text-white/70 font-semibold uppercase">{item.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white rounded-2xl p-3 shadow-xl transform hover:scale-105 transition-all duration-300">
                            {/* Discount Badge */}
                            <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-2">
                                {product.discount}% OFF
                            </div>

                            {/* Image */}
                            <div className="relative h-40 mb-3 bg-gray-100 rounded-xl overflow-hidden">
                                <img
                                    src={product.image_link}
                                    alt={product.name}
                                    className="w-full h-full object-contain p-2"
                                />
                            </div>

                            {/* Details */}
                            <h3 className="font-bold text-sm line-clamp-2 mb-1 text-gray-800">{product.name}</h3>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg font-black text-pink-600">Rs {product.price}</span>
                                <span className="text-sm text-gray-400 line-through">Rs {product.originalPrice}</span>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-2">
                                <div className="flex justify-between text-xs text-gray-500 mb-1">
                                    <span>Stock left</span>
                                    <span>{product.stock || 15}</span>
                                </div>
                                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-pink-500 to-red-500 rounded-full"
                                        style={{ width: `${Math.min((product.stock || 15) * 6.67, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-8">
                    <Link href="/products?sale=true">
                        <button className="bg-white text-pink-600 font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
                            View All Deals
                            <ArrowRight size={18} />
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default FlashSale
