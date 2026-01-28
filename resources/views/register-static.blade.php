<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Register - KAI</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: linear-gradient(135deg, #2D2B70 0%, #1F1E4E 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        
        .register-box {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            width: 100%;
            max-width: 400px;
        }
        
        .logo {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .logo h1 {
            color: #2D2B70;
            font-size: 28px;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        label {
            display: block;
            margin-bottom: 8px;
            color: #333;
            font-weight: 500;
            font-size: 14px;
        }
        
        input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            transition: all 0.3s;
            font-family: inherit;
        }
        
        input:focus {
            outline: none;
            border-color: #2D2B70;
            box-shadow: 0 0 0 3px rgba(45, 43, 112, 0.1);
        }
        
        .helper-text {
            font-size: 12px;
            color: #999;
            margin-top: 4px;
        }
        
        button {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #2D2B70 0%, #1F1E4E 100%);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            margin-top: 20px;
            transition: all 0.3s;
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(45, 43, 112, 0.4);
        }
        
        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        
        .login-link {
            text-align: center;
            margin-top: 20px;
            font-size: 14px;
            color: #666;
        }
        
        .login-link a {
            color: #2D2B70;
            text-decoration: none;
            font-weight: 600;
        }
        
        .login-link a:hover {
            text-decoration: underline;
        }
        
        .error-message {
            padding: 12px;
            background-color: #fee;
            color: #c33;
            border-radius: 6px;
            margin-bottom: 16px;
            font-size: 14px;
            display: none;
        }
        
        .error-message.show {
            display: block;
        }
        
        .success-message {
            padding: 12px;
            background-color: #efe;
            color: #3c3;
            border-radius: 6px;
            margin-bottom: 16px;
            font-size: 14px;
            display: none;
        }
        
        .success-message.show {
            display: block;
        }
    </style>
</head>
<body>
    <div class="register-box">
        <div class="logo">
            <h1>KAI Asset Management</h1>
        </div>
        
        <div id="errorMessage" class="error-message"></div>
        <div id="successMessage" class="success-message"></div>
        
        <form id="registerForm">
            @csrf
            
            <div class="form-group">
                <label for="nama">Nama Lengkap</label>
                <input type="text" id="nama" name="nama" placeholder="Masukkan nama lengkap" required>
            </div>
            
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" placeholder="nama@email.com" required>
            </div>
            
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" placeholder="Masukkan password" required minlength="6">
                <div class="helper-text">Minimal 6 karakter</div>
            </div>
            
            <div class="form-group">
                <label for="confirmPassword">Konfirmasi Password</label>
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Ulangi password" required minlength="6">
            </div>
            
            <button type="submit" id="submitBtn">Daftar</button>
            
            <div class="login-link">
                Sudah punya akun? <a href="/">Login di sini</a>
            </div>
        </form>
    </div>
    
    <script>
        const form = document.getElementById('registerForm');
        const errorDiv = document.getElementById('errorMessage');
        const successDiv = document.getElementById('successMessage');
        const submitBtn = document.getElementById('submitBtn');
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Reset messages
            errorDiv.classList.remove('show');
            successDiv.classList.remove('show');
            
            const nama = document.getElementById('nama').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validation
            if (password !== confirmPassword) {
                errorDiv.textContent = 'Password dan konfirmasi password tidak cocok!';
                errorDiv.classList.add('show');
                return;
            }
            
            if (password.length < 6) {
                errorDiv.textContent = 'Password minimal 6 karakter!';
                errorDiv.classList.add('show');
                return;
            }
            
            // Disable button
            submitBtn.disabled = true;
            submitBtn.textContent = 'Memproses...';
            
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('input[name="_token"]').value,
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: nama,
                        email: email,
                        password: password,
                        password_confirmation: confirmPassword
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    successDiv.textContent = 'Registrasi berhasil! Silakan login.';
                    successDiv.classList.add('show');
                    form.reset();
                    
                    // Redirect ke login setelah 2 detik
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                } else {
                    errorDiv.textContent = data.message || 'Registrasi gagal. Silakan coba lagi.';
                    errorDiv.classList.add('show');
                }
            } catch (error) {
                console.error('Register error:', error);
                errorDiv.textContent = 'Terjadi kesalahan. Silakan coba lagi.';
                errorDiv.classList.add('show');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Daftar';
            }
        });
    </script>
</body>
</html>
