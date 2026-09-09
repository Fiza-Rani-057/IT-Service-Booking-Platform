
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
                return;
            }

            if (passVal === "") {
                alert("Please enter your password.");
                password.focus();
                return;
            }

            if (emailVal === "provider@gmail.com" && passVal === "provider123") {
                localStorage.setItem("techserveRole", "provider");
                localStorage.setItem("techserveUserEmail", emailVal);
                localStorage.setItem("techserveUserName", "Provider");

                loginForm.reset();
                showSection("home");
                return;
            }

            if (emailVal === "customer@gmail.com" && passVal === "customer123") {
                localStorage.setItem("techserveRole", "customer");
                localStorage.setItem("techserveUserEmail", emailVal);
                localStorage.setItem("techserveUserName", "Customer");

                loginForm.reset();
                showSection("home");
                return;
            }

            const users = JSON.parse(localStorage.getItem("techserveUsers")) || [];

            let foundUser = null;

            users.forEach(function(user) {
                if (user.email === emailVal && user.password === passVal) {
                    foundUser = user;
                }
            });

            if (foundUser) {
                localStorage.setItem("techserveRole", foundUser.role);
                localStorage.setItem("techserveUserEmail", foundUser.email);
                localStorage.setItem("techserveUserName", foundUser.name);

                loginForm.reset();
                showSection("home");
                return;
            }

            alert("Invalid email or password. Please try again.");
        });
    }

    if (togglePassword && password) {
        togglePassword.addEventListener("click", function() {
            const isPassword = password.type === "password";

            password.type = isPassword ? "text" : "password";

            this.classList.toggle("fa-eye", !isPassword);
            this.classList.toggle("fa-eye-slash", isPassword);
        });
    }

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

            let users = JSON.parse(localStorage.getItem("techserveUsers")) || [];

            let existingUser = false;

            users.forEach(function(user) {
                if (user.email === signupEmail) {
                    existingUser = true;
                }
            });

            if (existingUser) {
                alert("An account with this email already exists.");
                return;
            }

            const newUser = {
                name: name,
                email: signupEmail,
                password: signupPassword,
                role: "customer"
            };

            users.push(newUser);

            localStorage.setItem("techserveUsers", JSON.stringify(users));
            localStorage.setItem("techserveRole", "customer");
            localStorage.setItem("techserveUserEmail", signupEmail);
            localStorage.setItem("techserveUserName", name);

            alert("Account created successfully!");

            signupForm.reset();
            showSection("home");
        });
    }

    loadBookings();
});

function openUserDashboard() {
    const role = localStorage.getItem("techserveRole");

    if (role === "customer") {
        showSection("dashboard");
        loadDashboard();
    } else if (role === "provider") {
        showSection("providerDashboard");
        loadProviderDashboard();
    } else {
        alert("Please login first.");
        showSection("login");
    }
}

function logoutUser() {
    localStorage.removeItem("techserveRole");
    localStorage.removeItem("techserveUserEmail");
    localStorage.removeItem("techserveUserName");

    showSection("login");
}

function loadDashboard() {
    const userName = localStorage.getItem("techserveUserName");
    const bookings = JSON.parse(localStorage.getItem("techserveBookings")) || [];

    const dashboardName = document.getElementById("dashboardName");

    if (dashboardName && userName) {
        dashboardName.textContent = userName;
    }

    loadBookings();
}

function openBookingModal() {
    const modal = document.getElementById("bookingModal");

    if (modal) {
        modal.classList.add("active");
    }
}

function closeBookingModal() {
    const modal = document.getElementById("bookingModal");

    if (modal) {
        modal.classList.remove("active");
    }
}

const bookingModal = document.getElementById("bookingModal");

if (bookingModal) {
    bookingModal.addEventListener("click", function(event) {
        if (event.target === bookingModal) {
            closeBookingModal();
        }
    });
}

const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {
    bookingForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const service = document.getElementById("bookingService").value;
        const provider = document.getElementById("bookingProvider").value.trim();
        const date = document.getElementById("bookingDate").value;
        const time = document.getElementById("bookingTime").value;
        const location = document.getElementById("bookingLocation").value.trim();
        const description = document.getElementById("bookingDescription").value.trim();

        if (service === "") {
            alert("Please select a service.");
            return;
        }

        if (provider === "") {
            alert("Please enter provider name.");
            return;
        }

        if (date === "") {
            alert("Please select booking date.");
            return;
        }

        if (time === "") {
            alert("Please select booking time.");
            return;
        }

        if (location === "") {
            alert("Please enter your location.");
            return;
        }

        if (description === "") {
            alert("Please enter booking description.");
            return;
        }

        const booking = {
            id: "TS" + Date.now().toString().slice(-6),
            customer: localStorage.getItem("techserveUserName") || "Customer",
            customerEmail: localStorage.getItem("techserveUserEmail") || "",
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

function loadProviderDashboard() {
    const providerName = document.getElementById("providerName");
    const providerEmail = localStorage.getItem("techserveUserEmail");

    if (providerName) {
        if (providerEmail === "provider@gmail.com") {
            providerName.textContent = "Provider";
        } else {
            providerName.textContent = localStorage.getItem("techserveUserName") || "Provider";
        }
    }

    const bookings = JSON.parse(localStorage.getItem("techserveBookings")) || [];

    const providerBookingCount = document.getElementById("providerBookingCount");
    const providerTableBody = document.querySelector("#providerDashboard tbody");

    if (providerBookingCount) {
        providerBookingCount.textContent = bookings.length + " Requests";
    }

    if (!providerTableBody) {
        return;
    }

    if (bookings.length === 0) {
        providerTableBody.innerHTML = '<tr><td colspan="7" class="empty-booking">No service requests available yet.</td></tr>';
        return;
    }

    providerTableBody.innerHTML = "";

    bookings.forEach(function(booking) {
        const row = document.createElement("tr");

        let actionButtons = "";

        if (booking.status === "Pending") {
            actionButtons = `
                <div class="request-action">
                    <button class="accept-btn" onclick="updateBookingStatus('${booking.id}','Accepted')">Accept</button>
                    <button class="reject-btn" onclick="updateBookingStatus('${booking.id}','Rejected')">Reject</button>
                </div>
            `;
        } else if (booking.status === "Accepted") {
            actionButtons = `
                <button class="complete-btn" onclick="updateBookingStatus('${booking.id}','Completed')">Complete</button>
            `;
        } else {
            actionButtons = "-";
        }

        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.customer || "Customer"}</td>
            <td>${booking.service}</td>
            <td>${booking.date}</td>
            <td>${booking.time}</td>
            <td><span class="status ${booking.status.toLowerCase()}">${booking.status}</span></td>
            <td>${actionButtons}</td>
        `;

        providerTableBody.appendChild(row);
    });
}

function updateBookingStatus(bookingId, newStatus) {
    let bookings = JSON.parse(localStorage.getItem("techserveBookings")) || [];

    bookings.forEach(function(booking) {
        if (booking.id === bookingId) {
            booking.status = newStatus;
        }
    });

    localStorage.setItem("techserveBookings", JSON.stringify(bookings));

    loadProviderDashboard();
    loadBookings();

    alert("Booking status updated to " + newStatus + ".");
}

function goToHome() {
    showSection("home");
}

