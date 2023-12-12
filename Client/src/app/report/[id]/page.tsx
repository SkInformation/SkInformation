import apiRequest, {HttpMethod} from "@/app/lib/api";
import IrritantsAccordion, {IrritantAnalysis} from "./components/IrritantsAccordion";
import ProductRecommendationDisplay, {ProductRecommendation} from "./components/ProductRecommendationDisplay";
import {Stack, Typography} from "@mui/material";
import styles from '@/app/survey/page.module.css';

interface ReportProps {
    params: {
        id: number
    }
}
export interface ReportDetails {
    productRecommendations: ProductRecommendation;
    irritantAnalysis: IrritantAnalysis[];
}

export default async function Report({params}: ReportProps) {
    const analysis = await apiRequest<ReportDetails>(HttpMethod.GET, `https://api.skinformation.site/Report/Details`, { reportId: params.id }, undefined, {}, (err) => {
        console.error(err.message)
    });

    return (
        <Stack spacing={2} marginBottom={5}>
            <h1 className={styles.titleText}>Recommendations</h1>
            <ProductRecommendationDisplay prodRecs={analysis.productRecommendations}/>
            <br/>
            <h1 className={styles.titleText}>Irritants</h1>
            {analysis.irritantAnalysis.map((ia: IrritantAnalysis) => (
                <IrritantsAccordion key={ia.product.id} product={ia.product} potentialIrritants={ia.potentialIrritants}/>
            ))}
        </Stack>
    );
}