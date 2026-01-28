<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - KAI</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            background: #f5f5f7;
            color: #333;
        }
        
        .navbar {
            background: linear-gradient(135deg, #2D2B70 0%, #1F1E4E 100%);
            color: white;
            padding: 20px 40px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        .navbar h1 {
            font-size: 24px;
        }
        
        .navbar-right {
            display: flex;
            gap: 20px;
            align-items: center;
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .logout-btn {
            padding: 10px 20px;
            background: rgba(255,255,255,0.2);
            color: white;
            border: 1px solid rgba(255,255,255,0.3);
            border-radius: 6px;
            cursor: pointer;
            transition: all 0.3s;
        }
        
        .logout-btn:hover {
            background: rgba(255,255,255,0.3);
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 40px 20px;
        }
        
        .welcome-section {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }
        
        .welcome-section h2 {
            color: #2D2B70;
            margin-bottom: 15px;
        }
        
        .welcome-section p {
            color: #666;
            line-height: 1.6;
        }
        
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        
        .card {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            text-align: center;
            transition: all 0.3s;
        }
        
        .card:hover {
            box-shadow: 0 10px 20px rgba(0,0,0,0.15);
            transform: translateY(-5px);
        }
        
        .card-icon {
            font-size: 40px;
            margin-bottom: 15px;
        }
        
        .card h3 {
            color: #2D2B70;
            margin-bottom: 10px;
        }
        
        .card p {
            color: #999;
            font-size: 14px;
        }
        
        .error-message {
            background: #fee;
            color: #c33;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            display: none;
        }
        
        .error-message.show {
            display: block;
        }
    </style>
</head>
<body>
    <div class="navbar">
        <h1>KAI Asset Management</h1>
        <div class="navbar-right">
            <div class="user-info">
                <span>Halo, <strong id="userName">User</strong>!</span>
                <button class="logout-btn" onclick="handleLogout()">Logout</button>
            </div>
        </div>
    </div>
    
    <div class="container">
        <div id="errorMessage" class="error-message"></div>
        
        <div class="welcome-section">
            <h2>Selamat Datang di KAI Asset Management</h2>
            <p>Kelola aset, lokasi, dan inventaris Anda dengan mudah melalui sistem manajemen aset terintegrasi.</p>
        </div>
        
        <div class="dashboard-grid">
            <div class="card">
                <div class="card-icon">📦</div>
                <h3>Total Assets</h3>
                <p>Kelola semua aset Anda</p>
            </div>
            
            <div class="card">
                <div class="card-icon">📍</div>
                <h3>Lokasi</h3>
                <p>Pantau lokasi aset</p>
            </div>
            
            <div class="card">
                <div class="card-icon">🔧</div>
                <h3>Perangkat</h3>
                <p>Kelola perangkat</p>
            </div>
            
            <div class="card">
                <div class="card-icon">📊</div>
                <h3>Laporan</h3>
                <p>Lihat statistik & laporan</p>
            </div>
        </div>
    </div>
    
    <script>
        // Check if user is logged in
        async function checkAuth() {
            try {
                const response = await fetch('/api/user', {
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    }
                });
                
                if (response.ok) {
                    const user = await response.json();
                    document.getElementById('userName').textContent = user.name || user.email;
                } else {
                    // Not authenticated, redirect to login
                    window.location.href = '/';
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                window.location.href = '/';
            }
        }
        
        function handleLogout() {
            if (confirm('Anda yakin ingin logout?')) {
                fetch('/api/logout', {
                    method: 'GET',
                    headers: {
                        'X-CSRF-TOKEN': '{{ csrf_token() }}'
                    }
                }).then(() => {
                    window.location.href = '/';
                });
            }
        }
        
        // Check auth on page load
        checkAuth();
    </script>
</body>
</html>
