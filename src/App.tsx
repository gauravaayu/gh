import "./App.css";
import React, { useState, lazy, Suspense, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import Loader from "./components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

// Lazy load components for performance optimization
const ProductDetail = lazy(() => import("./components/ProductDetail"));
const ProductList = lazy(() => import("./components/ProductList"));

// Define TypeScript interface for Product data structure
interface Product {
  id: number;
  title: string;
  image: string;
  category: string;
  description: string;
  price: number;
  rating: {
    rate: number;
    count: number;
  };
}

// Function to fetch products from the API
const fetchProducts = async () => {
  const response = await axios.get("https://fakestoreapi.com/products");
  if (!response) {
    throw new Error("Network response was not ok");
  }
  return response.data;
};

function App() {
  // State to manage the selected product for detail view
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  // State to determine if the view is on a mobile device
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // React Query hook for fetching product data
  const {
    data: products = [], // Default to an empty array if no data
    isLoading,
    isError,
  } = useQuery("products", fetchProducts, {
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false, // Disable refetching on window focus
  });

  // Handler to update the selected product state
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  // Handler to reset the selected product (used for back navigation)
  const handleBackClick = () => {
    setSelectedProduct(null);
  };

  // Effect to update the isMobile state based on window size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Conditional rendering based on loading and error states
  if (isLoading) return <Loader />;
  if (isError) return <div>"Network Error "</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>{selectedProduct ? "Detail View" : "Master View"}</h1>
      </header>
      <div className="Container">
        {/* Render ProductList component with lazy loading */}
        <Suspense fallback={<Loader />}>
          <ProductList
            products={products}
            onProductClick={handleProductClick}
          />
        </Suspense>

        {/* Render ProductDetail component conditionally for non-mobile view */}
        <Suspense fallback={<Loader />}>
          {!isMobile && (
            <div className="rightside">
              <ProductDetail product={selectedProduct} />
            </div>
          )}
        </Suspense>

        {/* Render ProductDetail component for mobile view with back button */}
        <Suspense fallback={<Loader />}>
          {isMobile && selectedProduct && (
            <div className="rightside-mobile">
              <button onClick={handleBackClick} className="back-arrow">
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <ProductDetail product={selectedProduct} />
            </div>
          )}
        </Suspense>
      </div>
    </div>
  );
}

export default App;
