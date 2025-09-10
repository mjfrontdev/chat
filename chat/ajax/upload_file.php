<?php
require_once '../includes/config.php';
require_once '../includes/functions.php';

header('Content-Type: application/json');

if (!isLoggedIn()) {
    echo json_encode(['success' => false, 'message' => 'لطفا وارد شوید']);
    exit;
}

if (!isset($_FILES['file'])) {
    echo json_encode(['success' => false, 'message' => 'فایل انتخاب نشده']);
    exit;
}

$file = $_FILES['file'];
$fileName = $file['name'];
$fileSize = $file['size'];
$fileType = $file['type'];
$fileTmpName = $file['tmp_name'];

// Check file size
if ($fileSize > MAX_FILE_SIZE) {
    echo json_encode(['success' => false, 'message' => 'حجم فایل بیش از حد مجاز است']);
    exit;
}

// Check file type
$fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
if (!in_array($fileExtension, ALLOWED_FILE_TYPES)) {
    echo json_encode(['success' => false, 'message' => 'نوع فایل مجاز نیست']);
    exit;
}

// Generate unique filename
$newFileName = time() . '_' . uniqid() . '.' . $fileExtension;
$uploadPath = UPLOAD_PATH . $newFileName;

// Create upload directory if it doesn't exist
if (!file_exists(UPLOAD_PATH)) {
    mkdir(UPLOAD_PATH, 0755, true);
}

// Move uploaded file
if (move_uploaded_file($fileTmpName, $uploadPath)) {
    echo json_encode([
        'success' => true, 
        'file_url' => SITE_URL . '/' . $uploadPath,
        'file_name' => $fileName,
        'file_size' => $fileSize,
        'file_type' => $fileType
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'خطا در آپلود فایل']);
}
?>
