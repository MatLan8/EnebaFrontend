import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { useNavigate } from "react-router-dom";
import { PageArrowIcon } from "../../../icons/PageArrowIcon";
import type { ProductListItem } from "../../../types/product";
import { SecondaryButton } from "../../buttons/SecondaryButton";
import { ProductCard } from "../../ProductCard/ProductCard";
import styles from "./ProductCarouselBlock.module.css";

const cardsPerStep = 5;
const scrollDurationMs = 550;
const minThumbWidth = 24;

const easeOutCubic = (progress: number) => 1 - (1 - progress) ** 3;

interface ScrollState {
  scrollable: boolean;
  atStart: boolean;
  atEnd: boolean;
}

interface DragState {
  pointerX: number;
  scrollLeft: number;
  ratio: number;
}

interface ProductCarouselBlockProps {
  title: string;
  products: ProductListItem[];
  showAllTo: string;
  raised?: boolean;
}

export function ProductCarouselBlock({
  title,
  products,
  showAllTo,
  raised = false,
}: ProductCarouselBlockProps) {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef(0);
  const dragRef = useRef<DragState | null>(null);
  const [scrollState, setScrollState] = useState<ScrollState>({
    scrollable: false,
    atStart: true,
    atEnd: true,
  });

  const syncScroll = useCallback(() => {
    const track = trackRef.current;
    const bar = barRef.current;
    const thumb = thumbRef.current;
    if (!track) return;

    const maxScroll = track.scrollWidth - track.clientWidth;
    const scrollable = maxScroll > 1;
    const atStart = track.scrollLeft <= 1;
    const atEnd = track.scrollLeft >= maxScroll - 1;

    if (bar && thumb && scrollable) {
      const barWidth = bar.clientWidth;
      const thumbWidth = Math.max((barWidth * track.clientWidth) / track.scrollWidth, minThumbWidth);
      const offset = (Math.min(track.scrollLeft, maxScroll) / maxScroll) * (barWidth - thumbWidth);
      thumb.style.width = `${thumbWidth}px`;
      thumb.style.transform = `translateX(${offset}px)`;
    }

    setScrollState((current) =>
      current.scrollable === scrollable && current.atStart === atStart && current.atEnd === atEnd
        ? current
        : { scrollable, atStart, atEnd },
    );
  }, []);

  const stopAnimation = useCallback(() => {
    cancelAnimationFrame(frameRef.current);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const observer = new ResizeObserver(syncScroll);
    observer.observe(track);
    return () => {
      observer.disconnect();
      stopAnimation();
    };
  }, [products, syncScroll, stopAnimation]);

  const scrollByCards = (direction: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild;
    if (!track || !(card instanceof HTMLElement)) return;

    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const target = Math.min(
      Math.max(Math.round(track.scrollLeft / step) * step + direction * cardsPerStep * step, 0),
      maxScroll,
    );

    stopAnimation();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      track.scrollLeft = target;
      return;
    }

    const start = track.scrollLeft;
    const distance = target - start;
    const startTime = performance.now();

    const animate = (now: number) => {
      const progress = Math.min((now - startTime) / scrollDurationMs, 1);
      track.scrollLeft = start + distance * easeOutCubic(progress);
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);
  };

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    const bar = barRef.current;
    if (!track || !bar) return;

    const freeSpace = bar.clientWidth - event.currentTarget.offsetWidth;
    if (freeSpace <= 0) return;

    stopAnimation();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerX: event.clientX,
      scrollLeft: track.scrollLeft,
      ratio: (track.scrollWidth - track.clientWidth) / freeSpace,
    };
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    const track = trackRef.current;
    if (!drag || !track) return;

    track.scrollLeft = drag.scrollLeft + (event.clientX - drag.pointerX) * drag.ratio;
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  return (
    <section className={raised ? `${styles.block} ${styles.raised}` : styles.block}>
      <div className={styles.inner}>
        <h2 className={styles.title}>{title}</h2>
        <div
          className={
            scrollState.scrollable ? `${styles.viewport} ${styles.scrollable}` : styles.viewport
          }
        >
          <div className={styles.rail}>
            <div
              ref={trackRef}
              className={styles.track}
              onScroll={syncScroll}
              onWheel={stopAnimation}
              onTouchStart={stopAnimation}
            >
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowStart}`}
              disabled={scrollState.atStart}
              aria-label={`Scroll ${title} back`}
              onClick={() => scrollByCards(-1)}
            >
              <PageArrowIcon className={styles.arrowIcon} />
            </button>
            <button
              type="button"
              className={`${styles.arrow} ${styles.arrowEnd}`}
              disabled={scrollState.atEnd}
              aria-label={`Scroll ${title} forward`}
              onClick={() => scrollByCards(1)}
            >
              <PageArrowIcon className={styles.arrowIcon} />
            </button>
          </div>
          <div ref={barRef} className={styles.scrollbar} aria-hidden="true">
            <div
              ref={thumbRef}
              className={styles.thumb}
              onPointerDown={startDrag}
              onPointerMove={moveDrag}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
            />
          </div>
        </div>
        <div className={styles.footer}>
          <SecondaryButton className={styles.showAll} onClick={() => navigate(showAllTo)}>
            Show all
          </SecondaryButton>
        </div>
      </div>
    </section>
  );
}
