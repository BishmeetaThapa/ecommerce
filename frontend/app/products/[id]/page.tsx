'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Heart, ShoppingCart, ChevronLeft, Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react'
import axios from 'axios'
import { useDarkMode } from '@/components/providers/DarkModeProvider'
import { useCartStore } from '@/lib/store/useCartStore'
import { toast } from 'sonner'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const ProductViewPage = () => {
  const { darkMode } = useDarkMode()
  const { id } = useParams()
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((state) => state.addItem)

  useEffect(() => {
    if (!id) return

    const fetchProductBySlug = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/products/${id}`
        )
        const item = res.data
        // Normalize
        const normalized = {
          ...item,
          image_link: item.images?.[0]?.url || 'https://via.placeholder.com/400',
          brand: item.brand?.name || 'EverGlow'
        }
        setProduct(normalized)
      } catch (err) {
        console.error("Error fetching product:", err)
        toast.error("Failed to load product details from Everglow Server")
      } finally {
        setLoading(false)
      }
    }

    fetchProductBySlug()
  }, [id])

  if (loading) return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
    </div>
  )

  if (!product) return (
    <div className={`min-h-screen flex flex-col items-center justify-center gap-4 ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <h2 className="text-2xl font-bold">Product not found</h2>
      <Button onClick={() => router.push('/')} variant="outline" className="rounded-full">Back to Shop</Button>
    </div>
  )

  const handleAddToCart = () => {
    addItem(product)
    toast.success(`${product.name} added to cart!`)
  }

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'}`}>
      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 py-8 md:py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-pink-500 transition-colors mb-8 group"
        >
          <ChevronLeft size={18} className="transition-transform group-hover:-translate-x-1" />
          Back to Results
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className={`relative aspect-square rounded-3xl overflow-hidden border ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-100 shadow-inner'}`}>
              <img
                src={product.image_link}
                alt={product.name}
                className="w-full h-full object-contain p-8 hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-pink-500 hover:bg-pink-600 text-white border-none py-1 px-3">
                  Best Overall
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`aspect-square rounded-xl border-2 transition-all cursor-pointer ${i === 1 ? 'border-pink-500' : 'border-transparent opacity-50 hover:opacity-100 hover:border-pink-200'}`}>
                  <img src={product.image_link} alt="" className="w-full h-full object-contain p-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product Details */}
          <div className="flex flex-col">
            <div className="mb-6">
              <p className="text-pink-500 font-bold uppercase tracking-widest text-xs mb-2">{product.brand || 'Premium Beauty'}</p>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-0.5 rounded-md text-sm font-bold">
                  4.5 <Star size={14} fill="white" />
                </div>
                <span className="text-sm text-gray-500">1.2k Ratings & 450 Reviews</span>
              </div>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-4xl font-black text-pink-600">Rs {product.price}</span>
                <span className="text-xl text-gray-400 line-through">Rs {(parseFloat(product.price) * 1.5).toFixed(2)}</span>
                <Badge variant="outline" className="text-green-600 border-green-600 px-2">33% OFF</Badge>
              </div>

              <p className={`leading-relaxed mb-10 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {product.description || "Discover the secret to radiant beauty with our premium selection. This high-performance formula is designed to enhance your natural glow while providing long-lasting results."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-3 bg-pink-500 hover:bg-pink-600 text-white font-bold py-5 rounded-2xl shadow-xl shadow-pink-200 dark:shadow-none transition-all active:scale-[0.98]"
              >
                <ShoppingCart size={20} />
                Add to Cart Bag
              </button>
              <button className={`p-5 rounded-2xl border transition-all ${darkMode ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-200 hover:bg-pink-50 text-pink-500 hover:border-pink-200'}`}>
                <Heart size={24} />
              </button>
            </div>

            {/* Features Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-pink-50 dark:bg-gray-800 flex items-center justify-center text-pink-500">
                  <Truck size={20} />
                </div>
                <span className="text-xs font-bold">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-pink-50 dark:bg-gray-800 flex items-center justify-center text-pink-500">
                  <ShieldCheck size={20} />
                </div>
                <span className="text-xs font-bold">100% Authentic</span>
              </div>
              <div className="flex flex-col items-center text-center gap-2">
                <div className="w-10 h-10 rounded-full bg-pink-50 dark:bg-gray-800 flex items-center justify-center text-pink-500">
                  <RotateCcw size={20} />
                </div>
                <span className="text-xs font-bold">7 Days Return</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default ProductViewPage
