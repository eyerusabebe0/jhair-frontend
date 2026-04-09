import React, { useEffect, useState } from "react";
import { FaEnvelope, FaSignOutAlt, FaHeart, FaShoppingBag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFullProfile();
  }, []);

  const fetchFullProfile = async () => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/full-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await res.json();
      console.log("Full profile data:", data);
      setProfileData(data);
    } catch (error) {
      console.error("Error fetching profile:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveSavedItem = async (productId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/save-item`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Could not remove saved item");
      }
      fetchFullProfile();
    } catch (error) {
      console.error("Error removing saved item:", error);
      alert(error.message || "Unable to remove saved item");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No user data found</p>
          <button 
            onClick={() => navigate("/login")}
            className="mt-4 bg-pink-500 text-white px-4 py-2 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto py-8 px-4">
        
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-pink-500 text-white flex items-center justify-center rounded-full text-3xl font-bold">
              {profileData.user.name ? profileData.user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{profileData.user.name}</h1>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <FaEnvelope className="text-pink-500" />
                <p>{profileData.user.email}</p>
              </div>
              <p className="text-sm text-gray-400 mt-1">
                Member since: {new Date(profileData.user.createdAt).toLocaleDateString()}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition flex items-center gap-2"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-500">{profileData.stats.totalSaved}</div>
              <div className="text-sm text-gray-500">Saved Items</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-500">{profileData.stats.totalPurchases}</div>
              <div className="text-sm text-gray-500">Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-pink-500">${profileData.stats.totalSpent.toFixed(2)}</div>
              <div className="text-sm text-gray-500">Total Spent</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 py-3 px-4 text-center font-medium transition ${
                activeTab === "profile" 
                  ? "text-pink-500 border-b-2 border-pink-500 bg-pink-50" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Profile Info
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex-1 py-3 px-4 text-center font-medium transition flex items-center justify-center gap-2 ${
                activeTab === "saved" 
                  ? "text-pink-500 border-b-2 border-pink-500 bg-pink-50" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaHeart /> Saved Items ({profileData.savedItems.length})
            </button>
            <button
              onClick={() => setActiveTab("purchases")}
              className={`flex-1 py-3 px-4 text-center font-medium transition flex items-center justify-center gap-2 ${
                activeTab === "purchases" 
                  ? "text-pink-500 border-b-2 border-pink-500 bg-pink-50" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <FaShoppingBag /> Purchase History ({profileData.purchaseHistory.length})
            </button>
          </div>

          <div className="p-6">
            {/* Profile Info Tab */}
            {activeTab === "profile" && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Full Name</label>
                  <p className="text-lg font-medium">{profileData.user.name}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email Address</label>
                  <p className="text-lg font-medium">{profileData.user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Member Since</label>
                  <p className="text-lg font-medium">{new Date(profileData.user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            )}

            {/* Saved Items Tab */}
            {activeTab === "saved" && (
              <div>
                {profileData.savedItems.length === 0 ? (
                  <div className="text-center py-12">
                    <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No saved items yet</p>
                    <button 
                      onClick={() => navigate("/products")}
                      className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-lg"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profileData.savedItems.map((item) => (
                      <div key={item._id} className="flex gap-4 border rounded-lg p-4">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-pink-500 font-bold">${item.price}</p>
                          <p className="text-xs text-gray-400">Saved on: {new Date(item.savedAt).toLocaleDateString()}</p>
                        </div>
                        <button
                          onClick={() => handleRemoveSavedItem(item._id)}
                          className="self-start text-sm text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Purchase History Tab */}
            {activeTab === "purchases" && (
              <div>
                {profileData.purchaseHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No purchase history yet</p>
                    <button 
                      onClick={() => navigate("/products")}
                      className="mt-4 bg-pink-500 text-white px-4 py-2 rounded-lg"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profileData.purchaseHistory.map((purchase, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold">{purchase.productName}</h3>
                            <p className="text-sm text-gray-500">Quantity: {purchase.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-pink-500 font-bold">${purchase.totalAmount.toFixed(2)}</p>
                            <p className="text-xs text-gray-400">{new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs px-2 py-1 bg-green-100 text-green-600 rounded-full">
                            {purchase.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;