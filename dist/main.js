/**
 * UltraFab 3D Laboratory Studio - main.ts
 * Application Bootstrap & Lifecycle Coordinator (TypeScript)
 */
import * as THREE from "three";
import { SceneManager } from "./SceneManager.js";
import { MaterialLibrary } from "./MaterialLibrary.js";
import { AssetLoader } from "./AssetLoader.js";
import { ModelGenerators } from "./ModelGenerators.js";
import { AnimationController } from "./AnimationController.js";
import { UIManager } from "./UIManager.js";
import { IframeBridge } from "./IframeBridge.js";
export class UltraFabStudioApp {
    container;
    currentMode = "lBench";
    clock;
    sceneManager;
    materialLibrary;
    assetLoader;
    modelGenerators;
    animationController;
    uiManager;
    iframeBridge;
    constructor() {
        const el = document.getElementById("canvasContainer");
        if (!el) {
            throw new Error("canvasContainer element not found in DOM.");
        }
        this.container = el;
        this.clock = new THREE.Clock();
        this.init();
    }
    async init() {
        // 1. Initialize Subsystems
        this.sceneManager = new SceneManager(this.container);
        this.materialLibrary = new MaterialLibrary();
        this.assetLoader = new AssetLoader(this.materialLibrary);
        this.modelGenerators = new ModelGenerators(this.materialLibrary, this.assetLoader);
        this.animationController = new AnimationController(this.sceneManager);
        this.uiManager = new UIManager(this);
        this.iframeBridge = new IframeBridge(this);
        // 2. Start RAF Render Loop immediately
        this.renderLoop();
        // 3. Mount Frame 1 Holographic Skeleton Proxy & Trigger UI Shimmer
        const initialSkeleton = this.modelGenerators.createSkeletonProxy("lBench");
        this.sceneManager.mountSkeletonProxy(initialSkeleton);
        this.uiManager.setSkeletonLoading(true);
        // 4. Hide Fullscreen Splash Loader
        const loaderEl = document.getElementById("loadingOverlay");
        if (loaderEl) {
            loaderEl.classList.add("opacity-0", "pointer-events-none");
            setTimeout(() => loaderEl.remove(), 400);
        }
        // 5. Asynchronously build full model and cross-fade
        await this.switchModel("lBench", true);
    }
    /**
     * Switch between the 4 laboratory setups with skeletal proxy and strict memory cleanup
     */
    async switchModel(mode, isInitial = false) {
        this.currentMode = mode;
        // A. Mount Skeleton Proxy immediately on frame 1 to eliminate UI freeze
        if (!isInitial) {
            const skeletonProxy = this.modelGenerators.createSkeletonProxy(mode);
            this.sceneManager.mountSkeletonProxy(skeletonProxy);
        }
        this.uiManager.setSkeletonLoading(true);
        // B. Set Camera Preset
        if (mode === "ovenRoom") {
            this.animationController.setCameraPreset("top");
        }
        else {
            this.animationController.setCameraPreset("iso");
        }
        // C. Reset explode state
        if (this.animationController.isExploded) {
            this.animationController.setExplode(false);
            const explodeBtn = document.getElementById("btnExplode");
            if (explodeBtn) {
                explodeBtn.classList.remove("bg-emerald-600/30", "border-emerald-400");
                const label = document.getElementById("btnExplodeLabel");
                if (label)
                    label.textContent = "Dynamic Teardown";
            }
        }
        // D. Asynchronously build full high-detail model
        await new Promise((r) => setTimeout(r, 40));
        let newModelRoot;
        switch (mode) {
            case "lBench":
                newModelRoot = this.modelGenerators.buildLShapedWorkstationScene();
                break;
            case "sinkIsland":
                newModelRoot = this.modelGenerators.buildSinkIslandScene();
                break;
            case "microbio":
                newModelRoot = this.modelGenerators.buildMicrobiologySuiteScene();
                break;
            case "ovenRoom":
                newModelRoot = this.modelGenerators.buildOvenRoomScene();
                break;
            default:
                newModelRoot = this.modelGenerators.buildLShapedWorkstationScene();
                break;
        }
        // E. Reapply wireframe state if currently active
        if (this.materialLibrary.wireframeActive) {
            this.materialLibrary.toggleWireframe(newModelRoot, true);
        }
        // F. Smooth GSAP cross-fade from skeleton proxy to full model (0.6s)
        await this.sceneManager.transitionFromSkeleton(newModelRoot, 0.6);
        // G. Disable UI Shimmer
        this.uiManager.setSkeletonLoading(false);
        if (this.iframeBridge) {
            this.iframeBridge.send("MODEL_CHANGED", { mode });
        }
    }
    renderLoop() {
        requestAnimationFrame(() => this.renderLoop());
        const delta = this.clock.getDelta();
        // 1. Update OrbitControls (Damping & Auto-Rotation)
        if (this.sceneManager.controls) {
            this.sceneManager.controls.update();
        }
        // 2. Update Airflow Particles
        if (this.animationController) {
            this.animationController.updateParticles(delta);
        }
        // 3. Render WebGL Frame
        if (this.sceneManager.renderer && this.sceneManager.scene && this.sceneManager.camera) {
            this.sceneManager.renderer.render(this.sceneManager.scene, this.sceneManager.camera);
        }
    }
}
// Bootstrap on DOM Loaded or immediately if already interactive/complete
if (typeof window !== "undefined") {
    const bootstrap = () => {
        if (!window.__ULTRAFAB_APP__) {
            try {
                window.__ULTRAFAB_APP__ = new UltraFabStudioApp();
            }
            catch (err) {
                console.error("[UltraFab Studio] Fatal initialization error:", err);
                const overlay = document.getElementById("loadingOverlay");
                if (overlay) {
                    overlay.innerHTML = `
            <div class="p-6 text-center text-rose-400 font-sans max-w-sm">
              <div class="text-base font-bold mb-2">3D Studio Initialization</div>
              <div class="text-xs text-slate-300 mb-4">${err?.message || "WebGL initialization notice"}</div>
              <button onclick="location.reload()" class="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-colors">Reload Studio</button>
            </div>
          `;
                }
            }
        }
    };
    if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", bootstrap);
    }
    else {
        // If DOM is already parsed (common with deferred/ES modules on mobile)
        bootstrap();
    }
}
//# sourceMappingURL=main.js.map