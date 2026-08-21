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
import { LabModelMode, ComponentMetadata } from "./types.js";

/**
 * Creates a high-fidelity Rounded Box Geometry with beveled edges to catch specular highlights
 */
export function createRoundedBoxGeometry(
  width: number,
  height: number,
  depth: number,
  radius: number = 0.012,
  segments: number = 4
): THREE.BufferGeometry {
  const maxRadius = Math.min(width, height, depth) * 0.45;
  const r = Math.min(radius, maxRadius);

  const shape = new THREE.Shape();
  const w = width - 2 * r;
  const h = height - 2 * r;

  shape.moveTo(-w / 2, -h / 2 + r);
  shape.lineTo(-w / 2, h / 2 - r);
  shape.absarc(-w / 2 + r, h / 2 - r, r, Math.PI, Math.PI / 2, true);
  shape.lineTo(w / 2 - r, h / 2);
  shape.absarc(w / 2 - r, h / 2 - r, r, Math.PI / 2, 0, true);
  shape.lineTo(w / 2, -h / 2 + r);
  shape.absarc(w / 2 - r, -h / 2 + r, r, 0, -Math.PI / 2, true);
  shape.lineTo(-w / 2 + r, -h / 2);
  shape.absarc(-w / 2 + r, -h / 2 + r, r, -Math.PI / 2, Math.PI, true);

  const extrudeSettings: THREE.ExtrudeGeometryOptions = {
    steps: 1,
    depth: depth - 2 * r,
    bevelEnabled: true,
    bevelSegments: segments,
    bevelSize: r,
    bevelThickness: r,
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  geometry.center();
  geometry.computeVertexNormals();
  return geometry;
}

export class ModelGenerators {
  public materials: MaterialLibrary;
  public assets: AssetLoader;

  constructor(materialLibrary: MaterialLibrary, assetLoader: AssetLoader) {
    this.materials = materialLibrary;
    this.assets = assetLoader;
  }

  // =========================================================================
  // 3D HOLOGRAPHIC SKELETON PROXY GENERATOR (FRAME 1 INSTANT MOUNT)
  // =========================================================================

  /**
   * Instantly generate low-poly wireframe bounding proxy geometries for frame 1 rendering
   */
  public createSkeletonProxy(modelType: LabModelMode): THREE.Group {
    const root = new THREE.Group();
    root.name = `SkeletonProxy_${modelType}`;

    const skeletonMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.85,
      name: "skeletonProxyMat",
    });

    const addBox = (w: number, h: number, d: number, x: number, y: number, z: number): THREE.Mesh => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const mesh = new THREE.Mesh(geo, skeletonMat);
      mesh.position.set(x, y, z);
      root.add(mesh);
      return mesh;
    };

    switch (modelType) {
      case "lBench":
        // Floor & Walls
        addBox(6.5, 0.02, 6.5, 0, 0, 0);
        addBox(0.15, 3.4, 5.2, -2.6, 1.7, 0);
        addBox(5.2, 3.4, 0.15, 0, 1.7, -2.6);
        // L-Worktops
        addBox(0.75, 0.045, 2.7, -2.0, 0.88, 0.35);
        addBox(3.2, 0.045, 0.75, 0.45, 0.88, -2.0);
        addBox(0.75, 0.045, 0.75, -2.0, 0.88, -2.0);
        // Base Cabinets
        addBox(0.7, 0.86, 2.6, -2.0, 0.43, 0.35);
        addBox(3.0, 0.86, 0.7, 0.45, 0.43, -2.0);
        addBox(0.85, 0.86, 0.85, -1.45, 0.43, -1.45);
        // Overhead Glass Cabinet Suite Block
        addBox(0.35, 0.65, 2.64, -2.38, 2.15, 0.35);
        // Raceways
        addBox(0.06, 0.14, 2.6, -2.45, 0.98, 0.35);
        addBox(3.2, 0.14, 0.06, 0.45, 0.98, -2.45);
        break;

      case "sinkIsland":
        // Floor & Walls
        addBox(7.0, 0.02, 7.0, 0, 0, 0);
        addBox(6.8, 3.4, 0.15, 0, 1.7, -2.8);
        addBox(0.15, 3.4, 5.8, -2.9, 1.7, 0);
        // Sink Bench & Extension
        addBox(0.75, 0.9, 3.0, -2.45, 0.45, -0.05);
        addBox(0.48, 0.68, 0.04, -2.75, 1.32, -0.9); // Pegboard
        // Island Bench & 2-Tier Reagent Rack
        addBox(2.6, 0.88, 1.35, 0.6, 0.44, 0.2);
        addBox(2.4, 0.75, 0.35, 0.6, 1.28, 0.2);
        break;

      case "microbio":
        // Floor & Walls
        addBox(8.5, 0.02, 8.5, 0, 0, 0);
        addBox(8.2, 3.4, 0.15, 0, 1.7, -3.8);
        addBox(0.15, 3.4, 7.8, -3.8, 1.7, 0);
        // U-Bench Perimeter Run
        addBox(3.6, 0.88, 0.75, -1.6, 0.44, -3.3);
        addBox(0.75, 0.88, 4.2, -3.3, 0.44, -1.0);
        // Center T-Island Peninsula
        addBox(3.2, 0.88, 1.4, 0.4, 0.44, 0.2);
        addBox(2.2, 0.75, 0.35, 0.7, 1.28, 0.2);
        break;

      case "ovenRoom":
        // Floor & Walls (4.25 x 5.575 CAD)
        addBox(4.25, 0.02, 5.575, 0, 0, 0);
        addBox(0.12, 3.2, 5.575, -2.125, 1.6, 0);
        addBox(0.12, 3.2, 5.575, 2.125, 1.6, 0);
        addBox(4.25, 3.2, 0.12, 0, 1.6, -2.787);
        // Left, Top, Right Equipment Bench Runs
        addBox(0.75, 0.88, 4.4, -1.675, 0.44, -0.3);
        addBox(3.0, 0.88, 0.75, 0.3, 0.44, -2.337);
        addBox(0.75, 0.88, 4.4, 1.675, 0.44, -0.3);
        // Equipment Proxies (Ovens & Furnaces)
        for (let z = -1.9; z <= 1.25; z += 1.05) {
          addBox(0.68, 0.78, 0.62, -1.675, 1.27, z);
          addBox(0.68, 0.78, 0.62, 1.675, 1.27, z);
        }
        addBox(0.72, 0.82, 0.65, -0.6, 1.29, -2.337);
        addBox(0.72, 0.82, 0.65, 0.6, 1.29, -2.337);
        // Technician Bench & Duct
        addBox(3.0, 0.88, 0.75, 0, 0.44, 2.237);
        addBox(0.36, 0.36, 4.7, 0, 2.85, 0);
        break;

      default:
        addBox(4.0, 0.88, 4.0, 0, 0.44, 0);
        break;
    }

    return root;
  }

  // =========================================================================
  // SUB-COMPONENTS: HIGH FIDELITY HYBRID FIXTURES & PROCEDURAL DETAILS
  // =========================================================================

  /**
   * C-Frame / H-Frame Modular Steel Tubular Leg Support with Leveling Studs
   */
  public createModularLegFrame(width: number = 0.6, height: number = 0.86, depth: number = 0.65): THREE.Group {
    const group = new THREE.Group();
    const tubeGeo = new THREE.BoxGeometry(0.032, height, 0.032);
    const crossGeo = new THREE.BoxGeometry(width - 0.04, 0.032, 0.032);
    const depthGeo = new THREE.BoxGeometry(0.032, 0.032, depth - 0.04);

    const xOffsets = [-width / 2 + 0.02, width / 2 - 0.02];
    const zOffsets = [-depth / 2 + 0.02, depth / 2 - 0.02];

    for (const x of xOffsets) {
      for (const z of zOffsets) {
        const leg = new THREE.Mesh(tubeGeo, this.materials.grayAccentMat);
        leg.position.set(x, height / 2, z);
        leg.castShadow = true;
        group.add(leg);

        const foot = new THREE.Mesh(
          new THREE.CylinderGeometry(0.022, 0.025, 0.035, 16),
          this.materials.stainlessMat
        );
        foot.position.set(x, 0.018, z);
        group.add(foot);
      }
    }

    for (const x of xOffsets) {
      const barZ = new THREE.Mesh(depthGeo, this.materials.grayAccentMat);
      barZ.position.set(x, 0.12, 0);
      group.add(barZ);
    }

    const barRear = new THREE.Mesh(crossGeo, this.materials.grayAccentMat);
    barRear.position.set(0, 0.12, -depth / 2 + 0.02);
    group.add(barRear);

    return group;
  }

  /**
   * Modular Under-Bench Storage Cabinet with Vibrant Blue Drawer Fascia & D-Handles
   */
  public createModularCabinet(
    width: number = 0.6,
    height: number = 0.82,
    depth: number = 0.62,
    type: "drawer-door" | "double-door" = "drawer-door"
  ): THREE.Group {
    const group = new THREE.Group();
    group.userData = {
      title: `${type === "drawer-door" ? "1-Drawer 1-Door" : "2-Door"} Modular Storage Cabinet`,
      category: "Laboratory Under-Bench Cabinetry",
      specs: `Dimensions: ${Math.round(width * 1000)}W x ${Math.round(depth * 1000)}D x ${Math.round(height * 1000)}H mm | CRCA Galvanized Steel (0.9mm)`,
      description: "Heavy-duty CRCA steel base cabinet with pure polyester powder coating (60-80 microns), full-extension soft-close ball bearing slides, and sound-dampened double-skin door construction.",
      oemCode: `UF-BC-${Math.round(width * 100)}`,
    } as ComponentMetadata;

    // 1. Carcass Body (Light Grey Powder Coated)
    const carcassGeo = createRoundedBoxGeometry(width - 0.01, height, depth, 0.008, 3);
    const carcass = new THREE.Mesh(carcassGeo, this.materials.mainMat);
    carcass.position.set(0, height / 2, 0);
    carcass.castShadow = true;
    carcass.receiveShadow = true;
    group.add(carcass);

    const handleMat = this.materials.stainlessMat;

    // 2. Front Drawer Fascia (Vibrant Blue Finish)
    const drawerHeight = 0.18;
    const isDoubleDoor = width >= 0.75;

    if (isDoubleDoor) {
      const drwW = (width - 0.03) / 2;
      const drwGeo = createRoundedBoxGeometry(drwW, drawerHeight - 0.01, 0.02, 0.006, 3);

      // Left Drawer
      const drwL = new THREE.Mesh(drwGeo, this.materials.blueAccentMat);
      drwL.position.set(-drwW / 2 - 0.005, height - drawerHeight / 2 - 0.01, depth / 2 + 0.012);
      drwL.castShadow = true;
      drwL.userData = {
        title: "Left Utility Blue Drawer",
        category: "Cabinetry Components",
        specs: "CRCA Sheet | RAL 5010 Blue | Soft-Close Slides",
        description: "Smooth-gliding heavy-duty top utility drawer.",
        oemCode: "UF-DRW-L",
        explodeOffset: { x: 0, y: 0, z: 0.35 },
      } as ComponentMetadata;
      group.add(drwL);

      const handleDrwL = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, drwW * 0.45, 12), handleMat);
      handleDrwL.rotation.z = Math.PI / 2;
      handleDrwL.position.set(0, 0, 0.018);
      drwL.add(handleDrwL);

      // Right Drawer
      const drwR = new THREE.Mesh(drwGeo, this.materials.blueAccentMat);
      drwR.position.set(drwW / 2 + 0.005, height - drawerHeight / 2 - 0.01, depth / 2 + 0.012);
      drwR.castShadow = true;
      drwR.userData = {
        title: "Right Utility Blue Drawer",
        category: "Cabinetry Components",
        specs: "CRCA Sheet | RAL 5010 Blue | Soft-Close Slides",
        description: "Smooth-gliding heavy-duty top utility drawer.",
        oemCode: "UF-DRW-R",
        explodeOffset: { x: 0, y: 0, z: 0.35 },
      } as ComponentMetadata;
      group.add(drwR);

      const handleDrwR = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, drwW * 0.45, 12), handleMat);
      handleDrwR.rotation.z = Math.PI / 2;
      handleDrwR.position.set(0, 0, 0.018);
      drwR.add(handleDrwR);
    } else {
      const drawerGeo = createRoundedBoxGeometry(width - 0.02, drawerHeight - 0.01, 0.02, 0.006, 3);
      const drawerFascia = new THREE.Mesh(drawerGeo, this.materials.blueAccentMat);
      drawerFascia.position.set(0, height - drawerHeight / 2 - 0.01, depth / 2 + 0.012);
      drawerFascia.castShadow = true;
      drawerFascia.userData = {
        title: "Vibrant Blue Top Utility Drawer",
        category: "Cabinetry Components",
        specs: "Material: Double-Skin CRCA Sheet | Finish: RAL 5010 Epoxy Powder Coat",
        description: "Smooth-gliding heavy-duty top utility drawer rated for 45kg static payload with ergonomic stainless steel D-handle.",
        oemCode: "UF-DRW-BLU",
        explodeOffset: { x: 0, y: 0, z: 0.35 },
      } as ComponentMetadata;
      group.add(drawerFascia);

      const drawerHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, width * 0.45, 12), handleMat);
      drawerHandle.rotation.z = Math.PI / 2;
      drawerHandle.position.set(0, 0, 0.018);
      drawerFascia.add(drawerHandle);
    }

    // 3. Lower Doors (Single or Double Door)
    const doorHeight = height - drawerHeight - 0.04;

    if (isDoubleDoor) {
      const doorW = (width - 0.03) / 2;
      const doorGeo = createRoundedBoxGeometry(doorW, doorHeight, 0.02, 0.006, 3);

      const doorL = new THREE.Mesh(doorGeo, this.materials.mainMat);
      doorL.position.set(-doorW / 2 - 0.005, doorHeight / 2 + 0.01, depth / 2 + 0.012);
      doorL.castShadow = true;
      doorL.userData = {
        title: "Left Base Cabinet Hinged Door",
        category: "Cabinetry Components",
        specs: "Hinges: 110° Opening Soft-Close Concealed European Hinges",
        description: "Double-walled acoustic dampened door panel with magnetic latch and anti-corrosion chemical lining.",
        oemCode: "UF-DOR-L",
        explodeOffset: { x: -0.12, y: 0, z: 0.20 },
        explodeRotation: { x: 0, y: Math.PI / 2.6, z: 0 },
      } as ComponentMetadata;
      group.add(doorL);

      const handleL = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.18, 12), handleMat);
      handleL.position.set(doorW * 0.35, 0, 0.018);
      doorL.add(handleL);

      const doorR = new THREE.Mesh(doorGeo, this.materials.mainMat);
      doorR.position.set(doorW / 2 + 0.005, doorHeight / 2 + 0.01, depth / 2 + 0.012);
      doorR.castShadow = true;
      doorR.userData = {
        title: "Right Base Cabinet Hinged Door",
        category: "Cabinetry Components",
        specs: "Hinges: 110° Opening Soft-Close Concealed European Hinges",
        description: "Double-walled acoustic dampened door panel with magnetic latch.",
        oemCode: "UF-DOR-R",
        explodeOffset: { x: 0.12, y: 0, z: 0.20 },
        explodeRotation: { x: 0, y: -Math.PI / 2.6, z: 0 },
      } as ComponentMetadata;
      group.add(doorR);

      const handleR = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.18, 12), handleMat);
      handleR.position.set(-doorW * 0.35, 0, 0.018);
      doorR.add(handleR);
    } else {
      const doorGeo = createRoundedBoxGeometry(width - 0.02, doorHeight, 0.02, 0.006, 3);
      const door = new THREE.Mesh(doorGeo, this.materials.mainMat);
      door.position.set(0, doorHeight / 2 + 0.01, depth / 2 + 0.012);
      door.castShadow = true;
      door.userData = {
        title: "Single Base Cabinet Hinged Door",
        category: "Cabinetry Components",
        specs: "Concealed 3D Adjustable Soft-Close Hinges | Magnetic Catch",
        description: "Heavy-duty single cabinet door with durable powder-coated finish.",
        oemCode: "UF-DOR-S",
        explodeOffset: { x: 0.12, y: 0, z: 0.20 },
        explodeRotation: { x: 0, y: -Math.PI / 2.6, z: 0 },
      } as ComponentMetadata;
      group.add(door);

      const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.18, 12), handleMat);
      handle.position.set(width * 0.35, 0, 0.018);
      door.add(handle);
    }

    return group;
  }

  /**
   * Corner Pentagonal 45-Degree Modular Base Cabinet (Image 1 & 3)
   */
  public createCornerCabinet(width: number = 0.9, height: number = 0.86, depth: number = 0.65): THREE.Group {
    const group = new THREE.Group();
    group.userData = {
      title: "45° Corner Modular Workstation Base Cabinet",
      category: "Laboratory Workstation Corner Solution",
      specs: `Footprint: ${Math.round(width * 1000)} x ${Math.round(width * 1000)} mm | Depth: ${Math.round(depth * 1000)} mm | Height: ${Math.round(height * 1000)} mm`,
      description: "Ergonomic 45-degree angled corner workstation base unit allowing uninterrupted legroom and maximum storage capacity for L-shaped and U-shaped laboratory runs.",
      oemCode: "UF-CRN-45",
    } as ComponentMetadata;

    // Pentagon footprint in local coordinates [0, 0] to [width, width]
    const shape = new THREE.Shape();
    shape.moveTo(0, 0); // Wall corner
    shape.lineTo(width, 0); // Along right back wall
    shape.lineTo(width, width - depth); // Right cabinet junction
    shape.lineTo(width - depth, width); // Left cabinet junction (45 deg diagonal front)
    shape.lineTo(0, width); // Along left back wall
    shape.closePath();

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      depth: height,
      bevelEnabled: true,
      bevelSize: 0.006,
      bevelThickness: 0.006,
      bevelSegments: 3,
    };
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geom.rotateX(Math.PI / 2);

    const cornerBody = new THREE.Mesh(geom, this.materials.mainMat);
    cornerBody.position.set(0, height, 0);
    cornerBody.castShadow = true;
    cornerBody.receiveShadow = true;
    group.add(cornerBody);

    // Front Diagonal Fascia & Door
    const diagWidth = Math.SQRT2 * (depth * 0.72); // ~0.66m
    const diagCenterX = (width + (width - depth)) / 2;
    const diagCenterZ = ((width - depth) + width) / 2;

    // Top Blue Accent Fascia on 45° face
    const drawerGeo = createRoundedBoxGeometry(diagWidth, 0.18, 0.02, 0.006, 3);
    const drawerMesh = new THREE.Mesh(drawerGeo, this.materials.blueAccentMat);
    drawerMesh.position.set(diagCenterX, height - 0.10, diagCenterZ);
    drawerMesh.rotation.y = -Math.PI / 4;
    drawerMesh.castShadow = true;
    drawerMesh.userData = {
      title: "45° Corner Top Utility Drawer",
      category: "Cabinetry Components",
      specs: "CRCA Sheet | RAL 5010 Blue",
      description: "Ergonomic 45-degree slide utility drawer.",
      oemCode: "UF-DRW-CRN",
      explodeOffset: { x: 0.25, y: 0, z: 0.25 },
    } as ComponentMetadata;
    group.add(drawerMesh);

    // Lower Door on 45° face
    const doorHeight = height - 0.24;
    const doorGeo = createRoundedBoxGeometry(diagWidth, doorHeight, 0.02, 0.006, 3);
    const doorMesh = new THREE.Mesh(doorGeo, this.materials.mainMat);
    doorMesh.position.set(diagCenterX, doorHeight / 2 + 0.02, diagCenterZ);
    doorMesh.rotation.y = -Math.PI / 4;
    doorMesh.castShadow = true;
    doorMesh.userData = {
      title: "45° Corner Base Cabinet Hinged Door",
      category: "Cabinetry Components",
      specs: "110° Concealed Hinges | Key Lock Cylinder",
      description: "Corner access door swinging outward.",
      oemCode: "UF-DOR-CRN",
      explodeOffset: { x: 0.15, y: 0, z: 0.15 },
      explodeRotation: { x: 0, y: -Math.PI / 2.6, z: 0 },
    } as ComponentMetadata;
    group.add(doorMesh);

    // Stainless D-Handle on door
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.18, 12),
      this.materials.stainlessMat
    );
    handle.position.set(0.18, 0, 0.02);
    doorMesh.add(handle);

    return group;
  }

  /**
   * Vibrant Blue Backsplash Electrical Service Raceway Trunking with Multi-Pin Sockets
   */
  public createElectricalRaceway(
    length: number = 2.0,
    height: number = 0.14,
    depth: number = 0.08,
    numSockets: number = 3
  ): THREE.Group {
    const group = new THREE.Group();
    group.userData = {
      title: "Vibrant Blue Dual-Channel Electrical Raceway Trunking",
      category: "Laboratory Utility Distribution",
      specs: `Length: ${Math.round(length * 1000)} mm | Profile: 140x80 mm Extruded Sheet / Aluminium | IP54 Dust & Splash Rated`,
      description: "Continuous modular service raceway finished in signature UltraFab blue with integrated 6/16A universal power sockets, dedicated MCB/ELCB breakers, and data/RJ45 communication ports.",
      oemCode: "UF-ERW-BLU",
    } as ComponentMetadata;

    const bodyGeo = createRoundedBoxGeometry(length, height, depth, 0.006, 3);
    const body = new THREE.Mesh(bodyGeo, this.materials.blueAccentMat);
    body.position.set(0, height / 2, 0);
    body.castShadow = true;
    group.add(body);

    const spacing = length / (numSockets + 1);
    for (let i = 1; i <= numSockets; i++) {
      const socketX = -length / 2 + i * spacing;

      const plateGeo = createRoundedBoxGeometry(0.09, 0.09, 0.008, 0.004, 2);
      const plate = new THREE.Mesh(plateGeo, this.materials.socketPlateMat);
      plate.position.set(socketX, height / 2, depth / 2 + 0.005);
      plate.userData = {
        title: "230V 16A Dual Multi-Pin Universal Socket Module",
        category: "Electrical Utilities",
        specs: "Rating: 230V AC, 16A, 50Hz | Shuttered Child-Safe Sockets | Indicator Neon",
        description: "Modular power outlet module with independent rocker switch for high-draw laboratory analytical instruments.",
        oemCode: "UF-SKT-230V",
      } as ComponentMetadata;
      group.add(plate);

      for (const pinY of [-0.015, 0.015]) {
        const pin = new THREE.Mesh(
          new THREE.CylinderGeometry(0.007, 0.007, 0.003, 12),
          new THREE.MeshBasicMaterial({ color: 0x1e293b })
        );
        pin.rotation.x = Math.PI / 2;
        pin.position.set(-0.018, pinY, 0.005);
        plate.add(pin);
      }

      const earthPin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.009, 0.009, 0.003, 12),
        new THREE.MeshBasicMaterial({ color: 0x1e293b })
      );
      earthPin.rotation.x = Math.PI / 2;
      earthPin.position.set(-0.018, 0.025, 0.005);
      plate.add(earthPin);

      const rocker = new THREE.Mesh(
        new THREE.BoxGeometry(0.016, 0.028, 0.006),
        this.materials.socketRockerMat
      );
      rocker.position.set(0.022, 0.005, 0.005);
      plate.add(rocker);
    }

    return group;
  }

  /**
   * Wall-Mounted Overhead Storage Cabinet Suite with Glass Doors & Blue Frame Profile (Image 1)
   */
  public createOverheadGlassCabinetSuite(
    numUnits: number = 6,
    unitWidth: number = 0.45,
    height: number = 0.65,
    depth: number = 0.35
  ): THREE.Group {
    const group = new THREE.Group();
    const totalWidth = numUnits * unitWidth;
    group.userData = {
      title: `${numUnits}-Door Wall-Mounted Overhead Glass Display Cabinet Suite`,
      category: "Laboratory Overhead Storage",
      specs: `Dimensions: ${Math.round(totalWidth * 1000)}W x ${Math.round(depth * 1000)}D x ${Math.round(height * 1000)}H mm | 5mm Toughened Glass Doors | Heavy-Duty Blue Anodized Framing`,
      description: "Ergonomic wall-mounted chemical and glassware storage suite featuring vibration-resistant glass doors framed in UltraFab vibrant blue powder-coated aluminium profiles, magnetic latches, and adjustable shelves.",
      oemCode: "UF-WSC-6GLS",
    } as ComponentMetadata;

    const carcassGeo = createRoundedBoxGeometry(totalWidth, height, depth, 0.008, 3);
    const carcass = new THREE.Mesh(carcassGeo, this.materials.mainMat);
    carcass.position.set(0, height / 2, 0);
    carcass.castShadow = true;
    carcass.receiveShadow = true;
    group.add(carcass);

    for (let i = 0; i < numUnits; i++) {
      const doorX = -totalWidth / 2 + (i + 0.5) * unitWidth;
      const doorGroup = new THREE.Group();
      doorGroup.position.set(doorX, height / 2, depth / 2 + 0.008);

      const isRightSide = i % 2 === 1;
      doorGroup.userData = {
        title: `Overhead Glass Cabinet Door #${i + 1}`,
        category: "Overhead Cabinetry",
        specs: "Blue Anodized Aluminium Frame | 5mm Toughened Glass | 110° European Hinges",
        description: "Viewing glass door panel opening on soft-close European hinges.",
        oemCode: `UF-WSC-DOOR-${i + 1}`,
        explodeOffset: isRightSide ? { x: 0.10, y: 0, z: 0.20 } : { x: -0.10, y: 0, z: 0.20 },
        explodeRotation: isRightSide ? { x: 0, y: -Math.PI / 2.6, z: 0 } : { x: 0, y: Math.PI / 2.6, z: 0 },
      } as ComponentMetadata;

      group.add(doorGroup);

      const frameThickness = 0.024;
      const frameGeo = createRoundedBoxGeometry(unitWidth - 0.012, height - 0.016, 0.018, 0.004, 2);
      const frameMesh = new THREE.Mesh(frameGeo, this.materials.blueAccentMat);
      frameMesh.castShadow = true;
      doorGroup.add(frameMesh);

      const glassGeo = new THREE.BoxGeometry(unitWidth - 0.012 - frameThickness * 2, height - 0.016 - frameThickness * 2, 0.006);
      const glassMesh = new THREE.Mesh(glassGeo, this.materials.glassCabinetMat);
      glassMesh.position.set(0, 0, 0.002);
      glassMesh.userData = {
        title: `Overhead Cabinet Door #${i + 1} Glass Pane`,
        category: "Optical Glass Components",
        specs: "5mm Toughened Safety Float Glass | Optical Transmission: 94% | Acid Etch Resistant",
        description: "Clear viewing glass pane providing instant visual inventory checks while safeguarding samples from lab airborne particulate.",
        oemCode: `UF-GLS-${i + 1}`,
      } as ComponentMetadata;
      doorGroup.add(glassMesh);

      const handleGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.16, 12);
      const handleMesh = new THREE.Mesh(handleGeo, this.materials.stainlessMat);
      handleMesh.position.set(isRightSide ? -unitWidth * 0.35 : unitWidth * 0.35, 0, 0.018);
      doorGroup.add(handleMesh);
    }

    return group;
  }

  /**
   * Dual Sink Station with 3-Way Gooseneck Faucets & Glassware Drying Pegboard (Image 2 & 3)
   */
  public createDualSinkStation(width: number = 1.5, height: number = 0.9, depth: number = 0.75): THREE.Group {
    const group = new THREE.Group();
    group.userData = {
      title: "Heavy-Duty Dual Polypropylene Sink & Glassware Washing Bench",
      category: "Wet Chemistry & Decontamination",
      specs: `Bench Size: ${Math.round(width * 1000)} x ${Math.round(depth * 1000)} mm | Two 450x380x300mm Bowls | 30-Peg PP Drying Rack | Twin 3-Way Faucets`,
      description: "Industrial wet chemistry washing station featuring seamless chemical-resistant black epoxy countertop with built-in anti-spill marine edge, dual deep PP sinks, 3-way brass/epoxy gooseneck faucets, and vertical pegboard.",
      oemCode: "UF-SNK-DUAL",
    } as ComponentMetadata;

    const legFrame = this.createModularLegFrame(width, height - 0.05, depth - 0.05);
    group.add(legFrame);

    const plumbingCabinet = this.createModularCabinet(width * 0.95, height - 0.06, depth - 0.08, "double-door");
    plumbingCabinet.position.set(0, 0, 0);
    group.add(plumbingCabinet);

    const topGeo = createRoundedBoxGeometry(width, 0.045, depth, 0.01, 4);
    const countertop = new THREE.Mesh(topGeo, this.materials.blackWorktopMat);
    countertop.position.set(0, height - 0.022, 0);
    countertop.castShadow = true;
    countertop.receiveShadow = true;
    countertop.userData = {
      title: "Chemical-Resistant Black Epoxy Resin Worktop",
      category: "Worktop Surfaces",
      specs: "Thickness: 19mm Solid Epoxy Resin | Monolithic Anti-Spill Marine Edge | SEFA 8 Compliant",
      description: "Impervious to concentrated acids, bases, solvents, and heat up to 600°F (315°C). Non-porous monolithic formulation.",
      oemCode: "UF-EPX-TOP",
      explodeOffset: { x: 0, y: 0.25, z: 0 },
    } as ComponentMetadata;
    group.add(countertop);

    const sinkOffsets = [-width * 0.25, width * 0.25];
    for (let s = 0; s < sinkOffsets.length; s++) {
      const sinkX = sinkOffsets[s];

      const sinkBasinGeo = createRoundedBoxGeometry(0.42, 0.24, 0.36, 0.015, 3);
      const sinkBasin = new THREE.Mesh(sinkBasinGeo, this.materials.blackEpoxySinkMat);
      sinkBasin.position.set(sinkX, height - 0.14, 0);
      sinkBasin.userData = {
        title: `Heavy-Duty Laboratory Sink Basin #${s + 1}`,
        category: "Plumbing Fixtures",
        specs: "Material: Injection Molded High-Density Polypropylene | Capacity: 35 Liters | Acid Trap Outlet",
        description: "Seamless chemical and impact-resistant sink basin with coved corners and integrated anti-siphon bottle trap.",
        oemCode: `UF-BASIN-${s + 1}`,
        explodeOffset: { x: 0, y: -0.2, z: 0 },
      } as ComponentMetadata;
      group.add(sinkBasin);

      const drain = new THREE.Mesh(
        new THREE.CylinderGeometry(0.035, 0.035, 0.01, 16),
        this.materials.stainlessMat
      );
      drain.position.set(sinkX, height - 0.25, 0);
      group.add(drain);

      const faucetGroup = new THREE.Group();
      faucetGroup.position.set(sinkX, height + 0.02, -depth * 0.28);
      group.add(faucetGroup);

      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.016, 0.28, 16), this.materials.stainlessMat);
      stem.position.set(0, 0.14, 0);
      stem.castShadow = true;
      faucetGroup.add(stem);

      const spoutCurve = new THREE.Mesh(
        new THREE.TorusGeometry(0.06, 0.012, 12, 24, Math.PI),
        this.materials.stainlessMat
      );
      spoutCurve.rotation.z = Math.PI / 2;
      spoutCurve.position.set(-0.04, 0.28, 0);
      faucetGroup.add(spoutCurve);

      const valveKnob = new THREE.Mesh(
        new THREE.CylinderGeometry(0.018, 0.018, 0.025, 12),
        this.materials.waterValveMat
      );
      valveKnob.rotation.x = Math.PI / 2;
      valveKnob.position.set(0.025, 0.08, 0);
      faucetGroup.add(valveKnob);
    }

    const pegboardGroup = new THREE.Group();
    pegboardGroup.position.set(-width * 0.42, height + 0.42, -depth * 0.32);
    pegboardGroup.userData = {
      title: "30-Peg High-Impact Polymer Glassware Drying Rack (Pegboard)",
      category: "Laboratory Washing & Drying Accessories",
      specs: "Dimensions: 600W x 750H mm | 30 Removable Draining Pegs (130mm) | Integral Drip Collection Trough",
      description: "Chemical and stain-resistant polypropylene pegboard with angled drainage pins allowing rapid air-drying of test tubes, beakers, and volumetric flasks.",
      oemCode: "UF-PGB-30",
      explodeOffset: { x: -0.3, y: 0.2, z: 0 },
    } as ComponentMetadata;
    group.add(pegboardGroup);

    const backPlateGeo = createRoundedBoxGeometry(0.48, 0.68, 0.02, 0.008, 3);
    const backPlate = new THREE.Mesh(backPlateGeo, this.materials.polypropyleneMat);
    backPlate.castShadow = true;
    pegboardGroup.add(backPlate);

    const pegGeo = new THREE.CylinderGeometry(0.006, 0.008, 0.11, 10);
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 6; c++) {
        const peg = new THREE.Mesh(pegGeo, this.materials.grayAccentMat);
        peg.position.set(-0.18 + c * 0.072, 0.24 - r * 0.11, 0.05);
        peg.rotation.x = Math.PI / 3.2;
        pegboardGroup.add(peg);
      }
    }

    const troughGeo = createRoundedBoxGeometry(0.5, 0.05, 0.08, 0.006, 2);
    const trough = new THREE.Mesh(troughGeo, this.materials.blueAccentMat);
    trough.position.set(0, -0.36, 0.03);
    pegboardGroup.add(trough);

    return group;
  }

  /**
   * 2-Tier Reagent Shelving Rack with Integrated Blue Electrical Raceway (Image 2 & 3)
   */
  public createReagentShelvingRack(length: number = 2.2, height: number = 0.75, depth: number = 0.35): THREE.Group {
    const group = new THREE.Group();
    group.userData = {
      title: "2-Tier Reagent Shelving Island System with Utility Raceway",
      category: "Laboratory Island Reagent Storage",
      specs: `Dimensions: ${Math.round(length * 1000)}W x ${Math.round(depth * 1000)}D x ${Math.round(height * 1000)}H mm | 304 Stainless Uprights | 12mm Toughened Glass / CRCA Shelves`,
      description: "Central island reagent shelving tower providing two tier bottle storage, anti-drop lip rails, and integrated continuous UltraFab blue electrical raceway trunking.",
      oemCode: "UF-RGT-2T",
      explodeOffset: { x: 0, y: 0.35, z: 0 },
    } as ComponentMetadata;

    const uprightGeo = new THREE.BoxGeometry(0.04, height, 0.04);
    const xOffsets = [-length / 2 + 0.06, 0, length / 2 - 0.06];

    for (const x of xOffsets) {
      const upright = new THREE.Mesh(uprightGeo, this.materials.stainlessMat);
      upright.position.set(x, height / 2, 0);
      upright.castShadow = true;
      group.add(upright);
    }

    const raceway = this.createElectricalRaceway(length * 0.96, 0.12, 0.08, 3);
    raceway.position.set(0, 0.15, 0);
    group.add(raceway);

    const shelfGeo = createRoundedBoxGeometry(length * 0.96, 0.02, depth, 0.004, 2);
    for (const shelfY of [0.42, 0.72]) {
      const shelf = new THREE.Mesh(shelfGeo, this.materials.mainMat);
      shelf.position.set(0, shelfY, 0);
      shelf.castShadow = true;
      group.add(shelf);

      for (const railZ of [-depth / 2 + 0.015, depth / 2 - 0.015]) {
        const rail = new THREE.Mesh(
          new THREE.CylinderGeometry(0.005, 0.005, length * 0.94, 12),
          this.materials.stainlessMat
        );
        rail.rotation.z = Math.PI / 2;
        rail.position.set(0, shelfY + 0.035, railZ);
        group.add(rail);
      }
    }

    return group;
  }

  /**
   * Precision Laboratory Thermal Equipment (Electric Oven / Muffle Furnace - Image 4)
   */
  public createThermalEquipment(
    type: "heraeusOven" | "muffleFurnace" | "hotAirOven" | "desiccator" = "heraeusOven",
    width: number = 0.7,
    height: number = 0.8,
    depth: number = 0.65
  ): THREE.Group {
    const group = new THREE.Group();

    const titles: Record<string, string> = {
      heraeusOven: "Heraeus Forced-Air Convection Electric Oven",
      muffleFurnace: "High-Temperature Laboratory Muffle Furnace (1200°C)",
      hotAirOven: "Precision Digital Hot Air Sterilizer & Drying Oven",
      desiccator: "Heavy-Duty Vacuum Desiccator Chamber",
    };

    group.userData = {
      title: titles[type] || "Laboratory Thermal Testing Instrument",
      category: "Thermal Testing & Pyrolysis Instruments",
      specs: `Rating: 230V/400V 3.5kW | Temp Range: 50°C - 300°C (Oven) / 1200°C (Furnace) | Microprocessor PID Controller`,
      description: "Industrial grade thermal chamber with stainless steel interior liner, ceramic insulation, calibrated thermocouple sensors, and exhaust vent connector for forced fume extraction.",
      oemCode: `UF-THM-${type.toUpperCase().slice(0, 4)}`,
      explodeOffset: { x: 0, y: 0.25, z: 0.2 },
    } as ComponentMetadata;

    const bodyGeo = createRoundedBoxGeometry(width, height, depth, 0.012, 3);
    const body = new THREE.Mesh(
      bodyGeo,
      type === "muffleFurnace" ? this.materials.ovenCharcoalMat : this.materials.ovenBodyMat
    );
    body.position.set(0, height / 2, 0);
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    const doorGeo = createRoundedBoxGeometry(width * 0.92, height * 0.65, 0.04, 0.008, 3);
    const door = new THREE.Mesh(doorGeo, this.materials.ovenBodyMat);
    door.position.set(0, height * 0.42, depth / 2 + 0.022);
    door.castShadow = true;
    group.add(door);

    const doorHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.22, 12), this.materials.stainlessMat);
    doorHandle.position.set(width * 0.36, 0, 0.028);
    door.add(doorHandle);

    const panelGeo = createRoundedBoxGeometry(width * 0.92, height * 0.22, 0.02, 0.006, 2);
    const panel = new THREE.Mesh(panelGeo, this.materials.ovenCharcoalMat);
    panel.position.set(0, height * 0.85, depth / 2 + 0.015);
    group.add(panel);

    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.18, 0.065),
      new THREE.MeshBasicMaterial({ color: type === "muffleFurnace" ? 0xef4444 : 0x06b6d4 })
    );
    screen.position.set(-width * 0.22, 0, 0.012);
    panel.add(screen);

    for (let d = 0; d < 2; d++) {
      const dial = new THREE.Mesh(
        new THREE.CylinderGeometry(0.016, 0.016, 0.015, 16),
        this.materials.stainlessMat
      );
      dial.rotation.x = Math.PI / 2;
      dial.position.set(width * 0.15 + d * 0.06, 0, 0.012);
      panel.add(dial);
    }

    return group;
  }

  // =========================================================================
  // MODEL 1: L-SHAPED MODULAR WORKSTATION & OVERHEAD GLASS CABINET SUITE (IMAGE 1)
  // =========================================================================
  public buildLShapedWorkstationScene(): THREE.Group {
    const root = new THREE.Group();
    root.name = "LShapedWorkstationScene";

    const roomGroup = new THREE.Group();
    root.add(roomGroup);

    // Floor
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(7.0, 7.0), this.materials.roomFloorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Left Wall
    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3.4, 5.8), this.materials.roomWallMat);
    leftWall.position.set(-2.675, 1.7, 0);
    leftWall.receiveShadow = true;
    roomGroup.add(leftWall);

    // Back Wall with True Recessed Architectural Window Cutout Opening (Image 1)
    const wallThick = 0.15;
    const wallZ = -2.675;
    const winCenterX = 0.40;
    const winWidth = 1.60;
    const winBottomY = 1.55;
    const winTopY = 2.95;
    const winHeight = winTopY - winBottomY; // 1.40m

    // 1. Lower Wall Section (below window sill)
    const wallLower = new THREE.Mesh(
      new THREE.BoxGeometry(5.8, winBottomY, wallThick),
      this.materials.roomWallMat
    );
    wallLower.position.set(0, winBottomY / 2, wallZ);
    wallLower.receiveShadow = true;
    roomGroup.add(wallLower);

    // 2. Upper Wall Section (above window lintel)
    const wallUpperHeight = 3.4 - winTopY;
    const wallUpper = new THREE.Mesh(
      new THREE.BoxGeometry(5.8, wallUpperHeight, wallThick),
      this.materials.roomWallMat
    );
    wallUpper.position.set(0, winTopY + wallUpperHeight / 2, wallZ);
    wallUpper.receiveShadow = true;
    roomGroup.add(wallUpper);

    // 3. Left Wall Side (between corner and window)
    const leftSideWidth = 5.8 / 2 + winCenterX - winWidth / 2; // 2.5m
    const leftSideCenterX = -2.9 + leftSideWidth / 2;
    const wallSideL = new THREE.Mesh(
      new THREE.BoxGeometry(leftSideWidth, winHeight, wallThick),
      this.materials.roomWallMat
    );
    wallSideL.position.set(leftSideCenterX, (winBottomY + winTopY) / 2, wallZ);
    wallSideL.receiveShadow = true;
    roomGroup.add(wallSideL);

    // 4. Right Wall Side (to the right of window)
    const rightSideWidth = 5.8 / 2 - winCenterX - winWidth / 2; // 1.7m
    const rightSideCenterX = 2.9 - rightSideWidth / 2;
    const wallSideR = new THREE.Mesh(
      new THREE.BoxGeometry(rightSideWidth, winHeight, wallThick),
      this.materials.roomWallMat
    );
    wallSideR.position.set(rightSideCenterX, (winBottomY + winTopY) / 2, wallZ);
    wallSideR.receiveShadow = true;
    roomGroup.add(wallSideR);

    // 5. Architectural Window Frame, Ledge Sill & Glazing Pane (Image 1)
    const winGroup = new THREE.Group();
    winGroup.position.set(winCenterX, (winBottomY + winTopY) / 2, wallZ);
    winGroup.userData = {
      title: "Laboratory Exterior Glazed Window Aperture",
      category: "Architectural Elements",
      specs: "Double-Glazed Toughened Low-E Glass | Thermal Break Powder-Coated Aluminium Frame | External Daylight Ingress",
      description: "Architectural exterior daylight window providing natural illumination and ambient light distribution across the laboratory workstation suite.",
      oemCode: "UF-ARCH-WIN",
    } as ComponentMetadata;
    roomGroup.add(winGroup);

    // Deep Bottom Sill (Protruding slightly into the room)
    const sill = new THREE.Mesh(
      createRoundedBoxGeometry(winWidth + 0.08, 0.04, 0.22, 0.006, 2),
      this.materials.mainMat
    );
    sill.position.set(0, -winHeight / 2, 0.04);
    winGroup.add(sill);

    // Window Outer Frame
    const frameOuter = new THREE.Mesh(
      createRoundedBoxGeometry(winWidth, winHeight, 0.08, 0.006, 2),
      this.materials.mainMat
    );
    winGroup.add(frameOuter);

    // Vertical Central Mullion
    const vertMullion = new THREE.Mesh(
      new THREE.BoxGeometry(0.024, winHeight - 0.04, 0.03),
      this.materials.mainMat
    );
    vertMullion.position.set(0, 0, 0);
    winGroup.add(vertMullion);

    // Horizontal Transom Bar
    const horizTransom = new THREE.Mesh(
      new THREE.BoxGeometry(winWidth - 0.04, 0.024, 0.03),
      this.materials.mainMat
    );
    horizTransom.position.set(0, 0.15, 0);
    winGroup.add(horizTransom);

    // Double-Glazed Glass Pane with Realistic Sky/Daylight Reflection
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xdbeafe,
      transmission: 0.9,
      opacity: 1.0,
      transparent: true,
      roughness: 0.04,
      metalness: 0.1,
      ior: 1.52,
      thickness: 0.02,
      reflectivity: 0.9,
      clearcoat: 1.0,
    });
    const glassPane = new THREE.Mesh(
      new THREE.BoxGeometry(winWidth - 0.04, winHeight - 0.04, 0.008),
      glassMat
    );
    glassPane.position.set(0, 0, 0);
    winGroup.add(glassPane);

    // Base Cabinetry Group
    const baseGroup = new THREE.Group();
    root.add(baseGroup);

    // 1. Precise 45° Corner Unit (Image 1)
    const cornerUnit = new THREE.Group();
    cornerUnit.userData = {
      title: "45° Ergonomic Corner Modular Base Cabinet",
      category: "Laboratory Workstation Corner Solution",
      specs: "Footprint: 1050 x 1050 mm | Single Hinged Door | RAL 5010 Blue Top Drawer | Stainless D-Handle",
      description: "Ergonomic 45-degree angled corner workstation unit allowing continuous legroom and storage for L-shaped runs.",
      oemCode: "UF-CRN-45",
    } as ComponentMetadata;
    baseGroup.add(cornerUnit);

    const cabShape = new THREE.Shape();
    cabShape.moveTo(-2.60, -2.60);
    cabShape.lineTo(-1.50, -2.60);
    cabShape.lineTo(-1.50, -1.95);
    cabShape.lineTo(-1.95, -1.50);
    cabShape.lineTo(-2.60, -1.50);
    cabShape.closePath();

    const cabGeom = new THREE.ExtrudeGeometry(cabShape, {
      depth: 0.76,
      bevelEnabled: true,
      bevelSize: 0.006,
      bevelThickness: 0.006,
      bevelSegments: 3,
    });
    cabGeom.rotateX(Math.PI / 2);

    const cornerBody = new THREE.Mesh(cabGeom, this.materials.mainMat);
    cornerBody.position.set(0, 0.86, 0);
    cornerBody.castShadow = true;
    cornerBody.receiveShadow = true;
    cornerUnit.add(cornerBody);

    const diagW = 0.60;
    const diagX = -1.725;
    const diagZ = -1.725;

    // 45° Top Blue Drawer Fascia
    const drwGeo = createRoundedBoxGeometry(diagW, 0.18, 0.02, 0.006, 3);
    const drwMesh = new THREE.Mesh(drwGeo, this.materials.blueAccentMat);
    drwMesh.position.set(diagX + 0.015, 0.75, diagZ + 0.015);
    drwMesh.rotation.y = Math.PI / 4;
    drwMesh.castShadow = true;
    drwMesh.userData = {
      title: "45° Corner Top Utility Drawer",
      category: "Cabinetry Components",
      specs: "CRCA Sheet | RAL 5010 Blue | 45° Slide",
      description: "Ergonomic 45-degree angled slide utility drawer.",
      oemCode: "UF-DRW-CRN",
      explodeOffset: { x: 0.25, y: 0, z: 0.25 },
    } as ComponentMetadata;
    cornerUnit.add(drwMesh);

    const drwHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, diagW * 0.45, 12),
      this.materials.stainlessMat
    );
    drwHandle.rotation.z = Math.PI / 2;
    drwHandle.position.set(0, 0, 0.018);
    drwMesh.add(drwHandle);

    // 45° Lower Single Hinged Door (Image 1)
    const doorH = 0.52;
    const doorGeo = createRoundedBoxGeometry(diagW, doorH, 0.02, 0.006, 3);
    const doorMesh = new THREE.Mesh(doorGeo, this.materials.mainMat);
    doorMesh.position.set(diagX + 0.015, 0.38, diagZ + 0.015);
    doorMesh.rotation.y = Math.PI / 4;
    doorMesh.castShadow = true;
    doorMesh.userData = {
      title: "45° Corner Base Cabinet Hinged Door",
      category: "Cabinetry Components",
      specs: "110° Concealed Hinges | Key Lock Cylinder",
      description: "Corner access door swinging outward into the laboratory.",
      oemCode: "UF-DOR-CRN",
      explodeOffset: { x: 0.15, y: 0, z: 0.15 },
      explodeRotation: { x: 0, y: -Math.PI / 2.6, z: 0 },
    } as ComponentMetadata;
    cornerUnit.add(doorMesh);

    const doorHandle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.006, 0.006, 0.16, 12),
      this.materials.stainlessMat
    );
    doorHandle.position.set(diagW * 0.32, 0.12, 0.018);
    doorMesh.add(doorHandle);

    const lockMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.01, 12),
      this.materials.stainlessMat
    );
    lockMesh.rotation.x = Math.PI / 2;
    lockMesh.position.set(diagW * 0.32, 0.22, 0.012);
    doorMesh.add(lockMesh);

    // 2. Left Wing Base Cabinets & Knee-Spaces (Matching Image 1)
    const cabL1 = this.createModularCabinet(0.55, 0.76, 0.65, "drawer-door");
    cabL1.position.set(-2.275, 0.05, -1.15);
    cabL1.rotation.y = Math.PI / 2;
    baseGroup.add(cabL1);

    const kneeLegL1 = this.createModularLegFrame(0.65, 0.86, 0.65);
    kneeLegL1.position.set(-2.275, 0, -0.55);
    kneeLegL1.rotation.y = Math.PI / 2;
    baseGroup.add(kneeLegL1);

    const cabL2 = this.createModularCabinet(0.55, 0.76, 0.65, "drawer-door");
    cabL2.position.set(-2.275, 0.05, 0.05);
    cabL2.rotation.y = Math.PI / 2;
    baseGroup.add(cabL2);

    const kneeLegL2 = this.createModularLegFrame(0.60, 0.86, 0.65);
    kneeLegL2.position.set(-2.275, 0, 0.65);
    kneeLegL2.rotation.y = Math.PI / 2;
    baseGroup.add(kneeLegL2);

    const cabL3 = this.createModularCabinet(0.50, 0.76, 0.65, "drawer-door");
    cabL3.position.set(-2.275, 0.05, 1.20);
    cabL3.rotation.y = Math.PI / 2;
    baseGroup.add(cabL3);

    // 3. Right Wing Base Cabinets & Knee-Spaces (Matching Image 1)
    const cabR1 = this.createModularCabinet(0.85, 0.76, 0.65, "double-door");
    cabR1.position.set(-0.95, 0.05, -2.275);
    baseGroup.add(cabR1);

    const kneeLegR1 = this.createModularLegFrame(0.80, 0.86, 0.65);
    kneeLegR1.position.set(-0.10, 0, -2.275);
    baseGroup.add(kneeLegR1);

    const cabR2 = this.createModularCabinet(0.85, 0.76, 0.65, "double-door");
    cabR2.position.set(0.75, 0.05, -2.275);
    baseGroup.add(cabR2);

    const cabR3 = this.createModularCabinet(0.70, 0.76, 0.65, "double-door");
    cabR3.position.set(1.65, 0.05, -2.275);
    baseGroup.add(cabR3);

    // 4. Monolithic 45° Chamfered L-Countertop (Image 1)
    const worktopGroup = new THREE.Group();
    root.add(worktopGroup);

    const topShape = new THREE.Shape();
    topShape.moveTo(-1.85, 1.45);
    topShape.lineTo(-1.85, -1.45); // Left front edge
    topShape.lineTo(-1.45, -1.85); // 45° diagonal corner front face
    topShape.lineTo(2.25, -1.85);  // Right front edge
    topShape.lineTo(2.25, -2.60);  // Right end against wall
    topShape.lineTo(-2.60, -2.60); // Back wall corner
    topShape.lineTo(-2.60, 1.45);  // Left end against wall
    topShape.closePath();

    const topGeom = new THREE.ExtrudeGeometry(topShape, {
      depth: 0.045,
      bevelEnabled: true,
      bevelSize: 0.008,
      bevelThickness: 0.008,
      bevelSegments: 4,
    });
    topGeom.rotateX(Math.PI / 2);

    const monolithicTop = new THREE.Mesh(topGeom, this.materials.blackWorktopMat);
    monolithicTop.position.set(0, 0.88, 0);
    monolithicTop.castShadow = true;
    monolithicTop.receiveShadow = true;
    monolithicTop.userData = {
      title: "Monolithic Chemical Resistant Black Epoxy L-Worktop with 45° Corner",
      category: "Worktop Surfaces",
      specs: "Seamless Monolithic Epoxy Resin | 45° Chamfered Corner | SEFA 8M Compliant",
      description: "Continuous monolithic chemical workbench surface with 45° ergonomic corner transition.",
      oemCode: "UF-EPX-L45",
    } as ComponentMetadata;
    worktopGroup.add(monolithicTop);

    // 5. Backsplash Electrical Raceways (Meeting in corner)
    const racewayL = this.createElectricalRaceway(4.0, 0.14, 0.06, 5);
    racewayL.position.set(-2.54, 0.98, -0.60);
    racewayL.rotation.y = Math.PI / 2;
    root.add(racewayL);

    const racewayR = this.createElectricalRaceway(4.8, 0.14, 0.06, 6);
    racewayR.position.set(-0.20, 0.98, -2.54);
    root.add(racewayR);

    // 6. Wall-Mounted 6-Door Overhead Glass Cabinet Suite (Image 1)
    const overheadSuite = this.createOverheadGlassCabinetSuite(6, 0.44, 0.65, 0.35);
    overheadSuite.position.set(-2.42, 2.25, -0.60);
    overheadSuite.rotation.y = Math.PI / 2;
    root.add(overheadSuite);

    return root;
  }

  // =========================================================================
  // MODEL 2: WET CHEMISTRY SINK BENCH & REAGENT ISLAND (IMAGE 2)
  // =========================================================================
  public buildSinkIslandScene(): THREE.Group {
    const root = new THREE.Group();
    root.name = "SinkIslandScene";

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(7.0, 7.0), this.materials.roomFloorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    root.add(floor);

    const backWall = new THREE.Mesh(new THREE.BoxGeometry(6.8, 3.4, 0.15), this.materials.roomWallMat);
    backWall.position.set(0, 1.7, -2.8);
    backWall.receiveShadow = true;
    root.add(backWall);

    const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3.4, 5.8), this.materials.roomWallMat);
    leftWall.position.set(-2.9, 1.7, 0);
    leftWall.receiveShadow = true;
    root.add(leftWall);

    const sinkStation = this.createDualSinkStation(1.6, 0.9, 0.75);
    sinkStation.position.set(-2.45, 0, -0.9);
    sinkStation.rotation.y = Math.PI / 2;
    root.add(sinkStation);

    const benchExtension = this.createModularCabinet(1.4, 0.86, 0.7, "double-door");
    benchExtension.position.set(-2.45, 0, 0.8);
    benchExtension.rotation.y = Math.PI / 2;
    root.add(benchExtension);

    const topExt = new THREE.Mesh(createRoundedBoxGeometry(0.75, 0.045, 1.5, 0.008, 3), this.materials.blackWorktopMat);
    topExt.position.set(-2.45, 0.88, 0.8);
    topExt.castShadow = true;
    root.add(topExt);

    const racewaySink = this.createElectricalRaceway(1.4, 0.14, 0.06, 2);
    racewaySink.position.set(-2.8, 0.98, 0.8);
    racewaySink.rotation.y = Math.PI / 2;
    root.add(racewaySink);

    const islandGroup = new THREE.Group();
    islandGroup.position.set(0.6, 0, 0.2);
    root.add(islandGroup);

    const islandCab1 = this.createModularCabinet(1.2, 0.86, 0.65, "double-door");
    islandCab1.position.set(-0.65, 0, 0);
    islandGroup.add(islandCab1);

    const islandCab2 = this.createModularCabinet(1.2, 0.86, 0.65, "double-door");
    islandCab2.position.set(0.65, 0, 0);
    islandGroup.add(islandCab2);

    const islandTop = new THREE.Mesh(createRoundedBoxGeometry(2.6, 0.045, 1.35, 0.01, 3), this.materials.blackWorktopMat);
    islandTop.position.set(0, 0.88, 0);
    islandTop.castShadow = true;
    islandTop.receiveShadow = true;
    islandTop.userData = {
      title: "Double-Width Island Chemical Resistant Worktop",
      category: "Worktop Surfaces",
      specs: "2600 x 1350 x 19mm Solid Black Epoxy Resin",
      description: "Center island collaborative workbench with dual side operator access.",
      oemCode: "UF-ISL-TOP",
      explodeOffset: { x: 0, y: 0.25, z: 0 },
    } as ComponentMetadata;
    islandGroup.add(islandTop);

    const reagentRack = this.createReagentShelvingRack(2.4, 0.75, 0.35);
    reagentRack.position.set(0, 0.9, 0);
    islandGroup.add(reagentRack);

    return root;
  }

  // =========================================================================
  // MODEL 3: MICROBIOLOGY & ANALYTICAL FULL LAB SUITE (IMAGE 3)
  // =========================================================================
  public buildMicrobiologySuiteScene(): THREE.Group {
    const root = new THREE.Group();
    root.name = "MicrobiologySuiteScene";

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 8.5), this.materials.roomFloorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    root.add(floor);

    const wallBack = new THREE.Mesh(new THREE.BoxGeometry(8.2, 3.4, 0.15), this.materials.roomWallMat);
    wallBack.position.set(0, 1.7, -3.8);
    wallBack.receiveShadow = true;
    root.add(wallBack);

    const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.15, 3.4, 7.8), this.materials.roomWallMat);
    wallLeft.position.set(-3.8, 1.7, 0);
    wallLeft.receiveShadow = true;
    root.add(wallLeft);

    const periGroup = new THREE.Group();
    root.add(periGroup);

    const backCab = this.createModularCabinet(2.4, 0.86, 0.7, "double-door");
    backCab.position.set(-1.2, 0, -3.3);
    periGroup.add(backCab);

    const backTop = new THREE.Mesh(createRoundedBoxGeometry(3.6, 0.045, 0.75, 0.008, 3), this.materials.blackWorktopMat);
    backTop.position.set(-1.6, 0.88, -3.3);
    backTop.castShadow = true;
    periGroup.add(backTop);

    const backRace = this.createElectricalRaceway(3.6, 0.14, 0.06, 5);
    backRace.position.set(-1.6, 0.98, -3.7);
    periGroup.add(backRace);

    const leftTop = new THREE.Mesh(createRoundedBoxGeometry(0.75, 0.045, 4.2, 0.008, 3), this.materials.blackWorktopMat);
    leftTop.position.set(-3.3, 0.88, -1.0);
    leftTop.castShadow = true;
    periGroup.add(leftTop);

    // Left Wall Under-Bench Base Cabinets
    const leftCab1 = this.createModularCabinet(0.8, 0.86, 0.65, "drawer-door");
    leftCab1.position.set(-3.3, 0, -2.4);
    leftCab1.rotation.y = Math.PI / 2;
    periGroup.add(leftCab1);

    const leftCab2 = this.createModularCabinet(0.8, 0.86, 0.65, "double-door");
    leftCab2.position.set(-3.3, 0, -1.5);
    leftCab2.rotation.y = Math.PI / 2;
    periGroup.add(leftCab2);

    const leftCab3 = this.createModularCabinet(0.8, 0.86, 0.65, "drawer-door");
    leftCab3.position.set(-3.3, 0, -0.6);
    leftCab3.rotation.y = Math.PI / 2;
    periGroup.add(leftCab3);

    const leftCab4 = this.createModularCabinet(0.8, 0.86, 0.65, "double-door");
    leftCab4.position.set(-3.3, 0, 0.3);
    leftCab4.rotation.y = Math.PI / 2;
    periGroup.add(leftCab4);

    const leftLegs = this.createModularLegFrame(4.0, 0.86, 0.65);
    leftLegs.position.set(-3.3, 0, -1.0);
    leftLegs.rotation.y = Math.PI / 2;
    periGroup.add(leftLegs);

    const leftRace = this.createElectricalRaceway(4.2, 0.14, 0.06, 6);
    leftRace.position.set(-3.7, 0.98, -1.0);
    leftRace.rotation.y = Math.PI / 2;
    periGroup.add(leftRace);

    // ================= Center T-Island Peninsula Suite =================
    const centerIsland = new THREE.Group();
    centerIsland.position.set(0.4, 0, 0.2);
    root.add(centerIsland);

    // Island Base Cabinets (Bottom Half)
    // 1. Under-Sink End Plumbing Cabinet
    const islandSinkCab = this.createModularCabinet(0.9, 0.86, 0.65, "double-door");
    islandSinkCab.position.set(-1.1, 0, 0);
    centerIsland.add(islandSinkCab);

    // 2. Front Side Modular Cabinets (facing +Z)
    const fCab1 = this.createModularCabinet(0.75, 0.86, 0.65, "drawer-door");
    fCab1.position.set(-0.25, 0, 0.35);
    centerIsland.add(fCab1);

    const fCab2 = this.createModularCabinet(0.75, 0.86, 0.65, "double-door");
    fCab2.position.set(0.55, 0, 0.35);
    centerIsland.add(fCab2);

    const fCab3 = this.createModularCabinet(0.75, 0.86, 0.65, "drawer-door");
    fCab3.position.set(1.35, 0, 0.35);
    centerIsland.add(fCab3);

    // 3. Rear Side Modular Cabinets (facing -Z, rotated 180°)
    const rCab1 = this.createModularCabinet(0.75, 0.86, 0.65, "double-door");
    rCab1.position.set(-0.25, 0, -0.35);
    rCab1.rotation.y = Math.PI;
    centerIsland.add(rCab1);

    const rCab2 = this.createModularCabinet(0.75, 0.86, 0.65, "drawer-door");
    rCab2.position.set(0.55, 0, -0.35);
    rCab2.rotation.y = Math.PI;
    centerIsland.add(rCab2);

    const rCab3 = this.createModularCabinet(0.75, 0.86, 0.65, "double-door");
    rCab3.position.set(1.35, 0, -0.35);
    rCab3.rotation.y = Math.PI;
    centerIsland.add(rCab3);

    // 4. Structural Steel Leg Frames
    const islandLegs = this.createModularLegFrame(3.1, 0.86, 1.35);
    islandLegs.position.set(0, 0, 0);
    centerIsland.add(islandLegs);

    // 5. Worktop Countertop
    const islandTop = new THREE.Mesh(createRoundedBoxGeometry(3.2, 0.045, 1.4, 0.01, 3), this.materials.blackWorktopMat);
    islandTop.position.set(0, 0.88, 0);
    islandTop.castShadow = true;
    islandTop.receiveShadow = true;
    islandTop.userData = {
      title: "Microbiology Double-Width Central Island Worktop",
      category: "Worktop Surfaces",
      specs: "3200 x 1400 x 19mm Black Epoxy Resin | Seamless Dual-Side Access",
      description: "Center island collaborative analytical workbench with integral end sink and dual-sided power.",
      oemCode: "UF-MB-ISLTOP",
      explodeOffset: { x: 0, y: 0.25, z: 0 },
    } as ComponentMetadata;
    centerIsland.add(islandTop);

    // 6. Reagent Rack & Fixtures
    const reagentRack = this.createReagentShelvingRack(2.2, 0.75, 0.35);
    reagentRack.position.set(0.3, 0.9, 0);
    centerIsland.add(reagentRack);

    const islandSink = new THREE.Mesh(createRoundedBoxGeometry(0.45, 0.22, 0.38, 0.012, 3), this.materials.blackEpoxySinkMat);
    islandSink.position.set(-1.1, 0.76, 0);
    centerIsland.add(islandSink);

    const faucet = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.28, 16), this.materials.stainlessMat);
    faucet.position.set(-1.1, 1.04, -0.22);
    centerIsland.add(faucet);

    const pegboard = new THREE.Mesh(createRoundedBoxGeometry(0.48, 0.65, 0.02, 0.008, 2), this.materials.polypropyleneMat);
    pegboard.position.set(-1.1, 1.35, 0);
    centerIsland.add(pegboard);

    const islandRace = this.createElectricalRaceway(3.0, 0.14, 0.06, 4);
    islandRace.position.set(0, 0.98, 0.65);
    centerIsland.add(islandRace);

    return root;
  }

  // =========================================================================
  // MODEL 4: THERMAL OVEN & MUFFLE FURNACE ROOM 4.25m x 5.575m (IMAGE 4 CAD)
  // =========================================================================
  public buildOvenRoomScene(): THREE.Group {
    const root = new THREE.Group();
    root.name = "OvenRoomScene";

    const roomW = 4.25;
    const roomD = 5.575;
    const roomH = 3.2;

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), this.materials.roomFloorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    root.add(floor);

    const wallLeft = new THREE.Mesh(new THREE.BoxGeometry(0.12, roomH, roomD), this.materials.roomWallMat);
    wallLeft.position.set(-roomW / 2, roomH / 2, 0);
    wallLeft.receiveShadow = true;
    root.add(wallLeft);

    const wallRight = new THREE.Mesh(new THREE.BoxGeometry(0.12, roomH, roomD), this.materials.roomWallMat);
    wallRight.position.set(roomW / 2, roomH / 2, 0);
    wallRight.receiveShadow = true;
    root.add(wallRight);

    const wallTop = new THREE.Mesh(new THREE.BoxGeometry(roomW, roomH, 0.12), this.materials.roomWallMat);
    wallTop.position.set(0, roomH / 2, -roomD / 2);
    wallTop.receiveShadow = true;
    root.add(wallTop);

    const leftRunTop = new THREE.Mesh(createRoundedBoxGeometry(0.75, 0.045, 4.4, 0.008, 3), this.materials.blackWorktopMat);
    leftRunTop.position.set(-roomW / 2 + 0.45, 0.88, -0.3);
    leftRunTop.castShadow = true;
    root.add(leftRunTop);

    const leftRace = this.createElectricalRaceway(4.4, 0.14, 0.06, 6);
    leftRace.position.set(-roomW / 2 + 0.1, 0.98, -0.3);
    leftRace.rotation.y = Math.PI / 2;
    root.add(leftRace);

    const ovenL1 = this.createThermalEquipment("desiccator", 0.65, 0.72, 0.6);
    ovenL1.position.set(-roomW / 2 + 0.45, 0.9, -1.9);
    root.add(ovenL1);

    const ovenL2 = this.createThermalEquipment("heraeusOven", 0.7, 0.78, 0.62);
    ovenL2.position.set(-roomW / 2 + 0.45, 0.9, -0.85);
    root.add(ovenL2);

    const ovenL3 = this.createThermalEquipment("hotAirOven", 0.7, 0.78, 0.62);
    ovenL3.position.set(-roomW / 2 + 0.45, 0.9, 0.2);
    root.add(ovenL3);

    const ovenL4 = this.createThermalEquipment("hotAirOven", 0.7, 0.78, 0.62);
    ovenL4.position.set(-roomW / 2 + 0.45, 0.9, 1.25);
    root.add(ovenL4);

    const topRunWorktop = new THREE.Mesh(createRoundedBoxGeometry(3.0, 0.045, 0.75, 0.008, 3), this.materials.blackWorktopMat);
    topRunWorktop.position.set(0.3, 0.88, -roomD / 2 + 0.45);
    topRunWorktop.castShadow = true;
    root.add(topRunWorktop);

    const topRace = this.createElectricalRaceway(3.0, 0.14, 0.06, 4);
    topRace.position.set(0.3, 0.98, -roomD / 2 + 0.1);
    root.add(topRace);

    const furnace1 = this.createThermalEquipment("muffleFurnace", 0.72, 0.82, 0.65);
    furnace1.position.set(-0.6, 0.9, -roomD / 2 + 0.45);
    root.add(furnace1);

    const furnace2 = this.createThermalEquipment("muffleFurnace", 0.72, 0.82, 0.65);
    furnace2.position.set(0.6, 0.9, -roomD / 2 + 0.45);
    root.add(furnace2);

    const rightRunTop = new THREE.Mesh(createRoundedBoxGeometry(0.75, 0.045, 4.4, 0.008, 3), this.materials.blackWorktopMat);
    rightRunTop.position.set(roomW / 2 - 0.45, 0.88, -0.3);
    rightRunTop.castShadow = true;
    root.add(rightRunTop);

    const rightRace = this.createElectricalRaceway(4.4, 0.14, 0.06, 6);
    rightRace.position.set(roomW / 2 - 0.1, 0.98, -0.3);
    rightRace.rotation.y = -Math.PI / 2;
    root.add(rightRace);

    const ovenR1 = this.createThermalEquipment("heraeusOven", 0.7, 0.78, 0.62);
    ovenR1.position.set(roomW / 2 - 0.45, 0.9, -1.9);
    root.add(ovenR1);

    const ovenR2 = this.createThermalEquipment("hotAirOven", 0.7, 0.78, 0.62);
    ovenR2.position.set(roomW / 2 - 0.45, 0.9, -0.85);
    root.add(ovenR2);

    const ovenR3 = this.createThermalEquipment("heraeusOven", 0.7, 0.78, 0.62);
    ovenR3.position.set(roomW / 2 - 0.45, 0.9, 0.2);
    root.add(ovenR3);

    const techBench = this.createModularCabinet(2.8, 0.86, 0.7, "double-door");
    techBench.position.set(0, 0, roomD / 2 - 0.55);
    root.add(techBench);

    const techTop = new THREE.Mesh(createRoundedBoxGeometry(3.0, 0.045, 0.75, 0.008, 3), this.materials.blackWorktopMat);
    techTop.position.set(0, 0.88, roomD / 2 - 0.55);
    techTop.castShadow = true;
    root.add(techTop);

    for (let c = -1.5; c <= 1.5; c += 1.0) {
      const stool = new THREE.Group();
      stool.position.set(c * 0.7, 0, roomD / 2 - 1.15);

      const seat = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16),
        this.materials.grayAccentMat
      );
      seat.position.set(0, 0.55, 0);
      seat.castShadow = true;
      stool.add(seat);

      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 12), this.materials.stainlessMat);
      pole.position.set(0, 0.25, 0);
      stool.add(pole);

      const baseRing = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.015, 8, 16), this.materials.stainlessMat);
      baseRing.rotation.x = Math.PI / 2;
      baseRing.position.set(0, 0.08, 0);
      stool.add(baseRing);

      root.add(stool);
    }

    const ductGroup = new THREE.Group();
    ductGroup.position.set(0, roomH - 0.35, 0);
    ductGroup.userData = {
      title: "HVAC CFM Industrial Exhaust Extraction Ducting System",
      category: "Thermal Room Ventilation & CFM Ducting",
      specs: "Flow Capacity: 7716 CFM Master Exhaust | 516 CFM Localized Hood Take-offs | Stainless 304 Spiral Ducting",
      description: "Dedicated high-temperature exhaust manifold engineered to extract thermal heat dissipation from muffle furnaces and electric drying ovens.",
      oemCode: "UF-HVAC-7716CFM",
    } as ComponentMetadata;
    root.add(ductGroup);

    const ductMain = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, roomD * 0.85, 24),
      this.materials.stainlessMat
    );
    ductMain.rotation.x = Math.PI / 2;
    ductMain.position.set(0, 0, 0);
    ductGroup.add(ductMain);

    for (const dropX of [-0.6, 0.6]) {
      const dropFlue = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.9, 16),
        this.materials.stainlessMat
      );
      dropFlue.position.set(dropX, -0.45, -roomD / 2 + 0.45);
      ductGroup.add(dropFlue);

      const canopyHood = new THREE.Mesh(
        new THREE.ConeGeometry(0.35, 0.25, 16, 1, true),
        this.materials.stainlessMat
      );
      canopyHood.position.set(dropX, -0.9, -roomD / 2 + 0.45);
      ductGroup.add(canopyHood);
    }

    return root;
  }
}
