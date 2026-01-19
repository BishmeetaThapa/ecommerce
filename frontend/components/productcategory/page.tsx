'use client'
import React, { useRef } from 'react'
import { useDarkMode } from '../DarkModeProvider/page'

const categories = [
  { id: 1, name: 'Combo', image: 'https://cdn.vectorstock.com/i/500p/75/06/combo-offers-banner-vector-60167506.jpg' },
  { id: 2, name: 'Korean Beauty', image: 'https://cdn-cjhgk.nitrocdn.com/CXxGixRVyChwAxySbAyltuCiQXRKaWDN/assets/images/optimized/rev-9dad235/www.newbeauty.com/wp-content/uploads/2025/01/amazon-k-beauty.jpg' },
  { id: 3, name: 'Skincare', image: 'https://media.gq.com/photos/67295862476e3ee9ef071cdb/16:9/w_1280,c_limit/lededryskin.png' },
  { id: 4, name: 'Sunscreen', image: 'https://www.healme.com.np/storage/Product/PR-1688743339-1521835.webp' },
  { id: 5, name: 'Haircare', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9VB_pEdm4xpqP1TYe_kvB4NbHnQhEL2hnrg&s' },
  { id: 6, name: 'Makeup', image: 'https://glam21.in/cdn/shop/articles/12f51da6cd36ef54da0bf039797a3a7d.jpg?v=1676290647' },
  { id: 7, name: 'Lipstick', image: 'https://akns-images.eonline.com/eol_images/Entire_Site/2023624/rs_1024x759-230724093424-1024-E_Insider_Shop-Best_Lipsticks-gj.jpg' },
  { id: 8, name: 'Foundation', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrEURwEirNbQJ48Mt6mm-7gDtS_fFkaL39iQ&s' },
  { id: 9, name: 'Bodycare', image: 'https://img.freepik.com/free-photo/top-view-bath-concept-accessories_23-2148419370.jpg' },
  { id: 10, name: 'Accessories', image: 'https://img.freepik.com/free-photo/luxurious-shiny-golden-chain_23-2149635280.jpg' },
  { id: 11, name: 'Babycare', image: 'https://play-lh.googleusercontent.com/xFmpqGFhdU83jp9n8OxtE4GlXrIkndldG6TBGY_CyKYcgs_fB-aQASB2YA3EEdyiNQ' },
  { id: 12, name: 'Bogo', image: 'https://www.shutterstock.com/image-vector/bogo-sale-buy-one-get-600nw-1737964088.jpg' },
]

const ProductCategories = () => {
  const { darkMode } = useDarkMode()
  const scrollRef = useRef(null)

  const scrollLeft = () => {
    scrollRef.current.scrollBy({
      left: -300,
      behavior: 'smooth',
    })
  }

  const scrollRight = () => {
    scrollRef.current.scrollBy({
      left: 300,
      behavior: 'smooth',
    })
  }

  return (
    <section className={`w-full py-6 ${darkMode ? 'bg-gray-900' : 'bg-pink-50'}`}>
      <div className="flex justify-center">
        <div className="flex items-center gap-3 w-full max-w-6xl px-4">

          {/* Left Arrow */}
          <button
            onClick={scrollLeft}
            className="text-3xl cursor-pointer select-none"
          >
            ⬅
          </button>

          {/* SCROLL WRAPPER (LIMIT WIDTH) */}
          <div className="overflow-hidden w-full">
            <div
              ref={scrollRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth"
            >
              {categories.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center min-w-[90px] cursor-pointer transition-transform duration-300 hover:scale-105"
                >
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg ${
                      darkMode ? 'bg-gray-700' : 'bg-white'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  </div>

                  <p
                    className={`text-xs mt-2 text-center font-medium ${
                      darkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}
                  >
                    {item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Arrow */}
          <button
            onClick={scrollRight}
            className="text-3xl cursor-pointer select-none"
          >
            ➡
          </button>

        </div>
      </div>
    </section>
  )
}

export default ProductCategories
