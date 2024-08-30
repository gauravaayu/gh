import React, { useState, useEffect, useCallback, useRef } from "react";
import "../App.css";
import Loader from "./Loader";

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

interface ProductListProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products = [],
  onProductClick,
}) => {
  const [visibleProducts, setVisibleProducts] = useState<Product[]>([]);
  const [itemsToShow, setItemsToShow] = useState(10);
  const [loading, setLoading] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (Array.isArray(products)) {
      // Initialize visibleProducts with the first batch of products
      setVisibleProducts(products.slice(0, itemsToShow));
    }
  }, [products, itemsToShow]);

  const loadMoreProducts = useCallback(() => {
    if (itemsToShow < products.length) {
      setLoading(true);
      setTimeout(() => {
        // Simulate network delay
        setVisibleProducts(products.slice(0, itemsToShow + 10));
        setItemsToShow((prevItems) => prevItems + 10);
        setLoading(false);
      }, 1000); // Adjust this value to simulate loading time
    }
  }, [itemsToShow, products]);

  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;

        // Check if user has scrolled near the bottom of the container
        if (scrollTop > lastScrollTop) {
          // Scrolling down
          if (scrollHeight - scrollTop <= clientHeight + 100 && !loading) {
            loadMoreProducts();
          }
        }
        setLastScrollTop(scrollTop); // Update last scroll position
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [loadMoreProducts, loading, lastScrollTop]);

  return (
    <div className="sidebar" ref={containerRef}>
      {visibleProducts.map((product) => (
        <div
          className="card"
          key={product.id}
          onClick={() => onProductClick(product)}
        >
          <div className="imgphoto">
            <img src={product.image} alt={product.title} />
            <p>
              <span className="starcolor">&#9734;</span>
              {product.rating.rate} ({product.rating.count})
            </p>
          </div>
          <div className="content">
            <div className="contentpra">
              <h2>{product.category}</h2>
              <h3>{product.title.substring(0, 20)}...</h3>
              <p>{product.description.substring(0, 35)}...</p>
              <h1>${product.price}</h1>
            </div>
          </div>
        </div>
      ))}
      {loading && <Loader />} {/* Show loader when loading */}
    </div>
  );
};

export default ProductList;
