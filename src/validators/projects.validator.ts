
export function validateProjectCreation(data: any): string[] {
    const errors: string[] = [];
    if (!data.name || typeof data.name !== "string" || data.name.trim() === "") {
        errors.push("El nombre es obligatorio");
    }
    if (!data.description || typeof data.description !== "string" || data.description.length < 10) {
        errors.push("La descripción debe tener al menos 10 caracteres");
    }
    return errors;
}

export function validateProjectUpdate(data: any): string[] {
    const errors: string[] = [];
    if (data.name !== undefined && (typeof data.name !== "string" || data.name.trim() === "")) {
        errors.push("El nombre no puede estar vacío");
    }
    if (data.description !== undefined && (typeof data.description !== "string" || data.description.length < 10)) {
        errors.push("La descripción debe tener al menos 10 caracteres");
    }
    return errors;
}