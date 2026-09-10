function showSection(sectionId) {
    const sections = document.querySelectorAll("body > section");

    sections.forEach(function (section) {
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

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function goHomeTo(sectionId) {
    showSection("home");

    setTimeout(function () {
        const target = document.getElementById(sectionId);

        if (target) {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }, 100);
}

/* DELETE ACCOUNT */
function deleteAccount() {
    const confirmDelete = confirm("Are you sure you want to delete your account?");

    if (!confirmDelete) {
        return;
    }

    const email = localStorage.getItem("techserveUserEmail");

    let users = JSON.parse(localStorage.getItem("techserveUsers")) || [];

    users = users.filter(function (user) {
        return user.email !== email;
    });

    localStorage.setItem("techserveUsers", JSON.stringify(users));

    localStorage.removeItem("techserveRole");
    localStorage.removeItem("techserveUserEmail");
    localStorage.removeItem("techserveUserName");

    alert("Account deleted successfully.");

    showSection("signup");
}

document.addEventListener("DOMContentLoaded", function () {

    showSection("login");

    /* LOGIN */
    const loginForm = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const emailVal = email.value.trim().toLowerCase();
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

            if (emailVal === "admin@gmail.com" && passVal === "admin123") {
                localStorage.setItem("techserveRole", "admin");
                localStorage.setItem("techserveUserEmail", emailVal);
                localStorage.setItem("techserveUserName", "Admin");

                loginForm.reset();
                showSection("home");
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
            const users = JSON.parse(localStorage.getItem("techserveUsers")) || [];
            let foundUser = null;

            users.forEach(function (user) {
                if (
                    user.email.toLowerCase() === emailVal &&
                    user.password === passVal
                ) {
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

    /* PASSWORD SHOW / HIDE */
    if (togglePassword && password) {
        togglePassword.addEventListener("click", function () {
            if (password.type === "password") {
                password.type = "text";
                this.classList.remove("fa-eye");
                this.classList.add("fa-eye-slash");
            } else {
                password.type = "password";
                this.classList.remove("fa-eye-slash");
                this.classList.add("fa-eye");
            }
        });
    }

    /* SIGNUP */
    const signupForm = document.getElementById("signupForm");

    if (signupForm) {
        signupForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("signupName").value.trim();
            const signupEmail = document.getElementById("signupEmail").value.trim().toLowerCase();
            const signupPassword = document.getElementById("signupPassword").value;
            const confirmPassword = document.getElementById("confirmPassword").value;

            if (
                name === "" ||
                signupEmail === "" ||
                signupPassword === "" ||
                confirmPassword === ""
            ) {
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

            users.forEach(function (user) {
                if (user.email.toLowerCase() === signupEmail) {
                    existingUser = true;
                }
            });

            if (
                existingUser ||
                signupEmail === "admin@gmail.com" ||
                signupEmail === "provider@gmail.com" ||
                signupEmail === "customer@gmail.com"
            ) {
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

            localStorage.setItem(
                "techserveUsers",
                JSON.stringify(users)
            );

            localStorage.setItem("techserveRole", "customer");
            localStorage.setItem("techserveUserEmail", signupEmail);
            localStorage.setItem("techserveUserName", name);

            signupForm.reset();

            alert("Account created successfully!");

            showSection("home");
        });
    }

    /* BOOKING MODAL */
    const bookingModal = document.getElementById("bookingModal");

    if (bookingModal) {
        bookingModal.addEventListener("click", function (event) {
            if (event.target === bookingModal) {
                closeBookingModal();
            }
        });
    }

    /* PROVIDER PROFILE MODAL */
    const providerProfileModal = document.getElementById("providerProfileModal");

    if (providerProfileModal) {
        providerProfileModal.addEventListener("click", function (event) {
            if (event.target === providerProfileModal) {
                closeProviderProfile();
            }
        });
    }

    /* BOOKING DATE */
    const bookingDate = document.getElementById("bookingDate");

    if (bookingDate) {
        const today = new Date().toISOString().split("T")[0];
        bookingDate.min = today;
    }

    /* BOOKING FORM */
    const bookingForm = document.getElementById("bookingForm");

    if (bookingForm) {
        bookingForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const role = localStorage.getItem("techserveRole");

            if (role !== "customer") {
                alert("Please login as a customer to create a booking.");
                closeBookingModal();
                showSection("login");
                return;
            }

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

            let bookings = JSON.parse(
                localStorage.getItem("techserveBookings")
            ) || [];

            bookings.push(booking);

            localStorage.setItem(
                "techserveBookings",
                JSON.stringify(bookings)
            );

            bookingForm.reset();
            closeBookingModal();

            loadBookings();
            loadProviderDashboard();
            loadAdminDashboard();

            alert(
                "Booking created successfully!\nBooking ID: " + booking.id
            );
        });
    }

    /* CONTACT FORM */
    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const name = document.getElementById("contactName").value.trim();
            const email = document.getElementById("contactEmail").value.trim();
            const subject = document.getElementById("contactSubject").value.trim();
            const message = document.getElementById("contactMessage").value.trim();

            if (
                name === "" ||
                email === "" ||
                subject === "" ||
                message === ""
            ) {
                alert("Please fill in all fields.");
                return;
            }

            alert("Your message has been sent successfully!");

            contactForm.reset();
        });
    }

    loadBookings();
    loadProviderDashboard();
    loadAdminDashboard();
});


/* OPEN DASHBOARD */
function openUserDashboard() {
    const role = localStorage.getItem("techserveRole");

    if (role === "customer") {
        showSection("dashboard");
        loadDashboard();
    } else if (role === "provider") {
        showSection("providerDashboard");
        loadProviderDashboard();
    } else if (role === "admin") {
        showSection("adminDashboard");
        loadAdminDashboard();
    } else {
        alert("Please login first.");
        showSection("login");
    }
}


/* LOGOUT */
function logoutUser() {
    localStorage.removeItem("techserveRole");
    localStorage.removeItem("techserveUserEmail");
    localStorage.removeItem("techserveUserName");

    showSection("login");
}


/* CUSTOMER DASHBOARD */
function loadDashboard() {
    const userName = localStorage.getItem("techserveUserName");
    const dashboardName = document.getElementById("dashboardName");

    if (dashboardName) {
        dashboardName.textContent = userName || "Customer";
    }

    loadBookings();
}


/* OPEN BOOKING */
function openBookingModal() {
    const role = localStorage.getItem("techserveRole");

    if (role !== "customer") {
        alert("Please login as a customer to create a booking.");
        showSection("login");
        return;
    }

    const modal = document.getElementById("bookingModal");

    if (modal) {
        modal.classList.add("active");
    }
}


/* CLOSE BOOKING */
function closeBookingModal() {
    const modal = document.getElementById("bookingModal");

    if (modal) {
        modal.classList.remove("active");
    }
}


/* CUSTOMER BOOKINGS */
function loadBookings() {
    const bookings = JSON.parse(
        localStorage.getItem("techserveBookings")
    ) || [];

    const total = document.getElementById("totalBookings");
    const pending = document.getElementById("pendingBookings");
    const accepted = document.getElementById("acceptedBookings");
    const completed = document.getElementById("completedBookings");
    const count = document.getElementById("bookingCount");
    const tableBody = document.getElementById("bookingTableBody");

    if (
        !total ||
        !pending ||
        !accepted ||
        !completed ||
        !count ||
        !tableBody
    ) {
        return;
    }

    const currentEmail = localStorage.getItem("techserveUserEmail");
    const role = localStorage.getItem("techserveRole");

    let customerBookings = [];

    if (role === "customer") {
        bookings.forEach(function (booking) {
            if (booking.customerEmail === currentEmail) {
                customerBookings.push(booking);
            }
        });
    }

    total.textContent = customerBookings.length;

    let pendingCount = 0;
    let acceptedCount = 0;
    let completedCount = 0;

    customerBookings.forEach(function (booking) {
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
    count.textContent = customerBookings.length + " Bookings";

    if (customerBookings.length === 0) {
        tableBody.innerHTML =
            '<tr><td colspan="6" class="empty-booking">No bookings available yet.</td></tr>';
        return;
    }

    tableBody.innerHTML = "";

    customerBookings.forEach(function (booking) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${booking.id}</td>
            <td>${booking.service}</td>
            <td>${booking.provider}</td>
            <td>${booking.date}</td>
            <td>${booking.time}</td>
            <td>
                <span class="status ${booking.status.toLowerCase()}">
                    ${booking.status}
                </span>
            </td>
        `;

        tableBody.appendChild(row);
    });
}


/* PROVIDER DASHBOARD */
function loadProviderDashboard() {
    const providerName = document.getElementById("providerName");
    const providerEmail = localStorage.getItem("techserveUserEmail");

    if (providerName) {
        if (providerEmail === "provider@gmail.com") {
            providerName.textContent = "Provider";
        } else {
            providerName.textContent =
                localStorage.getItem("techserveUserName") || "Provider";
        }
    }

    const bookings = JSON.parse(
        localStorage.getItem("techserveBookings")
    ) || [];

    const total = document.getElementById("providerTotalBookings");
    const pending = document.getElementById("providerPendingBookings");
    const accepted = document.getElementById("providerAcceptedBookings");
    const completed = document.getElementById("providerCompletedBookings");
    const count = document.getElementById("providerBookingCount");
    const tableBody = document.querySelector("#providerDashboard tbody");

    if (
        !total ||
        !pending ||
        !accepted ||
        !completed ||
        !count ||
        !tableBody
    ) {
        return;
    }

    total.textContent = bookings.length;

    let pendingCount = 0;
    let acceptedCount = 0;
    let completedCount = 0;

    bookings.forEach(function (booking) {
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
    count.textContent = bookings.length + " Requests";

    if (bookings.length === 0) {
        tableBody.innerHTML =
            '<tr><td colspan="7" class="empty-booking">No service requests available yet.</td></tr>';
        return;
    }

    tableBody.innerHTML = "";

    bookings.forEach(function (booking) {
        const row = document.createElement("tr");
        let actionButtons = "";

        if (booking.status === "Pending") {
            actionButtons = `
                <div class="request-action">
                    <button class="accept-btn" onclick="updateBookingStatus('${booking.id}', 'Accepted')">
                        Accept
                    </button>
                    <button class="reject-btn" onclick="updateBookingStatus('${booking.id}', 'Rejected')">
                        Reject
                    </button>
                </div>
            `;
        } else if (booking.status === "Accepted") {
            actionButtons = `
                <button class="complete-btn" onclick="updateBookingStatus('${booking.id}', 'Completed')">
                    Complete
                </button>
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
            <td>
                <span class="status ${booking.status.toLowerCase()}">
                    ${booking.status}
                </span>
            </td>
            <td>${actionButtons}</td>
        `;

        tableBody.appendChild(row);
    });
}


/* UPDATE BOOKING STATUS */
function updateBookingStatus(bookingId, newStatus) {
    let bookings = JSON.parse(
        localStorage.getItem("techserveBookings")
    ) || [];

    bookings.forEach(function (booking) {
        if (booking.id === bookingId) {
            booking.status = newStatus;
        }
    });

    localStorage.setItem(
        "techserveBookings",
        JSON.stringify(bookings)
    );

    loadProviderDashboard();
    loadBookings();
    loadAdminDashboard();

    alert("Booking status updated to " + newStatus + ".");
}


/* ADMIN DASHBOARD */
function loadAdminDashboard() {
    const adminName = document.getElementById("adminName");

    if (adminName) {
        adminName.textContent =
            localStorage.getItem("techserveUserName") || "Admin";
    }

    const bookings = JSON.parse(
        localStorage.getItem("techserveBookings")
    ) || [];

    const users = JSON.parse(
        localStorage.getItem("techserveUsers")
    ) || [];

    const totalCustomers = document.getElementById("adminTotalCustomers");
    const totalProviders = document.getElementById("adminTotalProviders");
    const totalBookings = document.getElementById("adminTotalBookings");
    const completedBookings = document.getElementById("adminCompletedBookings");

    const bookingCount = document.getElementById("adminBookingCount");
    const providerCount = document.getElementById("adminProviderCount");
    const customerCount = document.getElementById("adminCustomerCount");

    const bookingTable = document.getElementById("adminBookingTableBody");
    const providerTable = document.getElementById("adminProviderTableBody");
    const customerTable = document.getElementById("adminCustomerTableBody");

    if (
        !totalCustomers ||
        !totalProviders ||
        !totalBookings ||
        !completedBookings
    ) {
        return;
    }

    const registeredCustomers = users.filter(function (user) {
        return user.role === "customer";
    });

    const providers = [
        {
            name: "Ahmed Khan",
            service: "Web Developer",
            location: "Karachi, Pakistan",
            status: "Active"
        },
        {
            name: "Sara Malik",
            service: "Graphic Designer",
            location: "Lahore, Pakistan",
            status: "Active"
        },
        {
            name: "Usman Ali",
            service: "Mobile Developer",
            location: "Islamabad, Pakistan",
            status: "Active"
        },
        {
            name: "Hina Shah",
            service: "Digital Marketer",
            location: "Karachi, Pakistan",
            status: "Active"
        }
    ];

    let completed = 0;

    bookings.forEach(function (booking) {
        if (booking.status === "Completed") {
            completed++;
        }
    });

    totalCustomers.textContent = registeredCustomers.length;
    totalProviders.textContent = providers.length;
    totalBookings.textContent = bookings.length;
    completedBookings.textContent = completed;

    if (bookingCount) {
        bookingCount.textContent = bookings.length + " Bookings";
    }

    if (providerCount) {
        providerCount.textContent = providers.length + " Providers";
    }

    if (customerCount) {
        customerCount.textContent =
            registeredCustomers.length + " Customers";
    }

    if (bookingTable) {
        if (bookings.length === 0) {
            bookingTable.innerHTML =
                '<tr><td colspan="6" class="empty-booking">No bookings available yet.</td></tr>';
        } else {
            bookingTable.innerHTML = "";

            bookings.forEach(function (booking) {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${booking.id}</td>
                    <td>${booking.customer || "Customer"}</td>
                    <td>${booking.service}</td>
                    <td>${booking.provider}</td>
                    <td>${booking.date}</td>
                    <td>
                        <span class="status ${booking.status.toLowerCase()}">
                            ${booking.status}
                        </span>
                    </td>
                `;

                bookingTable.appendChild(row);
            });
        }
    }

    if (providerTable) {
        providerTable.innerHTML = "";

        providers.forEach(function (provider) {
            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${provider.name}</td>
                <td>${provider.service}</td>
                <td>${provider.location}</td>
                <td>
                    <span class="status accepted">
                        ${provider.status}
                    </span>
                </td>
            `;

            providerTable.appendChild(row);
        });
    }

    if (customerTable) {
        if (registeredCustomers.length === 0) {
            customerTable.innerHTML = `
                <tr>
                    <td>Customer</td>
                    <td>customer@gmail.com</td>
                    <td>Demo Customer</td>
                </tr>
            `;
        } else {
            customerTable.innerHTML = "";

            registeredCustomers.forEach(function (user) {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>Customer</td>
                `;

                customerTable.appendChild(row);
            });
        }
    }
}


/* PROVIDER PROFILE */
function openProviderProfile(
    name,
    service,
    location,
    experience,
    price
) {
    const profileName = document.getElementById("profileName");
    const profileService = document.getElementById("profileService");
    const profileLocation = document.getElementById("profileLocation");
    const profileExperience = document.getElementById("profileExperience");
    const profilePrice = document.getElementById("profilePrice");
    const modal = document.getElementById("providerProfileModal");

    if (profileName) {
        profileName.textContent = name;
    }

    if (profileService) {
        profileService.textContent = service;
    }

    if (profileLocation) {
        profileLocation.textContent = location;
    }

    if (profileExperience) {
        profileExperience.textContent = experience;
    }

    if (profilePrice) {
        profilePrice.textContent = price;
    }

    if (modal) {
        modal.classList.add("active");
    }
}


/* CLOSE PROVIDER PROFILE */
function closeProviderProfile() {
    const modal = document.getElementById("providerProfileModal");

    if (modal) {
        modal.classList.remove("active");
    }
}


/* BOOK FROM PROFILE */
function bookFromProfile() {
    const role = localStorage.getItem("techserveRole");

    if (role !== "customer") {
        closeProviderProfile();
        alert("Please login as a customer to book a service.");
        showSection("login");
        return;
    }

    const profileName = document.getElementById("profileName");
    const profileService = document.getElementById("profileService");
    const providerInput = document.getElementById("bookingProvider");
    const serviceSelect = document.getElementById("bookingService");

    if (profileName && providerInput) {
        providerInput.value = profileName.textContent;
    }

    if (profileService && serviceSelect) {
        const service = profileService.textContent;

        for (let i = 0; i < serviceSelect.options.length; i++) {
            if (serviceSelect.options[i].value === service) {
                serviceSelect.value = service;
                break;
            }
        }
    }

    closeProviderProfile();
    openBookingModal();
}


/* HOME */
function goToHome() {
    showSection("home");
}