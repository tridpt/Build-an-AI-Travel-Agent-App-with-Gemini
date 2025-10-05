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

// Markdown to HTML
function markdownToHtml(markdown) {
    // Tách văn bản thành các khối dựa trên dòng trống
    const blocks = markdown.split(/\n\s*\n/);
    
    const htmlBlocks = blocks.map(block => {
        // Bỏ khoảng trắng thừa
        block = block.trim();
        if (block.length === 0) return '';

        // Xử lý tiêu đề
        if (block.startsWith('#### ')) return `<h4>${block.substring(5)}</h4>`;
        if (block.startsWith('### ')) return `<h3>${block.substring(4)}</h3>`;
        if (block.startsWith('## ')) return `<h2>${block.substring(3)}</h2>`;
        if (block.startsWith('# ')) return `<h1>${block.substring(2)}</h1>`;

        // Xử lý đường kẻ ngang
        if (block === '---') return '<hr>';

        // Xử lý danh sách (cả có thứ tự và không có thứ tự)
        if (/^(\*|-|\d+\.) /m.test(block)) {
            const lines = block.split('\n');
            const listItems = lines.map(line => '<li>' + line.replace(/^(\*|-|\d+\.) /, '').trim() + '</li>').join('\n');
            
            // Xác định loại danh sách
            if (block.startsWith('* ') || block.startsWith('- ')) {
                return `<ul>\n${listItems}\n</ul>`;
            } else {
                return `<ol>\n${listItems}\n</ol>`;
            }
        }

        // Mặc định là một đoạn văn
        // Thay thế các ký tự xuống dòng đơn bằng thẻ <br>
        return `<p>${block.replace(/\n/g, '<br>')}</p>`;
    });

    let finalHtml = htmlBlocks.join('\n');

    // Xử lý các định dạng inline sau khi đã xử lý các khối
    finalHtml = finalHtml.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    finalHtml = finalHtml.replace(/\*(.*?)\*/g, '<em>$1</em>');
    finalHtml = finalHtml.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="booking-link">$1 🔗</a>');
    finalHtml = finalHtml.replace(/`([^`]+)`/g, '<code>$1</code>');

    return finalHtml;
}

// ===== CHAT TAB =====
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

// Welcome message
document.addEventListener('DOMContentLoaded', () => {
    const exportButton = document.getElementById('exportButton');
    const exportMenu = document.getElementById('exportMenu');
    
    if (exportButton && exportMenu) {
        exportButton.addEventListener('click', (e) => {
            e.stopPropagation();
            exportMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!exportButton.contains(e.target) && !exportMenu.contains(e.target)) {
                exportMenu.classList.remove('show');
            }
        });
    }
});