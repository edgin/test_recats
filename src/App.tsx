import "./App.css";
import { useCanvas } from "./useCanvas";

function App() {
  const canvasRef = useCanvas({
    onInit: (ctx) => {
      ctx.lineCap = "round";
    },
    onDraw: (ctx, frame, elapsed) => {
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
    },
    playing: true,
  });
  return (
    <>
      <p className="read-the-docs">React logos to learn more</p>
      <canvas
        ref={canvasRef}
        style={{
          width: 320,
          height: 200,
          border: "1px solid #444",
          display: "block",
        }}
      />
    </>
  );
}

export default App;
