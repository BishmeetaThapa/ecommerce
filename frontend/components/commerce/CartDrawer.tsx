'use client'
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet"
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import { useCartStore } from "@/lib/store/useCartStore"
import { useDarkMode } from "@/components/providers/DarkModeProvider"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function CartDrawer({ children }: { children: React.ReactNode }) {
    const { items, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore()
    const { darkMode } = useDarkMode()
    const [isHydrated, setIsHydrated] = useState(false)

    useEffect(() => {
        setIsHydrated(true)
    }, [])

    if (!isHydrated) return <>{children}</>

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="right" className={`w-full sm:max-w-md flex flex-col p-0 ${darkMode ? 'bg-gray-900 border-gray-800 text-white' : 'bg-white'}`}>
                <SheetHeader className="p-6 border-b border-gray-100 dark:border-gray-800">
                    <SheetTitle className={`flex items-center gap-2 ${darkMode ? 'text-white' : ''}`}>
                        <ShoppingCart className="w-5 h-5 text-pink-500" />
                        Your Shopping Bag ({getTotalItems()})
                    </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                            <div className="w-20 h-20 bg-pink-50 dark:bg-gray-800 rounded-full flex items-center justify-center">
                                <ShoppingBag className="w-10 h-10 text-pink-300" />
                            </div>
                            <p className="text-gray-500 font-medium">Your bag is empty</p>
                            <Button variant="outline" className="rounded-full">Start Shopping</Button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                    <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                                        <img src={item.image_link} alt={item.name} className="w-full h-full object-contain p-1" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h4 className="text-sm font-semibold line-clamp-1">{item.name}</h4>
                                            <p className="text-pink-500 font-bold text-sm mt-1">Rs {item.price}</p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center border dark:border-gray-700 rounded-lg">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {items.length > 0 && (
                    <SheetFooter className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
                        <div className="w-full flex flex-col gap-4">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-bold">Rs {getTotalPrice().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Shipping</span>
                                <span className="text-green-500 font-medium">FREE</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between items-center text-lg font-bold">
                                <span>Total</span>
                                <span className="text-pink-600">Rs {getTotalPrice().toFixed(2)}</span>
                            </div>
                            <Button className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-full py-6 text-lg font-bold shadow-lg shadow-pink-200 dark:shadow-none transition-all active:scale-95">
                                Checkout Now
                            </Button>
                            <p className="text-center text-[10px] text-gray-400">Secure Checkout Powered by EverGlow Pay</p>
                        </div>
                    </SheetFooter>
                )}
            </SheetContent>
        </Sheet>
    )
}
