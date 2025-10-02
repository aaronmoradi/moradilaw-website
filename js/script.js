if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('load', function () {
  setTimeout(() => {
    window.scrollTo(top); // negative values aren't needed
  }, 0);
});

const track = document.querySelector(".carousel-track");
const slides = Array.from(track.children);
const nextButton = document.querySelector(".carousel-button-right");
const prevButton = document.querySelector(".carousel-button-left");
const dotsNav = document.querySelector(".carousel-nav");
const dots = Array.from(dotsNav.children);

const slideWidth = slides[0].getBoundingClientRect().width;

// arrange slides next to one another
slides.forEach((slide, index) => {
  slide.style.left = slideWidth * index + "px";
});

// lock carousel container height to tallest slide
const carousel = document.querySelector(".carousel");
const maxHeight = Math.max(...slides.map(slide => slide.offsetHeight));
carousel.style.height = maxHeight + "px";

const moveToSlide = (track, currentSlide, targetSlide) => {
  track.style.transform = "translateX(-" + targetSlide.style.left + ")";
  currentSlide.classList.remove("current-slide");
  targetSlide.classList.add("current-slide");
};

const updateDots = (currentDot, targetDot) => {
  currentDot.classList.remove("current-slide");
  targetDot.classList.add("current-slide");
};

// click right
nextButton.addEventListener("click", () => {
  const currentSlide = track.querySelector(".current-slide");
  const nextSlide = currentSlide.nextElementSibling || slides[0];
  const currentDot = dotsNav.querySelector(".current-slide");
  const nextDot = currentDot.nextElementSibling || dots[0];

  moveToSlide(track, currentSlide, nextSlide);
  updateDots(currentDot, nextDot);
});

// click left
prevButton.addEventListener("click", () => {
  const currentSlide = track.querySelector(".current-slide");
  const prevSlide =
    currentSlide.previousElementSibling || slides[slides.length - 1];
  const currentDot = dotsNav.querySelector(".current-slide");
  const prevDot = currentDot.previousElementSibling || dots[dots.length - 1];

  moveToSlide(track, currentSlide, prevSlide);
  updateDots(currentDot, prevDot);
});

// click nav dots
dotsNav.addEventListener("click", e => {
  const targetDot = e.target.closest("button");
  if (!targetDot) return;

  const currentSlide = track.querySelector(".current-slide");
  const currentDot = dotsNav.querySelector(".current-slide");
  const targetIndex = dots.findIndex(dot => dot === targetDot);
  const targetSlide = slides[targetIndex];

  moveToSlide(track, currentSlide, targetSlide);
  updateDots(currentDot, targetDot);
});

const customTranslations = {
  es: [
    " CDMX",
    " HOLA",
    " Gracias",
    " No!"
  ],
  fa: [
    " IRAN",
    " PERSIA",
    " SMH",
    " AHHH"
  ]
};

function setCustomTranslation() {
  // Find the current Google Translate language
  const select = document.querySelector(".goog-te-combo");
  if (!select) return;

  const lang = select.value; // e.g. "es", "fa", "en"
  const h1 = document.getElementById("custom-translate");

  if (customTranslations[lang]) {
    h1.innerText = customTranslations[lang];
  } else {
    h1.innerText = customTranslations["en"]; // fallback to English
  }
}

// Attach listener once Google Translate is ready
document.addEventListener("DOMContentLoaded", function () {
  // MutationObserver to detect dropdown being added by Google
  const observer = new MutationObserver(() => {
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.addEventListener("change", setCustomTranslation);
      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
