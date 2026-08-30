 
const viewProfile = document.querySelectorAll(".view-profile");

viewProfile.forEach(function (button) {
    button.addEventListener("click", function () {
        const card = button.closest(".provider-card");

        const provider = {
            name: card.querySelector("h3").textContent.trim(),
            service: card.querySelector(".service-tag").textContent.trim(),
            location: card.querySelector(".provider-location").textContent.trim(),
            experience: card.querySelector(".experience").textContent.trim(),
            price: card.querySelector(".provider-footer strong").textContent.trim(),
            rating: card.querySelector(".rating").textContent.trim()
        };

        localStorage.setItem("selectedProvider", JSON.stringify(provider));
    });
});

