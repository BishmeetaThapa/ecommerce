'use client'

import { Heart, ShoppingCart } from 'lucide-react'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useDarkMode } from '@/components/DarkModeProvider/page'
import axios from 'axios'

const ProductViewPage = () => {
  const { darkMode } = useDarkMode()
   const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    const fetchProductById = async () => {
      try {
        // Fetch all products for a brand (or type)
        const res = await axios.get(
          "https://makeup-api.herokuapp.com/api/v1/products.json"
        )

        // Filter product by ID
        const found = res.data.find((p) => p.id.toString() === id.toString())

        setProduct(found || null)
      } catch (err) {
        console.error("Error fetching product:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchProductById()
  }, [id])

  if (loading) return <div>Loading...</div>
  if (!product) return <div>Product not found</div>

  return (
    <div className={`min-h-screen p-8 ${
      darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'
    }`}>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* Image */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <img
            src={product.image_link}
            alt={product.name}
            className="w-full h-[480px] object-cover"
          />
        </div>

        {/* Details */}
        <div className="space-y-5">
          <h1 className="text-2xl font-bold">{product.name}</h1>

          <p className="text-xl font-semibold text-pink-500">
            Rs {product.price}
          </p>

          <p className="opacity-80 text-sm">{product.description}</p>

          {/* Quantity */}
     

          {/* Buttons */}
          <div className="flex gap-4 mt-6">
            <button className="p-3 rounded-full border">
              <Heart className="text-pink-500" />
            </button>

            <button className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white py-3 rounded-xl">
              <ShoppingCart />
              Add to Cart
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default ProductViewPage
