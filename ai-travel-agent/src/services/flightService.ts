// src/services/flightService.ts
import axios from 'axios';

// Cấu trúc dữ liệu mà frontend đang mong đợi
export interface TrackedFlight {
  Airline: string;
  FlightNumber: string;
  Status: string;
  DepartureTime: string;
  ArrivalTime: string;
}

// Cấu trúc dữ liệu thực tế mà API trả về
interface FlightApiResponse {
    flights: {
        airline: string;
        flightNumber: string;
        displayStatus: string;
        departureTime: string;
        arrivalTime: string;
    }[];
}

export class FlightService {
  private apiKey: string;
  private baseUrl: string = 'https://api.flightapi.io/trackbyroute';

  constructor() {
    this.apiKey = process.env.FLIGHTAPI_IO_KEY || '';
  }

  async searchFlights(airport1: string, airport2: string, date: string): Promise<TrackedFlight[]> {
    if (!this.apiKey) {
      // Giữ lại cảnh báo quan trọng này
      console.warn('FLIGHTAPI_IO_KEY not set. Flight features will be disabled.');
      return [];
    }

    const requestUrl = `${this.baseUrl}/${this.apiKey}`;
    const params = {
      date: date,
      airport1: airport1.toUpperCase(),
      airport2: airport2.toUpperCase(),
    };
    
    try {
      const response = await axios.get<FlightApiResponse>(requestUrl, { params });
      
      if (!response.data || !Array.isArray(response.data.flights)) {
        return [];
      }

      const trackedFlights: TrackedFlight[] = response.data.flights.map(flight => ({
          Airline: flight.airline,
          FlightNumber: flight.flightNumber.toString(),
          Status: flight.displayStatus,
          DepartureTime: flight.departureTime,
          ArrivalTime: flight.arrivalTime
      }));

      return trackedFlights;

    } catch (error: any) {
      // In lỗi ra console vẫn rất hữu ích khi có sự cố
      console.error('FlightAPI.io Error:', error.message);
      return [];
    }
  }
}