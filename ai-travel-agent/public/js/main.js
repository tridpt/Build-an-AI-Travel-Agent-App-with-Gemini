// Tab switching
const tabButtons = document.querySelectorAll('.tab-button');
const tabContents = document.querySelectorAll('.tab-content');

tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.hasAttribute('href')) return;
        const tabName = button.dataset.tab;
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        button.classList.add('active');
        document.getElementById(`${tabName}Tab`).classList.add('active');
    });
});

// --- BẮT ĐẦU PHẦN SỬA LỖI FORMAT ---

// Cấu hình thư viện marked.js để giữ lại các định dạng link tùy chỉnh
if (typeof marked !== 'undefined') {
    const renderer = new marked.Renderer();
    
    // Ghi đè hàm render link mặc định
    renderer.link = (href, title, text) => {
        // Thêm class 'booking-link' và icon cho tất cả các link
        const titleAttribute = title ? ` title="${title}"` : '';
        return `<a href="${href}"${titleAttribute} target="_blank" class="booking-link">${text} 🔗</a>`;
    };

    marked.setOptions({
        renderer: renderer,
        gfm: true,      // Kích hoạt chế độ tương thích GitHub Flavored Markdown
        breaks: true    // Chuyển các dấu xuống dòng đơn thành thẻ <br>
    });
}

// Hàm markdownToHtml giờ sẽ sử dụng thư viện marked.js mạnh mẽ
function markdownToHtml(markdown) {
    if (typeof marked === 'undefined') {
        console.error("Thư viện marked.js chưa được tải.");
        // Fallback đơn giản để tránh lỗi
        return markdown.replace(/\n/g, '<br>');
    }
    // Thư viện sẽ tự động xử lý tất cả các định dạng phức tạp, bao gồm cả danh sách nhiều cấp.
    return marked.parse(markdown);
}

// --- KẾT THÚC PHẦN SỬA LỖI FORMAT ---


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

if (attachButton) {
    attachButton.addEventListener('click', () => imageInput.click());
}

if (imageInput) {
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
}

if (removeImageButton) {
    removeImageButton.addEventListener('click', () => {
        selectedImageFile = null;
        imageInput.value = '';
        imagePreviewContainer.style.display = 'none';
    });
}


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

async function sendMessage() {
    const message = userInput.value.trim();
    const imageFile = selectedImageFile;

    if (!message && !imageFile) return;

    if (message) {
        addMessage(message, true);
    }
    
    userInput.value = '';
    sendButton.disabled = true;
    removeImageButton.click();

    const formData = new FormData();
    formData.append('message', message);
    if (imageFile) {
        formData.append('image', imageFile);
    }
    
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imgElement.style.maxWidth = '200px';
            imgElement.style.borderRadius = '10px';
            addMessageElement(imgElement, true);
            getApiResponse(formData);
        };
        reader.readAsDataURL(imageFile);
    } else {
        getApiResponse(formData);
    }
}

if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
}

if (userInput) {
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {
    // Thêm tin nhắn chào mừng vào khung chat
    if (chatMessages && chatMessages.children.length === 0) {
        addMessage(t('welcomeMessage'), false);
    }

    const exportButton = document.getElementById('exportButton');
    const exportMenu = document.getElementById('exportMenu');
    if (exportButton && exportMenu) {
        exportButton.addEventListener('click', (e) => {
            e.stopPropagation();
            exportMenu.classList.toggle('show');
        });
    }

    const shareButton = document.getElementById('shareButton');
    const shareMenu = document.getElementById('shareMenu');
    if (shareButton && shareMenu) {
        shareButton.addEventListener('click', (e) => {
            e.stopPropagation();
            shareMenu.classList.toggle('show');
        });
    }

    // Lắng nghe click toàn cục để đóng menu
    document.addEventListener('click', (e) => {
        if (exportMenu && !exportButton.contains(e.target) && !exportMenu.contains(e.target)) {
            exportMenu.classList.remove('show');
        }
        if (shareMenu && !shareButton.contains(e.target) && !shareMenu.contains(e.target)) {
            shareMenu.classList.remove('show');
        }
    });
});