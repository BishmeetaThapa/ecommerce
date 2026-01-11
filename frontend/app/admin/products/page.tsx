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
import axios from "axios"
import Link from "next/link"



const  ProductsPage= async () => {
      const {data} = await axios.get('http://makeup-api.herokuapp.com/api/v1/products.json       ')
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
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data.map((data) => (
              <TableRow key={data.id}>
                <TableCell>
                   <Link href={`/admin/products/${data.id}`}>
                  <div className="flex items-center gap-3">
                    <img
                      src={data.image_link}
                      alt={data.name}
                      className="h-10 w-10 rounded-md border object-cover"
                    />
                    <span className="font-medium">{data.name}</span>
                  </div>
                  </Link>
                </TableCell>

                <TableCell className="text-muted-foreground">
                  {data.id}
                </TableCell>

                <TableCell>{data.category}</TableCell>
                <TableCell>${data.price}</TableCell> 
                <TableCell>{data.rating}</TableCell>

                <TableCell>
                  <Badge
                    variant={
                      data.status === "Active"
                        ? "default"
                        : data.status === "Out of Stock"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {data.status}
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
 export default ProductsPage