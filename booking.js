
const bookingForm = document.getElementById("bookingForm");
const bookingSuccess = document.getElementById("bookingSuccess");
const bookingId = document.getElementById("bookingId");

bookingForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const service = document.getElementById("service").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    const location = document.getElementById("location").value.trim();
    const description = document.getElementById("description").value.trim();

    if (service === "") {
        alert("Please select a service");
    } else if (date === "") {
        alert("Please select a date");
    } else if (time === "") {
        alert("Please select a time");
    } else if (location === "") {
        alert("Please enter your location");
    } else if (description === "") {
        alert("Please describe the service");
    } else {
        const id = "TS" + Date.now();

        const booking = {
            id: id,
            service: service,
            date: date,
            time: time,
            location: location,
            description: description,
            status: "Pending"
        };

        localStorage.setItem("booking", JSON.stringify(booking));

        bookingForm.style.display = "none";
        bookingSuccess.style.display = "block";
        bookingId.textContent = id;
    }
});

