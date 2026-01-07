"use client";

import React, { useEffect, useState } from "react";
import ImageGallery from "@/components/ImageGallery";
import { IProduct } from "@/types/product";
import { apiClient } from "@/lib/api-client";
import { Loader2 } from "lucide-react";

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-zinc-900" />
        <p className="text-zinc-500 font-medium">Curating gallery...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50/30">
      
      {/* Hero Section */}
      <section className="relative w-full bg-zinc-900 text-white overflow-hidden">
        {/* Abstract Background Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative container mx-auto px-4 py-24 lg:py-32 flex flex-col items-center text-center max-w-4xl">
          <span className="mb-4 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium border border-white/20 uppercase tracking-widest backdrop-blur-sm">
            Premium Digital Assets
          </span>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
            Iqbal Shop
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mb-10 leading-relaxed">
            Discover high-quality, hand-picked digital images for your next big project. 
            Instant downloads. Secure payments.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <a 
              href="#gallery" 
              className="px-8 py-4 bg-white text-zinc-900 font-bold rounded-full hover:bg-zinc-100 transition-all active:scale-95 shadow-xl shadow-white/10"
            >
              Browse Collection
            </a>
            <button className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all active:scale-95 backdrop-blur-sm">
              Sell Your Work
            </button>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="container mx-auto px-4 py-16 lg:py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">
              Featured Drops
            </h2>
            <p className="text-zinc-500 mt-2 text-lg">
              Fresh additions to our exclusive collection.
            </p>
          </div>
          <div className="hidden md:block h-px flex-1 bg-zinc-200 mx-8 mb-3"></div>
        </div>

        {/* The Gallery Component */}
        <ImageGallery products={products} />
      </section>

    </main>
  );
}