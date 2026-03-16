'use client'

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

/* Username Regex (simple & safe) */
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/

/* Yup Validation Schema */
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),

  password: Yup.string()
    .required("Password is required")
    .min(6, "Must be at least 6 characters"),
})

/* Password Strength Helper */
const getPasswordStrength = (password: string): string => {
  if (!password) return ""
  if (password.length < 6) return "Weak"
  if (password.length < 10) return "Medium"
  return "Strong"
}

export default function EverGlowLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleLogin = async (values: { email: string; password: string }, { setSubmitting, setErrors }: { setSubmitting: (val: boolean) => void; setErrors: (errors: Record<string, string>) => void }) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          email: values.email,
          password: values.password,
        }
      )

      // Store token and user data
      if (response.data.token) {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", JSON.stringify(response.data.user))

        // Redirect based on user role
        const userRole = response.data.user.role
        if (userRole === 'admin' || userRole === 'ADMIN') {
          router.push("/admin")
        } else {
          router.push("/")
        }
        toast.success("Login successful!")
      }
    } catch (error) {
      console.error("Login failed:", error)
      const err = error as { response?: { data?: { error?: string } } }
      if (err.response?.data?.error) {
        toast.error(err.response.data.error)
        setErrors({ email: " ", password: err.response.data.error })
      } else {
        toast.error("Login failed. Please try again.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: handleLogin,
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-100 to-amber-50 px-4">
      <Card className="w-full max-w-sm rounded-3xl shadow-2xl border-0">

        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white font-bold text-xl">
            EG
          </div>
          <CardTitle className="text-2xl font-bold">EverGlow</CardTitle>
          <CardDescription>Beauty that keeps you glowing ✨</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={formik.handleSubmit} className="space-y-5">

            {/* Email */}
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-xs text-red-500">{formik.errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label>Password</Label>

              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right">
                <Link
                  href="/login/forgot-password"
                  className="text-xs text-pink-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              {formik.values.password && (
                <p className="text-xs text-muted-foreground">
                  Strength: <b>{getPasswordStrength(formik.values.password)}</b>
                </p>
              )}

              {formik.touched.password && formik.errors.password && (
                <p className="text-xs text-red-500">{formik.errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full h-11 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500"
            >
              {formik.isSubmitting ? "Logging in..." : "Login"}
            </Button>

          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground text-center">
            New here?{" "}
            <Link href="/register" className="text-pink-600 font-semibold">
              Create an account
            </Link>
          </p>
        </CardFooter>

      </Card>
    </div>
  )
}
