
export function validateCommentCreation(data: any) {
    const errors: string[] = [];
    if (!data.body || typeof data.body !== "string" || data.body.trim() === "") {
        errors.push("Comment body is required and must be a non-empty string.");
    }
    const taskId = data.taskId ?? data.task_id;
    if (!taskId || typeof taskId !== "string") {
        errors.push("taskId is required and must be a string.");
    }
    const authorId = data.authorId ?? data.author_id ?? data.userId ?? data.user_id;
    if (!authorId || typeof authorId !== "string") {
        errors.push("authorId (or userId) is required and must be a string.");
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