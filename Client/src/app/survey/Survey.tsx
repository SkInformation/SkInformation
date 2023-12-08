"use client"

import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import {Step} from "@/app/survey/components/Step";
import Grid from "@mui/material/Unstable_Grid2";
import {Button, Card, Typography} from "@mui/material";
import {SurveyStep, useSurvey} from "@/app/context/SurveyContext";
import SkinGoals from "@/app/survey/components/steps/SkinGoals";
import SkinType from "@/app/survey/components/steps/SkinType";
import styles from "@/app/survey/page.module.css";
import Products from "@/app/survey/components/steps/Products";
import Summary from "@/app/survey/components/steps/Summary";

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
    }, [currentStep, stepConfig])

    return (
        <>
            <Card className={`${styles.survey_card}`}>
                <Box maxWidth="lg" width={"100%"}>
                    <Step hidden={currentStep !== SurveyStep.SkinType} title={stepConfig[SurveyStep.SkinType].title}>
                        <SkinType/>
                    </Step>
                    <Step hidden={currentStep !== SurveyStep.SkinGoals} title={stepConfig[SurveyStep.SkinGoals].title}>
                        <SkinGoals/>
                    </Step>
                    <Step hidden={currentStep !== SurveyStep.Products} title={stepConfig[SurveyStep.Products].title}>
                        <Products/>
                    </Step>
                    <Step hidden={currentStep !== SurveyStep.Summary} title={stepConfig[SurveyStep.Summary].title}>
                        <Summary/>
                    </Step>
                </Box>
                <Grid container columns={2} className={styles.navigation_container}>
                    <Grid xs display="flex" justifyContent="left" alignItems="left">
                        {
                            hideBackButton ?
                                <></> :
                                <Button variant={"contained"} onClick={navigateBackward}
                                        className={styles.navigation_button}>
                                    <Typography>
                                        {backButtonText || 'Back'}
                                    </Typography>
                                </Button>
                        }
                    </Grid>
                    <Grid xs display="flex" justifyContent="right" alignItems="right">
                        {hideNextButton ?
                            <></> :
                            <Button variant={"contained"} onClick={navigateForward}
                                    className={styles.navigation_button}>
                                <Typography>
                                    {nextButtonText || 'Next'}
                                </Typography>
                            </Button>
                        }
                    </Grid>
                </Grid>
            </Card>
        </>
    )
}
