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

  useEffect(() => {
    checkIfSaved();
  }, [product._id]);

  const checkIfSaved = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/auth/saved-items`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (res.ok) {
        const savedItems = await res.json();
        const saved = savedItems.some(item => item._id === product._id);
        setIsSaved(saved);
      }
    } catch (error) {
      console.error("Error checking saved items:", error);
    }
  };

  const handleSaveToggle = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("❤️ Please login to save items to your favorites!");
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

      if (res.ok) {
        setIsSaved(data.saved);
        if (data.saved) {
          alert(`❤️ "${product.name}" added to your favorites!`);
        } else {
          alert(`💔 "${product.name}" removed from favorites`);
        }
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error saving item:", error);
      alert("Failed to save item. Please try again.");
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
      className={`bg-white rounded-xl md:rounded-2xl shadow-md md:shadow-lg overflow-hidden group hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 md:hover:-translate-y-2 relative scroll-animate ${isVisible ? "scroll-animate-visible" : ""}`}
      style={{ transitionDelay: `${animationDelay}ms` }}
    >
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          className="w-full h-28 sm:h-40 md:h-60 object-cover group-hover:scale-110 transition duration-500"
          alt={product.name}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x240?text=No+Image";
          }}
        />

        <button
          onClick={handleSaveToggle}
          disabled={saving}
          className={`absolute top-1.5 right-1.5 md:top-3 md:right-3 bg-white/90 backdrop-blur-sm p-1.5 md:p-2 rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 ${
            isSaved
              ? "text-pink-500 bg-pink-50"
              : "text-gray-500 hover:text-pink-500 hover:bg-pink-50"
          }`}
          title={isSaved ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            size={16}
            fill={isSaved ? "currentColor" : "none"}
            className={`md:hidden ${saving ? "animate-pulse" : ""}`}
          />
          <Heart
            size={20}
            fill={isSaved ? "currentColor" : "none"}
            className={`hidden md:block ${saving ? "animate-pulse" : ""}`}
          />
        </button>
      </div>

      <div className="p-2.5 md:p-4">
        <div className="flex justify-between items-center gap-1">
          <h3 className="font-semibold text-gray-800 truncate text-xs md:text-base">{product.name}</h3>
          <span className="text-pink-500 font-bold text-xs md:text-lg shrink-0">
            ${typeof product.price === 'number' ? product.price.toFixed(2) : product.price}
          </span>
        </div>

        <p className="text-[11px] md:text-sm text-gray-400 mt-1 md:mt-2 line-clamp-2">
          {product.description}
        </p>

        <button
          onClick={handleBuyClick}
          className="mt-2 md:mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white px-2 py-1.5 md:px-4 md:py-2 rounded-lg transition-all duration-300 transform hover:scale-105 text-xs md:text-base"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}

export default ProductCard;