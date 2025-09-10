<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'لطفا وارد شوید']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $contactUserId = isset($_POST['contact_user_id']) ? (int)$_POST['contact_user_id'] : 0;
    $nickname = isset($_POST['nickname']) ? sanitize($_POST['nickname']) : null;
    $notes = isset($_POST['notes']) ? sanitize($_POST['notes']) : null;
    $isFavorite = isset($_POST['is_favorite']) ? (int)$_POST['is_favorite'] : null;
    
    if (!$contactUserId) {
        echo json_encode(['success' => false, 'message' => 'شناسه کاربر نامعتبر است']);
        exit;
    }
    
    $result = updateContact($_SESSION['user_id'], $contactUserId, $nickname, $notes, $isFavorite);
    echo json_encode($result);
} else {
    echo json_encode(['success' => false, 'message' => 'درخواست نامعتبر است']);
}
?>
