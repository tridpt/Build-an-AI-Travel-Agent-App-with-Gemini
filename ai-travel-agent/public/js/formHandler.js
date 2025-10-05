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
            this.budgetDisplay.textContent = value.toLocaleString(currentLang === 'vi' ? 'vi-VN' : 'en-US') + ' ' + t('currency');
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
        const lang = currentLang === 'vi' ? 'TIẾNG VIỆT' : 'ENGLISH';
        const destination = formData.destination || 'suitable destinations';
        
        let prompt = `You are a professional travel consultant. Create a DETAILED travel itinerary with the following information:\n\n`;
        
        prompt += `📊 TRIP INFORMATION:\n`;
        prompt += `- Destination: ${destination}\n`;
        prompt += `- Duration: ${days} days (from ${formData.startDate} to ${formData.endDate})\n`;
        prompt += `- Budget: ${formData.budget.toLocaleString()} ${currentLang === 'vi' ? 'VNĐ' : 'USD'} for ${formData.travelers} person(s)\n`;
        prompt += `- Number of travelers: ${formData.travelers}\n`;
        prompt += `- Travel style: ${formData.travelStyle}\n`;
        
        if (formData.transportation) {
            prompt += `- Transportation: ${formData.transportation}\n`;
        }
        
        if (interests.length > 0) {
            prompt += `- Interests: ${interests.join(', ')}\n`;
        }
        
        if (formData.additionalInfo) {
            prompt += `- Additional requirements: ${formData.additionalInfo}\n`;
        }
        
        prompt += `\n📝 REQUIREMENTS:\n`;
        prompt += `1. Create DETAILED itinerary DAY BY DAY with specific TIMES\n`;
        prompt += `2. Suggest specific attractions with visit times\n`;
        prompt += `3. For HOTELS: Write EXACTLY in this format:\n`;
        prompt += `   🏨 Hotel Name | Address | Price range | Rating\n`;
        prompt += `   Example: 🏨 Dalat Palace Hotel | 2 Tran Phu Street | 2,000,000-3,000,000 VND/night | ⭐⭐⭐⭐⭐\n\n`;
        prompt += `4. For RESTAURANTS: Write EXACTLY in this format:\n`;
        prompt += `   🍽️ Restaurant Name | Address | Price range | Specialty\n`;
        prompt += `   Example: 🍽️ Quan An Ngon | 138 Nam Ky Khoi Nghia | 100,000-200,000 VND/person | Vietnamese cuisine\n\n`;
        prompt += `5. Provide DETAILED COST breakdown:\n`;
        prompt += `   - Transportation\n`;
        prompt += `   - Accommodation\n`;
        prompt += `   - Food & Dining\n`;
        prompt += `   - Entrance fees\n`;
        prompt += `   - Other expenses\n`;
        prompt += `6. Show TOTAL ESTIMATED COST and compare with budget\n`;
        prompt += `7. Provide useful TIPS to save money\n`;
        prompt += `8. Include weather info and suitable clothing\n\n`;
        
        prompt += `IMPORTANT: Always include the ADDRESS for hotels and restaurants so I can create booking/map links.\n\n`;
        
        prompt += `Please respond in ${lang} with beautiful formatting. Use emojis and markdown to highlight important parts.`;
        
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
                // Add booking links enhancement
                const enhancedResponse = this.enhanceWithBookingLinks(data.response, formData.destination);
                this.planContent.innerHTML = markdownToHtml(enhancedResponse);
                this.planResult.style.display = 'block';
                this.planResult.scrollIntoView({ behavior: 'smooth' });
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
        // Extract hotel pattern: 🏨 Name | Address | Price | Rating
        text = text.replace(/🏨\s*([^|\n]+)\s*\|([^|\n]*)\|([^|\n]*)\|?([^\n]*)/g, (match, name, address, price, rating) => {
            name = name.trim();
            address = address.trim();
            price = price.trim();
            rating = rating.trim();
            
            // Create search queries
            const bookingQuery = encodeURIComponent(`${name} ${destination || ''}`);
            const agodaQuery = encodeURIComponent(`${name} ${destination || ''}`);
            const mapsQuery = encodeURIComponent(`${name} ${address} ${destination || ''}`);
            
            return `🏨 **${name}**
📍 ${address}
💵 ${price}
${rating ? '⭐ ' + rating : ''}

**Đặt phòng:**
- [Booking.com](https://www.booking.com/search.html?ss=${bookingQuery}) 
- [Agoda](https://www.agoda.com/search?city=${agodaQuery})
- [Google Maps](https://www.google.com/maps/search/${mapsQuery})

---`;
        });
        
        // Extract restaurant pattern: 🍽️ Name | Address | Price | Specialty
        text = text.replace(/🍽️\s*([^|\n]+)\s*\|([^|\n]*)\|([^|\n]*)\|?([^\n]*)/g, (match, name, address, price, specialty) => {
            name = name.trim();
            address = address.trim();
            price = price.trim();
            specialty = specialty.trim();
            
            // Create search queries
            const mapsQuery = encodeURIComponent(`${name} ${address} ${destination || ''}`);
            const googleQuery = encodeURIComponent(`${name} restaurant ${destination || ''}`);
            
            return `🍽️ **${name}**
📍 ${address}
💵 ${price}
${specialty ? '🍴 ' + specialty : ''}

**Tìm kiếm:**
- [Google Maps](https://www.google.com/maps/search/${mapsQuery})
- [Google Search](https://www.google.com/search?q=${googleQuery})

---`;
        });
        
        // Also handle simple hotel mentions
        text = text.replace(/🏨\s*([^\n]+?)(?=\n|$)/g, (match, hotelInfo) => {
            const searchQuery = encodeURIComponent(hotelInfo.trim() + ' ' + (destination || ''));
            return `🏨 ${hotelInfo.trim()} - [Booking.com](https://www.booking.com/search.html?ss=${searchQuery}) | [Agoda](https://www.agoda.com/search?city=${searchQuery})`;
        });
        
        // Also handle simple restaurant mentions
        text = text.replace(/🍽️\s*([^\n]+?)(?=\n|$)/g, (match, restaurantInfo) => {
            const searchQuery = encodeURIComponent(restaurantInfo.trim() + ' ' + (destination || ''));
            return `🍽️ ${restaurantInfo.trim()} - [Google Maps](https://www.google.com/maps/search/${searchQuery})`;
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