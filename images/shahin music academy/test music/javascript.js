// =====================================================
// SHAHIN MUSIC ACADEMY
// SLIDESHOW + PAGE NAVIGATION
// =====================================================



// =====================================================
// HOME SLIDESHOW
// =====================================================

const slides = [

    "final home.png",

    "home 0.2.png",

    "home 0.1.png",

    "home 0.3.png",

    "home 0.4.png"

];


let currentSlide = 0;


const slideImage =
    document.getElementById("slideImage");


// Preload images

slides.forEach(function(imageName) {

    const img = new Image();

    img.src = imageName;

});


// Change slideshow

function changeSlide() {

    if (!slideImage) {
        return;
    }


    slideImage.classList.add("fade");


    setTimeout(function() {


        currentSlide++;


        if (
            currentSlide >= slides.length
        ) {

            currentSlide = 0;

        }


        slideImage.src =
            slides[currentSlide];


        slideImage.classList.remove("fade");


    }, 800);

}


// Start slideshow

setInterval(
    changeSlide,
    5000
);





// =====================================================
// PAGE NAVIGATION
// =====================================================


const menuLinks =
    document.querySelectorAll(
        "[data-section]"
    );


const sections =
    document.querySelectorAll(
        ".page-section"
    );



menuLinks.forEach(function(link) {


    link.addEventListener(
        "click",
        function(event) {


            event.preventDefault();


            const sectionName =
                link.dataset.section;


            // Hide every section

            sections.forEach(
                function(section) {

                    section.classList.remove(
                        "active-section"
                    );

                }
            );


            // Show selected section

            const selectedSection =
                document.getElementById(
                    sectionName
                );


            if (selectedSection) {

                selectedSection.classList.add(
                    "active-section"
                );

            }


            // Update active menu

            document
                .querySelectorAll(
                    ".navbar nav a"
                )
                .forEach(
                    function(navLink) {

                        navLink.classList.remove(
                            "active"
                        );

                    }
                );


            if (
                link.closest("nav")
            ) {

                link.classList.add(
                    "active"
                );

            }


            // Go to top

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });


        }
    );

});