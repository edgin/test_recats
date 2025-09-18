// App.tsx
import CanvasSketch_01 from "./CanvasSketch_01";
import CanvasCircle from "./CanvasCircle";

export default function App() {
  return (
    <>
      <p className="read-the-docs">React logos to learn more</p>
      <CanvasSketch_01
        playing
        onInit={(ctx) => {
          ctx.lineCap = "round";
        }}
        onDraw={(ctx, frame, elapsed) => {
          const { width, height } = ctx.canvas;
          ctx.clearRect(0, 0, width, height);

          const t = elapsed * 0.002;
          const x = 150 + Math.sin(t) * 60;
          const y = 100 + Math.cos(t * 1.3) * 30;

          ctx.fillStyle = "#111";
          ctx.fillRect(0, 0, width, height);

          ctx.fillStyle = "#00d4ff";
          ctx.beginPath();
          ctx.arc(x, y, 18, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = "#fff";
          ctx.font = "12px monospace";
          ctx.fillText(`frame: ${frame}`, 8, 16);
        }}
      />
      <CanvasCircle width={360} height={240} radius={50} color="#7cffb2" />
    </>
  );
}
