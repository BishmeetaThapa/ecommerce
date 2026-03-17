import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface WishlistItem {
    id: string | number
    _id?: string
    slug: string
    name: string
    price: number
    image_link: string
    brand?: string
}

interface WishlistState {
    items: WishlistItem[]
    addItem: (item: WishlistItem) => void
    removeItem: (id: string | number) => void
    isInWishlist: (id: string | number) => boolean
    clearWishlist: () => void
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (item) => {
                const currentItems = get().items
                // Check if item already exists
                if (!currentItems.find((i) => i.id === item.id)) {
                    set({ items: [...currentItems, item] })
                }
            },

            removeItem: (id) => {
                set({ items: get().items.filter((item) => item.id !== id) })
            },

            isInWishlist: (id) => {
                return get().items.some((item) => item.id === id)
            },

            clearWishlist: () => {
                set({ items: [] })
            },
        }),
        {
            name: 'everglow-wishlist',
        }
    )
)

export default useWishlistStore
