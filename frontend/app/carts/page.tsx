'use client'
import { useEffect, useState } from 'react'
import { DarkModeProvider } from '@/components/providers/DarkModeProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useCartStore } from '@/lib/store/useCartStore'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'

const SHIPPING_FEE = 150

export default function CartsPage() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  if (!isHydrated) {
    return (
      <DarkModeProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-20"></main>
          <Footer />
        </div>
      </DarkModeProvider>
    )
  }

  if (items.length === 0) {
    return (
      <DarkModeProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow pt-20 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-12 h-12 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">Add some products to your cart to continue</p>
              <Button
                onClick={() => router.push('/products')}
                className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-8"
              >
                Start Shopping
              </Button>
            </div>
          </main>
          <Footer />
        </div>
      </DarkModeProvider>
    )
  }

  return (
    <DarkModeProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20 pb-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-black mb-8">
              Your <span className="text-pink-500">Cart</span>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image_link} alt={item.name} className="w-full h-full object-contain p-2" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold line-clamp-1">{item.name}</h3>
                        <p className="text-pink-500 font-bold mt-1">Rs {item.price}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center border dark:border-gray-600 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">Rs {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="h-fit">
                <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 sticky top-24">
                  <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Subtotal ({getTotalItems()} items)</span>
                      <span>Rs {getTotalPrice().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Shipping</span>
                      <span className="font-medium">Rs {SHIPPING_FEE.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Tax</span>
                      <span>Rs 0.00</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total</span>
                      <span className="text-pink-600">Rs {(getTotalPrice() + SHIPPING_FEE).toFixed(2)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => router.push('/checkout')}
                    className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white rounded-full py-6 text-lg font-bold"
                  >
                    Proceed to Checkout
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </DarkModeProvider>
  )
}
