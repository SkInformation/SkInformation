import apiRequest, {HttpMethod} from "@/app/lib/api";
import IrritantsAccordion, {IrritantAnalysis} from "./components/IrritantsAccordion";
import ProductRecommendationDisplay, {ProductRecommendation} from "./components/ProductRecommendationDisplay";
import {Card, Stack} from "@mui/material";
import styles from './page.module.css';

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
    const analysis = await apiRequest<ReportDetails>(HttpMethod.GET, `/Report/Details`, {reportId: params.id}, undefined, {}, (err) => {
        console.error(err.message)
    });

    return (
        <>
            <Card className={`${styles.report_card} ${styles.main}`}>
                <Stack spacing={2} marginBottom={5}>
                    <h1 className={styles.title_text}>Recommendations</h1>
                    <ProductRecommendationDisplay prodRecs={analysis.productRecommendations}/>
                    <br/>
                    <h1 className={styles.title_text}>Irritants</h1>
                    {analysis.irritantAnalysis.map((ia: IrritantAnalysis) => (
                        <IrritantsAccordion key={ia.product.id} product={ia.product} potentialIrritants={ia.potentialIrritants}/>
                    ))}
                </Stack>
            </Card>
        </>
    );
}