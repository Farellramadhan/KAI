<?php

namespace App\Http\Controllers;

use App\Models\Location;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LocationController extends Controller
{
    public function index(Request $request)
    {
        $query = Location::withCount('devices');

        if ($request->has('category')) {
            $query->where('category', $request->category);
        }

        $locations = $query->get();

        return response()->json($locations);
    }

    public function show($id)
    {
        $location = Location::withCount('devices')->find($id);

        if (!$location) {
            return response()->json(['message' => 'Resource not found.'], 404);
        }

        return response()->json($location);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
            'code' => 'nullable|string',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'category' => 'required|in:stasiun,kantor,gudang,pjl',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 400);
        }

        $location = Location::create($request->all());
        $location->setAttribute('devices_count', 0);

        return response()->json($location, 201);
    }

    public function update(Request $request, $id)
    {
        $location = Location::find($id);

        if (!$location) {
            return response()->json(['message' => 'Resource not found.'], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string',
            'code' => 'nullable|string',
            'latitude' => 'numeric',
            'longitude' => 'numeric',
            'category' => 'in:stasiun,kantor,gudang,pjl',
            'description' => 'nullable|string',
            'image_url' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 400);
        }

        $location->update($request->all());
        return response()->json($location);
    }

    public function destroy($id)
    {
        $location = Location::find($id);

        if (!$location) {
            return response()->json(['message' => 'Resource not found.'], 404);
        }

        $location->delete();

        return response()->json([
            'message' => 'Location deleted successfully'
        ]);
    }

    public function search(Request $request)
    {
        $request->validate(['q' => 'required|string']);

        $locations = Location::withCount('devices')
            ->where('name', 'like', '%' . $request->q . '%')
            ->get();

        return response()->json($locations);
    }
}
