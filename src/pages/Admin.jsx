import React, { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import API_URL from "./config/api";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: ""
  });

  const [editingId, setEditingId] = useState(null);

  // ================= LOAD TOKEN =================
  useEffect(() => {
    const storedToken = localStorage.getItem("adminToken");
    if (storedToken) {
      setToken(storedToken);
      setIsAuthenticated(true);
      fetchProducts();
    }
  }, []);

  // ================= FETCH PRODUCTS =================
  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= HANDLE INPUT =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= ADD / UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await fetch(`${API_URL}/api/products/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(form)
        });
      } else {
        await fetch(`${API_URL}/api/products`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(form)
        });
      }

      setForm({ name: "", price: "", description: "", image: "" });
      setEditingId(null);
      fetchProducts();

    } catch (err) {
      console.error(err);
    }
  };

  // ================= EDIT =================
  const handleEdit = (product) => {
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      image: product.image
    });
    setEditingId(product._id);
  };

  // ================= DELETE =================
  const deleteProduct = async (id) => {
    try {
      await fetch(`${API_URL}/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= LOGIN =================
  const handleLogin = (status) => {
    setIsAuthenticated(status);
    if (status) {
      const newToken = localStorage.getItem("adminToken");
      setToken(newToken);
      fetchProducts();
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    setToken(null);
    setProducts([]);
  };

  // ================= LOGIN SCREEN =================
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded shadow">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>

        {/* ================= FORM ================= */}
        <form onSubmit={handleSubmit} className="grid gap-3 mb-8">
          <input
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            name="price"
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <input
            name="image"
            placeholder="Image URL"
            value={form.image}
            onChange={handleChange}
            className="border p-2 rounded"
            required
          />

          <button className="bg-blue-500 text-white py-2 rounded">
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </form>

        {/* ================= PRODUCTS LIST ================= */}
        <div className="grid md:grid-cols-2 gap-4">
          {products.map((p) => (
            <div key={p._id} className="border p-4 rounded shadow">

              <img
                src={p.image}
                alt={p.name}
                className="w-full h-40 object-cover rounded mb-2"
              />

              <h2 className="font-bold">{p.name}</h2>
              <p>${p.price}</p>
              <p className="text-sm text-gray-500">{p.description}</p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteProduct(p._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Admin;