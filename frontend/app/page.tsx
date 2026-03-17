import { DarkModeProvider } from '@/components/providers/DarkModeProvider'
import Navbar from '@/components/layout/Navbar'
import ProductCategories from '@/components/commerce/ProductCategories'
import ProductGrid from '@/components/commerce/ProductGrid'
import FlashSale from '@/components/commerce/FlashSale'
import Footer from '@/components/layout/Footer'
import React from 'react'

const Home = () => {
  return (
    <DarkModeProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <ProductCategories />
          <FlashSale />
          <ProductGrid />
        </main>
        <Footer />
      </div>
    </DarkModeProvider>
  )
}

export default Home
