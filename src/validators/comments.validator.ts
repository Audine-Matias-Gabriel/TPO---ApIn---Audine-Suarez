
export function validateCommentCreation(data: any) {
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

export function validateCommentUpdate(data: any): string[] {
    const errors: string[] = [];
    if (data.body !== undefined && (typeof data.body !== "string" || data.body.trim() === "")) {
        errors.push("El comentario no puede estar vacío");
    }
    return errors;
}