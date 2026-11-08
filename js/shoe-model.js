/**
 * FIS-LUXE // Procedural 3D Luxury Sneaker Sculptor
 * High-definition cyber-luxury sneaker geometry, PBR physical materials,
 * modular layers for 3D exploded view, and real-time colorway adaptation.
 */

export class LuxuryShoeModel {
  constructor(THREE) {
    this.THREE = THREE;
    this.group = new THREE.Group();
    this.layers = {}; // Sub-groups for exploded view animation
    this.materials = {}; // References for live colorway tweens
    this.exploded = false;
    this.explodeProgress = 0; // 0 (assembled) to 1 (exploded)
    
    this.buildModel();
  }

  buildModel() {
    const THREE = this.THREE;

    // Create primary material instances
    this.initMaterials();

    // 1. OUTSOLE LAYER (Base tread, grip pods)
    this.layers.sole = new THREE.Group();
    this.buildOutsole();
    this.group.add(this.layers.sole);

    // 2. MIDSOLE & PNEUMATIC AIR UNIT
    this.layers.cushion = new THREE.Group();
    this.buildCushionChamber();
    this.group.add(this.layers.cushion);

    // 3. CARBON FIBER TORSION SHANK
    this.layers.shank = new THREE.Group();
    this.buildCarbonShank();
    this.group.add(this.layers.shank);

    // 4. MAIN UPPER (AeroKnit weave, toe cap, side panels)
    this.layers.upper = new THREE.Group();
    this.buildUpperBody();
    this.group.add(this.layers.upper);

    // 5. TONGUE & LACING SYSTEM
    this.layers.laces = new THREE.Group();
    this.buildLacesAndTongue();
    this.group.add(this.layers.laces);

    // 6. HEEL STABILIZER & AEROFIN
    this.layers.stabilizer = new THREE.Group();
    this.buildHeelStabilizer();
    this.group.add(this.layers.stabilizer);

    // Center and scale the entire sneaker group nicely
    this.group.position.set(0, 0, 0);
    this.group.scale.set(1.5, 1.5, 1.5);
    
    // Store original rest positions for exploded view interpolation
    this.recordOriginalPositions();
  }

