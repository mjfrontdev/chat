/* ===== Toast Management System ===== */
class ToastManager {
    constructor() {
        this.toasts = [];
        this.maxToasts = 5;
        this.init();
    }

    init() {
        this.createToastContainer();
        this.initSweetAlert();
    }

    /* ===== Create Toast Container ===== */
    createToastContainer() {
        if (!document.getElementById('toast-container')) {
            const container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'toast-container position-fixed top-0 end-0 p-3';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
        }
    }

    /* ===== Initialize SweetAlert2 ===== */
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

    /* ===== Show Toast ===== */
    show(message, type = 'info', duration = 3000) {
        // Remove oldest toast if limit reached
        if (this.toasts.length >= this.maxToasts) {
            this.removeOldestToast();
        }

        const toastId = this.generateId();
        const toast = this.createToastElement(toastId, message, type);
        
        document.getElementById('toast-container').appendChild(toast);
        this.toasts.push(toastId);

        // Animate in
        this.animateToastIn(toast);

        // Auto remove
        setTimeout(() => {
            this.hide(toastId);
        }, duration);

        return toastId;
    }

    /* ===== Create Toast Element ===== */
    createToastElement(id, message, type) {
        const toast = document.createElement('div');
        toast.id = `toast-${id}`;
        toast.className = `toast align-items-center text-white bg-${this.getBootstrapType(type)} border-0`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');

        const icon = this.getIcon(type);
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="${icon} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;

        return toast;
    }

    /* ===== Get Bootstrap Type ===== */
    getBootstrapType(type) {
        const types = {
            'success': 'success',
            'error': 'danger',
            'warning': 'warning',
            'info': 'info',
            'primary': 'primary'
        };
        return types[type] || 'info';
    }

    /* ===== Get Icon ===== */
    getIcon(type) {
        const icons = {
            'success': 'fas fa-check-circle',
            'error': 'fas fa-exclamation-circle',
            'warning': 'fas fa-exclamation-triangle',
            'info': 'fas fa-info-circle',
            'primary': 'fas fa-bell'
        };
        return icons[type] || 'fas fa-info-circle';
    }

    /* ===== Animate Toast In ===== */
    animateToastIn(toast) {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(toast, 
                { opacity: 0, x: 300, scale: 0.8 },
                { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
        } else {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(300px)';
            toast.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateX(0)';
            }, 10);
        }
    }

    /* ===== Animate Toast Out ===== */
    animateToastOut(toast) {
        if (typeof gsap !== 'undefined') {
            gsap.to(toast, {
                opacity: 0,
                x: 300,
                scale: 0.8,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => {
                    toast.remove();
                }
            });
        } else {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(300px)';
            toast.style.transition = 'all 0.3s ease';
            
            setTimeout(() => {
                toast.remove();
            }, 300);
        }
    }

    /* ===== Hide Toast ===== */
    hide(toastId) {
        const toast = document.getElementById(`toast-${toastId}`);
        if (toast) {
            this.animateToastOut(toast);
            this.toasts = this.toasts.filter(id => id !== toastId);
        }
    }

    /* ===== Remove Oldest Toast ===== */
    removeOldestToast() {
        if (this.toasts.length > 0) {
            const oldestId = this.toasts[0];
            this.hide(oldestId);
        }
    }

    /* ===== Clear All Toasts ===== */
    clearAll() {
        this.toasts.forEach(id => {
            const toast = document.getElementById(`toast-${id}`);
            if (toast) {
                toast.remove();
            }
        });
        this.toasts = [];
    }

    /* ===== Generate ID ===== */
    generateId() {
        return Math.random().toString(36).substr(2, 9);
    }

    /* ===== Show Success Toast ===== */
    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    }

    /* ===== Show Error Toast ===== */
    error(message, duration = 4000) {
        return this.show(message, 'error', duration);
    }

    /* ===== Show Warning Toast ===== */
    warning(message, duration = 3500) {
        return this.show(message, 'warning', duration);
    }

    /* ===== Show Info Toast ===== */
    info(message, duration = 3000) {
        return this.show(message, 'info', duration);
    }

    /* ===== Show Primary Toast ===== */
    primary(message, duration = 3000) {
        return this.show(message, 'primary', duration);
    }
}

/* ===== Notification System ===== */
class NotificationManager {
    constructor() {
        this.permission = null;
        this.init();
    }

    init() {
        this.requestPermission();
    }

    /* ===== Request Permission ===== */
    async requestPermission() {
        if ('Notification' in window) {
            this.permission = await Notification.requestPermission();
        }
    }

    /* ===== Show Notification ===== */
    show(title, options = {}) {
        if (this.permission === 'granted') {
            const notification = new Notification(title, {
                icon: options.icon || '/assets/images/icon.png',
                badge: options.badge || '/assets/images/badge.png',
                body: options.body || '',
                tag: options.tag || 'chat-notification',
                requireInteraction: options.requireInteraction || false,
                silent: options.silent || false,
                ...options
            });

            // Auto close after 5 seconds
            setTimeout(() => {
                notification.close();
            }, 5000);

            return notification;
        }
    }

    /* ===== Show Chat Notification ===== */
    showChatNotification(senderName, message) {
        this.show(`پیام جدید از ${senderName}`, {
            body: message,
            icon: '/assets/images/chat-icon.png',
            tag: 'chat-message',
            requireInteraction: true
        });
    }
}

/* ===== Initialize Managers ===== */
$(document).ready(function() {
    window.toastManager = new ToastManager();
    window.notificationManager = new NotificationManager();
});

/* ===== Global Toast Functions ===== */
window.showToast = (message, type = 'info', duration = 3000) => {
    return window.toastManager.show(message, type, duration);
};

window.showSuccess = (message, duration = 3000) => {
    return window.toastManager.success(message, duration);
};

window.showError = (message, duration = 4000) => {
    return window.toastManager.error(message, duration);
};

window.showWarning = (message, duration = 3500) => {
    return window.toastManager.warning(message, duration);
};

window.showInfo = (message, duration = 3000) => {
    return window.toastManager.info(message, duration);
};

/* ===== Export for global use ===== */
window.ToastManager = ToastManager;
window.NotificationManager = NotificationManager;
