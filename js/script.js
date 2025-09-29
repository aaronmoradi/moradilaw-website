/* // tiny UX nicety: current year
document.getElementById('year').textContent = new Date().getFullYear(); */

if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

window.addEventListener('load', function() {
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
