class TravelFormHandler {
    constructor() {
        this.generateButton = document.getElementById('generatePlanButton');
        this.planResult = document.getElementById('planResult');
        this.planContent = document.getElementById('planContent');
        this.editButton = document.getElementById('editPlanButton');
        this.budgetInput = document.getElementById('budget');
        this.budgetCurrency = document.getElementById('budgetCurrency');
        this.budgetDisplay = document.getElementById('budgetDisplay');
        
        this.initializeEventListeners();
        this.setMinDates();
        this.updateBudgetDisplay(); // Initial call
    }
    
    initializeEventListeners() {
        this.budgetInput.addEventListener('input', () => this.updateBudgetDisplay());
        this.budgetCurrency.addEventListener('change', () => this.updateBudgetDisplay());
        
        document.getElementById('startDate').addEventListener('change', (e) => {
            document.getElementById('endDate').setAttribute('min', e.target.value);
        });
        
        this.generateButton.addEventListener('click', () => this.generatePlan());
        this.editButton.addEventListener('click', () => this.editPlan());

        // START: Thêm listener cho các nút feedback của Lịch trình
        const planFeedbackContainer = document.getElementById('planFeedbackButtons');
        planFeedbackContainer.addEventListener('click', function(e) {
            if (e.target && e.target.closest('.feedback-btn')) {
                const button = e.target.closest('.feedback-btn');
                const feedback = button.dataset.feedback;

                if (button.classList.contains('active')) {
                    button.classList.remove('active');
                } else {
                    planFeedbackContainer.querySelectorAll('.feedback-btn').forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                }
                
                console.log(`Plan Feedback received: ${feedback}`);
                // Trong tương lai, bạn có thể gửi phản hồi này về server tại đây
            }
        });
        // END: Thêm listener

        this.planContent.addEventListener('mouseup', (e) => this.handleTextSelection(e));
        document.addEventListener('mousedown', (e) => this.handleDocumentClick(e));
    }

    updateBudgetDisplay() {
        const value = parseInt(this.budgetInput.value) || 0;
        const currency = this.budgetCurrency.value;
        
        let formattedValue;
        
        if (currentLang === 'vi') {
            formattedValue = value.toLocaleString('vi-VN') + ' ' + currency;
        } else {
            // For English, use standard currency symbols for better readability
            const symbols = { 'USD': '$', 'EUR': '€', 'JPY': '¥', 'VND': '₫' };
            if (symbols[currency]) {
                formattedValue = symbols[currency] + value.toLocaleString('en-US');
            } else {
                formattedValue = value.toLocaleString('en-US') + ' ' + currency;
            }
        }
        this.budgetDisplay.textContent = formattedValue;
    }
    
