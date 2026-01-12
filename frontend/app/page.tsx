
import { DarkModeProvider } from '@/components/DarkModeProvider/page'
import Navbar from '@/components/Navbar/page'
import ProductCard from '@/components/productcard/page'

import React from 'react'

const Home = () => {
  return (
    <div>
      <DarkModeProvider>
   <Navbar/>
   <ProductCard/>
   </DarkModeProvider>
    </div>
  )
}

export default Home