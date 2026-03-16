'use client'

import { useState, useEffect, Suspense } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Lock, CheckCircle, Loader2, AlertCircle } from "lucide-react"

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
/* ✅ Yup Validation Schema */
/* ------------------------------------------------ */
const validationSchema = Yup.object({
    newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("New password is required"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), undefined], "Passwords must match")
        .required("Confirm password is required"),
})

/* ------------------------------------------------ */
/* 🌸 EverGlow Reset Password */
/* ------------------------------------------------ */
function ResetPasswordForm() {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [isValidToken, setIsValidToken] = useState<boolean | null>(null)

    useEffect(() => {
        // Validate token exists
        if (!token) {
            setIsValidToken(false)
            setError("Invalid reset link. Please request a new password reset.")
        } else {
            setIsValidToken(true)
        }
    }, [token])

    const formik = useFormik({
        initialValues: {
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema,
        validateOnChange: true,
        validateOnBlur: true,
        onSubmit: async (values, { setSubmitting }) => {
            if (!token) return

            setIsLoading(true)
            setError(null)

            try {
                const response = await fetch(`${API_URL}/auth/reset-password`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        token: token,
                        newPassword: values.newPassword
                    }),
                })

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to reset password')
                }

                // Show success message
                setSuccess(true)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred. Please try again.')
            } finally {
                setIsLoading(false)
                setSubmitting(false)
            }
        },
    })

    // Show invalid token message
    if (isValidToken === false) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-100 to-amber-50 px-4">
                <Card className="w-full max-w-sm rounded-3xl shadow-2xl border-0">
                    <CardHeader className="text-center space-y-3">
                        <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white font-bold text-xl">
                            EG
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            Invalid Link
                        </CardTitle>
                        <CardDescription>
                            This password reset link is invalid or has expired
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex flex-col gap-3">
                        <Link href="/forgot-password" className="w-full">
                            <Button className="w-full h-11 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500">
                                Request New Link
                            </Button>
                        </Link>
                        <Link href="/login" className="w-full">
                            <Button variant="outline" className="w-full h-11 rounded-xl">
                                Back to Login
                            </Button>
                        </Link>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    // Show loading while checking token
    if (isValidToken === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-100 to-amber-50 px-4">
                <Card className="w-full max-w-sm rounded-3xl shadow-2xl border-0">
                    <CardHeader className="text-center space-y-3">
                        <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white font-bold text-xl">
                            EG
                        </div>
                        <CardTitle className="text-2xl font-bold">
                            Verifying Link...
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center py-4">
                        <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-100 to-amber-50 px-4">
            <Card className="w-full max-w-sm rounded-3xl shadow-2xl border-0">

                {/* Header */}
                <CardHeader className="text-center space-y-3">
                    <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 to-rose-400 flex items-center justify-center text-white font-bold text-xl">
                        EG
                    </div>

                    <CardTitle className="text-2xl font-bold">
                        Reset Password
                    </CardTitle>

                    <CardDescription>
                        Enter your new password below
                    </CardDescription>
                </CardHeader>

                {/* Content */}
                <CardContent>

                    {!success ? (
                        <form onSubmit={formik.handleSubmit} className="space-y-5">

                            {/* New Password */}
                            <div className="space-y-2">
                                <Label>New Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                    <Input
                                        name="newPassword"
                                        type="password"
                                        placeholder="Enter new password"
                                        value={formik.values.newPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`h-11 rounded-xl pl-10 ${formik.touched.newPassword && formik.errors.newPassword
                                            ? "border-red-500 focus-visible:ring-red-500"
                                            : ""
                                            }`}
                                    />
                                </div>

                                {formik.touched.newPassword && formik.errors.newPassword && (
                                    <p className="text-xs text-red-500">
                                        {formik.errors.newPassword}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <Label>Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                                    <Input
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm new password"
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        className={`h-11 rounded-xl pl-10 ${formik.touched.confirmPassword && formik.errors.confirmPassword
                                            ? "border-red-500 focus-visible:ring-red-500"
                                            : ""
                                            }`}
                                    />
                                </div>

                                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                    <p className="text-xs text-red-500">
                                        {formik.errors.confirmPassword}
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
                                        Resetting...
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>

                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center justify-center gap-2 p-3 bg-red-50 rounded-lg">
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                    <p className="text-xs text-red-500">
                                        {error}
                                    </p>
                                </div>
                            )}

                        </form>
                    ) : (
                        /* ✅ Success State */
                        <div className="text-center space-y-4 py-6">
                            <CheckCircle className="mx-auto text-green-500" size={42} />
                            <p className="text-sm text-muted-foreground">
                                Your password has been reset successfully!
                            </p>
                        </div>
                    )}

                </CardContent>

                {/* Footer */}
                <CardFooter className="flex flex-col gap-3">
                    {success ? (
                        <Link href="/login" className="w-full">
                            <Button className="w-full h-11 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500">
                                Go to Login
                            </Button>
                        </Link>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center">
                            Remembered your password?{" "}
                            <Link
                                href="/login"
                                className="text-pink-600 font-semibold hover:underline"
                            >
                                Back to Login
                            </Link>
                        </p>
                    )}
                </CardFooter>

            </Card>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-100 to-amber-50 px-4">
                <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    )
}
