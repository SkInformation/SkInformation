"use client"

import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import {Step} from "@/app/survey/components/Step";
import Grid from "@mui/material/Unstable_Grid2";
import {Button, Typography} from "@mui/material";
import {SurveyStep, useSurvey} from "@/app/context/SurveyContext";
import SkinGoals from "@/app/survey/components/steps/SkinGoals";
import Products from "@/app/survey/components/steps/Products";

export default function Survey() {
    const {currentStep, stepConfig, navigateBackward, navigateForward} = useSurvey();

    const [hideBackButton, setHideBackButton] = useState(false);
    const [hideNextButton, setHideNextButton] = useState(false);
    const [backButtonText, setBackButtonText] = useState('');
    const [nextButtonText, setNextButtonText] = useState('');

    useEffect(() => {
        const step = stepConfig[currentStep];

        if (step) {
            setHideBackButton(step.hideBackButton);
            setHideNextButton(step.hideNextButton);
            setBackButtonText(step.backButtonText ?? '');
            setNextButtonText(step.nextButtonText ?? '');
        }
    }, [currentStep])

    return (
        <>
            <Box maxWidth="lg" width={"100%"}>
                <Step hidden={currentStep !== SurveyStep.SkinType}
                      title={stepConfig[SurveyStep.SkinType].title}>Step1</Step>
                <Step hidden={currentStep !== SurveyStep.SkinGoals} title={stepConfig[SurveyStep.SkinGoals].title}>
                    <SkinGoals/>
                </Step>
                <Step hidden={currentStep !== SurveyStep.Products} title={stepConfig[SurveyStep.Products].title}>
                    <Products/>
                </Step>
                <Step hidden={currentStep !== SurveyStep.Summary}
                      title={stepConfig[SurveyStep.Summary].title}>Step4</Step>
            </Box>
            <Grid container columns={2} width={"100%"}>
                <Grid xs display="flex" justifyContent="left" alignItems="left">
                    {
                        hideBackButton ?
                            <></> :
                            <Button variant={"contained"} onClick={navigateBackward}>
                                <Typography>
                                    {backButtonText || 'Back'}
                                </Typography>
                            </Button>
                    }
                </Grid>
                <Grid xs display="flex" justifyContent="right" alignItems="right">
                    {hideNextButton ?
                        <></> :
                        <Button variant={"contained"} onClick={navigateForward}>
                            <Typography>
                                {nextButtonText || 'Next'}
                            </Typography>
                        </Button>
                    }
                </Grid>
            </Grid>
        </>
    )
}
