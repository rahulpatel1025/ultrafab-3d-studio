# UltraFab 3D Laboratory Workstation & Spatial Studio

A high-performance, modular single-page 3D WebGL application for interactive visualization, teardown explosion, wireframe inspection, and 360-degree presentation of UltraFab modular laboratory furniture and equipment suites based on reference architectural layouts and CAD floor plans.

---

## 🚀 Key Features

1. **4 Reference Laboratory Setups**:
   - **Model 1: L-Shaped Modular Lab Workstation & Overhead Glass Cabinet Suite (Image 1)**
     - 6-door wall-mounted glass storage cabinets with vibrant blue aluminium frames and stainless steel pull handles.
     - Chemical-resistant black epoxy resin countertop with 45° corner pentagonal join.
     - Backsplash vibrant blue electrical raceway trunking with multi-pin universal sockets and rocker switches.
     - Modular base storage units with blue drawer headers, light grey doors, and tubular steel C-frame legs.
   - **Model 2: Wet Chemistry Sink Bench & Reagent Island (Image 2)**
     - Dual deep PP/SS sinks with two 3-way gooseneck laboratory water faucets.
     - 30-peg laboratory glassware drying pegboard with drainage trough.
     - 2-tier reagent shelving rack with middle blue electrical service raceway.
   - **Model 3: Microbiology & Analytical Full Lab Suite (Image 3)**
     - Perimeter U-bench runs with continuous black epoxy countertops and blue raceways.
     - Central T-island workstation with reagent rack and integrated washing station.
   - **Model 4: Thermal Oven & Muffle Furnace Room (Image 4 CAD Layout)**
     - 4.25m x 5.575m spatial room layout with Muffle Furnaces (1200°C), Desiccators, Heraeus Electric Ovens, Hot Air Ovens, technician workbenches, lab stools, and 7716 CFM / 516 CFM exhaust ducting.

2. **Hybrid Asset Pipeline (`AssetLoader.js` & `ModelGenerators.js`)**:
   - **Procedural Shell**: Scalable architectural walls, L-benches, corner units, countertops, and modular cabinet carcasses generated with custom `createRoundedBoxGeometry` (no sharp 90-degree fake mathematical edges).
   - **External & Hybrid Fixtures**: Gooseneck 3-way taps, dual sinks with drain strainers, pegboards, and precision oven control panels loaded via `GLTFLoader` + `DRACOLoader` with automatic PBR material overrides and high-fidelity procedural fallbacks.
   - **1:1 Real-World Metric Scale**: 1 Three.js unit = 1 meter.

3. **Rendering Realism & Materials (`MaterialLibrary.js` & `SceneManager.js`)**:
   - PMREM HDRI Studio Environment Mapping for realistic specular reflections.
   - `MeshPhysicalMaterial` for transmission glass with realistic IOR (1.52).
   - Solid black epoxy resin / granite countertop with procedural micro-bump roughness mapping.
   - 304 brushed stainless steel with anisotropic roughness mapping.
   - Official RAL powder coating presets (RAL 9003 Signal White, RAL 5010 UltraFab Blue, RAL 6024 Green, RAL 7016 Anthracite).

4. **Interactive Controls & Spatial Tools**:
   - **Dynamic Teardown / Exploded View**: Smooth GSAP lerp separating overhead cabinets, countertops, electrical trunking, base drawers, and doors.
   - **3D Wireframe Mode**: High-precision holographic wireframe visualization.
   - **360° Turntable Auto-Rotate & OrbitControls**: Turntable spin, damping, zoom, pan, and camera angle presets (Isometric 3D, Front, Top CAD Plan View, Side, Eye-Level).
   - **Click-to-Inspect Raycasting**: Click any component to open an Antigravity Glassmorphism card showing OEM codes, SEFA-8 specs, and materials.
   - **Ventilation CFM Particle Physics**: Visualizes 7716 CFM master room extraction flow and 516 CFM oven flues.

5. **Memory Management & High-DPI Scaling**:
   - Strict recursive GPU disposal routine for geometries, materials, PMREM render targets, and textures.
   - `ResizeObserver` with debouncing and clamped DPR (`Math.min(window.devicePixelRatio, 2)`).

---

## 📁 File Structure

```
3D/
├── index.html              # Main standalone application entry
├── styles.css              # Antigravity glassmorphism & responsive layout styles
├── README.md               # Architecture documentation & API guide
└── js/
    ├── main.js             # Bootstrap & application coordinator
    ├── SceneManager.js     # Three.js scene, camera, renderer & disposal
    ├── MaterialLibrary.js  # PBR physical materials & RAL color definitions
    ├── AssetLoader.js      # Hybrid GLTF/DRACO loader with PBR overrides
    ├── ModelGenerators.js  # 3D procedural models for all 4 lab configurations
    ├── AnimationController.js # GSAP explode lerp, 360 auto-rotate & particles
    ├── UIManager.js        # UI overlays, raycasting inspection & toolbars
    └── IframeBridge.js     # Next.js iframe postMessage protocol handler
```

---

## 🔌 Next.js Integration via Iframe & `window.postMessage`

Deploy into the Next.js `public/3D/` folder and embed via iframe:

```tsx
<iframe
  src="/3D/index.html"
  className="w-full h-[650px] rounded-2xl border border-slate-800 shadow-2xl"
  title="UltraFab 3D Laboratory Workstation Studio"
/>
```

### PostMessage API:

**Next.js -> 3D Studio (Inbound):**
```js
iframe.contentWindow.postMessage({ type: "SET_MODEL_MODE", mode: "lBench" }, "*");
iframe.contentWindow.postMessage({ type: "SET_COLOR", mainHex: "#0E518D", accentHex: "#979A9C" }, "*");
iframe.contentWindow.postMessage({ type: "TOGGLE_EXPLODE", state: true }, "*");
iframe.contentWindow.postMessage({ type: "TOGGLE_WIREFRAME", state: true }, "*");
iframe.contentWindow.postMessage({ type: "SET_CAMERA_PRESET", preset: "top" }, "*");
```

**3D Studio -> Next.js (Outbound):**
```js
window.addEventListener("message", (event) => {
  if (event.data?.source === "ULTRAFAB_3D_STUDIO") {
    console.log("Event from 3D Studio:", event.data.type, event.data.payload);
  }
});
```

---

## 🏃 How to Run

1. Open `3D/index.html` directly in any modern WebGL-supported browser (Chrome, Edge, Firefox, Safari).
2. Or serve locally with Python:
   ```bash
   python -m http.server 8080 --directory d:\UltraFab\3D
   ```
   and visit `http://localhost:8080`.
