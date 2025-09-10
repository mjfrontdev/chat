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
    "SELECT m.id, m.message, m.created_at, u.username as sender
     FROM pinned_messages pm
     JOIN messages m ON pm.message_id = m.id
     JOIN users u ON m.sender_id = u.id
     WHERE pm.user_id = ?
     ORDER BY pm.pinned_at DESC",
    [$_SESSION['user_id']]
);

$messages = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $messages[] = [
        'id' => $row['id'],
        'content' => $row['message'],
        'sender' => $row['sender'],
        'time' => date('H:i', strtotime($row['created_at']))
    ];
}

echo json_encode(['success' => true, 'messages' => $messages]);
?>
