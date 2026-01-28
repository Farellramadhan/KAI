<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Dashboard KAI</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body>

<!-- HEADER -->
  <div class="header-bg mb-4 text-center d-flex justify-content-between align-items-center px-4 py-3">

    <div>
      <h2 class="fw-bold m-0">Dashboard KAI</h2>
      <p class="m-0">Selamat datang di layanan Kereta Api Indonesia</p>
    </div>

  <div class="dropdown mb-4 px-4 py-3 d-none d-md-flex justify-content-between align-items-center"
     style="border-radius: 0 0 20px 20px;">
    <button class="btn btn-light shadow-sm fw-bold px-3 py-2 rounded-4 d-flex align-items-center gap-2"
            id="profileDropdown" data-bs-toggle="dropdown" aria-expanded="false">

      <img src="{{ asset("image/profile/profile.png ") }}" alt="profile" class="rounded-circle" width="35" height="35">
      <span class="fw-bold">{{ Auth::user()->name  }}</span>

    </button>

    <ul class="dropdown-menu dropdown-menu-end mt-2 shadow">
      <li><a class="dropdown-item" href="{{ route('profile') }}">👤 Akun</a></li>
      <li><a class="dropdown-item" href="/monitoring">📊 Monitoring</a></li>
      <li><a class="dropdown-item" href="{{ route('dashboard') }}">🛠️ Aset</a></li>
      <li><a class="dropdown-item" href="{{ route('asset.index') }}">🧾 CRUD Aset</a></li>
      <li><hr class="dropdown-divider"></li>
      <li><a class="dropdown-item text-danger fw-bold" href="{{ route('logout') }}">🚪 Logout</a></li>
    </ul>
  </div>
  </div>

   {{-- content --}}
  <main>
    @yield('content')
    @yield('akun')
  </main>
  {{-- nav bar for mobile --}}
 <nav class="navbar fixed-bottom navbar-light bg-white border-top d-md-none">
    <div class="container d-flex justify-content-around">
      <a class="nav-link active text-center" href="{{ route('dashboard') }}">🏠<br><small>Home</small></a>
      <a class="nav-link text-center" href="/monitoring">📊<br><small>Monitoring</small></a>
    <a class="nav-link text-center" href="{{ route('asset.index') }}">🧾<br><small>CRUD</small></a> <!-- DITAMBAHKAN -->
      <a class="nav-link text-center" href="{{ route('dashboard') }}">🛠️<br><small>Aset</small></a>
      <a class="nav-link text-center" href="{{ route('profile') }}">🚪<br><small>Akun</small></a>
    </div>
  </nav>

  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
