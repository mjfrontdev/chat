/* ===== Contact Management JavaScript ===== */
class ContactManager {
    constructor() {
        this.selectedContactId = null;
        this.searchTimeout = null;
        this.init();
    }

    init() {
        this.initEventListeners();
        this.loadContacts();
    }

    /* ===== Event Listeners ===== */
    initEventListeners() {
        // Add contact button
        $(document).on('click', '#add-contact-btn', () => {
            this.showAddContactModal();
        });

        // User search
        $(document).on('input', '#user-search', (e) => {
            this.handleUserSearch(e.target.value);
        });

        // Save contact
        $(document).on('click', '#save-contact-btn', (e) => {
            e.preventDefault();
            console.log('Save contact button clicked');
            console.log('Selected contact ID:', this.selectedContactId);
            this.saveContact();
        });

        // Update contact
        $(document).on('click', '#update-contact-btn', () => {
            this.updateContact();
        });

        // Contact search
        $(document).on('input', '#contact-search', (e) => {
            this.filterContacts(e.target.value);
        });

        // Modal events
        $(document).on('hidden.bs.modal', '#addContactModal', () => {
            this.clearAddContactForm();
        });

        $(document).on('hidden.bs.modal', '#editContactModal', () => {
            this.clearEditContactForm();
        });
    }

    /* ===== Load Contacts ===== */
    loadContacts() {
        $.get('ajax/get_contacts.php')
        .done((response) => {
            if (response.success) {
                this.renderContacts(response.contacts);
            } else {
                this.showToast('خطا در بارگذاری مخاطبین', 'error');
            }
        })
        .fail(() => {
            this.showToast('خطا در اتصال', 'error');
        });
    }

    /* ===== Render Contacts ===== */
    renderContacts(contacts) {
        const container = $('#contacts-list');
        container.empty();

        if (contacts.length === 0) {
            container.html(`
                <div class="empty-state">
                    <i class="fas fa-users"></i>
                    <h6>هیچ مخاطبی وجود ندارد</h6>
                    <p>برای شروع، یک مخاطب اضافه کنید</p>
                </div>
            `);
            return;
        }

        contacts.forEach((contact, index) => {
            const contactElement = this.createContactElement(contact, index);
            container.append(contactElement);
        });

        // Animate contacts
        this.animateContacts();
    }

    /* ===== Create Contact Element ===== */
    createContactElement(contact, index) {
        const isOnline = contact.status === 'online';
        const statusClass = isOnline ? 'status-online' : 'status-offline';
        const statusText = isOnline ? 'آنلاین' : 'آفلاین';
        const favoriteClass = contact.is_favorite ? 'favorite' : '';
        const favoriteStar = contact.is_favorite ? '<i class="fas fa-star favorite-star"></i>' : '';

        return $(`
            <div class="contact-item ${favoriteClass}" data-contact-id="${contact.contact_user_id}" data-aos="fade-left" data-aos-delay="${index * 100}">
                <img src="${contact.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(contact.username) + '&background=1890ff&color=fff'}" 
                     class="contact-avatar" alt="${contact.username}">
                <div class="contact-info">
                    <div class="contact-name">
                        ${contact.nickname || contact.username}
                        ${favoriteStar}
                    </div>
                    <div class="contact-last-message">${contact.notes || 'آخرین پیام...'}</div>
                </div>
                <div class="contact-meta">
                    <div class="contact-time">${this.formatTime(contact.last_seen)}</div>
                    <span class="contact-status ${statusClass}"></span>
                </div>
                <div class="contact-actions">
                    <button class="btn-contact-action" onclick="contactManager.editContact(${contact.contact_user_id})" title="ویرایش">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-contact-action" onclick="contactManager.deleteContact(${contact.contact_user_id})" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `);
    }

    /* ===== Animate Contacts ===== */
    animateContacts() {
        if (typeof gsap !== 'undefined') {
            gsap.fromTo('.contact-item', 
                { opacity: 0, x: -30 },
                { 
                    opacity: 1, 
                    x: 0, 
                    duration: 0.5, 
                    stagger: 0.1,
                    ease: "power2.out"
                }
            );
        }
    }

    /* ===== Show Add Contact Modal ===== */
    showAddContactModal() {
        $('#addContactModal').modal('show');
        $('#user-search').focus();
    }

