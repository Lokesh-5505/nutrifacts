/* ═══════════════════════════════════════════════
   NutriFacts — auth.js
   Login / Signup form logic
   ═══════════════════════════════════════════════ */

(function () {
  "use strict";

  /* ── DOM refs ──────────────────────────────── */
  const tabLogin  = document.getElementById("tabLogin");
  const tabSignup = document.getElementById("tabSignup");
  const slider    = document.getElementById("tabsSlider");

  const panelLogin  = document.getElementById("panelLogin");
  const panelSignup = document.getElementById("panelSignup");

  const authHeading    = document.getElementById("authHeading");
  const authSubheading = document.getElementById("authSubheading");
  const successBox     = document.getElementById("authSuccess");
  const successMsg     = document.getElementById("successMsg");

  /* ── Tab switching ──────────────────────────── */
  function showTab(tab) {
    const isLogin = tab === "login";

    tabLogin.classList.toggle("active", isLogin);
    tabSignup.classList.toggle("active", !isLogin);
    slider.classList.toggle("signup-active", !isLogin);

    panelLogin.classList.toggle("active", isLogin);
    panelSignup.classList.toggle("active", !isLogin);

    authHeading.innerHTML = isLogin
      ? "Welcome <em>back</em>"
      : "Create your <em>account</em>";
    authSubheading.textContent = isLogin
      ? "Sign in to access your food analysis history."
      : "Join NutriFacts and start scanning smarter.";

    clearAllErrors();
    successBox.classList.remove("visible");
  }

  tabLogin.addEventListener("click",  () => showTab("login"));
  tabSignup.addEventListener("click", () => showTab("signup"));

  /* ── Validation helpers ─────────────────────── */
  function showError(inputEl, msg) {
    inputEl.classList.add("error");
    inputEl.classList.remove("success");
    const errEl = inputEl.closest(".auth-field").querySelector(".auth-field-error");
    if (errEl) {
      errEl.textContent = "⚠ " + msg;
      errEl.classList.add("visible");
    }
  }

  function clearError(inputEl) {
    inputEl.classList.remove("error");
    const errEl = inputEl.closest(".auth-field").querySelector(".auth-field-error");
    if (errEl) errEl.classList.remove("visible");
  }

  function markSuccess(inputEl) {
    inputEl.classList.remove("error");
    inputEl.classList.add("success");
    const errEl = inputEl.closest(".auth-field").querySelector(".auth-field-error");
    if (errEl) errEl.classList.remove("visible");
  }

  function clearAllErrors() {
    document.querySelectorAll(".auth-input").forEach((el) => {
      el.classList.remove("error", "success");
    });
    document.querySelectorAll(".auth-field-error").forEach((el) => {
      el.classList.remove("visible");
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  /* ── Password toggle visibility ─────────────── */
  document.querySelectorAll(".pw-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling;
      const isText = input.type === "text";
      input.type = isText ? "password" : "text";
      btn.textContent = isText ? "👁" : "🙈";
      btn.setAttribute("aria-label", isText ? "Show password" : "Hide password");
    });
  });

  /* ── Password strength ──────────────────────── */
  const pwSignup     = document.getElementById("signupPassword");
  const strengthWrap = document.getElementById("pwStrengthWrap");
  const strengthFill = document.getElementById("pwStrengthFill");
  const strengthLbl  = document.getElementById("pwStrengthLabel");

  function calcStrength(pw) {
    if (!pw) return { score: 0, label: "", cls: "" };
    let score = 0;
    if (pw.length >= 8)  score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 1) return { score, label: "Weak",   cls: "weak" };
    if (score <= 2) return { score, label: "Fair",   cls: "fair" };
    if (score <= 3) return { score, label: "Good",   cls: "good" };
    return           { score, label: "Strong", cls: "strong" };
  }

  if (pwSignup) {
    pwSignup.addEventListener("input", () => {
      const val = pwSignup.value;
      if (!val) {
        strengthWrap.classList.remove("visible");
        return;
      }
      strengthWrap.classList.add("visible");
      const { label, cls } = calcStrength(val);
      strengthFill.className = "pw-strength-fill " + cls;
      strengthLbl.className  = "pw-strength-label " + cls;
      strengthLbl.textContent = label;
    });
  }

  /* ── Remember me — persist email ───────────── */
  const rememberCheck = document.getElementById("rememberMe");
  const loginEmailEl  = document.getElementById("loginEmail");

  (function restoreEmail() {
    const saved = localStorage.getItem("nf_saved_email");
    if (saved && loginEmailEl) {
      loginEmailEl.value = saved;
      if (rememberCheck) rememberCheck.checked = true;
    }
  })();

  /* ── LOGIN form ─────────────────────────────── */
  const loginForm = document.getElementById("loginForm");

  loginForm && loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    clearAllErrors();

    const emailEl = document.getElementById("loginEmail");
    const pwEl    = document.getElementById("loginPassword");
    let valid = true;

    if (!emailEl.value.trim()) {
      showError(emailEl, "Email is required.");
      valid = false;
    } else if (!isValidEmail(emailEl.value)) {
      showError(emailEl, "Please enter a valid email address.");
      valid = false;
    } else {
      markSuccess(emailEl);
    }

    if (!pwEl.value) {
      showError(pwEl, "Password is required.");
      valid = false;
    } else if (pwEl.value.length < 6) {
      showError(pwEl, "Password must be at least 6 characters.");
      valid = false;
    } else {
      markSuccess(pwEl);
    }

    if (!valid) return;

    /* Remember me */
    if (rememberCheck && rememberCheck.checked) {
      localStorage.setItem("nf_saved_email", emailEl.value.trim());
    } else {
      localStorage.removeItem("nf_saved_email");
    }

    submitForm(loginForm, "Welcome back! Redirecting…", "index.html");
  });

  /* ── SIGNUP form ────────────────────────────── */
  const signupForm = document.getElementById("signupForm");

  signupForm && signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    clearAllErrors();

    const nameEl    = document.getElementById("signupName");
    const emailEl   = document.getElementById("signupEmail");
    const pwEl      = document.getElementById("signupPassword");
    const pw2El     = document.getElementById("signupPasswordConfirm");
    let valid = true;

    if (!nameEl.value.trim()) {
      showError(nameEl, "Full name is required.");
      valid = false;
    } else {
      markSuccess(nameEl);
    }

    if (!emailEl.value.trim()) {
      showError(emailEl, "Email is required.");
      valid = false;
    } else if (!isValidEmail(emailEl.value)) {
      showError(emailEl, "Please enter a valid email address.");
      valid = false;
    } else {
      markSuccess(emailEl);
    }

    if (!pwEl.value) {
      showError(pwEl, "Password is required.");
      valid = false;
    } else if (pwEl.value.length < 8) {
      showError(pwEl, "Password must be at least 8 characters.");
      valid = false;
    } else if (calcStrength(pwEl.value).cls === "weak") {
      showError(pwEl, "Password is too weak. Add uppercase, numbers or symbols.");
      valid = false;
    } else {
      markSuccess(pwEl);
    }

    if (!pw2El.value) {
      showError(pw2El, "Please confirm your password.");
      valid = false;
    } else if (pw2El.value !== pwEl.value) {
      showError(pw2El, "Passwords do not match.");
      valid = false;
    } else {
      markSuccess(pw2El);
    }

    if (!valid) return;

    submitForm(signupForm, "Account created! Welcome to NutriFacts 🎉", "index.html");
  });

  /* ── Generic submit handler ─────────────────── */
  function submitForm(formEl, successText, redirectTo) {
    const btn = formEl.querySelector(".auth-submit");
    btn.classList.add("loading");
    btn.disabled = true;

    /* Simulate async auth (replace with real API call) */
    setTimeout(() => {
      btn.classList.remove("loading");
      btn.disabled = false;

      successMsg.textContent = successText;
      successBox.classList.add("visible");
      formEl.style.display = "none";

      /* Redirect after a short delay */
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1800);
    }, 1200);
  }

  /* ── Social login placeholders ──────────────── */
  document.querySelectorAll(".auth-social-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (typeof showToast === "function") {
        showToast("Social login coming soon!", "info");
      }
    });
  });

  /* ── Real-time inline validation on blur ────── */
  document.querySelectorAll(".auth-input").forEach((input) => {
    input.addEventListener("blur", () => {
      if (!input.value) return;
      if (input.type === "email" && !isValidEmail(input.value)) {
        showError(input, "Please enter a valid email address.");
      } else if (input.id === "signupPasswordConfirm") {
        const pw = document.getElementById("signupPassword");
        if (pw && input.value !== pw.value) {
          showError(input, "Passwords do not match.");
        } else {
          markSuccess(input);
        }
      } else {
        markSuccess(input);
      }
    });

    input.addEventListener("input", () => {
      if (input.classList.contains("error")) clearError(input);
    });
  });
})();
