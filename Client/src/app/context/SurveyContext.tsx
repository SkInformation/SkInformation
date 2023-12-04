"use client"

import {createContext, Dispatch, SetStateAction, useContext, useEffect, useState} from "react";
import {Product} from "../shared/types";

const LOCAL_STORAGE_KEY = "surveyContext";
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
        title: "Choose your skin type",
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
    navigateTo: (step: number) => void,
    skinType?: SkinType,
    setSkinType: Dispatch<SetStateAction<SkinType | undefined>>,
    skinGoals: SkinGoal[],
    setSkinGoals: Dispatch<SetStateAction<SkinGoal[]>>,
    products: { [key: number]: Product },
    setProducts: Dispatch<SetStateAction<{ [key: number]: Product }>>,
}

const SurveyProvider: React.FC<SurveyProviderProps> = ({ children }) => {
    const [ currentStep, setCurrentStep ] = useState<SurveyStep>(SurveyStep.SkinType)
    const [ skinType, setSkinType ] = useState<SkinType | undefined>()
    const [ skinGoals, setSkinGoals ] = useState<SkinGoal[]>([])
    const [products, setProducts] = useState<{ [key: number]: Product }>([])
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

    const navigateTo = (step: number): void => {
        if (step < 0 || step > stepConfig.length) {
            console.error(`Unable to navigate to the step ${step}.`)
            return
        }
        setCurrentStep(step);
    }

    // Load initial state from localStorage, if available
    useEffect(() => {
        const storedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedData) {
            const parsedData = JSON.parse(storedData);
            setCurrentStep(parsedData.currentStep);
            setSkinType(parsedData.skinType);
            setSkinGoals(parsedData.skinGoals);
            setProducts(parsedData.products);
        }
    }, []);

    // Save state to localStorage on changes
    useEffect(() => {
        const dataToStore = {
            currentStep,
            skinType,
            skinGoals,
            products,
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToStore));
    }, [currentStep, skinType, skinGoals, products]);

    const initialContextValue: SurveyContextType = {
        currentStep,
        stepConfig,
        navigateBackward,
        navigateForward,
        navigateTo,
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