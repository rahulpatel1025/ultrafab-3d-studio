/**
 * UltraFab 3D Laboratory Studio - SceneManager.ts
 * Three.js Lifecycle, PMREM Studio HDRI Environment, Lighting, OrbitControls, ResizeObserver, and GPU Memory Disposal
 */
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
export class SceneManager {
    container;
    width;
    height;
    scene;
    camera;
    renderer;
    controls;
    pmremGenerator = null;
    envMapTexture = null;
    currentModelRoot = null;
    activeSkeletonProxy = null;
    resizeObserver = null;
    autoRotateActive = false;
    autoRotateSpeed = 1.5;
    constructor(containerElement) {
        this.container = containerElement;
        this.width = containerElement.clientWidth || window.innerWidth || 800;
        this.height = containerElement.clientHeight || window.innerHeight || 600;
        this.initScene();
        this.initLighting();
        this.initEnvironment();
        this.initControls();
        this.initResizeObserver();
    }
    initScene() {
        // 1. Core Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x060913); // Deep Antigravity Navy
        // 2. Perspective Camera (42° FOV for realistic architectural perspective)
        const aspect = (this.width && this.height) ? this.width / this.height : 1.6;
        this.camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
        this.camera.position.set(4.8, 3.6, 6.2);
        const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        // 3. WebGL Renderer with High-DPI Clamping & ACES Filmic Tone Mapping
        this.renderer = new THREE.WebGLRenderer({
            antialias: !isMobile,
            powerPreference: "high-performance",
            alpha: false,
        });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = isMobile ? THREE.BasicShadowMap : THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.3;
        this.renderer.domElement.style.position = "absolute";
        this.renderer.domElement.style.top = "0";
        this.renderer.domElement.style.left = "0";
        this.renderer.domElement.style.width = "100%";
        this.renderer.domElement.style.height = "100%";
        this.renderer.domElement.style.zIndex = "0";
        this.renderer.domElement.style.touchAction = "none";
        this.container.appendChild(this.renderer.domElement);
    }
    initLighting() {
        // 1. Ambient Cleanroom Fill Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
        this.scene.add(ambientLight);
        const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        const shadowSize = isMobile ? 1024 : 2048;
        // 2. Main Overhead Studio Spotlight (Cast Soft Shadows)
        const mainSpot = new THREE.SpotLight(0xffffff, 2.4);
        mainSpot.position.set(6, 9, 6);
        mainSpot.angle = Math.PI / 3.5;
        mainSpot.penumbra = 0.55;
        mainSpot.castShadow = true;
        mainSpot.shadow.mapSize.width = shadowSize;
        mainSpot.shadow.mapSize.height = shadowSize;
        mainSpot.shadow.bias = -0.0001;
        this.scene.add(mainSpot);
        // 3. Cyan Rim Light for Antigravity Edge Separation
        const cyanRim = new THREE.DirectionalLight(0x38bdf8, 1.2);
        cyanRim.position.set(-6, 6, -5);
        this.scene.add(cyanRim);
        // 4. Warm Countertop Accent Light
        const warmAccent = new THREE.PointLight(0xfef08a, 1.0, 8);
        warmAccent.position.set(0, 2.5, 0);
        this.scene.add(warmAccent);
        // 5. Floor Technical Spatial Grid
        const grid = new THREE.GridHelper(14, 28, 0x00529b, 0x1e293b);
        grid.position.y = -0.002;
        this.scene.add(grid);
    }
    /**
     * PMREM Procedural HDRI Studio Environment Map
     */
    initEnvironment() {
        if (typeof document === "undefined")
            return;
        this.pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        this.pmremGenerator.compileEquirectangularShader();
        const envCanvas = document.createElement("canvas");
        envCanvas.width = 512;
        envCanvas.height = 256;
        const ctx = envCanvas.getContext("2d");
        if (ctx) {
            const grad = ctx.createLinearGradient(0, 0, 0, 256);
            grad.addColorStop(0, "#e2e8f0");
            grad.addColorStop(0.4, "#94a3b8");
            grad.addColorStop(0.7, "#334155");
            grad.addColorStop(1, "#0f172a");
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, 512, 256);
            ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
            ctx.beginPath();
            ctx.ellipse(256, 40, 140, 30, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        const envTexture = new THREE.CanvasTexture(envCanvas);
        envTexture.mapping = THREE.EquirectangularReflectionMapping;
        const renderTarget = this.pmremGenerator.fromEquirectangular(envTexture);
        this.scene.environment = renderTarget.texture;
        this.envMapTexture = renderTarget.texture;
        envTexture.dispose();
    }
    initControls() {
        const threeScope = typeof window !== "undefined" && window.THREE ? window.THREE : THREE;
        const ControlsConstructor = threeScope.OrbitControls || OrbitControls;
        this.controls = new ControlsConstructor(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.06;
        this.controls.maxPolarAngle = Math.PI / 2 + 0.05;
        this.controls.minDistance = 1.0;
        this.controls.maxDistance = 18.0;
        this.controls.target.set(0, 1.1, 0);
        this.controls.autoRotate = this.autoRotateActive;
        this.controls.autoRotateSpeed = this.autoRotateSpeed;
        this.controls.update();
    }
    initResizeObserver() {
        if (typeof ResizeObserver !== "undefined") {
            this.resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const { width, height } = entry.contentRect;
                    if (width > 0 && height > 0) {
                        this.handleResize(width, height);
                    }
                }
            });
            this.resizeObserver.observe(this.container);
        }
        if (typeof window !== "undefined") {
            window.addEventListener("resize", () => {
                const w = this.container.clientWidth || window.innerWidth;
                const h = this.container.clientHeight || window.innerHeight;
                if (w > 0 && h > 0) {
                    this.handleResize(w, h);
                }
            });
        }
    }
    handleResize(width, height) {
        if (!width || !height || width <= 0 || height <= 0)
            return;
        this.width = width;
        this.height = height;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2));
    }
    /**
     * Mounts a holographic wireframe skeleton proxy immediately on frame 1 or during model switch
     */
    mountSkeletonProxy(skeletonGroup) {
        if (this.currentModelRoot) {
            this.disposeHierarchy(this.currentModelRoot);
            this.scene.remove(this.currentModelRoot);
            this.currentModelRoot = null;
        }
        if (this.activeSkeletonProxy) {
            this.disposeHierarchy(this.activeSkeletonProxy);
            this.scene.remove(this.activeSkeletonProxy);
            this.activeSkeletonProxy = null;
        }
        this.activeSkeletonProxy = skeletonGroup;
        this.scene.add(this.activeSkeletonProxy);
    }
    /**
     * Smoothly cross-fades from holographic wireframe skeleton proxy (opacity 1 -> 0)
     * to full PBR model (opacity 0 -> 1) over duration (default 0.6s) with GSAP
     */
    async transitionFromSkeleton(fullModelGroup, duration = 0.5) {
        const skeleton = this.activeSkeletonProxy;
        // 1. Mount full high-detail PBR model directly to scene
        this.scene.add(fullModelGroup);
        this.currentModelRoot = fullModelGroup;
        // 2. Smoothly fade out the wireframe skeleton proxy if present
        if (skeleton && typeof gsap !== "undefined") {
            const state = { opacity: 0.85 };
            await new Promise((resolve) => {
                gsap.to(state, {
                    opacity: 0,
                    duration,
                    ease: "power2.out",
                    onUpdate: () => {
                        skeleton.traverse((child) => {
                            if (child.isMesh) {
                                const mesh = child;
                                if (mesh.material && !Array.isArray(mesh.material)) {
                                    mesh.material.opacity = state.opacity;
                                }
                            }
                        });
                    },
                    onComplete: () => {
                        this.disposeHierarchy(skeleton);
                        this.scene.remove(skeleton);
                        this.activeSkeletonProxy = null;
                        resolve();
                    },
                });
            });
        }
        else if (skeleton) {
            this.disposeHierarchy(skeleton);
            this.scene.remove(skeleton);
            this.activeSkeletonProxy = null;
        }
    }
    /**
     * Set Current Active Model with Strict Memory Disposal of Previous Model
     */
    setModel(newModelGroup) {
        if (this.activeSkeletonProxy) {
            this.disposeHierarchy(this.activeSkeletonProxy);
            this.scene.remove(this.activeSkeletonProxy);
            this.activeSkeletonProxy = null;
        }
        if (this.currentModelRoot) {
            this.disposeHierarchy(this.currentModelRoot);
            this.scene.remove(this.currentModelRoot);
            this.currentModelRoot = null;
        }
        this.currentModelRoot = newModelGroup;
        this.scene.add(this.currentModelRoot);
    }
    /**
     * Strict GPU Memory Disposal Protocol
     */
    disposeHierarchy(node) {
        if (!node)
            return;
        node.traverse((child) => {
            if (child.isMesh || child.isPoints) {
                const mesh = child;
                if (mesh.geometry) {
                    mesh.geometry.dispose();
                }
                if (mesh.material) {
                    if (Array.isArray(mesh.material)) {
                        mesh.material.forEach((m) => this.disposeMaterial(m));
                    }
                    else {
                        this.disposeMaterial(mesh.material);
                    }
                }
            }
        });
    }
    disposeMaterial(mat) {
        if (!mat)
            return;
        Object.keys(mat).forEach((prop) => {
            const p = mat[prop];
            if (p && typeof p.dispose === "function") {
                p.dispose();
            }
        });
        mat.dispose();
    }
    toggleAutoRotate(active, speed = 1.5) {
        this.autoRotateActive = active;
        this.autoRotateSpeed = speed;
        if (this.controls) {
            this.controls.autoRotate = active;
            this.controls.autoRotateSpeed = speed;
        }
    }
    dispose() {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        if (this.currentModelRoot) {
            this.disposeHierarchy(this.currentModelRoot);
        }
        if (this.activeSkeletonProxy) {
            this.disposeHierarchy(this.activeSkeletonProxy);
        }
        if (this.pmremGenerator) {
            this.pmremGenerator.dispose();
        }
        if (this.envMapTexture) {
            this.envMapTexture.dispose();
        }
        if (this.renderer) {
            this.renderer.dispose();
            if (this.renderer.domElement && this.renderer.domElement.parentNode) {
                this.renderer.domElement.parentNode.removeChild(this.renderer.domElement);
            }
        }
    }
}
//# sourceMappingURL=SceneManager.js.map