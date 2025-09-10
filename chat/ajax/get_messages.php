<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';

if (!isLoggedIn()) {
    exit('لطفا وارد شوید');
}

$userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
if (!$userId) {
    exit('شناسه کاربر نامعتبر است');
}

// اول پیام‌ها رو به عنوان خوانده شده علامت‌گذاری می‌کنیم
markMessagesAsRead($userId, $_SESSION['user_id']);

// حالا پیام‌های به‌روز شده رو می‌گیریم
$messages = getChatMessages($_SESSION['user_id'], $userId);

foreach (array_reverse($messages) as $message) {
    $isSent = $message['sender_id'] == $_SESSION['user_id'];
    $messageClass = $isSent ? 'sent' : 'received';
    $messageContent = htmlspecialchars($message['message']);
    $messageTime = date('H:i', strtotime($message['created_at']));
    
    // نمایش وضعیت پیام
    $messageStatus = '';
    if ($isSent) {
        if ($message['is_read']) {
            $messageStatus = '<span class="message-status"><i class="fas fa-check-double read"></i></span>';
        } else {
            $messageStatus = '<span class="message-status"><i class="fas fa-check"></i></span>';
        }
    }
    
    echo "<div class='message {$messageClass} message-enter'>";
    echo "<div class='message-content'>{$messageContent}</div>";
    echo "<div class='message-time'>{$messageStatus} {$messageTime}</div>";
    echo "</div>";
}
?> 