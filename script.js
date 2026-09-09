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
                localStorage.setItem("techserveRole", "customer");
                localStorage.setItem("techserveUserEmail", emailVal);

                loginForm.reset();
                showSection("home");
            } else if (emailVal === "provider@gmail.com" && passVal === "provider123") {
                localStorage.setItem("techserveRole", "provider");
                localStorage.setItem("techserveUserEmail", emailVal);

                loginForm.reset();
                showSection("home");
            } else {
                alert("Invalid email or password. Please try again.");
            }
        });
    }

    // Password Show / Hide
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

            localStorage.setItem("techserveRole", "customer");
            localStorage.setItem("techserveUserEmail", signupEmail);
            localStorage.setItem("techserveUserName", name);

            alert("Account created successfully!");

            signupForm.reset();
            showSection("home");
        });
    }
});

// Dashboard according to user role
function openUserDashboard() {
    const role = localStorage.getItem("techserveRole");

    if (role === "customer") {
        showSection("dashboard");
        loadBookings();
    } else if (role === "provider") {
        showSection("providerDashboard");
    } else {
        alert("Please login first.");
        showSection("login");
    }
}

// Logout
function logoutUser() {
    localStorage.removeItem("techserveRole");
    localStorage.removeItem("techserveUserEmail");
    localStorage.removeItem("techserveUserName");

    showSection("login");
}

// Customer Dashboard
function loadDashboard() {
    const userName = localStorage.getItem("techserveUserName");
    const bookings = JSON.parse(localStorage.getItem("techserveBookings")) || [];

    if (userName && document.getElementById("dashboardName")) {
        document.getElementById("dashboardName").textContent = userName;
    }

    const pending = bookings.filter(function(booking) {
        return booking.status === "Pending";
    }).length;

    const accepted = bookings.filter(function(booking) {
        return booking.status === "Accepted";
    }).length;

    const completed = bookings.filter(function(booking) {
        return booking.status === "Completed";
    }).length;

    document.getElementById("totalBookings").textContent = bookings.length;
    document.getElementById("pendingBookings").textContent = pending;
    document.getElementById("acceptedBookings").textContent = accepted;
    document.getElementById("completedBookings").textContent = completed;
    document.getElementById("bookingCount").textContent = bookings.length + " Bookings";

    const table = document.getElementById("bookingTableBody");

    if (!table) {
        return;
    }

    if (bookings.length === 0) {
        table.innerHTML = '<tr><td colspan="6" class="empty-booking">No bookings available yet.</td></tr>';
        return;
    }

    table.innerHTML = "";

    bookings.forEach(function(booking) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.service}</td>
            <td>${booking.provider}</td>
            <td>${booking.date}</td>
            <td>${booking.time}</td>
            <td><span class="status ${booking.status.toLowerCase()}">${booking.status}</span></td>
        `;

        table.appendChild(row);
    });
}

// Booking Modal
function openBookingModal() {
    document.getElementById("bookingModal").classList.add("active");
}

function closeBookingModal() {
    document.getElementById("bookingModal").classList.remove("active");
}

const bookingModal = document.getElementById("bookingModal");

if (bookingModal) {
    bookingModal.addEventListener("click", function(e) {
        if (e.target === this) {
            closeBookingModal();
        }
    });
}

// Booking Form
const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
    bookingForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const service = document.getElementById("bookingService").value;
        const provider = document.getElementById("bookingProvider").value.trim();
        const date = document.getElementById("bookingDate").value;
        const time = document.getElementById("bookingTime").value;
        const location = document.getElementById("bookingLocation").value.trim();
        const description = document.getElementById("bookingDescription").value.trim();

        if (service === "" || provider === "" || date === "" || time === "" || location === "" || description === "") {
            alert("Please fill all fields.");
            return;
        }

        const booking = {
            id: "TS" + Date.now().toString().slice(-6),
            service: service,
            provider: provider,
            date: date,
            time: time,
            location: location,
            description: description,
            status: "Pending"
        };

        let bookings = JSON.parse(localStorage.getItem("techserveBookings")) || [];

        bookings.push(booking);

        localStorage.setItem("techserveBookings", JSON.stringify(bookings));

        bookingForm.reset();

        closeBookingModal();

        loadBookings();

        alert("Booking created successfully!\nBooking ID: " + booking.id);
    });
}

// Load Bookings
function loadBookings() {
    const bookings = JSON.parse(localStorage.getItem("techserveBookings")) || [];

    const total = document.getElementById("totalBookings");
    const pending = document.getElementById("pendingBookings");
    const accepted = document.getElementById("acceptedBookings");
    const completed = document.getElementById("completedBookings");
    const count = document.getElementById("bookingCount");
    const tableBody = document.getElementById("bookingTableBody");

    if (!total || !pending || !accepted || !completed || !count || !tableBody) {
        return;
    }

    total.textContent = bookings.length;

    let pendingCount = 0;
    let acceptedCount = 0;
    let completedCount = 0;

    bookings.forEach(function(booking) {
        if (booking.status === "Pending") {
            pendingCount++;
        }

        if (booking.status === "Accepted") {
            acceptedCount++;
        }

        if (booking.status === "Completed") {
            completedCount++;
        }
    });

    pending.textContent = pendingCount;
    accepted.textContent = acceptedCount;
    completed.textContent = completedCount;
    count.textContent = bookings.length + " Bookings";

    if (bookings.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" class="empty-booking">No bookings available yet.</td></tr>';
        return;
    }

    tableBody.innerHTML = "";

    bookings.forEach(function(booking) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.service}</td>
            <td>${booking.provider}</td>
            <td>${booking.date}</td>
            <td>${booking.time}</td>
            <td><span class="status ${booking.status.toLowerCase()}">${booking.status}</span></td>
        `;

        tableBody.appendChild(row);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    loadBookings();
});