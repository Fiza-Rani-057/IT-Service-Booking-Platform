const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (email.value.trim() === "") {
        alert("Please enter your email");
    } else if (password.value.trim() === "") {
        alert("Please enter your password");
    } else {
        alert("Login successful!");

          window.location.href = "dashboard.html";
    }
});

togglePassword.addEventListener("click", function () {
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
});