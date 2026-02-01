'use client'

import { decrement, increment } from '@/redux/slice/counter/counterslice'
import { useSelector, useDispatch } from 'react-redux'

function Counter() {
  const count = useSelector((state: any) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-100">
      <div className="w-96 rounded-xl bg-white p-8 shadow-md border border-zinc-200">
        
        <h1 className="text-xl font-semibold text-zinc-800 text-center mb-6">
          Counter
        </h1>

        <div className="text-center text-6xl font-bold text-zinc-900 mb-8">
          {count}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => dispatch(decrement())}
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-3
                       text-zinc-700 font-medium
                       hover:bg-red-50 hover:border-red-300
                       active:scale-[0.98]
                       transition"
          >
            <span className="mr-2 text-red-500 font-bold">−</span>
            Decrement
          </button>

          <button
            onClick={() => dispatch(increment())}
            className="flex-1 rounded-lg border border-zinc-300 px-4 py-3
                       text-zinc-700 font-medium
                       hover:bg-emerald-50 hover:border-emerald-300
                       active:scale-[0.98]
                       transition"
          >
            <span className="mr-2 text-emerald-600 font-bold">+</span>
            Increment
          </button>
        </div>

        <p className="mt-6 text-center text-sm text-zinc-500">
          Redux Toolkit Counter
        </p>
      </div>
    </div>
  )
}

export default Counter

