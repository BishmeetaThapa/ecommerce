'use client'
import { Heart, ShoppingBag, Eye, Star } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import { useDarkMode } from '@/components/providers/DarkModeProvider'
import { useCartStore } from '@/lib/store/useCartStore'
import { useWishlistStore } from '@/lib/store/useWishlistStore'
import { toast } from 'sonner'
import Link from 'next/link'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface Product {
    id: string | number
    _id?: string
    slug: string
    name: string
    price: string | number
    description?: string
    image_link: string
    images?: Array<{ url: string; isPrimary?: boolean }>
    brand?: string
    stock?: number
    bestSeller?: boolean
}

interface ItemCardProps {
    product: Product
}

const ItemCard = ({ product }: ItemCardProps) => {
    const { darkMode } = useDarkMode()
    const addItem = useCartStore((state) => state.addItem)
    const wishlistStore = useWishlistStore()
    const [quickViewOpen, setQuickViewOpen] = useState(false)
    const [isWishlisted, setIsWishlisted] = useState(false)

    useEffect(() => {
        setIsWishlisted(wishlistStore.isInWishlist(product.id))
    }, [wishlistStore.items, product.id])

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        addItem(product)
        toast.success(`${product.name} added to cart!`, {
            description: `Price: Rs ${product.price}`,
        })
    }

    const handleWishlist = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (isWishlisted) {
            wishlistStore.removeItem(product.id)
            setIsWishlisted(false)
            toast.success("Removed from wishlist!")
        } else {
            wishlistStore.addItem({
                id: product.id,
                _id: product._id,
                slug: product.slug,
                name: product.name,
                price: Number(product.price),
                image_link: product.image_link,
                brand: product.brand
            })
            setIsWishlisted(true)
            toast.success("Added to wishlist!")
        }
    }

    const mainImage = product.image_link || product.images?.[0]?.url || 'https://via.placeholder.com/400'

    return (
        <>
            <div className={`group relative w-full p-4 transition-all duration-300 hover:shadow-xl hover:z-10 border border-gray-100 dark:border-gray-800 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                {/* Badge & Wishlist */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-2">
                        {product.bestSeller && (
                            <span className="bg-pink-500 text-white text-[10px] uppercase tracking-wider rounded-full px-3 py-1 font-bold shadow-lg">
                                Best Seller
                            </span>
                        )}
                        {product.stock !== undefined && product.stock < 10 && (
                            <span className="bg-orange-500 text-white text-[10px] uppercase tracking-wider rounded-full px-3 py-1 font-bold">
                                Low Stock
                            </span>
                        )}
                    </div>
                    <button
                        onClick={handleWishlist}
                        className={`p-2 rounded-full transition-all duration-300 ${isWishlisted ? 'bg-pink-500 text-white' : darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-pink-400' : 'hover:bg-pink-50 text-gray-400 hover:text-pink-500'}`}
                    >
                        <Heart size={18} fill={isWishlisted ? "white" : "none"} />
                    </button>
                </div>

                {/* Product Image */}
                <Link href={`/products/${product.slug}`}>
                    <div className="relative w-full h-56 flex items-center justify-center overflow-hidden rounded-xl mb-4 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-800">
                        <img
                            src={mainImage}
                            alt={product.name}
                            className="object-contain w-full h-full p-4 transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Quick View Button */}
                        <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                            <button
                                onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    setQuickViewOpen(true)
                                }}
                                className="w-full bg-white/95 backdrop-blur-sm text-gray-800 font-semibold py-3 px-4 rounded-full shadow-xl hover:bg-pink-500 hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <Eye size={18} />
                                Quick View
                            </button>
                        </div>
                    </div>
                </Link>

                {/* Product Details */}
                <div className="flex flex-col gap-1">
                    <p className="text-xs text-pink-500 font-semibold uppercase tracking-wider">{product.brand || 'EverGlow'}</p>
                    <h3 className={`font-bold text-base line-clamp-2 min-h-[48px] ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {product.name}
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                size={14}
                                className={star <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                            />
                        ))}
                        <span className="text-xs text-gray-400 ml-1">(42)</span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-black text-pink-600">Rs {product.price}</span>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className={`p-3 rounded-full transition-all duration-300 shadow-lg ${darkMode ? 'bg-gray-700 hover:bg-pink-500 text-white' : 'bg-pink-500 hover:bg-pink-600 text-white hover:shadow-pink-300'}`}
                        >
                            <ShoppingBag size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick View Modal */}
            <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
                <DialogContent className="max-w-4xl p-0 rounded-3xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        {/* Image Section */}
                        <div className="relative h-96 md:h-auto bg-gradient-to-br from-pink-50 to-purple-50">
                            <img
                                src={mainImage}
                                alt={product.name}
                                className="w-full h-full object-contain p-8"
                            />
                        </div>

                        {/* Details Section */}
                        <div className={`p-8 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}>
                            <p className="text-pink-500 font-semibold uppercase tracking-wider text-sm mb-2">
                                {product.brand || 'EverGlow'}
                            </p>
                            <h2 className="text-2xl font-bold mb-4">{product.name}</h2>

                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} size={16} className="fill-yellow-400 text-yellow-400" />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500">(42 reviews)</span>
                            </div>

                            <p className="text-3xl font-black text-pink-600 mb-4">Rs {product.price}</p>

                            <p className={`text-sm leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {product.description || "Discover the secret to radiant beauty with our premium selection. This high-performance formula is designed to enhance your natural glow while providing long-lasting results."}
                            </p>

                            <div className="flex gap-4">
                                <Button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white rounded-full h-12 font-semibold"
                                >
                                    Add to Cart
                                </Button>
                                <Link href={`/products/${product.slug}`} onClick={() => setQuickViewOpen(false)}>
                                    <Button variant="outline" className="rounded-full h-12 px-6">
                                        View Details
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default ItemCard
