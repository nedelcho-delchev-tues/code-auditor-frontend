export function isSubmissionPresent(submission){
    return submission !== null && !submission.hasOwnProperty("status");
}