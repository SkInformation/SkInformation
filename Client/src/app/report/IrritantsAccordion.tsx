import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import {ExpandMore} from '@mui/icons-material';
import {Ingredient, IrritantAnalysis, PotentialIrritant} from "./[id]/page";

export default function IrritantsAccordion(analysis: IrritantAnalysis) {
    return (
        <div>
            <h1>{analysis.product.name}</h1>
            <p>{analysis.product.description}</p>
            <br/>
            {analysis.potentialIrritants.map((pi: PotentialIrritant) => (
                <div key={pi.type}>
                    <h3>{pi.type}</h3>
                    {pi.ingredients.map((i: Ingredient) => (
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
                    ))}
                </div>
            ))}
        </div>
    );
}