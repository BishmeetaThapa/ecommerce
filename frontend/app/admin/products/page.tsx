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
import { Edit, Trash2, Plus, RefreshCcw } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"

/* ================= DELETE ================= */

function DeleteDialog({ item, onDelete }) {
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    try {
      await axios.delete(`https://fakestoreapi.com/products/${item.id}`)
      toast.success("Product deleted")
      onDelete(item.id)
      setOpen(false)
    } catch {
      toast.error("Delete failed")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 rounded-full hover:bg-red-50 text-red-600">
          <Trash2 size={16} />
        </button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete product?</DialogTitle>
          <DialogDescription>This cannot be undone.</DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ================= FORM ================= */

function ProductForm({ item, close, onSave }) {
  const [form, setForm] = useState(
    item || { title: "", price: "", category: "", image: "", description: "" }
  )

  const handleChange = (e) =>
    setForm({ ...form, [e.target.id]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    try {
      if (item) {
        const res = await axios.put(
          `https://fakestoreapi.com/products/${item.id}`,
          form
        )
        onSave(res.data, "edit")
        toast.success("Product updated")
      } else {
        const res = await axios.post(
          "https://fakestoreapi.com/products",
          form
        )
        onSave(res.data, "add")
        toast.success("Product added")
      }
      close(false)
    } catch {
      toast.error("Action failed")
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      {["title", "price", "category", "image"].map((f) => (
        <div key={f} className="grid gap-1">
          <Label>{f.toUpperCase()}</Label>
          <Input id={f} value={form[f]} onChange={handleChange} required />
        </div>
      ))}

      <div className="grid gap-1">
        <Label>Description</Label>
        <textarea
          id="description"
          rows={4}
          value={form.description}
          onChange={handleChange}
          className="border rounded-xl p-3"
          required
        />
      </div>

      <Button className="rounded-full bg-pink-500 hover:bg-pink-600 text-white">
        {item ? "Update Product" : "Add Product"}
      </Button>
    </form>
  )
}

/* ================= ADD / EDIT ================= */

function ProductDialog({ item, onSave }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {item ? (
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Edit size={16} />
          </button>
        ) : (
          <Button className="rounded-full bg-pink-500 text-white">
            <Plus size={16} /> Add Product
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {item ? "Edit Product" : "Add Product"}
          </DialogTitle>
        </DialogHeader>

        <ProductForm item={item} close={setOpen} onSave={onSave} />
      </DialogContent>
    </Dialog>
  )
}

/* ================= MAIN PAGE ================= */

export default function TableDemo() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const ITEMS_PER_PAGE = 10

  const fetchProducts = async () => {
    const res = await fetch("https://fakestoreapi.com/products")
    setProducts(await res.json())
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  /* ===== SEARCH ===== */
  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  )

  /* ===== PAGINATION ===== */
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const start = (page - 1) * ITEMS_PER_PAGE
  const paginated = filtered.slice(start, start + ITEMS_PER_PAGE)

  useEffect(() => {
    setPage(1)
  }, [search])

  /* ===== CRUD UI UPDATE ===== */
  const handleDeleteUI = (id) =>
    setProducts((prev) => prev.filter((p) => p.id !== id))

  const handleSaveUI = (product, type) => {
    if (type === "add") setProducts((p) => [product, ...p])
    else
      setProducts((p) =>
        p.map((i) => (i.id === product.id ? product : i))
      )
  }

  return (
    <div className="max-w-7xl mx-auto p-8 bg-rose-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Everglow Products</h1>
          <p className="text-gray-500 text-sm">
            Beauty admin 
          </p>
        </div>

        <div className="flex gap-3">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 rounded-full"
          />
          <Button variant="outline" onClick={fetchProducts}>
            <RefreshCcw size={16} />
          </Button>
          <ProductDialog onSave={handleSaveUI} />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl shadow-xl p-6">
        <Table>
          <TableHeader>
            <TableRow className="bg-rose-50">
              <TableHead>Product</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginated.length ? (
              paginated.map((p) => (
                <TableRow key={p.id} className="hover:bg-gray-50">
                  <TableCell className="flex gap-4 items-center">
                    <img
                      src={p.image}
                      className="w-14 h-14 rounded-xl object-contain bg-white shadow"
                    />
                    <span className="font-medium line-clamp-1">{p.title}</span>
                  </TableCell>

                  <TableCell className="font-semibold text-pink-600">
                    Rs {p.price}
                  </TableCell>

                  <TableCell className="capitalize text-gray-500">
                    {p.category}
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <ProductDialog item={p} onSave={handleSaveUI} />
                      <DeleteDialog item={p} onDelete={handleDeleteUI} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  No products found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            variant="outline"
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </Button>

          {[...Array(totalPages)].map((_, i) => (
            <Button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`rounded-full ${
                page === i + 1
                  ? "bg-pink-500 text-white"
                  : "bg-white"
              }`}
            >
              {i + 1}
            </Button>
          ))}

          <Button
            variant="outline"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
