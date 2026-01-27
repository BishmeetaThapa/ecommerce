import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: string | number
    name: string
    price: number
    image_link: string
    quantity: number
}

interface CartStore {
    items: CartItem[]
    addItem: (product: any) => void
    removeItem: (productId: string | number) => void
    updateQuantity: (productId: string | number, quantity: number) => void
    clearCart: () => void
    getTotalItems: () => number
    getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => {
                const currentItems = get().items
                const existingItem = currentItems.find((item) => item.id === product.id)

                if (existingItem) {
                    set({
                        items: currentItems.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    })
                } else {
                    set({
                        items: [
                            ...currentItems,
                            {
                                id: product.id,
                                name: product.name,
                                price: parseFloat(product.price) || 0,
                                image_link: product.image_link,
                                quantity: 1,
                            },
                        ],
                    })
                }
            },
            removeItem: (productId) => {
                set({
                    items: get().items.filter((item) => item.id !== productId),
                })
            },
            updateQuantity: (productId, quantity) => {
                set({
                    items: get().items.map((item) =>
                        item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
                    ).filter(item => item.quantity > 0),
                })
            },
            clearCart: () => set({ items: [] }),
            getTotalItems: () => {
                return get().items.reduce((total, item) => total + item.quantity, 0)
            },
            getTotalPrice: () => {
                return get().items.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0
                )
            },
        }),
        {
            name: 'everglow-cart-storage',
        }
    )
)
