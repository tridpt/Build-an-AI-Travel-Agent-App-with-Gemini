const translations = {
    vi: {
        title: '🌍 AI Travel Agent',
        subtitle: 'Trợ lý du lịch thông minh với Google Gemini',
        tabPlan: '📋 Lên Kế Hoạch',
        tabChat: '💬 Chat Tự Do',
        formTitle: '🎯 Thông tin chuyến đi của bạn',
        destination: '📍 Bạn muốn đi đâu?',
        destinationPlaceholder: 'Ví dụ: Đà Lạt, Phú Quốc, Tokyo...',
        destinationHint: 'Có thể để trống nếu muốn AI gợi ý',
        startDate: '📅 Ngày bắt đầu',
        endDate: '📅 Ngày kết thúc',
        budget: '💰 Ngân sách',
        budgetPlaceholder: 'Ví dụ: 5000000',
        currency: 'VNĐ',
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
        resultTitle: '🎉 Lịch trình của bạn',
        editButton: '✏️ Chỉnh sửa',
        chatPlaceholder: 'Hỏi gì đó về du lịch...',
        sendButton: 'Gửi',
        welcomeMessage: 'Xin chào! Tôi là trợ lý du lịch AI. Hãy hỏi tôi về các điểm đến, khách sạn, hoạt động hoặc lời khuyên du lịch!',
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
        formTitle: '🎯 Your Trip Information',
        destination: '📍 Where do you want to go?',
        destinationPlaceholder: 'e.g., Paris, Tokyo, Bali...',
        destinationHint: 'Leave blank for AI suggestions',
        startDate: '📅 Start Date',
        endDate: '📅 End Date',
        budget: '💰 Budget',
        budgetPlaceholder: 'e.g., 500',
        currency: 'USD',
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
        resultTitle: '🎉 Your Itinerary',
        editButton: '✏️ Edit',
        chatPlaceholder: 'Ask something about travel...',
        sendButton: 'Send',
        welcomeMessage: 'Hello! I\'m your AI travel assistant. Ask me about destinations, hotels, activities, or travel advice!',
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
    localStorage.setItem('preferredLanguage', lang);
}

function updateUIText() {
    document.querySelectorAll('[data-i18n]').forEach(elem => {
        const key = elem.getAttribute('data-i18n');
        if (elem.tagName === 'INPUT' || elem.tagName === 'TEXTAREA') {
            elem.placeholder = t(key);
        } else {
            elem.textContent = t(key);
        }
    });
}

// Load saved language
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLanguage') || 'vi';
    switchLanguage(savedLang);
});