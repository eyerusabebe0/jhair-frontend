import React, { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useScrollAnimation } from "./useScrollAnimation";
import API_URL from "../config/api";

function ProductCard({ product, animationDelay = 0 }) {
  const [ref, isVisible] = useScrollAnimation();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Check if product is saved when component mounts
  useEffect(() => {
    checkIfSaved();
  }, []);

  const checkIfSaved = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/auth/saved-items`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const savedItems = await res.json();
      const saved = savedItems.some(item => item._id === product._id);
      setIsSaved(saved);
    } catch (error) {
      console.error("Error checking saved items:", error);
    }
  };

  const handleSaveToggle = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Please login to save items!");
      navigate("/login");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/save-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id })
      });

      const data = await res.json();
      setIsSaved(data.saved);
      alert(data.message);
    } catch (error) {
      console.error("Error saving item:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    return true;
  };

  const handleBuyClick = () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    let isLoggedIn = false;
    
    if (token && userStr && userStr !== "undefined" && userStr !== "null") {
      try {
        const user = JSON.parse(userStr);
        if (user && user.id) {
          isLoggedIn = true;
        }
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }
    
    if (!isLoggedIn) {
      alert("⚠️ Please create an account or login first to continue shopping!");
      navigate("/signup");
      return;
    }
    
    handleAddToCart();
    alert(`✅ ${product.name} added to your bag!`);
    
    const goToBag = window.confirm("Item added to bag! Go to bag now?");
    if (goToBag) {
      navigate("/bag");
    }
  };

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 relative scroll-animate ${isVisible ? "scroll-animate-visible" : ""}`}
      style={{ transitionDelay: `${animationDelay}ms` }}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          className="w-full h-60 object-cover group-hover:scale-110 transition duration-500"
          alt={product.name}
        />

        {/* Save Button */}
        <button
          onClick={handleSaveToggle}
          disabled={saving}
          className={`absolute top-3 right-3 bg-white p-2 rounded-full shadow cursor-pointer transition ${
            isSaved ? "text-pink-500" : "text-gray-500 hover:text-pink-500"
          }`}
        >
          <Heart size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{product.name}</h3>
          <span className="text-pink-500 font-bold">
            ${product.price}
          </span>
        </div>

        <p className="text-sm text-gray-400 mt-2">
          {product.description}
        </p>

        <button
          onClick={handleBuyClick}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default ProductCard;