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