"use client";

import React from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function StorePage() {
  const { addToCart } = useCart();

  const products = [
    { id: "1", name: "Camiseta Oficial 2026", price: 85000, image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=600&auto=format&fit=crop" },
    { id: "2", name: "Balón Oficial Mikasa V200W", price: 320000, image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=600&auto=format&fit=crop" },
    { id: "3", name: "Rodilleras Asics Pro", price: 120000, image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop" },
    { id: "4", name: "Gorra Voley Zúñiga", price: 45000, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop" },
  ];

  return (
    <div className="pt-28 pb-20 bg-[#F7F8FA] min-h-screen text-[#0F2347]">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-heading font-bold uppercase mb-4">Tienda Oficial</h1>
        <p className="text-[#64748B] text-xl font-sans max-w-2xl mb-12">
          Viste los colores del campeón. Equipamiento premium oficial del Club Voley Zúñiga.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="relative h-64 overflow-hidden bg-gray-100">
                <Image 
                  src={product.image} 
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"
                />
              </div>
              <div className="p-6">
                <h3 className="font-heading font-bold text-xl uppercase mb-2">{product.name}</h3>
                <p className="text-[#F29A2E] font-sans font-bold text-lg mb-4">
                  ${product.price.toLocaleString("es-CO")}
                </p>
                <button 
                  onClick={() => addToCart({ ...product, quantity: 1 })}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#0F2347] hover:bg-[#F29A2E] text-white hover:text-[#0F2347] transition-colors rounded-xl font-bold uppercase text-sm"
                >
                  <ShoppingBag size={18} /> Añadir al Carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
