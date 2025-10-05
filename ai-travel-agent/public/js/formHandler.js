class TravelFormHandler {
    constructor() {
        this.generateButton = document.getElementById('generatePlanButton');
        this.planResult = document.getElementById('planResult');
        this.planContent = document.getElementById('planContent');
        this.editButton = document.getElementById('editPlanButton');
        this.budgetInput = document.getElementById('budget');
        this.budgetDisplay = document.getElementById('budgetDisplay');
        
        this.initializeEventListeners();
        this.setMinDates();
    }
    
    initializeEventListeners() {
        // Budget formatting
        this.budgetInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value) || 0;
            if (currentLang === 'vi') {
                this.budgetDisplay.textContent = value.toLocaleString('vi-VN') + ' ' + t('currency');
            } else {
                this.budgetDisplay.textContent = t('currencySymbol') + value.toLocaleString('en-US');
            }
        });
        
        // Date validation
        document.getElementById('startDate').addEventListener('change', (e) => {
            document.getElementById('endDate').setAttribute('min', e.target.value);
        });
        
        // Generate button
        this.generateButton.addEventListener('click', () => this.generatePlan());
        
        // Edit button
        this.editButton.addEventListener('click', () => this.editPlan());
    }
    
    setMinDates() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('startDate').setAttribute('min', today);
        document.getElementById('endDate').setAttribute('min', today);
    }
    
    getFormData() {
        return {
            destination: document.getElementById('destination').value.trim(),
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value,
            budget: parseInt(document.getElementById('budget').value) || 0,
            travelers: parseInt(document.getElementById('travelers').value) || 1,
            travelStyle: document.getElementById('travelStyle').value,
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
        const currency = t('currency');
        const destination = formData.destination || 'a suitable destination based on my preferences';

        let prompt = `As an expert travel agent, please create a personalized and highly detailed travel itinerary in ${lang}.

**Objective:** Generate a comprehensive travel plan that is not only informative but also inspiring and easy to follow.

**Here are the traveler's details:**
* **Destination:** ${destination}
* **Travel Dates:** From ${formData.startDate} to ${formData.endDate} (${days} days)
* **Travelers:** ${formData.travelers} person(s)
* **Budget:** Approximately ${formData.budget.toLocaleString()} ${currency} (total for all travelers)
* **Travel Style:** ${formData.travelStyle}
* **Interests:** ${interests.join(', ')}
* **Preferred Transportation:** ${formData.transportation || 'Not specified'}
* **Additional Notes:** ${formData.additionalInfo || 'None'}

**Your task is to provide the following in your response:**

**1. Overall Trip Summary:**
* A brief, engaging overview of the trip.
* Highlight the main experiences and themes (e.g., "A relaxing beach getaway with a touch of cultural exploration").
* Mention the general weather conditions to expect and suggest appropriate clothing.

**2. Detailed Daily Itinerary:**
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
* **Formatting:** Use Markdown extensively for clarity and visual appeal. Use headings, bold text, bullet points, and emojis to structure the information.
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
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: prompt })
            });
            
            const data = await response.json();
            
            if (data.response) {
                const enhancedResponse = this.enhanceWithBookingLinks(data.response, formData.destination);
                this.planContent.innerHTML = markdownToHtml(enhancedResponse);
                this.planResult.style.display = 'block';
                this.planResult.scrollIntoView({ behavior: 'smooth' });
                
                // Save trip data for export
                tripExporter.setTripData(formData, this.planContent.innerHTML);
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
    // Xử lý định dạng chi tiết cho khách sạn
    text = text.replace(/🏨\s*([^|\n]+)\s*\|([^|\n]*)\|([^|\n]*)\|?([^\n]*)/g, (match, name, address, price, rating) => {
        name = name.replace(/\*\*/g, '').trim();
        address = address.trim();
        price = price.trim();
        rating = rating.trim();
        const bookingQuery = encodeURIComponent(`${name} ${destination || ''}`);
        const agodaQuery = encodeURIComponent(`${name} ${destination || ''}`);
        const mapsQuery = encodeURIComponent(`${name} ${address} ${destination || ''}`);
        const bookingLabel = currentLang === 'vi' ? 'Đặt phòng' : 'Book Now';
        return `🏨 **${name}**
📍 ${address}
💵 ${price}
${rating ? '⭐ ' + rating : ''}
**${bookingLabel}:**
- [Booking.com](https://www.booking.com/search.html?ss=${bookingQuery})
- [Agoda](https://www.agoda.com/search?city=${agodaQuery})
- [Google Maps](https://www.google.com/maps/search/?api=1&query=${mapsQuery})
---`;
    });

    // Xử lý định dạng chi tiết cho nhà hàng
    text = text.replace(/🍽️\s*([^|\n]+)\s*\|([^|\n]*)\|([^|\n]*)\|?([^\n]*)/g, (match, name, address, price, specialty) => {
        name = name.replace(/\*\*/g, '').trim();
        address = address.trim();
        price = price.trim();
        specialty = specialty.trim();
        const mapsQuery = encodeURIComponent(`${name} ${address} ${destination || ''}`);
        const googleQuery = encodeURIComponent(`${name} restaurant ${destination || ''}`);
        const searchLabel = currentLang === 'vi' ? 'Tìm kiếm' : 'Search';
        return `🍽️ **${name}**
📍 ${address}
💵 ${price}
${specialty ? '🍴 ' + specialty : ''}
**${searchLabel}:**
- [Google Maps](https://www.google.com/maps/search/?api=1&query=${mapsQuery})
- [Google Search](https://www.google.com/search?q=${googleQuery})
---`;
    });

    // Xử lý các dòng khách sạn đơn giản
    text = text.replace(/^🏨\s*([^|\n\[\]]+)$/gm, (match, hotelInfo) => {
        const cleanHotelInfo = hotelInfo.trim();
        const searchQuery = encodeURIComponent(cleanHotelInfo + ' ' + (destination || ''));
        return `🏨 ${cleanHotelInfo}
- [Booking.com](https://www.booking.com/search.html?ss=${searchQuery})
- [Agoda](https://www.agoda.com/search?city=${searchQuery})
- [Google Maps](https://www.google.com/maps/search/?api=1&query=${searchQuery})`;
    });

    // Xử lý các dòng nhà hàng/địa điểm đơn giản
    text = text.replace(/^🍽️\s*([^|\n\[\]]+)$/gm, (match, restaurantInfo) => {
        const cleanRestaurantInfo = restaurantInfo.trim();
        const mapsQuery = encodeURIComponent(cleanRestaurantInfo + ' ' + (destination || ''));
        const googleQuery = encodeURIComponent(cleanRestaurantInfo + ' restaurant ' + (destination || ''));
        return `🍽️ ${cleanRestaurantInfo}
- [Google Maps](https://www.google.com/maps/search/?api=1&query=${mapsQuery})
- [Google Search](https://www.google.com/search?q=${googleQuery})`;
    });

    return text;
}
    
    editPlan() {
        this.planResult.style.display = 'none';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Initialize form handler
let formHandler;
document.addEventListener('DOMContentLoaded', () => {
    formHandler = new TravelFormHandler();
});