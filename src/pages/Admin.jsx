import React, { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import API_URL from "../config/api";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: ""
  });

  const [editingId, setEditingId] = useState(null);

useEffect(() => {
  const storedToken = localStorage.getItem("adminToken");
  const adminEmail = localStorage.getItem("adminEmail");
  
  // ✅ Check for the correct admin email
  if (storedToken && adminEmail === "eyeru@gmail.com") {
    setToken(storedToken);
    setIsAuthenticated(true);
    fetchProducts();
  } else {
    // Clear invalid admin data
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
  }
}, []);
  // ================= FETCH ALL PRODUCTS =================
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= ADD / UPDATE PRODUCT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Validate form
    if (!form.name || !form.price || !form.description || !form.image) {
      setMessage({ type: "error", text: "Please fill in all fields" });
      setLoading(false);
      return;
    }

    try {
      const productData = {
        name: form.name,
        price: parseFloat(form.price),
        description: form.description,
        image: form.image
      };

      let response;
      
      if (editingId) {
        // UPDATE existing product
        response = await fetch(`${API_URL}/api/products/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(productData)
        });
      } else {
        // ADD new product
        response = await fetch(`${API_URL}/api/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(productData)
        });
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to save product");
      }

      const savedProduct = await response.json();
      
      setMessage({ 
        type: "success", 
        text: editingId ? "✅ Product updated successfully!" : "✅ Product added successfully!" 
      });

      // Reset form
      setForm({ name: "", price: "", description: "", image: "" });
      setEditingId(null);
      
      // Refresh product list
      await fetchProducts();
      
      // Clear success message after 3 seconds
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);

    } catch (err) {
      console.error("Error saving product:", err);
      setMessage({ type: "error", text: err.message || "Failed to save product" });
    } finally {
      setLoading(false);
    }
  };

  // ================= EDIT PRODUCT =================
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image
    });
    setEditingId(product._id);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ================= DELETE PRODUCT =================
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setMessage({ type: "success", text: "✅ Product deleted successfully!" });
      await fetchProducts();
      
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch (err) {
      console.error("Error deleting product:", err);
      setMessage({ type: "error", text: "Failed to delete product" });
    }
  };

  // ================= LOGIN =================
  const handleLogin = (status) => {
    if (status) {
      const newToken = localStorage.getItem("adminToken");
      setToken(newToken);
      setIsAuthenticated(true);
      fetchProducts();
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    setIsAuthenticated(false);
    setToken(null);
    setProducts([]);
  };

  // ================= LOGIN SCREEN =================
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // ================= ADMIN DASHBOARD UI =================
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-500 text-sm mt-1">Manage all products (Add, Edit, Delete)</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>

        {/* MESSAGE DISPLAY */}
        {message.text && (
          <div className={`mb-4 p-3 rounded-lg ${
            message.type === "success" 
              ? "bg-green-100 text-green-700 border border-green-300" 
              : "bg-red-100 text-red-700 border border-red-300"
          }`}>
            {message.text}
          </div>
        )}

        {/* ADD/EDIT PRODUCT FORM */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-bold mb-4 text-pink-600">
            {editingId ? "✏️ Edit Product" : "➕ Add New Product"}
          </h2>
          
          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-pink-500"
              required
            />

            <input
              name="price"
              type="number"
              step="0.01"
              placeholder="Price ($)"
              value={form.price}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-pink-500"
              required
            />

            <textarea
              name="description"
              placeholder="Product Description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-pink-500"
              required
            />

            <input
              name="image"
              placeholder="Image URL"
              value={form.image}
              onChange={handleChange}
              className="border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-pink-500"
              required
            />

            {/* Image Preview */}
            {form.image && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                <img 
                  src={form.image} 
                  alt="Preview" 
                  className="h-32 w-32 object-cover rounded border"
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=Invalid+URL";
                  }}
                />
              </div>
            )}

            <div className="flex gap-3">
              <button 
                type="submit" 
                disabled={loading}
                className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
              >
                {loading ? "Saving..." : (editingId ? "Update Product" : "Add Product")}
              </button>
              
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ name: "", price: "", description: "", image: "" });
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* PRODUCTS LIST */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            All Products ({products.length})
          </h2>
          
          {products.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No products yet. Add your first product above!</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product._id} className="border rounded-lg p-4 hover:shadow-lg transition">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg mb-3"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                  <h3 className="font-bold text-lg">{product.name}</h3>
                  <p className="text-pink-500 font-bold text-xl">${product.price}</p>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
                  
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Admin;