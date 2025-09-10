/* ===== Advanced Chat Features ===== */

class AdvancedChatFeatures {
    constructor() {
        this.emojiPicker = null;
        this.voiceRecorder = null;
        this.messageSearch = null;
        this.pinnedMessages = [];
        this.forwardingMessages = [];
        this.reactions = ['❤️', '😂', '😮', '😢', '👍', '👎', '🔥', '💯'];
        
        this.init();
    }
    
    init() {
        this.initEmojiPicker();
        this.initVoiceRecorder();
        this.initMessageSearch();
        this.initMessageActions();
        this.initMessageReactions();
        this.initMessagePinning();
        this.initMessageForwarding();
        this.initTypingIndicator();
        this.initFileUpload();
        this.initMessageStatus();
    }
    
    /* ===== Emoji Picker ===== */
    initEmojiPicker() {
        this.createEmojiPicker();
        this.bindEmojiEvents();
    }
    
    createEmojiPicker() {
        const emojiPicker = document.createElement('div');
        emojiPicker.className = 'emoji-picker';
        emojiPicker.innerHTML = `
            <div class="emoji-picker-header">
                <span class="emoji-picker-title">انتخاب اموجی</span>
                <button class="emoji-picker-close">&times;</button>
            </div>
            <div class="emoji-picker-body">
                <div class="emoji-category">
                    <div class="emoji-category-title">محبوب</div>
                    <div class="emoji-grid" id="popular-emojis">
                        ${this.reactions.map(emoji => `<div class="emoji-item" data-emoji="${emoji}">${emoji}</div>`).join('')}
                    </div>
                </div>
                <div class="emoji-category">
                    <div class="emoji-category-title">چهره‌ها</div>
                    <div class="emoji-grid" id="face-emojis">
                        ${this.getFaceEmojis().map(emoji => `<div class="emoji-item" data-emoji="${emoji}">${emoji}</div>`).join('')}
                    </div>
                </div>
                <div class="emoji-category">
                    <div class="emoji-category-title">اشیا</div>
                    <div class="emoji-grid" id="object-emojis">
                        ${this.getObjectEmojis().map(emoji => `<div class="emoji-item" data-emoji="${emoji}">${emoji}</div>`).join('')}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(emojiPicker);
        this.emojiPicker = emojiPicker;
    }
    
    getFaceEmojis() {
        return ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐'];
    }
    
    getObjectEmojis() {
        return ['📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '💾', '💿', '📀', '📷', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '🧭', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🧱', '⛓️', '🧲', '🔫', '💣', '🧨', '🪓', '🔪', '🗡️', '⚔️', '🛡️', '🚬', '⚰️', '🪦', '⚱️', '🏺', '🔮', '📿', '🧿', '💈', '⚗️', '🔭', '🔬', '🕳️', '🩹', '🩺', '💊', '💉', '🧬', '🦠', '🧫', '🧪', '🌡️', '🧹', '🧺', '🧻', '🚽', '🚰', '🚿', '🛁', '🛀', '🧴', '🧷', '🧸', '🧵', '🧶', '🪡', '🪢', '🪣', '🧽', '🧯', '🛒', '🚬', '⚰️', '🪦', '⚱️', '🏺'];
    }
    
    bindEmojiEvents() {
        // Emoji picker toggle
        const emojiButton = document.getElementById('emoji-btn');
        if (emojiButton) {
            emojiButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleEmojiPicker();
            });
        }
        
        // Emoji selection
        this.emojiPicker.addEventListener('click', (e) => {
            if (e.target.classList.contains('emoji-item')) {
                const emoji = e.target.dataset.emoji;
                this.insertEmoji(emoji);
                this.hideEmojiPicker();
            }
        });
        
        // Close emoji picker
        this.emojiPicker.querySelector('.emoji-picker-close').addEventListener('click', () => {
            this.hideEmojiPicker();
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!this.emojiPicker.contains(e.target) && !e.target.closest('#emoji-btn')) {
                this.hideEmojiPicker();
            }
        });
    }
    
    toggleEmojiPicker() {
        if (this.emojiPicker.classList.contains('show')) {
            this.hideEmojiPicker();
        } else {
            this.showEmojiPicker();
        }
    }
    
    showEmojiPicker() {
        this.emojiPicker.classList.add('show');
        this.emojiPicker.style.animation = 'slideUp 0.3s ease-out';
    }
    
    hideEmojiPicker() {
        this.emojiPicker.classList.remove('show');
    }
    
    insertEmoji(emoji) {
        const messageInput = document.getElementById('message-input');
        if (messageInput) {
            const cursorPos = messageInput.selectionStart;
            const textBefore = messageInput.value.substring(0, cursorPos);
            const textAfter = messageInput.value.substring(messageInput.selectionEnd);
            
            messageInput.value = textBefore + emoji + textAfter;
            messageInput.selectionStart = messageInput.selectionEnd = cursorPos + emoji.length;
            messageInput.focus();
        }
    }
    
    /* ===== Voice Recorder ===== */
    initVoiceRecorder() {
        this.voiceRecorder = {
            mediaRecorder: null,
            audioChunks: [],
            isRecording: false,
            recordingStartTime: null
        };
        
        this.bindVoiceEvents();
    }
    
    bindVoiceEvents() {
        const voiceButton = document.getElementById('voice-btn');
        if (voiceButton) {
            voiceButton.addEventListener('mousedown', () => this.startVoiceRecording());
            voiceButton.addEventListener('mouseup', () => this.stopVoiceRecording());
            voiceButton.addEventListener('mouseleave', () => this.stopVoiceRecording());
            
            // Touch events for mobile
            voiceButton.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.startVoiceRecording();
            });
            voiceButton.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.stopVoiceRecording();
            });
        }
    }
    
    async startVoiceRecording() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.voiceRecorder.mediaRecorder = new MediaRecorder(stream);
            this.voiceRecorder.audioChunks = [];
            this.voiceRecorder.isRecording = true;
            this.voiceRecorder.recordingStartTime = Date.now();
            
            this.voiceRecorder.mediaRecorder.ondataavailable = (event) => {
                this.voiceRecorder.audioChunks.push(event.data);
            };
            
            this.voiceRecorder.mediaRecorder.onstop = () => {
                this.processVoiceRecording();
            };
            
            this.voiceRecorder.mediaRecorder.start();
            this.showVoiceRecordingUI();
        } catch (error) {
            console.error('Error starting voice recording:', error);
            this.showError('دسترسی به میکروفون امکان‌پذیر نیست');
        }
    }
    
    stopVoiceRecording() {
        if (this.voiceRecorder.isRecording && this.voiceRecorder.mediaRecorder) {
            this.voiceRecorder.mediaRecorder.stop();
            this.voiceRecorder.isRecording = false;
            this.hideVoiceRecordingUI();
        }
    }
    
    processVoiceRecording() {
        const audioBlob = new Blob(this.voiceRecorder.audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const duration = Date.now() - this.voiceRecorder.recordingStartTime;
        
        // Create voice message element
        const voiceMessage = this.createVoiceMessage(audioUrl, duration);
        this.sendVoiceMessage(voiceMessage);
    }
    
    createVoiceMessage(audioUrl, duration) {
        const voiceMessage = document.createElement('div');
        voiceMessage.className = 'voice-message';
        voiceMessage.innerHTML = `
            <button class="voice-play-button">
                <i class="fas fa-play"></i>
            </button>
            <div class="voice-waveform">
                <div class="voice-progress" style="width: 0%"></div>
            </div>
            <div class="voice-duration">${this.formatDuration(duration)}</div>
        `;
        
        // Add audio element
        const audio = document.createElement('audio');
        audio.src = audioUrl;
        audio.preload = 'metadata';
        
        // Bind play/pause functionality
        const playButton = voiceMessage.querySelector('.voice-play-button');
        const progress = voiceMessage.querySelector('.voice-progress');
        
        playButton.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                audio.pause();
                playButton.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
        
        audio.addEventListener('timeupdate', () => {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progress.style.width = `${progressPercent}%`;
        });
        
        audio.addEventListener('ended', () => {
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            progress.style.width = '0%';
        });
        
        voiceMessage.appendChild(audio);
        return voiceMessage;
    }
    
    formatDuration(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    
    showVoiceRecordingUI() {
        // Show recording indicator
        const recordingIndicator = document.createElement('div');
        recordingIndicator.className = 'voice-recording-indicator';
        recordingIndicator.innerHTML = `
            <div class="recording-dot"></div>
            <span>در حال ضبط...</span>
        `;
        recordingIndicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 30px;
            border-radius: 25px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 10000;
            font-size: 16px;
        `;
        
        document.body.appendChild(recordingIndicator);
        this.recordingIndicator = recordingIndicator;
    }
    
