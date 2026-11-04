// MOBILE MENU

function toggleMenu() {
    const menu = document.querySelector(".nav-links");

    if (menu) {
        menu.classList.toggle("show");
    }
}


// REGISTRATION FORM

const registrationForm =
    document.getElementById("registrationForm");

if (registrationForm) {

    registrationForm.addEventListener("submit", function(event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const dance =
            document.getElementById("dance").value;

        const message =
            document.getElementById("formMessage");


        if (name === "" ||
            email === "" ||
            phone === "" ||
            dance === "") {

            message.textContent =
                "Please fill in all required fields.";

            message.style.color = "red";

            return;
        }


        message.textContent =
            "Thank you, " + name +
            "! Your registration has been submitted successfully.";

        message.style.color = "green";


        registrationForm.reset();

    });
}


// IMAGE GALLERY EFFECT

const galleryImages =
    document.querySelectorAll(".gallery-item img");

galleryImages.forEach(function(image) {

    image.addEventListener("click", function() {

        alert("You clicked a dance gallery image!");

    });

});