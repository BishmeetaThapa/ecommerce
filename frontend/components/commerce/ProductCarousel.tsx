'use client'
import React, { useRef } from 'react'
import { ChevronRight, ChevronLeft } from 'lucide-react'
import ItemCard from './ItemCard'
import Link from 'next/link'

interface ProductCarouselProps {
    title: string
    products: any[]
    exploreLink?: string
}

export default function ProductCarousel({ title, products, exploreLink }: ProductCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { current } = scrollContainerRef
            const scrollAmount = direction === 'left' ? -current.offsetWidth / 1.5 : current.offsetWidth / 1.5
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
        }
    }

    if (!products || products.length === 0) return null

    return (
        <div className="w-full my-12">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-black text-gray-800 dark:text-gray-100 tracking-tight">
                    {title}
                </h2>
                {exploreLink && (
                    <Link href={exploreLink} className="text-pink-600 hover:text-pink-700 font-bold flex items-center gap-1 transition-colors text-sm md:text-base">
                        Explore All <ChevronRight className="w-4 h-4" />
                    </Link>
                )}
            </div>
            
            <div className="relative group">
                {/* Left Arrow */}
                <button 
                    onClick={() => scroll('left')}
                    className="absolute z-10 left-0 top-1/2 -translate-y-1/2 -ml-2 lg:-ml-6 bg-white/95 dark:bg-gray-800/95 p-3 rounded-full shadow-2xl opacity-0 xl:group-hover:opacity-100 transition-all duration-300 hover:scale-110 hidden md:flex text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Horizontal Scroll Container */}
                <div 
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto snap-x snap-mandatory pb-8 pt-4 [&::-webkit-scrollbar]:hidden"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => (
                        <div key={product._id || product.id} className="min-w-[260px] w-[260px] sm:min-w-[280px] sm:w-[280px] snap-center flex-shrink-0">
                            <ItemCard product={product} />
                        </div>
                    ))}
                </div>

                {/* Right Arrow */}
                <button 
                    onClick={() => scroll('right')}
                    className="absolute z-10 right-0 top-1/2 -translate-y-1/2 -mr-2 lg:-mr-6 bg-white/95 dark:bg-gray-800/95 p-3 rounded-full shadow-2xl opacity-0 xl:group-hover:opacity-100 transition-all duration-300 hover:scale-110 hidden md:flex text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    )
}
