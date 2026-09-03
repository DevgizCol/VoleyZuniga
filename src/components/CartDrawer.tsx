"use client";

import React, { useEffect } from "react";
import { X, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
  } = useCart();

  // Handle ESC key and body scroll lock
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsCartOpen(false);
    };
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    let message = "Hola, me gustaría comprar los siguientes artículos:\n\n";
    items.forEach((item) => {
      message += `- ${item.quantity}x ${item.name} ($${item.price.toLocaleString("es-CO")})\n`;
    });
    message += `\nTotal: $${cartTotal.toLocaleString("es-CO")}\n\nPor favor envíenme los pasos de pago.`;
    
    const whatsappUrl = `https://wa.me/573128459210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#071426] border-l border-white/10 z-50 flex flex-col shadow-2xl transform transition-transform duration-300">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingBag className="text-[#F29A2E]" />
            <h2 className="text-xl font-bold font-oswald text-white uppercase tracking-wider">
              Carrito de Compras
            </h2>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#F29A2E] hover:text-[#071426] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-60">
              <ShoppingBag size={48} className="mb-4 opacity-20" />
              <p className="text-lg">Tu carrito está vacío</p>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="mt-6 px-6 py-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors"
              >
                Continuar Comprando
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5 relative group">
                <div className="w-20 h-24 rounded-lg bg-black/40 overflow-hidden relative flex-shrink-0">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h4 className="font-bold text-white text-lg leading-tight line-clamp-1">{item.name}</h4>
                    <p className="text-[#F29A2E] font-medium mt-1">
                      ${item.price.toLocaleString("es-CO")}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Quantity controls */}
                    <div className="flex items-center bg-black/30 rounded-full border border-white/10">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:text-[#F29A2E] transition-colors"
                      >-</button>
                      <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:text-[#F29A2E] transition-colors"
                      >+</button>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-4 right-4 text-white/40 hover:text-red-500 transition-colors"
                  aria-label="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#071426] flex flex-col gap-4">
            <div className="flex justify-between items-center text-lg">
              <span className="text-white/70">Subtotal:</span>
              <span className="font-bold text-white text-2xl font-oswald">
                ${cartTotal.toLocaleString("es-CO")}
              </span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full py-4 rounded-xl bg-[#F29A2E] hover:bg-white text-[#071426] font-bold text-lg uppercase tracking-wider transition-all duration-300 transform hover:scale-[1.02]"
            >
              Comprar por WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