    /* ===== Handle User Search ===== */
    handleUserSearch(query) {
        clearTimeout(this.searchTimeout);
        
        if (query.length < 2) {
            $('#search-results').hide().empty();
            return;
        }

        this.searchTimeout = setTimeout(() => {
            this.searchUsers(query);
        }, 300);
    }

    /* ===== Search Users ===== */
    searchUsers(query) {
        $.get('ajax/search_users.php', { q: query })
        .done((response) => {
            if (response.success) {
                this.renderSearchResults(response.users);
            }
        })
        .fail(() => {
            this.showToast('خطا در جستجو', 'error');
        });
    }

    /* ===== Render Search Results ===== */
    renderSearchResults(users) {
        const container = $('#search-results');
        container.empty();

        if (users.length === 0) {
            container.html('<div class="search-result-item text-center text-muted">هیچ کاربری یافت نشد</div>');
        } else {
            users.forEach(user => {
                const userElement = this.createSearchResultElement(user);
                container.append(userElement);
            });
        }

        container.show();
    }

    /* ===== Create Search Result Element ===== */
    createSearchResultElement(user) {
        return $(`
            <div class="search-result-item" data-user-id="${user.id}">
                <img src="${user.avatar || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.username) + '&background=1890ff&color=fff'}" 
                     class="search-result-avatar" alt="${user.username}">
                <div class="search-result-info">
                    <div class="search-result-name">${user.username}</div>
                    <div class="search-result-email">${user.email}</div>
                </div>
            </div>
        `);
    }

    /* ===== Save Contact ===== */
    saveContact() {
        const activeTab = $('#contactTabs .nav-link.active').attr('id');
        
        if (activeTab === 'search-tab') {
            this.saveExistingContact();
        } else if (activeTab === 'create-tab') {
            this.createNewContact();
        }
    }
    
    /* ===== Save Existing Contact ===== */
    saveExistingContact() {
        const selectedUserId = this.selectedContactId;
        const nickname = $('#contact-nickname').val().trim();
        const notes = $('#contact-notes').val().trim();

        if (!selectedUserId) {
            this.showToast('لطفا یک کاربر انتخاب کنید', 'warning');
            return;
        }

        // Show loading state
        const saveBtn = $('#save-contact-btn');
        const originalText = saveBtn.html();
        saveBtn.html('<i class="fas fa-spinner fa-spin"></i> در حال اضافه کردن...').prop('disabled', true);

        $.post('ajax/add_contact.php', {
            contact_user_id: selectedUserId,
            nickname: nickname,
            notes: notes
        })
        .done((response) => {
            if (response.success) {
                this.showToast(response.message, 'success');
                $('#addContactModal').modal('hide');
                this.loadContacts();
            } else {
                this.showToast(response.message, 'error');
            }
        })
        .fail((xhr, status, error) => {
            console.error('Error adding contact:', error);
            this.showToast('خطا در اضافه کردن مخاطب', 'error');
        })
        .always(() => {
            // Restore button state
            saveBtn.html(originalText).prop('disabled', false);
        });
    }
    
    /* ===== Create New Contact ===== */
    createNewContact() {
        const username = $('#new-username').val().trim();
        const email = $('#new-email').val().trim();
        const nickname = $('#new-nickname').val().trim();
        const notes = $('#new-notes').val().trim();

        console.log('Creating new contact:', { username, email, nickname, notes });

        if (!username || !email) {
            this.showToast('نام کاربری و ایمیل الزامی است', 'warning');
            return;
        }

        // Show loading state
        const saveBtn = $('#save-contact-btn');
        const originalText = saveBtn.html();
        saveBtn.html('<i class="fas fa-spinner fa-spin"></i> در حال ایجاد...').prop('disabled', true);

        $.ajax({
            url: 'ajax/add_user_contact.php',
            type: 'POST',
            data: {
                username: username,
                email: email,
                nickname: nickname,
                notes: notes
            },
            dataType: 'json'
        })
        .done((response) => {
            console.log('AJAX Response:', response);
            // Parse response if it's a string
            if (typeof response === 'string') {
                try {
                    response = JSON.parse(response);
                } catch (e) {
                    console.error('Error parsing JSON:', e);
                    this.showToast('خطا در پردازش پاسخ سرور', 'error');
                    return;
                }
            }
            
            if (response.success) {
                this.showToast(response.message, 'success');
                $('#addContactModal').modal('hide');
                this.loadContacts();
                
                // Show notification about new user
                setTimeout(() => {
                    this.showToast('کاربر جدید ایجاد شد و می‌تواند با رمز عبور موقت وارد شود', 'info');
                    this.addSystemMessage('کاربر جدید ایجاد شد و می‌تواند با رمز عبور موقت وارد شود');
                }, 2000);
            } else {
                this.showToast(response.message, 'error');
            }
        })
        .fail((xhr, status, error) => {
            console.error('Error creating contact:', error);
            this.showToast('خطا در ایجاد کاربر جدید', 'error');
        })
        .always(() => {
            // Restore button state
            saveBtn.html(originalText).prop('disabled', false);
        });
    }