    hideVoiceRecordingUI() {
        if (this.recordingIndicator) {
            this.recordingIndicator.remove();
            this.recordingIndicator = null;
        }
    }
    
    sendVoiceMessage(voiceMessage) {
        // Add to messages area
        const messagesArea = document.getElementById('messages');
        if (messagesArea) {
            const messageDiv = document.createElement('div');
            messageDiv.className = 'message sent';
            messageDiv.appendChild(voiceMessage);
            messagesArea.appendChild(messageDiv);
            this.scrollToBottom();
        }
    }
    
    /* ===== Message Search ===== */
    initMessageSearch() {
        this.createMessageSearch();
        this.bindSearchEvents();
    }
    
    createMessageSearch() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'message-search';
        searchContainer.innerHTML = `
            <input type="text" class="message-search-input" placeholder="جستجو در پیام‌ها...">
            <i class="fas fa-search message-search-icon"></i>
            <div class="search-results"></div>
        `;
        
        // Insert after chat header
        const chatHeader = document.querySelector('.chat-header');
        if (chatHeader) {
            chatHeader.insertAdjacentElement('afterend', searchContainer);
        }
        
        this.messageSearch = searchContainer;
    }
    
    bindSearchEvents() {
        const searchInput = this.messageSearch.querySelector('.message-search-input');
        const searchResults = this.messageSearch.querySelector('.search-results');
        
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            const query = e.target.value.trim();
            
            if (query.length > 2) {
                searchTimeout = setTimeout(() => {
                    this.searchMessages(query);
                }, 300);
            } else {
                searchResults.style.display = 'none';
            }
        });
        
        // Close search results on outside click
        document.addEventListener('click', (e) => {
            if (!this.messageSearch.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
    
    async searchMessages(query) {
        try {
            const response = await fetch(`ajax/search_messages.php?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            
            if (data.success) {
                this.displaySearchResults(data.results);
            }
        } catch (error) {
            console.error('Error searching messages:', error);
        }
    }
    
    displaySearchResults(results) {
        const searchResults = this.messageSearch.querySelector('.search-results');
        
        if (results.length === 0) {
            searchResults.innerHTML = '<div class="search-result-item">نتیجه‌ای یافت نشد</div>';
        } else {
            searchResults.innerHTML = results.map(result => `
                <div class="search-result-item" data-message-id="${result.id}">
                    <div class="search-result-text">${result.message}</div>
                    <div class="search-result-meta">
                        <span>${result.sender}</span>
                        <span>${result.time}</span>
                    </div>
                </div>
            `).join('');
        }
        
        searchResults.style.display = 'block';
        
        // Bind click events
        searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const messageId = item.dataset.messageId;
                this.scrollToMessage(messageId);
                searchResults.style.display = 'none';
            });
        });
    }
    
    scrollToMessage(messageId) {
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if (messageElement) {
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            messageElement.style.background = '#fff7e6';
            setTimeout(() => {
                messageElement.style.background = '';
            }, 2000);
        }
    }
    
    /* ===== Message Actions ===== */
    initMessageActions() {
        $(document).on('contextmenu', '.message', (e) => {
            e.preventDefault();
            this.showMessageContextMenu(e);
        });
        
        $(document).on('click', '.message-action', (e) => {
            e.stopPropagation();
            const action = e.currentTarget.dataset.action;
            const messageId = e.currentTarget.closest('.message').dataset.messageId;
            this.handleMessageAction(action, messageId);
        });
    }
    
    showMessageContextMenu(e) {
        const message = e.currentTarget;
        const messageId = message.dataset.messageId;
        
        // Remove existing context menu
        const existingMenu = document.querySelector('.message-context-menu');
        if (existingMenu) {
            existingMenu.remove();
        }
        
        // Create context menu
        const contextMenu = document.createElement('div');
        contextMenu.className = 'message-context-menu';
        contextMenu.style.cssText = `
            position: fixed;
            top: ${e.clientY}px;
            right: ${window.innerWidth - e.clientX}px;
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            min-width: 150px;
        `;
        
        contextMenu.innerHTML = `
            <div class="context-menu-item" data-action="reply">
                <i class="fas fa-reply"></i>
                <span>پاسخ</span>
            </div>
            <div class="context-menu-item" data-action="forward">
                <i class="fas fa-share"></i>
                <span>ارسال مجدد</span>
            </div>
            <div class="context-menu-item" data-action="pin">
                <i class="fas fa-thumbtack"></i>
                <span>سنجاق کردن</span>
            </div>
            <div class="context-menu-item" data-action="copy">
                <i class="fas fa-copy"></i>
                <span>کپی</span>
            </div>
            <div class="context-menu-item" data-action="delete">
                <i class="fas fa-trash"></i>
                <span>حذف</span>
            </div>
        `;
        
        document.body.appendChild(contextMenu);
        
        // Bind click events
        contextMenu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                this.handleMessageAction(action, messageId);
                contextMenu.remove();
            });
        });
        
        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', () => {
                contextMenu.remove();
            }, { once: true });
        }, 100);
    }
    
    handleMessageAction(action, messageId) {
        switch (action) {
            case 'reply':
                this.replyToMessage(messageId);
                break;
            case 'forward':
                this.forwardMessage(messageId);
                break;
            case 'pin':
                this.pinMessage(messageId);
                break;
            case 'copy':
                this.copyMessage(messageId);
                break;
            case 'delete':
                this.deleteMessage(messageId);
                break;
        }
    }
    
    replyToMessage(messageId) {
        const message = document.querySelector(`[data-message-id="${messageId}"]`);
        if (message) {
            const messageText = message.querySelector('.message-content').textContent;
            const messageInput = document.getElementById('message-input');
            messageInput.value = `در پاسخ به: ${messageText}\n`;
            messageInput.focus();
        }
    }
    
    forwardMessage(messageId) {
        const message = document.querySelector(`[data-message-id="${messageId}"]`);
        if (message) {
            this.forwardingMessages.push(messageId);
            this.showForwardingUI();
        }
    }
    
    pinMessage(messageId) {
        const message = document.querySelector(`[data-message-id="${messageId}"]`);
        if (message) {
            this.pinnedMessages.push(messageId);
            this.showPinnedMessages();
            this.showSuccess('پیام سنجاق شد');
        }
    }
    
    copyMessage(messageId) {
        const message = document.querySelector(`[data-message-id="${messageId}"]`);
        if (message) {
            const messageText = message.querySelector('.message-content').textContent;
            navigator.clipboard.writeText(messageText).then(() => {
                this.showSuccess('پیام کپی شد');
            });
        }
    }
    
    deleteMessage(messageId) {
        if (confirm('آیا مطمئن هستید که می‌خواهید این پیام را حذف کنید؟')) {
            // Send delete request
            fetch('ajax/delete_message.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message_id: messageId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const message = document.querySelector(`[data-message-id="${messageId}"]`);
                    if (message) {
                        message.remove();
                    }
                    this.showSuccess('پیام حذف شد');
                }
            });
        }
    }
    
    /* ===== Message Reactions ===== */
    initMessageReactions() {
        $(document).on('click', '.message-content', (e) => {
            if (e.detail === 2) { // Double click
                this.showReactionPicker(e.currentTarget);
            }
        });
    }
    
    showReactionPicker(messageContent) {
        const message = messageContent.closest('.message');
        const messageId = message.dataset.messageId;
        
        // Create reaction picker
        const reactionPicker = document.createElement('div');
        reactionPicker.className = 'reaction-picker';
        reactionPicker.style.cssText = `
            position: absolute;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            border: 1px solid #e0e0e0;
            border-radius: 25px;
            padding: 5px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            display: flex;
            gap: 5px;
        `;
        
        reactionPicker.innerHTML = this.reactions.map(emoji => 
            `<div class="reaction-item" data-emoji="${emoji}">${emoji}</div>`
        ).join('');
        
        message.style.position = 'relative';
        message.appendChild(reactionPicker);
        
        // Bind click events
        reactionPicker.querySelectorAll('.reaction-item').forEach(item => {
            item.addEventListener('click', () => {
                const emoji = item.dataset.emoji;
                this.addReaction(messageId, emoji);
                reactionPicker.remove();
            });
        });
        
        // Remove on outside click
        setTimeout(() => {
            document.addEventListener('click', () => {
                reactionPicker.remove();
            }, { once: true });
        }, 100);
    }
    
    addReaction(messageId, emoji) {
        // Send reaction request
        fetch('ajax/add_reaction.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message_id: messageId, emoji: emoji })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.updateMessageReactions(messageId);
            }
        });
    }
    
    updateMessageReactions(messageId) {
        // Reload message reactions
        fetch(`ajax/get_message_reactions.php?message_id=${messageId}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.displayMessageReactions(messageId, data.reactions);
            }
        });
    }
    
    displayMessageReactions(messageId, reactions) {
        const message = document.querySelector(`[data-message-id="${messageId}"]`);
        if (!message) return;
        
        let reactionsContainer = message.querySelector('.message-reactions');
        if (!reactionsContainer) {
            reactionsContainer = document.createElement('div');
            reactionsContainer.className = 'message-reactions';
            message.appendChild(reactionsContainer);
        }
        
        reactionsContainer.innerHTML = reactions.map(reaction => `
            <div class="reaction ${reaction.isActive ? 'active' : ''}" data-emoji="${reaction.emoji}">
                <span>${reaction.emoji}</span>
                <span class="reaction-count">${reaction.count}</span>
            </div>
        `).join('');
    }
    
    /* ===== Message Pinning ===== */
    initMessagePinning() {
        this.loadPinnedMessages();
    }
    
    loadPinnedMessages() {
        fetch('ajax/get_pinned_messages.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.pinnedMessages = data.messages;
                this.showPinnedMessages();
            }
        });
    }
    
    showPinnedMessages() {
        if (this.pinnedMessages.length === 0) return;
        
        let pinnedContainer = document.querySelector('.pinned-messages');
        if (!pinnedContainer) {
            pinnedContainer = document.createElement('div');
            pinnedContainer.className = 'pinned-messages';
            const messagesArea = document.getElementById('messages');
            if (messagesArea) {
                messagesArea.insertBefore(pinnedContainer, messagesArea.firstChild);
            }
        }
        
        pinnedContainer.innerHTML = `
            <div class="pinned-messages-header">
                <span class="pinned-messages-title">پیام‌های سنجاق شده</span>
                <button class="pinned-messages-clear">پاک کردن</button>
            </div>
            ${this.pinnedMessages.map(message => `
                <div class="pinned-message" data-message-id="${message.id}">
                    ${message.content}
                </div>
            `).join('')}
        `;
        
        // Bind clear button
        pinnedContainer.querySelector('.pinned-messages-clear').addEventListener('click', () => {
            this.clearPinnedMessages();
        });
    }
    
    clearPinnedMessages() {
        if (confirm('آیا مطمئن هستید که می‌خواهید تمام پیام‌های سنجاق شده را پاک کنید؟')) {
            fetch('ajax/clear_pinned_messages.php', { method: 'POST' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    this.pinnedMessages = [];
                    document.querySelector('.pinned-messages').remove();
                    this.showSuccess('پیام‌های سنجاق شده پاک شدند');
                }
            });
        }
    }
    
    /* ===== Message Forwarding ===== */
    initMessageForwarding() {
        // Forwarding UI will be shown when needed
    }
    
    showForwardingUI() {
        // Show contact selection for forwarding
        this.showContactSelectionModal('forward');
    }
    
    showContactSelectionModal(type) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">انتخاب مخاطب برای ${type === 'forward' ? 'ارسال مجدد' : 'اشتراک‌گذاری'}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="contact-list" id="forward-contact-list">
                            <!-- Contacts will be loaded here -->
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">انصراف</button>
                        <button type="button" class="btn btn-primary" id="confirm-forward">تأیید</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Load contacts
        this.loadContactsForForwarding();
        
        // Show modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        // Bind events
        modal.querySelector('#confirm-forward').addEventListener('click', () => {
            this.confirmForwarding();
            bsModal.hide();
        });
        
        // Remove modal when hidden
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }
    
    loadContactsForForwarding() {
        fetch('ajax/get_contacts.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const contactList = document.getElementById('forward-contact-list');
                contactList.innerHTML = data.contacts.map(contact => `
                    <div class="contact-item" data-contact-id="${contact.contact_user_id}">
                        <input type="checkbox" class="form-check-input" value="${contact.contact_user_id}">
                        <img src="${contact.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(contact.username)}" 
                             class="contact-avatar" alt="${contact.username}">
                        <div class="contact-info">
                            <div class="contact-name">${contact.nickname || contact.username}</div>
                        </div>
                    </div>
                `).join('');
            }
        });
    }
    
    confirmForwarding() {
        const selectedContacts = Array.from(document.querySelectorAll('#forward-contact-list input:checked'))
            .map(input => input.value);
        
        if (selectedContacts.length === 0) {
            this.showError('لطفاً حداقل یک مخاطب انتخاب کنید');
            return;
        }
        
        // Send forwarding request
        fetch('ajax/forward_messages.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                message_ids: this.forwardingMessages, 
                contact_ids: selectedContacts 
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.showSuccess('پیام‌ها ارسال شدند');
                this.forwardingMessages = [];
            }
        });
    }
    
    /* ===== Typing Indicator ===== */
    initTypingIndicator() {
        this.typingUsers = new Set();
        this.typingTimeout = null;
    }
    
    showTypingIndicator(userId, username) {
        this.typingUsers.add(userId);
        this.updateTypingDisplay();
    }
    
    hideTypingIndicator(userId) {
        this.typingUsers.delete(userId);
        this.updateTypingDisplay();
    }
    
    updateTypingDisplay() {
        const typingContainer = document.querySelector('.typing-indicator');
        if (!typingContainer) return;
        
        if (this.typingUsers.size === 0) {
            typingContainer.style.display = 'none';
        } else {
            typingContainer.style.display = 'flex';
            const usernames = Array.from(this.typingUsers).join(', ');
            typingContainer.innerHTML = `
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
                <span>${usernames} در حال تایپ...</span>
            `;
        }
    }
    
    /* ===== File Upload ===== */
    initFileUpload() {
        const fileInput = document.getElementById('file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                this.handleFileUpload(e.target.files);
            });
        }
        
        const attachButton = document.getElementById('attach-file');
        if (attachButton) {
            attachButton.addEventListener('click', () => {
                fileInput.click();
            });
        }
    }
    
    handleFileUpload(files) {
        Array.from(files).forEach(file => {
            this.uploadFile(file);
        });
    }
    
    uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        
        fetch('ajax/upload_file.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.sendFileMessage(data.file_url, file.name, file.type);
            } else {
                this.showError('خطا در آپلود فایل');
            }
        });
    }
    
    sendFileMessage(fileUrl, fileName, fileType) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message sent';
        
        if (fileType.startsWith('image/')) {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <img src="${fileUrl}" alt="${fileName}" style="max-width: 200px; border-radius: 8px;">
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="file-message">
                        <i class="fas fa-file"></i>
                        <span>${fileName}</span>
                        <a href="${fileUrl}" download class="btn btn-sm btn-primary">دانلود</a>
                    </div>
                </div>
            `;
        }
        
        const messagesArea = document.getElementById('messages');
        messagesArea.appendChild(messageDiv);
        this.scrollToBottom();
    }
    
    /* ===== Message Status ===== */
    initMessageStatus() {
        // Update message status periodically
        setInterval(() => {
            this.updateMessageStatus();
        }, 5000);
    }
    
    updateMessageStatus() {
        // Get unread messages and update their status
        const unreadMessages = document.querySelectorAll('.message.sent .message-status .sent');
        unreadMessages.forEach(messageStatus => {
            // Check if message was read
            // This would typically involve an AJAX call
        });
    }
    
    /* ===== Utility Methods ===== */
    scrollToBottom() {
        const messagesArea = document.getElementById('messages');
        if (messagesArea) {
            messagesArea.scrollTop = messagesArea.scrollHeight;
        }
    }
    
    showSuccess(message) {
        // Use existing toast system or create new one
        if (window.showToast) {
            window.showToast(message, 'success');
        } else {
            alert(message);
        }
    }
    
    showError(message) {
        if (window.showToast) {
            window.showToast(message, 'error');
        } else {
            alert(message);
        }
    }
}

// Initialize advanced features when DOM is ready
$(document).ready(function() {
    window.advancedFeatures = new AdvancedChatFeatures();
});
