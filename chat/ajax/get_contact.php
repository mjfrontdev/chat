<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'لطفا وارد شوید']);
    exit;
}

$contactUserId = isset($_GET['contact_user_id']) ? (int)$_GET['contact_user_id'] : 0;

if (!$contactUserId) {
    echo json_encode(['success' => false, 'message' => 'شناسه کاربر نامعتبر است']);
    exit;
}

$contact = getContact($_SESSION['user_id'], $contactUserId);

if ($contact) {
    echo json_encode(['success' => true, 'contact' => $contact]);
} else {
    echo json_encode(['success' => false, 'message' => 'مخاطب یافت نشد']);
}
?>
