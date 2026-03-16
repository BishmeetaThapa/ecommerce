'use client'

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import Link from "next/link"
import { Mail, CheckCircle, Loader2 } from "lucide-react"

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

/* ------------------------------------------------ */
/* 🚀 API Base URL */
/* ------------------------------------------------ */
const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000') + '/api';

/* ------------------------------------------------ */
/*  Disposable Email Domains */
/* ------------------------------------------------ */
const blockedDomains = [
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
]

/* ------------------------------------------------ */
/* 📧 Advanced Dot-Safe Email Regex */
/* ------------------------------------------------ */
const advancedEmailRegex =
  /^(?!\.)(?!.*\.\.)([a-zA-Z0-9_'+\-\.]+)(?<!\.)@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/

/* ------------------------------------------------ */
/* ✅ Yup Validation Schema */
/* ------------------------------------------------ */
const validationSchema = Yup.object({
  email: Yup.string()
    .trim()
    .required("Email is required")
    .matches(advancedEmailRegex, "Enter a valid email address")
    .test(
      "blocked-domain",
      "Disposable email addresses are not allowed",
      (value) => {
        if (!value) return true
        const domain = value.split("@")[1]
        return !blockedDomains.includes(domain)
      }
    ),
})

/* ------------------------------------------------ */
/* 🌸 EverGlow Forgot Password */
/* ------------------------------------------------ */
export default function EverGlowForgotPassword() {
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`${API_URL}/auth/forgot-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: values.email }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to send reset link')
        }

        // Show success message
        setSent(true)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
      } finally {
        setIsLoading(false)
        setSubmitting(false)
      }
    },
  })

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-100 to-amber-50 px-4">
      <Card className="w-full max-w-sm rounded-3xl shadow-2xl border-0">

        {/* Header */}
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white font-bold text-xl">
            EG
          </div>

          <CardTitle className="text-2xl font-bold">
            Forgot Password?
          </CardTitle>

          <CardDescription>
            No worries ✨ Enter your email and we'll send you a reset link
          </CardDescription>
        </CardHeader>

        {/* Content */}
        <CardContent>

          {!sent ? (
            <form onSubmit={formik.handleSubmit} className="space-y-5">

              {/* Email */}
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-muted-foreground" size={18} />
                  <Input
                    name="email"
                    type="email"
                    placeholder="first.last@everglow.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`h-11 rounded-xl pl-10 ${formik.touched.email && formik.errors.email
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                      }`}
                  />
                </div>

                {formik.touched.email && formik.errors.email && (
                  <p className="text-xs text-red-500">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={!formik.isValid || formik.isSubmitting || isLoading}
                className="w-full h-11 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              {/* Error Message */}
              {error && (
                <p className="text-xs text-red-500 text-center">
                  {error}
                </p>
              )}

            </form>
          ) : (
            /* ✅ Success State */
            <div className="text-center space-y-4 py-6">
              <CheckCircle className="mx-auto text-green-500" size={42} />
              <p className="text-sm text-muted-foreground">
                If an account exists for
                <br />
                <span className="font-semibold">
                  {formik.values.email}
                </span>
                <br />
                you'll receive a password reset link shortly.
              </p>
            </div>
          )}

        </CardContent>

        {/* Footer */}
        <CardFooter className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground text-center">
            Remembered your password?{" "}
            <Link
              href="/login"
              className="text-pink-600 font-semibold hover:underline"
            >
              Back to Login
            </Link>
          </p>
        </CardFooter>

      </Card>
    </div>
  )
}
