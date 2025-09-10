<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'لطفا وارد شوید']);
    exit;
}

$messageId = isset($_GET['message_id']) ? (int)$_GET['message_id'] : 0;
if (!$messageId) {
    echo json_encode(['success' => false, 'message' => 'شناسه پیام نامعتبر']);
    exit;
}

$db = new Database();
$stmt = $db->query(
    "SELECT emoji, COUNT(*) as count, 
     SUM(CASE WHEN user_id = ? THEN 1 ELSE 0 END) as isActive
     FROM message_reactions 
     WHERE message_id = ?
     GROUP BY emoji
     ORDER BY count DESC",
    [$_SESSION['user_id'], $messageId]
);

$reactions = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $reactions[] = [
        'emoji' => $row['emoji'],
        'count' => (int)$row['count'],
        'isActive' => (bool)$row['isActive']
    ];
}

echo json_encode(['success' => true, 'reactions' => $reactions]);
?>
