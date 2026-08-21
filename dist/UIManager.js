/**
 * UltraFab 3D Laboratory Studio - UIManager.ts
 * Antigravity UI, Raycaster Component Inspection, Live Metric HUD, and Toolbar Controls
 */
import * as THREE from "three";
export class UIManager {
    app;
    raycaster;
    mouse;
    selectedObject = null;
    pointerDownX = 0;
    pointerDownY = 0;
    constructor(appContext) {
        this.app = appContext;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.initRaycaster();
        this.bindEvents();
        this.updateMetricsHUD("lBench");
    }
    initRaycaster() {
        const dom = this.app.sceneManager.renderer.domElement;
        dom.addEventListener("pointerdown", (event) => {
            this.pointerDownX = event.clientX;
            this.pointerDownY = event.clientY;
        });
        dom.addEventListener("pointerup", (event) => {
            const diffX = Math.abs(event.clientX - this.pointerDownX);
            const diffY = Math.abs(event.clientY - this.pointerDownY);
            if (diffX < 5 && diffY < 5) {
                this.handleClick(event);
            }
        });
    }
    handleClick(event) {
        const rect = this.app.sceneManager.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse, this.app.sceneManager.camera);
        const intersects = this.raycaster.intersectObjects(this.app.sceneManager.currentModelRoot ? [this.app.sceneManager.currentModelRoot] : [], true);
        if (intersects.length > 0) {
            let target = intersects[0].object;
            let meta = null;
            while (target && target !== this.app.sceneManager.scene) {
                if (target.userData && target.userData.title) {
                    meta = target.userData;
                    break;
                }
                target = target.parent;
            }
            if (meta) {
                this.showInspectionPopover(meta);
                if (this.app.iframeBridge) {
                    this.app.iframeBridge.send("PART_SELECTED", meta);
                }
            }
        }
    }
    showInspectionPopover(meta) {
        const popover = document.getElementById("inspectionPopover");
        if (!popover)
            return;
        const catEl = document.getElementById("popoverCategory");
        const titleEl = document.getElementById("popoverTitle");
        const specsEl = document.getElementById("popoverSpecs");
        const descEl = document.getElementById("popoverDesc");
        const oemEl = document.getElementById("popoverOem");
        if (catEl)
            catEl.textContent = meta.category || "Laboratory Specification";
        if (titleEl)
            titleEl.textContent = meta.title || "UltraFab Component";
        if (specsEl)
            specsEl.textContent = meta.specs || "SEFA-8 Compliant Construction";
        if (descEl)
            descEl.textContent = meta.description || "Precision engineered laboratory component.";
        if (oemEl)
            oemEl.textContent = meta.oemCode || "UF-MOD-2026";
        popover.classList.remove("hidden");
        popover.classList.add("flex");
    }
    hideInspectionPopover() {
        const popover = document.getElementById("inspectionPopover");
        if (popover) {
            popover.classList.add("hidden");
            popover.classList.remove("flex");
        }
    }
    /**
     * Toggle glassmorphic skeleton shimmer on UI overlay controls
     */
    setSkeletonLoading(active) {
        const hudCard = document.getElementById("hudCard");
        if (hudCard) {
            hudCard.classList.toggle("skeleton-loading", active);
        }
        const presetButtons = document.querySelectorAll("[data-camera-preset]");
        presetButtons.forEach((btn) => btn.classList.toggle("skeleton-loading", active));
        const colorSwatches = document.querySelectorAll("[data-color-hex]");
        colorSwatches.forEach((swatch) => swatch.classList.toggle("skeleton-loading", active));
    }
    updateMetricsHUD(modelMode) {
        const metrics = {
            lBench: {
                title: "L-Shaped Modular Lab Workstation & Overhead Suite",
                sub: "Image 1 Reference Setup | 6-Door Overhead Glass Cabinets | 45° Corner",
                linearLength: "5.90 m",
                counterArea: "4.42 m²",
                sktCount: "9 Points (230V 16A)",
                compliance: "SEFA 8M / EN 14175",
            },
            sinkIsland: {
                title: "Wet Chemistry Sink Bench & Reagent Island",
                sub: "Image 2 Reference Setup | Dual PP Sinks | 30-Peg Rack | 2-Tier Island",
                linearLength: "6.20 m",
                counterArea: "5.35 m²",
                sktCount: "8 Points (230V 16A)",
                compliance: "SEFA 8W / ASHRAE 110",
            },
            microbio: {
                title: "Microbiology & Analytical Full Suite",
                sub: "Image 3 Reference Setup | U-Bench Perimeter | Center Peninsula Station",
                linearLength: "10.80 m",
                counterArea: "8.15 m²",
                sktCount: "16 Points (230V 16A)",
                compliance: "WHO Biosafety Level 2 / SEFA 8",
            },
            ovenRoom: {
                title: "Thermal Oven & Muffle Furnace Room (4.25m x 5.575m)",
                sub: "Image 4 CAD Floor Plan | Heraeus Ovens | 1200°C Furnaces | 7716 CFM Exhaust",
                linearLength: "12.80 m",
                counterArea: "9.60 m²",
                sktCount: "22 Points (400V/230V)",
                compliance: "DIN 12880 / NFPA 86",
            },
        };
        const data = metrics[modelMode] || metrics.lBench;
        const titleEl = document.getElementById("hudModelTitle");
        const subEl = document.getElementById("hudModelSub");
        const lenEl = document.getElementById("hudLinearLength");
        const areaEl = document.getElementById("hudCounterArea");
        const sktEl = document.getElementById("hudSktCount");
        const compEl = document.getElementById("hudCompliance");
        if (titleEl)
            titleEl.textContent = data.title;
        if (subEl)
            subEl.textContent = data.sub;
        if (lenEl)
            lenEl.textContent = data.linearLength;
        if (areaEl)
            areaEl.textContent = data.counterArea;
        if (sktEl)
            sktEl.textContent = data.sktCount;
        if (compEl)
            compEl.textContent = data.compliance;
    }
    bindEvents() {
        // Model Selector Tabs
        const modelButtons = document.querySelectorAll("[data-model-mode]");
        modelButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const mode = btn.getAttribute("data-model-mode");
                this.app.switchModel(mode);
                modelButtons.forEach((b) => b.classList.remove("active-mode", "bg-brand-blue", "text-white"));
                btn.classList.add("active-mode", "bg-brand-blue", "text-white");
                this.updateMetricsHUD(mode);
                this.hideInspectionPopover();
            });
        });
        // Camera Preset Buttons
        const cameraButtons = document.querySelectorAll("[data-camera-preset]");
        cameraButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const preset = btn.getAttribute("data-camera-preset");
                this.app.animationController.setCameraPreset(preset);
            });
        });
        // Explode Toggle Button
        const explodeBtn = document.getElementById("btnExplode");
        if (explodeBtn) {
            explodeBtn.addEventListener("click", () => {
                const nextState = !this.app.animationController.isExploded;
                this.app.animationController.setExplode(nextState);
                explodeBtn.classList.toggle("bg-emerald-600/30", nextState);
                explodeBtn.classList.toggle("border-emerald-400", nextState);
                const label = document.getElementById("btnExplodeLabel");
                if (label)
                    label.textContent = nextState ? "Assemble 3D" : "Dynamic Teardown";
            });
        }
        // Wireframe Toggle Button
        const wireframeBtn = document.getElementById("btnWireframe");
        if (wireframeBtn) {
            wireframeBtn.addEventListener("click", () => {
                const nextState = !this.app.materialLibrary.wireframeActive;
                this.app.materialLibrary.toggleWireframe(this.app.sceneManager.currentModelRoot, nextState);
                wireframeBtn.classList.toggle("bg-sky-600/30", nextState);
                wireframeBtn.classList.toggle("border-sky-400", nextState);
                const label = document.getElementById("btnWireframeLabel");
                if (label)
                    label.textContent = nextState ? "Solid Render" : "3D Wireframe";
            });
        }
        // 360 Spin Auto-Rotate Button
        const autoRotateBtn = document.getElementById("btnAutoRotate");
        if (autoRotateBtn) {
            autoRotateBtn.addEventListener("click", () => {
                const nextState = !this.app.sceneManager.autoRotateActive;
                this.app.sceneManager.toggleAutoRotate(nextState);
                autoRotateBtn.classList.toggle("bg-brand-blue", nextState);
                autoRotateBtn.classList.toggle("text-white", nextState);
            });
        }
        // Color Palette Buttons
        const colorButtons = document.querySelectorAll("[data-color-hex]");
        colorButtons.forEach((btn) => {
            btn.addEventListener("click", () => {
                const mainHex = btn.getAttribute("data-color-hex") || "#F4F4F4";
                const accentHex = btn.getAttribute("data-accent-hex") || "#979A9C";
                const blueHex = btn.getAttribute("data-blue-hex") || "#00529B";
                this.app.materialLibrary.setColors(mainHex, accentHex, blueHex);
                colorButtons.forEach((b) => b.classList.remove("ring-2", "ring-brand-blue"));
                btn.classList.add("ring-2", "ring-brand-blue");
            });
        });
        // Close Popover
        const closePopoverBtn = document.getElementById("btnClosePopover");
        if (closePopoverBtn) {
            closePopoverBtn.addEventListener("click", () => this.hideInspectionPopover());
        }
        // Airflow Particles Toggle
        const particleBtn = document.getElementById("btnAirflowToggle");
        if (particleBtn) {
            particleBtn.addEventListener("click", () => {
                const next = !this.app.animationController.particlesActive;
                this.app.animationController.toggleParticles(next);
                particleBtn.classList.toggle("bg-brand-emerald", next);
                particleBtn.classList.toggle("text-slate-950", next);
                particleBtn.textContent = next ? "EXHAUST CFM ACTIVE" : "CFM PAUSED";
            });
        }
        // Fullscreen Toggle
        const fullscreenBtn = document.getElementById("btnFullscreen");
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener("click", () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch((e) => console.warn(e));
                }
                else {
                    document.exitFullscreen().catch((e) => console.warn(e));
                }
            });
        }
    }
}
//# sourceMappingURL=UIManager.js.map