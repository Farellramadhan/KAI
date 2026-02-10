<?php

namespace App\Http\Controllers;

use App\Models\Tempat;
use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class LocationController extends Controller
{
    /**
     * GET /api/locations
     * Get all locations with optional category filter
     */
    public function index(Request $request)
    {
        $query = Tempat::query();

        // Filter by category if provided
        if ($request->has('category')) {
            $query->where('jenis_tempat', $request->category);
        }

        $locations = $query->get()->map(function ($location) {
            return [
                'id' => $location->id,
                'name' => $location->nama_tempat,
                'code' => $location->kode_tempat,
                'latitude' => (float) $location->latitude,
                'longitude' => (float) $location->longitude,
                'category' => $location->jenis_tempat,
                'description' => $location->deskripsi ?? null,
                'image_url' => $location->gambar ? $this->getImageUrl($location->gambar) : null,
                'devices_count' => $location->devices_count,
                'created_at' => $location->created_at,
                'updated_at' => $location->updated_at,
            ];
        });

        return response()->json($locations);
    }

    /**
     * GET /api/locations/stats
     * Get locations statistics
     */
    public function stats()
    {
        $totalLocations = Tempat::count();
        $byCategory = Tempat::selectRaw('jenis_tempat as category, COUNT(*) as count')
            ->groupBy('jenis_tempat')
            ->pluck('count', 'category');
        
        $totalDevices = Asset::count();
        $activeDevices = Asset::where('kondisi', 'aktif')->count();
        $inactiveDevices = Asset::where('kondisi', '!=', 'aktif')->count();

        return response()->json([
            'total_locations' => $totalLocations,
            'locations_by_category' => $byCategory,
            'total_devices' => $totalDevices,
            'active_devices' => $activeDevices,
            'inactive_devices' => $inactiveDevices,
        ]);
    }

    /**
     * GET /api/locations/{id}
     * Get location detail by ID
     */
    public function show($id)
    {
        $location = Tempat::find($id);

        if (!$location) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        return response()->json([
            'id' => $location->id,
            'name' => $location->nama_tempat,
            'code' => $location->kode_tempat,
            'latitude' => (float) $location->latitude,
            'longitude' => (float) $location->longitude,
            'category' => $location->jenis_tempat,
            'description' => $location->deskripsi ?? null,
            'image_url' => $location->gambar ? $this->getImageUrl($location->gambar) : null,
            'devices_count' => $location->devices_count,
            'created_at' => $location->created_at,
            'updated_at' => $location->updated_at,
        ]);
    }

    /**
     * POST /api/locations
     * Create new location
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:150',
            'code' => 'nullable|string|max:20|unique:tempat,kode_tempat',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'category' => 'required|in:stasiun,kantor,gudang,pjl',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // Max 5MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Kesalahan validasi',
                'errors' => $validator->errors(),
            ], 400);
        }

        // Generate code if not provided
        $code = $request->code ?? strtoupper(substr($request->name, 0, 3)) . '-' . time();

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('locations', 'public');
        }

        $location = Tempat::create([
            'nama_tempat' => $request->name,
            'kode_tempat' => $code,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'jenis_tempat' => $request->category,
            'gambar' => $imagePath,
        ]);

        return response()->json([
            'id' => $location->id,
            'name' => $location->nama_tempat,
            'code' => $location->kode_tempat,
            'latitude' => (float) $location->latitude,
            'longitude' => (float) $location->longitude,
            'category' => $location->jenis_tempat,
            'description' => null,
            'image_url' => $imagePath ? $this->getImageUrl($imagePath) : null,
            'devices_count' => 0,
            'created_at' => $location->created_at,
            'updated_at' => $location->updated_at,
        ], 201);
    }

    /**
     * PUT /api/locations/{id}
     * Update location
     */
    public function update(Request $request, $id)
    {
        $location = Tempat::find($id);

        if (!$location) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|max:150',
            'code' => 'sometimes|string|max:20|unique:tempat,kode_tempat,' . $id,
            'latitude' => 'sometimes|numeric',
            'longitude' => 'sometimes|numeric',
            'category' => 'sometimes|in:stasiun,kantor,gudang,pjl',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120', // Max 5MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Kesalahan validasi',
                'errors' => $validator->errors(),
            ], 400);
        }

        if ($request->has('name')) {
            $location->nama_tempat = $request->name;
        }
        if ($request->has('code')) {
            $location->kode_tempat = $request->code;
        }
        if ($request->has('latitude')) {
            $location->latitude = $request->latitude;
        }
        if ($request->has('longitude')) {
            $location->longitude = $request->longitude;
        }
        if ($request->has('category')) {
            $location->jenis_tempat = $request->category;
        }

        // Handle image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($location->gambar && Storage::disk('public')->exists($location->gambar)) {
                Storage::disk('public')->delete($location->gambar);
            }
            $location->gambar = $request->file('image')->store('locations', 'public');
        }

        $location->save();

        return response()->json([
            'id' => $location->id,
            'name' => $location->nama_tempat,
            'code' => $location->kode_tempat,
            'latitude' => (float) $location->latitude,
            'longitude' => (float) $location->longitude,
            'category' => $location->jenis_tempat,
            'description' => null,
            'image_url' => $location->gambar ? $this->getImageUrl($location->gambar) : null,
            'devices_count' => $location->devices_count,
            'created_at' => $location->created_at,
            'updated_at' => $location->updated_at,
        ]);
    }

    /**
     * GET /api/locations/search
     * Search locations by name
     */
    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'q' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Kesalahan validasi',
                'errors' => $validator->errors(),
            ], 400);
        }

        $locations = Tempat::where('nama_tempat', 'like', '%' . $request->q . '%')
            ->orWhere('kode_tempat', 'like', '%' . $request->q . '%')
            ->get()
            ->map(function ($location) {
                return [
                    'id' => $location->id,
                    'name' => $location->nama_tempat,
                    'code' => $location->kode_tempat,
                    'latitude' => (float) $location->latitude,
                    'longitude' => (float) $location->longitude,
                    'category' => $location->jenis_tempat,
                    'description' => null,
                    'image_url' => $location->gambar ? $this->getImageUrl($location->gambar) : null,
                    'devices_count' => $location->devices_count,
                    'created_at' => $location->created_at,
                    'updated_at' => $location->updated_at,
                ];
            });

        return response()->json($locations);
    }

    /**
     * POST /api/locations/bulk-delete
     * Bulk delete locations
     */
    public function bulkDestroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:tempat,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Kesalahan validasi',
                'errors' => $validator->errors(),
            ], 400);
        }

        $ids = $request->ids;

        // Get locations to delete their images
        $locations = Tempat::whereIn('id', $ids)->get();
        
        foreach ($locations as $location) {
            // Delete associated image
            if ($location->gambar && Storage::disk('public')->exists($location->gambar)) {
                Storage::disk('public')->delete($location->gambar);
            }
            
            // Delete associated devices
            Asset::where('kode_tempat', $location->kode_tempat)->delete();
        }

        // Delete locations
        $deletedCount = Tempat::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => 'Lokasi berhasil dihapus',
            'deleted_count' => $deletedCount,
        ]);
    }

    /**
     * DELETE /api/locations/{id}
     * Delete location
     */
    public function destroy($id)
    {
        $location = Tempat::find($id);

        if (!$location) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        // Delete associated image
        if ($location->gambar && Storage::disk('public')->exists($location->gambar)) {
            Storage::disk('public')->delete($location->gambar);
        }

        // Delete associated devices
        Asset::where('kode_tempat', $location->kode_tempat)->delete();

        $location->delete();

        return response()->json(null, 204);
    }

    /**
     * Helper to get full image URL
     */
    private function getImageUrl($path)
    {
        if (!$path) return null;
        
        // If it's already a full URL, return as is
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }
        
        // Return storage URL
        return asset('storage/' . $path);
    }
}
