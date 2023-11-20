"use client"

import {createContext, Dispatch, SetStateAction, useContext, useEffect, useState} from "react";

export enum SurveyStep {
    SkinType, SkinGoals, Products, Summary
}

interface StepConfig {
    title: string;
    hideBackButton: boolean;
    backButtonText?: string;
    hideNextButton: boolean;
    nextButtonText?: string;
}
const stepConfig: StepConfig[] = [
    {
        title: "",
        hideBackButton: true,
        hideNextButton: false,
    },
    {
        title: "Choose your goals",
        hideBackButton: false,
        hideNextButton: false,
    },
    {
        title: "Add Skincare Products",
        hideBackButton: false,
        hideNextButton: false,
    },
    {
        title: "Summary",
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

export interface SurveyProviderProps {
    children: React.ReactNode;
}

export enum ProductReaction
{
    Flakiness, Redness, Swelling, Itchiness
}

// {
//     "id": 0,
//     "name": "string",
//     "usage": "string",
//     "eyeIrritant": true,
//     "driesSkin": true,
//     "reducesRedness": true,
//     "hydrating": true,
//     "nonComedogenic": true,
//     "safeForPregnancy": true
// }

export type Ingredient = {
    id: number;
    name: string;
    usage: string;
    eyeIrritant: boolean;
    driesSkin: boolean;
    reducesRedness: boolean;
    hydrating: boolean;
    nonComedogenic: boolean;
    safeForPregnancy: boolean;
}

export type Product = {
    id: number;
    name: string;
    description: string;
    type: string;
    url: string;
    thumbnail: string;
    ingredients: Ingredient[];
}

export enum SkinGoal
{
    ReduceRedness, ReduceWrinkles, PoreAppearance, EvenSkinTone, MoistureRetention, SkinGlow
}

export enum SkinType
{
    Dry, Normal, Combination, Oily
}

interface SurveyContextType {
    currentStep: SurveyStep,
    stepConfig: StepConfig[],
    navigateForward: () => void,
    navigateBackward: () => void,
    skinType?: SkinType,
    setSkinType: Dispatch<SetStateAction<SkinType | undefined>>,
    skinGoals: SkinGoal[],
    setSkinGoals: Dispatch<SetStateAction<SkinGoal[]>>,
    products: Product[],
    setProducts: Dispatch<SetStateAction<Product[]>>,
}

const SurveyProvider: React.FC<SurveyProviderProps> = ({ children }) => {
    const [ currentStep, setCurrentStep ] = useState<SurveyStep>(SurveyStep.SkinType)
    const [ skinType, setSkinType ] = useState<SkinType | undefined>()
    const [ skinGoals, setSkinGoals ] = useState<SkinGoal[]>([])
    const [ products, setProducts ] = useState<Product[]>([])
    const navigateForward = (): void => {
        if (currentStep < stepConfig.length-1) {
            setCurrentStep(currentStep+1)
        } else {
            console.error("Attempting to navigate forward beyond the bounds of step config")
        }
    }

    const navigateBackward = (): void => {
        if (currentStep > 0) {
            setCurrentStep(currentStep-1)
        } else {
            console.error("Attempting to navigate backward beyond the bounds of step config")
        }
    }

    useEffect(() => {
        if (currentStep !== 0) {
            return;
        }

        if (!skinType) {
            setCurrentStep(SurveyStep.SkinType)
        } else if (skinGoals.length === 0) {
            setCurrentStep(SurveyStep.SkinGoals)
        }
    }, [skinType, skinGoals])

    const initialContextValue: SurveyContextType = {
        currentStep,
        stepConfig,
        navigateBackward,
        navigateForward,
        skinType,
        setSkinType,
        skinGoals,
        setSkinGoals,
        products,
        setProducts
    };

    return (
        <SurveyContext.Provider value={initialContextValue}>
            {children}
        </SurveyContext.Provider>
    );
};

export { SurveyProvider, useSurvey };