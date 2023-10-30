"use client"

import React, {useEffect} from 'react';
import Box from "@mui/material/Box";
import {Step} from "@/app/survey/components/Step";
import Grid from "@mui/material/Unstable_Grid2";
import {Button, Typography} from "@mui/material";
import { useSurvey } from "@/app/context/SurveyContext";

export default function Survey() {
    const { currentStep, stepConfig } = useSurvey();

    let hideBackButton = false
    let hideNextButton = false
    let backButtonText, nextButtonText
    useEffect(() => {
        const step = stepConfig[currentStep];
        if (step) {
            hideBackButton = step.hideBackButton;
            hideNextButton = step.hideNextButton;
            backButtonText = step.backButtonText;
            nextButtonText = step.nextButtonText;
        }
    }, [currentStep])

    return (
        <>
            <Box maxWidth="lg" width={100}>
                <Step hidden={ currentStep !== 1 }>Step1</Step>
                <Step hidden={ currentStep !== 2 }>Step2</Step>
                <Step hidden={ currentStep !== 3 }>Step3</Step>
                <Step hidden={ currentStep !== 4 }>Step4</Step>
            </Box>
            <Grid container columns={2}>
                <Grid display="flex" justifyContent="left">
                    <Button hidden={hideBackButton} >
                        <Typography>
                            {backButtonText ?? 'Back'}
                        </Typography>
                    </Button>
                </Grid>
                <Grid display="flex" justifyContent="right">
                    <Button hidden={hideNextButton} >
                        <Typography>
                            {nextButtonText ?? 'Next'}
                        </Typography>
                    </Button>
                </Grid>
            </Grid>
        </>
    )
}
