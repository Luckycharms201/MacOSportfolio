import { useRef, useState } from "react";

const TILE = 50; // resting tile size (px)
const MAX_SCALE = 1.85; // peak magnification under the cursor
const RANGE = 100; // px from cursor at which magnification fades out

/**
 * macOS dock: translucent rounded bar, app tiles, neighbour magnification.
 * Magnification tracks the cursor's X within the dock and scales each tile by
 * its distance to the cursor (the classic Dock easing).
 */
export default function Dock({ apps, onOpen }) {
  const tileRefs = useRef([]);
  const [mouseX, setMouseX] = useState(null);

  const scaleFor = (i) => {
    const el = tileRefs.current[i];
    if (mouseX == null || !el) return 1;
    const r = el.getBoundingClientRect();
    const center = r.left + r.width / 2;
    const dist = Math.abs(mouseX - center);
    if (dist > RANGE) return 1;
    return 1 + (MAX_SCALE - 1) * (1 - dist / RANGE);
  };

  return (
    <div className="fixed bottom-2.5 left-1/2 z-[9000] -translate-x-1/2 no-select">
      <div
        className="flex items-end gap-2 rounded-2xl border border-white/60 bg-white/35 px-2.5 py-1.5 shadow-2xl shadow-black/20 backdrop-blur-xl"
        onPointerMove={(e) => setMouseX(e.clientX)}
        onPointerLeave={() => setMouseX(null)}
      >
        {apps.map((app, i) => {
          if (app.divider) {
            return (
              <div
                key={`div-${i}`}
                className="mx-1 h-10 w-px self-center bg-black/15"
              />
            );
          }
          const scale = scaleFor(i);
          return (
            <div
              key={app.label + i}
              ref={(el) => (tileRefs.current[i] = el)}
              className="origin-bottom transition-transform duration-100 ease-out"
              style={{ transform: `scale(${scale})` }}
            >
              <button
                type="button"
                title={app.label}
                onClick={() => app.projectId != null && onOpen(app.projectId)}
                className="block rounded-[13px] shadow-md outline-none"
                style={{
                  width: TILE,
                  height: TILE,
                  background: app.grad,
                }}
              >
                <span className="text-[17px] font-bold text-white drop-shadow-sm">
                  {app.label}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
