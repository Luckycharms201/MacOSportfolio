import { THUMB, ICON_W } from "../constants.js";

/**
 * A single desktop icon: rounded thumbnail + caption label.
 * Selection is shown with the macOS blue-tinted highlight behind both.
 * All drag/click logic lives in the parent; this only forwards pointerdown.
 */
export default function DesktopIcon({ project, pos, selected, onPointerDown }) {
  const isImage = project.type === "image";
  return (
    <div
      className="absolute z-10 flex flex-col items-center no-select"
      style={{ left: pos.x, top: pos.y, width: ICON_W }}
      onPointerDown={(e) => onPointerDown(e, project.id)}
    >
      <div
        className={`relative rounded-xl p-1 transition-colors ${
          selected ? "bg-blue-500/25" : ""
        }`}
      >
        {isImage ? (
          // macOS image-file look: the photo itself, aspect preserved,
          // thin white matte + drop shadow, only slightly rounded.
          <img
            src={project.thumbnail}
            alt={project.title}
            draggable={false}
            className="block rounded-[3px] border border-white object-cover shadow-[0_2px_7px_rgba(0,0,0,0.35)]"
            style={{ width: THUMB, height: "auto", maxHeight: THUMB + 16 }}
          />
        ) : (
          <img
            src={project.thumbnail}
            alt={project.title}
            draggable={false}
            className="rounded-[14px] shadow-md"
            style={{ width: THUMB, height: THUMB }}
          />
        )}
        {selected && (
          <div
            className={`pointer-events-none absolute inset-1 bg-blue-500/30 mix-blend-multiply ${
              isImage ? "rounded-[3px]" : "rounded-[14px]"
            }`}
          />
        )}
      </div>

      <span
        className={`mt-1 max-w-full truncate rounded px-1.5 py-[1px] text-center text-[11px] leading-tight ${
          selected
            ? "bg-blue-500 text-white"
            : "text-gray-800 [text-shadow:0_1px_2px_rgba(255,255,255,0.8)]"
        }`}
      >
        {project.title}
      </span>
    </div>
  );
}
