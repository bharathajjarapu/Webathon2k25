
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-shop-gray">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Discover modern essentials for your lifestyle
            </h1>
            <p className="text-lg text-gray-600">
              Shop with confidence at SimplStore, where quality meets simplicity. Browse our curated collection of premium products.
            </p>
            <div className="space-x-4">
              <Button 
                className="btn-primary"
                onClick={() => navigate("/products")}
              >
                Shop Now
              </Button>
              <Button 
                variant="outline" 
                className="btn-outline"
                onClick={() => navigate("/categories")}
              >
                Explore Categories
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1573855619003-97b4799dcd8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Hero Product" 
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <div className="font-medium">New Arrivals</div>
                <div className="text-sm text-gray-500">Refresh your style today</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
