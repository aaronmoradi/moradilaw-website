// js/script.js  (replace your current file with this)

/* --- keep browser scroll restoration manual and scroll to top on load --- */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

window.addEventListener('load', function() {
  // ensure we actually scroll to top; previous code used `top` which caused an error
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 0);
});

/* ------------------------------
   Custom carousel initializer (guarded)
   This only runs if your HTML contains .carousel-track (custom carousel).
   If you are using Bootstrap's carousel (the markup in index.html), this block will no-op.
   ------------------------------ */
(function initCustomCarousel() {
  const track = document.querySelector(".carousel-track");
  if (!track) return; // nothing to do for the custom carousel on pages that don't have it

  const slides = Array.from(track.children);
  const nextButton = document.querySelector(".carousel-button-right");
  const prevButton = document.querySelector(".carousel-button-left");
  const dotsNav = document.querySelector(".carousel-nav");
  const dots = dotsNav ? Array.from(dotsNav.children) : [];

  if (slides.length === 0) return;

  const slideWidth = slides[0].getBoundingClientRect().width;

  // arrange slides next to one another
  slides.forEach((slide, index) => {
    slide.style.left = slideWidth * index + "px";
  });

  const moveToSlide = (trackEl, currentSlide, targetSlide) => {
    if (!currentSlide || !targetSlide) return;
    trackEl.style.transform = "translateX(-" + targetSlide.style.left + ")";
    currentSlide.classList.remove("current-slide");
    targetSlide.classList.add("current-slide");
  };

  const updateDots = (currentDot, targetDot) => {
    if (currentDot) currentDot.classList.remove("current-slide");
    if (targetDot) targetDot.classList.add("current-slide");
  };

  // click right
  if (nextButton) {
    nextButton.addEventListener("click", () => {
      const currentSlide = track.querySelector(".current-slide") || slides[0];
      const nextSlide = currentSlide.nextElementSibling || slides[0];
      const currentDot = dotsNav ? dotsNav.querySelector(".current-slide") : null;
      const nextDot = currentDot ? (currentDot.nextElementSibling || dots[0]) : null;

      moveToSlide(track, currentSlide, nextSlide);
      if (dotsNav) updateDots(currentDot, nextDot);
    });
  }

  // click left
  if (prevButton) {
    prevButton.addEventListener("click", () => {
      const currentSlide = track.querySelector(".current-slide") || slides[0];
      const prevSlide = currentSlide.previousElementSibling || slides[slides.length - 1];
      const currentDot = dotsNav ? dotsNav.querySelector(".current-slide") : null;
      const prevDot = currentDot ? (currentDot.previousElementSibling || dots[dots.length - 1]) : null;

      moveToSlide(track, currentSlide, prevSlide);
      if (dotsNav) updateDots(currentDot, prevDot);
    });
  }

  // click nav dots
  if (dotsNav) {
    dotsNav.addEventListener("click", e => {
      const targetDot = e.target.closest("button");
      if (!targetDot) return;

      const currentSlide = track.querySelector(".current-slide") || slides[0];
      const currentDot = dotsNav.querySelector(".current-slide");
      const targetIndex = dots.findIndex(dot => dot === targetDot);
      const targetSlide = slides[targetIndex];

      moveToSlide(track, currentSlide, targetSlide);
      updateDots(currentDot, targetDot);
    });
  }
})();

/* ------------------------------
   Testimonial height locker
   Works with:
     - Bootstrap carousel (#testimonialCarousel .carousel-item)
     - Custom carousel (.carousel, .carousel-slide)
   It measures the tallest slide (via an off-DOM clone for accurate measurement)
   and sets the .carousel-inner (or .carousel) height to that value so the page never jumps.
   ------------------------------ */
(function lockTestimonialCarouselHeight() {
  function debounce(fn, wait = 100) {
    let t;
    return function() {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, arguments), wait);
    };
  }

  function getCarouselRoot() {
    // prefer the testimonial-specific carousel id if present
    return document.querySelector('#testimonialCarousel') || document.querySelector('.carousel');
  }

  function getInnerContainer(carouselRoot) {
    // Bootstrap uses .carousel-inner; custom may not
    return carouselRoot.querySelector('.carousel-inner') || carouselRoot;
  }

  function getSlides(inner) {
    return Array.from(inner.querySelectorAll('.carousel-item, .carousel-slide'));
  }

  function measureSlideHeight(slide) {
    // clone the slide off-screen to measure its "natural" height even if it's hidden
    const clone = slide.cloneNode(true);
    // keep the same width so wrapping is consistent
    clone.style.position = 'absolute';
    clone.style.visibility = 'hidden';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    // set width equal to the original slide width if it has a width
    const width = slide.getBoundingClientRect().width || slide.offsetWidth || slide.style.width;
    if (width) clone.style.width = width + 'px';
    clone.style.height = 'auto';
    document.body.appendChild(clone);
    const h = clone.offsetHeight;
    document.body.removeChild(clone);
    return h;
  }

  function recalc() {
    const carouselRoot = getCarouselRoot();
    if (!carouselRoot) return;
    const inner = getInnerContainer(carouselRoot);
    const slides = getSlides(inner);
    if (!slides.length) return;

    let max = 0;
    for (const s of slides) {
      max = Math.max(max, measureSlideHeight(s));
    }

    // set the inner container height and ensure slides fill 100%
    inner.style.height = max + 'px';
    inner.style.overflow = 'hidden';
    // optional smooth height transition
    inner.style.transition = inner.style.transition || 'height 0.3s ease';

    // also ensure each slide uses full height and is centered
    slides.forEach(s => {
      s.style.height = '100%';
      s.style.display = 'flex';
      s.style.alignItems = 'center';
      s.style.justifyContent = 'center';
    });
  }

  const debouncedRecalc = debounce(recalc, 120);

  // run after full load (images/fonts are ready)
  window.addEventListener('load', debouncedRecalc);
  // recalc on resize
  window.addEventListener('resize', debouncedRecalc);

  // Observe for content changes inside the carousel (in case testimonials are injected dynamically)
  const root = getCarouselRoot();
  if (root && window.MutationObserver) {
    const target = getInnerContainer(root);
    if (target) {
      const mo = new MutationObserver(debouncedRecalc);
      mo.observe(target, { childList: true, subtree: true, characterData: true });
    }
  }

  // If ResizeObserver is available, observe the carousel root (handles fonts/images changing layout)
  if (root && window.ResizeObserver) {
    try {
      const ro = new ResizeObserver(debouncedRecalc);
      ro.observe(root);
    } catch (e) {
      // ignore - just fallback to window resize
    }
  }
})();