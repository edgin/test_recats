// CanvasSketch.tsx
import React, { forwardRef } from "react";
import { useCanvas, type DrawFn } from "./useCanvas";

type Props = {
  onInit?: (ctx: CanvasRenderingContext2D) => void;
  onDraw: DrawFn;
  playing?: boolean;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
};

const CanvasSketch_01 = forwardRef<HTMLCanvasElement, Props>(
  (
    {
      onInit,
      onDraw,
      playing = true,
      width = 320,
      height = 200,
      className,
      style,
    },
    externalRef
  ) => {
    const internalRef = useCanvas({ onInit, onDraw, playing });

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
          ...style,
        }}
      />
    );
  }
);
CanvasSketch_01.displayName = "CanvasSketch_01";

export default CanvasSketch_01;
