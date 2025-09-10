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

if (!$messageId) {
    echo json_encode(['success' => false, 'message' => 'شناسه پیام نامعتبر']);
    exit;
}

$db = new Database();

// Check if message exists and user has permission to delete
$stmt = $db->query(
    "SELECT id FROM messages WHERE id = ? AND sender_id = ?",
    [$messageId, $_SESSION['user_id']]
);

if ($stmt->rowCount() === 0) {
    echo json_encode(['success' => false, 'message' => 'پیام یافت نشد یا دسترسی ندارید']);
    exit;
}

// Soft delete the message
$result = $db->query(
    "UPDATE messages SET is_deleted = 1, deleted_at = NOW() WHERE id = ?",
    [$messageId]
);

if ($result) {
    echo json_encode(['success' => true, 'message' => 'پیام حذف شد']);
} else {
    echo json_encode(['success' => false, 'message' => 'خطا در حذف پیام']);
}
?>
