import React, { useEffect, useState, useRef } from "react";
import ProductCard from "./ProductCard";
import { ChevronDown, Sparkles, TrendingUp, Star, Truck, Shield, Clock } from "lucide-react";
import API_URL from "../config/api";

function Home() {
  const [products, setProducts] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const productsRef = useRef(null);

  // FETCH PRODUCTS FROM BACKEND
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    
    // Add scroll listener for navbar effect
    window.addEventListener("scroll", () => {
      setScrolled(window.scrollY > 50);
    });
  }, []);

  const scrollToProducts = () => {
    productsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white">
      {/* HERO SECTION with Shop Now Button */}
      <section className="relative h-screen w-full overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed transform scale-105"
          style={{
            backgroundImage: "url('https://i.pinimg.com/736x/b3/4a/48/b34a48641b6e253c38de95ae00e0d18b.jpg')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40"></div>
        </div>

        {/* Animated Content */}
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          {/* Badge */}
          <div className="animate-bounce mb-6">
            <span className="px-4 py-2 bg-pink-500/20 backdrop-blur-sm rounded-full text-pink-300 text-sm font-semibold border border-pink-400/30">
              ✨ Premium Quality Hair ✨
            </span>
          </div>

          {/* Main Title with Animation */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold !text-white mb-6 animate-fade-in-up">
            Glow with{" "}
            <span className="bg-gradient-to-r from-pink-400 to-pink-600 bg-clip-text text-transparent">
              JHAIR
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto mb-8 animate-fade-in-up animation-delay-200">
            Discover the most attractive and high-quality human hair extensions
          </p>

          {/* Features Row */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 animate-fade-in-up animation-delay-400">
            <div className="flex items-center gap-2 text-white">
              <Star className="text-yellow-400" size={20} />
              <span>100% Human Hair</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <Sparkles className="text-pink-400" size={20} />
              <span>Premium Quality</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <TrendingUp className="text-green-400" size={20} />
              <span>Free Shipping</span>
            </div>
          </div>

          {/* Shop Now Button */}
          <button
            onClick={scrollToProducts}
            className="group relative px-8 py-4 bg-gradient-to-r from-pink-500 to-pink-600 rounded-full text-white font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 animate-fade-in-up animation-delay-600"
          >
            <span className="flex items-center gap-2">
              Shop Now
              <ChevronDown className="group-hover:translate-y-1 transition-transform" size={20} />
            </span>
            <div className="absolute inset-0 rounded-full bg-pink-400 opacity-0 group-hover:opacity-20 transition-opacity"></div>
          </button>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-2 bg-white rounded-full mt-2 animate-scroll"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section ref={productsRef} className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <span className="text-pink-500 font-semibold text-sm uppercase tracking-wider">Our Collection</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-4">
              Shop Your Hair
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-pink-400 to-pink-600 mx-auto rounded-full"></div>
            <p className="text-gray-500 mt-4 max-w-md mx-auto">
              Discover our premium collection of high-quality human hair
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.length > 0 ? (
              products.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  animationDelay={index * 100}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
                <p className="mt-4 text-gray-500">Loading products...</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-pink-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
                <Truck className="text-pink-500" size={28} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Free Shipping</h3>
              <p className="text-gray-500 text-sm">On orders over $200</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
                <Shield className="text-pink-500" size={28} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Quality Guarantee</h3>
              <p className="text-gray-500 text-sm">100% authentic products</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-pink-200 transition-colors">
                <Clock className="text-pink-500" size={28} />
              </div>
              <h3 className="font-semibold text-lg mb-2">24/7 Support</h3>
              <p className="text-gray-500 text-sm">Customer service always ready</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;