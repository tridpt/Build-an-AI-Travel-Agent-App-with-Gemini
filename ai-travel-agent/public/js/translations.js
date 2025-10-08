const translations = {
    vi: {
        title: '🌍 AI Travel Agent',
        subtitle: 'Trợ lý du lịch thông minh với Google Gemini',
        tabPlan: '📋 Lên Kế Hoạch',
        tabChat: '💬 Chat Tự Do',
        tabCurrency: '💱 Chuyển đổi tiền tệ',
        currencyConverterTitle: '💱 Công cụ chuyển đổi tiền tệ',
        amountLabel: 'Số tiền',
        fromLabel: 'Từ',
        toLabel: 'Sang',
        convertButton: 'Chuyển đổi',
        formTitle: '🎯 Thông tin chuyến đi của bạn',
        startLocation: '🛫 Nơi bắt đầu?',
        startLocationPlaceholder: 'Ví dụ: Hà Nội, TP.HCM, Đà Nẵng...',
        errorStartLocation: 'Vui lòng nhập nơi bắt đầu!',
        destination: '📍 Bạn muốn đi đâu?',
        destinationPlaceholder: 'Ví dụ: Đà Lạt, Phú Quốc, Tokyo...',
        destinationHint: 'Có thể để trống nếu muốn AI gợi ý',
        startDate: '📅 Ngày bắt đầu',
        endDate: '📅 Ngày kết thúc',
        budget: '💰 Ngân sách',
        budgetPlaceholder: 'Ví dụ: 5000000',
        budgetCurrencyLabel: 'Đơn vị',
        travelers: '👥 Số người đi',
        travelersPlaceholder: 'Số người',
        travelStyle: '🎨 Phong cách du lịch',
        selectStyle: '-- Chọn phong cách --',
        styleBudget: '🎒 Tiết kiệm (Backpacker)',
        styleComfort: '🏨 Thoải mái (Khách sạn 3-4 sao)',
        styleLuxury: '✨ Cao cấp (Resort 5 sao)',
        styleAdventure: '🏔️ Phiêu lưu, Mạo hiểm',
        styleRelax: '🏖️ Nghỉ dưỡng',
        styleCulture: '🏛️ Văn hóa, Lịch sử',
        styleFood: '🍜 Ẩm thực',
        interests: '❤️ Sở thích (chọn nhiều)',
        interestBeach: '🏖️ Biển',
        interestMountain: '⛰️ Núi',
        interestCity: '🏙️ Thành phố',
        interestNature: '🌿 Thiên nhiên',
        interestShopping: '🛍️ Mua sắm',
        interestFood: '🍽️ Ẩm thực',
        interestNightlife: '🌃 Nightlife',
        interestHistory: '🏛️ Lịch sử',
        transportation: '🚗 Phương tiện di chuyển',
        selectTransport: '-- Chọn phương tiện --',
        transportPlane: '✈️ Máy bay',
        transportBus: '🚌 Xe khách',
        transportTrain: '🚄 Tàu hỏa',
        transportCar: '🚗 Xe ô tô (tự lái)',
        transportMotorbike: '🏍️ Xe máy',
        transportAny: '🤷 Tùy ý',
        additionalInfo: '📝 Yêu cầu khác (tùy chọn)',
        additionalPlaceholder: 'Ví dụ: Muốn ở homestay, thích chụp ảnh, đi cùng trẻ em...',
        generateButton: '✨ Tạo Lịch Trình Du Lịch',
        generating: '⏳ Đang tạo lịch trình...',
        exportButton: 'Xuất File',
        resultTitle: '🎉 Lịch trình của bạn',
        editButton: '✏️ Chỉnh sửa',
        shareButton: '📤 Chia sẻ', 
        noItineraryToShare: 'Chưa có lịch trình để chia sẻ!', 
        tabFlight: '✈️ Tìm chuyến bay',
        flightSearchTitle: '✈️ Tìm kiếm chuyến bay',
        fromAirportLabel: 'Sân bay đi (IATA)',
        toAirportLabel: 'Sân bay đến (IATA)',
        flightDateLabel: 'Ngày bay',
        searchFlightButton: 'Tìm kiếm',
        flightResultsTitle: 'Kết quả tìm kiếm',
        chatPlaceholder: 'Hỏi gì đó về du lịch...',
        sendButton: 'Gửi',
        welcomeMessage: 'Xin chào! Tôi là trợ lý du lịch AI. Hãy hỏi tôi về các điểm đến, khách sạn, hoạt động hoặc lời khuyên du lịch!',
        bookingLabel: 'Đặt phòng',
        searchLabel: 'Tìm kiếm',
        errorDate: 'Vui lòng chọn ngày bắt đầu và kết thúc!',
        errorBudget: 'Vui lòng nhập ngân sách!',
        errorStyle: 'Vui lòng chọn phong cách du lịch!',
        errorEndDate: 'Ngày kết thúc phải sau ngày bắt đầu!',
        errorPlan: 'Không thể tạo lịch trình. Vui lòng thử lại!',
        errorConnection: 'Lỗi kết nối đến server!'
    },
    en: {
        title: '🌍 AI Travel Agent',
        subtitle: 'Smart Travel Assistant powered by Google Gemini',
        tabPlan: '📋 Plan Trip',
        tabChat: '💬 Free Chat',
        tabCurrency: '💱 Currency Converter',
        currencyConverterTitle: '💱 Currency Converter',
        amountLabel: 'Amount',
        fromLabel: 'From',
        toLabel: 'To',
        convertButton: 'Convert',
        formTitle: '🎯 Your Trip Information',
        startLocation: '🛫 Starting From?',
        startLocationPlaceholder: 'e.g., Hanoi, Ho Chi Minh City, London...',
        errorStartLocation: 'Please enter a starting location!',
        destination: '📍 Where do you want to go?',
        destinationPlaceholder: 'e.g., Paris, Tokyo, Bali...',
        destinationHint: 'Leave blank for AI suggestions',
        startDate: '📅 Start Date',
        endDate: '📅 End Date',
        budget: '💰 Budget',
        budgetPlaceholder: 'e.g., 500',
        budgetCurrencyLabel: 'Currency',
        travelers: '👥 Number of Travelers',
        travelersPlaceholder: 'Number',
        travelStyle: '🎨 Travel Style',
        selectStyle: '-- Select Style --',
        styleBudget: '🎒 Budget (Backpacker)',
        styleComfort: '🏨 Comfort (3-4 star hotels)',
        styleLuxury: '✨ Luxury (5-star resorts)',
        styleAdventure: '🏔️ Adventure',
        styleRelax: '🏖️ Relaxation',
        styleCulture: '🏛️ Culture & History',
        styleFood: '🍜 Food & Cuisine',
        interests: '❤️ Interests (select multiple)',
        interestBeach: '🏖️ Beach',
        interestMountain: '⛰️ Mountain',
        interestCity: '🏙️ City',
        interestNature: '🌿 Nature',
        interestShopping: '🛍️ Shopping',
        interestFood: '🍽️ Food',
        interestNightlife: '🌃 Nightlife',
        interestHistory: '🏛️ History',
        transportation: '🚗 Transportation',
        selectTransport: '-- Select Transport --',
        transportPlane: '✈️ Airplane',
        transportBus: '🚌 Bus',
        transportTrain: '🚄 Train',
        transportCar: '🚗 Car (self-drive)',
        transportMotorbike: '🏍️ Motorbike',
        transportAny: '🤷 Any',
        additionalInfo: '📝 Additional Requirements (optional)',
        additionalPlaceholder: 'e.g., Prefer homestays, love photography, traveling with kids...',
        generateButton: '✨ Generate Travel Plan',
        generating: '⏳ Generating plan...',
        exportButton: 'Export File',
        resultTitle: '🎉 Your Itinerary',
        editButton: '✏️ Edit',
        shareButton: '📤 Share',
        noItineraryToShare: 'No itinerary to share!', 
        tabFlight: '✈️ Flight Search',
        flightSearchTitle: '✈️ Flight Search',
        fromAirportLabel: 'Departure Airport (IATA)',
        toAirportLabel: 'Arrival Airport (IATA)',
        flightDateLabel: 'Flight Date',
        searchFlightButton: 'Search',
        flightResultsTitle: 'Search Results',
        chatPlaceholder: 'Ask something about travel...',
        sendButton: 'Send',
        welcomeMessage: 'Hello! I\'m your AI travel assistant. Ask me about destinations, hotels, activities, or travel advice!',
        bookingLabel: 'Booking',
        searchLabel: 'Search',
        errorDate: 'Please select start and end dates!',
        errorBudget: 'Please enter a budget!',
        errorStyle: 'Please select a travel style!',
        errorEndDate: 'End date must be after start date!',
        errorPlan: 'Cannot generate plan. Please try again!',
        errorConnection: 'Error connecting to server!'
    }
};

