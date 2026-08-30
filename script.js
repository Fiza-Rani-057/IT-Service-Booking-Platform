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


 
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const searchBtn = document.getElementById("searchBtn");
const providerCards = document.querySelectorAll(".provider-card");

searchBtn.addEventListener("click", function () {
    const searchValue = searchInput.value.toLowerCase().trim();
    const selectedCategory = categoryFilter.value;

    providerCards.forEach(function (card) {
        const cardText = card.textContent.toLowerCase();
        const cardCategory = card.getAttribute("data-category");

        if ((searchValue === "" || cardText.includes(searchValue)) && (selectedCategory === "all" || cardCategory === selectedCategory)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});

categoryFilter.addEventListener("change", function () {
    const selectedCategory = categoryFilter.value;

    providerCards.forEach(function (card) {
        const cardCategory = card.getAttribute("data-category");

        if (selectedCategory === "all" || cardCategory === selectedCategory) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});

