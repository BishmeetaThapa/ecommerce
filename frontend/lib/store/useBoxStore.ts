import { create } from 'zustand'

interface BoxState {
  height: number
  width: number
  incrementHeight: (amount: number) => void
  decrementHeight: (amount: number) => void
  setDimensions: (height: number, width: number) => void
}

export const useBoxStore = create<BoxState>((set) => ({
  height: 100,
  width: 100,
  incrementHeight: (amount: number) => 
    set((state) => ({ height: state.height + amount })),
  decrementHeight: (amount: number) => 
    set((state) => ({ height: Math.max(10, state.height + amount) })),
  setDimensions: (height: number, width: number) => 
    set({ height, width }),
}))
