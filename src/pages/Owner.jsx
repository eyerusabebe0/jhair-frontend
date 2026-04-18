import React, { useState, useEffect } from "react";
import API_URL from "../config/api";

function Owner() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formErrors, setFormErrors] = useState({});
  
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: ""
  });

  const token = localStorage.getItem("token");

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all products (for owner to see their products)
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Validation function
  const validateForm = () => {
    const errors = {};

    // Name validation
    if (!form.name.trim()) {
      errors.name = "Product name is required";
    } else if (form.name.length < 3) {
      errors.name = "Product name must be at least 3 characters";
    } else if (form.name.length > 100) {
      errors.name = "Product name must be less than 100 characters";
    }

    // Price validation
    if (!form.price) {
      errors.price = "Price is required";
    } else if (isNaN(form.price)) {
      errors.price = "Price must be a number";
    } else if (Number(form.price) <= 0) {
      errors.price = "Price must be greater than 0";
    } else if (Number(form.price) > 999999) {
      errors.price = "Price is too high";
    }

    // Description validation
    if (!form.description.trim()) {
      errors.description = "Description is required";
    } else if (form.description.length < 10) {
      errors.description = "Description must be at least 10 characters";
    } else if (form.description.length > 500) {
      errors.description = "Description must be less than 500 characters";
    }

    // Image URL validation
    if (!form.image.trim()) {
      errors.image = "Image URL is required";
    } else {
      // Check if it's a valid URL
      const urlPattern = /^(https?:\/\/|www\.)[^\s]+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;
      if (!urlPattern.test(form.image) && !form.image.includes('pinimg.com') && !form.image.includes('cloudinary')) {
        errors.image = "Please enter a valid image URL (jpg, png, gif, webp)";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous messages
    setError("");
    setSuccess("");
    
    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare product data with numeric price
      const productData = {
        name: form.name.trim(),
        price: Number(form.price),
        description: form.description.trim(),
        image: form.image.trim()
      };

      const response = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to add product");
      }

      // Success!
      setSuccess("✅ Product added successfully!");
      
      // Reset form
      setForm({
        name: "",
        price: "",
        description: "",
        image: ""
      });
      
      // Refresh product list immediately
      await fetchProducts();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error("Error adding product:", err);
      setError(err.message || "Something went wrong. Please try again.");
      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Handle delete product
  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      // Refresh product list
      await fetchProducts();
      setSuccess("✅ Product deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error("Error deleting product:", err);
      setError("Failed to delete product");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Owner Dashboard</h1>
          <p className="text-gray-500">Manage your products - they will appear on Home and Products pages instantly</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Add Product Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-pink-600">Add New Product</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g., Premium Brazilian Hair"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  formErrors.name ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.name && (
                <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
              )}
            </div>

            {/* Price Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="e.g., 99.99"
                step="0.01"
                min="0.01"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  formErrors.price ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.price && (
                <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the product details..."
                rows="3"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  formErrors.description ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>
              )}
              <p className="text-gray-400 text-xs mt-1">
                {form.description.length}/500 characters
              </p>
            </div>

            {/* Image URL Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL *
              </label>
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent ${
                  formErrors.image ? "border-red-500" : "border-gray-300"
                }`}
              />
              {formErrors.image && (
                <p className="text-red-500 text-sm mt-1">{formErrors.image}</p>
              )}
              {/* Image Preview */}
              {form.image && !formErrors.image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Preview:</p>
                  <img 
                    src={form.image} 
                    alt="Preview" 
                    className="h-20 w-20 object-cover rounded border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.parentElement.innerHTML += '<p class="text-red-500 text-xs">Invalid image URL</p>';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding Product..." : "Add Product"}
            </button>
          </form>
        </div>

        {/* Products List */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Your Products ({products.length})
          </h2>
          
          {products.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500">No products yet. Add your first product above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                    }}
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
                    <p className="text-pink-500 font-bold text-xl mb-2">${product.price}</p>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{product.description}</p>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg transition duration-200"
                    >
                      Delete Product
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
}

export default Owner;