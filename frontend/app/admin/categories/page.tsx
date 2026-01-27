'use client'

import React, { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import {
  Dialog, DialogContent,
  DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger, DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit, Trash2, Plus, RefreshCcw } from "lucide-react"

const API_BASE = "http://localhost:5000/api/products/categories"

/* ================= DELETE DIALOG ================= */
function DeleteDialog({ category, onDelete }: { category: any, onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/${category.id}`)
      toast.success("Category deleted from Everglow catalog")
      onDelete(category.id)
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
          <DialogTitle>Delete category?</DialogTitle>
          <p className="text-sm text-gray-500 mt-2">
            Are you sure you want to delete <span className="font-bold text-gray-900">"{category.name}"</span>? This will affect product associations.
          </p>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-full">Cancel</Button>
          </DialogClose>
          <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-full">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ================= CATEGORY FORM ================= */
function CategoryForm({ category, close, onSave }: { category?: any, close: (o: boolean) => void, onSave: (c: any, t: string) => void }) {
  const [form, setForm] = useState({
    name: category?.name || "",
    slug: category?.slug || ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.id]: e.target.value })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (category) {
        const res = await axios.put(`${API_BASE}/${category.id}`, form)
        onSave(res.data, "edit")
        toast.success("Category updated successfully")
      } else {
        const res = await axios.post(API_BASE, form)
        onSave(res.data, "add")
        toast.success("Category added to catalog")
      }
      close(false)
    } catch (err) {
      console.error(err)
      toast.error("Action failed")
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 py-4">
      <div className="grid gap-1">
        <Label htmlFor="name">Display Name</Label>
        <Input id="name" value={form.name} onChange={handleChange} placeholder="e.g. Skin Essentials" required />
      </div>
      <div className="grid gap-1">
        <Label htmlFor="slug">URL Slug</Label>
        <Input id="slug" value={form.slug} onChange={handleChange} placeholder="e.g. skincare" required />
      </div>

      <Button className="rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-6">
        {category ? "Update Category" : "Create Category"}
      </Button>
    </form>
  )
}

/* ================= ADD / EDIT DIALOG ================= */
function CategoryDialog({ category, onSave }: { category?: any, onSave: (c: any, t: string) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {category ? (
          <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
            <Edit size={16} />
          </button>
        ) : (
          <Button className="rounded-full bg-pink-500 hover:bg-pink-600 text-white shadow-lg shadow-pink-100 transition-all active:scale-95">
            <Plus size={18} className="mr-2" /> Add Collection
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="rounded-[2rem] max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {category ? "Edit Collection" : "New Collection Entry"}
          </DialogTitle>
        </DialogHeader>

        <CategoryForm category={category} close={setOpen} onSave={onSave} />
      </DialogContent>
    </Dialog>
  )
}

/* ================= MAIN CATEGORIES PAGE ================= */
const CategoriesPage = () => {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await axios.get(API_BASE)
      setCategories(res.data)
    } catch {
      toast.error("Failed to fetch collections")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSaveUI = (cat: any, type: string) => {
    if (type === "add") setCategories((prev) => [cat, ...prev])
    else
      setCategories((prev) =>
        prev.map((i) => (i.id === cat.id ? cat : i))
      )
  }

  const handleDeleteUI = (id: string) =>
    setCategories((prev) => prev.filter((c) => c.id !== id))

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50/50 min-h-screen">
      {/* PAGE TITLE */}
      <div className="mb-10">
        <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">
          Store <span className="text-pink-500">Collections</span>
        </h1>
        <p className="text-gray-500 font-medium">
          Manage your product groupings and shop filters.
        </p>
      </div>

      {/* SEARCH & ADD */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="Find collection..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 rounded-xl border-gray-200 focus:ring-pink-500 transition-all"
          />
          <Button variant="outline" onClick={fetchCategories} className="rounded-xl hover:bg-pink-50 hover:text-pink-600 transition-colors">
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
        <CategoryDialog onSave={handleSaveUI} />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="h-40 bg-gray-100 animate-pulse rounded-[2rem]"></div>
          ))
        ) : filtered.map((c) => (
          <div key={c.id} className="group bg-white rounded-[2rem] shadow-sm border border-gray-100 p-6 flex flex-col items-center gap-4 transition-all hover:shadow-xl hover:shadow-pink-100/50">
            <div className="w-20 h-20 bg-pink-50 text-pink-500 rounded-full flex items-center justify-center font-black text-2xl uppercase border-4 border-white shadow-inner">
              {c.name.charAt(0)}
            </div>
            <div className="text-center">
              <h3 className="font-bold text-gray-900 text-lg leading-tight">{c.name}</h3>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{c._count?.products || 0} Products</span>
            </div>
            <div className="flex gap-1 mt-2 p-1 bg-gray-50 rounded-full">
              <CategoryDialog category={c} onSave={handleSaveUI} />
              <DeleteDialog category={c} onDelete={handleDeleteUI} />
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <p className="font-bold text-gray-400">No collections matched your search</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoriesPage
