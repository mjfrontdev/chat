/* ===== Social Features JavaScript ===== */

class SocialFeatures {
    constructor() {
        this.onlineUsers = [];
        this.notifications = [];
        this.activityFeed = [];
        this.groups = [];
        this.notificationInterval = null;
        this.statusInterval = null;
        
        this.init();
    }
    
    init() {
        this.initOnlineUsers();
        this.initNotifications();
        this.initActivityFeed();
        this.initGroups();
        this.initStatusUpdates();
        this.initRealTimeUpdates();
    }
    
    /* ===== Online Users ===== */
    initOnlineUsers() {
        this.loadOnlineUsers();
        this.createOnlineUsersWidget();
        this.bindOnlineUsersEvents();
    }
    
    createOnlineUsersWidget() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;
        
        const onlineUsersWidget = document.createElement('div');
        onlineUsersWidget.className = 'online-users';
        onlineUsersWidget.innerHTML = `
            <div class="online-users-header">
                <h6 class="online-users-title">کاربران آنلاین</h6>
                <span class="online-users-count" id="online-count">0</span>
            </div>
            <div class="online-users-list" id="online-users-list">
                <!-- Online users will be loaded here -->
            </div>
        `;
        
        // Insert after search container
        const searchContainer = sidebar.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.insertAdjacentElement('afterend', onlineUsersWidget);
        }
    }
    
    async loadOnlineUsers() {
        try {
            const response = await fetch('ajax/get_online_users.php');
            const data = await response.json();
            
            if (data.success) {
                this.onlineUsers = data.users;
                this.updateOnlineUsersDisplay();
            }
        } catch (error) {
            console.error('Error loading online users:', error);
        }
    }
    
    updateOnlineUsersDisplay() {
        const onlineCount = document.getElementById('online-count');
        const onlineUsersList = document.getElementById('online-users-list');
        
        if (onlineCount) {
            onlineCount.textContent = this.onlineUsers.length;
        }
        
        if (onlineUsersList) {
            onlineUsersList.innerHTML = this.onlineUsers.map(user => `
                <div class="online-user-item" data-user-id="${user.id}">
                    <div class="online-user-avatar">
                        <img src="${user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.username)}" 
                             alt="${user.username}">
                        <div class="status-badge status-online"></div>
                    </div>
                    <div class="online-user-info">
                        <div class="online-user-name">${user.username}</div>
                        <div class="online-user-status">
                            <i class="fas fa-circle"></i>
                            آنلاین
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    bindOnlineUsersEvents() {
        $(document).on('click', '.online-user-item', (e) => {
            const userId = e.currentTarget.dataset.userId;
            this.startChatWithUser(userId);
        });
    }
    
    startChatWithUser(userId) {
        // Check if user is already a contact
        this.checkAndAddContact(userId).then(() => {
            // Start chat with user
            if (window.mobileApp) {
                window.mobileApp.selectContact(userId);
            }
        });
    }
    
    async checkAndAddContact(userId) {
        try {
            const response = await fetch('ajax/check_contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contact_id: userId })
            });
            
            const data = await response.json();
            
            if (!data.is_contact) {
                // Add as contact
                await this.addContact(userId);
            }
        } catch (error) {
            console.error('Error checking contact:', error);
        }
    }
    
    async addContact(userId) {
        try {
            const response = await fetch('ajax/add_contact.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contact_user_id: userId })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showSuccess('مخاطب اضافه شد');
                // Reload contacts
                if (window.contactManager) {
                    window.contactManager.loadContacts();
                }
            }
        } catch (error) {
            console.error('Error adding contact:', error);
        }
    }
    
    /* ===== Notifications ===== */
    initNotifications() {
        this.createNotificationWidget();
        this.loadNotifications();
        this.bindNotificationEvents();
        this.startNotificationPolling();
    }
    
    createNotificationWidget() {
        const headerActions = document.querySelector('.header-actions');
        if (!headerActions) return;
        
        const notificationButton = document.createElement('button');
        notificationButton.className = 'btn-header notification-btn';
        notificationButton.innerHTML = `
            <i class="fas fa-bell"></i>
            <span class="notification-badge" id="notification-count" style="display: none;">0</span>
        `;
        notificationButton.title = 'اعلان‌ها';
        
        // Insert before logout button
        const logoutButton = headerActions.querySelector('a[href="logout.php"]');
        if (logoutButton) {
            headerActions.insertBefore(notificationButton, logoutButton);
        } else {
            headerActions.appendChild(notificationButton);
        }
        
        // Create notification dropdown
        const notificationDropdown = document.createElement('div');
        notificationDropdown.className = 'notification-dropdown';
        notificationDropdown.innerHTML = `
            <div class="notification-header">
                <h6 class="notification-title">اعلان‌ها</h6>
                <button class="notification-clear">پاک کردن همه</button>
            </div>
            <div class="notification-list" id="notification-list">
                <!-- Notifications will be loaded here -->
            </div>
        `;
        
        document.body.appendChild(notificationDropdown);
        
        // Bind click events
        notificationButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleNotifications();
        });
        
        notificationDropdown.querySelector('.notification-clear').addEventListener('click', () => {
            this.clearAllNotifications();
        });
        
        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!notificationButton.contains(e.target) && !notificationDropdown.contains(e.target)) {
                notificationDropdown.classList.remove('show');
            }
        });
    }
    
    async loadNotifications() {
        try {
            const response = await fetch('ajax/get_notifications.php');
            const data = await response.json();
            
            if (data.success) {
                this.notifications = data.notifications;
                this.updateNotificationDisplay();
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
        }
    }
    
    updateNotificationDisplay() {
        const notificationCount = document.getElementById('notification-count');
        const notificationList = document.getElementById('notification-list');
        
        const unreadCount = this.notifications.filter(n => !n.is_read).length;
        
        if (notificationCount) {
            if (unreadCount > 0) {
                notificationCount.textContent = unreadCount;
                notificationCount.style.display = 'flex';
            } else {
                notificationCount.style.display = 'none';
            }
        }
        
        if (notificationList) {
            if (this.notifications.length === 0) {
                notificationList.innerHTML = '<div class="notification-item">اعلانی وجود ندارد</div>';
            } else {
                notificationList.innerHTML = this.notifications.map(notification => `
                    <div class="notification-item ${notification.is_read ? '' : 'unread'}" data-notification-id="${notification.id}">
                        <div class="notification-content">
                            <div class="notification-icon ${notification.type}">
                                <i class="fas fa-${this.getNotificationIcon(notification.type)}"></i>
                            </div>
                            <div class="notification-text">
                                <div class="notification-message">${notification.message}</div>
                                <div class="notification-time">${notification.time}</div>
                            </div>
                        </div>
                    </div>
                `).join('');
            }
        }
    }
    
    getNotificationIcon(type) {
        const icons = {
            'message': 'comment',
            'online': 'circle',
            'offline': 'circle',
            'contact': 'user-plus',
            'group': 'users'
        };
        return icons[type] || 'bell';
    }
    
    toggleNotifications() {
        const notificationDropdown = document.querySelector('.notification-dropdown');
        notificationDropdown.classList.toggle('show');
    }
    
    async clearAllNotifications() {
        try {
            const response = await fetch('ajax/clear_notifications.php', {
                method: 'POST'
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.notifications = [];
                this.updateNotificationDisplay();
                this.showSuccess('تمام اعلان‌ها پاک شدند');
            }
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    }
    
    startNotificationPolling() {
        // Poll for new notifications every 30 seconds
        this.notificationInterval = setInterval(() => {
            this.loadNotifications();
        }, 30000);
    }
    
    bindNotificationEvents() {
        $(document).on('click', '.notification-item', (e) => {
            const notificationId = e.currentTarget.dataset.notificationId;
            this.handleNotificationClick(notificationId);
        });
    }
    
    async handleNotificationClick(notificationId) {
        // Mark as read
        await this.markNotificationAsRead(notificationId);
        
        // Handle notification action
        const notification = this.notifications.find(n => n.id == notificationId);
        if (notification) {
            switch (notification.type) {
                case 'message':
                    this.startChatWithUser(notification.sender_id);
                    break;
                case 'contact':
                    this.showContactRequest(notification.sender_id);
                    break;
                case 'group':
                    this.showGroupInvitation(notification.group_id);
                    break;
            }
        }
    }
    
    async markNotificationAsRead(notificationId) {
        try {
            const response = await fetch('ajax/mark_notification_read.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notification_id: notificationId })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Update local notification
                const notification = this.notifications.find(n => n.id == notificationId);
                if (notification) {
                    notification.is_read = true;
                    this.updateNotificationDisplay();
                }
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    }
    
    /* ===== Activity Feed ===== */
    initActivityFeed() {
        this.loadActivityFeed();
        this.createActivityWidget();
        this.bindActivityEvents();
    }
    
    createActivityWidget() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;
        
        const activityWidget = document.createElement('div');
        activityWidget.className = 'activity-feed';
        activityWidget.innerHTML = `
            <div class="activity-feed-header">
                <h6 class="activity-feed-title">فعالیت‌های اخیر</h6>
            </div>
            <div class="activity-list" id="activity-list">
                <!-- Activities will be loaded here -->
            </div>
        `;
        
        // Insert after online users widget
        const onlineUsersWidget = sidebar.querySelector('.online-users');
        if (onlineUsersWidget) {
            onlineUsersWidget.insertAdjacentElement('afterend', activityWidget);
        }
    }
    
    async loadActivityFeed() {
        try {
            const response = await fetch('ajax/get_activity_feed.php');
            const data = await response.json();
            
            if (data.success) {
                this.activityFeed = data.activities;
                this.updateActivityDisplay();
            }
        } catch (error) {
            console.error('Error loading activity feed:', error);
        }
    }
    
    updateActivityDisplay() {
        const activityList = document.getElementById('activity-list');
        
        if (activityList) {
            if (this.activityFeed.length === 0) {
                activityList.innerHTML = '<div class="activity-item">فعالیتی وجود ندارد</div>';
            } else {
                activityList.innerHTML = this.activityFeed.map(activity => `
                    <div class="activity-item" data-activity-id="${activity.id}">
                        <div class="activity-avatar">
                            <img src="${activity.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(activity.username)}" 
                                 alt="${activity.username}">
                        </div>
                        <div class="activity-content">
                            <div class="activity-text">${activity.text}</div>
                            <div class="activity-time">${activity.time}</div>
                        </div>
                        <div class="activity-icon ${activity.type}">
                            <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                        </div>
                    </div>
                `).join('');
            }
        }
    }
    
    getActivityIcon(type) {
        const icons = {
            'message': 'comment',
            'online': 'circle',
            'offline': 'circle',
            'contact': 'user-plus',
            'group': 'users'
        };
        return icons[type] || 'bell';
    }
    
    bindActivityEvents() {
        $(document).on('click', '.activity-item', (e) => {
            const activityId = e.currentTarget.dataset.activityId;
            this.handleActivityClick(activityId);
        });
    }
    
    handleActivityClick(activityId) {
        const activity = this.activityFeed.find(a => a.id == activityId);
        if (activity) {
            switch (activity.type) {
                case 'message':
                    this.startChatWithUser(activity.user_id);
                    break;
                case 'contact':
                    this.showUserProfile(activity.user_id);
                    break;
                case 'group':
                    this.showGroupInfo(activity.group_id);
                    break;
            }
        }
    }
    
    /* ===== Groups ===== */
    initGroups() {
        this.loadGroups();
        this.createGroupsWidget();
        this.bindGroupEvents();
    }
    
    createGroupsWidget() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;
        
        const groupsWidget = document.createElement('div');
        groupsWidget.className = 'group-chat';
        groupsWidget.innerHTML = `
            <div class="group-header">
                <div class="group-avatar">
                    <i class="fas fa-users"></i>
                </div>
                <div class="group-info">
                    <h5>گروه‌ها</h5>
                    <div class="group-members">${this.groups.length} گروه</div>
                </div>
            </div>
            <div class="group-actions">
                <button class="group-btn" id="create-group-btn">
                    <i class="fas fa-plus"></i>
                    ایجاد گروه
                </button>
                <button class="group-btn" id="join-group-btn">
                    <i class="fas fa-sign-in-alt"></i>
                    پیوستن
                </button>
            </div>
        `;
        
        // Insert after activity widget
        const activityWidget = sidebar.querySelector('.activity-feed');
        if (activityWidget) {
            activityWidget.insertAdjacentElement('afterend', groupsWidget);
        }
    }
    
    async loadGroups() {
        try {
            const response = await fetch('ajax/get_groups.php');
            const data = await response.json();
            
            if (data.success) {
                this.groups = data.groups;
                this.updateGroupsDisplay();
            }
        } catch (error) {
            console.error('Error loading groups:', error);
        }
    }
    
    updateGroupsDisplay() {
        const groupMembers = document.querySelector('.group-members');
        if (groupMembers) {
            groupMembers.textContent = `${this.groups.length} گروه`;
        }
    }
    
    bindGroupEvents() {
        $(document).on('click', '#create-group-btn', () => {
            this.showCreateGroupModal();
        });
        
        $(document).on('click', '#join-group-btn', () => {
            this.showJoinGroupModal();
        });
    }
    
    showCreateGroupModal() {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">ایجاد گروه جدید</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="group-name" class="form-label">نام گروه</label>
                            <input type="text" class="form-control" id="group-name" placeholder="نام گروه...">
                        </div>
                        <div class="mb-3">
                            <label for="group-description" class="form-label">توضیحات</label>
                            <textarea class="form-control" id="group-description" rows="3" placeholder="توضیحات گروه..."></textarea>
                        </div>
                        <div class="mb-3">
                            <label for="group-members" class="form-label">اعضای گروه</label>
                            <div class="contact-list" id="group-members-list">
                                <!-- Contacts will be loaded here -->
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">انصراف</button>
                        <button type="button" class="btn btn-primary" id="create-group-confirm">ایجاد گروه</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Load contacts for group members
        this.loadContactsForGroup();
        
        // Show modal
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
        
        // Bind events
        modal.querySelector('#create-group-confirm').addEventListener('click', () => {
            this.createGroup();
            bsModal.hide();
        });
        
        // Remove modal when hidden
        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });
    }
    
    async loadContactsForGroup() {
        try {
            const response = await fetch('ajax/get_contacts.php');
            const data = await response.json();
            
            if (data.success) {
                const groupMembersList = document.getElementById('group-members-list');
                groupMembersList.innerHTML = data.contacts.map(contact => `
                    <div class="contact-item">
                        <input type="checkbox" class="form-check-input" value="${contact.contact_user_id}">
                        <img src="${contact.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(contact.username)}" 
                             class="contact-avatar" alt="${contact.username}">
                        <div class="contact-info">
                            <div class="contact-name">${contact.nickname || contact.username}</div>
                        </div>
                    </div>
                `).join('');
            }
        } catch (error) {
            console.error('Error loading contacts for group:', error);
        }
    }
    
    async createGroup() {
        const groupName = document.getElementById('group-name').value;
        const groupDescription = document.getElementById('group-description').value;
        const selectedMembers = Array.from(document.querySelectorAll('#group-members-list input:checked'))
            .map(input => input.value);
        
        if (!groupName.trim()) {
            this.showError('لطفاً نام گروه را وارد کنید');
            return;
        }
        
        try {
            const response = await fetch('ajax/create_group.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: groupName,
                    description: groupDescription,
                    members: selectedMembers
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.showSuccess('گروه با موفقیت ایجاد شد');
                this.loadGroups();
            } else {
                this.showError(data.message || 'خطا در ایجاد گروه');
            }
        } catch (error) {
            console.error('Error creating group:', error);
            this.showError('خطا در ایجاد گروه');
        }
    }
    
    showJoinGroupModal() {
        // Implementation for joining groups
        this.showSuccess('قابلیت پیوستن به گروه به زودی اضافه خواهد شد');
    }
    
    /* ===== Status Updates ===== */
    initStatusUpdates() {
        this.updateUserStatus();
        this.startStatusPolling();
    }
    
    async updateUserStatus() {
        try {
            const response = await fetch('ajax/update_status.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'online' })
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Status updated successfully
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }
    
    startStatusPolling() {
        // Update status every 5 minutes
        this.statusInterval = setInterval(() => {
            this.updateUserStatus();
        }, 300000);
    }
    
    /* ===== Real-time Updates ===== */
    initRealTimeUpdates() {
        // This would typically use WebSockets or Server-Sent Events
        // For now, we'll use polling
        this.startRealTimePolling();
    }
    
    startRealTimePolling() {
        // Poll for updates every 10 seconds
        setInterval(() => {
            this.loadOnlineUsers();
            this.loadNotifications();
            this.loadActivityFeed();
        }, 10000);
    }
    
    /* ===== Utility Methods ===== */
    showUserProfile(userId) {
        // Implementation for showing user profile
        console.log('Show user profile:', userId);
    }
    
    showGroupInfo(groupId) {
        // Implementation for showing group info
        console.log('Show group info:', groupId);
    }
    
    showContactRequest(userId) {
        // Implementation for showing contact request
        console.log('Show contact request:', userId);
    }
    
    showGroupInvitation(groupId) {
        // Implementation for showing group invitation
        console.log('Show group invitation:', groupId);
    }
    
    showSuccess(message) {
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
    
    /* ===== Cleanup ===== */
    destroy() {
        if (this.notificationInterval) {
            clearInterval(this.notificationInterval);
        }
        
        if (this.statusInterval) {
            clearInterval(this.statusInterval);
        }
    }
}

// Initialize social features when DOM is ready
$(document).ready(function() {
    window.socialFeatures = new SocialFeatures();
});
