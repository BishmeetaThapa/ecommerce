import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"
import axios from "axios"

// Categories with product-type images (match your products)

 const CategoriesPage=async()=>{
  const {data} = await axios.get('https://api.escuelajs.co/api/v1/categories')
  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-rose-600">
            Everglow Categories
          </h1>
          <p className="text-sm text-rose-400">
            Manage your skincare & haircare categories
          </p>
        </div>

        <Button className="gap-2 bg-rose-500 hover:bg-rose-600 text-white cursor-pointer">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {data.map((data) => (
          <div
            key={data.id}
            className="bg-white border rounded-lg shadow hover:shadow-lg transition-all p-4 flex flex-col items-center text-center"
          >
            <img
              src={data.image}
              alt={data.name}
              className="w-full h-full object-cover rounded-md"
            />
            <h2 className="font-semibold text-lg">{data.name}</h2>
            <Badge
              variant={data.status === "Active" ? "default" : "secondary"}
              className="mt-2"
            >
              {data.status}
            </Badge>
            <div className="flex gap-2 mt-4">
              <Button size="icon" variant="ghost" className="cursor-pointer">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" className="cursor-pointer">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
export default CategoriesPage