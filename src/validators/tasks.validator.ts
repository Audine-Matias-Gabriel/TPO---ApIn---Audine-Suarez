
export function validateTaskStatusChange(currentStatus: string, newStatus: string) {
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    const errors: string[] = [];
    if (newStatus === 'cancelled') {
        return errors; // Any status can transition to 'cancelled'
    }
    if (currentStatus === 'pending' && newStatus != 'in_progress') {
        errors.push(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }
    if (currentStatus === 'in_progress' && newStatus != 'completed') {
        errors.push(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }
    if (currentStatus === 'completed') {
        errors.push(`Cannot change status from ${currentStatus}`);
    }
    return errors;
}