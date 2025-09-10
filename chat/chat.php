<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

if (!isLoggedIn()) {
    header('Location: index.php');
    exit;
}

$currentUser = getUserById($_SESSION['user_id']);
if (!$currentUser) {
    header('Location: index.php');
    exit;
}
// $contacts = getContacts($_SESSION['user_id']); // Will be loaded via JavaScript
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="theme-color" content="#1890ff">
    <title>چت آنلاین - <?php echo $currentUser['username']; ?></title>
    <!-- Bootstrap 5.3 -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Ant Design -->
    <link href="https://cdn.jsdelivr.net/npm/antd@5.12.0/dist/reset.css" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    
    <!-- AOS Animation -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    
    <!-- Custom CSS -->
    <link href="assets/css/main.css" rel="stylesheet">
    <link href="assets/css/animations.css" rel="stylesheet">
    <link href="assets/css/responsive.css" rel="stylesheet">
    <link href="assets/css/advanced-ui.css" rel="stylesheet">
    <link href="assets/css/social-features.css" rel="stylesheet">
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        html {
            height: 100%;
            width: 100%;
        }
        
        body {
            font-family: 'YekanBakh', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f0f2f5;
            height: 100vh;
            width: 100vw;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
        
        body.dark-theme {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        }
        
        .chat-app {
            height: 100vh;
            width: 100vw;
            display: flex;
            background: #f0f2f5;
        }
        
        .chat-container {
            height: 100vh;
            width: 100vw;
            display: flex;
            flex-direction: column;
            background: white;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }
        
        .dark-theme .chat-app {
            background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        }
        
        .dark-theme .chat-container {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .chat-header {
            background: #25d366;
            color: white;
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .dark-theme .chat-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
        }
        
        .chat-header::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .user-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 3px solid rgba(255, 255, 255, 0.3);
            object-fit: cover;
        }
        
        .user-details h5 {
            margin: 0;
            font-size: 18px;
            font-weight: 700;
        }
        
        .user-status {
            font-size: 12px;
            opacity: 0.9;
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .status-dot {
            width: 8px;
            height: 8px;
            background: #52c41a;
            border-radius: 50%;
            animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
        }
        
        .header-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .btn-header {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .btn-header:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
            color: white;
        }
        
        .chat-body {
            flex: 1;
            display: flex;
            overflow: hidden;
        }
        
        .sidebar {
            width: 350px;
            background: white;
            border-left: 1px solid #e0e0e0;
            display: flex;
            flex-direction: column;
        }
        
        .dark-theme .sidebar {
            background: rgba(255, 255, 255, 0.95);
            border-left: 1px solid rgba(102, 126, 234, 0.2);
            backdrop-filter: blur(20px);
            box-shadow: 2px 0 20px rgba(0, 0, 0, 0.1);
        }
        
        .sidebar-header {
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-bottom: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);
        }
        
        .sidebar-title {
            font-size: 18px;
            font-weight: 700;
            color: white;
            margin: 0;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        .dark-theme .sidebar-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-bottom: none;
            box-shadow: 0 2px 10px rgba(102, 126, 234, 0.4);
        }
        
        .dark-theme .sidebar-title {
            color: white;
            font-weight: 700;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .search-container {
            padding: 15px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
        }
        
        .search-input {
            width: 100%;
            padding: 10px 40px 10px 15px;
            border: 1px solid #ddd;
            border-radius: 20px;
            font-size: 14px;
            background: white;
            transition: border-color 0.2s;
        }
        
        .search-input::placeholder {
            color: #999;
        }
        
        .search-input:focus {
            outline: none;
            border-color: #25d366;
            box-shadow: 0 0 0 2px rgba(37, 211, 102, 0.2);
        }
        
        .dark-theme .search-container {
            background: #2d2d2d;
            border-bottom: 1px solid #444;
        }
        
        .dark-theme .search-input {
            background: #3a3a3a;
            border: 1px solid #555;
            color: #fff;
        }
        
        .dark-theme .search-input:focus {
            border-color: #25d366;
            box-shadow: 0 0 0 2px rgba(37, 211, 102, 0.2);
        }
        
        .search-icon {
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #999;
            font-size: 14px;
        }
        
        .contacts-container {
            flex: 1;
            overflow-y: auto;
            background: white;
        }
        
        .dark-theme .contacts-container {
            background: transparent;
        }
        
        .contact-item {
            padding: 15px 20px;
            border-bottom: 1px solid rgba(102, 126, 234, 0.1);
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 15px;
            transition: all 0.3s ease;
            margin: 5px 10px;
            border-radius: 15px;
            background: rgba(255, 255, 255, 0.5);
        }
        
        .contact-item:hover {
            background: rgba(102, 126, 234, 0.1);
            transform: translateX(5px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
        }
        
        .contact-item.active {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%);
            border-right: 4px solid #667eea;
            transform: translateX(8px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
        }
        
        .dark-theme .contact-item {
            border-bottom: 1px solid rgba(102, 126, 234, 0.1);
            background: rgba(255, 255, 255, 0.1);
        }
        
        .dark-theme .contact-item:hover {
            background: rgba(102, 126, 234, 0.2);
            transform: translateX(5px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        
        .dark-theme .contact-item.active {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%);
            border-right: 4px solid #667eea;
            transform: translateX(8px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        }
        
        .contact-avatar {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            object-fit: cover;
            box-shadow: 0 4px 10px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
            border: 3px solid rgba(255, 255, 255, 0.8);
        }
        
        .contact-info {
            flex: 1;
            min-width: 0;
        }
        
        .contact-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 2px;
            font-size: 14px;
        }
        
        .contact-last-message {
            font-size: 12px;
            color: #666;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .dark-theme .contact-name {
            color: #333;
            font-weight: 700;
        }
        
        .dark-theme .contact-last-message {
            color: #666;
        }
        
        .contact-meta {
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 5px;
        }
        
        .contact-time {
            font-size: 11px;
            color: #999;
        }
        
        .contact-status {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #25d366;
        }
        
        .status-offline {
            background: #ccc;
        }
        
        .dark-theme .contact-time {
            color: #888;
        }
        
        .contact-actions {
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0;
            transition: all 0.3s ease;
        }
        
        .contact-item:hover .contact-actions {
            opacity: 1;
        }
        
        .btn-contact-action {
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #e9ecef;
            color: #8c8c8c;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            transition: all 0.3s ease;
        }
        
        .btn-contact-action:hover {
            background: #ff4d4f;
            color: white;
            border-color: #ff4d4f;
        }
        
        .chat-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: #e5ddd5;
        }
        
        .dark-theme .chat-area {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .chat-welcome {
            flex: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: #666;
        }
        
        .chat-welcome i {
            font-size: 48px;
            margin-bottom: 15px;
            opacity: 0.6;
        }
        
        .chat-welcome h4 {
            margin-bottom: 8px;
            color: #333;
        }
        
        .dark-theme .chat-welcome {
            color: rgba(255, 255, 255, 0.8);
        }
        
        .dark-theme .chat-welcome h4 {
            color: #fff;
            font-weight: 700;
        }
        
        .messages-area {
            flex: 1;
            overflow-y: auto;
            padding: 10px;
            background: transparent;
        }
        
        .dark-theme .messages-area {
            background: transparent;
        }
        
        .message {
            margin-bottom: 10px;
            display: flex;
            flex-direction: column;
        }
        
        .message.sent {
            align-items: flex-start;
        }
        
        .message.received {
            align-items: flex-end;
        }
        
        .message-content {
            max-width: 70%;
            padding: 8px 12px;
            border-radius: 18px;
            position: relative;
            word-wrap: break-word;
            font-size: 14px;
        }
        
        .sent .message-content {
            background: #dcf8c6;
            color: #333;
            border-bottom-left-radius: 4px;
        }
        
        .received .message-content {
            background: white;
            color: #333;
            border-bottom-right-radius: 4px;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }
        
        .dark-theme .received .message-content {
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .message-time {
            font-size: 11px;
            color: #999;
            margin-top: 2px;
            display: flex;
            align-items: center;
            gap: 3px;
        }
        
        .dark-theme .message-time {
            color: rgba(255, 255, 255, 0.7);
        }
        
        .message-status {
            margin-left: 5px;
        }
        
        .message-status i {
            font-size: 12px;
        }
        
        .message-status .read {
            color: #1890ff;
        }
        
        .typing-indicator {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 12px;
            color: #8c8c8c;
            margin-top: 10px;
        }
        
        .typing-dots {
            display: flex;
            gap: 2px;
        }
        
        .typing-dot {
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: #8c8c8c;
            animation: typing 1.4s infinite ease-in-out;
        }
        
        .typing-dot:nth-child(1) { animation-delay: -0.32s; }
        .typing-dot:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typing {
            0%, 80%, 100% {
                transform: scale(0);
                opacity: 0.5;
            }
            40% {
                transform: scale(1);
                opacity: 1;
            }
        }
        
        .chat-input-area {
            padding: 10px 15px;
            background: #f0f0f0;
            border-top: 1px solid #e0e0e0;
        }
        
        .dark-theme .chat-input-area {
            background: #4a4a4a;
            border-top: 1px solid #555;
        }
        
        .input-container {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        
        .message-input {
            flex: 1;
            border: 1px solid #ddd;
            border-radius: 20px;
            padding: 8px 15px;
            font-size: 14px;
            background: white;
        }
        
        .message-input:focus {
            outline: none;
            border-color: #25d366;
        }
        
        .dark-theme .message-input {
            background: #5a5a5a;
            border: 1px solid #666;
            color: #fff;
        }
        
        .dark-theme .message-input:focus {
            border-color: #128c7e;
        }
        
        .btn-send {
            background: #25d366;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .btn-send:hover {
            background: #128c7e;
        }
        
        .btn-attach {
            background: #f0f0f0;
            border: 1px solid #ddd;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            color: #666;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
        }
        
        .btn-attach:hover {
            background: #e0e0e0;
        }
        
        .dark-theme .btn-attach {
            background: #5a5a5a;
            border: 1px solid #666;
            color: #ccc;
        }
        
        .dark-theme .btn-attach:hover {
            background: #666;
        }
        
        .empty-contacts {
            text-align: center;
            padding: 40px 20px;
            color: #8c8c8c;
        }
        
        .empty-contacts i {
            font-size: 48px;
            margin-bottom: 15px;
            opacity: 0.5;
        }
        
        .empty-contacts h6 {
            margin-bottom: 10px;
            color: #262626;
        }
        
        .empty-contacts p {
            font-size: 14px;
            margin: 0;
        }
        
        .search-results {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            max-height: 200px;
            overflow-y: auto;
            z-index: 1000;
            display: none;
            margin-top: 5px;
        }
        
        .search-result-item {
            padding: 10px 15px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: background 0.2s;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .search-result-item:last-child {
            border-bottom: none;
        }
        
        .search-result-item:hover {
            background: #f5f5f5;
        }
        
        .search-result-item.selected {
            background: #e3f2fd;
        }
        
        .search-result-avatar {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            object-fit: cover;
        }
        
        .search-result-info {
            flex: 1;
        }
        
        .search-result-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 2px;
            font-size: 14px;
        }
        
        .search-result-email {
            font-size: 12px;
            color: #666;
        }
        
        .form-control-custom {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.2s;
        }
        
        .form-control-custom:focus {
            outline: none;
            border-color: #25d366;
            box-shadow: 0 0 0 2px rgba(37, 211, 102, 0.2);
        }
        
        .form-label {
            font-weight: 600;
            color: #333;
            margin-bottom: 5px;
            display: block;
        }
        
        .btn-primary-custom {
            background: #25d366;
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 500;
            transition: background 0.2s;
        }
        
        .btn-primary-custom:hover {
            background: #128c7e;
            color: white;
        }
        
        .btn-custom {
            background: #25d366;
            border: none;
            color: white;
        }
        
        .btn-custom:hover {
            background: #128c7e;
            color: white;
        }
        
        .btn-primary-custom {
            background: linear-gradient(135deg, #1890ff, #40a9ff);
            border: none;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
        }
        
        .btn-primary-custom:hover {
            background: linear-gradient(135deg, #40a9ff, #1890ff);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
            color: white;
        }
        
        /* Dark Theme */
        .dark-theme {
            background: #0d1117;
        }
        
        .dark-theme .chat-container {
            background: #161b22;
        }
        
        .dark-theme .chat-header {
            background: rgba(22, 27, 34, 0.8);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .dark-theme .sidebar {
            background: #0d1117;
            border-left: 1px solid #30363d;
        }
        
        .dark-theme .sidebar-header {
            background: #161b22;
            border-bottom: 1px solid #30363d;
        }
        
        .dark-theme .sidebar-title {
            color: #f0f6fc;
        }
        
        .dark-theme .search-container {
            background: #161b22;
            border-bottom: 1px solid #30363d;
        }
        
        .dark-theme .search-input {
            background: #0d1117;
            border: 2px solid #30363d;
            color: #f0f6fc;
        }
        
        .dark-theme .search-input:focus {
            border-color: #58a6ff;
            background: #21262d;
        }
        
        .dark-theme .contacts-container {
            background: #0d1117;
        }
        
        .dark-theme .contact-item {
            border-bottom: 1px solid #21262d;
        }
        
        .dark-theme .contact-item:hover {
            background: #21262d;
        }
        
        .dark-theme .contact-item.active {
            background: rgba(88, 166, 255, 0.1);
            border-right: 3px solid #58a6ff;
        }
        
        .dark-theme .contact-name {
            color: #f0f6fc;
        }
        
        .dark-theme .contact-last-message {
            color: #8b949e;
        }
        
        .dark-theme .contact-time {
            color: #8b949e;
        }
        
        .dark-theme .chat-area {
            background: #0d1117;
        }
        
        .dark-theme .chat-welcome {
            color: #8b949e;
        }
        
        .dark-theme .chat-welcome h4 {
            color: #f0f6fc;
        }
        
        .dark-theme .messages-area {
            background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
        }
        
        .dark-theme .received .message-content {
            background: #21262d;
            color: #f0f6fc;
            border: 1px solid #30363d;
        }
        
        .dark-theme .message-time {
            color: #8b949e;
        }
        
        .dark-theme .chat-input-area {
            background: #161b22;
            border-top: 1px solid #30363d;
        }
        
        .dark-theme .message-input {
            background: #0d1117;
            border: 2px solid #30363d;
            color: #f0f6fc;
        }
        
        .dark-theme .message-input:focus {
            border-color: #58a6ff;
            background: #21262d;
        }
        
        .dark-theme .btn-attach {
            background: #21262d;
            border: 2px solid #30363d;
            color: #8b949e;
        }
        
        .dark-theme .btn-attach:hover {
            background: #58a6ff;
            border-color: #58a6ff;
            color: white;
        }
        
        /* Tab Styles */
        .nav-tabs {
            border-bottom: 2px solid #e9ecef;
            margin-bottom: 0;
        }
        
        .nav-tabs .nav-link {
            border: none;
            color: #6c757d;
            font-weight: 500;
            padding: 12px 20px;
            transition: all 0.3s ease;
        }
        
        .nav-tabs .nav-link:hover {
            border: none;
            color: #1890ff;
            background: rgba(24, 144, 255, 0.1);
        }
        
        .nav-tabs .nav-link.active {
            color: #1890ff;
            background: rgba(24, 144, 255, 0.1);
            border: none;
            border-bottom: 2px solid #1890ff;
        }
        
        .dark-theme .nav-tabs {
            border-bottom: 2px solid #30363d;
        }
        
        .dark-theme .nav-tabs .nav-link {
            color: #8b949e;
        }
        
        .dark-theme .nav-tabs .nav-link:hover {
            color: #58a6ff;
            background: rgba(88, 166, 255, 0.1);
        }
        
        .dark-theme .nav-tabs .nav-link.active {
            color: #58a6ff;
            background: rgba(88, 166, 255, 0.1);
            border-bottom: 2px solid #58a6ff;
        }
        
        .alert-info {
            background: rgba(24, 144, 255, 0.1);
            border: 1px solid rgba(24, 144, 255, 0.2);
            color: #1890ff;
        }
        
        .dark-theme .alert-info {
            background: rgba(88, 166, 255, 0.1);
            border: 1px solid rgba(88, 166, 255, 0.2);
            color: #58a6ff;
        }
        
        /* System Messages */
        .system-message {
            text-align: center;
            margin: 20px 0;
            padding: 10px 20px;
            background: rgba(24, 144, 255, 0.1);
            border: 1px solid rgba(24, 144, 255, 0.2);
            border-radius: 20px;
            color: #1890ff;
            font-size: 14px;
            font-weight: 500;
            animation: systemMessageSlide 0.5s ease-out;
        }
        
        @keyframes systemMessageSlide {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .dark-theme .system-message {
            background: rgba(88, 166, 255, 0.1);
            border: 1px solid rgba(88, 166, 255, 0.2);
            color: #58a6ff;
        }
        
        @media (max-width: 768px) {
            .chat-app {
                margin: 0;
            }
            
            .chat-container {
                margin: 0;
                border-radius: 0;
            }
            
            .sidebar {
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1000;
                transform: translateX(-100%);
                transition: transform 0.3s ease;
            }
            
            .sidebar.show {
                transform: translateX(0);
            }
            
            .message-content {
                max-width: 85%;
            }
        }
    </style>
</head>
<body>
    <div class="chat-app">
        <div class="chat-container" data-aos="fade-up" data-aos-duration="800">
        <div class="chat-header">
                <div class="user-info">
                    <img src="<?php echo $currentUser['avatar'] ?: 'https://ui-avatars.com/api/?name=' . urlencode($currentUser['username']) . '&background=1890ff&color=fff'; ?>" 
                         class="user-avatar" alt="<?php echo $currentUser['username']; ?>">
                    <div class="user-details">
                        <h5><?php echo $currentUser['username']; ?></h5>
                        <div class="user-status">
                            <span class="status-dot"></span>
                            آنلاین
                        </div>
                    </div>
            </div>
                <div class="header-actions">
                    <button class="btn-header" id="theme-toggle" title="تغییر تم">
                        <i class="fas fa-moon" id="theme-icon"></i>
                    </button>
                    <button class="btn-header" id="mobile-menu-toggle">
                        <i class="fas fa-bars"></i>
                    </button>
                    <a href="logout.php" class="btn-header">
                        <i class="fas fa-sign-out-alt me-2"></i> خروج
                    </a>
                </div>
        </div>
        
        <div class="chat-body">
                <div class="sidebar">
                    <div class="sidebar-header">
                        <h5 class="sidebar-title">مخاطبین</h5>
                        <button class="btn btn-sm btn-primary-custom btn-custom" id="add-contact-btn" data-bs-toggle="modal" data-bs-target="#addContactModal">
                            <i class="fas fa-user-plus"></i>
                        </button>
                            </div>
                    
                    <div class="search-container">
                        <div class="search-box">
                            <input type="text" class="search-input" id="contact-search" placeholder="جستجو در مخاطبین...">
                            <i class="fas fa-search search-icon"></i>
                        </div>
            </div>
            
                    <div class="contacts-container" id="contacts-list">
                        <!-- Contacts will be loaded via JavaScript -->
                    </div>
                </div>
                
                <div class="chat-area">
                    <div class="chat-welcome" id="chat-welcome">
                        <i class="fas fa-comments"></i>
                        <h4>خوش آمدید!</h4>
                        <p>برای شروع چت، یک مخاطب را انتخاب کنید</p>
                    </div>
                    
                    <div class="messages-area" id="messages" style="display: none;">
                        <!-- Messages will be loaded here -->
                        <div id="system-messages"></div>
                    </div>
                    
                    <div class="chat-input-area" id="chat-input" style="display: none;">
                        <form id="message-form" class="input-container">
                            <input type="text" class="message-input" id="message-input" placeholder="پیام خود را بنویسید...">
                            <button type="button" class="btn-attach" id="emoji-btn" title="اموجی">
                                <i class="fas fa-smile"></i>
                            </button>
                            <button type="button" class="btn-attach" id="voice-btn" title="پیام صوتی">
                                <i class="fas fa-microphone"></i>
                            </button>
                            <button type="button" class="btn-attach" id="attach-file" title="فایل">
                                <i class="fas fa-paperclip"></i>
                            </button>
                            <button type="submit" class="btn-send" id="send-btn" title="ارسال">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </form>
                        <input type="file" id="file-input" style="display: none;" multiple accept="image/*,video/*,audio/*,.pdf,.doc,.docx">
                    </div>
            </div>
        </div>
    </div>
    
    <!-- Add Contact Modal -->
    <div class="modal fade" id="addContactModal" tabindex="-1" aria-labelledby="addContactModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addContactModalLabel">اضافه کردن مخاطب</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <ul class="nav nav-tabs" id="contactTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="search-tab" data-bs-toggle="tab" data-bs-target="#search-pane" type="button" role="tab">
                                جستجو کاربر موجود
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="create-tab" data-bs-toggle="tab" data-bs-target="#create-pane" type="button" role="tab">
                                ایجاد کاربر جدید
                            </button>
                        </li>
                    </ul>
                    
                    <div class="tab-content" id="contactTabContent">
                        <div class="tab-pane fade show active" id="search-pane" role="tabpanel">
                            <div class="mb-3 mt-3">
                                <label for="user-search" class="form-label">جستجو کاربر</label>
                                <input type="text" class="form-control-custom" id="user-search" placeholder="نام کاربری یا ایمیل...">
                                <div id="search-results" class="search-results"></div>
                            </div>
                            <div class="mb-3">
                                <label for="contact-nickname" class="form-label">نام مستعار (اختیاری)</label>
                                <input type="text" class="form-control-custom" id="contact-nickname" placeholder="نام مستعار...">
                            </div>
                            <div class="mb-3">
                                <label for="contact-notes" class="form-label">یادداشت (اختیاری)</label>
                                <textarea class="form-control-custom" id="contact-notes" rows="3" placeholder="یادداشت..."></textarea>
                            </div>
                        </div>
                        
                        <div class="tab-pane fade" id="create-pane" role="tabpanel">
                            <div class="mb-3 mt-3">
                                <label for="new-username" class="form-label">نام کاربری *</label>
                                <input type="text" class="form-control-custom" id="new-username" placeholder="نام کاربری...">
                            </div>
                            <div class="mb-3">
                                <label for="new-email" class="form-label">ایمیل *</label>
                                <input type="email" class="form-control-custom" id="new-email" placeholder="ایمیل...">
                            </div>
                            <div class="mb-3">
                                <label for="new-nickname" class="form-label">نام مستعار (اختیاری)</label>
                                <input type="text" class="form-control-custom" id="new-nickname" placeholder="نام مستعار...">
                            </div>
                            <div class="mb-3">
                                <label for="new-notes" class="form-label">یادداشت (اختیاری)</label>
                                <textarea class="form-control-custom" id="new-notes" rows="3" placeholder="یادداشت..."></textarea>
                            </div>
                            <div class="alert alert-info">
                                <i class="fas fa-info-circle"></i>
                                کاربر جدید با رمز عبور موقت ایجاد می‌شود و می‌تواند بعداً آن را تغییر دهد.
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">انصراف</button>
                    <button type="button" class="btn btn-primary-custom btn-custom" id="save-contact-btn">اضافه کردن</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Edit Contact Modal -->
    <div class="modal fade" id="editContactModal" tabindex="-1" aria-labelledby="editContactModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editContactModalLabel">ویرایش مخاطب</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <input type="hidden" id="edit-contact-user-id">
                    <div class="mb-3">
                        <label for="edit-contact-nickname" class="form-label">نام مستعار</label>
                        <input type="text" class="form-control-custom" id="edit-contact-nickname" placeholder="نام مستعار...">
                    </div>
                    <div class="mb-3">
                        <label for="edit-contact-notes" class="form-label">یادداشت</label>
                        <textarea class="form-control-custom" id="edit-contact-notes" rows="3" placeholder="یادداشت..."></textarea>
                    </div>
                    <div class="mb-3">
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" id="edit-contact-favorite">
                            <label class="form-check-label" for="edit-contact-favorite">
                                مخاطب مورد علاقه
                            </label>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">انصراف</button>
                    <button type="button" class="btn btn-primary-custom btn-custom" id="update-contact-btn">به‌روزرسانی</button>
                </div>
            </div>
        </div>
    </div>
    
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
    
    <!-- Bootstrap 5.3 -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- GSAP -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    
    <!-- AOS Animation -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    
    <!-- SweetAlert2 -->
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    
    <!-- Custom JS -->
    <script src="assets/js/main.js"></script>
    <script src="assets/js/animations.js"></script>
    <script src="assets/js/toast.js"></script>
    <script src="assets/js/contacts.js"></script>
    <script src="assets/js/mobile.js"></script>
    <script src="assets/js/advanced-features.js"></script>
    <script src="assets/js/social-features.js"></script>
    
    <script>
        // Initialize Contact Manager
        $(document).ready(function() {
            window.contactManager = new ContactManager();
        });
    </script>
    
    <script>
        // Theme Toggle
        document.addEventListener('DOMContentLoaded', function() {
            const themeToggle = document.getElementById('theme-toggle');
            const themeIcon = document.getElementById('theme-icon');
            const body = document.body;
            
            // Load saved theme
            const savedTheme = localStorage.getItem('theme') || 'light';
            if (savedTheme === 'dark') {
                body.classList.add('dark-theme');
                themeIcon.className = 'fas fa-sun';
            } else {
                body.classList.remove('dark-theme');
                themeIcon.className = 'fas fa-moon';
            }
            
            // Toggle theme
            themeToggle.addEventListener('click', function() {
                body.classList.toggle('dark-theme');
                
                if (body.classList.contains('dark-theme')) {
                    themeIcon.className = 'fas fa-sun';
                    localStorage.setItem('theme', 'dark');
                } else {
                    themeIcon.className = 'fas fa-moon';
                    localStorage.setItem('theme', 'light');
                }
            });
        });
    </script>
</body>
</html> 