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
    "SELECT id, username, avatar, status, last_seen 
     FROM users 
     WHERE status = 'online' 
     AND last_seen > DATE_SUB(NOW(), INTERVAL 5 MINUTE)
     AND id != ?
     ORDER BY last_seen DESC",
    [$_SESSION['user_id']]
);

$users = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $users[] = [
        'id' => $row['id'],
        'username' => $row['username'],
        'avatar' => $row['avatar'],
        'status' => $row['status'],
        'last_seen' => $row['last_seen']
    ];
}

echo json_encode(['success' => true, 'users' => $users]);
?>
