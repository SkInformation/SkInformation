import apiRequest, {HttpMethod} from "@/app/lib/api";
import IrritantsAccordion from "../IrritantsAccordion";
import ProductRecommendationDisplay from "../ProductRecommendationDisplay";
import {Stack} from "@mui/material";

interface ReportProps {
    params: {
        id: number
    }
}

// Data models for request

export interface ReportDetails {
    productRecommendations: ProductRecommendation;
    irritantAnalysis: IrritantAnalysis[];
}

export interface ProductRecommendation {
    MOISTURIZER?: Product[];
    SERUM?: Product[];
    CLEANSER?: Product[];
    SUNSCREEN?: Product[];
}

export interface Product {
    id: number
    name: string;
    description: string;
    type: string;
    url: string;
}

export interface PotentialIrritant {
    type: string;
    ingredients: [Ingredient];
}

export interface Ingredient {
    id: number
    name: string;
    usage: string;
}

export interface IrritantAnalysis {
    product: Product;
    potentialIrritants: [PotentialIrritant];
}

export default async function Report({params}: ReportProps) {
    const analysis = await apiRequest<ReportDetails>(HttpMethod.GET, `https://api.skinformation.site/Report/Details`, { reportId: params.id }, undefined, {}, (err) => {
        console.error(err.message)
    });

    return (
        <Stack spacing={2} marginBottom={5}>
            <h1>Recommendations</h1>
            <ProductRecommendationDisplay prodRecs={analysis.productRecommendations}/>
            <br/>
            <h1>Irritants</h1>
            {analysis.irritantAnalysis.map((ia: IrritantAnalysis) => (
                <IrritantsAccordion key={ia.product.id} product={ia.product} potentialIrritants={ia.potentialIrritants}/>
            ))}
        </Stack>
    );
}