document.addEventListener("DOMContentLoaded", () => {
  const registerModal = document.getElementById("modal-register");
  const loginModal = document.getElementById("modal-login");

  const registerBtn = document.getElementById("btn-register");
  const loginBtn = document.getElementById("btn-login");

  const closeButtons = document.querySelectorAll(".close");
  const roleButtons = document.querySelectorAll(".btn-role");
  const registrationFormContainer = document.getElementById("registration-form");

  const BACKEND_URL = "http://localhost:3019"; // change if needed

  /* -------------------------
      OPEN REGISTER MODAL
  -------------------------- */
  registerBtn.addEventListener("click", () => {
    registerModal.style.display = "block";
  });

  /* -------------------------
      OPEN LOGIN MODAL
  -------------------------- */
  loginBtn.addEventListener("click", () => {
    loginModal.style.display = "block";
  });

  /* -------------------------
      CLOSE MODALS
  -------------------------- */
  closeButtons.forEach(btn =>
    btn.addEventListener("click", () => {
      registerModal.style.display = "none";
      loginModal.style.display = "none";
      registrationFormContainer.innerHTML = "";
      registrationFormContainer.style.display = "none";
    })
  );

  /* -------------------------
      SHOW LEARNER/TUTOR FORM
  -------------------------- */
  roleButtons.forEach(button => {
    button.addEventListener("click", () => {
      const role = button.dataset.role;

      registrationFormContainer.style.display = "block";
      registrationFormContainer.innerHTML = `
        <form id="registerForm">
          
          <input type="hidden" name="role" value="${role}" />

          <div class="form-group">
            <label>First Name</label>
            <input type="text" name="firstName" required>
          </div>

          <div class="form-group">
            <label>Last Name</label>
            <input type="text" name="lastName" required>
          </div>

          <div class="form-group">
            <label>Email</label>
            <input type="email" name="email" required>
          </div>

          <div class="form-group">
            <label>Password</label>
            <input type="password" name="password" required>
          </div>

          <button class="btn btn-primary" type="submit">Create Account</button>
        </form>
      `;

      /*  REGISTER SUBMIT HANDLER */
      const form = document.getElementById("create-account-form");

      form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = Object.fromEntries(new FormData(form).entries());

        try {
          const res = await fetch(`${BACKEND_URL}/api/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData)
          });

          const result = await res.json();
          if (!res.ok) return alert(result.message);

          alert("Account created!");
          registerModal.style.display = "none";

        } catch (err) {
          alert("Error connecting to server");
          console.error(err);
        }
      });
    });
  });

  /* -------------------------
      LOGIN FORM SUBMIT
  -------------------------- */
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      identifier: loginForm.identifier.value,
      password: loginForm.password.value
    };

    try {
      const res = await fetch(`${BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await res.json();
      if (!res.ok) return alert(result.message);

      alert("Login successful!");

      // Redirect based on role
      if (result.role === "tutor") {
        window.location.href = "/tutors/tutor-dashboard.html";
      } else if (result.role === "learner") {
        window.location.href = "/learners/learners-dashboard.html";
      }

    } catch (err) {
      alert("Server error");
      console.error(err);
    }
  });

});
