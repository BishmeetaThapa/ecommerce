import { DarkModeProvider } from '@/components/providers/DarkModeProvider'
import Navbar from '@/components/layout/Navbar'
import ProductCategories from '@/components/commerce/ProductCategories'
import FlashSale from '@/components/commerce/FlashSale'
import HomeProductShowcase from '@/components/commerce/HomeProductShowcase'
import ProductGrid from '@/components/commerce/ProductGrid'
import Footer from '@/components/layout/Footer'
import React from 'react'

const Home = () => {
  return (
    <DarkModeProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-20">
          <ProductCategories />
          <FlashSale />
          <ProductGrid limit={12} />
          <HomeProductShowcase />
        </main>
        <Footer />
      </div>
    </DarkModeProvider>
  )
}

export default Home
