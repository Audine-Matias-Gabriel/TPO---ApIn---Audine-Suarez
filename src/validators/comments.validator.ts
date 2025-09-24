
export function validateCreateComment(data: any) {
    const errors: string[] = [];
    if (!data.body || typeof data.body !== "string" || data.body.trim() === "") {
        errors.push("Comment body is required and must be a non-empty string.");
    }
    if (!data.taskId || typeof data.taskId !== "string") {
        errors.push("taskId is required and must be a string.");
    }
    if (!data.userId || typeof data.userId !== "string") {
        errors.push("userId is required and must be a string.");
    }
    return errors;
}