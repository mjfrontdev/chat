<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'لطفا وارد شوید']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $query = isset($_GET['q']) ? sanitize($_GET['q']) : '';
    
    if (strlen($query) < 2) {
        echo json_encode(['success' => true, 'users' => []]);
        exit;
    }
    
    $users = searchUsers($query, $_SESSION['user_id']);
    echo json_encode(['success' => true, 'users' => $users]);
} else {
    echo json_encode(['success' => false, 'message' => 'درخواست نامعتبر است']);
}
?>
