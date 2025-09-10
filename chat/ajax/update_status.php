<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';

if (!isLoggedIn()) {
    exit('Not logged in');
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $status = isset($_POST['status']) ? sanitize($_POST['status']) : '';
    
    if ($status) {
        updateUserStatus($_SESSION['user_id'], $status);
    }
}
?> 