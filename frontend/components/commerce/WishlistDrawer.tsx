'use client'
import { X, Trash2, ShoppingBag } from 'lucide-react'
import { useWishlistStore } from '@/lib/store/useWishlistStore'
import { useCartStore } from '@/lib/store/useCartStore'
import { useDarkMode } from '@/components/providers/DarkModeProvider'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import Link from 'next/link'
import { useState } from 'react'

interface WishlistDrawerProps {
    children: React.ReactNode
}

export default function WishlistDrawer({ children }: WishlistDrawerProps) {
    const { darkMode } = useDarkMode()
    const [isOpen, setIsOpen] = useState(false)
    const wishlistItems = useWishlistStore((state) => state.items)
    const removeItem = useWishlistStore((state) => state.removeItem)
    const addToCart = useCartStore((state) => state.addItem)

    const handleAddToCart = (item: any) => {
        addToCart(item)
        removeItem(item.id)
        toast.success(`${item.name} added to cart!`)
    }

    return (
        <>
            {/* Trigger */}
            <div
                className="relative group cursor-pointer"
                onClick={() => setIsOpen(true)}
            >
                {children}
                {wishlistItems.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900 group-hover:scale-110 transition-transform">
                        {wishlistItems.length}
                    </span>
                )}
            </div>

            {/* Drawer Overlay & Content */}
            {isOpen && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Drawer */}
                    <div className={`fixed right-0 top-0 h-full w-full max-w-md shadow-2xl overflow-hidden flex flex-col z-50 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'
                        }`}>
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-full">
                                    <svg className="w-5 h-5 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-bold">My Wishlist</h2>
                                <span className="text-sm text-gray-500">({wishlistItems.length} items)</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6">
                            {wishlistItems.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                                        <svg className="w-12 h-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                                    <p className="text-gray-500 text-sm mb-6">Save items you love by clicking the heart icon</p>
                                    <Link href="/products" onClick={() => setIsOpen(false)}>
                                        <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-full">
                                            Browse Products
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {wishlistItems.map((item) => (
                                        <div key={item.id} className={`flex gap-4 p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                                <img
                                                    src={item.image_link}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-sm line-clamp-2">{item.name}</h4>
                                                <p className="text-pink-500 font-bold mt-1">Rs {item.price}</p>
                                                <div className="flex gap-2 mt-2">
                                                    <button
                                                        onClick={() => handleAddToCart(item)}
                                                        className="flex-1 bg-pink-500 hover:bg-pink-600 text-white text-xs py-2 rounded-full flex items-center justify-center gap-1 transition-colors"
                                                    >
                                                        <ShoppingBag size={14} />
                                                        Add to Cart
                                                    </button>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                                                    >
                                                        <Trash2 size={14} className="text-red-500" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {wishlistItems.length > 0 && (
                            <div className={`p-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <Link href="/products" onClick={() => setIsOpen(false)}>
                                    <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full h-12 font-semibold">
                                        Continue Shopping
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </>
    )
}
