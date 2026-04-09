import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaPlus, FaMinus, FaShoppingBag, FaArrowLeft } from "react-icons/fa";
import API_URL from "../config/api";

const Bag = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // LOAD CART FROM LOCALSTORAGE
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(storedCart);
  }, []);

  // UPDATE QUANTITY
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedCart = cartItems.map(item =>
      item._id === id ? { ...item, quantity: newQuantity } : item
    );

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // REMOVE ITEM
  const removeItem = (id) => {
    const updatedCart = cartItems.filter(item => item._id !== id);

    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // TOTAL CALCULATIONS
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shipping = subtotal > 200 ? 0 : 9.99;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Please login to checkout!");
      navigate("/login");
      return;
    }

    try {
      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      const res = await fetch(`${API_URL}/api/auth/purchase-history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          items: cartItems,
          totalAmount: totalAmount
        })
      });

      if (res.ok) {
        alert("✅ Order placed successfully!");
        localStorage.removeItem("cart");
        navigate("/profile");
      } else {
        alert("Checkout failed. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Error during checkout");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white px-6 py-10 flex justify-center">
      <div className="max-w-6xl w-full space-y-8">

        {/* HEADER */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <FaShoppingBag className="text-pink-500 text-3xl" />
            <h1 className="text-3xl font-bold text-gray-800">My Bag</h1>
          </div>
          <p className="text-gray-500">{cartItems.length} item(s) in your bag</p>
        </div>

        {/* EMPTY BAG */}
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-pink-100 p-12 text-center">
            <FaShoppingBag className="text-6xl text-pink-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Your bag is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added any items yet
            </p>
           <Link to="/products">
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition inline-flex items-center gap-2">
                <FaArrowLeft size={14} />
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ITEMS */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl shadow-md border border-pink-100 p-4">
                  
                  <div className="flex gap-4 flex-col sm:flex-row">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />

                    <div className="flex-1">

                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            {item.description}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-bold text-pink-600">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400">
                            ${item.price} each
                          </p>
                        </div>
                      </div>

                      {/* CONTROLS */}
                      <div className="flex justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="p-2 bg-pink-100 rounded-full"
                          >
                            <FaMinus size={12} />
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="p-2 bg-pink-100 rounded-full"
                          >
                            <FaPlus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item._id)}
                          className="text-red-500 flex items-center gap-1"
                        >
                          <FaTrash /> Remove
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="bg-white p-6 rounded-2xl shadow-md border border-pink-100 h-fit">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>

              <div className="space-y-2">
                <p>Subtotal: ${subtotal.toFixed(2)}</p>
                <p>Shipping: {shipping === 0 ? "Free" : `$${shipping}`}</p>
                <p>Tax: ${tax.toFixed(2)}</p>

                <hr />

                <p className="font-bold text-pink-600">
                  Total: ${total.toFixed(2)}
                </p>
              </div>

              <button 
                onClick={handleCheckout}
                className="w-full mt-6 bg-pink-500 text-white py-3 rounded-lg"
              >
                Checkout
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Bag;