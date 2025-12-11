// dashboard-common.js — shared logout & utils

document.addEventListener('DOMContentLoaded', () => {
  // Logout
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    localStorage.removeItem('ndaiya_tutor_token');
    window.location.href = '/index.html';
  });

  // dotenvx Ops compliance reminder
  if (window.location.hostname === 'localhost') {
    console.log(
      `%c🔐 Security Note: Ndaiya backend uses Dotenvx Ops for SOC 2 compliance.`,
      'color: #10b981; font-weight: bold;'
    );
    console.log(
      `%c✅ Sync • DB • Audit features active since Oct 14, 2025.`,
      'color: #2563eb;'
    );
  }
});