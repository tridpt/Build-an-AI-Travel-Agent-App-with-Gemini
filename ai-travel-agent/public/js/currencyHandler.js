class CurrencyHandler {
    constructor() {
        this.fromCurrencySelect = document.getElementById('fromCurrency');
        this.toCurrencySelect = document.getElementById('toCurrency');
        this.amountInput = document.getElementById('amount');
        this.convertButton = document.getElementById('convertButton');
        this.resultDiv = document.getElementById('conversionResult');
        
        this.currencies = ["USD", "EUR", "JPY", "GBP", "AUD", "CAD", "CHF", "CNY", "VND", "SGD", "THB"];
        
        this.populateCurrencies();
        this.initializeEventListeners();
    }
    
    populateCurrencies() {
        this.currencies.forEach(currency => {
            const option1 = document.createElement('option');
            option1.value = currency;
            option1.textContent = currency;
            this.fromCurrencySelect.appendChild(option1);

            const option2 = document.createElement('option');
            option2.value = currency;
            option2.textContent = currency;
            this.toCurrencySelect.appendChild(option2);
        });
        
        this.fromCurrencySelect.value = "USD";
        this.toCurrencySelect.value = "VND";
    }

    initializeEventListeners() {
        this.convertButton.addEventListener('click', () => this.convertCurrency());
    }

    async convertCurrency() {
        const amount = parseFloat(this.amountInput.value);
        const from = this.fromCurrencySelect.value;
        const to = this.toCurrencySelect.value;

        if (isNaN(amount) || amount <= 0) {
            this.resultDiv.textContent = 'Vui lòng nhập số tiền hợp lệ.';
            return;
        }

        this.resultDiv.textContent = '⏳ Đang lấy tỷ giá...';

        try {
            const response = await fetch(`/api/currency/exchange?source=${from}&target=${to}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lỗi từ máy chủ');
            }

            const data = await response.json();

            if (data.rate) {
                const convertedAmount = (amount * data.rate).toFixed(2);
                this.resultDiv.innerHTML = `
                    ${amount.toLocaleString('en-US')} <strong>${from}</strong> ≈ 
                    ${parseFloat(convertedAmount).toLocaleString('en-US')} <strong>${to}</strong>
                `;
            } else {
                this.resultDiv.textContent = 'Không nhận được tỷ giá.';
            }
        } catch (error) {
            console.error("Currency conversion error:", error);
            this.resultDiv.textContent = '⚠️ Không thể kết nối. Vui lòng thử lại.';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Chỉ khởi tạo nếu các element tồn tại (để tránh lỗi ở trang index.html)
    if (document.getElementById('convertButton')) {
        new CurrencyHandler();
    }
});