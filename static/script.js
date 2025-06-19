document.addEventListener('DOMContentLoaded', () => {
    const chatHistory = document.getElementById('chat-history');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const modelStatus = document.getElementById('model-status');
    const memoryStatus = document.getElementById('memory-status');
    const systemStatus = document.getElementById('system-status');
    
    // Initialize with a greeting message
    addMessage("Welcome to Nub Luna - The Unknown. I'm ready to assist you with your queries.", 'ai', 'SYSTEM');
    
    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;
        
        // Add user message to chat
        addMessage(message, 'user');
        userInput.value = '';
        
        try {
            // Update status
            modelStatus.textContent = 'THINKING...';
            modelStatus.style.color = '#ff003c';
            systemStatus.textContent = 'PROCESSING';
            
            // Simulate AI thinking delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Send to backend
            const response = await fetch('/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `question=${encodeURIComponent(message)}`
            });
            
            const data = await response.json();
            
            // Add AI response
            addMessage(data.response, 'ai', data.model.toUpperCase());
            
            // Update status
            modelStatus.textContent = data.model.toUpperCase();
            modelStatus.style.color = '#00ff00';
            memoryStatus.textContent = `${Math.floor(Math.random() * 20) + 1} ITEMS`;
            systemStatus.textContent = 'ONLINE';
            
        } catch (error) {
            addMessage("System Error: Couldn't connect to the AI engine", 'ai', 'ERROR');
            console.error('Error:', error);
            modelStatus.textContent = 'ERROR';
            modelStatus.style.color = '#ff0000';
            systemStatus.textContent = 'OFFLINE';
        }
    }
    
    function addMessage(text, sender, model = null) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        const now = new Date();
        const timestamp = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        let headerHtml = '';
        if (sender === 'ai') {
            headerHtml = `
                <div class="message-header">
                    <span class="ai-label">NUB LUNA</span>
                    ${model ? `<span class="model-indicator">${model}</span>` : ''}
                </div>
            `;
        }
        
        messageDiv.innerHTML = `
            ${headerHtml}
            <div class="message-content">${text}</div>
            <div class="message-footer">${timestamp}</div>
        `;
        
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }
});