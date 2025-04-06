import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserButton, SignInButton, useUser } from "@clerk/clerk-react";
import { Search, ShoppingCart, Heart, History, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { useSearch } from "@/context/SearchContext";
import { Button } from "@/components/ui/button";
import SearchModal from "./SearchModal";

const Header = () => {
  const { isSignedIn } = useUser();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { searchTerm, setSearchTerm } = useSearch();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <a href="/" className="text-2xl font-bold text-shop-black">
              SimplStore
            </a>
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                <li>
                  <a
                    href="/products"
                    className="text-gray-600 hover:text-shop-black transition-colors"
                  >
                    Products
                  </a>
                </li>
                <li>
                  <a
                    href="/categories"
                    className="text-gray-600 hover:text-shop-black transition-colors"
                  >
                    Categories
                  </a>
                </li>
                <li>
                  <a
                    href="/browsing-history"
                    className="text-gray-600 hover:text-shop-black transition-colors"
                  >
                    History
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative btn-icon"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative btn-icon"
              onClick={() => navigate("/wishlist")}
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-shop-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative btn-icon"
              onClick={() => navigate("/cart")}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-shop-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative btn-icon"
              onClick={() => navigate("/browsing-history")}
            >
              <History className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative btn-icon"
              onClick={() => navigate("/orders")}
            >
              <Package className="h-5 w-5" />
            </Button>

            {isSignedIn ? (
              <UserButton afterSignOutUrl="/" />
            ) : (
              <SignInButton mode="modal">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>

      {isSearchOpen && (
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;
