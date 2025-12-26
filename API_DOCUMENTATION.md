# API Documentation - KAI Asset Management System

## Overview

Dokumentasi ini berisi spesifikasi API endpoint yang diperlukan oleh frontend untuk aplikasi manajemen aset KAI (Kereta Api Indonesia). Dokumen ini ditujukan untuk divisi backend sebagai referensi implementasi.

**Base URL:** `/api`

**Authentication:** Session-based dengan CSRF protection

---

## Table of Contents

1. [Authentication](#1-authentication)
2. [Locations (Tempat)](#2-locations-tempat)
3. [Devices (Asset)](#3-devices-asset)

---

## Response Format

### Success Response
```json
{
  "data": { ... }
}
```

### Error Response
```json
{
  "message": "Pesan error",
  "errors": {
    "field_name": ["Pesan validasi error"]
  }
}
```

### HTTP Status Codes
- `200` - OK
- `201` - Created
- `204` - No Content (untuk DELETE)
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `404` - Not Found
- `419` - CSRF Token Mismatch
- `500` - Internal Server Error

---

## 1. Authentication

### 1.1 Login

Melakukan autentikasi user.

**Endpoint:** `POST /api/login`

**Authentication Required:** No

**Request Body:**
```json
{
  "email": "string (required, email format)",
  "password": "string (required)"
}
```

**Success Response (200):**
```json
{
  "message": "Login berhasil",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Kesalahan validasi",
  "errors": {
    "email": ["Email atau password salah."]
  }
}
```

---

### 1.2 Register

Mendaftarkan user baru.

**Endpoint:** `POST /api/register`

**Authentication Required:** No

**Request Body:**
```json
{
  "name": "string (required, min: 3)",
  "email": "string (required, email format, unique)",
  "password": "string (required, min: 6)",
  "password_confirmation": "string (required, must match password)"
}
```

**Success Response (201):**
```json
{
  "message": "Registrasi berhasil",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "message": "Kesalahan validasi",
  "errors": {
    "email": ["Email sudah terdaftar."]
  }
}
```

---

### 1.3 Logout

Melakukan logout user.

**Endpoint:** `POST /api/logout`

**Authentication Required:** Yes

**Request Body:** None

**Success Response (200):**
```json
{
  "message": "Logout berhasil"
}
```

---

### 1.4 Get Current User

Mendapatkan data user yang sedang login.

**Endpoint:** `GET /api/user`

**Authentication Required:** Yes

**Success Response (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

**Error Response (401):**
Redirect ke halaman login

---

### 1.5 Forgot Password

Mengirim kode verifikasi reset password ke email.

**Endpoint:** `POST /api/forgot-password`

**Authentication Required:** No

**Request Body:**
```json
{
  "email": "string (required, email format)"
}
```

**Success Response (200):**
```json
{
  "message": "Kode verifikasi telah dikirim ke email Anda."
}
```

**Error Response (400):**
```json
{
  "message": "Kesalahan validasi",
  "errors": {
    "email": ["Email tidak terdaftar dalam sistem."]
  }
}
```

---

### 1.6 Verify Reset Code

Memverifikasi kode reset password.

**Endpoint:** `POST /api/verify-reset-code`

**Authentication Required:** No

**Request Body:**
```json
{
  "email": "string (required, email format)",
  "code": "string (required, 6 digits)"
}
```

**Success Response (200):**
```json
{
  "message": "Kode verifikasi valid.",
  "verified": true
}
```

**Error Response (400):**
```json
{
  "message": "Kesalahan validasi",
  "errors": {
    "code": ["Kode verifikasi tidak valid."]
  }
}
```

---

### 1.7 Reset Password

Mereset password dengan kode verifikasi.

**Endpoint:** `POST /api/reset-password`

**Authentication Required:** No

**Request Body:**
```json
{
  "email": "string (required, email format)",
  "code": "string (required, 6 digits)",
  "password": "string (required, min: 6)",
  "password_confirmation": "string (required, must match password)"
}
```

**Success Response (200):**
```json
{
  "message": "Password berhasil direset. Silakan login dengan password baru."
}
```

**Error Response (400):**
```json
{
  "message": "Kesalahan validasi",
  "errors": {
    "code": ["Kode verifikasi sudah kadaluarsa."]
  }
}
```

---

## 2. Locations (Tempat)

### 2.1 Get All Locations

Mendapatkan semua data lokasi.

**Endpoint:** `GET /api/locations`

**Authentication Required:** No

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category | string | No | Filter berdasarkan kategori: `stasiun`, `kantor`, `gudang`, `pjl` |

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Stasiun Gambir",
    "code": "STA-1234567890",
    "latitude": -6.176461,
    "longitude": 106.830715,
    "category": "stasiun",
    "description": "Stasiun utama Jakarta",
    "image_url": "http://example.com/storage/locations/image.jpg",
    "devices_count": 15,
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z"
  }
]
```

---

### 2.2 Get Location by ID

Mendapatkan detail lokasi berdasarkan ID.

**Endpoint:** `GET /api/locations/{id}`

**Authentication Required:** No

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | ID lokasi |

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Stasiun Gambir",
  "code": "STA-1234567890",
  "latitude": -6.176461,
  "longitude": 106.830715,
  "category": "stasiun",
  "description": "Stasiun utama Jakarta",
  "image_url": "http://example.com/storage/locations/image.jpg",
  "devices_count": 15,
  "created_at": "2025-01-01T00:00:00.000000Z",
  "updated_at": "2025-01-01T00:00:00.000000Z"
}
```

**Error Response (404):**
```json
{
  "message": "Data tidak ditemukan."
}
```

---

### 2.3 Search Locations

Mencari lokasi berdasarkan nama atau kode.

**Endpoint:** `GET /api/locations/search`

**Authentication Required:** No

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | Kata kunci pencarian |

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Stasiun Gambir",
    "code": "STA-1234567890",
    "latitude": -6.176461,
    "longitude": 106.830715,
    "category": "stasiun",
    "description": null,
    "image_url": null,
    "devices_count": 15,
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z"
  }
]
```

---

### 2.4 Get Location Statistics

Mendapatkan statistik lokasi dan perangkat.

**Endpoint:** `GET /api/locations/stats`

**Authentication Required:** No

**Success Response (200):**
```json
{
  "total_locations": 50,
  "locations_by_category": {
    "stasiun": 30,
    "kantor": 10,
    "gudang": 5,
    "pjl": 5
  },
  "total_devices": 500,
  "active_devices": 450,
  "inactive_devices": 50
}
```

---

### 2.5 Create Location

Membuat lokasi baru.

**Endpoint:** `POST /api/locations`

**Authentication Required:** Yes

**Content-Type:** `multipart/form-data` (jika ada upload gambar) atau `application/json`

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Nama lokasi (max: 150) |
| code | string | No | Kode lokasi (max: 20, unique). Auto-generate jika tidak diisi |
| latitude | number | Yes | Koordinat latitude |
| longitude | number | Yes | Koordinat longitude |
| category | string | Yes | Kategori: `stasiun`, `kantor`, `gudang`, `pjl` |
| description | string | No | Deskripsi lokasi |
| image | file | No | Gambar lokasi (jpeg, png, jpg, gif, max: 5MB) |

**Success Response (201):**
```json
{
  "id": 1,
  "name": "Stasiun Gambir",
  "code": "STA-1234567890",
  "latitude": -6.176461,
  "longitude": 106.830715,
  "category": "stasiun",
  "description": null,
  "image_url": "http://example.com/storage/locations/image.jpg",
  "devices_count": 0,
  "created_at": "2025-01-01T00:00:00.000000Z",
  "updated_at": "2025-01-01T00:00:00.000000Z"
}
```

**Error Response (400):**
```json
{
  "message": "Kesalahan validasi",
  "errors": {
    "name": ["Nama lokasi wajib diisi."],
    "category": ["Kategori harus salah satu dari: stasiun, kantor, gudang, pjl."]
  }
}
```

---

### 2.6 Update Location

Mengupdate data lokasi.

**Endpoint:** `PUT /api/locations/{id}`

**Authentication Required:** Yes

**Content-Type:** `multipart/form-data` (jika ada upload gambar) atau `application/json`

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | ID lokasi |

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | No | Nama lokasi (max: 150) |
| code | string | No | Kode lokasi (max: 20, unique) |
| latitude | number | No | Koordinat latitude |
| longitude | number | No | Koordinat longitude |
| category | string | No | Kategori: `stasiun`, `kantor`, `gudang`, `pjl` |
| description | string | No | Deskripsi lokasi |
| image | file | No | Gambar lokasi (jpeg, png, jpg, gif, max: 5MB) |

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Stasiun Gambir Updated",
  "code": "STA-1234567890",
  "latitude": -6.176461,
  "longitude": 106.830715,
  "category": "stasiun",
  "description": null,
  "image_url": "http://example.com/storage/locations/image.jpg",
  "devices_count": 15,
  "created_at": "2025-01-01T00:00:00.000000Z",
  "updated_at": "2025-01-01T00:00:00.000000Z"
}
```

