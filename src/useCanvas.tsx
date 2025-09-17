import { useEffect, useLayoutEffect, useRef } from "react";

type UseCanvasOptions = {
  onInit?: (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => void;
  onDraw?: (
    ctx: CanvasRenderingContext2D,
    frame: number,
    elapsedMs: number
  ) => void;
  playing?: boolean;
  pixelRatio?: number;
};
export function useCanvas({
  onInit,
  onDraw,
  playing = true,
  pixelRatio = window.devicePixelRatio,
}: UseCanvasOptions) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  const setupHiDPI = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cssWidth = canvas.clientWidth || canvas.width;
    const cssHeight = canvas.clientHeight || canvas.height;
    const ratio = pixelRatio ?? window.devicePixelRatio ?? 1;

    const targetW = Math.floor(cssWidth * ratio);
    const targetH = Math.floor(cssHeight * ratio);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    return ctx;
  };

  useLayoutEffect(() => {
    const ctx = setupHiDPI();
    if (ctx && onInit) {
      onInit(ctx, canvasRef.current!);
    }
  }, [pixelRatio, onInit]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let running = true;
    const loop = (now: number) => {
      if (!running) return;
      if (startTimeRef.current === null) startTimeRef.current = now;

      frameRef.current += 1;
      onDraw?.(ctx, frameRef.current, now - startTimeRef.current);

      if (playing) {
        rafRef.current = requestAnimationFrame(loop);
      } else {
        rafRef.current = null;
      }
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      running = false;
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      frameRef.current = 0;
      startTimeRef.current = null;
    };
  }, [playing, onDraw]);

  return canvasRef;
}
