document.addEventListener("DOMContentLoaded", () => {
  const toggler = document.querySelector(".navbar-toggler");
  const menu = document.querySelector("#navbarNav");
  const BP_MOBILE = 991;

  if (!toggler || !menu) return;

  // Prevent double initialization
  if (menu.dataset.navbarInitialized === "true") {
    console.log("Navbar already initialized");
    return;
  }
  menu.dataset.navbarInitialized = "true";

  const hasBootstrap = !!(window.bootstrap && window.bootstrap.Collapse);

  if (hasBootstrap) {
    // Bootstrap handles toggle automatically via data-bs-toggle
    // Just add click-outside functionality

    menu.addEventListener("show.bs.collapse", () => {
      toggler.setAttribute("aria-expanded", "true");
    });

    menu.addEventListener("hide.bs.collapse", () => {
      toggler.setAttribute("aria-expanded", "false");
    });

    // Close when clicking outside (mobile only)
    document.addEventListener("click", (e) => {
      if (window.innerWidth > BP_MOBILE) return;

      const clickedInside =
        menu.contains(e.target) || toggler.contains(e.target);

      if (!clickedInside && menu.classList.contains("show")) {
        const bsCollapse = bootstrap.Collapse.getInstance(menu);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  }
});
