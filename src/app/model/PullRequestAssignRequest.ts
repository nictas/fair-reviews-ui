export interface PullRequestAssignRequest {
    pullRequestUrl: string;
    assigneeList: string[];
    assigneeExclusionList: string[];
}
