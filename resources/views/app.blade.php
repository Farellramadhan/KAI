<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="api-base-url" content="{{ rtrim(config('app.url'), '/') }}">
    <title>{{ config('app.name', 'KAI') }}</title>
    <link rel="icon" type="image/x-icon" href="{{ asset('/image/favicon.ico') }}">

    <style>
      .page-loading-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 50%, #ffffff 100%);
        background-size: 200% 200%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: backgroundShift 4s ease-in-out infinite;
        backdrop-filter: blur(2px);
      }

      .page-loading-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 24px;
        animation: slideUp 0.4s ease-out;
      }

      .page-loading-logo {
        width: 120px;
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: logoPulse 2s ease-in-out infinite;
        filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
      }

      .page-kai-logo {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }

      .page-loading-text {
        font-size: 18px;
        font-weight: 500;
        color: #333;
        text-align: center;
        animation: textFadeIn 0.5s ease-out 0.3s both;
        letter-spacing: 0.5px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .page-loading-spinner {
        width: 40px;
        height: 40px;
        border: 3px solid #e9ecef;
        border-top: 3px solid #007bff;
        border-radius: 50%;
        animation: spin 1s linear infinite, pulse 2s ease-in-out infinite;
        box-shadow: 0 0 10px rgba(0, 123, 255, 0.2);
      }

      @keyframes backgroundShift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes logoPulse {
        0%, 100% { transform: scale(1) rotate(0deg); }
        25% { transform: scale(1.02) rotate(1deg); }
        50% { transform: scale(1.05) rotate(0deg); }
        75% { transform: scale(1.02) rotate(-1deg); }
      }

      @keyframes textFadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      @keyframes pulse {
        0%, 100% { box-shadow: 0 0 10px rgba(0, 123, 255, 0.2); }
        50% { box-shadow: 0 0 20px rgba(0, 123, 255, 0.4); }
      }

      @media (max-width: 768px) {
        .page-loading-logo {
          width: 100px;
          height: 100px;
        }
        .page-loading-text {
          font-size: 16px;
        }
        .page-loading-spinner {
          width: 35px;
          height: 35px;
        }
      }
    </style>

    @viteReactRefresh
    @vite(['resources/js/main.jsx'])
  </head>
  <body>
    <!-- Page Loading Screen -->
    <div id="page-loading-screen" class="page-loading-screen">
      <div class="page-loading-content">
        <div class="page-loading-logo">
          <img src="{{ asset('/image/logo.png') }}" alt="KAI Logo" class="page-kai-logo" />
        </div>
        <div class="page-loading-text">
          Memuat Aplikasi...
        </div>
        <div class="page-loading-spinner"></div>
      </div>
    </div>

    <div id="root"></div>

    <script>
      // Hide page loading screen once React loads
      window.addEventListener('load', function() {
        setTimeout(function() {
          const loadingScreen = document.getElementById('page-loading-screen');
          if (loadingScreen) {
            loadingScreen.style.animation = 'fadeOut 0.3s ease-in-out forwards';
            setTimeout(function() {
              loadingScreen.style.display = 'none';
            }, 300);
          }
        }, 100); // Small delay to ensure smooth transition
      });

      // Fallback: hide loading screen when React root is ready
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList' && mutation.target.id === 'root' && mutation.target.children.length > 0) {
            setTimeout(function() {
              const loadingScreen = document.getElementById('page-loading-screen');
              if (loadingScreen && loadingScreen.style.display !== 'none') {
                loadingScreen.style.animation = 'fadeOut 0.3s ease-in-out forwards';
                setTimeout(function() {
                  loadingScreen.style.display = 'none';
                }, 300);
              }
            }, 200);
            observer.disconnect();
          }
        });
      });

      observer.observe(document.getElementById('root'), { childList: true });
    </script>

    <style>
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    </style>
  </body>
</html>
