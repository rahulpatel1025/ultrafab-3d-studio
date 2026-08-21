/**
 * UltraFab 3D Laboratory Studio - UIManager.ts
 * Antigravity UI, Raycaster Component Inspection, Live Metric HUD, and Toolbar Controls
 */
import * as THREE from "three";
import { LabModelMode, ComponentMetadata } from "./types.js";
export declare class UIManager {
    app: any;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    selectedObject: THREE.Object3D | null;
    pointerDownX: number;
    pointerDownY: number;
    constructor(appContext: any);
    private initRaycaster;
    private handleClick;
    showInspectionPopover(meta: ComponentMetadata): void;
    hideInspectionPopover(): void;
    /**
     * Toggle glassmorphic skeleton shimmer on UI overlay controls
     */
    setSkeletonLoading(active: boolean): void;
    updateMetricsHUD(modelMode: LabModelMode): void;
    bindEvents(): void;
}
