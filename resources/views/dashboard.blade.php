
@extends('layout.header')
@section('content')


  <!-- Asset List -->
    <div class="container mb-5">

    <!-- Search Bar -->
    <div class="row mb-4">
      <div class="col-12 col-lg-6 mx-auto">
        <input type="text" id="searchStation" class="form-control form-control-lg shadow-sm" placeholder="🔍 Cari stasiun atau aset..." />
      </div>
    </div>


  <!-- Summary cards -->

<div class="row g-3 mb-4 text-center">

  <!-- Card CCTV -->
  <div class="col-6 col-md-3">
    <div class="card shadow-sm p-3 rounded-4" role="button"
         data-bs-toggle="modal" data-bs-target="#modalCCTV">
      <div class="card-icon">📹</div>
      <h6 class="fw-bold mt-2">Total CCTV</h6>
    </div>
  </div>

  <!-- Card Komputer -->
  <div class="col-6 col-md-3">
    <div class="card shadow-sm p-3 rounded-4" role="button"
         data-bs-toggle="modal" data-bs-target="#modalKomputer">
      <div class="card-icon">💻</div>
      <h6 class="fw-bold mt-2">Total Komputer</h6>
    </div>
  </div>

  <!-- Card Peralatan -->
  <div class="col-6 col-md-3">
    <div class="card shadow-sm p-3 rounded-4" role="button"
         data-bs-toggle="modal" data-bs-target="#modalPeralatan">
      <div class="card-icon">🛠️</div>
      <h6 class="fw-bold mt-2">Total Peralatan</h6>
    </div>
  </div>

  <!-- Card Kondisi Baik -->
  <div class="col-6 col-md-3">
    <div class="card shadow-sm p-3 rounded-4" role="button"
         data-bs-toggle="modal" data-bs-target="#modalKondisi">
      <div class="card-icon">📦</div>
      <h6 class="fw-bold mt-2">Kondisi Baik</h6>
    </div>
  </div>

</div>


  <!-- Asset List -->
  <div class="mt-4">
      <h5 class="fw-bold mb-3">Daftar Aset Stasiun</h5>
      <div class="list-group shadow-sm rounded-4 overflow-hidden">

        <div class="list-group-item p-3">
          <h6 class="fw-bold mb-2">Stasiun Gambir</h6>
          <div class="row small text-muted mb-2">
            <div class="col-6 col-md-3">📹 CCTV: <strong>42</strong></div>
            <div class="col-6 col-md-3">💻 Komputer: <strong>18</strong></div>
            <div class="col-6 col-md-3">🛠️ Peralatan: <strong>27</strong></div>
            <div class="col-6 col-md-3">📦 Kondisi Baik: <strong>91%</strong></div>
          </div>
        </div>

        <div class="list-group-item p-3">
          <h6 class="fw-bold mb-2">Stasiun Bandung</h6>
          <div class="row small text-muted mb-2">
            <div class="col-6 col-md-3">📹 CCTV: <strong>28</strong></div>
            <div class="col-6 col-md-3">💻 Komputer: <strong>12</strong></div>
            <div class="col-6 col-md-3">🛠️ Peralatan: <strong>19</strong></div>
            <div class="col-6 col-md-3">📦 Kondisi Baik: <strong>88%</strong></div>
          </div>
        </div>

        <div class="list-group-item p-3">
          <h6 class="fw-bold mb-2">Stasiun Surabaya Gubeng</h6>
          <div class="row small text-muted mb-2">
            <div class="col-6 col-md-3">📹 CCTV: <strong>33</strong></div>
            <div class="col-6 col-md-3">💻 Komputer: <strong>15</strong></div>
            <div class="col-6 col-md-3">🛠️ Peralatan: <strong>23</strong></div>
            <div class="col-6 col-md-3">📦 Kondisi Baik: <strong>94%</strong></div>
          </div>
        </div>

      </div>
    </div>

  </div>
<!-- MODAL CCTV -->
<div class="modal fade" id="modalCCTV" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4">
      <div class="modal-header">
        <h5 class="modal-title">Detail Total CCTV</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <p>Total CCTV terpasang: <strong>103</strong></p>
        <p>Stasiun ter-cover: <strong>12 lokasi</strong></p>
        <p>Kondisi baik: <strong>92%</strong></p>
      </div>
    </div>
  </div>
</div>

<!-- MODAL KOMPUTER -->
<div class="modal fade" id="modalKomputer" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4">
      <div class="modal-header">
        <h5 class="modal-title">Detail Total Komputer</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <p>Total Komputer: <strong>45 unit</strong></p>
        <p>Kondisi baik: <strong>89%</strong></p>
        <p>Butuh maintenance: <strong>3 unit</strong></p>
      </div>
    </div>
  </div>
</div>

<!-- MODAL PERALATAN -->
<div class="modal fade" id="modalPeralatan" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4">
      <div class="modal-header">
        <h5 class="modal-title">Detail Total Peralatan</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <p>Total Peralatan: <strong>69 item</strong></p>
        <p>Kategori utama: Radio, Tools, Jaringan</p>
        <p>Kondisi baik: <strong>91%</strong></p>
      </div>
    </div>
  </div>
</div>

<!-- MODAL KONDISI BAIK -->
<div class="modal fade" id="modalKondisi" tabindex="-1">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content rounded-4">
      <div class="modal-header">
        <h5 class="modal-title">Detail Kondisi Baik</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <p>Persentase aset kondisi baik: <strong>91%</strong></p>
        <p>Aset rusak ringan: <strong>7%</strong></p>
        <p>Aset rusak berat: <strong>2%</strong></p>
      </div>
    </div>
  </div>
</div>


@endsection




