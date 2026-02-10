# Panduan Deployment ke Shared Hosting

## Persiapan Sebelum Upload

### 1. Build Assets Production

Jalankan di local:

```bash
npm install
npm run build
```

File hasil build akan tersimpan di `public/build/`

### 2. File yang Perlu Diupload

Upload file berikut ke shared hosting:

```
├── app/
├── bootstrap/
├── config/
├── database/
├── public/          # Upload isi folder ini ke public_html
│   ├── build/       # Hasil npm run build
│   ├── css/
│   ├── image/
│   ├── js/
│   ├── index.php
│   └── .htaccess
├── resources/
├── routes/
├── storage/         # Pastikan folder ini writable (755/775)
├── vendor/          # Hasil composer install --optimize-autoloader --no-dev
├── .htaccess        # File di root untuk redirect ke public
├── artisan
├── composer.json
└── .env             # COPY dari .env.example dan sesuaikan
```

### 3. Upload Files

**Opsi A: Upload ke root hosting**
```
/home/username/
├── .htaccess           # Redirect ke public
├── app/
├── bootstrap/
├── config/
... (semua folder Laravel)
└── public/             # Isi dipindah ke public_html
```

**Opsi B: Upload di folder terpisah (RECOMMENDED)**
```
/home/username/
├── kai-app/            # Laravel files
│   ├── app/
│   ├── bootstrap/
│   └── ...
└── public_html/        # Public folder
    ├── build/
    ├── index.php
    └── .htaccess
```

## Langkah Deployment

### 1. Upload via FTP/cPanel File Manager

Upload semua file kecuali:
- `node_modules/` (tidak perlu)
- `.git/` (tidak perlu)
- `.env` (buat baru di server)
- `storage/logs/*.log` (tidak perlu)

### 2. Install Dependencies

Via SSH (jika tersedia):

```bash
cd /home/username/kai-app
composer install --optimize-autoloader --no-dev
```

Jika tidak ada SSH, upload folder `vendor/` hasil `composer install` dari local.

### 3. Konfigurasi .env

Copy `.env.example` menjadi `.env` dan edit:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=cpanelusername_kai_db
DB_USERNAME=cpanelusername_kai_user
DB_PASSWORD=YourStrongPassword123!

SESSION_SECURE_COOKIE=true
SESSION_SAME_SITE=lax
```

### 4. Generate Application Key

Via SSH:
```bash
php artisan key:generate
```

Via cPanel Terminal atau buat file PHP temporary:
```php
<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->call('key:generate');
echo "Key generated!\n";
```

### 5. Setup Database

**Via cPanel:**
1. Buat database baru di MySQL Databases
2. Buat user dan password
3. Assign user ke database dengan ALL PRIVILEGES
4. Catat nama database, username, password

**Run Migrations via SSH:**
```bash
php artisan migrate --force
php artisan db:seed --class=DatabaseSeeder
```

### 6. Setup Storage

**Via SSH:**
```bash
chmod -R 755 storage bootstrap/cache
chmod -R 775 storage/logs storage/framework
php artisan storage:link
```

**Manual di cPanel:**
- Set permissions folder `storage/` dan `bootstrap/cache/` ke 755
- Buat symlink dari `public_html/storage` ke `../kai-app/storage/app/public`

### 7. Optimize for Production

Via SSH:
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### 8. Update index.php (Jika Laravel di folder terpisah)

Edit `public_html/index.php`:

```php
<?php

use Illuminate\Http\Request;

define('LARAVEL_START', microtime(true));

// Path ke folder Laravel
require __DIR__.'/../kai-app/vendor/autoload.php';

$app = require_once __DIR__.'/../kai-app/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Request::capture()
)->send();

$kernel->terminate($request, $response);
```

## Struktur File Shared Hosting (Recommended)

```
/home/username/
├── kai-app/                    # Laravel application (private)
│   ├── app/
│   ├── bootstrap/
│   ├── config/
│   ├── database/
│   ├── resources/
│   ├── routes/
│   ├── storage/               # chmod 755
│   ├── vendor/
│   ├── .env                   # RAHASIA - jangan di public
│   ├── artisan
│   └── composer.json
│
└── public_html/               # Document root (public)
    ├── build/                 # Vite build assets
    ├── css/
    ├── image/
    ├── js/
    ├── storage -> ../kai-app/storage/app/public
    ├── .htaccess
    ├── index.php             # Updated path
    └── robots.txt
```

## File .htaccess di Root (Jika Laravel di root)

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteCond %{REQUEST_URI} !^/public/
    RewriteRule ^(.*)$ /public/$1 [L,QSA]
</IfModule>
```

## File .htaccess di public_html

```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>

# Disable directory browsing
Options -Indexes

# Prevent access to sensitive files
<FilesMatch "^\.">
    Order allow,deny
    Deny from all
</FilesMatch>
```

## Troubleshooting

### Error 500 - Internal Server Error

1. **Cek permissions:**
   ```bash
   chmod -R 755 storage bootstrap/cache
   ```

2. **Cek .env:**
   - APP_KEY sudah di-generate?
   - Database credentials benar?

3. **Cek PHP version:**
   - Minimal PHP 8.2
   - Enable extensions: mbstring, xml, pdo, pdo_mysql, openssl, json, tokenizer

4. **Clear cache:**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

### Assets Tidak Muncul

1. **Pastikan build sudah di-upload:**
   - Folder `public/build/` harus ada

2. **Cek APP_URL di .env:**
   ```env
   APP_URL=https://yourdomain.com
   ```

3. **Clear view cache:**
   ```bash
   php artisan view:clear
   ```

### Session Logout Terus

1. **Pastikan SESSION_DOMAIN kosong:**
   ```env
   SESSION_DOMAIN=
   ```

2. **Cek tabel sessions ada:**
   ```bash
   php artisan migrate
   ```

3. **Cek permission storage:**
   ```bash
   chmod -R 775 storage/framework/sessions
   ```

### Database Connection Error

1. **Cek credentials di .env**
2. **Pastikan host = localhost (biasanya)**
3. **Cek user sudah di-assign ke database**
4. **Test connection via phpMyAdmin**

## Maintenance Mode

**Enable maintenance:**
```bash
php artisan down --message="Sedang maintenance" --retry=60
```

**Disable maintenance:**
```bash
php artisan up
```

## Update Aplikasi

1. Upload file baru (overwrite)
2. Run migrations:
   ```bash
   php artisan migrate --force
   ```
3. Clear cache:
   ```bash
   php artisan config:clear
   php artisan cache:clear
   php artisan view:clear
   ```
4. Cache lagi:
   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

## Security Checklist

- ✅ `APP_ENV=production`
- ✅ `APP_DEBUG=false`
- ✅ `SESSION_SECURE_COOKIE=true` (jika HTTPS)
- ✅ File `.env` tidak di public_html
- ✅ Folder `storage/` permission 755
- ✅ Database password kuat
- ✅ HTTPS enabled (SSL certificate)
- ✅ Folder vendor tidak accessible dari web

## Contact & Support

Jika mengalami masalah:
1. Cek error log di `storage/logs/laravel.log`
2. Cek error log cPanel
3. Pastikan PHP version >= 8.2
4. Cek ekstensi PHP yang dibutuhkan

---

**Dibuat:** January 2026  
**Versi Laravel:** 12  
**PHP Version:** 8.3+
