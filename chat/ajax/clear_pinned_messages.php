<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'لطفا وارد شوید']);
    exit;
}

$db = new Database();
$result = $db->query(
    "DELETE FROM pinned_messages WHERE user_id = ?",
    [$_SESSION['user_id']]
);

if ($result) {
    echo json_encode(['success' => true, 'message' => 'پیام‌های سنجاق شده پاک شدند']);
} else {
    echo json_encode(['success' => false, 'message' => 'خطا در پاک کردن پیام‌های سنجاق شده']);
}
?>
