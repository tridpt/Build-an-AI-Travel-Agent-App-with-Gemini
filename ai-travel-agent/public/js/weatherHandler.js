class WeatherHandler {
    constructor() {
        this.currentLanguage = 'vi';
    }

    setLanguage(lang) {
        this.currentLanguage = lang;
    }

    /**
     * Fetch and display current weather
     */
    async displayCurrentWeather(city, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '<div class="weather-loading">🌤️ Đang tải thông tin thời tiết...</div>';

        try {
            const response = await fetch(`/api/weather/current/${encodeURIComponent(city)}?lang=${this.currentLanguage}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch weather');
            }

            container.innerHTML = this.renderCurrentWeather(data);
        } catch (error) {
            console.error('Weather error:', error);
            container.innerHTML = `<div class="weather-error">⚠️ Không thể tải thông tin thời tiết</div>`;
        }
    }

    /**
     * Fetch and display weather forecast
     */
    async displayForecast(city, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '<div class="weather-loading">📅 Đang tải dự báo thời tiết...</div>';

        try {
            const response = await fetch(`/api/weather/forecast/${encodeURIComponent(city)}?lang=${this.currentLanguage}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch forecast');
            }

            container.innerHTML = this.renderForecast(data.forecast);
        } catch (error) {
            console.error('Forecast error:', error);
            container.innerHTML = `<div class="weather-error">⚠️ Không thể tải dự báo thời tiết</div>`;
        }
    }

    /**
     * Render current weather HTML
     */
    renderCurrentWeather(data) {
        const iconUrl = `https://openweathermap.org/img/wn/${data.icon}@2x.png`;
        
        return `
            <div class="weather-current">
                <div class="weather-header">
                    <h3>🌍 ${data.city}, ${data.country}</h3>
                </div>
                <div class="weather-content">
                    <div class="weather-icon">
                        <img src="${iconUrl}" alt="${data.description}">
                    </div>
                    <div class="weather-details">
                        <div class="weather-temp">${data.temperature}°C</div>
                        <div class="weather-desc">${data.description}</div>
                        <div class="weather-info">
                            <span>💨 ${data.windSpeed} m/s</span>
                            <span>💧 ${data.humidity}%</span>
                            <span>🌡️ Cảm giác: ${data.feelsLike}°C</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render forecast HTML
     */
    renderForecast(forecast) {
        if (!forecast || forecast.length === 0) {
            return '<div class="weather-error">Không có dữ liệu dự báo</div>';
        }

        const days = forecast.map(day => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString(this.currentLanguage === 'vi' ? 'vi-VN' : 'en-US', { weekday: 'short' });
            const iconUrl = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;

            return `
                <div class="forecast-day">
                    <div class="forecast-date">${dayName}</div>
                    <div class="forecast-icon">
                        <img src="${iconUrl}" alt="${day.description}">
                    </div>
                    <div class="forecast-temp">
                        <span class="temp-max">${day.temperature.max}°</span>
                        <span class="temp-min">${day.temperature.min}°</span>
                    </div>
                    <div class="forecast-desc">${day.description}</div>
                </div>
            `;
        }).join('');

        return `
            <div class="weather-forecast">
                <h3>📅 Dự báo 5 ngày</h3>
                <div class="forecast-grid">
                    ${days}
                </div>
            </div>
        `;
    }
}

// Initialize weather handler
const weatherHandler = new WeatherHandler();