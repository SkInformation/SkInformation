import apiRequest, {HttpMethod} from "@/app/lib/api";
import IrritantsAccordion from "../IrritantsAccordion";

interface ReportProps {
    params: {
        id: number
    }
}

// Data models for request

export interface ReportDetails {
    irritantAnalysis: IrritantAnalysis[];
}

interface Product {
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
    const analysis = await apiRequest<ReportDetails>(HttpMethod.GET, `http://localhost:5100/Report/Details`, { reportId: params.id }, undefined, {}, (err) => {
        console.error(err.message)
    });

    return (
        <>
        {analysis.irritantAnalysis.map((ia: IrritantAnalysis) => (
            <IrritantsAccordion key={ia.product.id} product={ia.product} potentialIrritants={ia.potentialIrritants}/>
        ))}
        </>
    );
}