---

### 2.7 Delete Location

Menghapus lokasi (termasuk semua perangkat terkait).

**Endpoint:** `DELETE /api/locations/{id}`

**Authentication Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | ID lokasi |

**Success Response (204):** No Content

**Error Response (404):**
```json
{
  "message": "Data tidak ditemukan."
}
```

---

### 2.8 Bulk Delete Locations

Menghapus beberapa lokasi sekaligus.

**Endpoint:** `POST /api/locations/bulk-delete`

**Authentication Required:** Yes

**Request Body:**
```json
{
  "ids": [1, 2, 3]
}
```

**Success Response (200):**
```json
{
  "message": "Lokasi berhasil dihapus",
  "deleted_count": 3
}
```

---

## 3. Devices (Asset)

### 3.1 Get All Devices

Mendapatkan semua data perangkat.

**Endpoint:** `GET /api/devices`

**Authentication Required:** Yes

**Success Response (200):**
```json
[
  {
    "id": 1,
    "location_id": 1,
    "name": "PC-GAMBIR-001",
    "type": "PC",
    "status": "SO",
    "serial_number": "Dell OptiPlex 7090",
    "ip_address": "192.168.1.100",
    "description": "Ruang Operator",
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z"
  }
]
```

---

### 3.2 Get Devices by Location

