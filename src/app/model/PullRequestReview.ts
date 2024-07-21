import { Developer } from "./Developer";
import { Multiplier } from "./Multiplier";

interface ChangedFile {
    name: string;
    additions: number;
    deletions: number;
}

interface PullRequestFileDetails {
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
