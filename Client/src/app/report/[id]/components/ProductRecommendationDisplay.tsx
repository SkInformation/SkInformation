import {Stack} from "@mui/material"
import {Product} from "@/app/shared/types";
import ProductsDisplay from "./ProductsDisplay";

interface ProductRecommendationDisplayProps {
    prodRecs: ProductRecommendation;
}

export interface ProductRecommendation {
    MOISTURIZER?: Product[];
    SERUM?: Product[];
    CLEANSER?: Product[];
    SUNSCREEN?: Product[];
}

const ProductRecommendationDisplay: React.FC<ProductRecommendationDisplayProps> = ({prodRecs}) => {
    return (
        <Stack spacing={2} aria-label="Product Recommendations Stack">
            {prodRecs.CLEANSER &&
                <Stack aria-label="Cleanser Stack">
                    <h2>Cleanser</h2>
                    <ProductsDisplay products={prodRecs.CLEANSER}/>
                </Stack>
            }
            {prodRecs.MOISTURIZER &&
                <Stack aria-label="Moisturizer Stack">
                    <h2>Moisturizer</h2>
                    <ProductsDisplay products={prodRecs.MOISTURIZER}/>
                </Stack>
            }
            {prodRecs.SERUM &&
                <Stack aria-label="Serum Stack">
                    <h2>Serum</h2>
                    <ProductsDisplay products={prodRecs.SERUM}/>
                </Stack>
            }
            {prodRecs.SUNSCREEN &&
                <Stack aria-label="Sunscreen Stack">
                    <h2>Sunscreen</h2>
                    <ProductsDisplay products={prodRecs.SUNSCREEN}/>
                </Stack>
            }
        </Stack>
    );
};

export default ProductRecommendationDisplay;