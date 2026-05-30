let restoreQueued = false;
let initialized = false;

const restoreActiveRailPosition = () => {
  const rails = document.querySelectorAll("[data-rail-scroll]");

  rails.forEach((rail) => {
    if (!(rail instanceof HTMLElement)) return;

    const activeItem = rail.querySelector('[aria-current="page"]');
    if (!(activeItem instanceof HTMLElement)) return;

    const mode = rail.getAttribute("data-rail-mode");
    const container = rail.matches("[data-rail-scroll-container]")
      ? rail
      : rail.querySelector("[data-rail-scroll-container]");

    if (!(container instanceof HTMLElement)) return;

    if (mode === "dock") {
      const activeRect = activeItem.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      const activeRectEnd = activeRect.left + activeRect.width;
      const containerStart = containerRect.left;
      const containerEnd = containerRect.left + containerRect.width;

      const isActiveItemFullyVisible =
        activeRect.left >= containerStart && activeRectEnd <= containerEnd;

      if (!isActiveItemFullyVisible) {
        container.scrollBy({
          left:
            activeRect.left -
            containerStart -
            (containerRect.width - activeRect.width) / 2,
          behavior: "auto",
        });
      }

      return;
    }

    activeItem.scrollIntoView({
      block: "nearest",
      inline: "center",
      behavior: "auto",
    });
  });
};

const scheduleRestore = () => {
  if (restoreQueued) return;
  restoreQueued = true;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      restoreQueued = false;
      restoreActiveRailPosition();
    });
  });
};

export const setupRailRestore = () => {
  if (typeof document === "undefined" || initialized) return;

  initialized = true;

  const onPageLoad = () => {
    scheduleRestore();
  };

  const onLoad = () => {
    scheduleRestore();
  };

  const onPageShow = () => {
    scheduleRestore();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onPageLoad, { once: true });
  } else {
    scheduleRestore();
  }

  document.addEventListener("astro:page-load", onPageLoad);
  document.addEventListener("astro:after-swap", onPageLoad);
  window.addEventListener("load", onLoad);
  window.addEventListener("pageshow", onPageShow);
};
