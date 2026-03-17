'use client'

import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
  DialogTrigger, DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, Plus, RefreshCcw, ExternalLink } from "lucide-react"

const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}/api/products`

/* ================= DELETE ================= */

function DeleteDialog({ item, onDelete }: { item: any, onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}
      const productId = item._id || item.id

      await axios.delete(`${API_BASE}/${productId}`, { headers })
      toast.success("Product deleted from Everglow")
      onDelete(productId)
      setOpen(false)
    } catch (err) {
      console.error(err)
      toast.error("Delete failed")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 rounded-full hover:bg-red-50 text-red-600 transition-colors">
          <Trash2 size={16} />
        </button>
      </DialogTrigger>

      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Delete product?</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete <span className="font-bold text-gray-900">"{item.name}"</span>? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-full">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white rounded-full"
          >
            Delete Permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ================= FORM ================= */

function ProductForm({ item, close, onSave }: { item?: any, close: (o: boolean) => void, onSave: (p: any, t: string) => void }) {
  const [categories, setCategories] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [initialized, setInitialized] = useState(false)

  const [form, setForm] = useState(
    item ? {
      name: item.name,
      slug: item.slug,
      price: item.price,
      description: item.description,
      stock: item.stock || 0,
      image: item.images?.[0]?.url || "",
      brand: item.brand || "",
      category: item.category || ""
    } : { name: "", slug: "", price: "", description: "", stock: 10, image: "", brand: "", category: "" }
  )

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [cats, brs] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/brands`)
        ])
        setCategories(cats.data)
        setBrands(brs.data)

        // If we have categories and brands loaded and form not yet initialized
        if (!initialized) {
          setInitialized(true)

          if (!item && cats.data.length > 0 && brs.data.length > 0) {
            // For new products, pre-select first ones
            const firstCat = cats.data[0];
            const firstBrand = brs.data[0];
            setForm(f => ({ ...f, category: firstCat._id, brand: firstBrand._id }))
          } else if (item) {
            // For existing products, try to find matching category and brand
            // The product stores names as strings, we need to match by name
            const matchingCat = cats.data.find((c: any) => c.name === item.category)
            const matchingBrand = brs.data.find((b: any) => b.name === item.brand)

            setForm(f => ({
              ...f,
              category: matchingCat?._id || item.category || "",
              brand: matchingBrand?._id || item.brand || ""
            }))
          }
        }
      } catch (err) {
        console.error("Metadata fetch failed", err)
      }
    }
    fetchMetadata()
  }, [item, initialized])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.id]: e.target.value })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("token")
      const headers = token ? { Authorization: `Bearer ${token}` } : {}

      const payload = {
        name: form.name,
        slug: form.slug,
        price: form.price,
        description: form.description,
        stock: form.stock,
        brand: form.brand,
        category: form.category,
        images: [form.image]
      }

      console.log("Submitting payload:", payload)
      console.log("Product ID:", item?._id || item?.id)

      if (item) {
        const res = await axios.put(`${API_BASE}/${item._id || item.id}`, payload, { headers })
        onSave(res.data, "edit")
        toast.success("Product updated successfully")
      } else {
        const res = await axios.post(API_BASE, payload, { headers })
        onSave(res.data, "add")
        toast.success("New product added to catalog")
      }
      close(false)
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.error || "Action failed - check console")
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" value={form.name} onChange={handleChange} placeholder="e.g. Hero Serum" required />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="slug">URL Slug</Label>
          <Input id="slug" value={form.slug} onChange={handleChange} placeholder="e.g. hero-serum" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1">
          <Label htmlFor="brand">Brand</Label>
          <select
            id="brand"
            value={form.brand}
            onChange={handleChange}
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            required
          >
            <option value="">Select a brand</option>
            {brands.map(b => <option key={b._id} value={b._id}>{b.name}</option>)}
          </select>
        </div>
        <div className="grid gap-1">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            value={form.category}
            onChange={handleChange}
            className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            required
          >
            <option value="">Select a category</option>
            {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1">
          <Label htmlFor="price">Price (Rs)</Label>
          <Input id="price" type="number" step="0.01" value={form.price} onChange={handleChange} required />
        </div>
        <div className="grid gap-1">
          <Label htmlFor="stock">Stock Level</Label>
          <Input id="stock" type="number" value={form.stock} onChange={handleChange} required />
        </div>
      </div>

      <div className="grid gap-1">
        <Label htmlFor="image">Image URL</Label>
        <Input id="image" value={form.image} onChange={handleChange} placeholder="https://..." required />
      </div>

      <div className="grid gap-1">
        <Label htmlFor="description">Description</Label>
        <textarea
          id="description"
          rows={3}
          value={form.description}
          onChange={handleChange}
          className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          required
        />
      </div>

      <Button className="rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-6">
        {item ? "Save Changes" : "Create Product"}
      </Button>
    </form>
  )
}

/* ================= ADD / EDIT ================= */

