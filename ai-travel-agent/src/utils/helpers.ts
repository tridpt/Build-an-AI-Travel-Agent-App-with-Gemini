export const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
};

export const calculateTripDuration = (startDate: Date, endDate: Date): number => {
    const duration = endDate.getTime() - startDate.getTime();
    return Math.ceil(duration / (1000 * 3600 * 24)); // duration in days
};

export const validateEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const generateUniqueId = (): string => {
    return 'id-' + Math.random().toString(36).substr(2, 16);
};