/* ============================================
   ASTRA INC. — main.js
   Vanilla JS only. No modules, no npm deps.
   Every init wrapped in safe() so one failure
   never breaks the rest of the page.
   ============================================ */
(function () {
  "use strict";

  function safe(fn, name) {
    try { fn(); } catch (err) {
      console.error("[astra] init failed: " + name, err);
    }
  }

  /* ---------- Splash ---------- */
  function initSplash() {
    var splash = document.getElementById("splash");
    if (!splash) return;
    document.body.classList.add("no-scroll");
    function hide() {
      splash.style.display = "none";
      document.body.classList.remove("no-scroll");
    }
    window.addEventListener("load", function () { setTimeout(hide, 400); });
    setTimeout(hide, 2600); // hard safety net even if load never fires
  }

  /* ---------- Sticky header ---------- */
  function initHeader() {
    var header = document.getElementById("site-header");
    if (!header) return;
    function onScroll() {
      if (window.scrollY > 40) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav ---------- */
  function initMobileNav() {
    var toggle = document.getElementById("nav-toggle");
    var nav = document.getElementById("mobile-nav");
    if (!toggle || !nav) return;
    function close() {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("no-scroll");
    }
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.classList.toggle("no-scroll", isOpen);
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", close);
    });
  }

  /* ---------- Scroll reveal ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!items.length) return;

    if (!("IntersectionObserver" in window)) return; // stays visible via base CSS

    items.forEach(function (el) { el.classList.add("reveal-init"); });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px -40px 0px" });

    items.forEach(function (el) { observer.observe(el); });

    // Safety net: force-reveal anything still hidden after 6s
    setTimeout(function () {
      document.querySelectorAll(".reveal-init:not(.reveal-visible)").forEach(function (el) {
        el.classList.add("reveal-visible");
      });
    }, 6000);
  }

  /* ---------- Hero parallax ---------- */
  function initParallax() {
    var img = document.getElementById("hero-img");
    var hero = document.getElementById("hero");
    if (!img || !hero) return;
    var ticking = false;
    function update() {
      var rect = hero.getBoundingClientRect();
      var offset = Math.min(Math.max(rect.top, -rect.height), rect.height);
      img.style.transform = "translateY(" + (offset * 0.18) + "px)";
      ticking = false;
    }
    window.addEventListener("scroll", function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- Animated counters ---------- */
  function initCounters() {
    var nums = document.querySelectorAll(".stat-num");
    if (!nums.length || !("IntersectionObserver" in window)) return;

    function animate(el) {
      var target = parseFloat(el.getAttribute("data-count")) || 0;
      var start = 0;
      var duration = 1400;
      var startTime = null;
      function step(ts) {
        if (!startTime) startTime = ts;
        var progress = Math.min((ts - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(start + (target - start) * eased);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    nums.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- Timeline progress line ---------- */
  function initTimeline() {
    var section = document.getElementById("proceso");
    var bar = document.getElementById("timeline-progress");
    if (!section || !bar || !("IntersectionObserver" in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          bar.style.width = "100%";
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    observer.observe(section);
  }

  /* ---------- Project filter ---------- */
  function initFilters() {
    var buttons = document.querySelectorAll(".filter-btn");
    var cards = document.querySelectorAll(".project-card");
    if (!buttons.length || !cards.length) return;

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var filter = btn.getAttribute("data-filter");
        cards.forEach(function (card) {
          var match = filter === "all" || card.getAttribute("data-category") === filter;
          card.classList.toggle("is-hidden", !match);
        });
      });
    });
  }

  /* ---------- Project modal ---------- */
  function initModal() {
    var modal = document.getElementById("project-modal");
    var cards = document.querySelectorAll(".project-card");
    if (!modal || !cards.length) return;

    var img = document.getElementById("modal-img");
    var tag = document.getElementById("modal-tag");
    var title = document.getElementById("modal-title");
    var loc = document.getElementById("modal-loc");
    var desc = document.getElementById("modal-desc");

    function open(card) {
      img.src = card.getAttribute("data-img");
      img.alt = card.getAttribute("data-title") || "";
      tag.textContent = card.querySelector(".tag") ? card.querySelector(".tag").textContent : "Proyecto";
      title.textContent = card.getAttribute("data-title") || "";
      loc.textContent = card.getAttribute("data-loc") || "";
      desc.textContent = card.getAttribute("data-desc") || "";
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("no-scroll");
    }
    function close() {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("no-scroll");
    }

    cards.forEach(function (card) {
      card.addEventListener("click", function () { open(card); });
      card.addEventListener("keypress", function (e) {
        if (e.key === "Enter") open(card);
      });
    });
    modal.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", close);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- Testimonial carousel ---------- */
  function initTestimonials() {
    var track = document.getElementById("testimonial-track");
    var dotsWrap = document.getElementById("testimonial-dots");
    var prevBtn = document.getElementById("t-prev");
    var nextBtn = document.getElementById("t-next");
    if (!track || !dotsWrap) return;

    var slides = track.querySelectorAll(".testimonial-slide");
    if (!slides.length) return;

    // Idempotent mount: don't rebuild dots if already present
    if (dotsWrap.children.length === 0) {
      slides.forEach(function (_, i) {
        var dot = document.createElement("button");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", function () { goTo(i); });
        dotsWrap.appendChild(dot);
      });
    }

    var dots = dotsWrap.querySelectorAll("button");
    var index = 0;
    var autoplay;

    function render() {
      track.style.transform = "translateX(-" + (index * 100) + "%)";
      dots.forEach(function (d, i) { d.classList.toggle("active", i === index); });
    }
    function goTo(i) {
      index = (i + slides.length) % slides.length;
      render();
      restartAutoplay();
    }
    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function restartAutoplay() {
      clearInterval(autoplay);
      autoplay = setInterval(next, 6000);
    }

    if (nextBtn) nextBtn.addEventListener("click", next);
    if (prevBtn) prevBtn.addEventListener("click", prev);

    // basic swipe support
    var startX = null;
    track.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 40) { delta < 0 ? next() : prev(); }
      startX = null;
    }, { passive: true });

    var wrap = track.closest(".testimonial-wrap");
    if (wrap) {
      wrap.addEventListener("mouseenter", function () { clearInterval(autoplay); });
      wrap.addEventListener("mouseleave", restartAutoplay);
    }

    render();
    restartAutoplay();
  }

  /* ---------- Contact form ---------- */
  function initForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var success = document.getElementById("form-success");

    function validateField(field) {
      var input = field.querySelector("input, textarea");
      if (!input) return true;
      var valid = input.checkValidity();
      field.classList.toggle("invalid", !valid);
      return valid;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = form.querySelectorAll(".field");
      var allValid = true;
      fields.forEach(function (field) {
        var input = field.querySelector("input[required], textarea[required]");
        if (input && !validateField(field)) allValid = false;
      });
      if (!allValid) return;

      // No backend is wired yet — this is a static site.
      // Connect this to Hostinger's form handler, Formspree, or your own endpoint.
      success.classList.add("visible");
      form.reset();
      setTimeout(function () { success.classList.remove("visible"); }, 6000);
    });

    form.querySelectorAll("input[required], textarea[required]").forEach(function (input) {
      input.addEventListener("blur", function () { validateField(input.closest(".field")); });
    });
  }

  /* ---------- Footer year ---------- */
  function initYear() {
    var el = document.getElementById("year");
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    safe(initSplash, "splash");
    safe(initHeader, "header");
    safe(initMobileNav, "mobileNav");
    safe(initReveal, "reveal");
    safe(initParallax, "parallax");
    safe(initCounters, "counters");
    safe(initTimeline, "timeline");
    safe(initFilters, "filters");
    safe(initModal, "modal");
    safe(initTestimonials, "testimonials");
    safe(initForm, "form");
    safe(initYear, "year");
  });
})();
