import React from "react";
import "../App.css";

interface Rating {
  rate: number;
  count: number;
}

interface Product {
  id: number;
  image: string;
  title: string;
  category: string;
  description: string;
  rating: Rating;
  price: number;
}

interface ProductDetailProps {
  product: Product | null;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  // If no product is selected, display a placeholder message
  if (!product) {
    return (
      <div className="rightsidecontent">
        <h3>Display content</h3>
        <h1>Select an item to display</h1>
        <p>Select an item to see more details.</p>
      </div>
    );
  }

  // Define the maximum number of stars for rating
  const maxStars = 5;
  // Calculate the number of filled stars based on the product rating
  const filledStars = Math.round(product.rating.rate);
  // Calculate the number of empty stars
  const emptyStars = maxStars - filledStars;

  return (
    <div className="rightsidebarImage">
      <div className="detailImg">
        <img src={product.image} alt={product.title} />
      </div>
      <div className="rightSideImageContent">
        <h3>{product.category}</h3>
        <h1>{product.title}</h1>
        <p>{product.description}</p>

        <div className="star">
          <div>
            {/* Render filled stars */}
            {Array(filledStars)
              .fill(null)
              .map((_, index) => (
                <span key={index} className="starcolor">
                  &#9733; {/* Unicode star character for filled star */}
                </span>
              ))}
            {/* Render empty stars */}
            {Array(emptyStars)
              .fill(null)
              .map((_, index) => (
                <span key={index} className="starcolor">
                  &#9734; {/* Unicode star character for empty star */}
                </span>
              ))}
          </div>
          <div className="rating">
            <strong>{product.rating.rate}</strong> {product.rating.count}{" "}
            reviews
          </div>
        </div>

        <div className="price">
          <strong>
            <h1>${product.price}</h1>
          </strong>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
