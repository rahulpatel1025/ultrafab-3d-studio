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
import { LabModelMode } from "./types.js";
export declare class UltraFabStudioApp {
    container: HTMLElement;
    currentMode: LabModelMode;
    clock: THREE.Clock;
    sceneManager: SceneManager;
    materialLibrary: MaterialLibrary;
    assetLoader: AssetLoader;
    modelGenerators: ModelGenerators;
    animationController: AnimationController;
    uiManager: UIManager;
    iframeBridge: IframeBridge;
    constructor();
    init(): Promise<void>;
    /**
     * Switch between the 4 laboratory setups with skeletal proxy and strict memory cleanup
     */
    switchModel(mode: LabModelMode, isInitial?: boolean): Promise<void>;
    private renderLoop;
}
