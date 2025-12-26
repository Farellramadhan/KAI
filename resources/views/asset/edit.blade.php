@extends('layout.header')
@section('content')

<div class="container mb-5">

  <h4 class="fw-bold mb-3">Edit Aset</h4>

  <form action="{{ route('asset.update', $asset->id) }}" method="POST" class="shadow-sm p-4 rounded-4 bg-white">
    @csrf
    @method('PUT')

    <label class="fw-bold">Nama Aset</label>
    <input type="text" name="nama_asset" class="form-control mb-3" value="{{ $asset->nama_asset }}">

    <label class="fw-bold">Jenis</label>
    <input type="text" name="jenis" class="form-control mb-3" value="{{ $asset->jenis }}">

    <label class="fw-bold">Jumlah</label>
    <input type="number" name="jumlah" class="form-control mb-3" value="{{ $asset->jumlah }}">

    <label class="fw-bold">Kondisi</label>
    <select name="kondisi" class="form-control mb-3">
      <option {{ $asset->kondisi == 'Baik' ? 'selected' : '' }}>Baik</option>
      <option {{ $asset->kondisi == 'Rusak Ringan' ? 'selected' : '' }}>Rusak Ringan</option>
      <option {{ $asset->kondisi == 'Rusak Berat' ? 'selected' : '' }}>Rusak Berat</option>
    </select>

    <label class="fw-bold">Stasiun</label>
    <input type="text" name="stasiun" class="form-control mb-4" value="{{ $asset->stasiun }}">

    <button class="btn btn-primary w-100 rounded-4">Update</button>
  </form>

</div>

@endsection
