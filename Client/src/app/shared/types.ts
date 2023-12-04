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
    reactions: Reaction[];
}

export enum Reaction {
    Flakiness, Redness, Swelling, Itchiness, EyeIrritation
}