  initMaterials() {
    const THREE = this.THREE;

    // Carbon fiber procedural bump/normal simulation canvas
    const carbonCanvas = document.createElement("canvas");
    carbonCanvas.width = 64;
    carbonCanvas.height = 64;
    const ctx = carbonCanvas.getContext("2d");
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = "#222";
    for (let i = 0; i < 64; i += 8) {
      for (let j = 0; j < 64; j += 8) {
        if ((i + j) % 16 === 0) {
          ctx.fillRect(i, j, 8, 8);
        }
      }
    }
    const carbonTexture = new THREE.CanvasTexture(carbonCanvas);
    carbonTexture.wrapS = THREE.RepeatWrapping;
    carbonTexture.wrapT = THREE.RepeatWrapping;
    carbonTexture.repeat.set(8, 8);

    // Base materials
    this.materials.upper = new THREE.MeshStandardMaterial({
      color: 0x111217,
      roughness: 0.7,
      metalness: 0.15,
      bumpMap: carbonTexture,
      bumpScale: 0.02
    });

    this.materials.upperDetail = new THREE.MeshStandardMaterial({
      color: 0x1a1c23,
      roughness: 0.45,
      metalness: 0.35
    });

    this.materials.sole = new THREE.MeshStandardMaterial({
      color: 0x090a0d,
      roughness: 0.85,
      metalness: 0.1
    });

    this.materials.tread = new THREE.MeshStandardMaterial({
      color: 0x181a20,
      roughness: 0.9,
      metalness: 0.05
    });

    // Luxury 24K Gold / Metallic Electroplate (MeshStandardMaterial with high metalness)
    this.materials.metallic = new THREE.MeshStandardMaterial({
      color: 0xf3c74d,
      metalness: 0.92,
      roughness: 0.18
    });

    this.materials.accent = new THREE.MeshStandardMaterial({
      color: 0xe6b422,
      metalness: 0.8,
      roughness: 0.25
    });

    // Transparent Air Chamber (simulated pneumatic cell)
    this.materials.cushionGlass = new THREE.MeshPhysicalMaterial({
      color: 0xffb703,
      transparent: true,
      opacity: 0.55,
      roughness: 0.12,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.45,
      reflectivity: 0.9
    });

    // Glowing internal core struts
    this.materials.glow = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xffaa00,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.5
    });

    // Laces material
    this.materials.laces = new THREE.MeshStandardMaterial({
      color: 0x22242c,
      roughness: 0.8,
      metalness: 0.1
    });

    // Forged Carbon Shank
    this.materials.carbon = new THREE.MeshStandardMaterial({
      color: 0x15161b,
      roughness: 0.3,
      metalness: 0.6,
      map: carbonTexture
    });
  }

  buildOutsole() {
    const THREE = this.THREE;
    const sole = this.layers.sole;

    // Aerodynamic curved base profile
    // Sneaker extends along X axis: Toe is at -X (-1.6), Heel is at +X (+1.4)
    const baseShape = new THREE.Shape();
    baseShape.moveTo(-1.6, 0);
    baseShape.quadraticCurveTo(-1.5, 0.45, -0.6, 0.52);
    baseShape.quadraticCurveTo(0.2, 0.45, 0.7, 0.48);
    baseShape.quadraticCurveTo(1.4, 0.42, 1.45, 0);
    baseShape.quadraticCurveTo(1.4, -0.42, 0.7, -0.48);
    baseShape.quadraticCurveTo(0.2, -0.45, -0.6, -0.52);
    baseShape.quadraticCurveTo(-1.5, -0.45, -1.6, 0);

    const extrudeSettings = {
      depth: 0.22,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.04,
      bevelThickness: 0.04
    };

    const soleGeom = new THREE.ExtrudeGeometry(baseShape, extrudeSettings);
    soleGeom.rotateX(Math.PI / 2);
    soleGeom.translate(0, -0.32, 0);

    const soleMesh = new THREE.Mesh(soleGeom, this.materials.sole);
    soleMesh.castShadow = true;
    soleMesh.receiveShadow = true;
    sole.add(soleMesh);

    // Tread Traction Pods along bottom
    const podGeom = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 6);
    const podMaterial = this.materials.tread;

    // Forefoot pods grid
    for (let x = -1.3; x <= -0.2; x += 0.24) {
      for (let z = -0.35; z <= 0.35; z += 0.22) {
        // Natural footprint boundary check
        if (Math.abs(z) < 0.42 && Math.abs(x) < 1.45) {
          const pod = new THREE.Mesh(podGeom, podMaterial);
          pod.position.set(x, -0.45, z);
          pod.castShadow = true;
          sole.add(pod);
        }
      }
    }

    // Heel pods grid
    for (let x = 0.5; x <= 1.25; x += 0.26) {
      for (let z = -0.32; z <= 0.32; z += 0.22) {
        const pod = new THREE.Mesh(podGeom, podMaterial);
        pod.position.set(x, -0.45, z);
        pod.castShadow = true;
        sole.add(pod);
      }
    }

    // Metallic gold front toe bumper & rear tread cap
    const bumperGeom = new THREE.CylinderGeometry(0.12, 0.08, 0.25, 12);
    bumperGeom.rotateZ(Math.PI / 2);
    const toeBumper = new THREE.Mesh(bumperGeom, this.materials.metallic);
    toeBumper.position.set(-1.6, -0.26, 0);
    sole.add(toeBumper);
  }

  buildCushionChamber() {
    const THREE = this.THREE;
    const cushion = this.layers.cushion;

    // Transparent Air Pod Cavity along heel and midfoot
    const airCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.1, -0.24, 0.38),
      new THREE.Vector3(0.5, -0.23, 0.42),
      new THREE.Vector3(1.15, -0.21, 0.36),
      new THREE.Vector3(1.35, -0.20, 0),
      new THREE.Vector3(1.15, -0.21, -0.36),
      new THREE.Vector3(0.5, -0.23, -0.42),
      new THREE.Vector3(0.1, -0.24, -0.38)
    ]);

    const airTubeGeom = new THREE.TubeGeometry(airCurve, 32, 0.11, 16, false);
    const airTubeMesh = new THREE.Mesh(airTubeGeom, this.materials.cushionGlass);
    airTubeMesh.castShadow = true;
    cushion.add(airTubeMesh);

    // Glowing internal kinetic spring coils / nitrogen dampeners inside the chamber
    const springCount = 7;
    for (let i = 0; i < springCount; i++) {
      const u = i / (springCount - 1);
      const point = airCurve.getPoint(u * 0.45); // Lateral side
      const strutGeom = new THREE.CylinderGeometry(0.025, 0.025, 0.16, 12);
      const strutMesh = new THREE.Mesh(strutGeom, this.materials.glow);
      strutMesh.position.copy(point);
      strutMesh.position.y += 0.01;
      cushion.add(strutMesh);

      // Symmetrical medial side
      const medialPoint = airCurve.getPoint(1 - u * 0.45);
      const strutMedial = new THREE.Mesh(strutGeom, this.materials.glow);
      strutMedial.position.copy(medialPoint);
      strutMedial.position.y += 0.01;
      cushion.add(strutMedial);
    }

    // Forefoot responsive kinetic cushion pill
    const forefootPillGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.1, 16);
    forefootPillGeom.rotateX(Math.PI / 2);
    forefootPillGeom.scale(1.4, 0.6, 1);
    const forefootPill = new THREE.Mesh(forefootPillGeom, this.materials.cushionGlass);
    forefootPill.position.set(-0.7, -0.25, 0);
    cushion.add(forefootPill);

    const innerPillCore = new THREE.Mesh(
      new THREE.CylinderGeometry(0.16, 0.16, 0.08, 16),
      this.materials.glow
    );
    innerPillCore.position.set(-0.7, -0.25, 0);
    cushion.add(innerPillCore);
  }

  buildCarbonShank() {
    const THREE = this.THREE;
    const shank = this.layers.shank;

    // Curved Toray T1000 carbon plate spanning midfoot arch
    const shankCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.4, -0.26, 0.22),
      new THREE.Vector3(-0.05, -0.19, 0.18),
      new THREE.Vector3(0.45, -0.22, 0.22),
      new THREE.Vector3(0.45, -0.22, -0.22),
      new THREE.Vector3(-0.05, -0.19, -0.18),
      new THREE.Vector3(-0.4, -0.26, -0.22)
    ]);

    const shankGeom = new THREE.BufferGeometry().setFromPoints(shankCurve.getPoints(24));
    // Create physical bridged ribbon
    const ribbonGeom = new THREE.BoxGeometry(0.7, 0.04, 0.38);
    ribbonGeom.rotateZ(0.08);
    const shankMesh = new THREE.Mesh(ribbonGeom, this.materials.carbon);
    shankMesh.position.set(0.02, -0.23, 0);
    shankMesh.castShadow = true;
    shank.add(shankMesh);

    // Laser-etched metallic gold branding on shank
    const badgeGeom = new THREE.BoxGeometry(0.3, 0.045, 0.12);
    badgeGeom.rotateZ(0.08);
    const badgeMesh = new THREE.Mesh(badgeGeom, this.materials.metallic);
    badgeMesh.position.set(0.02, -0.235, 0);
    shank.add(badgeMesh);
  }

  buildUpperBody() {
    const THREE = this.THREE;
    const upper = this.layers.upper;

    // We sculpt the aerodynamic sneaker upper using multiple sculpted geometric forms
    // 1. Forefoot / Toe Box (Smooth aerodynamic dome)
    const toeGeom = new THREE.SphereGeometry(0.55, 32, 24);
    toeGeom.scale(1.5, 0.75, 0.85);
    toeGeom.translate(-0.85, -0.02, 0);
    const toeMesh = new THREE.Mesh(toeGeom, this.materials.upper);
    toeMesh.castShadow = true;
    toeMesh.receiveShadow = true;
    upper.add(toeMesh);

    // Toe Cap Reinforcement Guard (Matte contrast trim)
    const toeCapGeom = new THREE.SphereGeometry(0.56, 32, 16, 0, Math.PI, 0, Math.PI * 0.45);
    toeCapGeom.scale(1.4, 0.76, 0.86);
    toeCapGeom.translate(-0.95, -0.04, 0);
    const toeCapMesh = new THREE.Mesh(toeCapGeom, this.materials.upperDetail);
    toeCapMesh.castShadow = true;
    upper.add(toeCapMesh);

    // 2. Midfoot & Ankle Collar Chassis (Streamlined body)
    const midGeom = new THREE.CylinderGeometry(0.42, 0.52, 1.25, 24);
    midGeom.rotateZ(Math.PI / 2);
    midGeom.scale(0.9, 0.8, 0.85);
    midGeom.translate(-0.1, 0.05, 0);
    const midMesh = new THREE.Mesh(midGeom, this.materials.upper);
    midMesh.castShadow = true;
    midMesh.receiveShadow = true;
    upper.add(midMesh);

    // 3. Ankle Opening / Sock Collar
    const collarGeom = new THREE.TorusGeometry(0.38, 0.08, 16, 32);
    collarGeom.rotateX(Math.PI / 2);
    collarGeom.scale(1.2, 0.75, 1);
    collarGeom.translate(0.35, 0.48, 0);
    const collarMesh = new THREE.Mesh(collarGeom, this.materials.upperDetail);
    collarMesh.castShadow = true;
    upper.add(collarMesh);

    // 4. Medial & Lateral Geometric Flank Panels (Aerodynamic strakes)
    [-1, 1].forEach((side) => {
      const strakeShape = new THREE.Shape();
      strakeShape.moveTo(-0.6, -0.15);
      strakeShape.lineTo(0.2, 0.28);
      strakeShape.lineTo(0.7, 0.1);
      strakeShape.lineTo(0.2, -0.12);
      strakeShape.closePath();

      const strakeExtrude = {
        depth: 0.04,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.02,
        bevelThickness: 0.02
      };

      const strakeGeom = new THREE.ExtrudeGeometry(strakeShape, strakeExtrude);
      strakeGeom.translate(0, 0, side * 0.4);
      const strakeMesh = new THREE.Mesh(strakeGeom, this.materials.upperDetail);
      strakeMesh.castShadow = true;
      upper.add(strakeMesh);

      // Gold accent slash on each flank (Signature luxury chevron)
      const slashGeom = new THREE.BoxGeometry(0.45, 0.04, 0.03);
      slashGeom.rotateZ(-0.4);
      const slashMesh = new THREE.Mesh(slashGeom, this.materials.metallic);
      slashMesh.position.set(0.1, 0.12, side * 0.44);
      upper.add(slashMesh);
    });
  }

  buildLacesAndTongue() {
    const THREE = this.THREE;
    const lacesGroup = this.layers.laces;

    // Sculpted Padded Tongue
    const tongueCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.6, 0.18, 0),
      new THREE.Vector3(-0.2, 0.38, 0),
      new THREE.Vector3(0.25, 0.65, 0),
      new THREE.Vector3(0.45, 0.72, 0)
    ]);
    const tongueGeom = new THREE.TubeGeometry(tongueCurve, 20, 0.22, 12, false);
    tongueGeom.scale(1, 0.45, 1);
    const tongueMesh = new THREE.Mesh(tongueGeom, this.materials.upperDetail);
    tongueMesh.castShadow = true;
    lacesGroup.add(tongueMesh);

    // 24K Gold Crown Tag on top of Tongue
    const tagGeom = new THREE.BoxGeometry(0.18, 0.04, 0.24);
    tagGeom.rotateZ(-0.25);
    const tagMesh = new THREE.Mesh(tagGeom, this.materials.metallic);
    tagMesh.position.set(0.38, 0.68, 0);
    lacesGroup.add(tagMesh);

    // 3D Tubular Crisscross Lacing System & Metallic Eyelet Rings
    const eyeletZ = 0.22;
    const eyeletPairs = [
      { x: -0.65, y: 0.22 },
      { x: -0.42, y: 0.32 },
      { x: -0.18, y: 0.42 },
      { x: 0.06, y: 0.52 },
      { x: 0.26, y: 0.60 }
    ];

    const ringGeom = new THREE.TorusGeometry(0.04, 0.015, 8, 16);

    for (let i = 0; i < eyeletPairs.length; i++) {
      const p = eyeletPairs[i];

      // Left eyelet ring
      const ringL = new THREE.Mesh(ringGeom, this.materials.metallic);
      ringL.position.set(p.x, p.y, eyeletZ);
      ringL.rotateY(Math.PI / 2);
      lacesGroup.add(ringL);

      // Right eyelet ring
      const ringR = new THREE.Mesh(ringGeom, this.materials.metallic);
      ringR.position.set(p.x, p.y, -eyeletZ);
      ringR.rotateY(Math.PI / 2);
      lacesGroup.add(ringR);

      // Horizontal / diagonal cross lace
      if (i < eyeletPairs.length - 1) {
        const nextP = eyeletPairs[i + 1];

        // Diagonal lace 1
        const laceCurve1 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(p.x, p.y + 0.02, eyeletZ),
          new THREE.Vector3((p.x + nextP.x) / 2, ((p.y + nextP.y) / 2) + 0.05, 0),
          new THREE.Vector3(nextP.x, nextP.y + 0.02, -eyeletZ)
        ]);
        const laceGeom1 = new THREE.TubeGeometry(laceCurve1, 16, 0.022, 8, false);
        const laceMesh1 = new THREE.Mesh(laceGeom1, this.materials.laces);
        laceMesh1.castShadow = true;
        lacesGroup.add(laceMesh1);

        // Diagonal lace 2
        const laceCurve2 = new THREE.CatmullRomCurve3([
          new THREE.Vector3(p.x, p.y + 0.02, -eyeletZ),
          new THREE.Vector3((p.x + nextP.x) / 2, ((p.y + nextP.y) / 2) + 0.04, 0),
          new THREE.Vector3(nextP.x, nextP.y + 0.02, eyeletZ)
        ]);
        const laceGeom2 = new THREE.TubeGeometry(laceCurve2, 16, 0.022, 8, false);
        const laceMesh2 = new THREE.Mesh(laceGeom2, this.materials.laces);
        laceMesh2.castShadow = true;
        lacesGroup.add(laceMesh2);
      }
    }

    // Finished dynamic lace knot and sleek hanging tips
    const knotGeom = new THREE.SphereGeometry(0.06, 12, 12);
    knotGeom.scale(1.2, 0.8, 1.4);
    const knotMesh = new THREE.Mesh(knotGeom, this.materials.laces);
    knotMesh.position.set(0.3, 0.64, 0);
    lacesGroup.add(knotMesh);

    // Hanging lace aglets (tips) with 24K gold tips
    [-0.08, 0.08].forEach((zOff) => {
      const tipCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.3, 0.64, zOff),
        new THREE.Vector3(0.35, 0.52, zOff * 1.5),
        new THREE.Vector3(0.38, 0.38, zOff * 2.0)
      ]);
      const tipLaceGeom = new THREE.TubeGeometry(tipCurve, 12, 0.018, 8, false);
      const tipLaceMesh = new THREE.Mesh(tipLaceGeom, this.materials.laces);
      lacesGroup.add(tipLaceMesh);

      // Gold aglet cap
      const agletGeom = new THREE.CylinderGeometry(0.022, 0.022, 0.07, 12);
      const agletMesh = new THREE.Mesh(agletGeom, this.materials.metallic);
      agletMesh.position.set(0.38, 0.36, zOff * 2.0);
      lacesGroup.add(agletMesh);
    });
  }

  buildHeelStabilizer() {
    const THREE = this.THREE;
    const stabilizer = this.layers.stabilizer;

    // Sculpted aerodynamic rear wing / spoiler cup electroplated in gold
    const heelCupGeom = new THREE.CylinderGeometry(0.48, 0.52, 0.65, 24, 1, true, -Math.PI * 0.5, Math.PI);
    heelCupGeom.rotateY(-Math.PI / 2);
    heelCupGeom.translate(0.95, 0.12, 0);
    const heelCupMesh = new THREE.Mesh(heelCupGeom, this.materials.metallic);
    heelCupMesh.castShadow = true;
    stabilizer.add(heelCupMesh);

    // Aerodynamic Downforce Fins extending rearward
    [-0.26, 0.26].forEach((z) => {
      const finGeom = new THREE.BoxGeometry(0.45, 0.12, 0.035);
      finGeom.rotateY(0.25 * Math.sign(z));
      const finMesh = new THREE.Mesh(finGeom, this.materials.metallic);
      finMesh.position.set(1.22, 0.06, z);
      finMesh.castShadow = true;
      stabilizer.add(finMesh);
    });

    // Rear pull loop
    const loopCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.9, 0.42, 0),
      new THREE.Vector3(1.25, 0.55, 0),
      new THREE.Vector3(0.85, 0.28, 0)
    ]);
    const loopGeom = new THREE.TubeGeometry(loopCurve, 16, 0.025, 8, false);
    const loopMesh = new THREE.Mesh(loopGeom, this.materials.upperDetail);
    stabilizer.add(loopMesh);
  }

  recordOriginalPositions() {
    this.originalTransforms = {
      sole: { x: 0, y: 0, z: 0 },
      cushion: { x: 0, y: 0, z: 0 },
      shank: { x: 0, y: 0, z: 0 },
      upper: { x: 0, y: 0, z: 0 },
      laces: { x: 0, y: 0, z: 0 },
      stabilizer: { x: 0, y: 0, z: 0 }
    };

    // Target offsets when fully exploded
    this.explodedOffsets = {
      sole: { x: 0, y: -0.85, z: 0 },
      cushion: { x: 0, y: -0.42, z: 0 },
      shank: { x: 0, y: -0.15, z: 0 },
      upper: { x: 0, y: 0.0, z: 0 },
      laces: { x: -0.1, y: 0.55, z: 0 },
      stabilizer: { x: 0.75, y: 0.2, z: 0 }
    };
  }

  /**
   * Set exploded view progress (0 to 1)
   */
  setExplodeProgress(val) {
    this.explodeProgress = Math.max(0, Math.min(1, val));

    for (const key in this.layers) {
      if (this.layers[key] && this.explodedOffsets[key]) {
        const off = this.explodedOffsets[key];
        this.layers[key].position.x = off.x * this.explodeProgress;
        this.layers[key].position.y = off.y * this.explodeProgress;
        this.layers[key].position.z = off.z * this.explodeProgress;
      }
    }
  }

  /**
   * Smoothly apply a colorway configuration
   */
  applyColorway(colorway, animate = true) {
    const THREE = this.THREE;
    const c = colorway.colors;

    if (animate && window.gsap) {
      // Smooth color transitions via GSAP
      const tweenColor = (mat, prop, targetHex) => {
        if (!mat || !mat[prop]) return;
        const targetColor = new THREE.Color(targetHex);
        window.gsap.to(mat[prop], {
          r: targetColor.r,
          g: targetColor.g,
          b: targetColor.b,
          duration: 0.85,
          ease: "power2.out"
        });
      };

      tweenColor(this.materials.upper, "color", c.upper);
      tweenColor(this.materials.upperDetail, "color", c.upperDetail);
      tweenColor(this.materials.sole, "color", c.sole);
      tweenColor(this.materials.tread, "color", c.tread);
      tweenColor(this.materials.cushionGlass, "color", c.cushion);
      tweenColor(this.materials.glow, "color", c.glow);
      tweenColor(this.materials.glow, "emissive", c.glow);
      tweenColor(this.materials.metallic, "color", c.metallic);
      tweenColor(this.materials.accent, "color", c.accent);
      tweenColor(this.materials.laces, "color", c.laces);
    } else {
      // Instant transition
      this.materials.upper.color.setHex(c.upper);
      this.materials.upperDetail.color.setHex(c.upperDetail);
      this.materials.sole.color.setHex(c.sole);
      this.materials.tread.color.setHex(c.tread);
      this.materials.cushionGlass.color.setHex(c.cushion);
      this.materials.glow.color.setHex(c.glow);
      this.materials.glow.emissive.setHex(c.glow);
      this.materials.metallic.color.setHex(c.metallic);
      this.materials.accent.color.setHex(c.accent);
      this.materials.laces.color.setHex(c.laces);
    }
  }

  /**
   * Toggle wireframe mode for X-Ray / Blueprint inspection
   */
  setWireframe(enabled) {
    for (const key in this.materials) {
      this.materials[key].wireframe = enabled;
    }
  }

  /**
   * Highlight a specific component layer and dim others
   */
  isolateLayer(layerName) {
    if (!layerName || layerName === "all") {
      for (const key in this.materials) {
        this.materials[key].opacity = key === "cushionGlass" ? 0.55 : 1.0;
        this.materials[key].transparent = key === "cushionGlass";
      }
      return;
    }

    // Dim non-selected
    for (const key in this.materials) {
      this.materials[key].transparent = true;
      this.materials[key].opacity = 0.22;
    }

    // Brighten target
    if (this.materials[layerName]) {
      this.materials[layerName].transparent = false;
      this.materials[layerName].opacity = 1.0;
    }
  }
}
