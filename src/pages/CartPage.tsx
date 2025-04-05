import React from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, cartTotal } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center p-4 border-b last:border-b-0"
                >
                  <div className="w-20 h-20 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="ml-4 flex-grow">
                    <h3 className="font-medium">{item.title}</h3>
                    <p className="text-gray-500 text-sm">
                      ₹{item.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center border border-gray-300 rounded-md mx-4">
                    <button
                      className="p-1 hover:bg-gray-100"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="px-2">
                      {item.quantity}
                    </div>
                    <button
                      className="p-1 hover:bg-gray-100"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="font-medium w-24 text-right">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                  <button
                    className="ml-4 p-2 text-gray-500 hover:text-red-500"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-between">
              <Button variant="ghost" onClick={() => navigate('/products')}>
                Continue Shopping
              </Button>
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="border-t border-gray-200 my-2 pt-2">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Button onClick={() => navigate('/products')} className="bg-blue-600 hover:bg-blue-700 text-white">
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
