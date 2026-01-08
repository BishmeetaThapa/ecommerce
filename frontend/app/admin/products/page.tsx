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

const products = [
  {
    id: "EVG-001",
    name: "Everglow Hydrating Face Serum",
    category: "Skincare",
    price: 29,
    stock: 42,
    status: "Active",
    image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
  },
  {
    id: "EVG-002",
    name: "Everglow Vitamin C Glow Cream",
    category: "Skincare",
    price: 34,
    stock: 18,
    status: "Active",
    image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19",
  },
  {
    id: "EVG-003",
    name: "Everglow Gentle Cleanser",
    category: "Skincare",
    price: 19,
    stock: 0,
    status: "Out of Stock",
    image: "https://images.unsplash.com/photo-1585232351009-aa87416fca90",
  },
  {
    id: "EVG-004",
    name: "Everglow Repair Shampoo",
    category: "Haircare",
    price: 22,
    stock: 55,
    status: "Active",
    image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273",
  },
  {
    id: "EVG-005",
    name: "Everglow Nourishing Conditioner",
    category: "Haircare",
    price: 24,
    stock: 31,
    status: "Active",
    image: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519",
  },
  {
    id: "EVG-006",
    name: "Everglow Hair Growth Oil",
    category: "Haircare",
    price: 27,
    stock: 9,
    status: "Low Stock",
    image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be",
  },
  {
    id: "EVG-007",
    name: "Everglow SPF 50+ Sunscreen",
    category: "Skincare",
    price: 21,
    stock: 63,
    status: "Active",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571",
  },
  {
    id: "EVG-008",
    name: "Everglow Night Repair Mask",
    category: "Skincare",
    price: 39,
    stock: 14,
    status: "Active",
    image: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9",
  },
  {
    id: "EVG-009",
    name: "Everglow Rose Water Toner",
    category: "Skincare",
    price: 17,
    stock: 50,
    status: "Active",
    image: "https://images.unsplash.com/photo-1612817159623-0399784fd0ce",
  },
  {
    id: "EVG-010",
    name: "Everglow Clay Detox Mask",
    category: "Skincare",
    price: 26,
    stock: 7,
    status: "Low Stock",
    image: "https://images.unsplash.com/photo-1596755389378-1f8f1c1c9f9c",
  },
  {
    id: "EVG-011",
    name: "Everglow Aloe Vera Gel",
    category: "Skincare",
    price: 15,
    stock: 80,
    status: "Active",
    image: "https://images.unsplash.com/photo-1629385701021-bdbd9c8cb1aa",
  },
  {
    id: "EVG-012",
    name: "Everglow Anti-Frizz Hair Serum",
    category: "Haircare",
    price: 23,
    stock: 25,
    status: "Active",
    image: "https://images.unsplash.com/photo-1600180758890-6b94519a7a9f",
  },
  {
    id: "EVG-013",
    name: "Everglow Scalp Detox Scrub",
    category: "Haircare",
    price: 28,
    stock: 11,
    status: "Low Stock",
    image: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6",
  },
  {
    id: "EVG-014",
    name: "Everglow Lip Repair Balm",
    category: "Skincare",
    price: 12,
    stock: 100,
    status: "Active",
    image: "https://images.unsplash.com/photo-1585386959984-a41552231691",
  },
  {
    id: "EVG-015",
    name: "Everglow Body Glow Lotion",
    category: "Bodycare",
    price: 31,
    stock: 22,
    status: "Active",
    image: "https://images.unsplash.com/photo-1600180758895-90d6d7b9f6a3",
  },
]

export default function ProductsPage() {
  return (
    <div className="w-full space-y-6">
  {/* Header */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-rose-600">
        Everglow Products
      </h1>
      <p className="text-sm text-rose-400">
        Manage your skincare & haircare catalog
      </p>
    </div>

    <Button className="gap-2 bg-rose-500 hover:bg-rose-600 text-white">
      <Plus className="h-4 w-4" />
      Add Product
    </Button>
  </div>



      {/* Filters */}
      <div className="flex gap-4">
        <Input placeholder="Search products..." className="max-w-sm" />
        <Input placeholder="Category" className="max-w-[200px]" />
      </div>

      {/* Table */}
      <div className="w-full rounded-lg border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-10 w-10 rounded-md border object-cover"
                    />
                    <span className="font-medium">{product.name}</span>
                  </div>
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {product.id}
                </TableCell>

                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>{product.stock}</TableCell>

                <TableCell>
                  <Badge
                    variant={
                      product.status === "Active"
                        ? "default"
                        : product.status === "Out of Stock"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {product.status}
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
        <span>Showing 1–15 of 30 products</span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
