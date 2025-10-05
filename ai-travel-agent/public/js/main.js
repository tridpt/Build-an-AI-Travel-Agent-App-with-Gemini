// Tab switching
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.dataset.tab;
        
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        button.classList.add('active');
        document.getElementById(`${tabName}Tab`).classList.add('active');
    });
});

// Budget display formatting
const budgetInput = document.getElementById('budget');
const budgetDisplay = document.getElementById('budgetDisplay');

budgetInput.addEventListener('input', (e) => {
    const value = parseInt(e.target.value) || 0;
    budgetDisplay.textContent = value.toLocaleString('vi-VN') + ' VNĐ';
});

// Set min date to today
const today = new Date().toISOString().split('T')[0];
document.getElementById('startDate').setAttribute('min', today);
document.getElementById('endDate').setAttribute('min', today);

// Update end date min when start date changes
document.getElementById('startDate').addEventListener('change', (e) => {
    document.getElementById('endDate').setAttribute('min', e.target.value);
});

// Generate Travel Plan
const generateButton = document.getElementById('generatePlanButton');
const planResult = document.getElementById('planResult');
const planContent = document.getElementById('planContent');
const editButton = document.getElementById('editPlanButton');

generateButton.addEventListener('click', async () => {
    const formData = {
        destination: document.getElementById('destination').value.trim(),
        startDate: document.getElementById('startDate').value,
        endDate: document.getElementById('endDate').value,
        budget: parseInt(document.getElementById('budget').value) || 0,
        travelers: parseInt(document.getElementById('travelers').value) || 1,
        travelStyle: document.getElementById('travelStyle').value,
        transportation: document.getElementById('transportation').value,
        additionalInfo: document.getElementById('additionalInfo').value.trim()
    };
    
    // Get selected interests
    const interests = Array.from(document.querySelectorAll('.checkbox-group input:checked'))
        .map(cb => cb.value);
    
    // Validation
    if (!formData.startDate || !formData.endDate) {
        alert('Vui lòng chọn ngày bắt đầu và kết thúc!');
        return;
    }
    
    if (formData.budget <= 0) {
        alert('Vui lòng nhập ngân sách!');
        return;
    }
    
    if (!formData.travelStyle) {
        alert('Vui lòng chọn phong cách du lịch!');
        return;
    }
    
    // Calculate days
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    
    if (days <= 0) {
        alert('Ngày kết thúc phải sau ngày bắt đầu!');
        return;
    }
    
    // Build prompt for AI
    const prompt = buildTravelPrompt(formData, interests, days);
    
    // Call AI
    generateButton.disabled = true;
    generateButton.textContent = '⏳ Đang tạo lịch trình...';
    
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
            planContent.innerHTML = markdownToHtml(data.response);
            planResult.style.display = 'block';
            planResult.scrollIntoView({ behavior: 'smooth' });
        } else {
            alert('Không thể tạo lịch trình. Vui lòng thử lại!');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Lỗi kết nối đến server!');
    } finally {
        generateButton.disabled = false;
        generateButton.textContent = '✨ Tạo Lịch Trình Du Lịch';
    }
});

