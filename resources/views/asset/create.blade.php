@extends('layout.header')
@section('content')

<div class="container mb-5">

  <h4 class="fw-bold mb-3">Tambah Aset</h4>

  <form action="{{ route('asset.store') }}" method="POST" class="shadow-sm p-4 rounded-4 bg-white">
    @csrf

    <label class="fw-bold">Nama Aset</label>
    <input type="text" name="nama_asset" class="form-control mb-3">

    <label class="fw-bold">Jenis</label>
    <input type="text" name="jenis" class="form-control mb-3">

    <label class="fw-bold">Jumlah</label>
    <input type="number" name="jumlah" class="form-control mb-3">

     <label class="fw-bold">Model</label>
    <input type="text" name="model" class="form-control mb-3">
       <label class="fw-bold">Merek</label>
    <input type="text" name="merk" class="form-control mb-3">
       <label class="fw-bold">Tipe</label>
    <input type="text" name="type" class="form-control mb-3">

    <label class="fw-bold">Kondisi</label>
    <select name="kondisi" class="form-control mb-3">
      <option>Baik</option>
      <option>Rusak Ringan</option>
      <option>Rusak Berat</option>
    </select>

    <label class="fw-bold">Stasiun</label>
    <select name="stasiun_id" class="form-control mb-4" required>
    <option value="">-- Pilih Stasiun --</option>
    @foreach($stasiun as $s)
        <option value="{{ $s->id }}">{{ $s->nama_stasiun }}</option>
    @endforeach
    </select>


    <button class="btn btn-primary w-100 rounded-4">Simpan</button>
  </form>

</div>

@endsection
