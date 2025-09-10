<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'لطفا وارد شوید']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$messageId = isset($input['message_id']) ? (int)$input['message_id'] : 0;
$emoji = isset($input['emoji']) ? sanitize($input['emoji']) : '';

if (!$messageId || !$emoji) {
    echo json_encode(['success' => false, 'message' => 'داده‌های نامعتبر']);
    exit;
}

$db = new Database();

// Check if message exists and user has access
$stmt = $db->query(
    "SELECT id FROM messages WHERE id = ? AND (sender_id = ? OR receiver_id = ?)",
    [$messageId, $_SESSION['user_id'], $_SESSION['user_id']]
);

if ($stmt->rowCount() === 0) {
    echo json_encode(['success' => false, 'message' => 'پیام یافت نشد']);
    exit;
}

// Check if reaction already exists
$stmt = $db->query(
    "SELECT id FROM message_reactions WHERE message_id = ? AND user_id = ? AND emoji = ?",
    [$messageId, $_SESSION['user_id'], $emoji]
);

if ($stmt->rowCount() > 0) {
    // Remove existing reaction
    $db->query(
        "DELETE FROM message_reactions WHERE message_id = ? AND user_id = ? AND emoji = ?",
        [$messageId, $_SESSION['user_id'], $emoji]
    );
} else {
    // Add new reaction
    $db->query(
        "INSERT INTO message_reactions (message_id, user_id, emoji, created_at) VALUES (?, ?, ?, NOW())",
        [$messageId, $_SESSION['user_id'], $emoji]
    );
}

echo json_encode(['success' => true]);
?>
