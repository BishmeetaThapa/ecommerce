'use client'
import { Heart, ShoppingBag } from 'lucide-react'
import React from 'react'
import { useDarkMode } from '@/components/providers/DarkModeProvider'
import { useCartStore } from '@/lib/store/useCartStore'
import { toast } from 'sonner'
import Link from 'next/link'

interface Product {
    id: string | number
    slug: string
    name: string
    price: string | number
    image_link: string
    bestSeller?: boolean
}

const ItemCard = ({ product }: { product: Product }) => {
    const { darkMode } = useDarkMode()
    const addItem = useCartStore((state) => state.addItem)

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        addItem(product)
        toast.success(`${product.name} added to cart!`, {
            description: `Price: Rs ${product.price}`,
        })
    }

    return (
        <div className={`group w-full max-w-[280px] p-4 rounded-xl shadow-md border transition-all duration-300 hover:shadow-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
            {/* Badge & Favorite */}
            <div className="flex justify-between items-start mb-2">
                {product.bestSeller ? (
                    <div className="bg-pink-100 text-pink-600 text-[10px] uppercase tracking-wider rounded-full px-2 py-1 font-bold">
                        Best Seller
                    </div>
                ) : <div />}
                <button className={`p-1.5 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-pink-50 text-gray-400 hover:text-pink-500'}`}>
                    <Heart size={18} />
                </button>
            </div>

            {/* Product Image */}
            <Link href={`/products/${product.slug}`}>
                <div className="relative w-full h-48 flex items-center justify-center overflow-hidden rounded-lg mb-4 bg-gray-50 dark:bg-gray-900">
                    <img
                        src={product.image_link}
                        alt={product.name}
                        className="object-contain w-full h-full p-2 transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Quick Add Overlay */}
                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button className="bg-white text-black text-xs font-bold py-2 px-4 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            Quick View
                        </button>
                    </div>
                </div>
            </Link>

            {/* Product Details */}
            <div className="flex flex-col gap-1">
                <h3 className={`font-semibold text-sm line-clamp-2 min-h-[40px] ${darkMode ? 'text-gray-100' : 'text-gray-800'
                    }`}>{product.name}</h3>

                <div className="flex items-center justify-between mt-2">
                    <span className="text-lg font-bold text-pink-500">Rs {product.price}</span>
                    <button
                        onClick={handleAddToCart}
                        className={`p-2 rounded-full transition-all ${darkMode ? 'bg-gray-700 hover:bg-pink-500 text-gray-200' : 'bg-pink-50 hover:bg-pink-500 text-pink-600 hover:text-white'
                            }`}>
                        <ShoppingBag size={18} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ItemCard