Mendapatkan semua perangkat di lokasi tertentu.

**Endpoint:** `GET /api/locations/{locationId}/devices`

**Authentication Required:** No

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| locationId | integer | Yes | ID lokasi |

**Success Response (200):**
```json
[
  {
    "id": 1,
    "location_id": 1,
    "name": "PC-GAMBIR-001",
    "type": "PC",
    "status": "SO",
    "serial_number": "Dell OptiPlex 7090",
    "ip_address": "192.168.1.100",
    "description": "Ruang Operator",
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z"
  }
]
```

---

### 3.3 Get Device by ID

Mendapatkan detail perangkat berdasarkan ID.

**Endpoint:** `GET /api/devices/{id}`

**Authentication Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | ID perangkat |

**Success Response (200):**
```json
{
  "id": 1,
  "location_id": 1,
  "name": "PC-GAMBIR-001",
  "type": "PC",
  "status": "SO",
  "serial_number": "Dell OptiPlex 7090",
  "ip_address": "192.168.1.100",
  "description": "Ruang Operator",
  "created_at": "2025-01-01T00:00:00.000000Z",
  "updated_at": "2025-01-01T00:00:00.000000Z"
}
```

---

### 3.4 Get Device Statistics

Mendapatkan statistik perangkat.

**Endpoint:** `GET /api/devices/stats`

**Authentication Required:** No

**Query Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| location_id | integer | No | Filter berdasarkan lokasi |

**Success Response (200):**
```json
{
  "total_devices": 500,
  "active_devices": 450,
  "inactive_devices": 50,
  "devices_by_type": {
    "PC": 200,
    "Printer": 100,
    "Router": 50,
    "Switch": 150
  }
}
```

