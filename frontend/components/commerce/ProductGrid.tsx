'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ItemCard from './ItemCard'
import { Search, SlidersHorizontal, X } from 'lucide-react'

interface Product {
    _id: string
    id: string | number
    slug: string
    name: string
    price: number
    description?: string
    category?: string
    image_link: string
    images?: Array<{ url: string; isPrimary?: boolean }>
    brand?: string
    stock?: number
    bestSeller?: boolean
    salePrice?: number | null
    isOnSale?: boolean
    createdAt?: string
}

interface Brand {
    _id: string
    name: string
    slug: string
}

interface ProductGridProps {
    searchQuery?: string
    category?: string
    filter?: string
    isSale?: boolean
}

type SortOption = 'default' | 'price-low' | 'price-high' | 'name-a' | 'name-z'

const ProductGrid = ({ searchQuery = '', category = '', filter = '', isSale = false }: ProductGridProps) => {
    const [data, setData] = useState<Product[]>([])
    const [brands, setBrands] = useState<Brand[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedBrand, setSelectedBrand] = useState<string>('All')
    const [sortBy, setSortBy] = useState<SortOption>('default')
    const [showMobileFilters, setShowMobileFilters] = useState(false)

    const productsPerPage = 12
    const maxPageButtons = 5

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, brandsRes] = await Promise.all([
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/products`),
                    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/brands`)
                ])

                const normalizedData = productsRes.data.map((item: any) => ({
                    ...item,
                    id: item._id || item.id,
                    image_link: item.images?.[0]?.url || 'https://via.placeholder.com/400',
                    brand: item.brand || 'EverGlow',
                    bestSeller: Math.random() > 0.7
                }))
                setData(normalizedData)
                setBrands(brandsRes.data || [])
            } catch (err) {
                console.error(err)
                setError('Failed to fetch products from Everglow Server')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Filter products by brand, category, search query, and sale items
    let filteredProducts = selectedBrand === 'All'
        ? data
        : data.filter(item => item.brand === selectedBrand)

    // Filter by category if provided
    if (category) {
        filteredProducts = filteredProducts.filter(item =>
            item.category?.toLowerCase() === category.toLowerCase()
        )
    }

    // Filter for sale items if isSale is true
    if (isSale) {
        filteredProducts = filteredProducts.filter(item => item.isOnSale === true)
    }

    // Filter for new arrivals (products created in last 7 days)
    if (filter === 'new') {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        filteredProducts = filteredProducts.filter(item => {
            const createdAt = item.createdAt ? new Date(item.createdAt) : null
            return createdAt && createdAt >= sevenDaysAgo
        })
    }

    // Filter for best sellers (random flag set on products)
    if (filter === 'best') {
        filteredProducts = filteredProducts.filter(item => item.bestSeller === true)
    }

    if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredProducts = filteredProducts.filter(item =>
            item.name.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query) ||
            item.brand?.toLowerCase().includes(query) ||
            item.category?.toLowerCase().includes(query)
        )
    }

    // Get unique brands from filtered products (for dynamic brand display)
    const availableBrands = searchQuery && filteredProducts.length > 0
        ? [...new Set(filteredProducts.map((item: Product) => item.brand).filter(Boolean))] as string[]
        : []

    const showBrandFilters = searchQuery && availableBrands.length > 0

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortBy) {
            case 'price-low':
                return a.price - b.price
            case 'price-high':
                return b.price - a.price
            case 'name-a':
                return a.name.localeCompare(b.name)
            case 'name-z':
                return b.name.localeCompare(a.name)
            default:
                return 0
        }
    })

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-500 font-medium tracking-wide">Fetching the latest beauty trends...</p>
        </div>
    )

    if (error) return (
        <div className="text-center mt-20 p-8 bg-red-50 text-red-600 rounded-xl max-w-md mx-auto border border-red-100">
            <p className="font-bold text-lg mb-2">Oops! Something went wrong.</p>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                Try Again
            </button>
        </div>
    )

    const totalPages = Math.ceil(sortedProducts.length / productsPerPage)

    let startPage = Math.max(currentPage - Math.floor(maxPageButtons / 2), 1)
    let endPage = startPage + maxPageButtons - 1
    if (endPage > totalPages) {
        endPage = totalPages
        startPage = Math.max(endPage - maxPageButtons + 1, 1)
    }
    const visiblePages = []
    for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i)
    }

    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct)

    return (
        <div className="flex flex-col w-full max-w-7xl mx-auto">
            {/* Professional Header */}
            <div className="py-8 px-4 md:px-8">
                <div className="text-center mb-8">
                    {isSale ? (
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black mb-3 dark:text-white">
                                Flash <span className="text-pink-500">Sale Deals</span>
                            </h1>
                            <div className="h-1 w-24 bg-gradient-to-r from-pink-400 to-pink-600 mx-auto rounded-full mb-4"></div>
                            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                                Grab these limited-time offers before they're gone!
                            </p>
                        </div>
                    ) : category ? (
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black mb-3 dark:text-white">
                                {category}
                            </h1>
                            <div className="h-1 w-24 bg-gradient-to-r from-pink-400 to-pink-600 mx-auto rounded-full mb-4"></div>
                            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                                Browse our {category} collection
                            </p>
                        </div>
                    ) : filter === 'new' ? (
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black mb-3 dark:text-white">
                                New <span className="text-pink-500">Arrivals</span>
                            </h1>
                            <div className="h-1 w-24 bg-gradient-to-r from-pink-400 to-pink-600 mx-auto rounded-full mb-4"></div>
                            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                                Check out our latest products
                            </p>
                        </div>
                    ) : filter === 'best' ? (
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black mb-3 dark:text-white">
                                Best <span className="text-pink-500">Sellers</span>
                            </h1>
                            <div className="h-1 w-24 bg-gradient-to-r from-pink-400 to-pink-600 mx-auto rounded-full mb-4"></div>
                            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                                Our most popular products
                            </p>
                        </div>
                    ) : (
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black mb-3 dark:text-white">
                                Shop <span className="text-pink-500">All Products</span>
                            </h1>
                            <div className="h-1 w-24 bg-gradient-to-r from-pink-400 to-pink-600 mx-auto rounded-full mb-4"></div>
                            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
                                Explore our complete collection of premium beauty and skincare products
                            </p>
                        </div>
                    )}
                </div>

                {/* Toolbar with Filters and Sort */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 py-4 border-y border-gray-100 dark:border-gray-800">
                    {/* Mobile Filter Toggle */}
                    <button
                        onClick={() => setShowMobileFilters(!showMobileFilters)}
                        className="md:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-medium"
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filters
                    </button>

                    {/* Brand Pills - Desktop - Only show when searching with results */}
                    {showBrandFilters ? (
                        <div className="hidden md:flex flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    setSelectedBrand('All')
                                    setCurrentPage(1)
                                }}
                                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${selectedBrand === 'All'
                                    ? 'bg-pink-500 text-white shadow-lg shadow-pink-300'
                                    : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900'
                                    }`}
                            >
                                All
                            </button>
                            {availableBrands.map((brand) => (
                                <button
                                    key={brand}
                                    onClick={() => {
                                        setSelectedBrand(brand)
                                        setCurrentPage(1)
                                    }}
                                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${selectedBrand === brand
                                        ? 'bg-pink-500 text-white shadow-lg shadow-pink-300'
                                        : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-900'
                                        }`}
                                >
                                    {brand}
                                </button>
                            ))}
                        </div>
                    ) : null}

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-500 font-medium">Sort by:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as SortOption)}
                            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-pink-500"
                        >
                            <option value="default">Featured</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                            <option value="name-a">Name: A to Z</option>
                            <option value="name-z">Name: Z to A</option>
                        </select>
                    </div>
                </div>

                {/* Mobile Brand Pills */}
                {showBrandFilters && showMobileFilters && (
                    <div className="md:hidden py-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => {
                                    setSelectedBrand('All')
                                    setCurrentPage(1)
                                    setShowMobileFilters(false)
                                }}
                                className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${selectedBrand === 'All'
                                    ? 'bg-pink-500 text-white'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
                                    }`}
                            >
                                All
                            </button>
                            {availableBrands.map((brand) => (
                                <button
                                    key={brand}
                                    onClick={() => {
                                        setSelectedBrand(brand)
                                        setCurrentPage(1)
                                        setShowMobileFilters(false)
                                    }}
                                    className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 ${selectedBrand === brand
                                        ? 'bg-pink-500 text-white'
                                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600'
                                        }`}
                                >
                                    {brand}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Active Filters Display */}
                {(selectedBrand !== 'All' || category) && (
                    <div className="flex flex-wrap items-center gap-2 py-4">
                        <span className="text-sm text-gray-500">Active filter:</span>
                        {category && (
                            <button
                                onClick={() => {
                                    window.history.back()
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-medium"
                            >
                                {category}
                                <X className="w-3 h-3" />
                            </button>
                        )}
                        {selectedBrand !== 'All' && (
                            <button
                                onClick={() => {
                                    setSelectedBrand('All')
                                    setCurrentPage(1)
                                }}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-pink-600 rounded-full text-sm font-medium"
                            >
                                {selectedBrand}
                                <X className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Product Grid */}
            <div className="px-4 md:px-8 pb-12">
                {currentProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-6">
                            {currentProducts.map((item) => (
                                <ItemCard key={item._id || item.id} product={item} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex flex-col items-center gap-4 mt-12">
                                <p className="text-sm text-gray-500">
                                    Showing {indexOfFirstProduct + 1}-{Math.min(indexOfLastProduct, sortedProducts.length)} of {sortedProducts.length} products
                                </p>
                                <div className="flex items-center gap-2 flex-wrap justify-center">
                                    <button
                                        onClick={() => {
                                            setCurrentPage(prev => Math.max(prev - 1, 1))
                                            window.scrollTo({ top: 0, behavior: 'smooth' })
                                        }}
                                        className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-pink-500 hover:text-white transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current"
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>

                                    {visiblePages.map(page => (
                                        <button
                                            key={page}
                                            onClick={() => {
                                                setCurrentPage(page)
                                                window.scrollTo({ top: 0, behavior: 'smooth' })
                                            }}
                                            className={`w-10 h-10 rounded-full border transition flex items-center justify-center font-bold ${currentPage === page
                                                ? 'bg-pink-500 text-white border-pink-500 shadow-lg shadow-pink-300'
                                                : 'border-gray-200 dark:border-gray-700 hover:bg-pink-50 dark:hover:bg-gray-800'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => {
                                            setCurrentPage(prev => Math.min(prev + 1, totalPages))
                                            window.scrollTo({ top: 0, behavior: 'smooth' })
                                        }}
                                        className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-pink-500 hover:text-white transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current"
                                        disabled={currentPage === totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <Search className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                            No products found
                        </p>
                        <p className="text-gray-500">
                            {searchQuery
                                ? `We couldn't find any products matching "${searchQuery}"`
                                : 'No products available in this brand'
                            }
                        </p>
                        {selectedBrand !== 'All' && (
                            <button
                                onClick={() => {
                                    setSelectedBrand('All')
                                    setCurrentPage(1)
                                }}
                                className="mt-4 px-6 py-2 bg-pink-500 text-white rounded-full font-medium hover:bg-pink-600 transition"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductGrid
