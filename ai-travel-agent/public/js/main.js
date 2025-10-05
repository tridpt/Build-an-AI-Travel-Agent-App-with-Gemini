const chatMessages = document.getElementById('chatMessages');
const userInput = document.getElementById('userInput');
const sendButton = document.getElementById('sendButton');

// Hàm chuyển đổi Markdown sang HTML
function markdownToHtml(text) {
    // Headers (###, ##, #)
    text = text.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    text = text.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    text = text.replace(/^# (.*$)/gim, '<h1>$1</h1>');
    
    // Bold (**text**)
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Italic (*text*)
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Code blocks (```code```)
    text = text.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
    
    // Inline code (`code`)
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Links [text](url)
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    
    // Bullet lists (* item hoặc - item)
    text = text.replace(/^\* (.*$)/gim, '<li>$1</li>');
    text = text.replace(/^- (.*$)/gim, '<li>$1</li>');
    text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Numbered lists (1. item)
    text = text.replace(/^\d+\.\s+(.*$)/gim, '<li>$1</li>');
    
    // Horizontal rules (---)
    text = text.replace(/^---$/gim, '<hr>');
    
    // Line breaks
    text = text.replace(/\n\n/g, '</p><p>');
    text = text.replace(/\n/g, '<br>');
    
    return '<p>' + text + '</p>';
}

function addMessage(message, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    
    if (isUser) {
        messageDiv.textContent = message;
    } else {
        // Bot message - parse markdown
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

// Welcome message
addMessage('Xin chào! Tôi là trợ lý du lịch AI. Hãy hỏi tôi về các điểm đến, khách sạn, hoạt động hoặc lời khuyên du lịch!', false);