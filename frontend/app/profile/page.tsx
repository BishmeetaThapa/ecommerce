'use client'
import { useEffect, useState } from 'react'
import { DarkModeProvider } from '@/components/providers/DarkModeProvider'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { User, Mail, Phone, Calendar, ShoppingBag, LogOut, Save, Edit2, Package, CreditCard, Truck, CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import axios from 'axios'
import { toast } from 'sonner'
import authUtils from '@/lib/auth'
import { useRouter } from 'next/navigation'

interface UserProfile {
    _id: string
    name: string
    email: string
    phone: string
    bio: string
    avatar: string
    role: string
    createdAt: string
}

interface Order {
    _id: string
    id?: string
    totalAmount: number
    status: string
    paymentMethod: string
    createdAt: string
    items?: Array<{
        name: string
        price: number
        quantity: number
        image: string
    }>
    products: Array<{
        name: string
        price: number
        quantity: number
        image: string
    }>
    shippingAddress?: {
        name: string
        address: string
        city: string
        phone: string
    }
}

type OrderTab = 'to_pay' | 'to_ship' | 'to_receive' | 'delivered' | 'returns' | 'cancelled'

export default function ProfilePage() {
    const router = useRouter()
    const [user, setUser] = useState<UserProfile | null>(null)
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<OrderTab>('to_receive')
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        bio: ''
    })

    useEffect(() => {
        fetchUserProfile()
        fetchOrders()
    }, [])

    const fetchUserProfile = async () => {
        try {
            const token = authUtils.getToken()
            if (!token) {
                router.push('/login')
                return
            }

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setUser(response.data)
            setFormData({
                name: response.data.name || '',
                phone: response.data.phone || '',
                bio: response.data.bio || ''
            })
        } catch (error) {
            console.error('Error fetching profile:', error)
            toast.error('Failed to load profile')
        } finally {
            setLoading(false)
        }
    }

    const fetchOrders = async () => {
        try {
            const token = authUtils.getToken()
            console.log('Token exists:', !!token)
            if (!token) {
                console.log('No token - not fetching orders')
                return
            }

            console.log('Fetching orders from API...')
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/api/orders/my-orders`,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            console.log('Orders response:', response.data)
            setOrders(response.data)
        } catch (error: any) {
            console.error('Error fetching orders:', error?.response?.data || error.message)
            toast.error('Failed to load orders: ' + (error?.response?.data?.error || error.message))
        }
    }

    const handleSaveProfile = async () => {
        setSaving(true)
        try {
            const token = authUtils.getToken()
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setUser(response.data)
            authUtils.setAuth({ ...user!, ...response.data }, token!)
            setIsEditing(false)
            toast.success('Profile updated successfully!')
        } catch (error) {
            console.error('Error updating profile:', error)
            toast.error('Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    const handleLogout = () => {
        authUtils.logout()
        router.push('/')
        toast.success('Logged out successfully')
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

    const handleUpdateOrderStatus = async (orderId: string, status: string) => {
        setUpdatingOrderId(orderId)
        try {
            const token = authUtils.getToken()
            await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            // Update local state smoothly
            setOrders(prev => prev.map(o => (o._id === orderId || o.id === orderId) ? { ...o, status } : o))
            toast.success(`Order successfully marked as ${status.replace('_', ' ')}`)
        } catch (error: any) {
            console.error('Update order error:', error)
            toast.error(error.response?.data?.error || 'Failed to update order status')
        } finally {
            setUpdatingOrderId(null)
        }
    }

    // Filter orders by status
    const toPayOrders = orders.filter(o => o.status?.toLowerCase() === 'pending')
    const toShipOrders = orders.filter(o => o.status?.toLowerCase() === 'processing')
    const toReceiveOrders = orders.filter(o => o.status?.toLowerCase() === 'shipped')
    const deliveredOrders = orders.filter(o => o.status?.toLowerCase() === 'delivered')
    const returnOrders = orders.filter(o => o.status?.toLowerCase() === 'return_requested' || o.status?.toLowerCase() === 'returned')
    const cancelledOrders = orders.filter(o => o.status?.toLowerCase() === 'cancelled')

    const getOrdersByTab = (tab: OrderTab): Order[] => {
        switch (tab) {
            case 'to_pay': return toPayOrders
            case 'to_ship': return toShipOrders
            case 'to_receive': return toReceiveOrders
            case 'delivered': return deliveredOrders
            case 'returns': return returnOrders
            case 'cancelled': return cancelledOrders
            default: return []
        }
    }

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
            case 'processing': return 'bg-blue-100 text-blue-700 border-blue-200'
            case 'shipped': return 'bg-purple-100 text-purple-700 border-purple-200'
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200'
            case 'return_requested': return 'bg-orange-100 text-orange-700 border-orange-200'
            case 'returned': return 'bg-teal-100 text-teal-700 border-teal-200'
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200'
            default: return 'bg-gray-100 text-gray-700 border-gray-200'
        }
    }

    const getStatusLabel = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'pending': return 'To Pay'
            case 'processing': return 'To Ship'
            case 'shipped': return 'To Receive'
            case 'delivered': return 'Delivered'
            case 'return_requested': return 'Return Requested'
            case 'returned': return 'Returned'
            case 'cancelled': return 'Cancelled'
            default: return status
        }
    }

    if (loading) {
        return (
            <DarkModeProvider>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
                </div>
            </DarkModeProvider>
        )
    }

    if (!user) {
        return (
            <DarkModeProvider>
                <div className="min-h-screen flex flex-col">
                    <Navbar />
                    <main className="flex-grow flex items-center justify-center">
                        <div className="text-center">
                            <h2 className="text-2xl font-bold mb-4">Please login to view your profile</h2>
                            <Button onClick={() => router.push('/login')} className="bg-pink-500 hover:bg-pink-600">
                                Login
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
                    <div className="max-w-6xl mx-auto">
                        <h1 className="text-3xl md:text-4xl font-black mb-8 text-center">
                            My <span className="text-pink-500">Account</span>
                        </h1>

                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            {/* Left Sidebar - Profile Info */}
                            <div className="lg:col-span-1">
                                <Card className="border-gray-200 dark:border-gray-700 sticky top-24">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-lg font-bold">My Profile</CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setIsEditing(!isEditing)}
                                            className="text-pink-500 hover:text-pink-600 h-8 w-8 p-0"
                                        >
                                            {isEditing ? '✕' : <Edit2 className="w-4 h-4" />}
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {/* Avatar */}
                                        <div className="flex flex-col items-center">
                                            <div className="w-24 h-24 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mb-3">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                                                ) : (
                                                    <User className="w-12 h-12 text-pink-500" />
                                                )}
                                            </div>
                                            <p className="font-bold text-lg">{user.name}</p>
                                            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                                        </div>

                                        <Separator />

                                        {/* Profile Fields */}
                                        <div className="space-y-3">
                                            <div className="space-y-1">
                                                <Label className="text-gray-500 text-xs flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> Email
                                                </Label>
                                                <p className="font-medium text-sm">{user.email}</p>
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-gray-500 text-xs flex items-center gap-1">
                                                    <Phone className="w-3 h-3" /> Phone
                                                </Label>
                                                {isEditing ? (
                                                    <Input
                                                        id="phone"
                                                        value={formData.phone}
                                                        onChange={handleChange}
                                                        placeholder="Your phone"
                                                        className="h-8"
                                                    />
                                                ) : (
                                                    <p className="font-medium text-sm">{user.phone || 'Not set'}</p>
                                                )}
                                            </div>

                                            <div className="space-y-1">
                                                <Label className="text-gray-500 text-xs flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> Member Since
                                                </Label>
                                                <p className="font-medium text-sm">
                                                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </p>
                                            </div>
                                        </div>

                                        {isEditing && (
                                            <div className="space-y-2">
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    placeholder="Your name"
                                                    className="h-8"
                                                />
                                                <Button
                                                    onClick={handleSaveProfile}
                                                    disabled={saving}
                                                    className="w-full bg-pink-500 hover:bg-pink-600 text-sm h-8"
                                                >
                                                    {saving ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                            </div>
                                        )}

                                        <Separator />

                                        {/* Logout */}
                                        <Button
                                            onClick={handleLogout}
                                            variant="outline"
                                            className="w-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 text-sm h-8"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Right Content - Orders */}
                            <div className="lg:col-span-3">
                                <Card className="border-gray-200 dark:border-gray-700">
                                    <CardHeader>
                                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                                            <ShoppingBag className="w-5 h-5 text-pink-500" />
                                            My Orders
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Order Status Tabs */}
                                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-6">
                                            <button
                                                onClick={() => setActiveTab('to_pay')}
                                                className={`p-3 rounded-xl text-center transition-all ${activeTab === 'to_pay' ? 'bg-pink-500 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-pink-100'}`}
                                            >
                                                <CreditCard className="w-5 h-5 mx-auto mb-1" />
                                                <span className="text-xs font-medium">To Pay</span>
                                                {toPayOrders.length > 0 && (
                                                    <span className="block bg-yellow-500 text-white text-[10px] rounded-full w-4 h-4 mx-auto mt-1">
                                                        {toPayOrders.length}
                                                    </span>
                                                )}
                                            </button>

                                            <button
                                                onClick={() => setActiveTab('to_ship')}
                                                className={`p-3 rounded-xl text-center transition-all ${activeTab === 'to_ship' ? 'bg-pink-500 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-pink-100'}`}
                                            >
                                                <Package className="w-5 h-5 mx-auto mb-1" />
                                                <span className="text-xs font-medium">To Ship</span>
                                                {toShipOrders.length > 0 && (
                                                    <span className="block bg-blue-500 text-white text-[10px] rounded-full w-4 h-4 mx-auto mt-1">
                                                        {toShipOrders.length}
                                                    </span>
                                                )}
                                            </button>

                                            <button
                                                onClick={() => setActiveTab('to_receive')}
                                                className={`p-3 rounded-xl text-center transition-all ${activeTab === 'to_receive' ? 'bg-pink-500 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-pink-100'}`}
                                            >
                                                <Truck className="w-5 h-5 mx-auto mb-1" />
                                                <span className="text-xs font-medium">To Receive</span>
                                                {toReceiveOrders.length > 0 && (
                                                    <span className="block bg-purple-500 text-white text-[10px] rounded-full w-4 h-4 mx-auto mt-1">
                                                        {toReceiveOrders.length}
                                                    </span>
                                                )}
                                            </button>

                                            <button
                                                onClick={() => setActiveTab('delivered')}
                                                className={`p-3 rounded-xl text-center transition-all ${activeTab === 'delivered' ? 'bg-pink-500 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-pink-100'}`}
                                            >
                                                <CheckCircle className="w-5 h-5 mx-auto mb-1" />
                                                <span className="text-xs font-medium">Delivered</span>
                                                {deliveredOrders.length > 0 && (
                                                    <span className="block bg-green-500 text-white text-[10px] rounded-full w-4 h-4 mx-auto mt-1">
                                                        {deliveredOrders.length}
                                                    </span>
                                                )}
                                            </button>

                                            <button
                                                onClick={() => setActiveTab('returns')}
                                                className={`p-3 rounded-xl text-center transition-all ${activeTab === 'returns' ? 'bg-pink-500 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-pink-100'}`}
                                            >
                                                <RotateCcw className="w-5 h-5 mx-auto mb-1" />
                                                <span className="text-xs font-medium">Returns</span>
                                                {returnOrders.length > 0 && (
                                                    <span className="block bg-orange-500 text-white text-[10px] rounded-full w-4 h-4 mx-auto mt-1">
                                                        {returnOrders.length}
                                                    </span>
                                                )}
                                            </button>

                                            <button
                                                onClick={() => setActiveTab('cancelled')}
                                                className={`p-3 rounded-xl text-center transition-all ${activeTab === 'cancelled' ? 'bg-pink-500 text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-pink-100'}`}
                                            >
                                                <XCircle className="w-5 h-5 mx-auto mb-1" />
                                                <span className="text-xs font-medium">Cancelled</span>
                                                {cancelledOrders.length > 0 && (
                                                    <span className="block bg-red-500 text-white text-[10px] rounded-full w-4 h-4 mx-auto mt-1">
                                                        {cancelledOrders.length}
                                                    </span>
                                                )}
                                            </button>
                                        </div>

                                        {/* Orders List */}
                                        <div className="space-y-4">
                                            {getOrdersByTab(activeTab).length === 0 ? (
                                                <div className="text-center py-12">
                                                    <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                    <p className="text-gray-500 mb-2">No orders in this category</p>
                                                    <Button
                                                        onClick={() => router.push('/products')}
                                                        className="bg-pink-500 hover:bg-pink-600"
                                                    >
                                                        Start Shopping
                                                    </Button>
                                                </div>
                                            ) : (
                                                getOrdersByTab(activeTab).map((order) => (
                                                    <div
                                                        key={order._id}
                                                        className="border border-gray-200 dark:border-gray-700 rounded-xl p-4"
                                                    >
                                                        {/* Order Header */}
                                                        <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-gray-100 dark:border-gray-700">
                                                            <div>
                                                                <p className="font-bold">Order #{order._id.slice(-8)}</p>
                                                                <p className="text-xs text-gray-500">
                                                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </p>
                                                            </div>
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                                                                {getStatusLabel(order.status)}
                                                            </span>
                                                        </div>

                                                        {/* Order Items */}
                                                        <div className="space-y-3">
                                                            {(order.items || order.products as any).map((product: any, idx: number) => (
                                                                <div key={idx} className="flex gap-3">
                                                                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                                                        <img
                                                                            src={product.image}
                                                                            alt={product.name}
                                                                            className="w-full h-full object-contain p-1"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="font-medium text-sm line-clamp-1">{product.name}</p>
                                                                        <p className="text-xs text-gray-500">Qty: {product.quantity}</p>
                                                                    </div>
                                                                    <p className="font-bold text-sm text-pink-500">Rs {product.price * product.quantity}</p>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Order Footer */}
                                                        <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                            <div className="text-sm">
                                                                <span className="text-gray-500">Payment: </span>
                                                                <span className="font-medium">{order.paymentMethod || 'Cash on Delivery'}</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-gray-500 text-sm">Total: </span>
                                                                <span className="font-bold text-lg text-pink-500">Rs {order.totalAmount}</span>
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        {['pending', 'processing'].includes(order.status?.toLowerCase() || '') && (
                                                            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                                                <Button 
                                                                    variant="destructive" 
                                                                    size="sm"
                                                                    disabled={updatingOrderId === (order._id || order.id)}
                                                                    onClick={() => handleUpdateOrderStatus((order._id || order.id) as string, 'cancelled')}
                                                                >
                                                                    {updatingOrderId === (order._id || order.id) ? 'Processing...' : 'Cancel Order'}
                                                                </Button>
                                                            </div>
                                                        )}
                                                        {order.status?.toLowerCase() === 'shipped' && (
                                                            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                                                <Button 
                                                                    className="bg-green-500 hover:bg-green-600 text-white" 
                                                                    size="sm"
                                                                    disabled={updatingOrderId === (order._id || order.id)}
                                                                    onClick={() => handleUpdateOrderStatus((order._id || order.id) as string, 'delivered')}
                                                                >
                                                                    {updatingOrderId === (order._id || order.id) ? 'Processing...' : 'Mark as Received'}
                                                                </Button>
                                                            </div>
                                                        )}
                                                        {order.status?.toLowerCase() === 'delivered' && (
                                                            <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="sm"
                                                                    disabled={updatingOrderId === (order._id || order.id)}
                                                                    onClick={() => handleUpdateOrderStatus((order._id || order.id) as string, 'return_requested')}
                                                                >
                                                                    {updatingOrderId === (order._id || order.id) ? 'Processing...' : 'Request Return'}
                                                                </Button>
                                                            </div>
                                                        )}

                                                        {/* Shipping Address */}
                                                        {order.shippingAddress && (
                                                            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                                <p className="text-xs text-gray-500 mb-1">Shipping Address:</p>
                                                                <p className="text-sm">
                                                                    {order.shippingAddress.name}, {order.shippingAddress.address}, {order.shippingAddress.city}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </DarkModeProvider>
    )
}
