@extends('layout.header')
@section('content')

<div class="container mb-5">

  <div class="d-flex justify-content-between align-items-center mb-3">
    <h4 class="fw-bold">Daftar Aset</h4>
    <a href="{{ route('asset.create') }}" class="btn btn-primary rounded-4">+ Tambah Aset</a>
  </div>

  @if(session('success'))
    <div class="alert alert-success">{{ session('success') }}</div>
  @endif

  <div class="list-group shadow-sm rounded-4">
    @foreach ($assets as $a)
    <div class="list-group-item p-3">

      <h6 class="fw-bold">{{ $a->nama_asset }}</h6>

      <div class="text-muted small mb-2">
        Jenis: <strong>{{ $a->jenis }}</strong><br>
        Jumlah: <strong>{{ $a->jumlah }}</strong><br>
        Kondisi: <strong>{{ $a->kondisi }}</strong><br>
        Stasiun: <strong>{{ $a->stasiun }}</strong>
      </div>

      <div class="d-flex gap-2">
        <a href="{{ route('asset.edit', $a->id) }}" class="btn btn-warning btn-sm rounded-3">✏️ Edit</a>

        <form action="{{ route('asset.destroy', $a->id) }}" method="POST">
          @csrf
          @method('DELETE')
          <button class="btn btn-danger btn-sm rounded-3" onclick="return confirm('Yakin hapus?')">🗑️ Hapus</button>
        </form>
      </div>

    </div>
    @endforeach
  </div>

</div>

@endsection
