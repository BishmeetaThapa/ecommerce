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
import { Plus, Pencil, Trash2 } from "lucide-react"

const customers = [
  { id: "CU-001", name: "Aarav Thapa", email: "aarav@example.com", phone: "+977-9812345678", joined: "2023-01-12", status: "Active" },
  { id: "CU-002", name: "Sita Sharma", email: "sita@example.com", phone: "+977-9812345679", joined: "2023-02-05", status: "Active" },
  { id: "CU-003", name: "Rohan Gurung", email: "rohan@example.com", phone: "+977-9812345680", joined: "2023-02-20", status: "Inactive" },
  { id: "CU-004", name: "Anjali Khatri", email: "anjali@example.com", phone: "+977-9812345681", joined: "2023-03-01", status: "Active" },
  { id: "CU-005", name: "Shree Lama", email: "shree@example.com", phone: "+977-9812345682", joined: "2023-03-15", status: "Active" },
  { id: "CU-006", name: "Mina Rai", email: "mina@example.com", phone: "+977-9812345683", joined: "2023-04-05", status: "Inactive" },
  { id: "CU-007", name: "Sujan KC", email: "sujan@example.com", phone: "+977-9812345684", joined: "2023-04-20", status: "Active" },
  { id: "CU-008", name: "Anita Tamang", email: "anita@example.com", phone: "+977-9812345685", joined: "2023-05-01", status: "Active" },
  { id: "CU-009", name: "Kiran Bhandari", email: "kiran@example.com", phone: "+977-9812345686", joined: "2023-05-12", status: "Active" },
  { id: "CU-010", name: "krsitina Bhatt", email: "kristina@example.com", phone: "+977-9812345687", joined: "2023-05-20", status: "Inactive" },
]

export default function CustomersPage() {
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-rose-600">
            Everglow Customers
          </h1>
          <p className="text-sm text-rose-400">
            Manage your registered customers
          </p>
        </div>

        <Button className="gap-2 bg-rose-500 hover:bg-rose-600 text-white">
          <Plus className="h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Input placeholder="Search customers..." className="max-w-sm" />
      </div>

      {/* Customers Table */}
      <div className="w-full rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.joined}</TableCell>
                <TableCell>
                  <Badge
                    variant={customer.status === "Active" ? "default" : "secondary"}
                  >
                    {customer.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
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
        <span>Showing 1–10 of 50 customers</span>
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
