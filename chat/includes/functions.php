<?php
require_once 'db.php';

function sanitize($data) {
    return htmlspecialchars(strip_tags($data));
}

function isLoggedIn() {
    return isset($_SESSION['user_id']);
}

function getUserById($id) {
    $db = new Database();
    $stmt = $db->query("SELECT * FROM users WHERE id = ?", [$id]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function getUnreadMessages($userId) {
    $db = new Database();
    $stmt = $db->query(
        "SELECT COUNT(*) as count FROM messages 
         WHERE receiver_id = ? AND is_read = 0",
        [$userId]
    );
    return $stmt->fetch(PDO::FETCH_ASSOC)['count'];
}

function updateUserStatus($userId, $status) {
    $db = new Database();
    $db->query(
        "UPDATE users SET status = ?, last_seen = NOW() WHERE id = ?",
        [$status, $userId]
    );
}

function getChatMessages($userId, $otherUserId, $limit = 50) {
    $db = new Database();
    $stmt = $db->query(
        "SELECT m.*, u.username, u.avatar 
         FROM messages m 
         JOIN users u ON m.sender_id = u.id 
         WHERE (m.sender_id = ? AND m.receiver_id = ?) 
         OR (m.sender_id = ? AND m.receiver_id = ?) 
         ORDER BY m.created_at DESC 
         LIMIT " . (int)$limit,
        [$userId, $otherUserId, $otherUserId, $userId]
    );
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function markMessagesAsRead($senderId, $receiverId) {
    $db = new Database();
    $db->query(
        "UPDATE messages 
         SET is_read = 1 
         WHERE sender_id = ? AND receiver_id = ? AND is_read = 0",
        [$senderId, $receiverId]
    );
    return true;
}

function uploadFile($file) {
    $fileName = time() . '_' . basename($file['name']);
    $targetPath = UPLOAD_PATH . $fileName;
    
    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        return $fileName;
    }
    return false;
}

function getOnlineUsers() {
    $db = new Database();
    $stmt = $db->query(
        "SELECT id, username, avatar 
         FROM users 
         WHERE status = 'online' 
         AND last_seen > DATE_SUB(NOW(), INTERVAL 5 MINUTE)"
    );
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

/* ===== Contact Management Functions ===== */

function addContact($userId, $contactUserId, $nickname = null, $notes = null) {
    $db = new Database();
    
    // Check if contact already exists
    $stmt = $db->query(
        "SELECT id FROM contacts WHERE user_id = ? AND contact_user_id = ?",
        [$userId, $contactUserId]
    );
    
    if ($stmt->rowCount() > 0) {
        return ['success' => false, 'message' => 'مخاطب قبلاً اضافه شده است'];
    }
    
    // Check if user is trying to add themselves
    if ($userId == $contactUserId) {
        return ['success' => false, 'message' => 'نمی‌توانید خود را به عنوان مخاطب اضافه کنید'];
    }
    
    // Add contact
    $result = $db->query(
        "INSERT INTO contacts (user_id, contact_user_id, nickname, notes, created_at, updated_at) 
         VALUES (?, ?, ?, ?, NOW(), NOW())",
        [$userId, $contactUserId, $nickname, $notes]
    );
    
    if ($result) {
        return ['success' => true, 'message' => 'مخاطب با موفقیت اضافه شد'];
    } else {
        return ['success' => false, 'message' => 'خطا در اضافه کردن مخاطب'];
    }
}

function getContacts($userId) {
    $db = new Database();
    $stmt = $db->query(
        "SELECT c.*, u.username, u.email, u.avatar, u.status, u.last_seen
         FROM contacts c
         JOIN users u ON c.contact_user_id = u.id
         WHERE c.user_id = ?
         ORDER BY c.is_favorite DESC, c.nickname ASC, u.username ASC",
        [$userId]
    );
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getContact($userId, $contactUserId) {
    $db = new Database();
    $stmt = $db->query(
        "SELECT c.*, u.username, u.email, u.avatar, u.status, u.last_seen
         FROM contacts c
         JOIN users u ON c.contact_user_id = u.id
         WHERE c.user_id = ? AND c.contact_user_id = ?",
        [$userId, $contactUserId]
    );
    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function updateContact($userId, $contactUserId, $nickname = null, $notes = null, $isFavorite = null) {
    $db = new Database();
    
    $updateFields = [];
    $params = [];
    
    if ($nickname !== null) {
        $updateFields[] = "nickname = ?";
        $params[] = $nickname;
    }
    
    if ($notes !== null) {
        $updateFields[] = "notes = ?";
        $params[] = $notes;
    }
    
    if ($isFavorite !== null) {
        $updateFields[] = "is_favorite = ?";
        $params[] = $isFavorite;
    }
    
    if (empty($updateFields)) {
        return ['success' => false, 'message' => 'هیچ فیلدی برای به‌روزرسانی مشخص نشده است'];
    }
    
    $updateFields[] = "updated_at = NOW()";
    $params[] = $userId;
    $params[] = $contactUserId;
    
    $result = $db->query(
        "UPDATE contacts SET " . implode(', ', $updateFields) . " 
         WHERE user_id = ? AND contact_user_id = ?",
        $params
    );
    
    if ($result) {
        return ['success' => true, 'message' => 'مخاطب با موفقیت به‌روزرسانی شد'];
    } else {
        return ['success' => false, 'message' => 'خطا در به‌روزرسانی مخاطب'];
    }
}

function deleteContact($userId, $contactUserId) {
    $db = new Database();
    
    $result = $db->query(
        "DELETE FROM contacts WHERE user_id = ? AND contact_user_id = ?",
        [$userId, $contactUserId]
    );
    
    if ($result) {
        return ['success' => true, 'message' => 'مخاطب با موفقیت حذف شد'];
    } else {
        return ['success' => false, 'message' => 'خطا در حذف مخاطب'];
    }
}

function searchUsers($query, $excludeUserId = null) {
    $db = new Database();
    
    $sql = "SELECT id, username, email, avatar, status, last_seen 
            FROM users 
            WHERE (username LIKE ? OR email LIKE ?)";
    $params = ["%$query%", "%$query%"];
    
    if ($excludeUserId) {
        $sql .= " AND id != ?";
        $params[] = $excludeUserId;
    }
    
    $sql .= " ORDER BY username ASC LIMIT 20";
    
    $stmt = $db->query($sql, $params);
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function isContact($userId, $contactUserId) {
    $db = new Database();
    $stmt = $db->query(
        "SELECT id FROM contacts WHERE user_id = ? AND contact_user_id = ?",
        [$userId, $contactUserId]
    );
    return $stmt->rowCount() > 0;
}

function getFavoriteContacts($userId) {
    $db = new Database();
    $stmt = $db->query(
        "SELECT c.*, u.username, u.email, u.avatar, u.status, u.last_seen
         FROM contacts c
         JOIN users u ON c.contact_user_id = u.id
         WHERE c.user_id = ? AND c.is_favorite = 1
         ORDER BY c.updated_at DESC",
        [$userId]
    );
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
?> 