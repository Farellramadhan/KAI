<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Tempat;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class DeviceController extends Controller
{
    /**
     * GET /api/devices
     * Get all devices
     */
    public function index()
    {
        $devices = Asset::all()->map(function ($device) {
            return [
                'id' => $device->id,
                'location_id' => $device->tempat ? $device->tempat->id : null,
                'name' => $device->hostname,
                'type' => $device->jenis_perangkat,
                'status' => $device->kondisi === 'SO' ? 'active' : 'inactive',
                'serial_number' => $device->merk_spek,
                'ip_address' => $device->ip_perangkat,
                'description' => $device->lokasi,
                'created_at' => $device->created_at,
                'updated_at' => $device->updated_at,
            ];
        });

        return response()->json($devices);
    }

    /**
     * GET /api/locations/{locationId}/devices
     * Get all devices from a specific location
     */
    public function getByLocation($locationId)
    {
        $location = Tempat::find($locationId);

        if (!$location) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        $devices = Asset::where('kode_tempat', $location->kode_tempat)
            ->get()
            ->map(function ($device) use ($location) {
                return [
                    'id' => $device->id,
                    'location_id' => $location->id,
                    'name' => $device->hostname,
                    'type' => $device->jenis_perangkat,
                    'status' => $device->kondisi === 'SO' ? 'active' : 'inactive',
                    'serial_number' => $device->merk_spek,
                    'ip_address' => $device->ip_perangkat,
                    'description' => $device->lokasi,
                    'created_at' => $device->created_at,
                    'updated_at' => $device->updated_at,
                ];
            });

        return response()->json($devices);
    }

    /**
     * GET /api/devices/{id}
     * Get device detail by ID
     */
    public function show($id)
    {
        $device = Asset::find($id);

        if (!$device) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        return response()->json([
            'id' => $device->id,
            'location_id' => $device->tempat ? $device->tempat->id : null,
            'name' => $device->hostname,
            'type' => $device->jenis_perangkat,
            'status' => $device->kondisi === 'SO' ? 'active' : 'inactive',
            'serial_number' => $device->merk_spek,
            'ip_address' => $device->ip_perangkat,
            'description' => $device->lokasi,
            'created_at' => $device->created_at,
            'updated_at' => $device->updated_at,
        ]);
    }

    /**
     * POST /api/devices
     * Create new device
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'location_id' => 'required|integer|exists:tempat,id',
            'name' => 'required|string|max:150',
            'type' => 'required|string|max:100',
            'status' => 'required|in:active,inactive,maintenance',
            'serial_number' => 'nullable|string|max:200',
            'description' => 'nullable|string|max:150',
            'ip_address' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Kesalahan validasi',
                'errors' => $validator->errors(),
            ], 400);
        }

        $location = Tempat::find($request->location_id);

        // Map status to kondisi (active = SO, inactive/maintenance = TSO)
        $kondisi = $request->status === 'active' ? 'SO' : 'TSO';

        $device = Asset::create([
            'kode_tempat' => $location->kode_tempat,
            'hostname' => $request->name,
            'jenis_perangkat' => $request->type,
            'kondisi' => $kondisi,
            'merk_spek' => $request->serial_number,
            'lokasi' => $request->description,
            'ip_perangkat' => $request->ip_address ?? '0.0.0.0',
        ]);

        return response()->json([
            'id' => $device->id,
            'location_id' => $location->id,
            'name' => $device->hostname,
            'type' => $device->jenis_perangkat,
            'status' => $request->status,
            'serial_number' => $device->merk_spek,
            'ip_address' => $device->ip_perangkat,
            'description' => $device->lokasi,
            'created_at' => $device->created_at,
            'updated_at' => $device->updated_at,
        ], 201);
    }

    /**
     * PUT /api/devices/{id}
     * Update device
     */
    public function update(Request $request, $id)
    {
        $device = Asset::find($id);

        if (!$device) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'location_id' => 'sometimes|integer|exists:tempat,id',
            'name' => 'sometimes|string|max:150',
            'type' => 'sometimes|string|max:100',
            'status' => 'sometimes|in:active,inactive,maintenance',
            'serial_number' => 'nullable|string|max:200',
            'description' => 'nullable|string|max:150',
            'ip_address' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Kesalahan validasi',
                'errors' => $validator->errors(),
            ], 400);
        }

        if ($request->has('location_id')) {
            $location = Tempat::find($request->location_id);
            $device->kode_tempat = $location->kode_tempat;
        }

        if ($request->has('name')) {
            $device->hostname = $request->name;
        }

        if ($request->has('type')) {
            $device->jenis_perangkat = $request->type;
        }

        if ($request->has('status')) {
            $device->kondisi = $request->status === 'active' ? 'SO' : 'TSO';
        }

        if ($request->has('serial_number')) {
            $device->merk_spek = $request->serial_number;
        }

        if ($request->has('description')) {
            $device->lokasi = $request->description;
        }

        if ($request->has('ip_address')) {
            $device->ip_perangkat = $request->ip_address;
        }

        $device->save();

        $location_id = $device->tempat ? $device->tempat->id : null;

        return response()->json([
            'id' => $device->id,
            'location_id' => $location_id,
            'name' => $device->hostname,
            'type' => $device->jenis_perangkat,
            'status' => $device->kondisi === 'SO' ? 'active' : 'inactive',
            'serial_number' => $device->merk_spek,
            'ip_address' => $device->ip_perangkat,
            'description' => $device->lokasi,
            'created_at' => $device->created_at,
            'updated_at' => $device->updated_at,
        ]);
    }

    /**
     * PATCH /api/devices/{id}/status
     * Update device status only
     */
    public function updateStatus(Request $request, $id)
    {
        $device = Asset::find($id);

        if (!$device) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:active,inactive,maintenance',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Kesalahan validasi',
                'errors' => $validator->errors(),
            ], 400);
        }

        $device->kondisi = $request->status === 'active' ? 'SO' : 'TSO';
        $device->save();

        return response()->json([
            'id' => $device->id,
            'status' => $request->status,
            'location_id' => $device->tempat ? $device->tempat->id : null,
            'name' => $device->hostname,
            'type' => $device->jenis_perangkat,
            'serial_number' => $device->merk_spek,
            'ip_address' => $device->ip_perangkat,
            'description' => $device->lokasi,
            'created_at' => $device->created_at,
            'updated_at' => $device->updated_at,
        ]);
    }

    /**
     * DELETE /api/devices/{id}
     * Delete device
     */
    public function destroy($id)
    {
        $device = Asset::find($id);

        if (!$device) {
            return response()->json(['message' => 'Data tidak ditemukan.'], 404);
        }

        $device->delete();

        return response()->json(null, 204);
    }

    /**
     * POST /api/devices/bulk-delete
     * Delete multiple devices
     */
    public function bulkDestroy(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:asset,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Kesalahan validasi',
                'errors' => $validator->errors(),
            ], 400);
        }

        $ids = $request->ids;
        $deletedCount = Asset::whereIn('id', $ids)->delete();

        return response()->json([
            'message' => 'Perangkat berhasil dihapus',
            'deleted_count' => $deletedCount,
        ]);
    }

    /**
     * GET /api/devices/stats
     * Get device statistics
     */
    public function stats(Request $request)
    {
        $query = Asset::query();

        // Filter by location if provided
        if ($request->has('location_id')) {
            $location = Tempat::find($request->location_id);
            if ($location) {
                $query->where('kode_tempat', $location->kode_tempat);
            }
        }

        $total = $query->count();
        $active = (clone $query)->where('kondisi', 'SO')->count();
        $inactive = (clone $query)->where('kondisi', 'TSO')->count();

        return response()->json([
            'total' => $total,
            'active' => $active,
            'inactive' => $inactive,
            'maintenance' => 0, // We only have SO and TSO in database
        ]);
    }

    /**
     * POST /api/devices/bulk-import
     * Import devices from CSV or Excel file
     */
    public function bulkImport(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'location_id' => 'required|integer|exists:tempat,id',
            'file' => 'required|file|mimes:csv,txt,xlsx,xls|max:10240', // Max 10MB
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Kesalahan validasi',
                'errors' => $validator->errors(),
            ], 400);
        }

        $location = Tempat::find($request->location_id);
        $file = $request->file('file');
        $extension = strtolower($file->getClientOriginalExtension());

        try {
            $data = [];

            if ($extension === 'csv' || $extension === 'txt') {
                // Parse CSV
                $data = $this->parseCsv($file);
            } elseif ($extension === 'xlsx' || $extension === 'xls') {
                // Parse Excel
                $data = $this->parseExcel($file);
            }

            if (empty($data)) {
                return response()->json([
                    'message' => 'File kosong atau format tidak valid',
                ], 400);
            }

            // Validate and insert data
            $inserted = 0;
            $errors = [];

            foreach ($data as $index => $row) {
                $rowNumber = $index + 2; // +2 because index starts at 0 and we skip header

                // Validate required fields
                if (empty($row['jenis_perangkat'])) {
                    $errors[] = "Baris {$rowNumber}: Jenis Perangkat wajib diisi";
                    continue;
                }
                if (empty($row['hostname'])) {
                    $errors[] = "Baris {$rowNumber}: Hostname wajib diisi";
                    continue;
                }

                // Map kondisi
                $kondisi = 'TSO';
                if (!empty($row['kondisi'])) {
                    $kondisiUpper = strtoupper(trim($row['kondisi']));
                    if (in_array($kondisiUpper, ['SO', 'AKTIF', 'ACTIVE', 'SIAP OPERASI'])) {
                        $kondisi = 'SO';
                    }
                }

                try {
                    Asset::create([
                        'kode_tempat' => $location->kode_tempat,
                        'jenis_perangkat' => trim($row['jenis_perangkat']),
                        'hostname' => trim($row['hostname']),
                        'merk_spek' => trim($row['merk_spek'] ?? ''),
                        'ip_perangkat' => trim($row['ip_perangkat'] ?? '0.0.0.0'),
                        'lokasi' => trim($row['lokasi'] ?? $location->nama_tempat),
                        'kondisi' => $kondisi,
                    ]);
                    $inserted++;
                } catch (\Exception $e) {
                    $errors[] = "Baris {$rowNumber}: " . $e->getMessage();
                }
            }

            return response()->json([
                'message' => "Import selesai. {$inserted} item berhasil ditambahkan.",
                'inserted' => $inserted,
                'total_rows' => count($data),
                'errors' => $errors,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Gagal memproses file: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Parse CSV file
     */
    private function parseCsv($file)
    {
        $data = [];
        $handle = fopen($file->getRealPath(), 'r');
        
        // Get header row
        $header = fgetcsv($handle, 0, ',');
        if (!$header) {
            fclose($handle);
            return [];
        }

        // Normalize header names
        $headerMap = $this->normalizeHeaders($header);

        // Read data rows
        while (($row = fgetcsv($handle, 0, ',')) !== false) {
            if (count($row) < 2) continue; // Skip empty rows
            
            $rowData = [];
            foreach ($headerMap as $normalized => $index) {
                $rowData[$normalized] = $row[$index] ?? '';
            }
            $data[] = $rowData;
        }

        fclose($handle);
        return $data;
    }

    /**
     * Parse Excel file
     */
    private function parseExcel($file)
    {
        // Use PhpSpreadsheet if available, otherwise simple CSV fallback
        if (!class_exists('\PhpOffice\PhpSpreadsheet\IOFactory')) {
            // Fallback: Try to read as CSV
            return $this->parseCsv($file);
        }

        $spreadsheet = \PhpOffice\PhpSpreadsheet\IOFactory::load($file->getRealPath());
        $worksheet = $spreadsheet->getActiveSheet();
        $rows = $worksheet->toArray();

        if (empty($rows)) return [];

        // Get header row
        $header = array_shift($rows);
        $headerMap = $this->normalizeHeaders($header);

        $data = [];
        foreach ($rows as $row) {
            if (count(array_filter($row)) < 2) continue; // Skip empty rows
            
            $rowData = [];
            foreach ($headerMap as $normalized => $index) {
                $rowData[$normalized] = $row[$index] ?? '';
            }
            $data[] = $rowData;
        }

        return $data;
    }

    /**
     * Normalize header names to match database fields
     */
    private function normalizeHeaders($headers)
    {
        $map = [];
        $fieldMappings = [
            'jenis_perangkat' => ['jenis_perangkat', 'jenis perangkat', 'jenis', 'type', 'tipe'],
            'hostname' => ['hostname', 'host', 'nama', 'name', 'nama perangkat'],
            'merk_spek' => ['merk_spek', 'merk/spek', 'merk', 'spek', 'merek', 'serial', 'serial_number', 'sn'],
            'ip_perangkat' => ['ip_perangkat', 'ip perangkat', 'ip', 'ip_address', 'alamat_ip'],
            'lokasi' => ['lokasi', 'location', 'tempat', 'posisi'],
            'kondisi' => ['kondisi', 'status', 'condition', 'state'],
        ];

        foreach ($headers as $index => $header) {
            $normalizedHeader = strtolower(trim($header));
            
            foreach ($fieldMappings as $field => $aliases) {
                if (in_array($normalizedHeader, $aliases)) {
                    $map[$field] = $index;
                    break;
                }
            }
        }

        return $map;
    }

    /**
     * GET /api/devices/import-template
     * Download XLSX import template
     */
    public function importTemplate()
    {
        $headers = [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="template_import_perangkat.xlsx"',
        ];

        $excelHeader = [
            'jenis_perangkat',
            'hostname',
            'merk_spek',
            'ip_perangkat',
            'lokasi',
            'kondisi',
        ];

        $rows = [
            ['Router', 'RTR-001', 'Cisco 2900', '192.168.1.1', 'Ruang Server', 'SO'],
            ['Switch', 'SWT-001', 'HP ProCurve', '192.168.1.2', 'Ruang Network', 'SO'],
            ['Server', 'SRV-001', 'Dell PowerEdge', '192.168.1.10', 'Data Center', 'TSO'],
        ];

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Template Import');

        // Write header
        $sheet->fromArray($excelHeader, null, 'A1');

        // Write sample rows
        $sheet->fromArray($rows, null, 'A2');

        // Autosize columns for readability
        foreach (range('A', 'F') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);

        $callback = function () use ($writer) {
            $writer->save('php://output');
        };

        return response()->stream($callback, 200, $headers);
    }
}
