import ProductsDisplay from "./ProductsDisplay";
import {ProductRecommendation} from "./[id]/page";
import {Stack} from "@mui/material"

interface ProductRecommendationDisplayProps {
    prodRecs: ProductRecommendation;
  }
  
  const ProductRecommendationDisplay: React.FC<ProductRecommendationDisplayProps> = ({ prodRecs }) => {
    return (
      <Stack spacing={2}>
        {prodRecs.CLEANSER &&
          <Stack>
            <h2>Cleanser</h2>
            <ProductsDisplay products={prodRecs.CLEANSER}/>
          </Stack>
        }
        {prodRecs.MOISTURIZER &&
          <Stack>
            <h2>Moisturizer</h2>
            <ProductsDisplay products={prodRecs.MOISTURIZER}/>
          </Stack>
        }
        {prodRecs.SERUM &&
          <Stack>
            <h2>Serum</h2>
            <ProductsDisplay products={prodRecs.SERUM}/>
          </Stack>
        }
        {prodRecs.SUNSCREEN &&
          <Stack>
            <h2>Sunscreen</h2>
            <ProductsDisplay products={prodRecs.SUNSCREEN}/>
          </Stack>
        }
      </Stack>
    );
  };
  
  export default ProductRecommendationDisplay;