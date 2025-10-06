import axios from 'axios';

// Định nghĩa kiểu dữ liệu cho phản hồi từ API
interface ExchangeRateResponse {
  result: string;
  conversion_rate?: number;
  'error-type'?: string;
}

export class CurrencyService {
  private apiKey: string;
  private baseUrl: string = 'https://v6.exchangerate-api.com/v6';

  constructor() {
    this.apiKey = process.env.EXCHANGE_RATE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('EXCHANGE_RATE_API_KEY not set. Currency conversion will be disabled.');
    }
  }

  /**
   * Lấy tỷ giá chuyển đổi giữa hai loại tiền tệ
   */
  async getConversionRate(sourceCurrency: string, targetCurrency: string): Promise<number | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const response = await axios.get<ExchangeRateResponse>(
        `${this.baseUrl}/${this.apiKey}/pair/${sourceCurrency}/${targetCurrency}`
      );
      
      if (response.data.result === 'success' && response.data.conversion_rate) {
        return response.data.conversion_rate;
      } else {
        console.error('Error fetching conversion rate:', response.data['error-type']);
        return null;
      }
    } catch (error) {
      console.error('Error fetching currency data:', error);
      return null;
    }
  }
}