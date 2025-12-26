## API Endpoints yang Dibutuhkan

### 1. Authentication APIs (`/api/auth` atau route level)

#### POST `/register`
Mendaftarkan user baru.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "password": "string (required, min: 6)",
  "password_confirmation": "string (required, must match password)"
}
```

**Response (201 Created):**
```json
{
  "message": "Registration successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### POST `/login`
Login user.

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### GET `/logout`
Logout user saat ini.

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

#### GET `/api/user`
Mendapatkan data user yang sedang login.

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

### 2. Locations APIs (`/api/locations`)

#### GET `/api/locations`
Mendapatkan semua lokasi.

**Query Parameters (optional):**
- `category`: string (stasiun|kantor|gudang|pjl)

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Stasiun Lempuyangan",
    "code": "LPN",
    "latitude": -7.7901746261802005,
    "longitude": 110.37523986883392,
    "category": "stasiun",
    "description": "Stasiun utama di Yogyakarta",
    "image_url": "https://example.com/image.jpg",
    "devices_count": 200,
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z"
  }
]
```

#### GET `/api/locations/{id}`
Mendapatkan detail lokasi berdasarkan ID.

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Stasiun Lempuyangan",
  "code": "LPN",
  "latitude": -7.7901746261802005,
  "longitude": 110.37523986883392,
  "category": "stasiun",
  "description": "Stasiun utama di Yogyakarta",
  "image_url": "https://example.com/image.jpg",
  "devices_count": 200,
  "created_at": "2025-01-01T00:00:00.000000Z",
  "updated_at": "2025-01-01T00:00:00.000000Z"
}
```

#### POST `/api/locations`
Membuat lokasi baru.

**Request Body:**
```json
{
  "name": "string (required)",
  "code": "string (optional)",
  "latitude": "float (required)",
  "longitude": "float (required)",
  "category": "string (required: stasiun|kantor|gudang|pjl)",
  "description": "string (optional)",
  "image_url": "string (optional)"
}
```

**Response (201 Created):**
```json
{
  "id": 7,
  "name": "Stasiun Baru",
  "code": "STB",
  "latitude": -7.7901746261802005,
  "longitude": 110.37523986883392,
  "category": "stasiun",
  "description": "Lokasi baru",
  "image_url": null,
  "devices_count": 0,
  "created_at": "2025-01-01T00:00:00.000000Z",
  "updated_at": "2025-01-01T00:00:00.000000Z"
}
```

#### PUT `/api/locations/{id}`
Mengupdate lokasi.

**Request Body:** (sama seperti POST, semua field optional)
```json
{
  "name": "string",
  "code": "string",
  "latitude": "float",
  "longitude": "float",
  "category": "string",
  "description": "string",
  "image_url": "string"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Stasiun Lempuyangan Updated",
  ...
}
```

#### DELETE `/api/locations/{id}`
Menghapus lokasi.

**Response (204 No Content)**

#### GET `/api/locations/search`
Mencari lokasi berdasarkan nama.

**Query Parameters:**
- `q`: string (required) - search query

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Stasiun Lempuyangan",
    ...
  }
]
```

---

### 3. Devices APIs (`/api/devices`)

#### GET `/api/devices`
Mendapatkan semua devices.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "location_id": 1,
    "name": "CCTV Camera 01",
    "type": "CCTV IP Camera",
    "status": "active",
    "serial_number": "SN12345",
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z"
  }
]
```

