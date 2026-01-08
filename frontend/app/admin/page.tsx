import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Package, Users, Tags } from "lucide-react"

export default function AdminOverview() {
  // Sample stats (replace with real data later)
  const stats = [
    { title: "Products", value: 150, icon: Package, color: "bg-rose-100 text-rose-600" },
    { title: "Categories", value: 15, icon: Tags, color: "bg-rose-50 text-rose-500" },
    { title: "Customers", value: 1200, icon: Users, color: "bg-rose-50 text-rose-500" },
    { title: "Orders", value: 450, icon: ShoppingCart, color: "bg-rose-100 text-rose-600" },
  ]

  return (
    <div className="w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-rose-600">
          Everglow Dashboard
        </h1>
        <p className="text-sm text-rose-400">
          Overview of your store’s performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-md hover:shadow-lg transition-all cursor-pointer">
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Card */}
        <Card className="shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span>ORD-1001</span>
                <Badge variant="secondary">Pending</Badge>
              </div>
              <div className="flex justify-between">
                <span>ORD-1002</span>
                <Badge variant="default">Completed</Badge>
              </div>
              <div className="flex justify-between">
                <span>ORD-1003</span>
                <Badge variant="destructive">Cancelled</Badge>
              </div>
              <div className="flex justify-between">
                <span>ORD-1004</span>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Customers Card */}
        <Card className="shadow-md hover:shadow-lg transition-all">
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <span>Aarav Thapa</span>
                <span className="text-muted-foreground">12 Orders</span>
              </div>
              <div className="flex justify-between">
                <span>Sita Sharma</span>
                <span className="text-muted-foreground">10 Orders</span>
              </div>
              <div className="flex justify-between">
                <span>Rohan Gurung</span>
                <span className="text-muted-foreground">8 Orders</span>
              </div>
              <div className="flex justify-between">
                <span>Anjali Khatri</span>
                <span className="text-muted-foreground">7 Orders</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
