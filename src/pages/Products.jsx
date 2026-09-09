import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import API_URL from "../config/api";

function Products() {
  const [products, setProducts] = useState([]);

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
    <div className="p-4 md:p-6">
      <h2 className="text-xl md:text-2xl font-bold !my-6 md:!my-16 !text-pink-500 text-center md:text-left">
        All Products
      </h2>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-6">
        {products.length > 0 ? (
          products.map((product, index) => (
            <ProductCard key={product._id} product={product} animationDelay={index * 100} />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">No products found</p>
        )}
      </div>
    </div>
  );
}

export default Products;