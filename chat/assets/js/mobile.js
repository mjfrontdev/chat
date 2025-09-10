/* ===== Mobile & Tablet JavaScript ===== */

class MobileChatApp {
    constructor() {
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        this.sidebarOpen = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.touchEndX = 0;
        this.touchEndY = 0;
        this.swipeThreshold = 50;
        this.pullToRefreshThreshold = 80;
        this.isPulling = false;
        this.pullDistance = 0;
        
        this.init();
    }
    
    init() {
        this.detectDevice();
        this.initEventListeners();
        this.initTouchGestures();
        this.initPullToRefresh();
        this.initBottomNavigation();
        this.initFloatingActionButton();
        this.initSwipeNavigation();
        this.initKeyboardHandling();
        this.initViewportHandling();
    }
    
    /* ===== Device Detection ===== */
    detectDevice() {
        const userAgent = navigator.userAgent.toLowerCase();
        this.isIOS = /iphone|ipad|ipod/.test(userAgent);
        this.isAndroid = /android/.test(userAgent);
        this.isTouchDevice = 'ontouchstart' in window;
        
        // Add device classes to body
        document.body.classList.add(this.isMobile ? 'mobile' : 'desktop');
        document.body.classList.add(this.isTablet ? 'tablet' : '');
        document.body.classList.add(this.isIOS ? 'ios' : '');
        document.body.classList.add(this.isAndroid ? 'android' : '');
        document.body.classList.add(this.isTouchDevice ? 'touch' : 'no-touch');
    }
    
