import {SkinGoal, SkinType} from "@/app/context/SurveyContext";

export function getSkinTypeImageSrc(type: SkinType): string {
    let src = ''
    switch (type) {
        case SkinType.Dry:
            src = '/assets/images/survey/skin_type/type_dry.png'
            break;
        case SkinType.Normal:
            src = '/assets/images/survey/skin_type/type_normal.png'
            break;
        case SkinType.Oily:
            src = '/assets/images/survey/skin_type/type_oily.png'
            break;
        case SkinType.Combination:
            src = '/assets/images/survey/skin_type/type_combination.png'
            break;
    }

    return src
}

export function getSkinGoalImageSrc(type: SkinGoal): string {
    let src = ''
    switch (type) {
        case SkinGoal.SkinGlow:
            src = '/assets/images/survey/skin_goal/goal_glow.png'
            break;
        case SkinGoal.MoistureRetention:
            src = '/assets/images/survey/skin_goal/goal_moisturize.png'
            break;
        case SkinGoal.PoreAppearance:
            src = '/assets/images/survey/skin_goal/goal_pores.png'
            break;
        case SkinGoal.ReduceRedness:
            src = '/assets/images/survey/skin_goal/goal_redness.png'
            break;
        case SkinGoal.ReduceWrinkles:
            src = '/assets/images/survey/skin_goal/goal_skintone.png'
            break;
        case SkinGoal.EvenSkinTone:
            src = '/assets/images/survey/skin_goal/goal_wrinkles.png'
            break;
    }

    return src
}

export function getSkinTypeReadableName(type: SkinType): string {
    let name = ''

    switch (type) {
        case SkinType.Dry:
            name = 'Dry'
            break;
        case SkinType.Normal:
            name = 'Normal'
            break;
        case SkinType.Oily:
            name = 'Oily'
            break;
        case SkinType.Combination:
            name = 'Combination'
            break;
    }

    return name
}

export function getSkinGoalReadableName(goal: SkinGoal): string {
    let name = ''

    switch (goal) {
        case SkinGoal.SkinGlow:
            name = 'Skin Glow'
            break;
        case SkinGoal.MoistureRetention:
            name = 'Moisture Retention'
            break;
        case SkinGoal.PoreAppearance:
            name = 'Pore Appearance'
            break;
        case SkinGoal.ReduceRedness:
            name = 'Reduce Redness'
            break;
        case SkinGoal.ReduceWrinkles:
            name = 'Reduce Wrinkles'
            break;
        case SkinGoal.EvenSkinTone:
            name = 'Even Skin Tone'
            break;
    }

    return name
}