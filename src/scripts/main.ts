/**
 * SEI — global client behaviour.
 * Progressive enhancement only: everything still works without JS.
 */

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

/* ------------------------------------------------------------------ */
/* Sticky header state                                                  */
/* ------------------------------------------------------------------ */

const header = document.querySelector<HTMLElement>("[data-header]");
if (header) {
  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/* ------------------------------------------------------------------ */
/* Mobile navigation                                                    */
/* ------------------------------------------------------------------ */

const menuButton =
  document.querySelector<HTMLButtonElement>("[data-menu-button]");
const menu = document.querySelector<HTMLElement>("[data-menu]");
const menuLinks = menu?.querySelectorAll<HTMLAnchorElement>("a[href]");

function setMenu(open: boolean) {
  if (!menuButton || !menu) return;
  menuButton.setAttribute("aria-expanded", String(open));
  menu.classList.toggle("is-open", open);
  document.body.classList.toggle("no-scroll", open);
}

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  setMenu(open);
});

menuLinks?.forEach((link) =>
  link.addEventListener("click", () => setMenu(false)),
);

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") setMenu(false);
});

if (menuButton && menu) {
  const onResize = () => {
    if (window.innerWidth >= 960) setMenu(false);
  };
  window.addEventListener("resize", onResize);
}

/* ------------------------------------------------------------------ */
/* Reveal on scroll (subtle, reduced-motion aware)                      */
/* ------------------------------------------------------------------ */

const reveals = document.querySelectorAll<HTMLElement>(".reveal");

if (!reducedMotion && "IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: "0px 0px -48px 0px" },
  );
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("is-visible"));
}

/* ------------------------------------------------------------------ */
/* Committee search                                                     */
/* ------------------------------------------------------------------ */

const searchInputs =
  document.querySelectorAll<HTMLInputElement>("[data-search]");
searchInputs.forEach((input) => {
  const target = document.querySelector<HTMLElement>(
    input.dataset.target || "",
  );
  if (!target) return;

  const members = Array.from(
    target.querySelectorAll<HTMLElement>("[data-member]"),
  );
  const groups = Array.from(
    target.querySelectorAll<HTMLElement>("[data-group]"),
  );
  const empty = target.querySelector<HTMLElement>("[data-search-empty]");
  const count = target.querySelector<HTMLElement>("[data-search-count]");

  const apply = () => {
    const q = input.value.trim().toLowerCase();
    let visible = 0;

    for (const el of members) {
      const hay = el.dataset.search || "";
      const show = !q || hay.includes(q);
      el.hidden = !show;
      if (show) visible += 1;
    }

    for (const group of groups) {
      const any = Array.from(
        group.querySelectorAll<HTMLElement>("[data-member]"),
      ).some((el) => !el.hidden);
      group.hidden = !any;
    }

    if (empty) empty.hidden = visible > 0;
    if (count) {
      count.textContent = `${visible} de ${members.length}`;
    }
  };

  input.addEventListener("input", apply);
  apply();
});

/* ------------------------------------------------------------------ */
/* Photo gallery lightbox (native <dialog>)                             */
/* ------------------------------------------------------------------ */

const gallery = document.querySelector<HTMLElement>("[data-gallery]");
const dialog = document.querySelector<HTMLDialogElement>("[data-lightbox]");

if (gallery && dialog) {
  const image = dialog.querySelector<HTMLImageElement>("img");
  const caption = dialog.querySelector<HTMLElement>("[data-lightbox-caption]");
  const close = dialog.querySelector<HTMLButtonElement>(
    "[data-lightbox-close]",
  );

  gallery.addEventListener("click", (e) => {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>(
      "[data-lightbox-open]",
    );
    if (!button) return;
    const src = button.dataset.src;
    const alt = button.dataset.alt || "";
    const cap = button.dataset.caption || alt;
    if (!src || !image) return;

    image.src = src;
    image.alt = alt;
    if (caption) caption.textContent = cap;
    if (dialog.open) return;
    dialog.showModal();
  });

  close?.addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.close();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && dialog.open) dialog.close();
  });
}
