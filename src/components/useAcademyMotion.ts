import { useEffect, type RefObject } from 'react';

type KineticLine = { container: HTMLElement; words: HTMLElement[] };
const clamp = (number: number, min: number, max: number) => Math.min(max, Math.max(min, number));

/**
 * Isolated scroll choreography for /academy.
 * Uses native browser APIs: no CDN, paid service, tracking, or motion runtime.
 * Elements are visible by default until the observer is installed.
 */
export function useAcademyMotion(rootRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const pointerFine = window.matchMedia('(pointer: fine)');
    const compact = window.matchMedia('(max-width: 820px)');
    const hero = root.querySelector<HTMLElement>('.academy-hero');
    const preview = root.querySelector<HTMLElement>('.academy-preview-shell');
    const glow = root.querySelector<HTMLElement>('.academy-hero-glow');
    const progressTrack = root.querySelector<HTMLElement>('[data-scroll-progress]');
    const kinetic: KineticLine[] = [...root.querySelectorAll<HTMLElement>('[data-kinetic]')]
      .map(container => ({
        container,
        words: [...container.querySelectorAll<HTMLElement>('.academy-kinetic-word')]
      }));

    let observer: IntersectionObserver | null = null;
    let frame = 0;
    let enabled = false;
    let pointerCard: HTMLElement | null = null;
    let pointerFrame = 0;
    let pointerPoint: { x: number; y: number } | null = null;

    const clearPointer = () => {
      if (pointerCard) {
        pointerCard.style.removeProperty('--academy-rx');
        pointerCard.style.removeProperty('--academy-ry');
        pointerCard.style.removeProperty('--academy-x');
        pointerCard.style.removeProperty('--academy-y');
      }
      pointerCard = null;
      pointerPoint = null;
    };

    const paintPointer = () => {
      pointerFrame = 0;
      if (!pointerCard || !pointerPoint || !enabled) return;
      const rect = pointerCard.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = clamp((pointerPoint.x - rect.left) / rect.width, 0, 1);
      const y = clamp((pointerPoint.y - rect.top) / rect.height, 0, 1);
      pointerCard.style.setProperty('--academy-rx', ((0.5 - y) * 6).toFixed(2) + 'deg');
      pointerCard.style.setProperty('--academy-ry', ((x - 0.5) * 6).toFixed(2) + 'deg');
      pointerCard.style.setProperty('--academy-x', (x * 100).toFixed(2) + '%');
      pointerCard.style.setProperty('--academy-y', (y * 100).toFixed(2) + '%');
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!enabled || !pointerFine.matches || event.pointerType === 'touch') return;
      const target = event.target;
      const card = target instanceof Element
        ? target.closest<HTMLElement>('.academy-module-card, .academy-plan-card') : null;
      if (pointerCard !== card) clearPointer();
      pointerCard = card;
      pointerPoint = card ? { x: event.clientX, y: event.clientY } : null;
      if (card && !pointerFrame) pointerFrame = requestAnimationFrame(paintPointer);
    };

    const onPointerOut = (event: PointerEvent) => {
      if (!pointerCard || !(event.target instanceof Node)) return;
      if (!pointerCard.contains(event.relatedTarget as Node | null)) clearPointer();
    };

    const update = () => {
      frame = 0;
      if (!enabled || !root.isConnected) return;

      const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      if (progressTrack) {
        progressTrack.style.transform = 'scaleX(' + clamp(window.scrollY / total, 0, 1).toFixed(4) + ')';
      }

      if (preview) {
        // On phones the preview must remain in document flow, upright and
        // never overlap the following section when scrolling.
        if (compact.matches) preview.style.removeProperty('transform');
        else if (hero && hero.getBoundingClientRect().bottom > -100) {
          const offset = Math.min(28, Math.max(0, window.scrollY * 0.06));
          preview.style.transform = 'translate3d(0,' + offset.toFixed(1) + 'px,0)';
        }
      }
      if (glow && hero && hero.getBoundingClientRect().bottom > -100) {
        const offset = Math.min(28, Math.max(0, window.scrollY * 0.06));
        glow.style.transform = 'translate3d(0,' + (offset * -0.45).toFixed(1) + 'px,0)';
      }

      for (const line of kinetic) {
        const rect = line.container.getBoundingClientRect();
        const top = window.innerHeight * 0.85;
        const range = Math.max(120, window.innerHeight * 0.52 + rect.height * 0.25);
        const read = clamp((top - rect.top) / range, 0, 1);
        const count = line.words.length;
        line.words.forEach((word, index) => {
          const reveal = clamp(read * (count + 0.5) - index, 0, 1);
          word.style.opacity = (0.26 + reveal * 0.74).toFixed(3);
          word.style.transform = 'translate3d(0,' + ((1 - reveal) * 8).toFixed(1) + 'px,0)';
        });
      }
    };

    const requestTick = () => {
      if (enabled && !frame) frame = requestAnimationFrame(update);
    };

    const cleanup = () => {
      enabled = false;
      observer?.disconnect();
      observer = null;
      window.removeEventListener('scroll', requestTick);
      window.removeEventListener('resize', requestTick);
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerout', onPointerOut);
      if (frame) cancelAnimationFrame(frame);
      if (pointerFrame) cancelAnimationFrame(pointerFrame);
      frame = 0;
      pointerFrame = 0;
      clearPointer();
      for (const line of kinetic) for (const word of line.words) {
        word.style.removeProperty('opacity');
        word.style.removeProperty('transform');
      }
      if (preview) preview.style.removeProperty('transform');
      if (glow) glow.style.removeProperty('transform');
    };

    const mount = () => {
      cleanup();
      if (preference.matches) {
        root.dataset.motion = 'reduced';
        return;
      }
      // A fallback without IntersectionObserver must never leave content hidden.
      if (!('IntersectionObserver' in window)) {
        root.dataset.motion = 'static';
        return;
      }
      const reveals = [...root.querySelectorAll<HTMLElement>('[data-reveal]')];
      reveals.forEach(element => {
        if (element.getBoundingClientRect().top < window.innerHeight * 0.91) {
          element.classList.add('is-visible');
        }
      });
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer?.unobserve(entry.target);
        }
      }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
      reveals.forEach(element => observer?.observe(element));
      root.dataset.motion = 'active';
      enabled = true;
      window.addEventListener('scroll', requestTick, { passive: true });
      window.addEventListener('resize', requestTick, { passive: true });
      root.addEventListener('pointermove', onPointerMove, { passive: true });
      root.addEventListener('pointerout', onPointerOut);
      requestTick();
    };

    preference.addEventListener('change', mount);
    mount();

    return () => {
      preference.removeEventListener('change', mount);
      cleanup();
      delete root.dataset.motion;
    };
  }, [rootRef]);
}
