/**
 * UltraFab 3D Laboratory Studio - MaterialLibrary.ts
 * PBR Physical Materials, Glass Transmission, Procedural Textures, and RAL Color Presets
 */
import * as THREE from "three";
import { IMaterialLibrary } from "./types.js";
export declare class MaterialLibrary implements IMaterialLibrary {
    currentMainColor: string;
    currentAccentColor: string;
    currentBlueColor: string;
    wireframeActive: boolean;
    epoxyBumpMap: THREE.CanvasTexture;
    metalRoughnessMap: THREE.CanvasTexture;
    mainMat: THREE.MeshStandardMaterial;
    grayAccentMat: THREE.MeshStandardMaterial;
    blueAccentMat: THREE.MeshStandardMaterial;
    blackWorktopMat: THREE.MeshStandardMaterial;
    stainlessMat: THREE.MeshStandardMaterial;
    glassCabinetMat: THREE.MeshPhysicalMaterial;
    polypropyleneMat: THREE.MeshStandardMaterial;
    blackEpoxySinkMat: THREE.MeshStandardMaterial;
    waterValveMat: THREE.MeshStandardMaterial;
    gasValveMat: THREE.MeshStandardMaterial;
    vacuumValveMat: THREE.MeshStandardMaterial;
    socketPlateMat: THREE.MeshStandardMaterial;
    socketRockerMat: THREE.MeshStandardMaterial;
    ovenBodyMat: THREE.MeshStandardMaterial;
    ovenCharcoalMat: THREE.MeshStandardMaterial;
    roomWallMat: THREE.MeshStandardMaterial;
    roomFloorMat: THREE.MeshStandardMaterial;
    wireframeMat: THREE.MeshBasicMaterial;
    constructor();
    private initProceduralTextures;
    private initMaterials;
    /**
     * Set Powder Coating RAL Colors
     */
    setColors(mainHex: string, accentHex: string, blueHex?: string | null): void;
    /**
     * Toggle Wireframe Mode for entire scene hierarchy
     */
    toggleWireframe(root: THREE.Object3D | null, active: boolean): void;
    /**
     * Dispose all textures and materials from GPU
     */
    dispose(): void;
}
