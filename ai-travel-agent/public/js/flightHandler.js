// public/js/flightHandler.js
class FlightHandler {
    constructor() {
        this.searchButton = document.getElementById('searchFlightButton');
        this.resultsContainer = document.getElementById('flightResults');
        this.resultsContent = document.getElementById('flightResultsContent');
        this.fromAirport = document.getElementById('fromAirport');
        this.toAirport = document.getElementById('toAirport');
        this.flightDate = document.getElementById('flightDate');
        
        this.initializeEventListeners();
        this.setDefaultDate();
    }

    initializeEventListeners() {
        this.searchButton.addEventListener('click', () => this.searchFlights());
    }
    
    setDefaultDate() {
        const today = new Date();
        today.setDate(today.getDate() + 1);
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        
        const defaultDate = `${yyyy}-${mm}-${dd}`;
        this.flightDate.value = defaultDate;
        this.flightDate.setAttribute('min', defaultDate);
    }

    async searchFlights() {
        const airport1 = this.fromAirport.value.trim().toUpperCase(); // Viết hoa mã sân bay
        const airport2 = this.toAirport.value.trim().toUpperCase(); // Viết hoa mã sân bay
        const dateValue = this.flightDate.value;

        if (!airport1 || !airport2 || !dateValue) {
            alert('Vui lòng nhập đầy đủ thông tin.');
            return;
        }

        const formattedDate = dateValue.replace(/-/g, '');

        this.searchButton.disabled = true;
        this.searchButton.textContent = 'Đang tìm...';
        this.resultsContainer.style.display = 'block';
        this.resultsContent.innerHTML = '<p>Đang tải dữ liệu chuyến bay...</p>';

        try {
            const response = await fetch(`/api/flights/search?airport1=${airport1}&airport2=${airport2}&date=${formattedDate}`);
            const data = await response.json();

            if (Array.isArray(data.flights) && data.flights.length > 0) {
                // SỬA ĐỔI: Truyền mã sân bay vào hàm render
                this.renderFlights(data.flights, airport1, airport2);
            } else {
                this.resultsContent.innerHTML = '<p>Không tìm thấy chuyến bay nào. Vui lòng thử một ngày khác hoặc kiểm tra lại mã sân bay.</p>';
            }
        } catch (error) {
            console.error('Flight search error:', error);
            this.resultsContent.innerHTML = '<p>Đã xảy ra lỗi khi tìm kiếm chuyến bay.</p>';
        } finally {
            this.searchButton.disabled = false;
            this.searchButton.textContent = 'Tìm kiếm';
        }
    }

    // SỬA ĐỔI: Thêm tham số departureCode và arrivalCode
    renderFlights(flights, departureCode, arrivalCode) {
        let html = `<h3>Các chuyến bay tìm thấy:</h3><ul>`;
        flights.forEach(flight => {
            html += `
                <li style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px;">
                    <strong>Hãng bay:</strong> ${flight.Airline} (${flight.FlightNumber})<br>
                    <strong>Trạng thái:</strong> ${flight.Status}<br>
                    <strong>Khởi hành:</strong> ${flight.DepartureTime} (${departureCode})<br>
                    <strong>Đến nơi:</strong> ${flight.ArrivalTime} (${arrivalCode})
                </li>
            `;
        });
        html += '</ul>';
        this.resultsContent.innerHTML = html;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('searchFlightButton')) {
        new FlightHandler();
    }
});