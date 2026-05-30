import type { LinkPreviewRecord } from "./link-preview-shared";

type LinkPreviewState = {
  installed: boolean;
  overlay: HTMLDivElement | null;
  card: HTMLDivElement | null;
  mediaWrap: HTMLDivElement | null;
  media: HTMLImageElement | null;
  kind: HTMLElement | null;
  title: HTMLElement | null;
  source: HTMLElement | null;
  description: HTMLElement | null;
  url: HTMLElement | null;
  activeAnchor: HTMLAnchorElement | null;
  hideTimer: number | null;
  hoverTimer: number | null;
  longPressTimer: number | null;
  suppressClickTarget: HTMLAnchorElement | null;
  touchStart: { x: number; y: number; anchor: HTMLAnchorElement } | null;
  hoverBridge: {
    origin: { x: number; y: number };
    side: "left" | "right";
  } | null;
  previewByHref: Map<string, LinkPreviewRecord>;
};

declare global {
  interface Window {
    __webxsidLinkPreviewState?: LinkPreviewState;
  }
}

const LONG_PRESS_DELAY = 520;
const HOVER_DELAY = 240;
const MOVE_TOLERANCE = 10;
const HIDE_DELAY = 140;
const BRIDGE_HIDE_DELAY = 280;
const VIEWPORT_GUTTER = 12;
const MAX_CARD_WIDTH = 352;
const POINTER_OFFSET_X = 16;
const POINTER_OFFSET_Y = 18;

const getState = () => {
  const state = (window.__webxsidLinkPreviewState ??= {
    installed: false,
    overlay: null,
    card: null,
    mediaWrap: null,
    media: null,
    kind: null,
    title: null,
    source: null,
    description: null,
    url: null,
    activeAnchor: null,
    hideTimer: null,
    hoverTimer: null,
    longPressTimer: null,
    suppressClickTarget: null,
    touchStart: null,
    hoverBridge: null,
    previewByHref: new Map<string, LinkPreviewRecord>(),
  });

  return state;
};

const normalizePath = (path: string) => path.replace(/\/+$/, "") || "/";

const toPreviewKey = (href: string) => {
  try {
    const url = new URL(href, window.location.href);
    if (url.origin === window.location.origin) {
      return normalizePath(url.pathname);
    }

    return url.href;
  } catch {
    return null;
  }
};

const getYouTubeId = (url: URL) => {
  if (url.hostname.endsWith("youtu.be")) {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id ?? null;
  }

  if (url.pathname.includes("/shorts/")) {
    const id = url.pathname.split("/shorts/")[1]?.split("/")[0];
    return id ?? null;
  }

  if (url.pathname.includes("/embed/")) {
    const id = url.pathname.split("/embed/")[1]?.split("/")[0];
    return id ?? null;
  }

  return url.searchParams.get("v");
};

const classifyFallback = (href: string, anchorText: string) => {
  const url = new URL(href, window.location.href);
  const isYoutube =
    ["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtu.be"].includes(
      url.hostname,
    );
  const id = isYoutube ? getYouTubeId(url) : null;
  const source = url.hostname.replace(/^www\./, "");
  const displayUrl = `${source}${normalizePath(url.pathname) === "/" ? "" : normalizePath(url.pathname)}${url.search}`;

  if (isYoutube && id) {
    return {
      href: url.origin === window.location.origin ? normalizePath(url.pathname) : url.href,
      title: anchorText || "YouTube",
      origin: "YouTube",
      displayUrl,
      kind: "youtube" as const,
      image: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      siteName: "YouTube",
      isInternal: false,
    };
  }

  if (/\.(gif|gifv|png|jpe?g|webp|avif)$/i.test(url.pathname)) {
    return {
      href: url.origin === window.location.origin ? normalizePath(url.pathname) : url.href,
      title: anchorText || decodeURIComponent(url.pathname.split("/").filter(Boolean).at(-1) ?? source),
      origin: source,
      displayUrl,
      kind: "image" as const,
      image: url.href,
      siteName: source,
      isInternal: false,
    };
  }

  return {
    href: url.origin === window.location.origin ? normalizePath(url.pathname) : url.href,
    title: anchorText || decodeURIComponent(url.pathname.split("/").filter(Boolean).at(-1) ?? source),
    origin: source,
    displayUrl,
    kind: "generic" as const,
    siteName: source,
    isInternal: false,
  };
};

