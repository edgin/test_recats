// useCanvas.ts
import { useEffect, useRef } from "react";

export type DrawFn = (
  ctx: CanvasRenderingContext2D,
  frame: number,
  elapsedMs: number
) => void;

export function useCanvas({
  onInit,
  onDraw,
  playing = true,
}: {
  onInit?: (ctx: CanvasRenderingContext2D) => void;
  onDraw: DrawFn;
  playing?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawRef = useRef(onDraw);
  const playingRef = useRef(playing);

  useEffect(() => {
    drawRef.current = onDraw;
  }, [onDraw]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // size the backing store to match CSS size × devicePixelRatio
    const setSize = () => {
      const cssW = Math.max(1, canvas.clientWidth || 320);
      const cssH = Math.max(1, canvas.clientHeight || 200);
      const dpr = window.devicePixelRatio || 1;
      if (
        canvas.width !== Math.floor(cssW * dpr) ||
        canvas.height !== Math.floor(cssH * dpr)
      ) {
        canvas.width = Math.floor(cssW * dpr);
        canvas.height = Math.floor(cssH * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
    };
    setSize();
    const ro = new ResizeObserver(setSize);
    ro.observe(canvas);

    onInit?.(ctx);

    let frame = 0;
    const start = performance.now();
    let raf = 0;
    const loop = (now: number) => {
      if (playingRef.current) {
        frame++;
        try {
          drawRef.current(ctx, frame, now - start);
        } catch (e) {
          console.error(e);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [onInit]);

  return canvasRef;
}
