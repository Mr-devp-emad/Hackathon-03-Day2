"use client"
import React, { useEffect, useState } from "react";
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

// Sanity Client Setup
const sanity = createClient({
  projectId: "cort95rk",
  dataset: "production",
  apiVersion: "2025-01-13",
  useCdn: true,
});

// Create image URL builder instance
const builder = imageUrlBuilder(sanity);

// Function to get the full image URL
const urlFor = (source: any) => builder.image(source);

interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  discountPercentage: number;
  productImage: {
    asset: {
      _ref: string;
    };
  };
  tags: string[];
  isNew: boolean;
}

export const ProductCards: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);

  const fetchProducts = async () => {
    try {
      const query = `
        *[_type == "product"] {
          _id,
          title,
          price,
          description,
          discountPercentage,
          productImage,
          tags
        }
      `;
      const data = await sanity.fetch(query);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const addToCart = (product: Product) => {
    setCart((prevCart) => [...prevCart, product]);
    alert(`${product.title} added to cart`);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Products</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white shadow-md rounded-md p-4 hover:shadow-lg transition-shadow duration-300"
          >
            {/* Use the URL builder to generate the image URL */}
            {product.productImage?.asset?._ref && (
              <img
                src={urlFor(product.productImage).url()}
                alt={product.title}
                className="w-full h-48 rounded-md object-cover"
              />
            )}
            <div>
              <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-800">{product.title}</h2>
                <p className="text-sm text-gray-600">{product.description}</p>
                <div className="flex justify-between items-center mt-2">
                  <div>
                    <p className="text-slate-600 font-bold">${product.price.toFixed(2)}</p>
                    {product.discountPercentage > 0 && (
                      <p className="text-green-500 font-bold">
                        {product.discountPercentage}% OFF
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Add to cart button */}
              <button
                onClick={() => addToCart(product)}
                className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cart summary placed outside the product list */}
      <div className="mt-8 bg-gray-100 p-4 rounded-md">
        <h3 className="text-lg font-semibold text-gray-800">Cart Summary</h3>
        <div className="mt-2">
          <p className="text-gray-600">Total Items: {cart.length}</p>
          <p className="text-gray-600">
            Total Price: ${cart.reduce((total, product) => total + product.price, 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};
