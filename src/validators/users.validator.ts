
export function validateUserCreation(task: any) {
    const errors: string[] = [];
    return errors;
}

export function validateEmail(email: string) {
    const errors: string[] = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errors.push("Invalid email format");
    }
    return errors;
}