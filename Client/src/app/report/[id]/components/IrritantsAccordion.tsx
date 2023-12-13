import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import {ExpandMore} from '@mui/icons-material';
import {Ingredient, Product} from "@/app/shared/types";
import styles from "@/app/survey/page.module.css";

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
            <h2 className={styles.titleText}>{analysis.product.name}</h2>
            <p className={styles.titleText}>{analysis.product.description}</p>
            <br/>
            {analysis.potentialIrritants.map((pi: PotentialIrritant) => (
                <div key={pi.type}>
                    <h3 className={styles.titleText}>{pi.type}</h3>
                    {pi.ingredients.length > 0 ? pi.ingredients.map((i: Ingredient) => (
                        <Accordion key={i.id}>
                            <AccordionSummary
                                expandIcon={<ExpandMore/>}
                                aria-controls={`panel-${i.id}-content`}
                                id={`panel-${i.id}-header`}
                                aria-label={i.name}>
                                <Typography>{i.name}</Typography>
                            </AccordionSummary>
                            <AccordionDetails aria-label={`Details about ${i.name}`}>
                                <Typography>
                                    {i.usage}
                                </Typography>
                            </AccordionDetails>
                        </Accordion>
                    )) :
                        <p aria-label={`No irritants for ${pi.type}`}
                           className={styles.titleText}>No ingredients were found to cause {pi.type}.</p>}
                </div>
            ))}
        </div>
    );
}