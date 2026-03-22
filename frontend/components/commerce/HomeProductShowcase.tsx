'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ProductCarousel from './ProductCarousel'
import { Loader2 } from 'lucide-react'

export default function HomeProductShowcase() {
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products`)
                setProducts(res.data)
            } catch (error) {
                console.error("Failed to fetch products for showcase", error)
            } finally {
                setLoading(false)
            }
        }
        fetchProducts()
    }, [])

    if (loading) {
        return (
            <div className="w-full flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            </div>
        )
    }

    // Curated dynamic lists based on database matching
    // 1. "Must Try Once" - Featured or well-known products (Taking first 10 for demo purposes, representing bestsellers)
    const featuredProducts = products.slice(0, 10)
    
    // 2. "For Healthy Hair" - Category matching hair
    const hairProducts = products.filter(p => p.category?.toLowerCase().includes('hair'))

    // 3. "It's Dot & Key" - Brand filtering
    const dotAndKeyProducts = products.filter(p => p.brand?.toLowerCase().includes('dot') || p.name.toLowerCase().includes('dot'))

    // 4. "Uv/AcMist Catch" - Sunscreen & UV specific items
    const uvProducts = products.filter(p => p.category?.toLowerCase().includes('sunscreen') || p.brand?.toLowerCase().includes('uv') || p.name.toLowerCase().includes('uv'))

    // 5. "Plum New Arrivals" - Brand checking
    const plumProducts = products.filter(p => p.brand?.toLowerCase().includes('plum') || p.name.toLowerCase().includes('plum'))

    return (
        <div className="w-full overflow-hidden">
            {hairProducts.length > 0 && (
                <ProductCarousel title="For Healthy Hair 💁‍♀️" products={hairProducts} exploreLink="/products?category=Hair Care" />
            )}

            {dotAndKeyProducts.length > 0 && (
                <ProductCarousel title="It's Dot & Key" products={dotAndKeyProducts} exploreLink="/products?search=dot" />
            )}

            {uvProducts.length > 0 && (
                <ProductCarousel title="Uv/AcMist Catch" products={uvProducts} exploreLink="/products?category=Sunscreen" />
            )}
            
            {featuredProducts.length > 0 && (
                <ProductCarousel title="Must Try Once 💯" products={featuredProducts} exploreLink="/products" />
            )}

            {plumProducts.length > 0 && (
                <ProductCarousel title="Plum New Arrivals !!!" products={plumProducts} exploreLink="/products?search=plum" />
            )}
        </div>
    )
}
