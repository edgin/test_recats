import { useEffect, useRef } from "react";

type CanvasProps = React.CanvasHTMLAttributes<HTMLCanvasElement> & {
  onDraw?: (ctx: CanvasRenderingContext2D, frame: number) => void;
};

const Canvas = ({ onDraw, ...props }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let rafId: number;

    const render = () => {
      frame++;
      if (onDraw) {
        onDraw(ctx, frame);
      }
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(rafId);
  }, [onDraw]);

  return <canvas ref={canvasRef} {...props} />;
};

export default Canvas;
