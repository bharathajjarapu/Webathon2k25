import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useBrowsingHistory } from "@/context/BrowsingHistoryContext";
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseProduct } from "@/hooks/useSupabaseProduct";
import PersonalizedRecommendations from "@/components/PersonalizedRecommendations";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error } = useSupabaseProduct(id);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToHistory } = useBrowsingHistory();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Add product to browsing history when it loads
  useEffect(() => {
    if (product) {
      addToHistory(product);
    }
  }, [product, addToHistory]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      });
    }
  };

  const handleWishlistToggle = () => {
    if (!product) return;

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.title} has been removed from your wishlist.`,
      });
    } else {
      addToWishlist(product);
      toast({
        title: "Added to wishlist",
        description: `${product.title} has been added to your wishlist.`,
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Loading product...</h2>
          <p className="text-gray-500">Please wait while we fetch the product details.</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-500 mb-4">{error || "Product not found"}</p>
          <Button
            onClick={() => navigate(-1)}
            className="btn-primary"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-sm hover:bg-gray-100"
        >
          &larr; Back
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="bg-white rounded-lg p-8 flex items-center justify-center">
          <img
            src={product.image}
            alt={product.title}
            className="max-h-96 object-contain"
          />
        </div>

        {/* Product Details */}
        <div>
          <div className="text-sm uppercase text-gray-500 mb-2">
            {product.category}
          </div>
          <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(product.rating.rate) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              ({product.rating.count} reviews)
            </span>
          </div>

          <div className="text-2xl font-bold mb-6">
            ${product.price.toFixed(2)}
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {product.brand && (
            <div className="mb-6">
              <h3 className="font-medium mb-2">Brand</h3>
              <p>{product.brand}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-medium mb-2">Quantity</h3>
            <div className="flex border border-gray-300 rounded-md w-32">
              <button
                className="px-3 py-1 hover:bg-gray-100"
                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
              >
                -
              </button>
              <div className="flex-1 flex items-center justify-center">
                {quantity}
              </div>
              <button
                className="px-3 py-1 hover:bg-gray-100"
                onClick={() => setQuantity(prev => prev + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              className="btn-primary flex-1 gap-2"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
              Add to Cart
            </Button>
            <Button
              variant="outline"
              className="btn-icon"
              onClick={handleWishlistToggle}
            >
              <Heart
                className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500' : ''}`}
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Personalized Recommendations */}
      <div className="mt-16">
        <PersonalizedRecommendations />
      </div>
    </div>
  );
};

export default ProductDetailPage;