function ProductDialog({ item, onSave }: { item?: any, onSave: (p: any, t: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {item ? (
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
            <Edit size={16} />
          </button>
        ) : (
          <Button className="rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-100 dark:shadow-none transition-all active:scale-95">
            <Plus size={18} className="mr-2" /> Add New Product
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {item ? "Edit Everglow Product" : "New Catalog Entry"}
          </DialogTitle>
          <DialogDescription>
            {item ? "Update product details and sync with production database." : "Create a new product listing for the Everglow store."}
          </DialogDescription>
        </DialogHeader>

        <ProductForm item={item} close={setOpen} onSave={onSave} />
      </DialogContent>
    </Dialog>
  )
}

/* ================= MAIN PAGE ================= */

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const ITEMS_PER_PAGE = 8

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await axios.get(API_BASE)
      setProducts(res.data)
    } catch (err) {
      console.error(err)
      toast.error("Failed to sync with backend")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  /* ===== SEARCH ===== */
  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  )

  /* ===== PAGINATION ===== */
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const start = (page - 1) * ITEMS_PER_PAGE
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE)

  useEffect(() => {
    setPage(1)
  }, [search])

  /* ===== CRUD UI UPDATE ===== */
  const handleDeleteUI = (id: string) =>
    setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id))

  const handleSaveUI = (product: any, type: string) => {
    const prodId = product._id || product.id
    if (type === "add") setProducts((p) => [product, ...p])
    else
      setProducts((p) =>
        p.map((i) => ((i._id || i.id) === prodId ? product : i))
      )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50/50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">
            Catalog <span className="text-pink-500">Management</span>
          </h1>
          <p className="text-gray-500 font-medium">
            Manage your store's inventory and product listings.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          <div className="relative flex-grow md:flex-grow-0">
            <Input
              placeholder="Find a product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-4 pr-10 w-full md:w-64 rounded-xl border-gray-200 focus:ring-pink-500 focus:border-pink-500 transition-all"
            />
          </div>
          <Button variant="outline" onClick={fetchProducts} className="rounded-xl hover:bg-pink-50 hover:text-pink-600 border-gray-200 transition-colors">
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </Button>
          <ProductDialog onSave={handleSaveUI} />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-b border-gray-100">
              <TableHead className="py-5 px-6 font-bold text-gray-700">Product</TableHead>
              <TableHead className="font-bold text-gray-700">Inventory</TableHead>
              <TableHead className="font-bold text-gray-700">Price</TableHead>
              <TableHead className="font-bold text-gray-700">Brand</TableHead>
              <TableHead className="text-right py-5 px-6 font-bold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell colSpan={5} className="py-6 px-6">
                    <div className="h-10 bg-gray-100 rounded-xl w-full"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : paginated.length ? (
              paginated.map((p) => (
                <TableRow key={p._id || p.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                  <TableCell className="py-4 px-6">
                    <div className="flex gap-4 items-center">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                        <img
                          src={p.images?.[0]?.url || "https://via.placeholder.com/100"}
                          className="w-full h-full object-contain p-1"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 leading-tight">{p.name}</span>
                        <span className="text-xs text-gray-400 font-medium">/{p.slug}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-col">
                      <span className={`text-sm font-bold ${p.stock < 10 ? 'text-orange-500' : 'text-gray-600'}`}>
                        {p.stock} units
                      </span>
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${p.stock < 10 ? 'bg-orange-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(p.stock, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="font-black text-pink-600">
                    Rs {p.price}
                  </TableCell>

                  <TableCell>
                    <span className="px-3 py-1 bg-pink-50 text-pink-600 text-xs font-bold rounded-full border border-pink-100 uppercase tracking-tighter">
                      {p.brand || "N/A"}
                    </span>
                  </TableCell>

                  <TableCell className="text-right py-4 px-6">
                    <div className="flex justify-end gap-1">
                      <a href={`/products/${p.slug}`} target="_blank" className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                        <ExternalLink size={16} />
                      </a>
                      <ProductDialog item={p} onSave={handleSaveUI} />
                      <DeleteDialog item={p} onDelete={handleDeleteUI} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 bg-gray-50/30">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-4">
                      <Plus size={32} />
                    </div>
                    <p className="font-bold text-gray-400">Inventory is empty</p>
                    <p className="text-xs text-gray-300">Start by adding your first beauty product.</p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-12">
          <Button
            variant="ghost"
            disabled={page === 1}
            onClick={() => {
              setPage((p) => p - 1)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="rounded-xl font-bold text-gray-500 hover:text-pink-600"
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setPage(i + 1)
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className={`w-10 h-10 rounded-xl font-bold transition-all ${page === i + 1
                  ? "bg-pink-500 text-white shadow-lg shadow-pink-100"
                  : "bg-white text-gray-400 hover:bg-pink-50 hover:text-pink-500 border border-gray-100"
                  }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            disabled={page === totalPages}
            onClick={() => {
              setPage((p) => p + 1)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="rounded-xl font-bold text-gray-500 hover:text-pink-600"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
