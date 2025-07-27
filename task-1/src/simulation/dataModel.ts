// 1. Types for attributes, blocks, context, and scenarios

export type AttributeType = "input" | "calculated";

export interface Attribute<T = number> {
    type: AttributeType;
    value?: T; // Only for input
    formula?: (ctx: SimulationContext) => number;
}

export type Block = Record<string, Attribute>;

export interface Blocks {
    Production: Block;
    Logistics: Block;
}

export type Scenario = {
    Production?: Partial<Record<keyof typeof blocks.Production, number>>;
    Logistics?: Partial<Record<keyof typeof blocks.Logistics, number>>;
};

export type ScenarioName = keyof typeof scenarios;

export interface SimulationContext {
    materialCost: number;
    energyCost: number;
    disposalCost: number;
    co2Cost: number;
    transportCost: number;
    logisticsCost: number;
    ecoFees: number;
}

// 2. The model definition

export const blocks = {
    Production: {
        materialCost: { type: "input", value: 120 },
        energyCost: { type: "input", value: 60 },
        disposalCost: {
            type: "calculated",
            formula: (ctx: { materialCost: number; co2Cost: number; }) => ctx.materialCost * 0.8 + ctx.co2Cost
        },
        co2Cost: {
            type: "calculated",
            formula: (ctx: { energyCost: number; disposalCost: number; }) => ctx.energyCost * 0.1 + ctx.disposalCost * 0.05
        }
    },
    Logistics: {
        transportCost: { type: "input", value: 35 },
        logisticsCost: {
            type: "calculated",
            formula: (ctx: { transportCost: number; ecoFees: number; }) => ctx.transportCost + ctx.ecoFees
        },
        ecoFees: {
            type: "calculated",
            formula: (ctx: { logisticsCost: number; co2Cost: number; }) => ctx.logisticsCost * 0.1 + ctx.co2Cost * 0.05
        }
    }
} as const;


export const scenarios = {
    Base: {
        Production: { materialCost: 120, energyCost: 60 },
        Logistics: { transportCost: 35 }
    },
    HighEnergyPrices: {
        Production: { energyCost: 90 },
        Logistics: { transportCost: 40 }
    }
} as const;


export function runSimulation(
    scenarioName: ScenarioName = "Base",
    maxIterations = 100,
    threshold = 0.001,
    manualOverrides?: Scenario,
    debug: boolean = false // <-- toggle logging
): SimulationContext {
    const baseProduction = scenarios.Base.Production;
    const baseLogistics = scenarios.Base.Logistics;

    const scenario = scenarios[scenarioName] || {};
    const scenarioProduction = scenario.Production || {};
    const scenarioLogistics = scenario.Logistics || {};

    const finalProduction = {
        ...baseProduction,
        ...scenarioProduction,
        ...(manualOverrides?.Production || {})
    };
    const finalLogistics = {
        ...baseLogistics,
        ...scenarioLogistics,
        ...(manualOverrides?.Logistics || {})
    };

    let context: SimulationContext = {
        materialCost: finalProduction.materialCost!,
        energyCost: finalProduction.energyCost!,
        transportCost: finalLogistics.transportCost!,
        disposalCost: 0,
        co2Cost: 0,
        logisticsCost: 0,
        ecoFees: 0
    };

    for (let i = 0; i < maxIterations; i++) {
        const prev = { ...context };

        context.disposalCost = blocks.Production.disposalCost.formula!(context);
        context.co2Cost = blocks.Production.co2Cost.formula!(context);
        context.logisticsCost = blocks.Logistics.logisticsCost.formula!(context);
        context.ecoFees = blocks.Logistics.ecoFees.formula!(context);

        const deltas = [
            Math.abs(context.disposalCost - prev.disposalCost),
            Math.abs(context.co2Cost - prev.co2Cost),
            Math.abs(context.logisticsCost - prev.logisticsCost),
            Math.abs(context.ecoFees - prev.ecoFees)
        ];

        if (debug) {
            console.log(`\n[Iteration ${i + 1}]`);
            console.table({
                disposalCost: context.disposalCost,
                co2Cost: context.co2Cost,
                logisticsCost: context.logisticsCost,
                ecoFees: context.ecoFees
            });
        }

        if (Math.max(...deltas) < threshold) break;
    }

    if (debug) {
        console.log(`\n✅ Final context for scenario: ${scenarioName}`);
        console.table(context);
    }

    return context;
}


// 5. For UI: flat output for display

export function getDisplayRows(ctx: SimulationContext): Array<{ label: string, value: number }> {
    // You can customize labels as needed
    return [
        { label: "Material Cost", value: ctx.materialCost },
        { label: "Energy Cost", value: ctx.energyCost },
        { label: "Disposal Cost", value: ctx.disposalCost },
        { label: "CO2 Cost", value: ctx.co2Cost },
        { label: "Transport Cost", value: ctx.transportCost },
        { label: "Logistics Cost", value: ctx.logisticsCost },
        { label: "Eco Fees", value: ctx.ecoFees }
    ];
}