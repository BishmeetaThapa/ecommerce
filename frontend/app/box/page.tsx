'use client';

import React, { useState } from 'react';
import { useBoxStore } from '@/lib/store/useBoxStore';

const Box: React.FC = () => {
  const { height, width, incrementHeight, decrementHeight } = useBoxStore();

  const [step, setStep] = useState(10);

  const handleIncrement = () => incrementHeight(step); // Increase
  const handleDecrement = () => decrementHeight(-step); // Decrease

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      {/* Box Preview */}
      <div
        style={{
          height: `${height}px`,
          width: `${width}px`,
          backgroundColor: 'lightgray',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'height 0.3s, width 0.3s',
          border: '2px dashed #888',
        }}
      >
        Box
      </div>

      {/* Step Input */}
      <div className="flex items-center gap-2">
        <label>Step:</label>
        <input
          type="number"
          min={1}
          max={100}
          value={step}
          onChange={(e) => setStep(Number(e.target.value))}
          className="border px-2 rounded w-16"
        />
        <span>px</span>
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={handleDecrement}
          className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition"
        >
          Decrease
        </button>
        <button
          onClick={handleIncrement}
          className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition"
        >
          Increase
        </button>
      </div>

      {/* Info */}
      <p>
        Height: {height}px | Width: {width}px
      </p>
    </div>
  );
};

export default Box;
