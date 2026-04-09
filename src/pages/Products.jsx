import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import API_URL from "./config/api";

function Products() {
  const [products, setProducts] = useState([]);

  // Fetch products from backend
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
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold !m-16 !text-pink-500">All Products</h2>

      <div className="grid md:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map((product, index) => (
            <ProductCard key={product._id} product={product} animationDelay={index * 100} />
          ))
        ) : (
          <p>No products found</p>
        )}
      </div>
    </div>
  );
}

export default Products;