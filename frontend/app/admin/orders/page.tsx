'use client'

import React, { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table"
import {
  Dialog, DialogContent,
  DialogHeader, DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RefreshCcw, Eye, Package, User, MapPin, Calendar, CreditCard, Plus } from "lucide-react"

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/orders`
const USERS_API = `${process.env.NEXT_PUBLIC_API_URL}/api/users`
const PRODUCTS_API = `${process.env.NEXT_PUBLIC_API_URL}/api/products`

/* ================= ORDER DETAILS ================= */

function OrderDetailsDialog({ order }: { order: any }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !order) return null

  const orderId = order.id || order._id || ''
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
          <Eye size={16} />
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl rounded-[2rem] p-0 overflow-hidden outline-none">
        <DialogHeader>
          <DialogTitle className="sr-only">Order Details</DialogTitle>
        </DialogHeader>
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 p-8 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black mb-1">Order Details</h2>
              <p className="opacity-80 font-medium">#{orderId.slice(0, 8).toUpperCase()}</p>
            </div>
            <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 py-1 px-3 backdrop-blur-md rounded-lg font-bold">
              {order.status}
            </Badge>
          </div>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-900 font-bold">
                <User size={18} className="text-pink-500" /> Customer
              </div>
              <div className="pl-7 space-y-1">
                <p className="text-sm font-bold text-gray-700">{order.user?.name || "Premium Guest"}</p>
                <p className="text-xs text-gray-400">{order.user?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-900 font-bold">
                <MapPin size={18} className="text-pink-500" /> Shipping
              </div>
              <p className="pl-7 text-xs text-gray-400 leading-relaxed max-w-[200px]">
                {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.zipCode}, {order.shippingAddress?.country}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8">
            <div className="flex items-center gap-3 text-gray-900 font-bold mb-6">
              <Package size={18} className="text-pink-500" /> Order Summary
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[30vh] pr-2">
              {order.items?.map((item: any, index: number) => (
                <div key={item.product || index} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center font-bold text-xs">
                      Q x{item.quantity}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-400 font-bold uppercase tracking-tight line-clamp-1">{item.product?.name || "Product"}</span>
                      <span className="font-bold text-gray-700">Rs {item.price}</span>
                    </div>
                  </div>
                  <span className="font-black text-gray-900">Rs {item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-3xl p-6 flex justify-between items-center text-white">
            <span className="font-bold opacity-60">Grand Total</span>
            <span className="text-2xl font-black">Rs {order.totalAmount}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ================= MAIN PAGE ================= */

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    user: "",
    items: [] as any[],
    totalAmount: 0,
    status: "pending",
    shippingAddress: {
      street: "",
      city: "",
      zipCode: "",
      country: ""
    },
    paymentMethod: "cash on delivery"
  })

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await axios.get(API_BASE)
      setOrders(res.data)
    } catch {
      toast.error("Failed to sync order log")
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const res = await axios.get(USERS_API)
      setUsers(res.data)
    } catch (err) {
      console.error("Failed to fetch users", err)
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await axios.get(PRODUCTS_API)
      setProducts(res.data)
    } catch (err) {
      console.error("Failed to fetch products", err)
    }
  }

  useEffect(() => {
    fetchOrders()
    fetchUsers()
    fetchProducts()
    setMounted(true)
  }, [])

  const handleAddItem = (productId: string) => {
    const product = products.find(p => p._id === productId)
    if (!product) return

    // Get product image - check for different field names
    let productImage = ''
    if (product.image_link) {
      productImage = product.image_link
    } else if (product.images && product.images.length > 0) {
      productImage = product.images[0].url || product.images[0]
    } else if (typeof product.images === 'string') {
      productImage = product.images
    }

    const existing = formData.items.find((item: any) => item.product === productId)
    let newItems
    if (existing) {
      newItems = formData.items.map((item: any) =>
        item.product === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    } else {
      newItems = [...formData.items, {
        product: productId,
        name: product.name,
        price: Number(product.price) || 0,
        quantity: 1,
        image: productImage
      }]
    }

    // Calculate total synchronously
    const newTotal = newItems.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity)
    }, 0)

    setFormData({
      ...formData,
      items: newItems,
      totalAmount: newTotal
    })
  }

  const handleRemoveItem = (productId: string) => {
    setFormData({
      ...formData,
      items: formData.items.filter((item: any) => item.product !== productId)
    })
    calculateTotal()
  }

  const handleUpdateQuantity = (productId: string, change: number) => {
    setFormData(prev => {
      const updatedItems = prev.items.map((item: any) => {
        if (item.product === productId) {
          const newQuantity = item.quantity + change
          if (newQuantity < 1) {
            return null // Mark for removal
          }
          return { ...item, quantity: newQuantity }
        }
        return item
      }).filter(Boolean)

      const totalAmount = updatedItems.reduce((sum: number, item: any) => {
        return sum + (item.price * item.quantity)
      }, 0)

      return { ...prev, items: updatedItems, totalAmount }
    })
  }

  const calculateTotal = () => {
    const total = formData.items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity)
    }, 0)
    setFormData(prev => ({ ...prev, totalAmount: total }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const orderData = {
        user: formData.user,
        items: formData.items,
        totalAmount: formData.totalAmount,
        status: formData.status,
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod
      }
      console.log('Submitting order:', orderData)

      const res = await axios.post(API_BASE, orderData)
      console.log('Order created:', res.data)

      toast.success("Order created successfully")
      setIsAddDialogOpen(false)
      fetchOrders()

      // Reset form
      setFormData({
        user: "",
        items: [],
        totalAmount: 0,
        status: "pending",
        shippingAddress: {
          street: "",
          city: "",
          zipCode: "",
          country: ""
        },
        paymentMethod: "cash on delivery"
      })
    } catch (err: any) {
      console.error('Create order error:', err.response?.data || err.message)
      toast.error(err.response?.data?.error || "Failed to create order")
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await axios.put(`${API_BASE}/${id}`, { status })
      toast.success("Order status updated")
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    } catch {
      toast.error("Update failed")
    }
  }

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      (o.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (o.user?.email || "").toLowerCase().includes(search.toLowerCase())
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING': return <Badge variant="outline" className="text-orange-500 border-orange-200 bg-orange-50 rounded-lg">PENDING</Badge>
      case 'SHIPPED': return <Badge className="bg-blue-500 text-white rounded-lg">SHIPPED</Badge>
      case 'DELIVERED': return <Badge className="bg-green-500 text-white rounded-lg">DELIVERED</Badge>
      case 'CANCELLED': return <Badge variant="destructive" className="rounded-lg">CANCELLED</Badge>
      default: return <Badge className="rounded-lg">{status}</Badge>
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50/20 min-h-screen">
      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">
            Order <span className="text-pink-500">Logistics</span>
          </h1>
          <p className="text-gray-500 font-medium">
            Track customer sales, fulfillment status, and logistics.
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          {mounted && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="rounded-xl bg-pink-500 hover:bg-pink-600 text-white">
                  <Plus size={18} className="mr-2" />
                  Add Order
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-[2rem] p-6">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-black">Create New Order</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  {/* Customer Selection */}
                  <div className="space-y-2">
                    <Label className="font-bold text-gray-700">Customer</Label>
                    <select
                      value={formData.user}
                      onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-200 outline-none"
                      required
                    >
                      <option value="">Select a customer</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Products Selection */}
                  <div className="space-y-2">
                    <Label className="font-bold text-gray-700">Products</Label>
                    <select
                      id="productSelect"
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-200 outline-none"
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddItem(e.target.value)
                          e.target.value = ""
                        }
                      }}
                    >
                      <option value="">Add a product...</option>
                      {products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name} - Rs {product.price}
                        </option>
                      ))}
                    </select>

                    {/* Selected Items */}
                    <div className="space-y-2 mt-2">
                      {formData.items.map((item: any) => (
                        <div key={item.product} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                              <img src={item.image} alt={item.name} className="w-8 h-8 object-contain" />
                            </div>
                            <div>
                              <p className="font-bold text-sm">{item.name}</p>
                              <p className="text-pink-500 text-xs font-bold">Rs {item.price}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.product, -1)}
                              className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center hover:bg-gray-100"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-bold">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => handleUpdateQuantity(item.product, 1)}
                              className="w-8 h-8 rounded-lg bg-white border flex items-center justify-center hover:bg-gray-100"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveItem(item.product)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {formData.items.length > 0 && (
                      <div className="bg-pink-50 p-3 rounded-xl flex justify-between items-center">
                        <span className="font-bold text-gray-700">Total:</span>
                        <span className="text-xl font-black text-pink-600">Rs {formData.totalAmount}</span>
                      </div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <Label className="font-bold text-gray-700">Status</Label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-200 outline-none"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  {/* Shipping Address */}
                  <div className="space-y-2">
                    <Label className="font-bold text-gray-700">Shipping Address</Label>
                    <div className="grid grid-cols-2 gap-3">
                      <Input
                        placeholder="Street"
                        value={formData.shippingAddress.street}
                        onChange={(e) => setFormData({
                          ...formData,
                          shippingAddress: { ...formData.shippingAddress, street: e.target.value }
                        })}
                        className="rounded-xl"
                        required
                      />
                      <Input
                        placeholder="City"
                        value={formData.shippingAddress.city}
                        onChange={(e) => setFormData({
                          ...formData,
                          shippingAddress: { ...formData.shippingAddress, city: e.target.value }
                        })}
                        className="rounded-xl"
                        required
                      />
                      <Input
                        placeholder="Zip Code"
                        value={formData.shippingAddress.zipCode}
                        onChange={(e) => setFormData({
                          ...formData,
                          shippingAddress: { ...formData.shippingAddress, zipCode: e.target.value }
                        })}
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-2">
                    <Label className="font-bold text-gray-700">Payment Method</Label>
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-pink-200 outline-none"
                    >
                      <option value="cash on delivery">Cash on Delivery</option>
                      <option value="card">Card Payment</option>
                      <option value="esewa">eSewa</option>
                      <option value="khalti">Khalti</option>
                    </select>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting || formData.items.length === 0 || !formData.user}
                    className="w-full rounded-xl bg-pink-500 hover:bg-pink-600 text-white py-3"
                  >
                    {isSubmitting ? "Creating..." : "Create Order"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}

          <Input
            placeholder="Search by Order ID or User..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 rounded-xl border-gray-200 focus:ring-pink-500 transition-all shadow-sm"
          />
          <Button variant="outline" onClick={fetchOrders} className="rounded-xl hover:bg-pink-50 hover:text-pink-600 transition-colors">
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="py-5 px-6 font-bold text-gray-700">Order ID</TableHead>
              <TableHead className="font-bold text-gray-700">Customer</TableHead>
              <TableHead className="font-bold text-gray-700">Earnings</TableHead>
              <TableHead className="font-bold text-gray-700">Date</TableHead>
              <TableHead className="font-bold text-gray-700">Status</TableHead>
              <TableHead className="text-right py-5 px-6 font-bold text-gray-700">Management</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              [...Array(4)].map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell colSpan={6} className="py-6 px-6"><div className="h-10 bg-gray-100 rounded-xl"></div></TableCell>
                </TableRow>
              ))
            ) : filtered.length ? (
              filtered.map((o) => (
                <TableRow key={o._id || o.id} className="hover:bg-gray-50/50 transition-colors border-b last:border-0 border-gray-50">
                  <TableCell className="py-5 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gray-950 flex items-center justify-center text-white">
                        <CreditCard size={14} />
                      </div>
                      <span className="font-black text-gray-900 uppercase text-xs tracking-tighter">
                        #{o.id.slice(0, 8)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 leading-tight">{o.user?.name || "Premium User"}</span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{o.items?.length || 0} Items</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="font-black text-pink-600">
                      Rs {o.totalAmount}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold">
                      <Calendar size={14} className="text-gray-300" />
                      {new Date(o.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>

                  <TableCell>
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className="text-[10px] font-black uppercase tracking-tight bg-gray-50 border-0 outline-none p-1.5 rounded-lg focus:ring-1 focus:ring-pink-200"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="PROCESSING">PROCESSING</option>
                      <option value="SHIPPED">SHIPPED</option>
                      <option value="DELIVERED">DELIVERED</option>
                      <option value="CANCELLED">CANCELLED</option>
                    </select>
                  </TableCell>

                  <TableCell className="text-right py-5 px-6">
                    <OrderDetailsDialog order={o} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 bg-gray-50/20 text-gray-400 font-bold">No sales records found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
