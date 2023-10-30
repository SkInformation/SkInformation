"use client"

import {createContext, useContext} from "react";
interface SurveyContextType {
    currentStep: number;
    stepConfig: StepConfig[];
}

interface StepConfig {
    hideBackButton: boolean;
    backButtonText?: string;
    hideNextButton: boolean;
    nextButtonText?: string;
}
const stepConfig: StepConfig[] = [
    {
        hideBackButton: true,
        hideNextButton: false,
    },
    {
        hideBackButton: false,
        hideNextButton: false,
    },
    {
        hideBackButton: false,
        hideNextButton: false,
        nextButtonText: 'Complete',
    },
    {
        hideBackButton: false,
        hideNextButton: true,
    }
]

const SurveyContext = createContext<SurveyContextType | null>(null);

const useSurvey = (): SurveyContextType => {
    const context = useContext(SurveyContext);
    if (!context) {
        throw new Error('useSurvey must be used within a SurveyProvider');
    }
    return context;
};

interface SurveyProviderProps {
    children: React.ReactNode;
}

const SurveyProvider: React.FC<SurveyProviderProps> = ({ children }) => {
    const initialContextValue: SurveyContextType = {
        currentStep: 1,
        stepConfig: stepConfig,
    };

    return (
        <SurveyContext.Provider value={initialContextValue}>
            {children}
        </SurveyContext.Provider>
    );
};

export { SurveyProvider, useSurvey };