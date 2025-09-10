<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

if (isLoggedIn()) {
    header('Location: chat.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    if (isset($_POST['login'])) {
        $email = sanitize($_POST['email']);
        $password = $_POST['password'];
        
        $db = new Database();
        $stmt = $db->query("SELECT * FROM users WHERE email = ?", [$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            updateUserStatus($user['id'], 'online');
            header('Location: chat.php');
            exit;
        } else {
            $error = 'Invalid email or password';
        }
    } elseif (isset($_POST['register'])) {
        $username = sanitize($_POST['username']);
        $email = sanitize($_POST['email']);
        $password = password_hash($_POST['password'], PASSWORD_DEFAULT);
        
        $db = new Database();
        $stmt = $db->query("SELECT id FROM users WHERE email = ?", [$email]);
        
        if ($stmt->rowCount() > 0) {
            $error = 'Email already exists';
        } else {
            $db->query(
                "INSERT INTO users (username, email, password, status) VALUES (?, ?, ?, 'offline')",
                [$username, $email, $password]
            );
            $error = 'Registration successful! Please login.';
        }
    }
}
?>
<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>چت آنلاین - ورود و ثبت‌نام</title>
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
    
    <style>
        .auth-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        }
        
        .auth-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><radialGradient id="a" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="%23ffffff" stop-opacity="0.1"/><stop offset="100%" stop-color="%23ffffff" stop-opacity="0"/></radialGradient></defs><circle cx="200" cy="200" r="100" fill="url(%23a)"/><circle cx="800" cy="300" r="150" fill="url(%23a)"/><circle cx="400" cy="700" r="120" fill="url(%23a)"/><circle cx="900" cy="800" r="80" fill="url(%23a)"/></svg>') no-repeat center center;
            background-size: cover;
            opacity: 0.3;
        }
        
        .auth-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(20px);
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            overflow: hidden;
            position: relative;
            z-index: 10;
        }
        
        .auth-header {
            background: linear-gradient(135deg, #1890ff, #40a9ff);
            color: white;
            padding: 40px 40px 30px;
            text-align: center;
            position: relative;
        }
        
        .auth-header::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 60px;
            height: 4px;
            background: white;
            border-radius: 2px;
        }
        
        .auth-logo {
            width: 80px;
            height: 80px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 32px;
        }
        
        .auth-title {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .auth-subtitle {
            font-size: 16px;
            opacity: 0.9;
            margin: 0;
        }
        
        .auth-body {
            padding: 40px;
        }
        
        .nav-tabs {
            border: none;
            margin-bottom: 30px;
            background: #f8f9fa;
            border-radius: 12px;
            padding: 4px;
        }
        
        .nav-tabs .nav-link {
            border: none;
            color: #6c757d;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .nav-tabs .nav-link.active {
            background: white;
            color: #1890ff;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .form-floating {
            margin-bottom: 20px;
        }
        
        .form-floating .form-control {
            border: 2px solid #e9ecef;
            border-radius: 12px;
            padding: 20px 16px 8px;
            font-size: 16px;
            transition: all 0.3s ease;
        }
        
        .form-floating .form-control:focus {
            border-color: #1890ff;
            box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
        }
        
        .form-floating label {
            padding: 20px 16px 8px;
            color: #6c757d;
            font-weight: 500;
        }
        
        .btn-auth {
            background: linear-gradient(135deg, #1890ff, #40a9ff);
            border: none;
            border-radius: 12px;
            padding: 16px;
            font-size: 16px;
            font-weight: 600;
            color: white;
            width: 100%;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }
        
        .btn-auth:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(24, 144, 255, 0.3);
            color: white;
        }
        
        .btn-auth:active {
            transform: translateY(0);
        }
        
        .btn-auth::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }
        
        .btn-auth:hover::before {
            left: 100%;
        }
        
        .alert-custom {
            border: none;
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 20px;
            font-weight: 500;
        }
        
        .alert-success {
            background: linear-gradient(135deg, #52c41a, #73d13d);
            color: white;
        }
        
        .alert-danger {
            background: linear-gradient(135deg, #ff4d4f, #ff7875);
            color: white;
        }
        
        .floating-elements {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            z-index: 1;
        }
        
        .floating-element {
            position: absolute;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            animation: float 6s ease-in-out infinite;
        }
        
        .floating-element:nth-child(1) {
            width: 80px;
            height: 80px;
            top: 20%;
            left: 10%;
            animation-delay: 0s;
        }
        
        .floating-element:nth-child(2) {
            width: 120px;
            height: 120px;
            top: 60%;
            right: 15%;
            animation-delay: 2s;
        }
        
        .floating-element:nth-child(3) {
            width: 60px;
            height: 60px;
            bottom: 20%;
            left: 20%;
            animation-delay: 4s;
        }
        
        @keyframes float {
            0%, 100% {
                transform: translateY(0px) rotate(0deg);
            }
            50% {
                transform: translateY(-20px) rotate(180deg);
            }
        }
        
        .social-login {
            margin-top: 30px;
            text-align: center;
        }
        
        .social-login p {
            color: #6c757d;
            margin-bottom: 20px;
            position: relative;
        }
        
        .social-login p::before,
        .social-login p::after {
            content: '';
            position: absolute;
            top: 50%;
            width: 30%;
            height: 1px;
            background: #e9ecef;
        }
        
        .social-login p::before {
            right: 0;
        }
        
        .social-login p::after {
            left: 0;
        }
        
        .social-buttons {
            display: flex;
            gap: 12px;
            justify-content: center;
        }
        
        .btn-social {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 2px solid #e9ecef;
            background: white;
            color: #6c757d;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        
        .btn-social:hover {
            border-color: #1890ff;
            color: #1890ff;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
        }
        
        @media (max-width: 768px) {
            .auth-card {
                margin: 20px;
                border-radius: 20px;
            }
            
            .auth-header {
                padding: 30px 20px 20px;
            }
            
            .auth-body {
                padding: 30px 20px;
            }
            
            .auth-title {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="auth-container">
        <!-- Floating Elements -->
        <div class="floating-elements">
            <div class="floating-element"></div>
            <div class="floating-element"></div>
            <div class="floating-element"></div>
        </div>
        
    <div class="container">
        <div class="row justify-content-center">
                <div class="col-md-6 col-lg-5">
                    <div class="auth-card" data-aos="zoom-in" data-aos-duration="800">
                        <div class="auth-header">
                            <div class="auth-logo">
                                <i class="fas fa-comments"></i>
                            </div>
                            <h1 class="auth-title">چت آنلاین</h1>
                            <p class="auth-subtitle">با دوستان خود در ارتباط باشید</p>
                    </div>
                        
                        <div class="auth-body">
                            <?php if ($error): ?>
                                <div class="alert alert-<?php echo strpos($error, 'successful') !== false ? 'success' : 'danger'; ?> alert-custom">
                                    <i class="fas fa-<?php echo strpos($error, 'successful') !== false ? 'check-circle' : 'exclamation-circle'; ?> me-2"></i>
                                    <?php echo $error; ?>
                                </div>
                            <?php endif; ?>
                            
                            <ul class="nav nav-tabs" id="myTab" role="tablist">
                            <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="login-tab" data-bs-toggle="tab" data-bs-target="#login" type="button">
                                        <i class="fas fa-sign-in-alt me-2"></i>ورود
                                    </button>
                            </li>
                            <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="register-tab" data-bs-toggle="tab" data-bs-target="#register" type="button">
                                        <i class="fas fa-user-plus me-2"></i>ثبت‌نام
                                    </button>
                            </li>
                        </ul>
                        
                        <div class="tab-content" id="myTabContent">
                            <div class="tab-pane fade show active" id="login">
                                    <form method="POST" id="loginForm">
                                        <div class="form-floating">
                                            <input type="email" class="form-control" id="loginEmail" name="email" placeholder="ایمیل" required>
                                            <label for="loginEmail">ایمیل</label>
                                    </div>
                                        <div class="form-floating">
                                            <input type="password" class="form-control" id="loginPassword" name="password" placeholder="رمز عبور" required>
                                            <label for="loginPassword">رمز عبور</label>
                                    </div>
                                        <button type="submit" name="login" class="btn btn-auth">
                                            <i class="fas fa-sign-in-alt me-2"></i>ورود به حساب
                                        </button>
                                </form>
                            </div>
                            
                            <div class="tab-pane fade" id="register">
                                    <form method="POST" id="registerForm">
                                        <div class="form-floating">
                                            <input type="text" class="form-control" id="registerUsername" name="username" placeholder="نام کاربری" required>
                                            <label for="registerUsername">نام کاربری</label>
                                    </div>
                                        <div class="form-floating">
                                            <input type="email" class="form-control" id="registerEmail" name="email" placeholder="ایمیل" required>
                                            <label for="registerEmail">ایمیل</label>
                                    </div>
                                        <div class="form-floating">
                                            <input type="password" class="form-control" id="registerPassword" name="password" placeholder="رمز عبور" required>
                                            <label for="registerPassword">رمز عبور</label>
                                    </div>
                                        <button type="submit" name="register" class="btn btn-auth">
                                            <i class="fas fa-user-plus me-2"></i>ایجاد حساب
                                        </button>
                                </form>
                                </div>
                            </div>
                            
                            <div class="social-login">
                                <p>یا با شبکه‌های اجتماعی وارد شوید</p>
                                <div class="social-buttons">
                                    <button class="btn-social" title="Google">
                                        <i class="fab fa-google"></i>
                                    </button>
                                    <button class="btn-social" title="Facebook">
                                        <i class="fab fa-facebook-f"></i>
                                    </button>
                                    <button class="btn-social" title="Twitter">
                                        <i class="fab fa-twitter"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
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
</body>
</html> 