export interface Travel {
    destination: string;
    departureDate: Date;
    returnDate: Date;
    travelers: number;
    budget: number;
    preferences?: {
        accommodation?: string;
        activities?: string[];
        transportation?: string;
    };
}