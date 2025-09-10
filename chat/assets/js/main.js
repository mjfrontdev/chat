/* ===== Main JavaScript File ===== */
class ChatApp {
    constructor() {
        this.currentChatUser = null;
        this.typingTimer = null;
        this.messageInterval = null;
        this.isTyping = false;
        this.init();
    }

    init() {
        this.initAOS();
        this.initGSAP();
        this.initEventListeners();
        this.initSweetAlert();
        this.startMessagePolling();
    }

    /* ===== AOS Initialization ===== */
    initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out-cubic',
                once: true,
                offset: 100,
                delay: 100
            });
        }
    }

    /* ===== GSAP Initialization ===== */
    initGSAP() {
        if (typeof gsap !== 'undefined') {
            // Register custom ease
            gsap.registerEase("customEase", "cubic-bezier(0.4, 0, 0.2, 1)");
            
            // Set default ease
            gsap.defaults({
                ease: "customEase",
                duration: 0.6
            });
        }
    }

    /* ===== Event Listeners ===== */
    initEventListeners() {
        // User selection
        $(document).on('click', '.contact-item', (e) => {
            this.selectUser(e);
        });

        // Message sending
        $('#message-form').on('submit', (e) => {
            e.preventDefault();
            this.sendMessage();
        });

        // Typing indicator
        $('#message-input').on('keyup', () => {
            this.handleTyping();
        });

        // File attachment
        $('#attach-file').on('click', () => {
            this.handleFileAttachment();
        });

        // Mobile menu toggle
        $('#mobile-menu-toggle').on('click', () => {
            this.toggleMobileMenu();
        });

        // Window resize
        $(window).on('resize', () => {
            this.handleResize();
        });

        // Scroll to bottom on new message
        $(document).on('DOMNodeInserted', '#messages', () => {
            this.scrollToBottom();
        });
    }

    /* ===== SweetAlert2 Initialization ===== */
    initSweetAlert() {
        if (typeof Swal !== 'undefined') {
            // Configure SweetAlert2 defaults
            Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            });
        }
    }

    /* ===== User Selection ===== */
    selectUser(e) {
        const userId = $(e.currentTarget).data('contact-id') || $(e.currentTarget).data('user-id');
        if (!userId) return;

        this.currentChatUser = userId;
        
        // Update UI
        $('.contact-item').removeClass('active');
        $(e.currentTarget).addClass('active');

        // Show chat area
        $('#chat-welcome').hide();
        $('#messages').show();
        $('#chat-input').show();

        // Animate selection
        this.animateUserSelection(e.currentTarget);
        
        // Load messages
        this.loadMessages(userId);
    }

    /* ===== Animate User Selection ===== */
    animateUserSelection(element) {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(element, 
                { scale: 0.95, opacity: 0.8 },
                { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
            );
        }
    }

    /* ===== Send Message ===== */
    sendMessage() {
        if (!this.currentChatUser) {
            this.showToast('لطفا یک کاربر را برای چت انتخاب کنید', 'warning');
            return;
        }

        const message = $('#message-input').val().trim();
        if (!message) return;

        // Show sending animation
        this.showSendingAnimation();

        $.post('ajax/send_message.php', {
            receiver_id: this.currentChatUser,
            message: message
        })
        .done((response) => {
            if (response.success) {
                $('#message-input').val('');
                this.loadMessages(this.currentChatUser);
                this.showToast('پیام ارسال شد', 'success');
            } else {
                this.showToast('خطا در ارسال پیام', 'error');
            }
        })
        .fail(() => {
            this.showToast('خطا در اتصال', 'error');
        })
        .always(() => {
            this.hideSendingAnimation();
        });
    }

    /* ===== Show Sending Animation ===== */
    showSendingAnimation() {
        const sendBtn = $('.btn-send');
        sendBtn.html('<div class="loading loading-spin"></div>');
        sendBtn.prop('disabled', true);
    }

    /* ===== Hide Sending Animation ===== */
    hideSendingAnimation() {
        const sendBtn = $('.btn-send');
        sendBtn.html('<i class="fas fa-paper-plane"></i>');
        sendBtn.prop('disabled', false);
    }

    /* ===== Load Messages ===== */
    loadMessages(userId) {
        $.get('ajax/get_messages.php', { user_id: userId })
        .done((response) => {
            $('#messages').html(response);
            this.animateNewMessages();
            this.scrollToBottom();
        })
        .fail(() => {
            this.showToast('خطا در بارگذاری پیام‌ها', 'error');
        });
    }

    /* ===== Animate New Messages ===== */
    animateNewMessages() {
        const messages = $('#messages .message:not(.animated)');
        messages.each((index, element) => {
            $(element).addClass('animated');
            
            if (typeof gsap !== 'undefined') {
                gsap.fromTo(element, 
                    { opacity: 0, y: 20, scale: 0.9 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        scale: 1, 
                        duration: 0.4, 
                        delay: index * 0.1,
                        ease: "back.out(1.7)"
                    }
                );
            }
        });
    }

    /* ===== Handle Typing ===== */
    handleTyping() {
        if (!this.currentChatUser) return;

        clearTimeout(this.typingTimer);
        
        if (!this.isTyping) {
            this.isTyping = true;
            this.updateTypingStatus('typing');
        }

        this.typingTimer = setTimeout(() => {
            this.isTyping = false;
            this.updateTypingStatus('online');
        }, 1000);
    }

    /* ===== Update Typing Status ===== */
    updateTypingStatus(status) {
        $.post('ajax/update_status.php', {
            status: status,
            user_id: this.currentChatUser
        });
    }

    /* ===== Handle File Attachment ===== */
    handleFileAttachment() {
        // Create file input
        const fileInput = $('<input type="file" accept="image/*,application/pdf,.doc,.docx" style="display: none;">');
        $('body').append(fileInput);
        
        fileInput.on('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.uploadFile(file);
            }
        });
        
        fileInput.click();
    }

    /* ===== Upload File ===== */
    uploadFile(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('receiver_id', this.currentChatUser);

        this.showToast('در حال آپلود فایل...', 'info');

        $.ajax({
            url: 'ajax/upload_file.php',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: (response) => {
                if (response.success) {
                    this.showToast('فایل آپلود شد', 'success');
                    this.loadMessages(this.currentChatUser);
                } else {
                    this.showToast('خطا در آپلود فایل', 'error');
                }
            },
            error: () => {
                this.showToast('خطا در آپلود فایل', 'error');
            }
        });
    }

    /* ===== Scroll to Bottom ===== */
    scrollToBottom() {
        const messages = document.getElementById('messages');
        if (messages) {
            messages.scrollTop = messages.scrollHeight;
        }
    }

    /* ===== Start Message Polling ===== */
    startMessagePolling() {
        this.messageInterval = setInterval(() => {
            if (this.currentChatUser) {
                this.loadMessages(this.currentChatUser);
            }
        }, 3000);
    }

    /* ===== Stop Message Polling ===== */
    stopMessagePolling() {
        if (this.messageInterval) {
            clearInterval(this.messageInterval);
        }
    }

    /* ===== Toggle Mobile Menu ===== */
    toggleMobileMenu() {
        $('.sidebar').toggleClass('show');
    }

    /* ===== Handle Resize ===== */
    handleResize() {
        if ($(window).width() > 768) {
            $('.sidebar').removeClass('show');
        }
    }

    /* ===== Show Toast ===== */
    showToast(message, type = 'info') {
        if (typeof Swal !== 'undefined') {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer);
                    toast.addEventListener('mouseleave', Swal.resumeTimer);
                }
            });

            Toast.fire({
                icon: type,
                title: message
            });
        } else {
            // Fallback to alert
            alert(message);
        }
    }

    /* ===== Show Confirmation ===== */
    showConfirmation(title, text, confirmText = 'بله', cancelText = 'خیر') {
        if (typeof Swal !== 'undefined') {
            return Swal.fire({
                title: title,
                text: text,
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: confirmText,
                cancelButtonText: cancelText,
                confirmButtonColor: '#1890ff',
                cancelButtonColor: '#d9d9d9'
            });
        } else {
            return confirm(title + '\n' + text);
        }
    }

    /* ===== Show Loading ===== */
    showLoading(title = 'در حال بارگذاری...') {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: title,
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
        }
    }

    /* ===== Hide Loading ===== */
    hideLoading() {
        if (typeof Swal !== 'undefined') {
            Swal.close();
        }
    }

    /* ===== Animate Page Load ===== */
    animatePageLoad() {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo('.chat-container', 
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            );
        }
    }

    /* ===== Animate User Online Status ===== */
    animateUserOnline(userId) {
        const userItem = $(`.user-item[data-user-id="${userId}"]`);
        const statusIndicator = userItem.find('.user-status');
        
        if (statusIndicator.hasClass('status-online')) {
            statusIndicator.addClass('user-online-pulse');
        }
    }

    /* ===== Cleanup ===== */
    destroy() {
        this.stopMessagePolling();
        clearTimeout(this.typingTimer);
        $(document).off();
    }
}

/* ===== Initialize App ===== */
$(document).ready(function() {
    window.chatApp = new ChatApp();
    
    // Animate page load
    window.chatApp.animatePageLoad();
    
    // Handle page unload
    $(window).on('beforeunload', () => {
        window.chatApp.destroy();
    });
});

/* ===== Utility Functions ===== */
const Utils = {
    // Format time
    formatTime: (date) => {
        return new Date(date).toLocaleTimeString('fa-IR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Format date
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('fa-IR');
    },

    // Debounce function
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle: (func, limit) => {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Generate random ID
    generateId: () => {
        return Math.random().toString(36).substr(2, 9);
    }
};

/* ===== Export for global use ===== */
window.Utils = Utils;
