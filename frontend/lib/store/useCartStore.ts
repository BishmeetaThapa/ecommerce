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
                const productId = product.id || product._id
                const existingItem = currentItems.find((item) => item.id === productId)

                if (existingItem) {
                    set({
                        items: currentItems.map((item) =>
                            item.id === productId
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    })
                } else {
                    set({
                        items: [
                            ...currentItems,
                            {
                                id: productId,
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
                    items: get().items.filter((item) => String(item.id) !== String(productId)),
                })
            },
            updateQuantity: (productId, quantity) => {
                set({
                    items: get().items.map((item) =>
                        String(item.id) === String(productId) ? { ...item, quantity: Math.max(0, quantity) } : item
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
