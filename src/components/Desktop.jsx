import { useEffect, useRef, useState } from "react";
import { projects, dockApps, bgPortrait } from "../data/projects.js";
import { ICON_W, ICON_H } from "../constants.js";
import DesktopIcon from "./DesktopIcon.jsx";
import ProjectWindow from "./ProjectWindow.jsx";
import Dock from "./Dock.jsx";

// --- geometry helpers ---------------------------------------------------------
const norm = (x0, y0, x1, y1) => ({
  x: Math.min(x0, x1),
  y: Math.min(y0, y1),
  w: Math.abs(x1 - x0),
  h: Math.abs(y1 - y0),
});

const intersects = (a, b) =>
  a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

// Scatter the icons across the desktop on first render (held in state after).
function initialPositions() {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const spots = [
    [0.13, 0.16],
    [0.32, 0.46],
    [0.52, 0.2],
    [0.7, 0.44],
    [0.84, 0.18],
  ];
  const out = {};
  projects.forEach((p, i) => {
    const [fx, fy] = spots[i % spots.length];
    out[p.id] = {
      x: Math.round(W * fx + (Math.random() * 36 - 18)),
      y: Math.round(H * fy + (Math.random() * 36 - 18)),
    };
  });
  return out;
}

const fmtClock = (d) =>
  d.toLocaleDateString("en-US", { weekday: "short" }) +
  "  " +
  d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

