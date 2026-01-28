<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Stasiun;
use Illuminate\Http\Request;

class AssetController extends Controller
{
    public function index()
    {
        $assets = Asset::with('stasiun')->latest()->get();
        return view('asset.index', compact('assets'));
    }

    public function create()
    {
        $stasiun = Stasiun::all();   // ambil semua stasiun
        return view('asset.create', compact('stasiun'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama_asset' => 'required|string',
            'jenis'      => 'required|string',
            'jumlah'     => 'required|integer|min:1',
            'kondisi'    => 'required|string',
            'merk'       => 'required|string',
            'model'       => 'required|string',
            'type'       => 'required|string',
            'stasiun_id' => 'required|exists:stasiun,id',
        ]);

        Asset::create($request->all());

        return redirect()->route('asset.index')->with('success', 'Aset berhasil ditambahkan');
    }

    public function edit(Asset $asset)
    {
        $stasiun = Stasiun::all();   // diperlukan untuk dropdown
        return view('asset.edit', compact('asset', 'stasiun'));
    }

    public function update(Request $request, Asset $asset)
    {
        $request->validate([
            'nama_asset' => 'required|string',
            'jenis'      => 'required|string',
            'jumlah'     => 'required|integer',
            'kondisi'    => 'required|string',
            'merk'       => 'required|string',
            'model'       => 'required|string',
            'type'       => 'required|string',
            'stasiun_id' => 'required|exists:stasiun,id',
        ]);

        $asset->update($request->all());

        return redirect()->route('asset.index')->with('success', 'Aset berhasil diperbarui');
    }

    public function destroy(Asset $asset)
    {
        $asset->delete();

        return redirect()->route('asset.index')->with('success', 'Aset berhasil dihapus');
    }

}
