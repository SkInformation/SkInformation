import {Stack} from "@mui/material"
import {Product} from "@/app/shared/types";
import ProductsDisplay from "./ProductsDisplay";
import styles from '../page.module.css';

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
                    <h2 className={styles.title_text}>Cleanser</h2>
                    <ProductsDisplay products={prodRecs.CLEANSER}/>
                </Stack>
            }
            {prodRecs.MOISTURIZER &&
                <Stack aria-label="Moisturizer Stack">
                    <h2 className={styles.title_text}>Moisturizer</h2>
                    <ProductsDisplay products={prodRecs.MOISTURIZER}/>
                </Stack>
            }
            {prodRecs.SERUM &&
                <Stack aria-label="Serum Stack">
                    <h2 className={styles.title_text}>Serum</h2>
                    <ProductsDisplay products={prodRecs.SERUM}/>
                </Stack>
            }
            {prodRecs.SUNSCREEN &&
                <Stack aria-label="Sunscreen Stack">
                    <h2 className={styles.title_text}>Sunscreen</h2>
                    <ProductsDisplay products={prodRecs.SUNSCREEN}/>
                </Stack>
            }
        </Stack>
    );
};

export default ProductRecommendationDisplay;