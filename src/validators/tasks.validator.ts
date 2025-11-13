
export function validateTaskCreation(task: any) {
    const errors: string[] = [];
    return errors;
}

export function validateTaskStatusChange(currentStatus: string, newStatus: string) {
    const validStatuses = ['pending', 'in-progress', 'completed', 'cancelled'];
    const errors: string[] = [];

    if (!validStatuses.includes(newStatus)) {
        errors.push(`Invalid status: ${newStatus}`);
        return errors;
    }

    if (currentStatus === newStatus) {
        errors.push(`Status is already ${currentStatus}`);
        return errors;
    }

    if (currentStatus === 'completed') {
        errors.push(`Cannot change status from ${currentStatus}`);
        return errors;
    }

    if (newStatus === 'cancelled') {
        return errors;
    }

    if (currentStatus === 'pending' && newStatus !== 'in-progress') {
        errors.push(`Invalid status transition from ${currentStatus} to ${newStatus}`);
        return errors;
    }
    if (currentStatus === 'in-progress' && newStatus !== 'completed') {
        errors.push(`Invalid status transition from ${currentStatus} to ${newStatus}`);
        return errors;
    }

    return errors;
}