<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

if (isLoggedIn()) {
    updateUserStatus($_SESSION['user_id'], 'offline');
    session_destroy();
}

header('Location: index.php');
exit;
?> 