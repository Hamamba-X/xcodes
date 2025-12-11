// Ndaiya — Main JavaScript
// Handles modals, form toggles, and interactions

document.addEventListener('DOMContentLoaded', () => {
  // Modal elements
  const modalRegister = document.getElementById('modal-register');
  const modalLogin = document.getElementById('modal-login');
  const btnRegister = document.getElementById('btn-register');
  const btnLogin = document.getElementById('btn-login');
  const btnCTARegister = document.getElementById('btn-cta-register');
  const btnJoinLearners = document.getElementById('btn-join-learners');
  const btnJoinTutors = document.getElementById('btn-join-tutors');
  const closeButtons = document.querySelectorAll('.close');
  const roleButtons = document.querySelectorAll('.btn-role');
  const registrationForm = document.getElementById('registration-form');
  const loginForm = document.getElementById('login-form');

  // Open Register Modal
  const openRegisterModal = () => {
    modalRegister.style.display = 'block';
  };

  // Open Login Modal
  const openLoginModal = () => {
    modalLogin.style.display = 'block';
  };

  // Close modals
  const closeModal = () => {
    modalRegister.style.display = 'none';
    modalLogin.style.display = 'none';
    registrationForm.style.display = 'none';
    registrationForm.innerHTML = '';
  };

  // Event Listeners
  btnRegister.addEventListener('click', openRegisterModal);
  btnLogin.addEventListener('click', openLoginModal);
  btnCTARegister.addEventListener('click', openRegisterModal);
  btnJoinLearners.addEventListener('click', openRegisterModal);
  btnJoinTutors.addEventListener('click', openRegisterModal);

  closeButtons.forEach(btn => {
    btn.addEventListener('click', closeModal);
  });

  // Close modal when clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === modalRegister || e.target === modalLogin) {
      closeModal();
    }
  });

  // Role selection in register modal
  roleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const role = btn.getAttribute('data-role');
      renderRegistrationForm(role);
    });
  });

  // Render registration form based on role
  function renderRegistrationForm(role) {
    let formHTML = `
      <form id="reg-form">
        <input type="hidden" name="role" value="${role}" />
        <div class="form-group">
          <label for="reg-fname">First Name</label>
          <input type="text" id="reg-fname" name="firstName" required />
        </div>
        <div class="form-group">
          <label for="reg-lname">Last Name</label>
          <input type="text" id="reg-lname" name="lastName" required />
        </div>
        <div class="form-group">
          <label for="reg-email">Email</label>
          <input type="email" id="reg-email" name="email" required />
        </div>
        <div class="form-group">
          <label for="reg-phone">Phone (e.g., +2547XX...)</label>
          <input type="tel" id="reg-phone" name="phone" required />
        </div>
        <div class="form-group">
          <label for="reg-password">Password</label>
          <input type="password" id="reg-password" name="password" required minlength="6" />
        </div>
    `;

    if (role === 'tutor') {
      formHTML += `
        <div class="form-group">
          <label for="reg-subjects">Subjects You Teach (comma-separated)</label>
          <input type="text" id="reg-subjects" name="subjects" placeholder="Math, Physics, Chemistry" />
        </div>
        <div class="form-group">
          <label for="reg-nationality">Nationality</label>
          <input type="text" id="reg-nationality" name="nationality" value="Kenyan" />
        </div>
      `;
    } else {
      formHTML += `
        <div class="form-group">
          <label for="reg-grade">Grade/Level</label>
          <select id="reg-grade" name="grade">
            <option value="">Select</option>
            <option value="Form 1">Form 1</option>
            <option value="Form 2">Form 2</option>
            <option value="Form 3">Form 3</option>
            <option value="Form 4">Form 4</option>
            <option value="University">University</option>
          </select>
        </div>
      `;
    }

    formHTML += `
        <button type="submit" class="btn btn-primary">Create Account</button>
        <p class="mt-2">Already have an account? <a href="#" id="switch-to-login">Login here</a></p>
      </form>
    `;

    registrationForm.innerHTML = formHTML;
    registrationForm.style.display = 'block';

    // Handle form submission
    document.getElementById('reg-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      alert(`Registration for ${role} submitted! (In real app: POST to /api/${role}s)`);
      closeModal();
    });

    // Switch to login
    document.getElementById('switch-to-login')?.addEventListener('click', (e) => {
      e.preventDefault();
      modalRegister.style.display = 'none';
      modalLogin.style.display = 'block';
    });
  }

  // Login form submission
  loginForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    alert(`Login attempt for ${email} — in real app: POST to /api/auth/login`);
    closeModal();
  });

  // Forgot password
  document.getElementById('forgot-password')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Password reset email sent (simulated).');
  });

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });

  // Log: ready for integration
  console.log('✅ Ndaiya frontend loaded. Ready for API integration.');
  console.log('💡 Tip: Use `dotenvx run -- node server.js` for secure env handling in backend.');
});