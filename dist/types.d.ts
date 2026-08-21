/**
 * UltraFab 3D Laboratory Studio - types.ts
 * TypeScript Type Definitions & Interfaces
 */
import * as THREE from "three";
export type LabModelMode = "lBench" | "sinkIsland" | "microbio" | "ovenRoom";
export type CameraPreset = "iso" | "front" | "top" | "side" | "eyeLevel";
export interface ExplodeOffset {
    x: number;
    y: number;
    z: number;
}
export interface ComponentMetadata {
    title: string;
    category: string;
    specs: string;
    description: string;
    oemCode: string;
    explodeOffset?: ExplodeOffset;
    explodeRotation?: ExplodeOffset;
    originPos?: THREE.Vector3;
    originRot?: THREE.Euler;
    originalOpacity?: number | number[];
    originalTransparent?: boolean | boolean[];
}
export interface MetricHUDData {
    title: string;
    sub: string;
    linearLength: string;
    counterArea: string;
    sktCount: string;
    compliance: string;
}
export interface RALColorPreset {
    label: string;
    sub: string;
    mainHex: string;
    accentHex: string;
    blueHex?: string;
}
export interface AssetLoadOptions {
    materialOverrides?: Record<string, THREE.Material>;
    scale?: [number, number, number];
    castShadow?: boolean;
    receiveShadow?: boolean;
    fallbackFn?: (materials: any) => THREE.Group;
    userData?: Partial<ComponentMetadata>;
}
export interface IMaterialLibrary {
    currentMainColor: string;
    currentAccentColor: string;
    currentBlueColor: string;
    wireframeActive: boolean;
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
    setColors(mainHex: string, accentHex: string, blueHex?: string | null): void;
    toggleWireframe(root: THREE.Object3D | null, active: boolean): void;
    dispose(): void;
}
export interface AssetManifestItem {
    key: string;
    url: string;
    options?: AssetLoadOptions;
}
export interface AssetProgressDetail {
    url: string;
    progress: number;
    itemsLoaded: number;
    itemsTotal: number;
}
export type InboundMessageType = "SET_MODEL_MODE" | "SET_COLOR" | "TOGGLE_EXPLODE" | "TOGGLE_WIREFRAME" | "SET_CAMERA_PRESET" | "TOGGLE_AUTO_ROTATE";
export interface InboundMessage {
    type: InboundMessageType;
    mode?: LabModelMode;
    mainHex?: string;
    accentHex?: string;
    blueHex?: string;
    state?: boolean;
    speed?: number;
    preset?: CameraPreset;
}
export type OutboundMessageType = "RENDERER_READY" | "PART_SELECTED" | "MODEL_CHANGED" | "COLOR_CHANGED";
export interface OutboundMessage {
    source: "ULTRAFAB_3D_STUDIO";
    type: OutboundMessageType;
    payload: any;
}
