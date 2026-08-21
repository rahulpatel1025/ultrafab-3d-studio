/**
 * UltraFab 3D Laboratory Studio - SceneManager.ts
 * Three.js Lifecycle, PMREM Studio HDRI Environment, Lighting, OrbitControls, ResizeObserver, and GPU Memory Disposal
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
export declare class SceneManager {
    container: HTMLElement;
    width: number;
    height: number;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    pmremGenerator: THREE.PMREMGenerator | null;
    envMapTexture: THREE.Texture | null;
    currentModelRoot: THREE.Group | null;
    activeSkeletonProxy: THREE.Group | null;
    resizeObserver: ResizeObserver | null;
    autoRotateActive: boolean;
    autoRotateSpeed: number;
    constructor(containerElement: HTMLElement);
    private initScene;
    private initLighting;
    /**
     * PMREM Procedural HDRI Studio Environment Map
     */
    private initEnvironment;
    private initControls;
    private initResizeObserver;
    handleResize(width: number, height: number): void;
    /**
     * Mounts a holographic wireframe skeleton proxy immediately on frame 1 or during model switch
     */
    mountSkeletonProxy(skeletonGroup: THREE.Group): void;
    /**
     * Smoothly cross-fades from holographic wireframe skeleton proxy (opacity 1 -> 0)
     * to full PBR model (opacity 0 -> 1) over duration (default 0.6s) with GSAP
     */
    transitionFromSkeleton(fullModelGroup: THREE.Group, duration?: number): Promise<void>;
    /**
     * Set Current Active Model with Strict Memory Disposal of Previous Model
     */
    setModel(newModelGroup: THREE.Group): void;
    /**
     * Strict GPU Memory Disposal Protocol
     */
    disposeHierarchy(node: THREE.Object3D | null): void;
    disposeMaterial(mat: THREE.Material | null): void;
    toggleAutoRotate(active: boolean, speed?: number): void;
    dispose(): void;
}
