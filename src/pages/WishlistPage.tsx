
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/context/WishlistContext";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAddToCart = (productId: number) => {
    const product = wishlist.find(item => item.id === productId);
    if (product) {
      addToCart(product);
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
      
      {wishlist.length > 0 ? (
        <div>
          <div className="flex justify-end mb-4">
            <Button variant="outline" onClick={clearWishlist}>
              Clear Wishlist
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div 
                key={product.id}
                className="product-card group"
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.title} 
                    className="product-image"
                    onClick={() => navigate(`/product/${product.id}`)}
                  />
                </div>
                <div className="p-4">
                  <div className="text-xs text-gray-500 uppercase mb-1">{product.category}</div>
                  <h3 
                    className="font-medium text-shop-black line-clamp-1 mb-2 cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">${product.price.toFixed(2)}</div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleAddToCart(product.id)}
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeFromWishlist(product.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-medium mb-4">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any products to your wishlist yet.</p>
          <Button onClick={() => navigate('/products')} className="btn-primary">
            Discover Products
          </Button>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
