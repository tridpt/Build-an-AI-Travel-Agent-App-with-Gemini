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
    const blocks = markdown.split(/\n\s*\n/);
    const htmlBlocks = blocks.map(block => {
        block = block.trim();
        if (block.length === 0) return '';
        if (block.startsWith('#### ')) return `<h4>${block.substring(5)}</h4>`;
        if (block.startsWith('### ')) return `<h3>${block.substring(4)}</h3>`;
        if (block.startsWith('## ')) return `<h2>${block.substring(3)}</h2>`;
        if (block.startsWith('# ')) return `<h1>${block.substring(2)}</h1>`;
        if (block === '---') return '<hr>';
        if (/^(\*|-|\d+\.) /m.test(block)) {
            const lines = block.split('\n');
            const listItems = lines.map(line => '<li>' + line.replace(/^(\*|-|\d+\.) /, '').trim() + '</li>').join('\n');
            if (block.startsWith('* ') || block.startsWith('- ')) {
                return `<ul>\n${listItems}\n</ul>`;
            } else {
                return `<ol>\n${listItems}\n</ol>`;
            }
        }
        return `<p>${block.replace(/\n/g, '<br>')}</p>`;
    });
    let finalHtml = htmlBlocks.join('\n');
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
const attachButton = document.getElementById('attachButton');
const imageInput = document.getElementById('imageInput');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreview = document.getElementById('imagePreview');
const removeImageButton = document.getElementById('removeImageButton');
let selectedImageFile = null;

attachButton.addEventListener('click', () => imageInput.click());

imageInput.addEventListener('change', () => {
    const file = imageInput.files[0];
    if (file) {
        selectedImageFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreviewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

removeImageButton.addEventListener('click', () => {
    selectedImageFile = null;
    imageInput.value = '';
    imagePreviewContainer.style.display = 'none';
});

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

function addMessageElement(element, isUser) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    messageDiv.classList.add(isUser ? 'user-message' : 'bot-message');
    if (isUser && element.tagName === 'IMG') {
        messageDiv.style.background = 'transparent';
        messageDiv.style.padding = '0';
    }
    messageDiv.appendChild(element);
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
    if (loading) loading.remove();
}

// TÁCH RA HÀM RIÊNG ĐỂ XỬ LÝ GỌI API VÀ HIỂN THỊ KẾT QUẢ
async function getApiResponse(formData) {
    showLoading();
    try {
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        removeLoading();
        if (data.response) {
            addMessage(data.response, false);
        } else {
            addMessage("Sorry, I couldn't process your request.", false);
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

// CẬP NHẬT LẠI HÀM SENDMESSAGE
async function sendMessage() {
    const message = userInput.value.trim();
    const imageFile = selectedImageFile;

    if (!message && !imageFile) return;

    // Hiển thị tin nhắn văn bản (nếu có)
    if (message) {
        addMessage(message, true);
    }
    
    // Reset các ô input ngay lập tức
    userInput.value = '';
    sendButton.disabled = true;
    removeImageButton.click(); // Thao tác này cũng sẽ reset selectedImageFile = null

    // Chuẩn bị dữ liệu để gửi đi
    const formData = new FormData();
    formData.append('message', message);
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    // Xử lý hiển thị và gọi API theo đúng thứ tự
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            // 1. Hiển thị ảnh của người dùng
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imgElement.style.maxWidth = '200px';
            imgElement.style.borderRadius = '10px';
            addMessageElement(imgElement, true);

            // 2. SAU KHI ảnh đã hiển thị, mới gọi API và hiển thị "loading"
            getApiResponse(formData);
        };
        reader.readAsDataURL(imageFile);
    } else {
        // Nếu chỉ có văn bản, gọi API và hiển thị "loading" luôn
        getApiResponse(formData);
    }
}


sendButton.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const exportButton = document.getElementById('exportButton');
    const exportMenu = document.getElementById('exportMenu');
    if (exportButton && exportMenu) {
        exportButton.addEventListener('click', (e) => {
            e.stopPropagation();
            exportMenu.classList.toggle('show');
        });
        document.addEventListener('click', (e) => {
            if (!exportButton.contains(e.targeget) && !exportMenu.contains(e.target)) {
                exportMenu.classList.remove('show');
            }
        });
    }
});