const ensureOverlay = (state: LinkPreviewState) => {
  if (state.overlay && document.body.contains(state.overlay)) {
    return state.overlay;
  }

  const overlay = document.createElement("div");
  overlay.setAttribute("data-link-preview-overlay", "true");
  overlay.setAttribute("aria-hidden", "true");
  overlay.style.visibility = "hidden";
  overlay.style.opacity = "0";
  overlay.style.pointerEvents = "none";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.zIndex = "90";
  overlay.style.transition = "opacity 150ms var(--ease-smooth)";
  overlay.innerHTML = `
    <div data-link-preview-card>
      <div data-link-preview-media hidden></div>
      <div data-link-preview-body>
        <div data-link-preview-row>
          <span data-link-preview-kind></span>
          <span data-link-preview-source></span>
        </div>
        <div data-link-preview-title></div>
        <div data-link-preview-description hidden></div>
        <div data-link-preview-url></div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  state.overlay = overlay;
  state.card = overlay.querySelector("[data-link-preview-card]") as HTMLDivElement | null;
  state.mediaWrap = overlay.querySelector("[data-link-preview-media]") as HTMLDivElement | null;
  state.media = null;
  state.kind = overlay.querySelector("[data-link-preview-kind]") as HTMLElement | null;
  state.title = overlay.querySelector("[data-link-preview-title]") as HTMLElement | null;
  state.source = overlay.querySelector("[data-link-preview-source]") as HTMLElement | null;
  state.description = overlay.querySelector("[data-link-preview-description]") as HTMLElement | null;
  state.url = overlay.querySelector("[data-link-preview-url]") as HTMLElement | null;

  return overlay;
};

const clearMedia = (state: LinkPreviewState) => {
  if (!state.mediaWrap) return;

  state.mediaWrap.hidden = true;
  state.mediaWrap.replaceChildren();
  state.media = null;
};

const buildMedia = (state: LinkPreviewState, target: LinkPreviewRecord) => {
  if (!state.mediaWrap) return;

  clearMedia(state);

  if (!target.image) {
    return;
  }

  const wrap = state.mediaWrap;
  wrap.hidden = false;

  const el = document.createElement("img");
  el.src = target.image;
  el.alt = "";
  el.loading = "eager";
  el.decoding = "async";
  el.referrerPolicy = "no-referrer";
  el.style.display = "block";
  el.style.width = "100%";
  el.style.height = "100%";
  el.style.objectFit = target.kind === "image" ? "contain" : "cover";
  el.style.background = "rgb(var(--bg))";
  el.addEventListener("error", () => {
    if (state.mediaWrap) {
      state.mediaWrap.hidden = true;
      state.mediaWrap.replaceChildren();
    }
  });

  wrap.appendChild(el);
  state.media = el;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const sign = (p1: { x: number; y: number }, p2: { x: number; y: number }, p3: { x: number; y: number }) =>
  (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);

const isPointInTriangle = (
  point: { x: number; y: number },
  a: { x: number; y: number },
  b: { x: number; y: number },
  c: { x: number; y: number },
) => {
  const d1 = sign(point, a, b);
  const d2 = sign(point, b, c);
  const d3 = sign(point, c, a);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
};

const populateOverlay = (state: LinkPreviewState, target: LinkPreviewRecord) => {
  if (!state.kind || !state.title || !state.source || !state.url || !state.description) return;

  state.kind.textContent =
    target.kind === "youtube"
      ? "YouTube"
      : target.kind === "image"
        ? "Media"
        : target.isInternal
          ? "Internal"
          : "External";
  state.title.textContent = target.title;
  state.source.textContent = target.siteName ?? target.origin;
  state.description.textContent = target.description?.trim() ?? "";
  state.description.hidden = !target.description?.trim();
  state.url.textContent = target.displayUrl;

  buildMedia(state, target);
};

const getPointerBridgeSide = (state: LinkPreviewState, point: { x: number; y: number }) => {
  if (!state.card) return "right" as const;

  const rect = state.card.getBoundingClientRect();
  return rect.left >= point.x ? "right" : "left";
};

const isPointInHoverCorridor = (state: LinkPreviewState, point: { x: number; y: number }) => {
  if (!state.card || !state.hoverBridge) return false;

  const rect = state.card.getBoundingClientRect();
  const { origin, side } = state.hoverBridge;
  const topLeft = { x: rect.left, y: rect.top };
  const bottomLeft = { x: rect.left, y: rect.bottom };
  const topRight = { x: rect.right, y: rect.top };
  const bottomRight = { x: rect.right, y: rect.bottom };

  if (side === "right") {
    return isPointInTriangle(point, origin, topLeft, bottomLeft);
  }

  return isPointInTriangle(point, origin, topRight, bottomRight);
};

const positionOverlayFromAnchor = (state: LinkPreviewState, anchor: HTMLAnchorElement) => {
  if (!state.card) return;

  const rect = anchor.getBoundingClientRect();
  const cardRect = state.card.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = rect.right + 14;
  if (left + cardRect.width > viewportWidth - VIEWPORT_GUTTER) {
    left = rect.left - cardRect.width - 14;
  }

  left = Math.max(VIEWPORT_GUTTER, Math.min(left, viewportWidth - cardRect.width - VIEWPORT_GUTTER));

  let top = rect.top + rect.height * 0.5 - cardRect.height * 0.5;
  top = Math.max(VIEWPORT_GUTTER, Math.min(top, viewportHeight - cardRect.height - VIEWPORT_GUTTER));

  state.card.style.left = `${Math.round(left)}px`;
  state.card.style.top = `${Math.round(top)}px`;
};

const positionOverlayFromPointer = (
  state: LinkPreviewState,
  point: { x: number; y: number },
) => {
  if (!state.card) return;

  const cardRect = state.card.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = point.x + POINTER_OFFSET_X;
  if (left + cardRect.width > viewportWidth - VIEWPORT_GUTTER) {
    left = point.x - cardRect.width - POINTER_OFFSET_X;
  }

  left = clamp(left, VIEWPORT_GUTTER, viewportWidth - cardRect.width - VIEWPORT_GUTTER);

  let top = point.y + POINTER_OFFSET_Y;
  if (top + cardRect.height > viewportHeight - VIEWPORT_GUTTER) {
    top = point.y - cardRect.height - POINTER_OFFSET_Y;
  }

  top = clamp(top, VIEWPORT_GUTTER, viewportHeight - cardRect.height - VIEWPORT_GUTTER);

  state.card.style.left = `${Math.round(left)}px`;
  state.card.style.top = `${Math.round(top)}px`;
};

const showPreview = (
  state: LinkPreviewState,
  target: LinkPreviewRecord,
  anchor: HTMLAnchorElement,
  pointer?: { x: number; y: number },
) => {
  const overlay = ensureOverlay(state);
  if (!state.card || !overlay) return;

  window.clearTimeout(state.hideTimer ?? undefined);
  state.hideTimer = null;
  state.activeAnchor = anchor;

  populateOverlay(state, target);

  overlay.style.visibility = "visible";
  overlay.style.opacity = "1";

  state.card.style.opacity = "0";
  state.card.style.transform = "translateY(4px)";
  state.card.style.position = "absolute";
  state.card.style.width = `min(${MAX_CARD_WIDTH}px, calc(100vw - ${VIEWPORT_GUTTER * 2}px))`;
  state.card.style.maxWidth = `min(${MAX_CARD_WIDTH}px, calc(100vw - ${VIEWPORT_GUTTER * 2}px))`;

  if (pointer) {
    positionOverlayFromPointer(state, pointer);
    state.hoverBridge = {
      origin: pointer,
      side: getPointerBridgeSide(state, pointer),
    };
  } else {
    positionOverlayFromAnchor(state, anchor);
    state.hoverBridge = null;
  }

  requestAnimationFrame(() => {
    if (!state.card) return;
    state.card.style.opacity = "1";
    state.card.style.transform = "translateY(0)";
  });
};

const hidePreview = (state: LinkPreviewState) => {
  if (!state.overlay) return;

  state.activeAnchor = null;
  state.hoverBridge = null;
  cancelHoverTimer(state);
  clearMedia(state);
  state.overlay.style.opacity = "0";

  window.setTimeout(() => {
    if (state.overlay) {
      state.overlay.style.visibility = "hidden";
    }
  }, HIDE_DELAY + 40);
};

const scheduleHide = (state: LinkPreviewState, delay = HIDE_DELAY) => {
  window.clearTimeout(state.hideTimer ?? undefined);
  state.hideTimer = window.setTimeout(() => hidePreview(state), delay);
};

const cancelHoverTimer = (state: LinkPreviewState) => {
  window.clearTimeout(state.hoverTimer ?? undefined);
  state.hoverTimer = null;
};

const cancelLongPress = (state: LinkPreviewState) => {
  window.clearTimeout(state.longPressTimer ?? undefined);
  state.longPressTimer = null;
  state.touchStart = null;
};

const getPreviewRecord = (state: LinkPreviewState, anchor: HTMLAnchorElement) => {
  const rawHref = anchor.getAttribute("href")?.trim();
  if (!rawHref || rawHref.startsWith("#") || rawHref.startsWith("mailto:") || rawHref.startsWith("tel:")) {
    return null;
  }

  const anchorText = anchor.textContent?.replace(/\s+/g, " ").trim() ?? "";

  try {
    const url = new URL(rawHref, window.location.href);
    if (url.origin === window.location.origin) {
      return null;
    }

    const key = toPreviewKey(rawHref);
    if (key) {
      const built = state.previewByHref.get(key);
      if (built) return built;
    }

    return classifyFallback(url.href, anchorText);
  } catch {
    return null;
  }
};

const bind = (state: LinkPreviewState) => {
  const overlay = ensureOverlay(state);
  if (!overlay) return;

  const onPointerOver = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;

    const target = event.target instanceof Element ? (event.target.closest("a[href]") as HTMLAnchorElement | null) : null;
    if (!target) return;

    const preview = getPreviewRecord(state, target);
    if (!preview) return;

    const related = event.relatedTarget instanceof Element ? event.relatedTarget : null;
    if (related && target.contains(related)) return;

    cancelHoverTimer(state);
    state.hoverTimer = window.setTimeout(() => {
      if (state.hoverTimer === null) return;
      state.hoverTimer = null;
      showPreview(state, preview, target, { x: event.clientX, y: event.clientY });
    }, HOVER_DELAY);
  };

  const onPointerOut = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;

    cancelHoverTimer(state);

    const cardTarget = event.target instanceof Element ? event.target.closest("[data-link-preview-card]") : null;
    if (cardTarget) {
      const related = event.relatedTarget instanceof Element ? event.relatedTarget : null;
      if (related && cardTarget.contains(related)) {
        return;
      }

      if (related && state.activeAnchor?.contains(related)) {
        return;
      }

      if (state.activeAnchor) {
        scheduleHide(state);
      }
      return;
    }

    const target = event.target instanceof Element ? (event.target.closest("a[href]") as HTMLAnchorElement | null) : null;
    if (!target) return;

    const related = event.relatedTarget instanceof Element ? event.relatedTarget : null;
    if (related && target.contains(related)) return;

    if (state.activeAnchor === target) {
      if (state.card) {
        state.hoverBridge = {
          origin: { x: event.clientX, y: event.clientY },
          side: getPointerBridgeSide(state, { x: event.clientX, y: event.clientY }),
        };
      }

      scheduleHide(state, BRIDGE_HIDE_DELAY);
    }
  };

  const onFocusIn = (event: FocusEvent) => {
    const target = event.target instanceof Element ? (event.target.closest("a[href]") as HTMLAnchorElement | null) : null;
    if (!target) return;

    const preview = getPreviewRecord(state, target);
    if (!preview) return;

    showPreview(state, preview, target);
  };

  const onFocusOut = (event: FocusEvent) => {
    const target = event.target instanceof Element ? (event.target.closest("a[href]") as HTMLAnchorElement | null) : null;
    if (!target) return;

    const next = event.relatedTarget instanceof Element ? event.relatedTarget : null;
    if (next && target.contains(next)) return;

    if (state.activeAnchor === target) {
      scheduleHide(state);
    }
  };

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType !== "touch") return;

    const target = event.target instanceof Element ? (event.target.closest("a[href]") as HTMLAnchorElement | null) : null;
    if (!target) return;

    const preview = getPreviewRecord(state, target);
    if (!preview) return;

    cancelHoverTimer(state);
    cancelLongPress(state);
    state.touchStart = { x: event.clientX, y: event.clientY, anchor: target };
    state.longPressTimer = window.setTimeout(() => {
      showPreview(state, preview, target);
      state.suppressClickTarget = target;
    }, LONG_PRESS_DELAY);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "touch" || !state.touchStart) return;

    const deltaX = Math.abs(event.clientX - state.touchStart.x);
    const deltaY = Math.abs(event.clientY - state.touchStart.y);
    if (deltaX > MOVE_TOLERANCE || deltaY > MOVE_TOLERANCE) {
      cancelLongPress(state);
    }
  };

  const onHoverPointerMove = (event: PointerEvent) => {
    if (event.pointerType === "touch" || !state.activeAnchor || !state.hoverBridge) return;

    const point = { x: event.clientX, y: event.clientY };
    const overCard = event.target instanceof Element && !!event.target.closest("[data-link-preview-card]");

    if (isPointInHoverCorridor(state, point)) {
      window.clearTimeout(state.hideTimer ?? undefined);
      state.hideTimer = null;
      return;
    }

    if (!overCard) {
      scheduleHide(state);
    }
  };

  const onPointerUp = () => {
    if (state.longPressTimer !== null) {
      window.clearTimeout(state.longPressTimer);
      state.longPressTimer = null;
    }
    state.touchStart = null;
  };

  const onClick = (event: MouseEvent) => {
    const target = event.target instanceof Element ? (event.target.closest("a[href]") as HTMLAnchorElement | null) : null;
    if (!target) return;

    if (state.suppressClickTarget === target) {
      event.preventDefault();
      event.stopPropagation();
      state.suppressClickTarget = null;
    }
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape") {
      state.suppressClickTarget = null;
      cancelHoverTimer(state);
      cancelLongPress(state);
      hidePreview(state);
    }
  };

  const onScroll = () => {
    if (state.activeAnchor) {
      hidePreview(state);
    }
  };

  const onPageLoad = () => {
    ensureOverlay(state);
    cancelHoverTimer(state);
    hidePreview(state);
  };

  document.addEventListener("pointerover", onPointerOver, true);
  document.addEventListener("pointerout", onPointerOut, true);
  document.addEventListener("focusin", onFocusIn, true);
  document.addEventListener("focusout", onFocusOut, true);
  document.addEventListener("pointerdown", onPointerDown, true);
  document.addEventListener("pointermove", onPointerMove, true);
  document.addEventListener("pointermove", onHoverPointerMove, true);
  document.addEventListener("pointerup", onPointerUp, true);
  document.addEventListener("pointercancel", onPointerUp, true);
  document.addEventListener("click", onClick, true);
  document.addEventListener("keydown", onKeyDown, true);
  document.addEventListener("astro:page-load", onPageLoad);
  document.addEventListener("astro:after-swap", onPageLoad);
  window.addEventListener("scroll", onScroll, { passive: true, capture: true });
  window.addEventListener("resize", onScroll, { passive: true });
};

export function installLinkPreviewController(previewLinks: LinkPreviewRecord[] = []) {
  if (typeof window === "undefined") return;

  const state = getState();
  state.previewByHref = new Map(
    previewLinks.map((item) => {
      const key = item.isInternal ? normalizePath(item.href) : item.href;
      return [key, item];
    }),
  );

  if (state.installed) {
    ensureOverlay(state);
    return;
  }

  state.installed = true;
  bind(state);
}
