
document.addEventListener("DOMContentLoaded", () => {
  // MENÚ PARA CELULAR
  const menuButton = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      navLinks.classList.toggle("open", !isOpen);
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menuButton.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("open");
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        menuButton.setAttribute("aria-expanded", "false");
        navLinks.classList.remove("open");
      }
    });
  }

  // ANIMACIONES AL DESPLAZARSE
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -35px 0px"
    });

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => {
      element.classList.add("visible");
    });
  }

  // EVITAR DOS VIDEOS REPRODUCIÉNDOSE A LA VEZ
  const videos = document.querySelectorAll("video");

  videos.forEach((video) => {
    video.addEventListener("play", () => {
      videos.forEach((otherVideo) => {
        if (otherVideo !== video) otherVideo.pause();
      });
    });
  });

  // GALERÍA INTERACTIVA DE HUESCA
  const gallery = document.querySelector(".huesca-gallery");

  if (gallery) {
    const buttons = gallery.querySelectorAll(".huesca-option");
    const image = gallery.querySelector("#huesca-active-image");
    const caption = gallery.querySelector("#huesca-active-caption");
    const viewer = gallery.querySelector(".huesca-viewer");

    function showMemory(button) {
      if (!image || !caption || !viewer) return;

      const src = button.dataset.src;
      const description = button.dataset.caption || button.textContent.trim();

      if (!src) return;

      // Actualizar botón seleccionado
      buttons.forEach((item) => {
        const selected = item === button;
        item.classList.toggle("active", selected);
        item.setAttribute("aria-pressed", String(selected));
      });

      // Actualizar texto y preparar la imagen nueva
      caption.textContent = description;
      image.alt = description;
      image.style.display = "block";
      viewer.classList.remove("image-missing");

      // Al cambiar src, se carga la foto correspondiente
      image.src = src;
    }

    if (image && caption && viewer) {
      image.addEventListener("load", () => {
        image.style.display = "block";
        viewer.classList.remove("image-missing");
      });

      image.addEventListener("error", () => {
        image.style.display = "none";
        viewer.classList.add("image-missing");
      });

      buttons.forEach((button) => {
        button.addEventListener("click", () => showMemory(button));
      });

      const initialButton =
        gallery.querySelector(".huesca-option.active") || buttons[0];

      if (initialButton) showMemory(initialButton);
    }
  }

  // LAS IMÁGENES QUE FALTEN CONSERVAN SU ESPACIO
  document.querySelectorAll("img").forEach((img) => {
    // La galería tiene su propio manejo de imágenes faltantes
    if (img.id === "huesca-active-image") return;

    function handleImageError() {
      img.style.display = "none";
      const container = img.parentElement;

      if (container) {
        container.classList.add(
          container.classList.contains("hero-photo")
            ? "photo-placeholder"
            : "empty-image"
        );

        const fallback = container.querySelector(
          ".image-fallback, .photo-placeholder-text"
        );

        if (fallback) fallback.style.display = "flex";
      }
    }

    img.addEventListener("error", handleImageError);

    if (img.complete && img.naturalWidth === 0) {
      handleImageError();
    }
  });

  console.log("Rafa & Gabi: una historia hecha con amor. ♡");
});
