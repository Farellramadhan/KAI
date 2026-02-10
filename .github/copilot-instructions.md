# AI Coding Assistant Instructions for BUKAN-ANAK-DIRUT

## Project Overview
This is a Laravel + React asset management system for KAI (Indonesian Railway). It manages railway locations (stations, offices, warehouses) and IT assets/devices deployed at those locations. The backend provides REST APIs, while the frontend is a single-page application with mapping capabilities.

## Architecture
- **Backend**: Laravel 12 API server handling authentication, locations (Tempat model), and devices (Asset model)
- **Frontend**: React SPA built with Vite, using React Router, Leaflet for maps, and TailwindCSS for styling
- **Database**: MySQL with relationships via `kode_tempat` (location code) foreign keys
- **Authentication**: Laravel session-based auth with CSRF protection for web routes
- **File Storage**: Images stored in `storage/app/public/` with symlinked access

## Key Models & Relationships
- **Tempat** (Location): Has many Assets via `kode_tempat`
  - Categories: `stasiun` (station), `kantor` (office), `gudang` (warehouse), `PJL`
  - Auto-generates codes like `STA-1234567890` from name prefix + timestamp
- **Asset** (Device): Belongs to Tempat
  - Conditions: `SO` (serviceable/active), `TSO` (to be scrapped/inactive)
  - Fields: `jenis_perangkat`, `hostname`, `merk_spek`, `ip_perangkat`, `lokasi`

## API Patterns
- Base URL: `/api` with JSON responses
- Authentication required for write operations (POST/PUT/DELETE)
- Public read access for locations and basic device stats
- Response transformation: Adds computed fields like `devices_count` to location responses
- Validation: Uses Laravel validators with custom error messages
- File uploads: Images stored in `public/locations/` or `public/devices/`
- Bulk operations: CSV/Excel import for devices with kode_tempat validation

## Frontend Patterns
- **Routing**: React Router with protected routes redirecting to `/login`
- **API Client**: Custom fetch wrapper in `resources/js/api/client.js`
  - Includes CSRF tokens for non-API requests
  - Handles 401 redirects to login
  - Credentials: `include` for session cookies
- **State Management**: Local component state + API calls
- **Styling**: TailwindCSS with custom animations
- **Maps**: Leaflet integration for location visualization

## Development Workflow
- **Setup**: Run `composer run setup` (installs deps, generates key, migrates DB, builds assets)
- **Development**: `composer run dev` (concurrently runs Laravel server on :8000, queue worker, logs tail, Vite dev server on :5173)
- **Testing**: `composer run test` (clears config cache, runs PHPUnit)
- **Build**: `npm run build` (Vite production build to `public/build/`)

## Code Conventions
- **Field Naming**: Indonesian for DB columns (`nama_tempat`, `jenis_tempat`), English for API responses (`name`, `category`)
- **Enums**: Use Laravel enum columns for categories and statuses
- **Image Handling**: Store paths in DB, use `Storage::url()` for URLs, validate file types/sizes
- **Error Handling**: Return 400 for validation errors, 404 for not found, with JSON error messages
- **Bulk Operations**: Support CSV import/export for assets, bulk delete for locations
- **Search**: Implement location search by name/code, filter by category
- **Location Code Generation**: `strtoupper(substr($request->name, 0, 3)) . '-' . time()` when not provided
- **Device Status Mapping**: `SO`/`AKTIF`/`ACTIVE`/`SIAP OPERASI` → `SO` (active), else `TSO` (inactive)
- **API Response Mapping**: Transform DB fields to API fields (e.g., `nama_tempat` → `name`, `kondisi` → `status`)
- **Category Validation**: Accepts `stasiun,kantor,gudang,pjl` (lowercase pjl)

## Key Files
- [app/Models/Tempat.php](app/Models/Tempat.php) - Location model with asset relationship
- [app/Models/Asset.php](app/Models/Asset.php) - Device model
- [routes/api.php](routes/api.php) - API route definitions
- [resources/js/api/client.js](resources/js/api/client.js) - Frontend API client
- [vite.config.js](vite.config.js) - Build config with API proxy
- [composer.json](composer.json) - Scripts for setup/dev/test

## Common Tasks
- Adding new location categories: Update enum in migration, validation rules, and frontend filters
- Device import: Parse CSV with kode_tempat validation against existing locations
- Map integration: Use Leaflet markers with location coordinates and popups
- Authentication flow: Check `isAuthenticated` state, redirect to login on 401</content>
<parameter name="filePath">c:\Users\USER\BUKAN-ANAK-ANJING\.github\copilot-instructions.md