    setMinDates() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('startDate').setAttribute('min', today);
        document.getElementById('endDate').setAttribute('min', today);
    }
    
    getFormData() {
        return {
            startLocation: document.getElementById('startLocation').value.trim(),
            destination: document.getElementById('destination').value.trim(),
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            budget: parseInt(document.getElementById('budget').value) || 0,
            budgetCurrency: document.getElementById('budgetCurrency').value,
            travelers: parseInt(document.getElementById('travelers').value) || 1,
            travelStyle: document.getElementById('travelStyle').value,
            mustVisitPlaces: document.getElementById('mustVisitPlaces').value.trim(),
            transportation: document.getElementById('transportation').value,
            additionalInfo: document.getElementById('additionalInfo').value.trim()
        };
    }
    
    getSelectedInterests() {
        return Array.from(document.querySelectorAll('.checkbox-group input:checked'))
            .map(cb => cb.value);
    }
    
    validateForm(formData) {
        if (!formData.startDate || !formData.endDate) {
            alert(t('errorDate'));
            return false;
        }
        
        if (formData.budget <= 0) {
            alert(t('errorBudget'));
            return false;
        }
        
        if (!formData.travelStyle) {
            alert(t('errorStyle'));
            return false;
        }
        
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        
        if (days <= 0) {
            alert(t('errorEndDate'));
            return false;
        }
        
        return days;
    }
    
    buildPrompt(formData, interests, days) {
        const lang = currentLang === 'vi' ? 'VIETNAMESE' : 'ENGLISH';
        const currency = formData.budgetCurrency;
        const destination = formData.destination || 'a suitable destination based on my preferences';

        let mustVisitPrompt = '';
        if (formData.mustVisitPlaces) {
            mustVisitPrompt = `* **Must-Visit Places:** ${formData.mustVisitPlaces}`;
        }

        let prompt = `As an expert travel agent, please create a personalized and highly detailed travel itinerary in ${lang}.

**Objective:** Generate a comprehensive travel plan that is not only informative but also inspiring and easy to follow.

**Here are the traveler's details:**
* **Starting Location:** ${formData.startLocation}
* **Destination:** ${destination}
* **Travel Dates:** From ${formData.startDate} to ${formData.endDate} (${days} days)
* **Travelers:** ${formData.travelers} person(s)
* **Budget:** Approximately ${formData.budget.toLocaleString()} ${currency} (total for all travelers)
* **Travel Style:** ${formData.travelStyle}
* **Interests:** ${interests.join(', ')}
${mustVisitPrompt}
* **Preferred Transportation:** ${formData.transportation || 'Not specified'}
* **Additional Notes:** ${formData.additionalInfo || 'None'}

**Your task is to provide the following in your response:**

**1. Overall Trip Summary:**
* A brief, engaging overview of the trip.
* Highlight the main experiences and themes (e.g., "A relaxing beach getaway with a touch of cultural exploration").
* Mention the general weather conditions to expect and suggest appropriate clothing.

**2. Detailed Daily Itinerary:**
* **IMPORTANT:** The itinerary must try to incorporate the specific "Must-Visit Places" provided by the traveler.
* For each day, provide a schedule from morning to night.
* Use clear time slots (e.g., 9:00 AM - 11:00 AM).
* For each activity, include:
    * A captivating description.
    * The exact location/address.
    * Estimated time needed.
    * Ticket prices or entry fees in ${currency}.
    * Booking links (if applicable).

**3. Accommodation Recommendations:**
* Suggest 2-3 specific hotel/resort options that fit the travel style and budget.
* Use this exact format for each recommendation:
    🏨 **[Hotel Name]** | [Full Address] | [Price Range per night in ${currency}] | [Rating e.g., ⭐⭐⭐⭐⭐]

**4. Dining Suggestions:**
* Recommend a variety of restaurants for breakfast, lunch, and dinner for each day.
* Include a mix of local specialties and diverse cuisines.
* Use this exact format for each recommendation:
    🍽️ **[Restaurant Name]** | [Full Address] | [Average cost per person in ${currency}] | [Cuisine/Specialty]

**5. Detailed Budget Breakdown:**
* Provide an estimated cost breakdown for the entire trip, categorized as follows:
    * ✈️ **Transportation:** (Flights, trains, car rentals, etc.)
    * 🏨 **Accommodation:** (Total for the trip)
    * 🍽️ **Food & Dining:** (Daily estimate and total)
    * 🎟️ **Activities & Entrance Fees:**
    * 🛍️ **Shopping & Souvenirs:** (Estimate)
    * miscellaneous**:** (Buffer)
* Calculate the **Total Estimated Cost** in ${currency} and compare it to the traveler's budget.

**6. Pro Tips & Important Information:**
* Include practical advice for the destination (e.g., local customs, safety tips, best ways to get around).
* Suggest money-saving hacks.
* Provide useful phrases in the local language (if applicable).

**Formatting and Language Requirements:**
* **Language:** The entire response must be in **${lang}**.
* **Currency:** All monetary values must be in **${currency}**.
* **Formatting:** Use Markdown extensively for clarity and visual appeal. Use headings, bold text, and emojis. IMPORTANT: For any list, you must use bullet points (* or -). Do not use numbered lists.
* **Tone:** Be friendly, enthusiastic, and helpful.

Please begin the itinerary now.`;

        return prompt;
    }
    
    async generatePlan() {
        const formData = this.getFormData();
        const interests = this.getSelectedInterests();
        const days = this.validateForm(formData);
        
        if (!days) return;
        
        const prompt = this.buildPrompt(formData, interests, days);
        
        this.generateButton.disabled = true;
        this.generateButton.textContent = t('generating');
        
        try {
            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: prompt })
            });
            
            const data = await response.json();
            
            if (data.response) {
                const enhancedResponse = this.enhanceWithBookingLinks(data.response, formData.destination);
                this.planContent.innerHTML = markdownToHtml(enhancedResponse);
                this.planResult.style.display = 'block';

                // START: Hiển thị và reset các nút feedback
                const planFeedbackButtons = document.getElementById('planFeedbackButtons');
                planFeedbackButtons.style.display = 'flex';
                planFeedbackButtons.querySelectorAll('.feedback-btn').forEach(btn => btn.classList.remove('active'));
                // END: Hiển thị và reset
                
                if (formData.destination && formData.destination.trim() !== '') {
                    if (typeof weatherHandler !== 'undefined') {
                        weatherHandler.setLanguage(currentLang);
                        await weatherHandler.displayCurrentWeather(formData.destination, 'weather-current-container');
                        await weatherHandler.displayForecast(formData.destination, 'weather-forecast-container');
                    }
                }
                
                this.planResult.scrollIntoView({ behavior: 'smooth' });
                
                tripExporter.setTripData(formData, this.planContent.innerHTML);
                shareHandler.setTripData(formData, this.planContent.innerHTML);
            } else {
                alert(t('errorPlan'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert(t('errorConnection'));
        } finally {
            this.generateButton.disabled = false;
            this.generateButton.textContent = t('generateButton');
        }
    }
    
    enhanceWithBookingLinks(text, destination) {
        // Chức năng này hiện đã được vô hiệu hóa để loại bỏ các liên kết.
        // Chúng ta chỉ trả về văn bản gốc từ AI mà không thêm vào các liên kết.
        return text;
    }
    
    editPlan() {
        this.planResult.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    /**
     * Xử lý khi người dùng bôi đen văn bản trong lịch trình
     */
    handleTextSelection(event) {
        // Dùng setTimeout để đảm bảo sự kiện 'mouseup' đã hoàn tất
        setTimeout(() => {
            const selection = window.getSelection();
            const selectedText = selection.toString().trim();

            this.removeAskPopup(); // Xóa pop-up cũ nếu có

            if (selectedText.length > 2) { // Chỉ hiện pop-up nếu chọn hơn 2 ký tự
                const range = selection.getRangeAt(0);
                const rect = range.getBoundingClientRect();
                this.createAskPopup(selectedText, rect);
            }
        }, 10);
    }

    /**
     * Tạo pop-up "Hỏi thêm"
     */
    createAskPopup(text, rect) {
        const popup = document.createElement('div');
        popup.id = 'selectionAskPopup';
        popup.className = 'selection-ask-popup';
        popup.textContent = `🔍 ${currentLang === 'vi' ? 'Hỏi thêm về' : 'Ask about'} "${text.substring(0, 20)}..."`;

        // Tính toán vị trí
        popup.style.top = `${rect.bottom + window.scrollY + 5}px`;
        popup.style.left = `${rect.left + window.scrollX + (rect.width / 2) - 75}px`; // Căn giữa

        popup.addEventListener('mousedown', (e) => e.stopPropagation()); // Ngăn sự kiện click vào pop-up làm ẩn nó đi
        popup.addEventListener('click', () => this.askAboutSelection(text));

        document.body.appendChild(popup);
    }

    /**
     * Xử lý khi người dùng click vào pop-up
     */
    askAboutSelection(text) {
        this.removeAskPopup();

        // Chuyển sang tab chat
        const chatTabButton = document.querySelector('.tab-button[data-tab="chat"]');
        if (chatTabButton) chatTabButton.click();

        // Điền câu hỏi và gửi
        const userInput = document.getElementById('userInput');
        const sendButton = document.getElementById('sendButton');

        userInput.value = `${currentLang === 'vi' ? 'Giải thích thêm về' : 'Explain more about'}: "${text}"`;
        sendButton.click();
    }

    /**
     * Xóa pop-up "Hỏi thêm" khỏi DOM
     */
    removeAskPopup() {
        const existingPopup = document.getElementById('selectionAskPopup');
        if (existingPopup) {
            existingPopup.remove();
        }
    }

    /**
     * Xử lý click trên toàn bộ document để ẩn pop-up
     */
    handleDocumentClick(event) {
        const popup = document.getElementById('selectionAskPopup');
        if (popup && !popup.contains(event.target)) {
            this.removeAskPopup();
        }
    }
}

let formHandler;
document.addEventListener('DOMContentLoaded', () => {
    formHandler = new TravelFormHandler();
});