
// keep scroll restoration behavior
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('load', function () {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 0);
});

/* --- Safe carousel init (only runs if your custom carousel exists) --- */
(function safeCarouselInit() {
  const track = document.querySelector(".carousel-track");
  if (!track) return; // nothing to do if custom carousel isn't in DOM

  try {
    const slides = Array.from(track.children);
    const nextButton = document.querySelector(".carousel-button-right");
    const prevButton = document.querySelector(".carousel-button-left");
    const dotsNav = document.querySelector(".carousel-nav");
    const dots = dotsNav ? Array.from(dotsNav.children) : [];

    if (!slides.length) return;
    const slideWidth = slides[0].getBoundingClientRect().width;
    slides.forEach((slide, index) => {
      slide.style.left = slideWidth * index + "px";
    });

    const carousel = document.querySelector(".carousel");
    if (carousel) {
      const maxHeight = Math.max(...slides.map(slide => slide.offsetHeight));
      carousel.style.height = maxHeight + "px";
    }

    const moveToSlide = (track, currentSlide, targetSlide) => {
      if (!targetSlide || !currentSlide) return;
      track.style.transform = "translateX(-" + targetSlide.style.left + ")";
      currentSlide.classList.remove("current-slide");
      targetSlide.classList.add("current-slide");
    };

    const updateDots = (currentDot, targetDot) => {
      if (currentDot) currentDot.classList.remove("current-slide");
      if (targetDot) targetDot.classList.add("current-slide");
    };

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        const currentSlide = track.querySelector(".current-slide") || slides[0];
        const nextSlide = currentSlide.nextElementSibling || slides[0];
        const currentDot = dotsNav ? dotsNav.querySelector(".current-slide") : null;
        const nextDot = currentDot ? currentDot.nextElementSibling || dots[0] : null;
        moveToSlide(track, currentSlide, nextSlide);
        updateDots(currentDot, nextDot);
      });
    }

    if (prevButton) {
      prevButton.addEventListener("click", () => {
        const currentSlide = track.querySelector(".current-slide") || slides[0];
        const prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1];
        const currentDot = dotsNav ? dotsNav.querySelector(".current-slide") : null;
        const prevDot = currentDot ? currentDot.previousElementSibling || dots[dots.length - 1] : null;
        moveToSlide(track, currentSlide, prevSlide);
        updateDots(currentDot, prevDot);
      });
    }

    if (dotsNav) {
      dotsNav.addEventListener("click", e => {
        const targetDot = e.target.closest("button");
        if (!targetDot) return;
        const currentSlide = track.querySelector(".current-slide") || slides[0];
        const currentDot = dotsNav.querySelector(".current-slide") || dots[0];
        const targetIndex = dots.findIndex(dot => dot === targetDot);
        const targetSlide = slides[targetIndex];
        moveToSlide(track, currentSlide, targetSlide);
        updateDots(currentDot, targetDot);
      });
    }
  } catch (err) {
    // fail gracefully
    console.warn("Carousel init skipped due to error:", err);
  }
})();

/* --- Custom translations (each language => array of typing phrases) --- */
const customTranslations = {
  en: [
    " Workers' Compensation",
    " Personal Injury",
    " Defense of the Uninsured Employer",
    " SIBTF"
  ],
  es: [
    "Compensación laboral",
    "Lesiones personales",
    "Defensa del empleador sin seguro",
    "SIBTF"
  ],
  fa: [
    "غرامت کارگران",
    "جراحت شخصی",
    "دفاع از کارفرمای بدون بیمه",
    "SIBTF"
  ]
};

/* --- Typing animation (controls .typing-header .text) --- */
let phrases = customTranslations.en.slice(); // current phrases (copy)
let textEl = null;
let cursorEl = null;
let currentPhrase = 0;
let currentChar = 0;
let isDeleting = false;
let typingTimer = null;

function tick() {
  if (!textEl) return;
  const full = phrases[currentPhrase] || "";
  if (!isDeleting) {
    // type forward
    textEl.textContent = full.substring(0, currentChar + 1);
    currentChar++;
    if (currentChar === full.length) {
      isDeleting = true;
      typingTimer = setTimeout(tick, 1500); // pause at end
      return;
    }
    typingTimer = setTimeout(tick, 100);
  } else {
    // delete
    if (currentChar > 0) {
      textEl.textContent = full.substring(0, currentChar - 1);
      currentChar--;
      typingTimer = setTimeout(tick, 50);
    } else {
      isDeleting = false;
      currentPhrase = (currentPhrase + 1) % phrases.length;
      typingTimer = setTimeout(tick, 300);
    }
  }
}

function startTyping() {
  clearTimeout(typingTimer);
  currentPhrase = 0;
  currentChar = 0;
  isDeleting = false;
  if (textEl) textEl.textContent = "";
  tick();
}

function resetTyping(newPhrases) {
  if (!Array.isArray(newPhrases) || newPhrases.length === 0) {
    newPhrases = customTranslations.en;
  }
  phrases = newPhrases.slice();
  startTyping();
}

/* --- Language change handler --- */
function changeLanguage(langCode) {
  if (!langCode) langCode = 'en';
  // Google may use values like "en", "es", "fa" — handle underscore variants too (e.g., en_US)
  if (customTranslations[langCode]) {
    resetTyping(customTranslations[langCode]);
  } else if (langCode.indexOf('_') > -1) {
    const short = langCode.split('_')[0];
    if (customTranslations[short]) resetTyping(customTranslations[short]);
    else resetTyping(customTranslations.en);
  } else {
    // fallback
    resetTyping(customTranslations.en);
  }
}

/* --- Wait for DOM and hook Google Translate select when available --- */
document.addEventListener("DOMContentLoaded", () => {
  textEl = document.querySelector('.typing-header .text');
  cursorEl = document.querySelector('.typing-header .cursor');

  // Start typing with default (English)
  if (textEl) startTyping();

  // If the google select is already present, hook it
  const attachSelect = (selectEl) => {
    if (!selectEl) return;
    // set initial language immediately
    changeLanguage(selectEl.value);
    selectEl.addEventListener('change', () => {
      changeLanguage(selectEl.value);
    });
  };

  // immediate check
  const immediate = document.querySelector('.goog-te-combo');
  if (immediate) attachSelect(immediate);

  // MutationObserver to detect when Google Translate injects its dropdown
  const observer = new MutationObserver((mutations, obs) => {
    const sel = document.querySelector('.goog-te-combo');
    if (sel) {
      attachSelect(sel);
      obs.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});

const attachSelect = (selectEl) => {
  if (!selectEl) return;
  console.log("Google Translate dropdown found:", selectEl.value);
  changeLanguage(selectEl.value);
  selectEl.addEventListener('change', () => {
    console.log("Language changed:", selectEl.value);
    changeLanguage(selectEl.value);
  });
};
