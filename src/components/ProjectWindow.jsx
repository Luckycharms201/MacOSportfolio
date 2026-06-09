import { useEffect, useState } from "react";

/**
 * A draggable macOS "Preview"-style window: traffic lights, title bar,
 * a main image with a clickable thumbnail strip, and a description block.
 * Open animation (scale + fade) runs once on mount.
 */
export default function ProjectWindow({
  project,
  z,
  pos,
  onClose,
  onFocus,
  onDragStart,
}) {
  const [idx, setIdx] = useState(0);
  const [shown, setShown] = useState(false);

  // Trigger the open transition on the next frame.
  useEffect(() => {
    const r = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(r);
  }, []);

  const stop = (e) => e.stopPropagation();

  return (
    <div
      className="absolute no-select"
      style={{
        left: pos.x,
        top: pos.y,
        zIndex: z,
        width: 560,
        opacity: shown ? 1 : 0,
        transform: `scale(${shown ? 1 : 0.96})`,
        transformOrigin: "center",
        transition: "transform 0.18s ease, opacity 0.18s ease",
      }}
      onPointerDown={onFocus}
    >
      <div className="overflow-hidden rounded-xl border border-black/10 bg-white/85 shadow-2xl shadow-black/30 backdrop-blur-2xl">
        {/* Title bar */}
        <div
          className="flex h-10 items-center border-b border-black/5 bg-gray-100/70 px-3"
          onPointerDown={onDragStart}
          style={{ cursor: "default" }}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Close"
              onPointerDown={stop}
              onClick={(e) => {
                stop(e);
                onClose();
              }}
              className="group grid h-3 w-3 place-items-center rounded-full bg-[#ff5f57] text-[8px] leading-none text-black/50"
            >
              <span className="opacity-0 group-hover:opacity-100">×</span>
            </button>
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="pointer-events-none -ml-[58px] flex-1 text-center text-[13px] font-semibold text-gray-700">
            {project.title}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <img
            src={project.images[idx]}
            alt={`${project.title} ${idx + 1}`}
            draggable={false}
            className="h-72 w-full rounded-lg border border-black/5 object-cover"
          />

          {project.images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {project.images.map((im, i) => (
                <button
                  key={i}
                  type="button"
                  onPointerDown={stop}
                  onClick={(e) => {
                    stop(e);
                    setIdx(i);
                  }}
                  className={`h-14 w-14 overflow-hidden rounded-md border transition ${
                    i === idx
                      ? "border-blue-500 ring-2 ring-blue-400"
                      : "border-black/10 hover:border-black/25"
                  }`}
                >
                  <img
                    src={im}
                    alt=""
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <p className="mt-3 text-[13px] leading-relaxed text-gray-600">
            {project.description}
          </p>
        </div>
      </div>
    </div>
  );
}
