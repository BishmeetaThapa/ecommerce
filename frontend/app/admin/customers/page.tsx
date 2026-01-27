'use client'

import React, { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Edit, Trash2, Plus } from "lucide-react"

/* ================= DELETE DIALOG ================= */
function DeleteDialog({ customer, onDelete }: any) {
  const [open, setOpen] = useState(false)

  const handleDelete = () => {
    toast.success("Customer deleted (mock)")
    onDelete(customer.id)
    setOpen(false)
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
          <DialogTitle>Delete customer?</DialogTitle>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleDelete} className="bg-red-600 text-white">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ================= CUSTOMER FORM ================= */
function CustomerForm({ customer, close, onSave }: any) {
  const [form, setForm] = useState({
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    joined: customer?.joined || new Date().toISOString().split("T")[0],
    status: customer?.status || "Active"
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [e.target.id]: e.target.value })

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (customer) {
      onSave({ ...customer, ...form }, "edit")
      toast.success("Customer updated (mock)")
    } else {
      onSave({ id: Date.now(), ...form }, "add")
      toast.success("Customer added (mock)")
    }
    close(false)
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <Input id="name" value={form.name} onChange={handleChange} placeholder="Name" required />
      <Input id="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
      <Input id="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required />
      <Input id="joined" type="date" value={form.joined} onChange={handleChange} placeholder="Joined" required />
      <select id="status" value={form.status} onChange={handleChange} className="border rounded-xl p-2">
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
      <Button className="bg-pink-500 text-white rounded-full">{customer ? "Update Customer" : "Add Customer"}</Button>
    </form>
  )
}

/* ================= ADD / EDIT DIALOG ================= */
function CustomerDialog({ customer, onSave }: any) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {customer ? (
          <button className="p-2 rounded-full hover:bg-gray-100">
            <Edit size={16} />
          </button>
        ) : (
          <Button className="bg-pink-500 text-white rounded-full flex items-center gap-2">
            <Plus size={16} /> Add Customer
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{customer ? "Edit Customer" : "Add Customer"}</DialogTitle>
        </DialogHeader>
        <CustomerForm customer={customer} close={setOpen} onSave={onSave} />
      </DialogContent>
    </Dialog>
  )
}

/* ================= MAIN PAGE ================= */
const CustomersPage = () => {
  const [customers, setCustomers] = useState<any[]>([])
  const [search, setSearch] = useState("")

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("https://fakestoreapi.com/users") // fake API
      const data = res.data.map((u: any, i: number) => ({
        id: u.id,
        name: `${u.name.firstname} ${u.name.lastname}`,
        email: u.email,
        phone: u.phone || `+977-98123456${i}`,
        joined: new Date().toISOString().split("T")[0],
        status: i % 3 === 0 ? "Inactive" : "Active"
      }))
      setCustomers(data)
    } catch {
      toast.error("Failed to fetch customers")
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleSaveUI = (cust: any, type: string) => {
    if (type === "add") setCustomers((prev) => [cust, ...prev])
    else setCustomers((prev) => prev.map((c) => (c.id === cust.id ? cust : c)))
  }

  const handleDeleteUI = (id: number) => setCustomers((prev) => prev.filter((c) => c.id !== id))

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white min-h-screen">
      {/* PAGE TITLE */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-pink-600">Everglow Customers</h1>
          <p className="text-gray-500 text-sm">Manage your registered customers</p>
        </div>
        <CustomerDialog onSave={handleSaveUI} />
      </div>

      {/* SEARCH */}
      <div className="mb-4">
        <Input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-64 rounded-full"
        />
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto bg-white rounded-xl shadow">
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
            {filtered.map((c) => (
              <TableRow key={c.id} className="hover:bg-gray-50">
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.joined}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${c.status === "Active" ? "bg-black text-white" : "bg-gray-200 text-gray-800"}`}>
                    {c.status}
                  </span>
                </TableCell>
                <TableCell className="text-right flex justify-end gap-2">
                  <CustomerDialog customer={c} onSave={handleSaveUI} />
                  <DeleteDialog customer={c} onDelete={handleDeleteUI} />
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No customers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default CustomersPage
