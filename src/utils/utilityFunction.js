
export function capitalize(value) {
    const lower = value?.toLowerCase();
    return value?.charAt(0).toUpperCase() + lower?.slice(1);
}