    /* ===== Edit Contact ===== */
    editContact(contactUserId) {
        $.get('ajax/get_contact.php', { contact_user_id: contactUserId })
        .done((response) => {
            if (response.success) {
                this.populateEditForm(response.contact);
                $('#editContactModal').modal('show');
            } else {
                this.showToast('خطا در بارگذاری اطلاعات مخاطب', 'error');
            }
        })
        .fail(() => {
            this.showToast('خطا در اتصال', 'error');
        });
    }

    /* ===== Populate Edit Form ===== */
    populateEditForm(contact) {
        $('#edit-contact-user-id').val(contact.contact_user_id);
        $('#edit-contact-nickname').val(contact.nickname || '');
        $('#edit-contact-notes').val(contact.notes || '');
        $('#edit-contact-favorite').prop('checked', contact.is_favorite == 1);
    }

    /* ===== Update Contact ===== */
    updateContact() {
        const contactUserId = $('#edit-contact-user-id').val();
        const nickname = $('#edit-contact-nickname').val().trim();
        const notes = $('#edit-contact-notes').val().trim();
        const isFavorite = $('#edit-contact-favorite').is(':checked') ? 1 : 0;

        $.post('ajax/update_contact.php', {
            contact_user_id: contactUserId,
            nickname: nickname,
            notes: notes,
            is_favorite: isFavorite
        })
        .done((response) => {
            if (response.success) {
                this.showToast(response.message, 'success');
                $('#editContactModal').modal('hide');
                this.loadContacts();
            } else {
                this.showToast(response.message, 'error');
            }
        })
        .fail(() => {
            this.showToast('خطا در به‌روزرسانی مخاطب', 'error');
        });
    }

    /* ===== Delete Contact ===== */
    deleteContact(contactUserId) {
        if (typeof Swal !== 'undefined') {
            Swal.fire({
                title: 'حذف مخاطب',
                text: 'آیا مطمئن هستید که می‌خواهید این مخاطب را حذف کنید؟',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'بله، حذف کن',
                cancelButtonText: 'انصراف',
                confirmButtonColor: '#ff4d4f',
                cancelButtonColor: '#6c757d'
            }).then((result) => {
                if (result.isConfirmed) {
                    this.performDeleteContact(contactUserId);
                }
            });
        } else {
            if (confirm('آیا مطمئن هستید که می‌خواهید این مخاطب را حذف کنید؟')) {
                this.performDeleteContact(contactUserId);
            }
        }
    }

    /* ===== Perform Delete Contact ===== */
    performDeleteContact(contactUserId) {
        $.post('ajax/delete_contact.php', {
            contact_user_id: contactUserId
        })
        .done((response) => {
            if (response.success) {
                this.showToast(response.message, 'success');
                this.loadContacts();
                
                // Hide chat area if deleted contact was active
                if (window.chatApp && window.chatApp.currentChatUser == contactUserId) {
                    this.hideChatArea();
                }
            } else {
                this.showToast(response.message, 'error');
            }
        })
        .fail(() => {
            this.showToast('خطا در حذف مخاطب', 'error');
        });
    }
    
    /* ===== Hide Chat Area ===== */
    hideChatArea() {
        $('#chat-welcome').show();
        $('#messages').hide();
        $('#chat-input').hide();
        
        // Clear active contact
        $('.contact-item').removeClass('active');
        
        // Reset chat app
        if (window.chatApp) {
            window.chatApp.currentChatUser = null;
        }
    }