#### GET `/api/locations/{locationId}/devices`
Mendapatkan semua devices dari lokasi tertentu.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "location_id": 1,
    "name": "CCTV Camera 01",
    "type": "CCTV IP Camera",
    "status": "active",
    "serial_number": "SN12345",
    "created_at": "2025-01-01T00:00:00.000000Z",
    "updated_at": "2025-01-01T00:00:00.000000Z"
  }
]
```

#### GET `/api/devices/{id}`
Mendapatkan detail device berdasarkan ID.

**Response (200 OK):**
```json
{
  "id": 1,
  "location_id": 1,
  "name": "CCTV Camera 01",
  "type": "CCTV IP Camera",
  "status": "active",
  "serial_number": "SN12345",
  "description": "Camera untuk monitoring area stasiun",
  "created_at": "2025-01-01T00:00:00.000000Z",
  "updated_at": "2025-01-01T00:00:00.000000Z"
}
```

#### POST `/api/devices`
Membuat device baru.

**Request Body:**
```json
{
  "location_id": "integer (required)",
  "name": "string (required)",
  "type": "string (required)",
  "status": "string (required: active|inactive|maintenance)",
  "serial_number": "string (optional)",
  "description": "string (optional)"
}
```

**Response (201 Created):**
```json
{
  "id": 100,
  "location_id": 1,
  "name": "New Device",
  "type": "Router",
  "status": "active",
  "serial_number": "SN99999",
  "description": null,
  "created_at": "2025-01-01T00:00:00.000000Z",
  "updated_at": "2025-01-01T00:00:00.000000Z"
}
```

#### PUT `/api/devices/{id}`
Mengupdate device.

**Request Body:** (sama seperti POST, semua field optional)

**Response (200 OK):**
```json
{
  "id": 1,
  "location_id": 1,
  "name": "Updated Device",
  ...
}
```

#### PATCH `/api/devices/{id}/status`
Mengupdate status device saja.

**Request Body:**
```json
{
  "status": "string (required: active|inactive|maintenance)"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "status": "inactive",
  ...
}
```

#### DELETE `/api/devices/{id}`
Menghapus device.

**Response (204 No Content)**

#### GET `/api/devices/stats`
Mendapatkan statistik devices.

**Query Parameters (optional):**
- `location_id`: integer

**Response (200 OK):**
```json
{
  "total": 500,
  "active": 450,
  "inactive": 30,
  "maintenance": 20
}
```

---

## Error Responses

Semua endpoint harus mengembalikan error response dalam format berikut:

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 6 characters."]
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```

### 403 Forbidden
```json
{
  "message": "This action is unauthorized."
}
```

### 404 Not Found
```json
{
  "message": "Resource not found."
}
```

### 419 CSRF Token Mismatch
```json
{
  "message": "CSRF token mismatch."
}
```

### 500 Internal Server Error
```json
{
  "message": "Server error. Please try again later."
}
```

---

## Notes untuk Backend Developer

1. **Authentication**: Gunakan Laravel Sanctum atau session-based authentication. Frontend sudah mengirim CSRF token di header `X-CSRF-TOKEN`.

2. **CORS**: Pastikan CORS dikonfigurasi dengan benar jika frontend dan backend di domain berbeda.

3. **Validation**: Semua endpoint harus memiliki validation yang proper dan mengembalikan error message yang jelas.

4. **Database Relations**:
   - `Location` hasMany `Device`
   - `Device` belongsTo `Location`
   - Pastikan `devices_count` di response locations adalah aggregated count dari relasi

5. **Status Values**:
   - Device status: `active`, `inactive`, `maintenance`
   - Location category: `stasiun`, `kantor`, `gudang`, `pjl`

6. **Middleware**:
   - `/api/locations` (GET all, GET single) - public atau authenticated (tergantung requirement)
   - `/api/locations` (POST, PUT, DELETE) - authenticated + authorized
   - `/api/devices` - authenticated
   - `/api/user` - authenticated

7. **Testing**: Pastikan semua endpoint sudah ditest dengan Postman atau HTTP client lainnya sebelum integrasi dengan frontend.

---

## File-file Frontend yang Sudah Diupdate

1. `resources/js/api/client.js` - Base API client dengan CSRF token handling
2. `resources/js/api/auth.js` - Authentication API calls
3. `resources/js/api/locations.js` - Locations API calls
4. `resources/js/api/devices.js` - Devices API calls
5. `resources/js/api/index.js` - Central export file
6. `resources/js/pages/Home/Home.jsx` - Menggunakan locationsAPI
7. `resources/js/pages/LocationDetail/LocationDetail.jsx` - Menggunakan locationsAPI dan devicesAPI
8. `resources/js/pages/Login/Login.jsx` - Menggunakan authAPI
9. `resources/js/pages/Register/Register.jsx` - Menggunakan authAPI

## Cara Testing Frontend

1. Pastikan backend API sudah running
2. Update `.env` jika perlu (APP_URL)
3. Jalankan `npm run dev`
4. Buka browser dan test flow:
   - Register user baru
   - Login
   - Lihat map dengan locations
   - Klik location untuk lihat detail dan devices
   - Tambah location baru
   - Logout
