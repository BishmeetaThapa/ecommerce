'use client'
import { DarkModeProvider } from '@/components/providers/DarkModeProvider'
import Navbar from '@/components/layout/Navbar'
import ProductGrid from '@/components/commerce/ProductGrid'
import Footer from '@/components/layout/Footer'
import { useSearchParams } from 'next/navigation'

export default function ProductsPage() {
    const searchParams = useSearchParams()
    const searchQuery = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const filter = searchParams.get('filter') || ''
    const isSale = searchParams.get('sale') === 'true'

    return (
        <DarkModeProvider>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-grow pt-20">
                    <ProductGrid searchQuery={searchQuery} category={category} filter={filter} isSale={isSale} />
                </main>
                <Footer />
            </div>
        </DarkModeProvider>
    )
}