    /* ===== Filter Contacts ===== */
    filterContacts(query) {
        const contacts = $('.contact-item');
        const searchTerm = query.toLowerCase();

        contacts.each(function() {
            const contactName = $(this).find('.contact-name').text().toLowerCase();
            const contactNickname = $(this).find('.contact-nickname').text().toLowerCase();
            const contactNotes = $(this).find('.contact-notes').text().toLowerCase();

            if (contactName.includes(searchTerm) || 
                contactNickname.includes(searchTerm) || 
                contactNotes.includes(searchTerm)) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }

    /* ===== Clear Add Contact Form ===== */
    clearAddContactForm() {
        // Clear search tab
        $('#user-search').val('');
        $('#contact-nickname').val('');
        $('#contact-notes').val('');
        $('#search-results').hide().empty();
        this.selectedContactId = null;
        
        // Clear create tab
        $('#new-username').val('');
        $('#new-email').val('');
        $('#new-nickname').val('');
        $('#new-notes').val('');
        
        // Reset to search tab
        $('#search-tab').tab('show');
    }

    /* ===== Clear Edit Contact Form ===== */
    clearEditContactForm() {
        $('#edit-contact-user-id').val('');
        $('#edit-contact-nickname').val('');
        $('#edit-contact-notes').val('');
        $('#edit-contact-favorite').prop('checked', false);
    }

    /* ===== Format Time ===== */
    formatTime(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 60000) { // Less than 1 minute
            return 'الان';
        } else if (diff < 3600000) { // Less than 1 hour
            return Math.floor(diff / 60000) + ' دقیقه پیش';
        } else if (diff < 86400000) { // Less than 1 day
            return Math.floor(diff / 3600000) + ' ساعت پیش';
        } else {
            return date.toLocaleDateString('fa-IR');
        }
    }

    /* ===== Show Toast ===== */
    showToast(message, type = 'info') {
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        } else {
            alert(message);
        }
    }
    
    /* ===== Add System Message ===== */
    addSystemMessage(message) {
        const systemMessagesContainer = $('#system-messages');
        const systemMessage = $(`
            <div class="system-message">
                <i class="fas fa-info-circle"></i>
                ${message}
            </div>
        `);
        
        systemMessagesContainer.append(systemMessage);
        
        // Auto remove after 10 seconds
        setTimeout(() => {
            systemMessage.fadeOut(500, function() {
                $(this).remove();
            });
        }, 10000);
    }
}

/* ===== Initialize Contact Manager ===== */
$(document).ready(function() {
    window.contactManager = new ContactManager();

    // Handle search result selection
    $(document).on('click', '.search-result-item', function() {
        const userId = $(this).data('user-id');
        const username = $(this).find('.search-result-name').text();
        
        console.log('User selected:', userId, username);
        
        window.contactManager.selectedContactId = userId;
        $('#user-search').val(username);
        $('#search-results').hide();
        
        // Highlight selected user
        $('.search-result-item').removeClass('selected');
        $(this).addClass('selected');
        
        // Show visual feedback
        $(this).css('background-color', '#e3f2fd');
        setTimeout(() => {
            $(this).css('background-color', '');
        }, 1000);
    });

    // Handle contact selection for chat
    $(document).on('click', '.contact-item', function() {
        const contactId = $(this).data('contact-id');
        
        // Remove active class from all contacts
        $('.contact-item').removeClass('active');
        // Add active class to selected contact
        $(this).addClass('active');
        
        // Load messages for this contact
        if (window.chatApp) {
            window.chatApp.currentChatUser = contactId;
            window.chatApp.loadMessages(contactId);
        }
    });

    // Close search results when clicking outside
    $(document).on('click', function(e) {
        if (!$(e.target).closest('.search-box, .search-results').length) {
            $('#search-results').hide();
        }
    });
});

/* ===== Global Functions ===== */
window.editContact = function(contactUserId) {
    if (window.contactManager) {
        window.contactManager.editContact(contactUserId);
    }
};

window.deleteContact = function(contactUserId) {
    if (window.contactManager) {
        window.contactManager.deleteContact(contactUserId);
    }
};

/* ===== Export for global use ===== */
window.ContactManager = ContactManager;
