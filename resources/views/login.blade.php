<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <title>{{ $title }}</title>
  <link rel="shortcut icon" href="{{ asset('image/favicon.ico') }}" type="image/x-icon">
  <meta name="description" content="Daftar asset stasiun kereta api indonesia">
  <meta property="og:title" content="{{ $title }}">
  <meta property="og:image" content="{{ asset('image/kai.png') }}"/>
<meta property="og:description" content="Daftar asset stasiun kereta api indonesia"/>
<meta property="og:url" content="http://{{ $host }}"/>
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="627"/>
<meta property="og:type" content="website"/>

  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="{{ asset('css/login.css') }}">
</head>
<body>
  <div class="card" id="authCard">
    <div class="forms">

      <!-- LOGIN FORM -->
      <form id="loginForm" method="POST">
        @csrf
        <img src="{{ asset('image/kai.png') }}" class="logo" alt="KAI Logo">
        <h3 class="title">{{ $title }}</h3>
          <small id="loginError" class="text-danger"></small>
        <div class="mb-3">
          <label for="loginEmail" class="form-label">Email</label>
          <input type="email" name="email" class="form-control" id="loginEmail" placeholder="Masukkan email" required>
        </div>
        <div class="mb-3">
          <label for="loginPassword" class="form-label">Password</label>
          <input type="password" name="password" class="form-control" id="loginPassword" placeholder="Masukkan password" required>
        </div>
        <button type="submit" class="btn btn-custom w-100 text-white">Masuk</button>
        <div class="toggle" id="showRegister">Belum punya akun? Daftar sekarang</div>
      </form>

      <!-- REGISTER FORM -->
      <form id="registerForm" method="POST">
         @csrf
        <img src="{{ asset('image/kai.png') }}" class="logo" alt="KAI Logo">
        <h3 class="title">{{ $title }}</h3>

        <div class="mb-3">
          <label class="form-label">Nama Lengkap</label>
          <input type="text" name="name" class="form-control" id="registerName" placeholder="Masukkan nama lengkap" required>
          <small id="nameError" class="text-danger"></small>
        </div>

        <div class="mb-3">
          <label class="form-label">Email</label>
          <input type="email" name="email" class="form-control" id="registerEmail" placeholder="Masukkan email" required>
          <small id="emailError" class="text-danger"></small>
        </div>

        <div class="mb-3">
          <label class="form-label">Nomor HP</label>
          <input type="tel" name="phone" class="form-control" id="registerPhone" placeholder="Masukkan nomor HP" required>
          <small id="phoneError" class="text-danger"></small>
        </div>

        <div class="mb-3">
          <label class="form-label">Password</label>
          <input type="password" class="form-control" id="registerPassword" placeholder="Masukkan password" required>
          <div class="strength" id="strengthBar"></div>
          <div class="strength-text" id="strengthText"></div>
          <small id="passwordError" class="text-danger"></small>
        </div>

        <div class="mb-3">
          <label class="form-label">Konfirmasi Password</label>
          <input type="password" name="password" class="form-control" id="confirmPassword" placeholder="Ulangi password" required>
          <small id="confirmError" class="text-danger"></small>
        </div>

        <button type="submit" class="btn btn-custom w-100 text-white">Daftar</button>
        <div class="toggle" id="showLogin">Sudah punya akun? Masuk</div>
      </form>
    </div>
  </div>

  <script src="{{ asset('js/auth.js') }}"></script>
</body>
</html>
