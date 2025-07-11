class AIChat {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.isTyping = false;
        this.init();
    }

    init() {
        this.createChatInterface();
        this.bindEvents();
    }

    createChatInterface() {
        const chatHTML = `
            <div id="ai-chat-container" class="ai-chat-container closed">
                <div class="ai-chat-header">
                    <div class="ai-header-content">
                        <div class="ai-avatar">🤖</div>
                        <div class="ai-header-text">
                            <h3>AI Assistant</h3>
                            <p>I find the best products for you</p>
                        </div>
                    </div>
                    <button class="ai-close-btn" onclick="aiChat.toggleChat()">✕</button>
                </div>
                
                <div class="ai-chat-messages" id="ai-messages">
                    <div class="ai-message ai-message-bot">
                        <div class="ai-message-avatar">🤖</div>
                        <div class="ai-message-content">
                            <p>Hello! I'm your FiCo AI assistant. How can I help you?</p>
                            <div class="ai-suggestions">
                                <button onclick="aiChat.sendSuggestion('Budget $300, best phone recommendation')">📱 Phone suggestion</button>
                                <button onclick="aiChat.sendSuggestion('Looking for gaming laptop')">💻 Gaming laptop</button>
                                <button onclick="aiChat.sendSuggestion('Home fitness equipment')">🏋️ Sports equipment</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="ai-chat-input">
                    <div class="ai-input-container">
                        <textarea 
                            id="ai-input" 
                            placeholder="What do you need? Specify your budget and preferences..."
                            rows="1"
                            onkeydown="aiChat.handleKeyDown(event)"
                        ></textarea>
                        <button id="ai-send-btn" onclick="aiChat.sendMessage()">
                            <span class="send-icon">➤</span>
                        </button>
                    </div>
                </div>
            </div>
            
            <button id="ai-chat-toggle" class="ai-chat-toggle" onclick="aiChat.toggleChat()">
                <span class="ai-toggle-icon">🤖</span>
                <span class="ai-toggle-text">AI Assistant</span>
            </button>
        `;
        
        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    bindEvents() {
        // Auto-resize textarea
        const textarea = document.getElementById('ai-input');
        textarea.addEventListener('input', this.autoResize);
    }

    autoResize(e) {
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    }

    toggleChat() {
        const container = document.getElementById('ai-chat-container');
        const toggle = document.getElementById('ai-chat-toggle');
        
        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            container.classList.remove('closed');
            toggle.style.display = 'none';
            document.getElementById('ai-input').focus();
        } else {
            container.classList.add('closed');
            toggle.style.display = 'flex';
        }
    }

    handleKeyDown(event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }

    sendSuggestion(text) {
        document.getElementById('ai-input').value = text;
        this.sendMessage();
    }

    async sendMessage() {
        const input = document.getElementById('ai-input');
        const message = input.value.trim();
        
        if (!message || this.isTyping) return;
        
        // Add user message
        this.addMessage(message, 'user');
        input.value = '';
        input.style.height = 'auto';
        
        // Show typing indicator
        this.showTyping();
        
        try {
            // Call AI endpoint
            const response = await fetch(`${BACKEND_URL}/api/ai-search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: message })
            });
            
            const data = await response.json();
            
            this.hideTyping();
            
            if (data.error) {
                this.addMessage('Sorry, an error occurred. Please try again.', 'bot');
                return;
            }
            
            // Add AI response
            this.addMessage(data.response, 'bot');
            
            // Show products if any
            if (data.products && data.products.length > 0) {
                this.showProducts(data.products);
            }
            
        } catch (error) {
            this.hideTyping();
            this.addMessage('Connection error occurred. Please try again.', 'bot');
        }
    }

    addMessage(content, type) {
        const messagesContainer = document.getElementById('ai-messages');
        const avatar = type === 'user' ? '👤' : '🤖';
        
        const messageHTML = `
            <div class="ai-message ai-message-${type}">
                <div class="ai-message-avatar">${avatar}</div>
                <div class="ai-message-content">
                    <p>${content}</p>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showProducts(products) {
        const messagesContainer = document.getElementById('ai-messages');
        
        const productsHTML = `
            <div class="ai-message ai-message-bot">
                <div class="ai-message-avatar">🤖</div>
                <div class="ai-message-content">
                    <p>My recommendations for you:</p>
                    <div class="ai-products">
                        ${products.slice(0, 3).map(product => `
                            <div class="ai-product-card">
                                <img src="${product.image}" alt="${product.name}" loading="lazy">
                                <div class="ai-product-info">
                                    <h4>${product.name}</h4>
                                    <p class="ai-product-store">🏪 ${product.store}</p>
                                    <div class="ai-product-rating">
                                        <span>⭐ ${product.rating}</span>
                                        <span class="ai-product-price">${product.price}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <button class="ai-show-all-btn" onclick="aiChat.showAllResults(${JSON.stringify(products).replace(/"/g, '&quot;')})">
                        View all results (${products.length})
                    </button>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    showAllResults(products) {
        // Close chat and show results in main area
        this.toggleChat();
        
        // Show products in main results area
        if (typeof renderResults === "function") {
            renderResults(products);
        }
        
        // Scroll to results
        document.querySelector('.results-container').scrollIntoView({ 
            behavior: 'smooth' 
        });
    }

    showTyping() {
        this.isTyping = true;
        const messagesContainer = document.getElementById('ai-messages');
        
        const typingHTML = `
            <div class="ai-message ai-message-bot ai-typing" id="ai-typing">
                <div class="ai-message-avatar">🤖</div>
                <div class="ai-message-content">
                    <div class="ai-typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', typingHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        this.isTyping = false;
        const typingElement = document.getElementById('ai-typing');
        if (typingElement) {
            typingElement.remove();
        }
    }
}

// Initialize AI Chat when page loads
let aiChat;
document.addEventListener('DOMContentLoaded', () => {
    aiChat = new AIChat();
});
