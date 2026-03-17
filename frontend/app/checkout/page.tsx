'use client'
import { useEffect, useState } from 'react'
import { DarkModeProvider } from '@/components/providers/DarkModeProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useCartStore } from '@/lib/store/useCartStore'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Loader2, CheckCircle, MapPin, CreditCard, Truck, Banknote, Smartphone } from 'lucide-react'
import authUtils from '@/lib/auth'

const SHIPPING_FEE = 150

interface FormData {
    name: string
    email: string
    phone: string
    address: string
    city: string
    zipCode: string
}

type PaymentMethod = 'cod' | 'esewa' | 'khalti' | 'credit_card' | 'debit_card'

export default function CheckoutPage() {
    const router = useRouter()
    const { items, getTotalPrice, getTotalItems, clearCart } = useCartStore()
    const [loading, setLoading] = useState(false)
    const [orderComplete, setOrderComplete] = useState(false)
    const [orderId, setOrderId] = useState('')
    const [user, setUser] = useState<any>(null)

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: ''
    })
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')

    useEffect(() => {
        const currentUser = authUtils.getUser()
        if (currentUser) {
            setUser(currentUser)
            setFormData(prev => ({
                ...prev,
                name: currentUser.name || '',
                email: currentUser.email || '',
                phone: (currentUser as any).phone || ''
            }))
        }
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const token = authUtils.getToken()
            const currentUser = authUtils.getUser()

            // Check if user is logged in
            if (!token || !currentUser) {
                setLoading(false)
                toast.error('Please login to place an order')
                router.push('/login')
                return
            }

            const headers = token ? { Authorization: `Bearer ${token}` } : {}

            const orderData = {
                user: currentUser._id,
                items: items.map(item => ({
                    productId: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image_link
                })),
                shippingAddress: {
                    name: formData.name,
                    address: formData.address,
                    city: formData.city,
                    zipCode: formData.zipCode,
                    phone: formData.phone
                },
                totalAmount: getTotalPrice() + SHIPPING_FEE,
                shippingFee: SHIPPING_FEE,
                paymentMethod: paymentMethod,
                status: 'pending'
            }

            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/orders`,
                orderData,
                { headers }
            )

            if (response.data._id) {
                setOrderId(response.data._id)
                setOrderComplete(true)
                clearCart()
                toast.success('Order placed successfully!')
            }
        } catch (error: any) {
            console.error('Order error:', error)
            toast.error(error.response?.data?.error || 'Failed to place order. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (items.length === 0 && !orderComplete) {
        return (
            <DarkModeProvider>
                <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow flex items-center justify-center pt-20">
                        <div className="text-center p-8">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <CreditCard className="w-12 h-12 text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                            <p className="text-gray-500 mb-6">Add some products to your cart to checkout</p>
                            <Button
                                onClick={() => router.push('/products')}
                                className="bg-pink-500 hover:bg-pink-600 text-white rounded-full"
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

    if (orderComplete) {
        return (
            <DarkModeProvider>
                <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow flex items-center justify-center pt-20 px-4">
                        <div className="text-center max-w-md">
                            <div className="w-24 h-24 mx-auto mb-6 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </div>
                            <h2 className="text-3xl font-black mb-4">Order Placed!</h2>
                            <p className="text-gray-500 mb-2">Thank you for your order</p>
                            <p className="text-sm text-gray-400 mb-6">Order ID: {orderId}</p>
                            <div className="space-y-3">
                                <Button
                                    onClick={() => router.push('/products')}
                                    className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full"
                                >
                                    Continue Shopping
                                </Button>
                                <Button
                                    onClick={() => router.push('/admin/orders')}
                                    variant="outline"
                                    className="w-full rounded-full"
                                >
                                    View Orders
                                </Button>
                            </div>
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
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-black mb-8 text-center">
                            Secure <span className="text-pink-500">Checkout</span>
                        </h1>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Shipping Information */}
                            <div className={`p-6 rounded-2xl ${false ? 'bg-gray-800' : 'bg-white border border-gray-200'} shadow-sm`}>
                                <div className="flex items-center gap-2 mb-6">
                                    <MapPin className="w-5 h-5 text-pink-500" />
                                    <h2 className="text-xl font-bold">Shipping Information</h2>
                                </div>

                                <div className="grid gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+977 98XXXXXXXX"
                                            required
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="123 Main Street"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                placeholder="Kathmandu"
                                                required
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="zipCode">Zip Code</Label>
                                            <Input
                                                id="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                placeholder="44600"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="space-y-6">
                                {/* Payment Method */}
                                <div className={`p-6 rounded-2xl ${false ? 'bg-gray-800' : 'bg-white border border-gray-200'} shadow-sm`}>
                                    <div className="flex items-center gap-2 mb-6">
                                        <CreditCard className="w-5 h-5 text-pink-500" />
                                        <h2 className="text-xl font-bold">Payment Method</h2>
                                    </div>

                                    <div className="grid gap-3">
                                        <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20' : 'border-gray-200 hover:border-pink-200'}`}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="cod"
                                                    checked={paymentMethod === 'cod'}
                                                    onChange={() => setPaymentMethod('cod')}
                                                    className="w-5 h-5 text-pink-500"
                                                />
                                                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                                    <Banknote className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">Cash on Delivery</p>
                                                    <p className="text-sm text-gray-500">Pay when you receive</p>
                                                </div>
                                            </div>
                                        </label>

                                        <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'esewa' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20' : 'border-gray-200 hover:border-pink-200'}`}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="esewa"
                                                    checked={paymentMethod === 'esewa'}
                                                    onChange={() => setPaymentMethod('esewa')}
                                                    className="w-5 h-5 text-pink-500"
                                                />
                                                <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                                                    <Smartphone className="w-5 h-5 text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">eSewa</p>
                                                    <p className="text-sm text-gray-500">Pay via eSewa app</p>
                                                </div>
                                            </div>
                                        </label>

                                        <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'khalti' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20' : 'border-gray-200 hover:border-pink-200'}`}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="khalti"
                                                    checked={paymentMethod === 'khalti'}
                                                    onChange={() => setPaymentMethod('khalti')}
                                                    className="w-5 h-5 text-pink-500"
                                                />
                                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                                                    <Smartphone className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">Khalti</p>
                                                    <p className="text-sm text-gray-500">Pay via Khalti app</p>
                                                </div>
                                            </div>
                                        </label>

                                        <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'credit_card' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20' : 'border-gray-200 hover:border-pink-200'}`}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="credit_card"
                                                    checked={paymentMethod === 'credit_card'}
                                                    onChange={() => setPaymentMethod('credit_card')}
                                                    className="w-5 h-5 text-pink-500"
                                                />
                                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                                    <CreditCard className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">Credit Card</p>
                                                    <p className="text-sm text-gray-500">Visa, Mastercard, etc.</p>
                                                </div>
                                            </div>
                                        </label>

                                        <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'debit_card' ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/20' : 'border-gray-200 hover:border-pink-200'}`}>
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="radio"
                                                    name="paymentMethod"
                                                    value="debit_card"
                                                    checked={paymentMethod === 'debit_card'}
                                                    onChange={() => setPaymentMethod('debit_card')}
                                                    className="w-5 h-5 text-pink-500"
                                                />
                                                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
                                                    <CreditCard className="w-5 h-5 text-indigo-600" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">Debit Card</p>
                                                    <p className="text-sm text-gray-500">Visa, Mastercard, etc.</p>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className={`p-6 rounded-2xl ${false ? 'bg-gray-800' : 'bg-white border border-gray-200'} shadow-sm`}>
                                    <div className="flex items-center gap-2 mb-6">
                                        <Truck className="w-5 h-5 text-pink-500" />
                                        <h2 className="text-xl font-bold">Order Summary</h2>
                                    </div>

                                    <div className="space-y-4 max-h-80 overflow-y-auto">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex gap-4">
                                                <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                                    <img src={item.image_link} alt={item.name} className="w-full h-full object-contain p-1" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                                                    <p className="text-pink-500 font-bold text-sm">Rs {item.price}</p>
                                                    <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">Rs {(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator className="my-4" />

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Subtotal ({getTotalItems()} items)</span>
                                            <span>Rs {getTotalPrice().toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Shipping</span>
                                            <span className="font-medium">Rs {SHIPPING_FEE.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
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
                                        type="submit"
                                        disabled={loading}
                                        className="w-full mt-6 bg-pink-500 hover:bg-pink-600 text-white rounded-full py-6 text-lg font-bold shadow-lg shadow-pink-200"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CreditCard className="w-5 h-5 mr-2" />
                                                Place Order - Rs {(getTotalPrice() + SHIPPING_FEE).toFixed(2)}
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-center text-xs text-gray-400 mt-4">
                                        Secure checkout powered by EverGlow
                                    </p>
                                </div>
                            </div>
                        </form>
                    </div>
                </main>
                <Footer />
            </div>
        </DarkModeProvider>
    )
}
