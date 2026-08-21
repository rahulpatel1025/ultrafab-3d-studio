/**
 * UltraFab 3D Laboratory Studio - MaterialLibrary.ts
 * PBR Physical Materials, Glass Transmission, Procedural Textures, and RAL Color Presets
 */
import * as THREE from "three";
export class MaterialLibrary {
    currentMainColor = "#F4F4F4"; // RAL 9003 Signal White
    currentAccentColor = "#979A9C"; // RAL 7036 Platinum Grey
    currentBlueColor = "#00529B"; // UltraFab Signature Blue / RAL 5010
    wireframeActive = false;
    epoxyBumpMap;
    metalRoughnessMap;
    mainMat;
    grayAccentMat;
    blueAccentMat;
    blackWorktopMat;
    stainlessMat;
    glassCabinetMat;
    polypropyleneMat;
    blackEpoxySinkMat;
    waterValveMat;
    gasValveMat;
    vacuumValveMat;
    socketPlateMat;
    socketRockerMat;
    ovenBodyMat;
    ovenCharcoalMat;
    roomWallMat;
    roomFloorMat;
    wireframeMat;
    constructor() {
        this.initProceduralTextures();
        this.initMaterials();
    }
    initProceduralTextures() {
        if (typeof document === "undefined")
            return;
        // 1. Procedural Fine Epoxy Surface Texture (Canvas Bump Map)
        const epoxyCanvas = document.createElement("canvas");
        epoxyCanvas.width = 256;
        epoxyCanvas.height = 256;
        const ctx = epoxyCanvas.getContext("2d");
        if (ctx) {
            ctx.fillStyle = "#808080";
            ctx.fillRect(0, 0, 256, 256);
            for (let i = 0; i < 4000; i++) {
                const x = Math.random() * 256;
                const y = Math.random() * 256;
                const gray = Math.floor(120 + Math.random() * 40);
                ctx.fillStyle = `rgb(${gray},${gray},${gray})`;
                ctx.fillRect(x, y, 1.5, 1.5);
            }
        }
        this.epoxyBumpMap = new THREE.CanvasTexture(epoxyCanvas);
        this.epoxyBumpMap.wrapS = THREE.RepeatWrapping;
        this.epoxyBumpMap.wrapT = THREE.RepeatWrapping;
        this.epoxyBumpMap.repeat.set(4, 4);
        // 2. Procedural Brushed Metal Anisotropy Texture
        const metalCanvas = document.createElement("canvas");
        metalCanvas.width = 256;
        metalCanvas.height = 256;
        const mctx = metalCanvas.getContext("2d");
        if (mctx) {
            mctx.fillStyle = "#888888";
            mctx.fillRect(0, 0, 256, 256);
            for (let y = 0; y < 256; y += 2) {
                const brightness = Math.floor(125 + Math.random() * 35);
                mctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
                mctx.fillRect(0, y, 256, 1);
            }
        }
        this.metalRoughnessMap = new THREE.CanvasTexture(metalCanvas);
        this.metalRoughnessMap.wrapS = THREE.RepeatWrapping;
        this.metalRoughnessMap.wrapT = THREE.RepeatWrapping;
        this.metalRoughnessMap.repeat.set(2, 6);
    }
    initMaterials() {
        // 1. Main Sheet Metal Powder Coating (CRCA Steel)
        this.mainMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(this.currentMainColor),
            roughness: 0.28,
            metalness: 0.12,
            name: "mainPowderCoatMat",
        });
        // 2. Secondary Gray Accent Metal (Frames, Handles, Kickplates)
        this.grayAccentMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(this.currentAccentColor),
            roughness: 0.32,
            metalness: 0.35,
            name: "grayAccentMat",
        });
        // 3. UltraFab Signature Blue Powder Coating (Drawers, Raceways, Upper Cabinet Frames)
        this.blueAccentMat = new THREE.MeshStandardMaterial({
            color: new THREE.Color(this.currentBlueColor),
            roughness: 0.22,
            metalness: 0.2,
            name: "blueAccentMat",
        });
        // 4. Heavy-Duty Black Chemical-Resistant Epoxy Resin / Granite Countertop
        this.blackWorktopMat = new THREE.MeshStandardMaterial({
            color: 0x181e29,
            roughness: 0.18,
            metalness: 0.08,
            bumpMap: this.epoxyBumpMap,
            bumpScale: 0.002,
            name: "blackWorktopMat",
        });
        // 5. 304 High-Grade Brushed Stainless Steel (Faucets, Sinks, Hinges, Screws)
        this.stainlessMat = new THREE.MeshStandardMaterial({
            color: 0xe2e8f0,
            roughness: 0.14,
            metalness: 0.92,
            roughnessMap: this.metalRoughnessMap,
            name: "stainlessMat",
        });
        // 6. Realistic Optical Transmission Glass for Overhead Display Cabinets
        this.glassCabinetMat = new THREE.MeshPhysicalMaterial({
            color: 0xebf8ff,
            transparent: true,
            opacity: 0.38,
            roughness: 0.04,
            metalness: 0.05,
            transmission: 0.94,
            ior: 1.52,
            thickness: 0.008, // 8mm toughened safety glass
            specularIntensity: 1.0,
            specularColor: 0xffffff,
            name: "glassCabinetMat",
        });
        // 7. Polypropylene / High-Density Polymer (Pegboard & Sinks)
        this.polypropyleneMat = new THREE.MeshStandardMaterial({
            color: 0xd1d5db,
            roughness: 0.45,
            metalness: 0.05,
            name: "polypropyleneMat",
        });
        // 8. Molded Black Epoxy Resin Cup Sink / Drain Outlet
        this.blackEpoxySinkMat = new THREE.MeshStandardMaterial({
            color: 0x111827,
            roughness: 0.3,
            metalness: 0.1,
            name: "blackEpoxySinkMat",
        });
        // 9. Brass / Valve Accents (Gas & Water Valves)
        this.waterValveMat = new THREE.MeshStandardMaterial({
            color: 0x0284c7, // Cold Water Blue
            roughness: 0.25,
            metalness: 0.6,
            name: "waterValveMat",
        });
        this.gasValveMat = new THREE.MeshStandardMaterial({
            color: 0xeab308, // Gas Yellow
            roughness: 0.25,
            metalness: 0.6,
            name: "gasValveMat",
        });
        this.vacuumValveMat = new THREE.MeshStandardMaterial({
            color: 0x10b981, // Vacuum Green
            roughness: 0.25,
            metalness: 0.6,
            name: "vacuumValveMat",
        });
        // 10. Electrical Socket Faceplate Plastic (Pure Gloss White with Rockers)
        this.socketPlateMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            roughness: 0.15,
            metalness: 0.05,
            name: "socketPlateMat",
        });
        this.socketRockerMat = new THREE.MeshStandardMaterial({
            color: 0xef4444, // Red switch indicator
            roughness: 0.2,
            metalness: 0.1,
            name: "socketRockerMat",
        });
        // 11. Thermal Oven / Furnace Heavy Body Metal (High-temp matte silver/charcoal)
        this.ovenBodyMat = new THREE.MeshStandardMaterial({
            color: 0xf3f4f6,
            roughness: 0.25,
            metalness: 0.4,
            name: "ovenBodyMat",
        });
        this.ovenCharcoalMat = new THREE.MeshStandardMaterial({
            color: 0x374151,
            roughness: 0.35,
            metalness: 0.5,
            name: "ovenCharcoalMat",
        });
        // 12. Architectural Room Wall & Floor
        this.roomWallMat = new THREE.MeshStandardMaterial({
            color: 0x94a3b8,
            roughness: 0.85,
            metalness: 0.02,
            name: "roomWallMat",
        });
        this.roomFloorMat = new THREE.MeshStandardMaterial({
            color: 0xb0b7bd,
            roughness: 0.4,
            metalness: 0.08,
            name: "roomFloorMat",
        });
        // 13. High-Tech Holographic Wireframe Material
        this.wireframeMat = new THREE.MeshBasicMaterial({
            color: 0x38bdf8,
            wireframe: true,
            transparent: true,
            opacity: 0.65,
            name: "wireframeMat",
        });
    }
    /**
     * Set Powder Coating RAL Colors
     */
    setColors(mainHex, accentHex, blueHex = null) {
        this.currentMainColor = mainHex;
        this.currentAccentColor = accentHex;
        if (blueHex)
            this.currentBlueColor = blueHex;
        this.mainMat.color.set(this.currentMainColor);
        this.grayAccentMat.color.set(this.currentAccentColor);
        if (blueHex)
            this.blueAccentMat.color.set(this.currentBlueColor);
    }
    /**
     * Toggle Wireframe Mode for entire scene hierarchy
     */
    toggleWireframe(root, active) {
        this.wireframeActive = active;
        if (!root)
            return;
        root.traverse((child) => {
            if (child.isMesh) {
                const mesh = child;
                if (mesh.material) {
                    if (Array.isArray(mesh.material)) {
                        mesh.material.forEach((m) => {
                            if (m && "wireframe" in m) {
                                m.wireframe = active;
                            }
                        });
                    }
                    else {
                        if (mesh.material && "wireframe" in mesh.material) {
                            mesh.material.wireframe = active;
                        }
                    }
                }
            }
        });
    }
    /**
     * Dispose all textures and materials from GPU
     */
    dispose() {
        if (this.epoxyBumpMap)
            this.epoxyBumpMap.dispose();
        if (this.metalRoughnessMap)
            this.metalRoughnessMap.dispose();
        const mats = [
            this.mainMat,
            this.grayAccentMat,
            this.blueAccentMat,
            this.blackWorktopMat,
            this.stainlessMat,
            this.glassCabinetMat,
            this.polypropyleneMat,
            this.blackEpoxySinkMat,
            this.waterValveMat,
            this.gasValveMat,
            this.vacuumValveMat,
            this.socketPlateMat,
            this.socketRockerMat,
            this.ovenBodyMat,
            this.ovenCharcoalMat,
            this.roomWallMat,
            this.roomFloorMat,
            this.wireframeMat,
        ];
        mats.forEach((m) => {
            if (m && typeof m.dispose === "function") {
                m.dispose();
            }
        });
    }
}
//# sourceMappingURL=MaterialLibrary.js.map