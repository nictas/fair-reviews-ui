export interface FileMultiplier {
    id: string;
    fileExtension: string;
    additionsMultiplier: number;
    deletionsMultiplier: number;
}

export interface Multiplier {
    id: string;
    defaultAdditionsMultiplier: number;
    defaultDeletionsMultiplier: number;
    fileMultipliers: FileMultiplier[];
    createdAt: Date;
}
