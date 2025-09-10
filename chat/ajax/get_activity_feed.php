<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'لطفا وارد شوید']);
    exit;
}

$db = new Database();

// Get recent activities
$activities = [];

// Recent messages
$stmt = $db->query(
    "SELECT m.id, m.message, m.created_at, u.username, u.avatar, 'message' as type
     FROM messages m
     JOIN users u ON m.sender_id = u.id
     WHERE m.receiver_id = ? AND m.created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
     ORDER BY m.created_at DESC
     LIMIT 5",
    [$_SESSION['user_id']]
);

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $activities[] = [
        'id' => 'msg_' . $row['id'],
        'type' => $row['type'],
        'text' => "پیام جدید از {$row['username']}",
        'username' => $row['username'],
        'avatar' => $row['avatar'],
        'user_id' => $row['id'],
        'time' => date('H:i', strtotime($row['created_at']))
    ];
}

// Recent online users
$stmt = $db->query(
    "SELECT id, username, avatar, last_seen
     FROM users 
     WHERE status = 'online' 
     AND last_seen > DATE_SUB(NOW(), INTERVAL 1 HOUR)
     AND id != ?
     ORDER BY last_seen DESC
     LIMIT 3",
    [$_SESSION['user_id']]
);

while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $activities[] = [
        'id' => 'online_' . $row['id'],
        'type' => 'online',
        'text' => "{$row['username']} آنلاین شد",
        'username' => $row['username'],
        'avatar' => $row['avatar'],
        'user_id' => $row['id'],
        'time' => date('H:i', strtotime($row['last_seen']))
    ];
}

// Sort by time
usort($activities, function($a, $b) {
    return strtotime($b['time']) - strtotime($a['time']);
});

// Limit to 10 activities
$activities = array_slice($activities, 0, 10);

echo json_encode(['success' => true, 'activities' => $activities]);
?>