    /* ===== Event Listeners ===== */
    initEventListeners() {
        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => this.toggleSidebar());
        }
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Orientation change
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleOrientationChange(), 100);
        });
        
        // Back button (Android)
        window.addEventListener('popstate', () => this.handleBackButton());
        
        // Contact item clicks
        $(document).on('click', '.contact-item', (e) => {
            if (this.isMobile) {
                this.selectContactMobile(e);
            }
        });
        
        // Message input focus
        const messageInput = document.getElementById('message-input');
        if (messageInput) {
            messageInput.addEventListener('focus', () => this.handleInputFocus());
            messageInput.addEventListener('blur', () => this.handleInputBlur());
        }
    }
    
    /* ===== Touch Gestures ===== */
    initTouchGestures() {
        if (!this.isTouchDevice) return;
        
        // Swipe gestures for contacts
        $(document).on('touchstart', '.contact-item', (e) => {
            this.handleTouchStart(e);
        });
        
        $(document).on('touchmove', '.contact-item', (e) => {
            this.handleTouchMove(e);
        });
        
        $(document).on('touchend', '.contact-item', (e) => {
            this.handleTouchEnd(e);
        });
        
        // Swipe to close sidebar
        $(document).on('touchstart', '.sidebar', (e) => {
            this.handleSidebarTouchStart(e);
        });
        
        $(document).on('touchmove', '.sidebar', (e) => {
            this.handleSidebarTouchMove(e);
        });
        
        $(document).on('touchend', '.sidebar', (e) => {
            this.handleSidebarTouchEnd(e);
        });
    }
    
    handleTouchStart(e) {
        const touch = e.originalEvent.touches[0];
        this.touchStartX = touch.clientX;
        this.touchStartY = touch.clientY;
        this.touchStartTime = Date.now();
    }
    
    handleTouchMove(e) {
        const touch = e.originalEvent.touches[0];
        this.touchEndX = touch.clientX;
        this.touchEndY = touch.clientY;
        
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        
        // Prevent default if horizontal swipe
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            e.preventDefault();
        }
        
        // Apply swipe transform
        if (Math.abs(deltaX) > 10) {
            const contactItem = e.currentTarget;
            const swipeDistance = Math.min(Math.abs(deltaX), 80);
            const direction = deltaX > 0 ? 1 : -1;
            
            contactItem.style.transform = `translateX(${swipeDistance * direction}px)`;
            contactItem.style.transition = 'none';
        }
    }
    
    handleTouchEnd(e) {
        const deltaX = this.touchEndX - this.touchStartX;
        const deltaY = this.touchEndY - this.touchStartY;
        const deltaTime = Date.now() - this.touchStartTime;
        
        const contactItem = e.currentTarget;
        
        // Reset transform
        contactItem.style.transition = 'transform 0.2s ease';
        contactItem.style.transform = 'translateX(0)';
        
        // Check for swipe gesture
        if (Math.abs(deltaX) > this.swipeThreshold && Math.abs(deltaY) < 50 && deltaTime < 300) {
            if (deltaX > 0) {
                this.handleSwipeRight(contactItem);
            } else {
                this.handleSwipeLeft(contactItem);
            }
        }
    }
    
    handleSwipeRight(contactItem) {
        // Show contact actions
        this.showContactActions(contactItem);
    }
    
    handleSwipeLeft(contactItem) {
        // Quick actions
        this.showQuickActions(contactItem);
    }
    
    /* ===== Sidebar Touch Handling ===== */
    handleSidebarTouchStart(e) {
        if (!this.sidebarOpen) return;
        
        const touch = e.originalEvent.touches[0];
        this.sidebarTouchStartX = touch.clientX;
    }
    
    handleSidebarTouchMove(e) {
        if (!this.sidebarOpen) return;
        
        const touch = e.originalEvent.touches[0];
        const deltaX = touch.clientX - this.sidebarTouchStartX;
        
        if (deltaX < 0) {
            e.preventDefault();
            const sidebar = document.querySelector('.sidebar');
            sidebar.style.transform = `translateX(${Math.max(deltaX, -300)}px)`;
        }
    }
    
    handleSidebarTouchEnd(e) {
        if (!this.sidebarOpen) return;
        
        const touch = e.originalEvent.changedTouches[0];
        const deltaX = touch.clientX - this.sidebarTouchStartX;
        
        const sidebar = document.querySelector('.sidebar');
        sidebar.style.transition = 'transform 0.3s ease';
        
        if (deltaX < -100) {
            this.closeSidebar();
        } else {
            sidebar.style.transform = 'translateX(0)';
        }
    }
    
    /* ===== Pull to Refresh ===== */
    initPullToRefresh() {
        if (!this.isMobile) return;
        
        const contactsContainer = document.getElementById('contacts-list');
        if (!contactsContainer) return;
        
        // Create pull to refresh indicator
        const pullToRefresh = document.createElement('div');
        pullToRefresh.className = 'pull-to-refresh';
        pullToRefresh.innerHTML = '<i class="fas fa-sync-alt"></i>';
        contactsContainer.parentNode.insertBefore(pullToRefresh, contactsContainer);
        
        let startY = 0;
        let currentY = 0;
        let isPulling = false;
        
        contactsContainer.addEventListener('touchstart', (e) => {
            if (contactsContainer.scrollTop === 0) {
                startY = e.touches[0].clientY;
                isPulling = true;
            }
        });
        
        contactsContainer.addEventListener('touchmove', (e) => {
            if (!isPulling) return;
            
            currentY = e.touches[0].clientY;
            const pullDistance = currentY - startY;
            
            if (pullDistance > 0) {
                e.preventDefault();
                this.pullDistance = Math.min(pullDistance, this.pullToRefreshThreshold);
                
                if (this.pullDistance > 20) {
                    pullToRefresh.classList.add('show');
                }
                
                contactsContainer.style.transform = `translateY(${this.pullDistance * 0.5}px)`;
            }
        });
        
        contactsContainer.addEventListener('touchend', () => {
            if (!isPulling) return;
            
            isPulling = false;
            contactsContainer.style.transition = 'transform 0.3s ease';
            contactsContainer.style.transform = 'translateY(0)';
            
            if (this.pullDistance > this.pullToRefreshThreshold) {
                this.refreshContacts();
            }
            
            pullToRefresh.classList.remove('show');
            this.pullDistance = 0;
        });
    }
    
    refreshContacts() {
        // Show loading animation
        const pullToRefresh = document.querySelector('.pull-to-refresh');
        pullToRefresh.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        
        // Reload contacts
        if (window.contactManager) {
            window.contactManager.loadContacts().then(() => {
                setTimeout(() => {
                    pullToRefresh.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(() => {
                        pullToRefresh.classList.remove('show');
                    }, 1000);
                }, 500);
            });
        }
    }
    
    /* ===== Bottom Navigation ===== */
    initBottomNavigation() {
        if (!this.isMobile) return;
        
        const bottomNav = document.createElement('div');
        bottomNav.className = 'bottom-nav';
        bottomNav.innerHTML = `
            <a href="#" class="bottom-nav-item active" data-tab="contacts">
                <i class="fas fa-users"></i>
                <span>مخاطبین</span>
            </a>
            <a href="#" class="bottom-nav-item" data-tab="chats">
                <i class="fas fa-comments"></i>
                <span>چت‌ها</span>
            </a>
            <a href="#" class="bottom-nav-item" data-tab="settings">
                <i class="fas fa-cog"></i>
                <span>تنظیمات</span>
            </a>
        `;
        
        document.body.appendChild(bottomNav);
        
        // Handle bottom nav clicks
        bottomNav.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = e.target.closest('.bottom-nav-item').dataset.tab;
            this.switchTab(tab);
        });
    }
    
    switchTab(tab) {
        // Update active tab
        document.querySelectorAll('.bottom-nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        
        // Handle tab switching
        switch (tab) {
            case 'contacts':
                this.showContacts();
                break;
            case 'chats':
                this.showChats();
                break;
            case 'settings':
                this.showSettings();
                break;
        }
    }
    
    /* ===== Floating Action Button ===== */
    initFloatingActionButton() {
        if (!this.isMobile) return;
        
        const fab = document.createElement('div');
        fab.className = 'fab';
        fab.innerHTML = '<i class="fas fa-plus"></i>';
        fab.title = 'اضافه کردن مخاطب';
        
        document.body.appendChild(fab);
        
        fab.addEventListener('click', () => {
            $('#addContactModal').modal('show');
        });
        
        // Hide FAB when keyboard is open
        this.handleKeyboardVisibility();
    }
    
    handleKeyboardVisibility() {
        let initialViewportHeight = window.innerHeight;
        
        window.addEventListener('resize', () => {
            const currentHeight = window.innerHeight;
            const heightDifference = initialViewportHeight - currentHeight;
            
            const fab = document.querySelector('.fab');
            if (fab) {
                if (heightDifference > 150) {
                    // Keyboard is open
                    fab.style.display = 'none';
                } else {
                    // Keyboard is closed
                    fab.style.display = 'flex';
                }
            }
        });
    }
    
    /* ===== Swipe Navigation ===== */
    initSwipeNavigation() {
        if (!this.isMobile) return;
        
        const chatArea = document.querySelector('.chat-area');
        if (!chatArea) return;
        
        let startX = 0;
        let startY = 0;
        let isSwipe = false;
        
        chatArea.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isSwipe = false;
        });
        
        chatArea.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const currentX = e.touches[0].clientX;
            const currentY = e.touches[0].clientY;
            
            const diffX = Math.abs(currentX - startX);
            const diffY = Math.abs(currentY - startY);
            
            if (diffX > diffY && diffX > 50) {
                isSwipe = true;
                e.preventDefault();
            }
        });
        
        chatArea.addEventListener('touchend', (e) => {
            if (!isSwipe) return;
            
            const endX = e.changedTouches[0].clientX;
            const diffX = endX - startX;
            
            if (Math.abs(diffX) > 100) {
                if (diffX > 0) {
                    // Swipe right - show sidebar
                    this.openSidebar();
                } else {
                    // Swipe left - hide sidebar
                    this.closeSidebar();
                }
            }
            
            startX = 0;
            startY = 0;
            isSwipe = false;
        });
    }
    
    /* ===== Keyboard Handling ===== */
    initKeyboardHandling() {
        const messageInput = document.getElementById('message-input');
        if (!messageInput) return;
        
        messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
        
        // Auto-resize textarea
        messageInput.addEventListener('input', () => {
            this.autoResizeTextarea(messageInput);
        });
    }
    
    autoResizeTextarea(textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
    
    /* ===== Viewport Handling ===== */
    initViewportHandling() {
        // Prevent zoom on input focus (iOS)
        if (this.isIOS) {
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    const viewport = document.querySelector('meta[name="viewport"]');
                    if (viewport) {
                        viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
                    }
                });
                
                input.addEventListener('blur', () => {
                    const viewport = document.querySelector('meta[name="viewport"]');
                    if (viewport) {
                        viewport.content = 'width=device-width, initial-scale=1.0';
                    }
                });
            });
        }
    }
    
    /* ===== Sidebar Management ===== */
    toggleSidebar() {
        if (this.sidebarOpen) {
            this.closeSidebar();
        } else {
            this.openSidebar();
        }
    }
    
    openSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.add('show');
            this.sidebarOpen = true;
            
            // Add overlay
            this.addOverlay();
        }
    }
    
    closeSidebar() {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.classList.remove('show');
            this.sidebarOpen = false;
            
            // Remove overlay
            this.removeOverlay();
        }
    }
    
    addOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            z-index: 998;
        `;
        
        overlay.addEventListener('click', () => this.closeSidebar());
        document.body.appendChild(overlay);
    }
    
    removeOverlay() {
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    /* ===== Contact Selection ===== */
    selectContactMobile(e) {
        const contactItem = e.currentTarget;
        const contactId = contactItem.dataset.contactId;
        
        if (contactId) {
            // Close sidebar on mobile
            if (this.isMobile) {
                this.closeSidebar();
            }
            
            // Select contact
            this.selectContact(contactId);
        }
    }
    
    selectContact(contactId) {
        // Remove active class from all contacts
        document.querySelectorAll('.contact-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Add active class to selected contact
        const selectedContact = document.querySelector(`[data-contact-id="${contactId}"]`);
        if (selectedContact) {
            selectedContact.classList.add('active');
        }
        
        // Load messages for this contact
        this.loadMessages(contactId);
    }
    
    loadMessages(contactId) {
        // Show messages area
        document.getElementById('chat-welcome').style.display = 'none';
        document.getElementById('messages').style.display = 'block';
        document.getElementById('chat-input').style.display = 'block';
        
        // Load messages via AJAX
        $.get(`ajax/get_messages.php?user_id=${contactId}`)
            .done((data) => {
                document.getElementById('messages').innerHTML = data;
                this.scrollToBottom();
            })
            .fail(() => {
                console.error('Failed to load messages');
            });
    }
    
    scrollToBottom() {
        const messagesArea = document.getElementById('messages');
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }
    
    /* ===== Message Sending ===== */
    sendMessage() {
        const messageInput = document.getElementById('message-input');
        const message = messageInput.value.trim();
        
        if (!message || !this.currentChatUser) return;
        
        // Send message via AJAX
        $.post('ajax/send_message.php', {
            receiver_id: this.currentChatUser,
            message: message
        })
        .done(() => {
            messageInput.value = '';
            this.autoResizeTextarea(messageInput);
            this.loadMessages(this.currentChatUser);
        })
        .fail(() => {
            console.error('Failed to send message');
        });
    }
    
    /* ===== Utility Methods ===== */
    handleResize() {
        this.isMobile = window.innerWidth <= 768;
        this.isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;
        
        // Update body classes
        document.body.classList.toggle('mobile', this.isMobile);
        document.body.classList.toggle('tablet', this.isTablet);
        document.body.classList.toggle('desktop', !this.isMobile && !this.isTablet);
        
        // Close sidebar on resize to desktop
        if (!this.isMobile && this.sidebarOpen) {
            this.closeSidebar();
        }
    }
    
    handleOrientationChange() {
        // Recalculate layout after orientation change
        setTimeout(() => {
            this.handleResize();
            this.scrollToBottom();
        }, 100);
    }
    
    handleBackButton() {
        if (this.sidebarOpen) {
            this.closeSidebar();
            return;
        }
        
        // Handle other back button logic
    }
    
    handleInputFocus() {
        // Scroll to bottom when input is focused
        setTimeout(() => {
            this.scrollToBottom();
        }, 300);
    }
    
    handleInputBlur() {
        // Handle input blur
    }
    
    showContactActions(contactItem) {
        // Show contact actions menu
        console.log('Show contact actions for:', contactItem);
    }
    
    showQuickActions(contactItem) {
        // Show quick actions menu
        console.log('Show quick actions for:', contactItem);
    }
    
    showContacts() {
        // Show contacts view
        console.log('Show contacts');
    }
    
    showChats() {
        // Show chats view
        console.log('Show chats');
    }
    
    showSettings() {
        // Show settings view
        console.log('Show settings');
    }
}

// Initialize mobile app when DOM is ready
$(document).ready(function() {
    window.mobileApp = new MobileChatApp();
});
