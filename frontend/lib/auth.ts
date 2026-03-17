/**
 * Authentication Utilities
 * 
 * SECURITY NOTE: For production, consider using httpOnly cookies instead of localStorage
 * to prevent XSS attacks from stealing tokens. This implementation uses localStorage
 * for simplicity but should be upgraded for production use.
 */

export interface AuthUser {
    _id: string
    name: string
    email: string
    role: string
    token?: string
}

const USER_KEY = 'everglow_user'
const TOKEN_KEY = 'everglow_token'

export const authUtils = {
    /**
     * Store authentication data
     * For production: Use httpOnly cookies instead
     */
    setAuth: (user: AuthUser, token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(TOKEN_KEY, token)
            localStorage.setItem(USER_KEY, JSON.stringify(user))
        }
    },

    /**
     * Get stored token
     * WARNING: This is vulnerable to XSS attacks
     * For production: Use server-side cookie retrieval
     */
    getToken: (): string | null => {
        if (typeof window === 'undefined') return null
        return localStorage.getItem(TOKEN_KEY)
    },

    /**
     * Get stored user data
     */
    getUser: (): AuthUser | null => {
        if (typeof window === 'undefined') return null
        const userStr = localStorage.getItem(USER_KEY)
        return userStr ? JSON.parse(userStr) : null
    },

    /**
     * Check if user is authenticated
     */
    isAuthenticated: (): boolean => {
        return !!authUtils.getToken()
    },

    /**
     * Check if user is admin
     */
    isAdmin: (): boolean => {
        const user = authUtils.getUser()
        return user?.role?.toLowerCase() === 'admin'
    },

    /**
     * Clear authentication data (logout)
     */
    logout: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_KEY)
            localStorage.removeItem(USER_KEY)
        }
    },

    /**
     * Get authorization header for API requests
     */
    getAuthHeader: (): Record<string, string> => {
        const token = authUtils.getToken()
        return token ? { Authorization: `Bearer ${token}` } : {}
    }
}

export default authUtils
