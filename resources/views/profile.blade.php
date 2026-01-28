
@extends('layout.header')
@section(section: 'akun');
 <div class="container mt-4 mb-5">
    <h3 class="fw-bold text-center mb-4">Akun</h3>
    <!-- Profile Card -->
    <div class="card shadow-sm card-profile p-4 mb-4">
      <div class="d-flex align-items-center">
        <div class="me-3">
          <div class="rounded-circle bg-warning d-flex justify-content-center align-items-center" style="width:70px; height:70px; font-size:32px; font-weight:bold; color:white;">
        {{ substr($user->name, 0, 1) }}

          </div>
        </div>
        <div>
          <h5 class="fw-bold m-0">{{ $user->name }}</h5>
          <small class="text-muted">{{ $user->email }}</small>
        </div>
      </div>
    </div>

    <!-- Menu Options -->
    <div class="list-group shadow-sm rounded-4 overflow-hidden mb-4">
      <a href="#" class="list-group-item list-group-item-action p-3">
        🔒 Ganti Password
      </a>
      <a href="#" class="list-group-item list-group-item-action p-3">
        🛠️ Pengaturan Akun
      </a>
    </div>

    <!-- Logout Button -->
    <div class="text-center d-md-none ">
      <a href="{{ route('logout') }}" class="btn btn-logout w-100 mb-4">Logout</a>
    </div>
  </div>


  @endsection
