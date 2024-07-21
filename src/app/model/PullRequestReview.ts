import { Developer } from "./Developer";
import { Multiplier } from "./Multiplier";

export interface ChangedFile {
    name: string;
    additions: number;
    deletions: number;
}

export interface PullRequestFileDetails {
    changedFiles: ChangedFile[];
}

export interface PullRequestReview {
    id: string;
    developer: Developer;
    score: number;
    multiplier: Multiplier;
    pullRequestUrl: string;
    pullRequestFileDetails: PullRequestFileDetails;
    createdAt: Date;
}
