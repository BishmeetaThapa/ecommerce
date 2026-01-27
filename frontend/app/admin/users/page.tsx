'use client'

import React, { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "sonner"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from "@/components/ui/table"
import {
  Dialog, DialogContent,
  DialogFooter, DialogHeader, DialogTitle,
  DialogTrigger, DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, RefreshCcw, UserCircle2, Mail, ShieldCheck, Clock } from "lucide-react"

const API_BASE = "http://localhost:5000/api/users"

/* ================= DELETE USER ================= */

function DeleteDialog({ user, onDelete }: { user: any, onDelete: (id: string) => void }) {
  const [open, setOpen] = useState(false)

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE}/${user.id}`)
      toast.success("User account suspended & removed")
      onDelete(user.id)
      setOpen(false)
    } catch {
      toast.error("Action restricted")
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
          <DialogTitle>Deactivate User?</DialogTitle>
          <p className="text-sm text-gray-500 mt-2">
            Are you sure you want to remove <span className="font-bold text-gray-900">{user.name || user.email}</span>? This will clear their order history and addresses.
          </p>
        </DialogHeader>

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="rounded-full">Cancel</Button>
          </DialogClose>
          <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700 text-white rounded-full font-bold">
            Confirm Deactivation
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ================= ROLE FORM ================= */

function RoleForm({ user, close, onSave }: any) {
  const [role, setRole] = useState(user.role)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await axios.put(`${API_BASE}/${user.id}/role`, { role })
      onSave(res.data, "edit")
      toast.success(`User role updated to ${role}`)
      close(false)
    } catch {
      toast.error("Role update failed")
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6 py-4">
      <div className="grid gap-2">
        <Label>Select Access Level</Label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="flex h-12 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm font-bold ring-offset-background focus:ring-2 focus:ring-pink-500 transition-all outline-none"
        >
          <option value="USER text-gray-600">Standard Customer (USER)</option>
          <option value="ADMIN text-pink-600 font-black">Store Administrator (ADMIN)</option>
        </select>
      </div>

      <Button className="rounded-full bg-pink-500 hover:bg-pink-600 text-white font-bold h-12 shadow-lg shadow-pink-100">
        Update Privileges
      </Button>
    </form>
  )
}

function RoleDialog({ user, onSave }: any) {
  const [open, setOpen] = useState(false)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
          <Edit size={16} />
        </button>
      </DialogTrigger>
      <DialogContent className="rounded-[2rem] max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Access <span className="text-pink-500">Control</span></DialogTitle>
        </DialogHeader>
        <RoleForm user={user} close={setOpen} onSave={onSave} />
      </DialogContent>
    </Dialog>
  )
}

/* ================= USERS PAGE ================= */

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await axios.get(API_BASE)
      setUsers(res.data)
    } catch {
      toast.error("Failed to sync customer directory")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filtered = users.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleDeleteUI = (id: string) =>
    setUsers((u) => u.filter((i) => i.id !== id))

  const handleSaveUI = (user: any, type: string) => {
    setUsers((u) => u.map((i) => (i.id === user.id ? user : i)))
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50/20 min-h-screen">
      {/* HEADER */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2">
            Customer <span className="text-pink-500">Directory</span>
          </h1>
          <p className="text-gray-500 font-medium">
            Manage user accounts, roles, and security details.
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 rounded-xl border-gray-200 focus:ring-pink-500 transition-all shadow-sm"
          />
          <Button variant="outline" onClick={fetchUsers} className="rounded-xl hover:bg-pink-50 hover:text-pink-600 transition-colors">
            <RefreshCcw size={18} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
              <TableHead className="py-5 px-6 font-bold text-gray-700">Account Holder</TableHead>
              <TableHead className="font-bold text-gray-700">Role</TableHead>
              <TableHead className="font-bold text-gray-700 text-center">Active Orders</TableHead>
              <TableHead className="font-bold text-gray-700">Joined</TableHead>
              <TableHead className="text-right py-5 px-6 font-bold text-gray-700">Management</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              [...Array(4)].map((_, i) => (
                <TableRow key={i} className="animate-pulse">
                  <TableCell colSpan={5} className="py-6 px-6"><div className="h-10 bg-gray-100 rounded-xl"></div></TableCell>
                </TableRow>
              ))
            ) : filtered.length ? (
              filtered.map((u) => (
                <TableRow key={u.id} className="hover:bg-gray-50/50 transition-colors border-b last:border-0 border-gray-50">
                  <TableCell className="py-5 px-6">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center text-pink-500 border border-white shadow-sm">
                        <UserCircle2 size={24} />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 leading-tight">{u.name || "Unnamed User"}</span>
                        <span className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-1">
                          <Mail size={12} /> {u.email}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge className={`rounded-lg px-2.5 py-1 font-bold ${u.role === 'ADMIN' ? 'bg-pink-500 text-white border-0' : 'bg-gray-100 text-gray-500 border-0'}`}>
                      {u.role === 'ADMIN' && <ShieldCheck size={12} className="mr-1" />}
                      {u.role}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="font-black text-gray-900 px-3 py-1 bg-gray-50 rounded-full text-xs">
                      {u._count?.orders || 0}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold uppercase tracking-tighter">
                      <Clock size={14} className="text-gray-300" />
                      {new Date(u.createdAt).toLocaleDateString()}
                    </div>
                  </TableCell>

                  <TableCell className="text-right py-5 px-6">
                    <div className="flex justify-end gap-1">
                      <RoleDialog user={u} onSave={handleSaveUI} />
                      <DeleteDialog user={u} onDelete={handleDeleteUI} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-20 bg-gray-50/20 text-gray-400 font-bold">No users in the directory</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
