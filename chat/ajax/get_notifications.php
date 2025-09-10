<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'لطفا وارد شوید']);
    exit;
}

$db = new Database();
$stmt = $db->query(
    "SELECT id, type, message, sender_id, group_id, is_read, created_at
     FROM notifications 
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT 20",
    [$_SESSION['user_id']]
);

$notifications = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $notifications[] = [
        'id' => $row['id'],
        'type' => $row['type'],
        'message' => $row['message'],
        'sender_id' => $row['sender_id'],
        'group_id' => $row['group_id'],
        'is_read' => (bool)$row['is_read'],
        'time' => date('H:i', strtotime($row['created_at']))
    ];
}

echo json_encode(['success' => true, 'notifications' => $notifications]);
?>
