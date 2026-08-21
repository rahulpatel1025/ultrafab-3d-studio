/**
 * UltraFab 3D Laboratory Studio - AnimationController.ts
 * GSAP 3 Animation Controller for Exploded View Lerps, Camera Presets, and Exhaust Airflow Particles
 */
import * as THREE from "three";
import { SceneManager } from "./SceneManager.js";
import { CameraPreset } from "./types.js";
export declare class AnimationController {
    sceneManager: SceneManager;
    isExploded: boolean;
    explodeProgress: {
        value: number;
    };
    currentTimeline: any;
    particleSystem: THREE.Points | null;
    particlesActive: boolean;
    constructor(sceneManager: SceneManager);
    private initAirflowParticles;
    updateParticles(delta: number): void;
    toggleParticles(active: boolean): void;
    /**
     * Set Exploded View with GSAP Smooth Lerp
     */
    setExplode(explodeState: boolean): void;
    /**
     * Smoothly Animate Camera to Preset Angles
     */
    setCameraPreset(presetId: CameraPreset): void;
    dispose(): void;
}
