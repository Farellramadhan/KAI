<?php

namespace App\Http\Controllers;

use App\Models\Device;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class DeviceController extends Controller
{
    public function index()
    {
        $devices = Device::all();
        return response()->json($devices);
    }

    public function devicesByLocation($locationId)
    {
        $devices = Device::where('location_id', $locationId)->get();
        return response()->json($devices);
    }

    public function show($id)
    {
        $device = Device::find($id);

        if (!$device) {
            return response()->json(['message' => 'Resource not found.'], 404);
        }

        return response()->json($device);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'location_id' => 'required|exists:locations,id',
            'name' => 'required|string',
            'type' => 'required|string',
            'status' => 'required|in:active,inactive,maintenance',
            'serial_number' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 400);
        }

        $device = Device::create($request->all());

        return response()->json($device, 201);
    }

    public function update(Request $request, $id)
    {
        $device = Device::find($id);

        if (!$device) {
            return response()->json(['message' => 'Resource not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'location_id' => 'exists:locations,id',
            'name' => 'string',
            'type' => 'string',
            'status' => 'in:active,inactive,maintenance',
            'serial_number' => 'nullable|string',
            'description' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 400);
        }

        $device->update($request->all());

        return response()->json($device);
    }

    public function updateStatus(Request $request, $id)
    {
        $device = Device::find($id);

        if (!$device) {
            return response()->json(['message' => 'Resource not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'status' => 'required|in:active,inactive,maintenance',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 400);
        }

        $device->update(['status' => $request->status]);

        return response()->json($device);
    }

    public function destroy($id)
    {
        $device = Device::find($id);

        if (!$device) {
            return response()->json(['message' => 'Resource not found.'], 404);
        }

        $device->delete();

        return response()->json([
            'message' => 'Device deleted successfully'
        ]);
    }

    public function stats(Request $request)
    {
        $query = Device::query();

        if ($request->has('location_id')) {
            $query->where('location_id', $request->location_id);
        }

        $total = (clone $query)->count();
        $active = (clone $query)->where('status', 'active')->count();
        $inactive = (clone $query)->where('status', 'inactive')->count();
        $maintenance = (clone $query)->where('status', 'maintenance')->count();

        return response()->json([
            'total' => $total,
            'active' => $active,
            'inactive' => $inactive,
            'maintenance' => $maintenance,
        ]);
    }
}
