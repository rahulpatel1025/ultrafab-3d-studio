/**
 * UltraFab 3D Laboratory Studio - ModelGenerators.ts
 * Hybrid 3D Procedural & Asset Model Generator for Laboratory Furniture & Spatial Suites
 *
 * Standards:
 * - 1:1 Metric Scale (1 Three.js unit = 1 meter)
 * - Beveled & Rounded Geometries (No harsh 90° mathematical razor edges)
 * - Accurate UV mapping for PBR textures
 * - Explode Vector hierarchies for GSAP teardown animations
 * - Raycaster metadata for interactive component inspection popovers
 */
import * as THREE from "three";
import { MaterialLibrary } from "./MaterialLibrary.js";
import { AssetLoader } from "./AssetLoader.js";
import { LabModelMode } from "./types.js";
/**
 * Creates a high-fidelity Rounded Box Geometry with beveled edges to catch specular highlights
 */
export declare function createRoundedBoxGeometry(width: number, height: number, depth: number, radius?: number, segments?: number): THREE.BufferGeometry;
export declare class ModelGenerators {
    materials: MaterialLibrary;
    assets: AssetLoader;
    constructor(materialLibrary: MaterialLibrary, assetLoader: AssetLoader);
    /**
     * Instantly generate low-poly wireframe bounding proxy geometries for frame 1 rendering
     */
    createSkeletonProxy(modelType: LabModelMode): THREE.Group;
    /**
     * C-Frame / H-Frame Modular Steel Tubular Leg Support with Leveling Studs
     */
    createModularLegFrame(width?: number, height?: number, depth?: number): THREE.Group;
    /**
     * Modular Under-Bench Storage Cabinet with Vibrant Blue Drawer Fascia & D-Handles
     */
    createModularCabinet(width?: number, height?: number, depth?: number, type?: "drawer-door" | "double-door"): THREE.Group;
    /**
     * Corner Pentagonal 45-Degree Modular Base Cabinet (Image 1 & 3)
     */
    createCornerCabinet(width?: number, height?: number, depth?: number): THREE.Group;
    /**
     * Vibrant Blue Backsplash Electrical Service Raceway Trunking with Multi-Pin Sockets
     */
    createElectricalRaceway(length?: number, height?: number, depth?: number, numSockets?: number): THREE.Group;
    /**
     * Wall-Mounted Overhead Storage Cabinet Suite with Glass Doors & Blue Frame Profile (Image 1)
     */
    createOverheadGlassCabinetSuite(numUnits?: number, unitWidth?: number, height?: number, depth?: number): THREE.Group;
    /**
     * Dual Sink Station with 3-Way Gooseneck Faucets & Glassware Drying Pegboard (Image 2 & 3)
     */
    createDualSinkStation(width?: number, height?: number, depth?: number): THREE.Group;
    /**
     * 2-Tier Reagent Shelving Rack with Integrated Blue Electrical Raceway (Image 2 & 3)
     */
    createReagentShelvingRack(length?: number, height?: number, depth?: number): THREE.Group;
    /**
     * Precision Laboratory Thermal Equipment (Electric Oven / Muffle Furnace - Image 4)
     */
    createThermalEquipment(type?: "heraeusOven" | "muffleFurnace" | "hotAirOven" | "desiccator", width?: number, height?: number, depth?: number): THREE.Group;
    buildLShapedWorkstationScene(): THREE.Group;
    buildSinkIslandScene(): THREE.Group;
    buildMicrobiologySuiteScene(): THREE.Group;
    buildOvenRoomScene(): THREE.Group;
}
