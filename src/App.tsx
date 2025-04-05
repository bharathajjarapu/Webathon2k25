
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { SearchProvider } from "@/context/SearchContext";

import Header from "@/components/Header";
import Index from "@/pages/Index";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import WishlistPage from "@/pages/WishlistPage";
import CategoriesPage from "@/pages/CategoriesPage";
import CategoryProductsPage from "@/pages/CategoryProductsPage";
import SearchResultsPage from "@/pages/SearchResultsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <WishlistProvider>
          <SearchProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/product/:id" element={<ProductDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/wishlist" element={<WishlistPage />} />
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/category/:category" element={<CategoryProductsPage />} />
                    <Route path="/search" element={<SearchResultsPage />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </main>
              </div>
            </BrowserRouter>
          </SearchProvider>
        </WishlistProvider>
      </CartProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
