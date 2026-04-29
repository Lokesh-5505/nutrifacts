// Authentication Page JavaScript

document.addEventListener("DOMContentLoaded", function () {
  // Match the rest of the site: use shared navbar/footer injection (main.js)
  if (typeof injectNavbar === "function") injectNavbar("auth.html");
  if (typeof injectFooter === "function") injectFooter();

  // Get all form elements
  const loginToggle = document.getElementById("login-toggle");
  const signupToggle = document.getElementById("signup-toggle");
  const loginForm = document.getElementById("login-form");
  const signupForm = document.getElementById("signup-form");

  // Toggle between login and signup
  loginToggle.addEventListener("click", function () {
    loginToggle.classList.add("active");
    signupToggle.classList.remove("active");
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
  });

  signupToggle.addEventListener("click", function () {
    signupToggle.classList.add("active");
    loginToggle.classList.remove("active");
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
  });

  // Login Form Validation
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (validateLoginForm()) {
      handleLoginSubmit();
    }
  });

  // Signup Form Validation
  signupForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (validateSignupForm()) {
      handleSignupSubmit();
    }
  });

  // Password visibility toggle
  setupPasswordToggle("login-password", "login-password-toggle");
  setupPasswordToggle("signup-password", "signup-password-toggle");
  setupPasswordToggle("confirm-password", "confirm-password-toggle");

  // Password strength indicator
  const signupPassword = document.getElementById("signup-password");
  if (signupPassword) {
    signupPassword.addEventListener("input", checkPasswordStrength);
  }

  // Load saved email if "remember me" was checked
  loadSavedEmail();

  // Social login buttons
  const googleBtn = document.querySelector(".google-btn");
  const appleBtn = document.querySelector(".apple-btn");
  if (googleBtn) googleBtn.addEventListener("click", handleSocialLogin);
  if (appleBtn) appleBtn.addEventListener("click", handleSocialLogin);
});

// Setup password visibility toggle
function setupPasswordToggle(inputId, toggleId) {
  const input = document.getElementById(inputId);
  const toggle = document.getElementById(toggleId);

  if (toggle && input) {
    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      const type =
        input.getAttribute("type") === "password" ? "text" : "password";
      input.setAttribute("type", type);
      toggle.textContent = type === "password" ? "👁️" : "👁️‍🗨️";
    });
  }
}

// Validate Login Form
function validateLoginForm() {
  const email = document.getElementById("login-email");
  const password = document.getElementById("login-password");
  let isValid = true;

  // Clear previous errors
  clearError("login-email-error");
  clearError("login-password-error");

  // Email validation
  if (!email.value.trim()) {
    showError("login-email-error", "Email is required");
    isValid = false;
  } else if (!isValidEmail(email.value)) {
    showError("login-email-error", "Please enter a valid email");
    email.classList.add("error");
    isValid = false;
  } else {
    email.classList.add("success");
  }

  // Password validation
  if (!password.value.trim()) {
    showError("login-password-error", "Password is required");
    isValid = false;
  } else if (password.value.length < 6) {
    showError("login-password-error", "Password must be at least 6 characters");
    isValid = false;
  } else {
    password.classList.add("success");
  }

  return isValid;
}

