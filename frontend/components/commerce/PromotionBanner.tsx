'use client'

import { useState, useEffect } from "react";

export default function PromotionBanner() {
    const [timeLeft, setTimeLeft] = useState(0);

    // Countdown for 3 days
    useEffect(() => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 3);

        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference <= 0) {
                clearInterval(interval);
                setTimeLeft(0);
            } else {
                setTimeLeft(difference);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const formatTime = (milliseconds: number) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const days = Math.floor(totalSeconds / (24 * 3600));
        const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <div className="relative max-w-6xl mx-auto bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white rounded-xl overflow-hidden shadow-xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-6">

            {/* Left Side: Text */}
            <div className="max-w-md">
                <h2 className="text-2xl md:text-4xl font-extrabold mb-3 tracking-wide">
                    🔥 Limited Time Flash Sale!
                </h2>
                <p className="text-base md:text-lg mb-4">
                    Get your favorite Everglow products at up to <span className="font-bold">50% OFF</span>. Hurry, the deal ends soon!
                </p>
                <p className="text-base md:text-lg font-semibold mb-4 text-white/90">
                    {timeLeft > 0 ? `Ends in: ${formatTime(timeLeft)}` : "Deal Expired"}
                </p>
                <button className="bg-white text-purple-700 font-bold py-2 px-6 rounded-full shadow-lg hover:bg-gray-100 transition transform hover:scale-105 active:scale-95">
                    Shop Now
                </button>
            </div>

            {/* Right Side: Image */}
            <div className="hidden md:flex flex-1 justify-center items-center max-w-sm">
                <img
                    src="https://easterncurlew.com/cdn/shop/files/SKIN1004_-_Madagascar_Centella_Complete_Skincare_Set_104434dd-f328-4ada-b31d-9c5abb7e4d3a.webp?v=1741466631"
                    alt="Promotion Product"
                    className="w-72 h-72 object-contain rounded-xl shadow-lg hover:rotate-2 transition-transform"
                />
            </div>


            {/* Decorative Background Shapes */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -translate-x-1/4 -translate-y-1/4 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-x-1/6 translate-y-1/6 animate-pulse"></div>
        </div>
    );
}