let currentLang = 'vi';

function t(key) {
    return translations[currentLang][key] || key;
}

function switchLanguage(lang) {
    currentLang = lang;
    updateUIText();
    // This function will now be called from formHandler to ensure it has the correct currency
    // updateBudgetDisplay(); 
    if (typeof formHandler !== 'undefined' && formHandler) {
        formHandler.updateBudgetDisplay();
    }
    updateWelcomeMessage();
    
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`lang-${lang}`).classList.add('active');
    
    localStorage.setItem('preferredLanguage', lang);
}

function updateUIText() {
    document.querySelectorAll('[data-i18n]').forEach(elem => {
        const key = elem.getAttribute('data-i18n');
        if (elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA') {
            if (elem.placeholder) elem.placeholder = t(key);
        } else {
            elem.textContent = t(key);
        }
    });
    
    const travelStyleSelect = document.getElementById('travelStyle');
    if (travelStyleSelect) {
        const selectedValue = travelStyleSelect.value;
        travelStyleSelect.innerHTML = `
            <option value="">${t('selectStyle')}</option>
            <option value="budget">${t('styleBudget')}</option>
            <option value="comfort">${t('styleComfort')}</option>
            <option value="luxury">${t('styleLuxury')}</option>
            <option value="adventure">${t('styleAdventure')}</option>
            <option value="relax">${t('styleRelax')}</option>
            <option value="culture">${t('styleCulture')}</option>
            <option value="food">${t('styleFood')}</option>
        `;
        travelStyleSelect.value = selectedValue;
    }
    
    const transportSelect = document.getElementById('transportation');
    if (transportSelect) {
        const selectedValue = transportSelect.value;
        transportSelect.innerHTML = `
            <option value="">${t('selectTransport')}</option>
            <option value="plane">${t('transportPlane')}</option>
            <option value="bus">${t('transportBus')}</option>
            <option value="train">${t('transportTrain')}</option>
            <option value="car">${t('transportCar')}</option>
            <option value="motorbike">${t('transportMotorbike')}</option>
            <option value="any">${t('transportAny')}</option>
        `;
        transportSelect.value = selectedValue;
    }
    
    const checkboxes = [
        { value: 'beach', key: 'interestBeach' },
        { value: 'mountain', key: 'interestMountain' },
        { value: 'city', key: 'interestCity' },
        { value: 'nature', key: 'interestNature' },
        { value: 'shopping', key: 'interestShopping' },
        { value: 'food', key: 'interestFood' },
        { value: 'nightlife', key: 'interestNightlife' },
        { value: 'history', key: 'interestHistory' }
    ];
    
    checkboxes.forEach(({ value, key }) => {
        const checkbox = document.querySelector(`input[type="checkbox"][value="${value}"]`);
        if (checkbox && checkbox.nextElementSibling) {
            checkbox.nextElementSibling.textContent = t(key);
        }
    });
}

// This function is now in formHandler.js to access currency value directly.

function updateWelcomeMessage() {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages && chatMessages.children.length > 0) {
        const firstMessage = chatMessages.children[0];
        if (firstMessage.classList.contains('bot-message')) {
            firstMessage.textContent = t('welcomeMessage');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLanguage') || 'vi';
    switchLanguage(savedLang);
});