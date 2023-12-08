import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import {ExpandMore} from '@mui/icons-material';
import {Ingredient, Product} from "@/app/shared/types";

export interface IrritantAnalysis {
    product: Product;
    potentialIrritants: [PotentialIrritant];
}

export interface PotentialIrritant {
    type: string;
    ingredients: [Ingredient];
}
export default function IrritantsAccordion(analysis: IrritantAnalysis) {
    return (
        <div>
            <h2>{analysis.product.name}</h2>
            <p>{analysis.product.description}</p>
            <br/>
            {analysis.potentialIrritants.map((pi: PotentialIrritant) => (
                <div key={pi.type}>
                    <h3>{pi.type}</h3>
                    {pi.ingredients.length > 0 ? pi.ingredients.map((i: Ingredient) => (
                        <Accordion key={i.id}>
                            <AccordionSummary
                                expandIcon={<ExpandMore/>}
                                aria-controls={`panel-${i.id}-content`}
                                id= {`panel-${i.id}-header`}>
                                <Typography>{i.name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    {i.usage}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    )) : <p>No ingredients were found to cause {pi.type}.</p>}
                </div>
            ))}
        </div>
    );
}