export default function Desktop() {
  const [positions, setPositions] = useState(initialPositions);
  const [selected, setSelected] = useState([]);
  const [windows, setWindows] = useState([]); // { id, x, y, z }
  const [marquee, setMarquee] = useState(null); // { x, y, w, h } | null
  const [clock, setClock] = useState(() => fmtClock(new Date()));

  const desktopRef = useRef(null);
  const dragRef = useRef(null); // active interaction state
  const listenersRef = useRef(null); // attached window listeners
  const topZRef = useRef(100);
  const lastClick = useRef({ id: null, t: 0 });

  // Keep refs of fast-changing values for use inside pointer handlers.
  const positionsRef = useRef(positions);
  const selectedRef = useRef(selected);
  useEffect(() => void (positionsRef.current = positions), [positions]);
  useEffect(() => void (selectedRef.current = selected), [selected]);

  // Live menu-bar clock.
  useEffect(() => {
    const t = setInterval(() => setClock(fmtClock(new Date())), 10_000);
    return () => clearInterval(t);
  }, []);

  // --- coordinate conversion --------------------------------------------------
  const toLocal = (clientX, clientY) => {
    const r = desktopRef.current.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top };
  };

  // --- window listener plumbing ----------------------------------------------
  const attach = () => {
    const move = (e) => handleMove(e);
    const up = (e) => handleUp(e);
    listenersRef.current = { move, up };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  };
  const detach = () => {
    if (!listenersRef.current) return;
    window.removeEventListener("pointermove", listenersRef.current.move);
    window.removeEventListener("pointerup", listenersRef.current.up);
    listenersRef.current = null;
  };

  // --- windows ----------------------------------------------------------------
  function openProject(id) {
    setWindows((ws) => {
      const nz = ++topZRef.current;
      if (ws.some((w) => w.id === id)) {
        return ws.map((w) => (w.id === id ? { ...w, z: nz } : w));
      }
      const n = ws.length;
      return [...ws, { id, x: 140 + n * 28, y: 90 + n * 28, z: nz }];
    });
  }
  function bringFront(id) {
    setWindows((ws) => {
      const nz = ++topZRef.current;
      return ws.map((w) => (w.id === id ? { ...w, z: nz } : w));
    });
  }
  function closeWindow(id) {
    setWindows((ws) => ws.filter((w) => w.id !== id));
  }

  // --- pointer interactions ---------------------------------------------------
  function startIconDrag(e, id) {
    if (e.button !== 0) return;
    e.preventDefault();
    const cur = selectedRef.current;
    let dragIds;
    if (e.shiftKey) {
      setSelected(
        cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]
      );
      dragIds = [id];
    } else if (cur.includes(id)) {
      dragIds = cur;
    } else {
      setSelected([id]);
      dragIds = [id];
    }
    const startPos = {};
    for (const pid of dragIds) startPos[pid] = { ...positionsRef.current[pid] };
    dragRef.current = {
      type: "icon",
      ids: dragIds,
      startX: e.clientX,
      startY: e.clientY,
      startPos,
      moved: false,
      clickId: id,
    };
    attach();
  }

  function startWindowDrag(e, id) {
    if (e.button !== 0) return;
    e.preventDefault();
    const w = windows.find((w) => w.id === id);
    if (!w) return;
    dragRef.current = {
      type: "window",
      id,
      startX: e.clientX,
      startY: e.clientY,
      ox: w.x,
      oy: w.y,
    };
    attach();
  }

  function startMarquee(e) {
    if (e.button !== 0) return;
    e.preventDefault();
    const { x, y } = toLocal(e.clientX, e.clientY);
    const additive = e.shiftKey;
    if (!additive) setSelected([]);
    dragRef.current = {
      type: "marquee",
      sx: x,
      sy: y,
      cx: null,
      cy: null,
      additive,
      base: additive ? selectedRef.current.slice() : [],
      positions: { ...positionsRef.current },
    };
    attach();
  }

  function handleMove(e) {
    const d = dragRef.current;
    if (!d) return;

    if (d.type === "icon") {
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      if (!d.moved && Math.hypot(dx, dy) > 4) d.moved = true;
      if (d.moved) {
        setPositions((prev) => {
          const next = { ...prev };
          for (const pid of d.ids) {
            const s = d.startPos[pid];
            next[pid] = { x: s.x + dx, y: s.y + dy };
          }
          return next;
        });
      }
    } else if (d.type === "window") {
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      setWindows((ws) =>
        ws.map((w) => (w.id === d.id ? { ...w, x: d.ox + dx, y: d.oy + dy } : w))
      );
    } else if (d.type === "marquee") {
      const { x, y } = toLocal(e.clientX, e.clientY);
      d.cx = x;
      d.cy = y;
      const rect = norm(d.sx, d.sy, x, y);
      setMarquee(rect);
      const hit = [];
      for (const p of projects) {
        const pos = d.positions[p.id];
        const box = { x: pos.x, y: pos.y, w: ICON_W, h: ICON_H };
        if (intersects(rect, box)) hit.push(p.id);
      }
      setSelected(
        d.additive ? Array.from(new Set([...d.base, ...hit])) : hit
      );
    }
  }

  function handleUp() {
    const d = dragRef.current;
    if (d) {
      if (d.type === "icon" && !d.moved) {
        // Click without drag: detect double-click → open.
        const now = performance.now();
        if (lastClick.current.id === d.clickId && now - lastClick.current.t < 320) {
          openProject(d.clickId);
          lastClick.current = { id: null, t: 0 };
        } else {
          lastClick.current = { id: d.clickId, t: now };
        }
      }
      if (d.type === "marquee") setMarquee(null);
    }
    dragRef.current = null;
    detach();
  }

  // Clean up any stray listeners on unmount.
  useEffect(() => detach, []);

  return (
    <div
      ref={desktopRef}
      className="relative h-full w-full overflow-hidden bg-[#f4f4f7] font-sans"
    >
      {/* Menu bar */}
      <div className="absolute inset-x-0 top-0 z-[9998] flex h-6 items-center justify-between bg-white/40 px-3 text-[12px] text-gray-800 backdrop-blur-md no-select">
        <div className="flex items-center gap-4">
          <span className="text-[13px]"></span>
          <span className="font-semibold">Finder</span>
          <span className="hidden sm:inline">File</span>
          <span className="hidden sm:inline">Edit</span>
          <span className="hidden sm:inline">View</span>
          <span className="hidden sm:inline">Go</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Do Not Disturb</span>
          <span>{clock}</span>
        </div>
      </div>

      {/* Full-screen background: sharp center, blur toward the edges, + vignette */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none">
        {/* Sharp base photo */}
        <img
          src={bgPortrait}
          alt=""
          aria-hidden
          draggable={false}
          style={{ objectPosition: "center 25%" }}
          className="absolute inset-0 h-full w-full scale-105 object-cover"
        />
        {/* Blurred copy, revealed only toward the edges → radial blur */}
        <img
          src={bgPortrait}
          alt=""
          aria-hidden
          draggable={false}
          style={{
            objectPosition: "center 25%",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, transparent 32%, black 72%)",
            maskImage:
              "radial-gradient(ellipse at center, transparent 32%, black 72%)",
          }}
          className="absolute inset-0 h-full w-full scale-105 object-cover blur-lg"
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.28) 78%, rgba(0,0,0,0.5) 100%)",
          }}
        />
      </div>

      {/* Empty-desktop hit layer (starts marquee / deselects) */}
      <div className="absolute inset-0 z-[1]" onPointerDown={startMarquee} />

      {/* Marquee selection rectangle */}
      {marquee && (
        <div
          className="pointer-events-none absolute z-[5] rounded-[2px] border border-blue-400/70 bg-blue-400/20"
          style={{
            left: marquee.x,
            top: marquee.y,
            width: marquee.w,
            height: marquee.h,
          }}
        />
      )}

      {/* Icons */}
      {projects.map((p) => (
        <DesktopIcon
          key={p.id}
          project={p}
          pos={positions[p.id]}
          selected={selected.includes(p.id)}
          onPointerDown={startIconDrag}
        />
      ))}

      {/* Windows */}
      {windows.map((w) => {
        const project = projects.find((p) => p.id === w.id);
        return (
          <ProjectWindow
            key={w.id}
            project={project}
            z={w.z}
            pos={{ x: w.x, y: w.y }}
            onClose={() => closeWindow(w.id)}
            onFocus={() => bringFront(w.id)}
            onDragStart={(e) => startWindowDrag(e, w.id)}
          />
        );
      })}

      {/* Dock */}
      <Dock apps={dockApps} onOpen={openProject} />
    </div>
  );
}
