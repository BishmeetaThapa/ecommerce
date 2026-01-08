import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"

// Categories with product-type images (match your products)
const categories = [
  {
     id: "C-001", 
     name: "Serums",
      image: "https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd",
       status: "Active" 
  },

  {
     id: "C-002",
      name: "Face Creams", 
      image: "https://wellness-healthy.com/wp-content/uploads/2025/06/everglow.jpg",
       status: "Active" 
  },

  {
     id: "C-003",
      name: "Cleansers",
       image: "https://biocule.com/cdn/shop/files/ever_glow_radiance_face_wash_100ml_8.png?v=1704773704&width=1445", 
       status: "Active"
  },

  {
     id: "C-004", 
     name: "Masks",
      image: "https://img.joomcdn.net/de1d0ad01da55f30fcee9abfbfa88fb3d7fd377f_1024_1024.jpeg", 
      status: "Active"
  },

  { 
     id: "C-005", 
     name: "Toners", 
     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSWu4oc_i5EgPp9IuHh-VQBdN_FbVhvs--seQ&s", 
     status: "Active" 
  },

  { 
    id: "C-006", 
     name: "Sunscreens",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhokowoyTldxu9RDLc9Y3ry-PfqAzacvY5GA&s",
       status: "Active" 
  },

  { 
    id: "C-007", 
    name: "Hair Shampoos", 
    image: "https://drhanandermatologyclinic.com/wp-content/uploads/2024/11/top-dermatologist-recommended_shampoos_for_dry_and_frizzy_hair.webp",
    status: "Active"
  },

  {
     id: "C-008",
      name: "Hair Conditioners", 
      image: "https://rukminim2.flixcart.com/image/480/640/xif0q/conditioner/k/j/e/-original-imaheywuyb8p2tpc.jpeg?q=90",
       status: "Active"
  },

  {
     id: "C-009",
      name: "Hair Oils", 
      image: "https://tangleteezer.com/cdn/shop/articles/Hair-Oil-Blog-Image_1508x940_9577d0bc-24d8-4fa8-a529-e98e11afc72b.jpg?v=1765357374&width=1280", 
      status: "Active" 
  },

  { 
    id: "C-010",
     name: "Body Lotions", 
     image: "https://www.thegoodtrade.com/wp-content/uploads/2024/09/body-lotion-cocokind.png", 
     status: "Active" 
  },

  {
     id: "C-011",
      name: "Lip Balms", 
      image: "https://i5.walmartimages.com/seo/eos-Best-of-eos-Lip-Balm-9-Sticks_a065db44-1e4c-4b1b-8dcf-9147251d32f9.3e74b3df36962fc6d87cb9335dda9e2c.jpeg", 
      status: "Active"
  },

  { 
    id: "C-012",
     name: "Eye Creams",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7OLKLJwFIV-e8NDdSgN15NXCCJtIeR4G6zg&s",
       status: "Active"
  },

  {
     id: "C-013",
     name: "Scrubs & Exfoliators",
      image: "https://www.instyle.com/thmb/9D06jDvYFEg-8KSzs4xm7bJnKGY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/ins-tier-3-osea-salts-of-the-earth-body-scrub-ahuang-189-46f3faf9ec004b46a46d450269618b36.jpeg",
       status: "Active" 
  },

  { 
    id: "C-014", 
     name: "Face Mists",
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVDXT5M87jXEgiEadmyXLQIX3Ij1Rvt7eAuA&s", 
       status: "Active" 
  },

  { 
    id: "C-015",
     name: "Masks & Treatments",
      image: "https://img.lazcdn.com/g/p/b1ca7f3d4a3fb86c58ebc4e988d10e8e.jpg_720x720q80.jpg",
       status: "Active"
  },
]

export default function CategoriesPage() {
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
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white border rounded-lg shadow hover:shadow-lg transition-all p-4 flex flex-col items-center text-center"
          >
            <img
              src={category.image}
              alt={category.name}
              className="w-full h-full object-cover rounded-md"
            />
            <h2 className="font-semibold text-lg">{category.name}</h2>
            <Badge
              variant={category.status === "Active" ? "default" : "secondary"}
              className="mt-2"
            >
              {category.status}
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
