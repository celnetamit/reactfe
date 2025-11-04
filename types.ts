
export interface LCIEntry {
    id: number;
    material: string;
    quantity: number;
    unit: string;
    stage: LifeCycleStage;
}

export enum LifeCycleStage {
    RAW_MATERIAL = "Raw Material Acquisition",
    MANUFACTURING = "Manufacturing & Processing",
    TRANSPORT = "Distribution & Transport",
    USE = "Use & Maintenance",
    END_OF_LIFE = "End-of-Life",
}

export interface ImpactData {
    material: string;
    stage: string;
    co2eq: number;
}
