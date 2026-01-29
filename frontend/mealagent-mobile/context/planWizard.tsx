import { createContext, useContext, useMemo, useState } from "react";

export type PlanInputs = {
    ingredients: string[];
    timeAvailable: number;
    servings: number;
}

export type PlanResult = {
    recipeId: number;
    title: string;
    ingredientsHave: string[];
    ingredientsMissing: string[];
    steps: string[];
}

type PlanWizardState = {
    inputs: PlanInputs;
    setInputs: (v: PlanInputs) => void;
    candidates: { id: number; title: string; scoreReason: string }[];
    setCandidates: (v: { id: number; title: string; scoreReason: string }[]) => void;
    result: PlanResult | null;
    setResult: (v: PlanResult | null) => void;
    reset: () => void;
};

const defaultInputs: PlanInputs = {
    ingredients: [],
    timeAvailable: 30,
    servings: 2
};

const Ctx = createContext<PlanWizardState | null>(null);

export function PlanWizardProvider({ children }: { children: React.ReactNode }) {
    const [inputs, setInputs] = useState<PlanInputs>(defaultInputs);
    const [candidates, setCandidates] = useState<PlanWizardState["candidates"]>([]);
    const [result, setResult] = useState<PlanResult | null>(null);

    const value = useMemo<PlanWizardState>(() => ({
        inputs,
        setInputs,
        candidates,
        setCandidates,
        result,
        setResult,
        reset: () => {
            setInputs(defaultInputs);
            setCandidates([]);
            setResult(null);
        }
    }), [inputs, candidates, result]);

    return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function usePlanWizard() {
    const ctx = useContext(Ctx);
    if (!ctx) throw new Error("usePlanWizard must be used within PlanWizardProvider");
    return ctx;
}