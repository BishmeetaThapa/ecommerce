'use client'
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ItemCard from './ItemCard'

const ProductGrid = () => {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const productsPerPage = 12
    const maxPageButtons = 5

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:5000/api/products'
                )
                // Normalize data from our backend
                const normalizedData = response.data.map((item: any) => ({
                    ...item,
                    image_link: item.images?.[0]?.url || 'https://via.placeholder.com/400',
                    brand: item.brand?.name || 'EverGlow',
                    bestSeller: Math.random() > 0.7
                }))
                setData(normalizedData)
            } catch (err) {
                console.error(err)
                setError('Failed to fetch products from Everglow Server')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

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

    const totalPages = Math.ceil(data.length / productsPerPage)

    // Pagination logic
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
    const currentProducts = data.slice(indexOfFirstProduct, indexOfLastProduct)

    return (
        <div className="flex flex-col items-center gap-10 py-12 px-4 max-w-7xl mx-auto">

            <div className="text-center">
                <h2 className="text-3xl font-extrabold mb-2 dark:text-white">Our Collections</h2>
                <div className="h-1 w-20 bg-pink-500 mx-auto rounded-full"></div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center w-full">
                {currentProducts.map((item: any) => (
                    <ItemCard key={item.id} product={item} />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center gap-2 mt-6 flex-wrap justify-center">
                    <button
                        onClick={() => {
                            setCurrentPage(prev => Math.max(prev - 1, 1))
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className="px-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-pink-500 hover:text-white transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current"
                        disabled={currentPage === 1}
                    >
                        Prev
                    </button>

                    {visiblePages.map(page => (
                        <button
                            key={page}
                            onClick={() => {
                                setCurrentPage(page)
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            }}
                            className={`w-10 h-10 rounded-full border transition flex items-center justify-center font-medium ${currentPage === page
                                ? 'bg-pink-500 text-white border-pink-500 shadow-lg'
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
            )}
        </div>
    )
}

export default ProductGrid
