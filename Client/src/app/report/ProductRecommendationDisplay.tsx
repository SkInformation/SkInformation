import ProductsDisplay from "./ProductsDisplay";
import {ProductRecommendation, Product} from "./[id]/page";

interface ProductRecommendationDisplayProps {
    prodRecs: ProductRecommendation;
  }
  
  const ProductRecommendationDisplay: React.FC<ProductRecommendationDisplayProps> = ({ prodRecs }) => {
    return (
      <div>
        {prodRecs.CLEANSER &&
          <div>
            <h2>Cleanser</h2>
            <ProductsDisplay products={prodRecs.CLEANSER}/>
          </div>
        }
        {prodRecs.MOISTURIZER &&
          <div>
            <h2>Moisturizer</h2>
            <ProductsDisplay products={prodRecs.MOISTURIZER}/>
          </div>
        }
        {prodRecs.SERUM &&
          <div>
            <h2>Serum</h2>
            <ProductsDisplay products={prodRecs.SERUM}/>
          </div>
        }
        {prodRecs.SUNSCREEN &&
          <div>
            <h2>Sunscreen</h2>
            <ProductsDisplay products={prodRecs.SUNSCREEN}/>
          </div>
        }
      </div>
    );
  };
  
  export default ProductRecommendationDisplay;