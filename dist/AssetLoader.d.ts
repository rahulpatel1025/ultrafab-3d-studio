/**
 * UltraFab 3D Laboratory Studio - AssetLoader.ts
 * Hybrid Asset Pipeline Loader using GLTFLoader and DRACOLoader
 * Features:
 * - Promise-based async loading with progress tracking
 * - DRACO decompression support
 * - PBR Material override pipeline
 * - Procedural fallback generators for offline / standalone resilience
 */
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { AssetLoadOptions, AssetManifestItem, ComponentMetadata, IMaterialLibrary } from "./types.js";
export declare class AssetLoader {
    materials: IMaterialLibrary;
    loadingManager: THREE.LoadingManager;
    gltfLoader: GLTFLoader | null;
    dracoLoader: DRACOLoader | null;
    cache: Map<string, THREE.Group>;
    constructor(materialLibrary: IMaterialLibrary);
    private initLoaders;
    /**
     * Load a GLTF / GLB model with automatic caching and PBR material override
     */
    loadModel(url: string, options?: AssetLoadOptions): Promise<THREE.Group>;
    /**
     * Traverse model hierarchy and apply PBR material replacements and shadow configurations
     */
    applyOverrides(root: THREE.Object3D, materialOverrides: Record<string, THREE.Material>, castShadow: boolean, receiveShadow: boolean, userData?: Partial<ComponentMetadata>): void;
    /**
     * Load an entire manifest of assets in parallel
     */
    loadAll(manifest: AssetManifestItem[]): Promise<Map<string, THREE.Group>>;
    /**
     * Dispose cached geometries and materials
     */
    dispose(): void;
}
