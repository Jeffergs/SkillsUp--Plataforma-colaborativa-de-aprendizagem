document.addEventListener("DOMContentLoaded", () => {
  // ====================== CAROUSEL + BARRA DE PROGRESSO ======================
  (function initCarousel() {
    const el = document.querySelector("#heroCarousel");
    const bar = document.querySelector(".carousel-progress-bar");

    if (!el || !bar) return;

    if (!window.bootstrap || !window.bootstrap.Carousel) {
      console.warn(
        "Bootstrap Carousel não detectado — pulando inicialização do carousel."
      );
      return;
    }

    const tempo = Number(el.getAttribute("data-bs-interval")) || 12000;
    const carousel = window.bootstrap.Carousel.getOrCreateInstance(el, {
      interval: false,
      ride: false,
      pause: false,
      wrap: true,
      touch: true,
    });

    let timerId = null;

    function animateBar() {
      bar.style.transition = "none";
      bar.style.width = "0%";
      /* force reflow */
      void bar.offsetHeight;
      bar.style.transition = `width ${tempo}ms linear`;
      bar.style.width = "100%";
    }

    function startCycle() {
      animateBar();
      if (timerId) clearInterval(timerId);
      timerId = setInterval(() => {
        carousel.next();
        animateBar();
      }, tempo);
    }

    el.querySelectorAll(
      ".carousel-control-prev, .carousel-control-next"
    ).forEach((btn) => {
      btn.addEventListener("click", () => {
        setTimeout(startCycle, 50);
      });
    });

    startCycle();
  })();
}); // end DOMContentLoaded
