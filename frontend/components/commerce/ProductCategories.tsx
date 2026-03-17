'use client'
import React, { useRef, useEffect, useState } from 'react'
import { useDarkMode } from '@/components/providers/DarkModeProvider'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import axios from 'axios'
import Link from 'next/link'

interface Category {
    _id: string
    name: string
    image?: string
}

const ProductCategories = () => {
    const { darkMode } = useDarkMode()
    const scrollRef = useRef<HTMLDivElement>(null)
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`)
                // The API returns category objects with properties
                const categoryData = Array.isArray(res.data)
                    ? res.data.map((cat: any) => ({
                        _id: cat._id || '',
                        name: cat.name || '',
                        image: cat.image || ''
                    }))
                    : []
                setCategories(categoryData)
            } catch (err) {
                console.error('Failed to fetch categories:', err)
                setCategories([])
            } finally {
                setLoading(false)
            }
        }

        fetchCategories()
    }, [])

    const scrollLeft = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: -300,
                behavior: 'smooth',
            })
        }
    }

    const scrollRight = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollBy({
                left: 300,
                behavior: 'smooth',
            })
        }
    }

    // Default category images
    const getCategoryImage = (index: number): string => {
        const defaultImages = [
            'https://cdn.vectorstock.com/i/500p/75/06/combo-offers-banner-vector-60167506.jpg',
            'https://cdn-cjhgk.nitrocdn.com/CXxGixRVyChwAxySbAyltuCiQXRKaWDN/assets/images/optimized/rev-9dad235/www.newbeauty.com/wp-content/uploads/2025/01/amazon-k-beauty.jpg',
            'https://media.gq.com/photos/67295862476e3ee9ef071cdb/16:9/w_1280,c_limit/lededryskin.png',
            'https://www.healme.com.np/storage/Product/PR-1688743339-1521835.webp',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9VB_pEdm4xpqP1TYe_kvB4NbHnQhEL2hnrg&s',
            'https://glam21.in/cdn/shop/articles/12f51da6cd36ef54da0bf039797a3a7d.jpg?v=1676290647',
            'https://akns-images.eonline.com/eol_images/Entire_Site/2023624/rs_1024x759-230724093424-1024-E_Insider_Shop-Best_Lipsticks-gj.jpg',
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrEURwEirNbQJ48Mt6mm-7gDtS_fFkaL39iQ&s',
            'https://img.freepik.com/free-photo/top-view-bath-concept-accessories_23-2148419370.jpg',
            'https://img.freepik.com/free-photo/luxurious-shiny-golden-chain_23-2149635280.jpg',
            'https://play-lh.googleusercontent.com/xFmpqGFhdU83jp9n8OxtE4GlXrIkndldG6TBGY_CyKYcgs_fB-aQASB2YA3EEdyiNQ',
            'https://www.shutterstock.com/image-vector/bogo-sale-buy-one-get-600nw-1737964088.jpg',
            'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400',
            'https://images.unsplash.com/photo-1570194065650-d99fb4b38b15?w=400',
            'https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400',
        ]
        return defaultImages[index % defaultImages.length]
    }

    if (loading) {
        return (
            <section className={`w-full py-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-pink-50'}`}>
                <div className="flex justify-center">
                    <div className="flex items-center gap-3 w-full max-w-6xl px-4">
                        <div className="w-6 h-6"></div>
                        <div className="flex gap-6 overflow-x-auto">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="flex flex-col items-center min-w-[90px]">
                                    <div className="w-20 h-20 rounded-full bg-gray-200 animate-pulse"></div>
                                    <div className="w-12 h-3 mt-2 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                        <div className="w-6 h-6"></div>
                    </div>
                </div>
            </section>
        )
    }

    if (categories.length === 0) {
        return null
    }

    return (
        <section className={`w-full py-6 transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-pink-50'}`}>
            <div className="flex justify-center">
                <div className="flex items-center gap-3 w-full max-w-6xl px-4">

                    <button
                        onClick={scrollLeft}
                        className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-pink-100 text-pink-600'}`}
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <div className="overflow-hidden w-full">
                        <div
                            ref={scrollRef}
                            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth no-scrollbar"
                        >
                            {categories.map((item, index) => (
                                <Link
                                    key={item._id}
                                    href={`/products?category=${encodeURIComponent(item.name)}`}
                                    className="flex flex-col items-center min-w-[90px] cursor-pointer transition-transform duration-300 hover:scale-105 group"
                                >
                                    <div
                                        className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg transition-shadow group-hover:shadow-pink-200/50 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
                                    >
                                        <img
                                            src={item.image || getCategoryImage(index)}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded-full"
                                        />
                                    </div>

                                    <p
                                        className={`text-xs mt-2 text-center font-medium transition-colors ${darkMode ? 'text-gray-200 group-hover:text-pink-300' : 'text-gray-800 group-hover:text-pink-600'}`}
                                    >
                                        {item.name}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={scrollRight}
                        className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-pink-100 text-pink-600'}`}
                    >
                        <ChevronRight size={24} />
                    </button>

                </div>
            </div>
        </section>
    )
}

export default ProductCategories
