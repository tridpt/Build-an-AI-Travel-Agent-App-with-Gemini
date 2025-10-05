export interface TravelDestination {
    id: string;
    name: string;
    country: string;
    description: string;
    imageUrl: string;
}

export interface FlightSearchCriteria {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    numberOfPassengers: number;
}

export interface HotelRecommendation {
    id: string;
    name: string;
    location: string;
    pricePerNight: number;
    rating: number;
    amenities: string[];
}

export interface BookingDetails {
    destinationId: string;
    flightDetails: FlightSearchCriteria;
    hotelId: string;
    userId: string;
    totalPrice: number;
}

export interface ChatMessage {
    sender: 'user' | 'ai';
    content: string;
    timestamp: Date;
}