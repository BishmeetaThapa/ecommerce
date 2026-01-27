'use client'

import React, { useEffect, useState } from "react"
import axios from "axios"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, Users, Tags, TrendingUp, Sparkles } from "lucide-react"

const API_BASE = "http://localhost:5000/api"

export default function AdminOverview() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    orders: 0,
    users: 0,
    revenue: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [topCustomers, setTopCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [productsRes, catsRes, ordersRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE}/products`),
          axios.get(`${API_BASE}/products/categories`),
          axios.get(`${API_BASE}/orders`),
          axios.get(`${API_BASE}/users`)
        ])

        const totalOrders = ordersRes.data.length
        const totalRevenue = ordersRes.data.reduce((acc: number, curr: any) => acc + (curr.totalAmount || 0), 0)

        setStats({
          products: productsRes.data.length,
          categories: catsRes.data.length,
          orders: totalOrders,
          users: usersRes.data.length,
          revenue: totalRevenue
        })

        setRecentOrders(ordersRes.data.slice(0, 5))

        // Sort users by order count for top customers
        const sortedUsers = [...usersRes.data].sort((a, b) => (b._count?.orders || 0) - (a._count?.orders || 0))
        setTopCustomers(sortedUsers.slice(0, 5))

      } catch (err) {
        console.error("Dashboard sync failed", err)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  const statCards = [
    { title: "Products", value: stats.products, icon: Package, color: "text-pink-500", bg: "bg-pink-50" },
    { title: "Revenue", value: `Rs ${stats.revenue.toLocaleString()}`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-50" },
    { title: "Active Orders", value: stats.orders, icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Total Users", value: stats.users, icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
  ]

  return (
    <div className="w-full space-y-10 p-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 flex items-center gap-3">
            Store <span className="text-pink-500">Analytics</span> <Sparkles className="text-pink-400" size={28} />
          </h1>
          <p className="text-gray-500 font-medium">
            Comprehensive performance overview of Everglow Beauty.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="border-0 shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl hover:shadow-pink-100/50 transition-all duration-500">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-black uppercase tracking-widest text-gray-400">{stat.title}</CardTitle>
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                <stat.icon size={20} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black text-gray-900">{loading ? "..." : stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-0 shadow-sm rounded-[2.5rem] p-4 bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-black text-gray-900">Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-50 animate-pulse rounded-2xl" />) :
                recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-[1.5rem] hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-xs text-gray-400 border border-gray-100">
                        #{order.id.slice(0, 4)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 leading-tight">{order.user?.name || "Premium User"}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="font-black text-pink-600">Rs {order.totalAmount}</span>
                      <Badge className={`rounded-lg px-2 py-0.5 text-[10px] font-black ${order.status === 'DELIVERED' ? 'bg-green-500' : 'bg-orange-400'}`}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="border-0 shadow-sm rounded-[2.5rem] p-4 bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-black text-gray-900">Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {loading ? [...Array(4)].map((_, i) => <div key={i} className="h-12 bg-gray-50 animate-pulse rounded-2xl" />) :
                topCustomers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center font-black">
                        {user.name?.charAt(0) || user.email.charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 text-sm">{user.name || "Guest"}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{user.email}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gray-900 text-sm">{user._count?.orders || 0}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Orders</p>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