---

### 3.5 Create Device

Membuat perangkat baru.

**Endpoint:** `POST /api/devices`

**Authentication Required:** Yes

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| location_id | integer | Yes | ID lokasi (exists di tabel tempat) |
| name | string | Yes | Hostname perangkat (max: 150) |
| type | string | Yes | Jenis perangkat (max: 100) |
| status | string | Yes | Status: `SO` (aktif), `TSO` (tidak aktif) |
| serial_number | string | No | Merk/Spesifikasi (max: 200) |
| ip_address | string | No | IP Address (max: 50) |
| description | string | No | Lokasi detail perangkat (max: 150) |

**Success Response (201):**
```json
{
  "id": 1,
  "location_id": 1,
  "name": "PC-GAMBIR-001",
  "type": "PC",
  "status": "SO",
  "serial_number": "Dell OptiPlex 7090",
  "ip_address": "192.168.1.100",
  "description": "Ruang Operator",
  "created_at": "2025-01-01T00:00:00.000000Z",
  "updated_at": "2025-01-01T00:00:00.000000Z"
}
```

---

### 3.6 Update Device

Mengupdate data perangkat.

**Endpoint:** `PUT /api/devices/{id}`

**Authentication Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | ID perangkat |

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| location_id | integer | No | ID lokasi |
| name | string | No | Hostname perangkat (max: 150) |
| type | string | No | Jenis perangkat (max: 100) |
| status | string | No | Status: `SO` (aktif), `TSO` (tidak aktif) |
| serial_number | string | No | Merk/Spesifikasi (max: 200) |
| ip_address | string | No | IP Address (max: 50) |
| description | string | No | Lokasi detail perangkat (max: 150) |

**Success Response (200):**
```json
{
  "id": 1,
  "location_id": 1,
  "name": "PC-GAMBIR-001-UPDATED",
  "type": "PC",
  "status": "SO",
  "serial_number": "Dell OptiPlex 7090",
  "ip_address": "192.168.1.100",
  "description": "Ruang Operator",
  "created_at": "2025-01-01T00:00:00.000000Z",
  "updated_at": "2025-01-01T00:00:00.000000Z"
}
```

---

### 3.7 Update Device Status

Mengupdate status perangkat saja.

**Endpoint:** `PATCH /api/devices/{id}/status`

**Authentication Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | ID perangkat |

**Request Body:**
```json
{
  "status": "SO" // atau "TSO"
}
```

**Success Response (200):**
```json
{
  "id": 1,
  "status": "SO",
  "location_id": 1,
  "name": "PC-GAMBIR-001",
  "type": "PC",
  "serial_number": "Dell OptiPlex 7090",
  "ip_address": "192.168.1.100",
  "description": "Ruang Operator",
  "created_at": "2025-01-01T00:00:00.000000Z",
  "updated_at": "2025-01-01T00:00:00.000000Z"
}
```

---

### 3.8 Delete Device

Menghapus perangkat.

**Endpoint:** `DELETE /api/devices/{id}`

**Authentication Required:** Yes

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | ID perangkat |

**Success Response (204):** No Content

---

### 3.9 Bulk Delete Devices

Menghapus beberapa perangkat sekaligus.

**Endpoint:** `POST /api/devices/bulk-delete`

**Authentication Required:** Yes

**Request Body:**
```json
{
  "ids": [1, 2, 3]
}
```

**Success Response (200):**
```json
{
  "message": "Perangkat berhasil dihapus",
  "deleted_count": 3
}
```

---

### 3.10 Bulk Import Devices

Import banyak perangkat dari file CSV/Excel.

**Endpoint:** `POST /api/devices/bulk-import`

**Authentication Required:** Yes

**Content-Type:** `multipart/form-data`

**Request Body:**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| location_id | integer | Yes | ID lokasi tujuan import |
| file | file | Yes | File CSV/Excel (xlsx, xls, csv) |

