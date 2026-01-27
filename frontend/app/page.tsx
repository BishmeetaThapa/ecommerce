
import { DarkModeProvider } from '@/components/providers/DarkModeProvider'
import Navbar from '@/components/layout/Navbar'
import ProductCategories from '@/components/commerce/ProductCategories'
import PromotionBanner from '@/components/commerce/PromotionBanner'
import ProductGrid from '@/components/commerce/ProductGrid'
import Footer from '@/components/layout/Footer'

import React from 'react'

const Home = () => {
  return (
    <DarkModeProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <ProductCategories />
          <div className="py-8">
            <PromotionBanner />
          </div>
          <ProductGrid />
        </main>
        <Footer />
      </div>
    </DarkModeProvider>
  )
}

export default Home