// Validate Signup Form
function validateSignupForm() {
  const name = document.getElementById("signup-name");
  const email = document.getElementById("signup-email");
  const password = document.getElementById("signup-password");
  const confirmPassword = document.getElementById("confirm-password");
  let isValid = true;

  // Clear previous errors
  clearError("signup-name-error");
  clearError("signup-email-error");
  clearError("signup-password-error");
  clearError("confirm-password-error");

  // Name validation
  if (!name.value.trim()) {
    showError("signup-name-error", "Full name is required");
    isValid = false;
  } else if (name.value.trim().length < 2) {
    showError("signup-name-error", "Name must be at least 2 characters");
    isValid = false;
  } else {
    name.classList.add("success");
  }

  // Email validation
  if (!email.value.trim()) {
    showError("signup-email-error", "Email is required");
    isValid = false;
  } else if (!isValidEmail(email.value)) {
    showError("signup-email-error", "Please enter a valid email");
    isValid = false;
  } else {
    email.classList.add("success");
  }

  // Password validation
  if (!password.value.trim()) {
    showError("signup-password-error", "Password is required");
    isValid = false;
  } else if (password.value.length < 8) {
    showError(
      "signup-password-error",
      "Password must be at least 8 characters",
    );
    isValid = false;
  } else if (!isStrongPassword(password.value)) {
    showError(
      "signup-password-error",
      "Password must contain uppercase, lowercase, and numbers",
    );
    isValid = false;
  } else {
    password.classList.add("success");
  }

  // Confirm password validation
  if (!confirmPassword.value.trim()) {
    showError("confirm-password-error", "Please confirm your password");
    isValid = false;
  } else if (confirmPassword.value !== password.value) {
    showError("confirm-password-error", "Passwords do not match");
    isValid = false;
  } else {
    confirmPassword.classList.add("success");
  }

  return isValid;
}

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Strong password validation
function isStrongPassword(password) {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  return hasUppercase && hasLowercase && hasNumbers;
}

// Check password strength
function checkPasswordStrength() {
  const password = document.getElementById("signup-password").value;
  const strengthFill = document.getElementById("strength-fill");
  const strengthText = document.getElementById("strength-text");

  let strength = "weak";
  let strengthClass = "weak";

  if (password.length >= 8) {
    strength = "weak";
    strengthClass = "weak";

    if (password.length >= 12) {
      strength = "medium";
      strengthClass = "medium";
    }

    if (isStrongPassword(password) && password.length >= 12) {
      strength = "strong";
      strengthClass = "strong";
    }
  }

  strengthFill.className = "strength-fill " + strengthClass;
  strengthText.textContent =
    strength.charAt(0).toUpperCase() + strength.slice(1);
}

// Show error message
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.classList.add("show");
    const inputId = elementId.replace("-error", "");
    const input = document.getElementById(inputId);
    if (input) input.classList.add("error");
  }
}

// Clear error message
function clearError(elementId) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.classList.remove("show");
    const inputId = elementId.replace("-error", "");
    const input = document.getElementById(inputId);
    if (input) {
      input.classList.remove("error");
      input.classList.remove("success");
    }
  }
}

// Handle login submission
function handleLoginSubmit() {
  const email = document.getElementById("login-email").value;
  const rememberMe = document.getElementById("remember-me").checked;

  if (rememberMe) {
    localStorage.setItem("savedEmail", email);
  } else {
    localStorage.removeItem("savedEmail");
  }

  // Simulate login (in real app, send to server)
  console.log("Login attempt:", { email });
  alert("Login successful! Welcome back.");
  // Here you would redirect to dashboard or home page
  // window.location.href = 'index.html';
}

// Handle signup submission
function handleSignupSubmit() {
  const name = document.getElementById("signup-name").value;
  const email = document.getElementById("signup-email").value;

  // Simulate signup (in real app, send to server)
  console.log("Signup attempt:", { name, email });
  alert("Account created successfully! Welcome to NutriFacts.");
  // Here you would redirect to dashboard or home page
  // window.location.href = 'index.html';
}

// Handle social login
function handleSocialLogin(e) {
  e.preventDefault();
  const btn = e.target.closest("button");
  const provider =
    btn && btn.classList.contains("google-btn") ? "Google" : "Apple";
  alert("Redirecting to " + provider + " login...");
  // In real app: redirect to OAuth provider
}

// Load saved email from localStorage
function loadSavedEmail() {
  const savedEmail = localStorage.getItem("savedEmail");
  if (savedEmail) {
    document.getElementById("login-email").value = savedEmail;
    document.getElementById("remember-me").checked = true;
  }
}