// Edit plan button
editButton.addEventListener('click', () => {
    planResult.style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Build prompt for AI
function buildTravelPrompt(formData, interests, days) {
    let prompt = `Bạn là một chuyên gia tư vấn du lịch chuyên nghiệp. Hãy tạo một lịch trình du lịch CHI TIẾT và CỤ THỂ với các thông tin sau:\n\n`;
    
    prompt += `📊 THÔNG TIN CHUYẾN ĐI:\n`;
    prompt += `- Điểm đến: ${formData.destination || 'Chưa xác định (hãy gợi ý điểm đến phù hợp)'}\n`;
    prompt += `- Thời gian: ${days} ngày (từ ${formData.startDate} đến ${formData.endDate})\n`;
    prompt += `- Ngân sách: ${formData.budget.toLocaleString('vi-VN')} VNĐ cho ${formData.travelers} người\n`;
    prompt += `- Số người đi: ${formData.travelers} người\n`;
    prompt += `- Phong cách du lịch: ${formData.travelStyle}\n`;
    
    if (formData.transportation) {
        prompt += `- Phương tiện di chuyển: ${formData.transportation}\n`;
    }
    
    if (interests.length > 0) {
        prompt += `- Sở thích: ${interests.join(', ')}\n`;
    }
    
    if (formData.additionalInfo) {
        prompt += `- Yêu cầu khác: ${formData.additionalInfo}\n`;
    }
    
    prompt += `\n📝 YÊU CẦU:\n`;
    prompt += `1. Tạo lịch trình CHI TIẾT theo TỪNG NGÀY\n`;
    prompt += `2. Gợi ý địa điểm tham quan CỤ THỂ với GIỜ GIỜ\n`;
    prompt += `3. Gợi ý nhà hàng/quán ăn với GIÁ CẢ ƯỚC TÍNH\n`;
    prompt += `4. Gợi ý khách sạn/nơi lưu trú phù hợp với ngân sách\n`;
    prompt += `5. Ước tính CHI PHÍ CHI TIẾT cho từng hạng mục:\n`;
    prompt += `   - Phương tiện di chuyển\n`;
    prompt += `   - Lưu trú\n`;
    prompt += `   - Ăn uống\n`;
    prompt += `   - Vé tham quan\n`;
    prompt += `   - Chi phí khác\n`;
    prompt += `6. Đưa ra TỔNG CHI PHÍ DỰ KIẾN và so sánh với ngân sách\n`;
    prompt += `7. Gợi ý TIPS hữu ích để tiết kiệm chi phí\n`;
    prompt += `8. Thêm thông tin về thời tiết, trang phục phù hợp\n\n`;
    
    prompt += `Hãy trả lời bằng TIẾNG VIỆT với format đẹp, dễ đọc. Sử dụng emoji và markdown để làm nổi bật các phần quan trọng.`;
    
    return prompt;
}

// Markdown to HTML (same as before)
function markdownToHtml(text) {
    text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    text = text.replace(/^\* (.*$)/gim, '<li>$1</li>');
    text = text.replace(/^- (.*$)/gim, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    text = text.replace(/^\d+\.\s+(.*$)/gim, '<li>$1</li>');
    text = text.replace(/^---$/gim, '<hr>');
    text = text.replace(/\n\n/g, '</p><p>');
    text = text.replace(/\n/g, '<br>');
    return '<p>' + text + '</p>';
}

// ===== CHAT TAB (Existing functionality) =====
const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

function addMessage(message, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    
    if (isUser) {
        messageDiv.textContent = message;
    } else {
        messageDiv.innerHTML = markdownToHtml(message);
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showLoading() {
    const loadingDiv = document.createElement('div');
    loadingDiv.classList.add('message', 'bot-message', 'loading');
    loadingDiv.innerHTML = '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    loadingDiv.id = 'loading';
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.remove();
    }
}

async function sendMessage() {
    const message = userInput.value.trim();
    
    if (!message) return;
    
    addMessage(message, true);
    userInput.value = '';
    sendButton.disabled = true;
    showLoading();
    
    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        
        const data = await response.json();
        
        removeLoading();
        
        if (data.response) {
            addMessage(data.response, false);
        } else {
            addMessage('Sorry, I couldn\'t process your request.', false);
        }
    } catch (error) {
        removeLoading();
        addMessage('Error: Unable to connect to the server.', false);
        console.error('Error:', error);
    } finally {
        sendButton.disabled = false;
        userInput.focus();
    }
}

sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Welcome message in chat
addMessage('Xin chào! Tôi là trợ lý du lịch AI. Hãy hỏi tôi về các điểm đến, khách sạn, hoạt động hoặc lời khuyên du lịch!', false);