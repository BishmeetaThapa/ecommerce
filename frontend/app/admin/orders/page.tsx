import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Pencil, Trash2, Eye } from "lucide-react"

const orders = [
  {
    id: "ORD-1001",
    customer: "Aarav Thapa",
    date: "2023-07-01",
    total: 79.99,
    status: "Pending",
    payment: "Paid",
  },
  {
    id: "ORD-1002",
    customer: "Sita Sharma",
    date: "2023-07-02",
    total: 129.5,
    status: "Completed",
    payment: "Paid",
  },
  {
    id: "ORD-1003",
    customer: "Rohan Gurung",
    date: "2023-07-03",
    total: 59.0,
    status: "Cancelled",
    payment: "Refunded",
  },
  {
    id: "ORD-1004",
    customer: "Anjali Khatri",
    date: "2023-07-04",
    total: 89.99,
    status: "Pending",
    payment: "Pending",
  },
  {
    id: "ORD-1005",
    customer: "Shree Lama",
    date: "2023-07-05",
    total: 149.75,
    status: "Completed",
    payment: "Paid",
  },
]

export default function OrdersPage() {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-rose-600">
            Everglow Orders
          </h1>
          <p className="text-sm text-rose-400">
            Manage all customer orders
          </p>
        </div>
      </div>

      {/* Search / Filters */}
      <div className="flex gap-4">
        <Input placeholder="Search orders..." className="max-w-sm" />
      </div>

      {/* Orders Table */}
      <div className="w-full rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>${order.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "Pending"
                        ? "secondary"
                        : order.status === "Completed"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.payment === "Paid"
                        ? "default"
                        : order.payment === "Pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {order.payment}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost" className="cursor-pointer">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="cursor-pointer">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="cursor-pointer">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing 1–5 of 50 orders</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="cursor-pointer">
            Previous
          </Button>
          <Button variant="outline" size="sm" className="cursor-pointer">
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
