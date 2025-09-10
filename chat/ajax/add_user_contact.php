<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../includes/config.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'لطفا وارد شوید']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = isset($_POST['username']) ? sanitize($_POST['username']) : '';
    $email = isset($_POST['email']) ? sanitize($_POST['email']) : '';
    $nickname = isset($_POST['nickname']) ? sanitize($_POST['nickname']) : null;
    $notes = isset($_POST['notes']) ? sanitize($_POST['notes']) : null;
    
    if (empty($username) || empty($email)) {
        echo json_encode(['success' => false, 'message' => 'نام کاربری و ایمیل الزامی است']);
        exit;
    }
    
    // Check if user already exists
    $db = new Database();
    $stmt = $db->query("SELECT id FROM users WHERE username = ? OR email = ?", [$username, $email]);
    
    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => false, 'message' => 'کاربر با این نام کاربری یا ایمیل قبلاً وجود دارد']);
        exit;
    }
    
    // Create new user
    $hashedPassword = password_hash('temp123', PASSWORD_DEFAULT);
    $result = $db->query(
        "INSERT INTO users (username, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
        [$username, $email, $hashedPassword]
    );
    
    if (!$result) {
        echo json_encode(['success' => false, 'message' => 'خطا در ایجاد کاربر']);
        exit;
    }
    
    $newUserId = $db->lastInsertId();
    
    // Add as contact
    $contactResult = addContact($_SESSION['user_id'], $newUserId, $nickname, $notes);
    
    if ($contactResult['success']) {
        echo json_encode([
            'success' => true, 
            'message' => 'کاربر جدید ایجاد شد و به مخاطبین اضافه شد',
            'user_id' => $newUserId
        ]);
    } else {
        echo json_encode($contactResult);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'درخواست نامعتبر است']);
}
?>