**Expected CSV/Excel Columns:**
| Column | Description |
|--------|-------------|
| hostname | Nama/hostname perangkat |
| jenis_perangkat | Jenis perangkat |
| merk_spek | Merk dan spesifikasi |
| ip_perangkat | IP Address |
| lokasi | Lokasi detail |
| kondisi | Status: `SO` (aktif) atau `TSO` (tidak aktif) |

**Success Response (200):**
```json
{
  "message": "Import berhasil",
  "imported_count": 50,
  "failed_count": 2,
  "errors": [
    {
      "row": 5,
      "message": "IP Address tidak valid"
    }
  ]
}
```

---

### 3.11 Download Import Template

Mengunduh template file untuk bulk import.

**Endpoint:** `GET /api/devices/import-template`

**Authentication Required:** No

**Response Headers:**
```
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="template_import_devices.xlsx"
```

**Success Response (200):** Binary file (Excel)

---

## Database Schema Reference

### Table: `tempat` (Locations)

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| kode_tempat | varchar(20) | Unique location code |
| nama_tempat | varchar(150) | Location name |
| jenis_tempat | enum | Category: stasiun, kantor, gudang, pjl |
| latitude | decimal(10,8) | Latitude coordinate |
| longitude | decimal(11,8) | Longitude coordinate |
| gambar | varchar(255) | Image path |
| created_at | timestamp | Created timestamp |
| updated_at | timestamp | Updated timestamp |

### Table: `asset` (Devices)

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| kode_tempat | varchar(20) | Foreign key to tempat.kode_tempat |
| jenis_perangkat | varchar(100) | Device type |
| hostname | varchar(150) | Device hostname |
| merk_spek | varchar(200) | Brand/specification |
| ip_perangkat | varchar(50) | IP Address |
| lokasi | varchar(150) | Detailed location |
| kondisi | varchar(20) | Condition: SO (active), TSO (inactive) |
| created_at | timestamp | Created timestamp |
| updated_at | timestamp | Updated timestamp |

### Table: `users`

| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Primary key |
| name | varchar(255) | User name |
| email | varchar(255) | User email (unique) |
| password | varchar(255) | Hashed password |
| email_verified_at | timestamp | Email verification timestamp |
| remember_token | varchar(100) | Remember token |
| created_at | timestamp | Created timestamp |
| updated_at | timestamp | Updated timestamp |

### Table: `password_reset_tokens`

| Column | Type | Description |
|--------|------|-------------|
| email | varchar(255) | Primary key |
| token | varchar(255) | Hashed reset token |
| created_at | timestamp | Created timestamp |

---

## Field Mapping Reference

### Location Fields (API ↔ Database)

| API Field | Database Column |
|-----------|-----------------|
| id | id |
| name | nama_tempat |
| code | kode_tempat |
| latitude | latitude |
| longitude | longitude |
| category | jenis_tempat |
| description | deskripsi (if exists) |
| image_url | gambar (transformed to URL) |
| devices_count | computed from assets count |

### Device Fields (API ↔ Database)

| API Field | Database Column |
|-----------|-----------------|
| id | id |
| location_id | computed from kode_tempat → tempat.id |
| name | hostname |
| type | jenis_perangkat |
| status | kondisi (SO / TSO) |
| serial_number | merk_spek |
| ip_address | ip_perangkat |
| description | lokasi |

---

## Notes for Backend Team

1. **Auto-generate Location Code**: Jika `code` tidak diberikan saat create location, generate dengan format:
   ```
   strtoupper(substr($request->name, 0, 3)) . '-' . time()
   ```

2. **Status Values**: Status perangkat hanya memiliki 2 nilai:
   - `SO` = Siap Operasi (aktif)
   - `TSO` = Tidak Siap Operasi (tidak aktif)

3. **Image Storage**: 
   - Store di `storage/app/public/locations/`
   - Return URL dengan `Storage::url($path)`

4. **Cascade Delete**: Saat menghapus location, hapus juga semua devices yang terkait

5. **CORS**: Pastikan CORS dikonfigurasi untuk menerima request dari frontend origin

6. **Session Authentication**: Gunakan Laravel session-based auth dengan CSRF protection

---