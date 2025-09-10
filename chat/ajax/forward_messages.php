<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'لطفا وارد شوید']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$messageIds = isset($input['message_ids']) ? $input['message_ids'] : [];
$contactIds = isset($input['contact_ids']) ? $input['contact_ids'] : [];

if (empty($messageIds) || empty($contactIds)) {
    echo json_encode(['success' => false, 'message' => 'داده‌های نامعتبر']);
    exit;
}

$db = new Database();
$successCount = 0;
$errorCount = 0;

foreach ($messageIds as $messageId) {
    // Get original message
    $stmt = $db->query(
        "SELECT message, sender_id FROM messages WHERE id = ? AND (sender_id = ? OR receiver_id = ?)",
        [$messageId, $_SESSION['user_id'], $_SESSION['user_id']]
    );
    
    if ($stmt->rowCount() === 0) {
        $errorCount++;
        continue;
    }
    
    $originalMessage = $stmt->fetch(PDO::FETCH_ASSOC);
    
    foreach ($contactIds as $contactId) {
        // Check if contact exists
        $stmt = $db->query(
            "SELECT id FROM contacts WHERE user_id = ? AND contact_user_id = ?",
            [$_SESSION['user_id'], $contactId]
        );
        
        if ($stmt->rowCount() === 0) {
            $errorCount++;
            continue;
        }
        
        // Create forwarded message
        $forwardedMessage = "پیام ارسالی: " . $originalMessage['message'];
        
        $result = $db->query(
            "INSERT INTO messages (sender_id, receiver_id, message, is_read, created_at) VALUES (?, ?, ?, 0, NOW())",
            [$_SESSION['user_id'], $contactId, $forwardedMessage]
        );
        
        if ($result) {
            $newMessageId = $db->lastInsertId();
            
            // Record forwarding
            $db->query(
                "INSERT INTO message_forwarding (original_message_id, forwarded_message_id, forwarded_by, forwarded_to, forwarded_at) VALUES (?, ?, ?, ?, NOW())",
                [$messageId, $newMessageId, $_SESSION['user_id'], $contactId]
            );
            
            $successCount++;
        } else {
            $errorCount++;
        }
    }
}

echo json_encode([
    'success' => $successCount > 0,
    'message' => "{$successCount} پیام ارسال شد" . ($errorCount > 0 ? "، {$errorCount} خطا" : ""),
    'success_count' => $successCount,
    'error_count' => $errorCount
]);
?>
