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
export class AssetLoader {
    materials;
    loadingManager;
    gltfLoader = null;
    dracoLoader = null;
    cache = new Map();
    constructor(materialLibrary) {
        this.materials = materialLibrary;
        this.loadingManager = new THREE.LoadingManager();
        this.initLoaders();
    }
    initLoaders() {
        // 1. Initialize Loading Manager with callbacks
        this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = Math.round((itemsLoaded / itemsTotal) * 100);
            window.dispatchEvent(new CustomEvent("ultrafab:asset-progress", {
                detail: { url, progress, itemsLoaded, itemsTotal },
            }));
        };
        this.loadingManager.onError = (url) => {
            console.warn(`[AssetLoader] Failed to load external asset: ${url}. Engaging procedural fallback.`);
        };
        // 2. Initialize GLTF & DRACO Loaders
        try {
            this.gltfLoader = new GLTFLoader(this.loadingManager);
            this.dracoLoader = new DRACOLoader();
            this.dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/");
            this.dracoLoader.preload();
            this.gltfLoader.setDRACOLoader(this.dracoLoader);
        }
        catch (e) {
            console.warn("[AssetLoader] GLTFLoader initialization fallback:", e);
        }
    }
    /**
     * Load a GLTF / GLB model with automatic caching and PBR material override
     */
    async loadModel(url, options = {}) {
        const { materialOverrides = {}, scale = [1, 1, 1], castShadow = true, receiveShadow = true, fallbackFn = null, userData = {}, } = options;
        if (this.cache.has(url)) {
            const cached = this.cache.get(url);
            const cloned = cached.clone(true);
            this.applyOverrides(cloned, materialOverrides, castShadow, receiveShadow, userData);
            return cloned;
        }
        if (!this.gltfLoader) {
            if (fallbackFn)
                return fallbackFn(this.materials);
            throw new Error("[AssetLoader] GLTFLoader is not available in environment.");
        }
        const loader = this.gltfLoader;
        try {
            const gltf = await new Promise((resolve, reject) => {
                loader.load(url, resolve, undefined, reject);
            });
            const model = gltf.scene || gltf.scenes[0];
            model.scale.set(...scale);
            this.applyOverrides(model, materialOverrides, castShadow, receiveShadow, userData);
            this.cache.set(url, model.clone(true));
            return model;
        }
        catch (err) {
            console.warn(`[AssetLoader] Loading failed for ${url}. Using procedural fallback generator.`, err);
            if (typeof fallbackFn === "function") {
                const fallbackModel = fallbackFn(this.materials);
                if (userData && Object.keys(userData).length > 0) {
                    fallbackModel.userData = { ...fallbackModel.userData, ...userData };
                }
                return fallbackModel;
            }
            throw err;
        }
    }
    /**
     * Traverse model hierarchy and apply PBR material replacements and shadow configurations
     */
    applyOverrides(root, materialOverrides, castShadow, receiveShadow, userData) {
        if (userData && Object.keys(userData).length > 0) {
            root.userData = { ...root.userData, ...userData };
        }
        root.traverse((child) => {
            if (child.isMesh) {
                const mesh = child;
                mesh.castShadow = castShadow;
                mesh.receiveShadow = receiveShadow;
                if (userData && Object.keys(userData).length > 0 && !mesh.userData.title) {
                    mesh.userData = { ...mesh.userData, ...userData };
                }
                // Apply material overrides based on mesh name or material name matching
                const meshName = mesh.name.toLowerCase();
                for (const [key, material] of Object.entries(materialOverrides)) {
                    const matchKey = key.toLowerCase();
                    const matName = Array.isArray(mesh.material)
                        ? mesh.material.map((m) => m.name.toLowerCase()).join(" ")
                        : mesh.material?.name?.toLowerCase() || "";
                    if (meshName.includes(matchKey) || matName.includes(matchKey)) {
                        mesh.material = material;
                    }
                }
                if (mesh.geometry) {
                    mesh.geometry.computeVertexNormals();
                }
            }
        });
    }
    /**
     * Load an entire manifest of assets in parallel
     */
    async loadAll(manifest) {
        const results = new Map();
        const promises = manifest.map(async (item) => {
            try {
                const model = await this.loadModel(item.url, item.options);
                results.set(item.key, model);
            }
            catch (err) {
                console.error(`[AssetLoader] Error loading ${item.key}:`, err);
                if (item.options && item.options.fallbackFn) {
                    results.set(item.key, item.options.fallbackFn(this.materials));
                }
            }
        });
        await Promise.all(promises);
        return results;
    }
    /**
     * Dispose cached geometries and materials
     */
    dispose() {
        this.cache.forEach((model) => {
            model.traverse((child) => {
                if (child.isMesh) {
                    const mesh = child;
                    if (mesh.geometry)
                        mesh.geometry.dispose();
                    if (mesh.material) {
                        if (Array.isArray(mesh.material)) {
                            mesh.material.forEach((m) => m.dispose());
                        }
                        else {
                            mesh.material.dispose();
                        }
                    }
                }
            });
        });
        this.cache.clear();
        if (this.dracoLoader && typeof this.dracoLoader.dispose === "function") {
            this.dracoLoader.dispose();
        }
    }
}
//# sourceMappingURL=AssetLoader.js.map