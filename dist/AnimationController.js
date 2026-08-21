/**
 * UltraFab 3D Laboratory Studio - AnimationController.ts
 * GSAP 3 Animation Controller for Exploded View Lerps, Camera Presets, and Exhaust Airflow Particles
 */
import * as THREE from "three";
export class AnimationController {
    sceneManager;
    isExploded = false;
    explodeProgress = { value: 0 };
    currentTimeline = null;
    particleSystem = null;
    particlesActive = true;
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.initAirflowParticles();
    }
    initAirflowParticles() {
        const particleCount = 200;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(particleCount * 3);
        const phases = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 3.5;
            pos[i * 3 + 1] = 0.95 + Math.random() * 2.0;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 3.5;
            phases[i * 3] = Math.random() * Math.PI * 2;
            phases[i * 3 + 1] = Math.random() * Math.PI * 2;
            phases[i * 3 + 2] = Math.random() * Math.PI * 2;
        }
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        const mat = new THREE.PointsMaterial({
            color: 0x38bdf8,
            size: 0.035,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });
        this.particleSystem = new THREE.Points(geo, mat);
        this.particleSystem.userData.phases = phases;
        this.particleSystem.visible = this.particlesActive;
        this.sceneManager.scene.add(this.particleSystem);
    }
    updateParticles(delta) {
        if (!this.particlesActive || !this.particleSystem)
            return;
        const positions = this.particleSystem.geometry.attributes.position.array;
        const count = positions.length / 3;
        for (let i = 0; i < count; i++) {
            positions[i * 3 + 1] += delta * 0.45;
            if (positions[i * 3 + 1] > 3.2) {
                positions[i * 3 + 1] = 0.92;
            }
        }
        this.particleSystem.geometry.attributes.position.needsUpdate = true;
    }
    toggleParticles(active) {
        this.particlesActive = active;
        if (this.particleSystem) {
            this.particleSystem.visible = active;
        }
    }
    /**
     * Set Exploded View with GSAP Smooth Lerp
     */
    setExplode(explodeState) {
        this.isExploded = explodeState;
        const targetValue = explodeState ? 1.0 : 0.0;
        if (this.currentTimeline) {
            this.currentTimeline.kill();
        }
        const modelRoot = this.sceneManager.currentModelRoot;
        if (!modelRoot)
            return;
        modelRoot.traverse((child) => {
            if (child.userData && child.userData.explodeOffset) {
                if (!child.userData.originPos) {
                    child.userData.originPos = child.position.clone();
                }
            }
        });
        if (typeof gsap !== "undefined") {
            this.currentTimeline = gsap.to(this.explodeProgress, {
                value: targetValue,
                duration: 1.2,
                ease: "power2.inOut",
                onUpdate: () => {
                    const t = this.explodeProgress.value;
                    modelRoot.traverse((child) => {
                        if (child.userData && child.userData.explodeOffset && child.userData.originPos) {
                            const orig = child.userData.originPos;
                            const off = child.userData.explodeOffset;
                            child.position.set(orig.x + off.x * t, orig.y + off.y * t, orig.z + off.z * t);
                        }
                    });
                },
            });
        }
        else {
            this.explodeProgress.value = targetValue;
            const t = targetValue;
            modelRoot.traverse((child) => {
                if (child.userData && child.userData.explodeOffset && child.userData.originPos) {
                    const orig = child.userData.originPos;
                    const off = child.userData.explodeOffset;
                    child.position.set(orig.x + off.x * t, orig.y + off.y * t, orig.z + off.z * t);
                }
            });
        }
    }
    /**
     * Smoothly Animate Camera to Preset Angles
     */
    setCameraPreset(presetId) {
        const presets = {
            iso: { pos: [4.8, 3.6, 6.2], target: [0, 1.1, 0] },
            front: { pos: [0, 1.6, 6.5], target: [0, 1.1, 0] },
            top: { pos: [0, 7.8, 0.01], target: [0, 0.5, 0] },
            side: { pos: [6.8, 1.8, 0], target: [0, 1.1, 0] },
            eyeLevel: { pos: [1.8, 1.45, 2.8], target: [-0.5, 1.0, -0.5] },
        };
        const targetPreset = presets[presetId] || presets.iso;
        const camera = this.sceneManager.camera;
        const controls = this.sceneManager.controls;
        if (typeof gsap !== "undefined") {
            gsap.to(camera.position, {
                x: targetPreset.pos[0],
                y: targetPreset.pos[1],
                z: targetPreset.pos[2],
                duration: 1.0,
                ease: "power2.inOut",
            });
            gsap.to(controls.target, {
                x: targetPreset.target[0],
                y: targetPreset.target[1],
                z: targetPreset.target[2],
                duration: 1.0,
                ease: "power2.inOut",
                onUpdate: () => controls.update(),
            });
        }
        else {
            camera.position.set(...targetPreset.pos);
            controls.target.set(...targetPreset.target);
            controls.update();
        }
    }
    dispose() {
        if (this.currentTimeline) {
            this.currentTimeline.kill();
        }
        if (this.particleSystem) {
            if (this.particleSystem.geometry)
                this.particleSystem.geometry.dispose();
            if (this.particleSystem.material) {
                if (Array.isArray(this.particleSystem.material)) {
                    this.particleSystem.material.forEach((m) => m.dispose());
                }
                else {
                    this.particleSystem.material.dispose();
                }
            }
            this.sceneManager.scene.remove(this.particleSystem);
        }
    }
}
//# sourceMappingURL=AnimationController.js.map