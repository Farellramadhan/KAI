const authCard = document.getElementById('authCard');
document.getElementById('showRegister').onclick = () => authCard.classList.add('active');
document.getElementById('showLogin').onclick = () => authCard.classList.remove('active');

// Password strength
const passwordField = document.getElementById('registerPassword');
const strengthBar = document.getElementById('strengthBar');
const strengthText = document.getElementById('strengthText');

passwordField.addEventListener('input', () => {
  const val = passwordField.value;
  let strength = 0;
  if (val.length >= 6) strength++;
  if (/[A-Z]/.test(val)) strength++;
  if (/[0-9]/.test(val)) strength++;
  if (/[^A-Za-z0-9]/.test(val)) strength++;

  if (val.length === 0) {
    strengthBar.className = 'strength';
    strengthText.textContent = '';
  } else if (strength <= 1) {
    strengthBar.className = 'strength weak';
    strengthText.textContent = 'Kekuatan: Lemah';
    strengthText.style.color = 'red';
  } else if (strength <= 3) {
    strengthBar.className = 'strength medium';
    strengthText.textContent = 'Kekuatan: Sedang';
    strengthText.style.color = 'orange';
  } else {
    strengthBar.className = 'strength strong';
    strengthText.textContent = 'Kekuatan: Kuat';
    strengthText.style.color = 'green';
  }
});

const emailErrror = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');
const confirmError = document.getElementById('confirmError');

// REGISTER FORM
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  emailErrror.innerHTML = "";
  phoneError.innerHTML = "";
  confirmError.innerHTML = "";

  const name = document.getElementById('registerName').value.trim();
  const email = document.getElementById('registerEmail').value.trim();
  const phone = document.getElementById('registerPhone').value.trim();
  const password = document.getElementById('registerPassword').value;
  const confirm = document.getElementById('confirmPassword').value;

  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const phoneRegex = /^(?:\+62|62|0)8[1-9][0-9]{7,10}$/;

  if (!gmailRegex.test(email)) {
    emailErrror.innerHTML = "Gunakan hanya email Gmail";
    return;
  }

  if (!phoneRegex.test(phone)) {
    phoneError.innerHTML = "Nomor HP tidak valid!";
    return;
  }

  if (password !== confirm) {
    confirmError.innerHTML = "Password tidak cocok!";
    return;
  }

  const response = await fetch('/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
    },
    body: JSON.stringify({ name, email, phone, password, password_confirmation: confirm })
  });

  const result = await response.json();

  if (!result.success) {

    if (result.message.includes('email')) {
        emailErrror.innerHTML = result.message;
    }

    if (result.message.includes('nomor HP')) {
        phoneError.innerHTML = result.message;
    }

    return;
  }

  // Jika berhasil
  document.getElementById('registerForm').reset();
  authCard.classList.remove('active');
});

// LOGIN FORM
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
 const loginError = document.getElementById('loginError');
    loginError.innerHTML = "";


  const response = await fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
    },
    body: JSON.stringify({ email, password })
  });

  const result = await response.json();
  if (result.success) {
    alert('🚆 ' + result.message);
    window.location.href = '/dashboard';
  } else {
    loginError.innerHTML = result.message;
    // alert('❌ ' + result.message);
  }
});
