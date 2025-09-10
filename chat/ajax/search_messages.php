<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'لطفا وارد شوید']);
    exit;
}

$query = isset($_GET['q']) ? sanitize($_GET['q']) : '';
if (strlen($query) < 3) {
    echo json_encode(['success' => false, 'message' => 'حداقل 3 کاراکتر وارد کنید']);
    exit;
}

$db = new Database();
$stmt = $db->query(
    "SELECT m.id, m.message, m.created_at, u.username as sender
     FROM messages m
     JOIN users u ON m.sender_id = u.id
     WHERE (m.sender_id = ? OR m.receiver_id = ?) 
     AND m.message LIKE ?
     ORDER BY m.created_at DESC
     LIMIT 20",
    [$_SESSION['user_id'], $_SESSION['user_id'], "%$query%"]
);

$results = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $results[] = [
        'id' => $row['id'],
        'message' => $row['message'],
        'sender' => $row['sender'],
        'time' => date('H:i', strtotime($row['created_at']))
    ];
}

echo json_encode(['success' => true, 'results' => $results]);
?>
