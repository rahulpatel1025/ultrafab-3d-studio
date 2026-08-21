/**
 * UltraFab 3D Laboratory Studio - IframeBridge.ts
 * Bi-Directional typed postMessage communication bridge for Next.js / Host Parent Integration
 */
export class IframeBridge {
    app;
    constructor(appContext) {
        this.app = appContext;
        this.initMessageListener();
        this.notifyReady();
    }
    initMessageListener() {
        window.addEventListener("message", (event) => {
            const data = event.data;
            if (!data || typeof data !== "object" || !data.type)
                return;
            switch (data.type) {
                case "SET_MODEL_MODE":
                    if (data.mode) {
                        this.app.switchModel(data.mode);
                        this.app.uiManager.updateMetricsHUD(data.mode);
                    }
                    break;
                case "SET_COLOR":
                    if (data.mainHex && data.accentHex) {
                        this.app.materialLibrary.setColors(data.mainHex, data.accentHex, data.blueHex || null);
                    }
                    break;
                case "TOGGLE_EXPLODE":
                    this.app.animationController.setExplode(Boolean(data.state));
                    break;
                case "TOGGLE_WIREFRAME":
                    this.app.materialLibrary.toggleWireframe(this.app.sceneManager.currentModelRoot, Boolean(data.state));
                    break;
                case "SET_CAMERA_PRESET":
                    if (data.preset) {
                        this.app.animationController.setCameraPreset(data.preset);
                    }
                    break;
                case "TOGGLE_AUTO_ROTATE":
                    this.app.sceneManager.toggleAutoRotate(Boolean(data.state), data.speed || 1.5);
                    break;
                default:
                    break;
            }
        });
    }
    /**
     * Send Typed Outgoing Message to Parent Window
     */
    send(type, payload = {}) {
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({ source: "ULTRAFAB_3D_STUDIO", type, payload }, "*");
        }
    }
    notifyReady() {
        this.send("RENDERER_READY", {
            timestamp: Date.now(),
            supportedModes: ["lBench", "sinkIsland", "microbio", "ovenRoom"],
        });
    }
}
//# sourceMappingURL=IframeBridge.js.map