import React, { forwardRef } from "react";
import { useCanvas } from "./useCanvas";

type Props = {
  width?: number;
  height?: number;
  radius?: number;
  color?: string;
  background?: string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * Static circle drawn once via onInit (no animation).
 */ const CanvasCircle = forwardRef<HTMLCanvasElement, Props>(
  (
    {
      width = 320,
      height = 200,
      radius = 40,
      color = "#00d4ff",
      background = "#111",
      className,
      style,
    },
    externalRef
  ) => {
    const internalRef = useCanvas({
      playing: false, // no animation
      onInit: (ctx) => {
        const { width: w, height: h } = ctx.canvas;
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, w, h);

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
        ctx.fill();
      },
      onDraw: () => {}, // noop
    });

    // merge refs (so parent can still access <canvas> if needed)
    const setRefs = (el: HTMLCanvasElement | null) => {
      (internalRef as any).current = el;
      if (typeof externalRef === "function") externalRef(el);
      else if (externalRef && "current" in externalRef)
        (externalRef as any).current = el;
    };

    return (
      <canvas
        ref={setRefs}
        className={className}
        style={{
          width,
          height,
          border: "1px solid #444",
          display: "block",
          background: "#000",
          ...style,
        }}
      />
    );
  }
);

CanvasCircle.displayName = "CanvasCircle";
export default CanvasCircle;
