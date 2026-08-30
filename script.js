const loginForm = document.getElementById("loginForm");
const email = document.getElementById("email");
const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (email.value.trim() === "") {
        alert("Please enter your email");
    } 
    else if (password.value.trim() === "") {
        alert("Please enter your password");
    } 
    else if (
        email.value.trim() === "customer@gmail.com" &&
        password.value.trim() === "customer123"
    ) {
        window.location.href = "dashboard.html";
    } 
    else if (
        email.value.trim() === "provider@gmail.com" &&
        password.value.trim() === "provider123"
    ) {
        window.location.href = "providerdb.html";
    } 
    else {
        alert("Please enter correct email or password");
    }
});

togglePassword.addEventListener("click", function () {
    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
});

