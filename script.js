// Konfigurasi API
const API_URL = "https://script.google.com/macros/s/AKfycbzyA-JK3bmXNIXF-16pMHGnevRnkpWtKDqL5ESr6Ls3J5ava4C_A2maF4nGBQSc5wBz/exec";

let rawPassword = ""; // Simpan password sementara di memori
let isPasswordVisible = false;

// Event Listener untuk Borang Carian
document.getElementById('searchForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const category = document.getElementById('category').value;
  const lastsixdigit = document.getElementById('lastsixdigit').value;
  
  // Tukar state butang kepada Loading
  setLoadingState(true);

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify({ category, lastsixdigit })
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Masukkan maklumat dalam modal
      document.getElementById('resName').innerText = result.data.fullname;
      document.getElementById('resEmail').innerText = result.data.moeid;
      
      // Simpan dan set default sembunyi untuk password
      rawPassword = result.data.password;
      maskPassword();
      
      // Buka modal
      openModal();
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error("Ralat:", error);
    alert("Maaf, ralat sistem berlaku. Cuba sebentar lagi.");
  } finally {
    setLoadingState(false);
  }
});

// Fungsi Tukar Keadaan Butang Loading
function setLoadingState(isLoading) {
  const btnSubmit = document.getElementById('btnSubmit');
  const btnText = document.getElementById('btnText');
  const btnLoading = document.getElementById('btnLoading');
  
  if (isLoading) {
    btnSubmit.disabled = true;
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
  } else {
    btnSubmit.disabled = false;
    btnText.classList.remove('hidden');
    btnLoading.classList.add('hidden');
  }
}

// Fungsi Buka & Tutup Modal
function openModal() {
  const modal = document.getElementById('resultModal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeModal() {
  const modal = document.getElementById('resultModal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
  // Reset visibility password bila tutup
  isPasswordVisible = false;
}

// Fungsi Sembunyikan Kata Laluan (Tunjuk dot-dot)
function maskPassword() {
  const passSpan = document.getElementById('resPassword');
  const eyeIcon = document.getElementById('eyeIcon');
  
  passSpan.innerText = "••••••••";
  eyeIcon.className = "fa-regular fa-eye";
}

// Fungsi Togel Tunjuk/Sembunyi Kata Laluan
function togglePasswordVisibility() {
  const passSpan = document.getElementById('resPassword');
  const eyeIcon = document.getElementById('eyeIcon');
  
  if (isPasswordVisible) {
    maskPassword();
    isPasswordVisible = false;
  } else {
    passSpan.innerText = rawPassword;
    eyeIcon.className = "fa-regular fa-eye-slash";
    isPasswordVisible = true;
  }
}

// Fungsi Salin Teks ke Clipboard (Copy-to-Clipboard)
async function copyText(elementId, buttonId) {
  let textToCopy = "";
  
  if (elementId === 'resPassword') {
    textToCopy = rawPassword; // Salin password sebenar, bukan yang bertanda dot-dot
  } else {
    textToCopy = document.getElementById(elementId).innerText;
  }
  
  try {
    await navigator.clipboard.writeText(textToCopy);
    
    // Tukar ikon butang untuk maklum balas visual
    const button = document.getElementById(buttonId);
    const originalIcon = button.innerHTML;
    
    button.innerHTML = `<i class="fa-solid fa-check text-green-500 text-lg"></i>`;
    button.classList.add('bg-green-50');
    
    setTimeout(() => {
      button.innerHTML = originalIcon;
      button.classList.remove('bg-green-50');
    }, 2000);
    
  } catch (err) {
    console.error("Gagal menyalin teks: ", err);
  }
}