'use client'
import { Heart } from 'lucide-react'
import React from 'react'
import { useDarkMode } from '../DarkModeProvider/page'
import Link from 'next/link'

const ItemCard = ({product}) => {
  const { darkMode } = useDarkMode()

  return (
    
    <div className={` w-[24%] p-4 rounded-xl shadow-lg border transition-colors ml-3 mt-3 duration-300 ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>

      {/* Best Seller Badge */}
      {product.bestSeller && (
        <div className="bg-yellow-300 text-xs w-24 text-center rounded-full px-2 py-1 mb-2 font-semibold shadow-sm">
          Best Seller
        </div>
      )}

      {/* Product Image */}
      
      <div className="w-full h-52 flex items-center justify-center overflow-hidden rounded-lg mb-3">
        <img 
          src={product.image_link} 
          alt={product.name} 
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105 rounded-lg"
        />
      </div>

      {/* Product Name & Price */}
      <Link href={`/products/${product.id}`}>
      <div className={`mb-3 transition-colors duration-300 cursor-pointer ${
        darkMode ? 'text-gray-100 hover:text-pink-400' : 'text-gray-800 hover:text-pink-600'
      }`}>
        <h3 className="font-semibold text-sm">{product.name}</h3>
        <div className="text-md font-bold mt-1">Rs {product.price}</div>
      </div>
</Link>
   
      
    </div>
  )
}

export default ItemCard
