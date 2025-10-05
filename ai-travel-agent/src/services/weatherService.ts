import axios from 'axios';

interface WeatherData {
  temperature: number;
  feelsLike: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  city: string;
  country: string;
}

interface ForecastDay {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  description: string;
  icon: string;
}

// OpenWeatherMap API Response Types
interface OpenWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

interface ForecastResponse {
  list: Array<{
    dt_txt: string;
    main: {
      temp: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
  }>;
}

export class WeatherService {
  private apiKey: string;
  private baseUrl: string = 'https://api.openweathermap.org/data/2.5';

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || '';
    if (!this.apiKey) {
      console.warn('OPENWEATHER_API_KEY not set. Weather features will be disabled.');
    }
  }

  /**
   * Get current weather for a city
   */
  async getCurrentWeather(city: string, lang: string = 'vi'): Promise<WeatherData | null> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const response = await axios.get<OpenWeatherResponse>(`${this.baseUrl}/weather`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric',
          lang: lang
        },
        timeout: 5000
      });

      const data = response.data;
      return {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        description: data.weather[0].description,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon,
        city: data.name,
        country: data.sys.country
      };
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
  }

  /**
   * Get 5-day weather forecast
   */
  async getForecast(city: string, lang: string = 'vi'): Promise<ForecastDay[]> {
    if (!this.apiKey) {
      return [];
    }

    try {
      const response = await axios.get<ForecastResponse>(`${this.baseUrl}/forecast`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric',
          lang: lang
        },
        timeout: 5000
      });

      const forecasts: ForecastDay[] = [];
      const dailyData: { [key: string]: typeof response.data.list } = {};

      // Group forecasts by day
      response.data.list.forEach((item) => {
        const date = item.dt_txt.split(' ')[0];
        if (!dailyData[date]) {
          dailyData[date] = [];
        }
        dailyData[date].push(item);
      });

      // Get min/max temp for each day (limit to 5 days)
      Object.keys(dailyData).slice(0, 5).forEach(date => {
        const dayData = dailyData[date];
        const temps = dayData.map(d => d.main.temp);
        const middayData = dayData[Math.floor(dayData.length / 2)];

        forecasts.push({
          date,
          temperature: {
            min: Math.round(Math.min(...temps)),
            max: Math.round(Math.max(...temps))
          },
          description: middayData.weather[0].description,
          icon: middayData.weather[0].icon
        });
      });

      return forecasts;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      return [];
    }
  }

  /**
   * Get weather icon URL
   */
  getIconUrl(iconCode: string): string {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  }
}