function showSection(sectionId) {
    const sections = document.querySelectorAll("body > section");

    sections.forEach(function(section) {
        section.style.display = "none";
    });

    const targetSection = document.getElementById(sectionId);

    if (targetSection) {
        if (sectionId === "login" || sectionId === "signup") {
            targetSection.style.display = "flex";
        } else {
            targetSection.style.display = "block";
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {

    showSection("login");

    // Login
    const loginForm = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    if (loginForm) {
        loginForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const emailVal = email.value.trim();
            const passVal = password.value.trim();

            if (emailVal === "") {
                alert("Please enter your email address.");
                email.focus();
            } else if (passVal === "") {
                alert("Please enter your password.");
                password.focus();
            } else if (emailVal === "customer@gmail.com" && passVal === "customer123") {
                alert("Customer Login Successful!");
                loginForm.reset();
                showSection("home");
            } else if (emailVal === "provider@gmail.com" && passVal === "provider123") {
                alert("Provider Login Successful!");
                loginForm.reset();
                showSection("home");
            } else {
                alert("Invalid email or password. Please try again.");
            }
        });
    }

    // Password Show/Hide
    if (togglePassword && password) {
        togglePassword.addEventListener("click", function() {
            const isPassword = password.type === "password";

            password.type = isPassword ? "text" : "password";

            this.classList.toggle("fa-eye", !isPassword);
            this.classList.toggle("fa-eye-slash", isPassword);
        });
    }

    // Sign Up
    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const name = document.getElementById("signupName").value.trim();
            const signupEmail = document.getElementById("signupEmail").value.trim();
            const signupPassword = document.getElementById("signupPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (name === "" || signupEmail === "" || signupPassword === "" || confirmPassword === "") {
                alert("Please fill in all required fields.");
                return;
            }

            if (signupPassword.length < 6) {
                alert("Password must be at least 6 characters long.");
                return;
            }

            if (signupPassword !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            alert("Account created successfully!");
            signupForm.reset();
            showSection("home");
        });
    }
});


//  Login / Sign UP 