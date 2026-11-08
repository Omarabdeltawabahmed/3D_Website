/**
 * FIS-LUXE // High-Performance WebGL 3D Scene Controller
 * Manages Three.js renderer, studio lighting, camera choreography,
 * mouse parallax, 3D hotspots, and render loop.
 */

import { LuxuryShoeModel } from "./shoe-model.js";
import { CONFIG } from "./config.js";

export class ThreeSceneManager {
  constructor(canvasContainerId) {
    this.container = document.getElementById(canvasContainerId);
    if (!this.container) {
      console.error(`Container #${canvasContainerId} not found.`);
      return;
    }

    this.THREE = window.THREE;
    if (!this.THREE) {
      console.error("Three.js not loaded.");
      return;
    }

    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    // State
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.autoRotate = true;
    this.autoRotateSpeed = 0.005;
    this.hotspotElements = [];
    this.activeHotspot = null;

    // Camera waypoint targets for scroll positions
    this.cameraCurrent = {
      x: 0,
      y: 0.8,
      z: 4.2,
      targetX: 0,
      targetY: 0,
      targetZ: 0
    };

    this.cameraGoal = {
      x: 0,
      y: 0.8,
      z: 4.2,
      targetX: 0,
      targetY: 0,
      targetZ: 0
    };

    this.modelRotation = {
      x: 0.1,
      y: -0.6,
      z: 0,
      targetX: 0.1,
      targetY: -0.6,
      targetZ: 0
    };

    this.init();
  }

  init() {
    const THREE = this.THREE;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x07080b, 0.12);

    // 2. Camera (responsive FOV based on aspect ratio)
    const aspect = this.width / this.height;
    const initialFov = aspect < 1 ? 55 : 42;
    this.camera = new THREE.PerspectiveCamera(initialFov, aspect, 0.1, 100);
    this.camera.position.set(this.cameraCurrent.x, this.cameraCurrent.y, this.cameraCurrent.z);

    // 3. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;

    this.container.appendChild(this.renderer.domElement);

    // 4. Studio Lighting Rig
    this.setupLighting();

    // 5. Pedestal & Cyber Environment Elements
    this.setupPedestal();
    this.setupParticles();

    // 6. Build the 3D Luxury Sneaker
    this.shoe = new LuxuryShoeModel(THREE);
    this.scene.add(this.shoe.group);

    // 7. Initialize 3D Hotspot DOM Elements
    this.initHotspots();

    // 8. Event Listeners
    this.bindEvents();

    // 9. Start Render Loop
    this.clock = new THREE.Clock();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLighting() {
    const THREE = this.THREE;

    // Subtle ambient fill
    const ambientLight = new THREE.AmbientLight(0x161824, 1.8);
    this.scene.add(ambientLight);

    // Warm Gold Key Light (Sculpts the silhouette with rich highlights)
    this.keyLight = new THREE.DirectionalLight(0xfff1cf, 2.8);
    this.keyLight.position.set(4, 5, 4);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 0.5;
    this.keyLight.shadow.camera.far = 25;
    this.keyLight.shadow.bias = -0.0005;
    this.scene.add(this.keyLight);

    // Cool Cyan / Indigo Rim Light (defines outer edges)
    this.rimLight = new THREE.DirectionalLight(0x00d4ff, 2.0);
    this.rimLight.position.set(-5, 3, -4);
    this.scene.add(this.rimLight);

    // Under-pedestal Gold Glow Light
    this.underLight = new THREE.PointLight(0xffb703, 3.2, 8);
    this.underLight.position.set(0, -1.1, 0);
    this.scene.add(this.underLight);

    // Dynamic mouse-following spotlight
    this.mouseSpotlight = new THREE.SpotLight(0xffecc2, 3.5, 12, Math.PI / 6, 0.4, 1);
    this.mouseSpotlight.position.set(0, 3, 3);
    this.mouseSpotlight.target = this.shoe ? this.shoe.group : this.scene;
    this.scene.add(this.mouseSpotlight);
  }

  setupPedestal() {
    const THREE = this.THREE;
    this.pedestalGroup = new THREE.Group();

    // Shadow receiver ground floor plane
    const groundGeom = new THREE.PlaneGeometry(30, 30);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.45 });
    const groundMesh = new THREE.Mesh(groundGeom, groundMat);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.position.y = -1.2;
    groundMesh.receiveShadow = true;
    this.pedestalGroup.add(groundMesh);

    // Concentric luxury gold aura rings on floor
    const ringRadii = [1.2, 1.8, 2.4, 3.2];
    ringRadii.forEach((radius, i) => {
      const ringGeom = new THREE.RingGeometry(radius, radius + 0.015, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? 0xd4af37 : 0x334155,
        transparent: true,
        opacity: (0.4 - i * 0.08),
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      ringMesh.rotation.x = -Math.PI / 2;
      ringMesh.position.y = -1.19 + i * 0.001;
      this.pedestalGroup.add(ringMesh);
    });

    // Dark circular pedestal plinth
    const plinthGeom = new THREE.CylinderGeometry(1.6, 1.7, 0.08, 48);
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x0c0e14,
      roughness: 0.35,
      metalness: 0.8
    });
    const plinth = new THREE.Mesh(plinthGeom, plinthMat);
    plinth.position.y = -1.24;
    plinth.receiveShadow = true;
    this.pedestalGroup.add(plinth);

    this.scene.add(this.pedestalGroup);
  }

  setupParticles() {
    const THREE = this.THREE;
    const particleCount = 120;
    const geom = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 8;
      positions[i + 1] = Math.random() * 4 - 1.2;
      positions[i + 2] = (Math.random() - 0.5) * 8;
    }

    geom.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xf3c74d,
      size: 0.035,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geom, mat);
    this.scene.add(this.particles);
  }

  initHotspots() {
    const overlay = document.getElementById("hotspots-container");
    if (!overlay) return;

    overlay.innerHTML = "";
    this.hotspotElements = [];

    CONFIG.hotspots.forEach((spot) => {
      const el = document.createElement("div");
      el.className = "hotspot-marker absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 opacity-0 group";
      el.setAttribute("data-id", spot.id);

      el.innerHTML = `
        <button class="relative flex items-center justify-center w-8 h-8 rounded-full bg-black/70 backdrop-blur-md border border-amber-400/80 shadow-[0_0_15px_rgba(230,180,34,0.5)] transition-all duration-300 group-hover:scale-125 focus:outline-none">
          <span class="absolute w-full h-full rounded-full bg-amber-400/20 animate-ping"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-amber-300"></span>
        </button>
        <div class="hotspot-popup hidden group-hover:block sm:block opacity-0 group-hover:opacity-100 pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 w-64 p-3 bg-black/85 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl transition-all duration-300 z-30">
          <div class="text-[10px] font-mono tracking-widest text-amber-400 uppercase mb-1">${spot.category}</div>
          <div class="text-sm font-bold text-white mb-1">${spot.title}</div>
          <div class="text-xs text-neutral-400 leading-relaxed">${spot.description}</div>
        </div>
      `;

      el.addEventListener("click", () => {
        this.selectHotspot(spot);
      });

      overlay.appendChild(el);

      this.hotspotElements.push({
        spot: spot,
        element: el,
        pos3D: new this.THREE.Vector3(spot.position.x * 1.5, spot.position.y * 1.5, spot.position.z * 1.5)
      });
    });
  }

  updateHotspots() {
    if (!this.hotspotElements || this.hotspotElements.length === 0) return;

    const widthHalf = this.width / 2;
    const heightHalf = this.height / 2;

    this.hotspotElements.forEach((item) => {
      // Transform local shoe point into world space
      const worldPos = item.pos3D.clone();
      this.shoe.group.localToWorld(worldPos);

      // Project onto 2D screen
      const screenPos = worldPos.clone().project(this.camera);

      // Check if behind camera
      if (screenPos.z > 1) {
        item.element.style.opacity = "0";
        item.element.style.pointerEvents = "none";
        return;
      }

      const x = (screenPos.x * widthHalf) + widthHalf;
      const y = -(screenPos.y * heightHalf) + heightHalf;

      item.element.style.left = `${x}px`;
      item.element.style.top = `${y}px`;
      item.element.style.opacity = "1";
      item.element.style.pointerEvents = "auto";
    });
  }

  selectHotspot(spot) {
    this.activeHotspot = spot;
    window.dispatchEvent(new CustomEvent("hotspot-selected", { detail: spot }));
  }

  bindEvents() {
    // Resize
    window.addEventListener("resize", () => this.onWindowResize());

    // Mouse Parallax & Spotlight follow
    window.addEventListener("mousemove", (e) => {
      this.mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1;
      this.mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1;

      // Update dynamic spotlight target
      if (this.mouseSpotlight) {
        this.mouseSpotlight.position.x = this.mouse.targetX * 3;
        this.mouseSpotlight.position.y = 2.5 + this.mouse.targetY * 1.5;
      }
    });

    // Interactive Drag to Rotate Canvas
    const el = this.renderer.domElement;

    const startDrag = (clientX, clientY) => {
      this.isDragging = true;
      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const drag = (clientX, clientY) => {
      if (!this.isDragging) return;
      const deltaX = clientX - this.previousMousePosition.x;
      const deltaY = clientY - this.previousMousePosition.y;

      this.modelRotation.targetY += deltaX * 0.008;
      this.modelRotation.targetX += deltaY * 0.005;

      // Clamp X rotation to prevent flipping upside down
      this.modelRotation.targetX = Math.max(-0.6, Math.min(0.8, this.modelRotation.targetX));

      this.previousMousePosition = { x: clientX, y: clientY };
    };

    const stopDrag = () => {
      this.isDragging = false;
    };

    el.addEventListener("mousedown", (e) => startDrag(e.clientX, e.clientY));
    window.addEventListener("mousemove", (e) => drag(e.clientX, e.clientY));
    window.addEventListener("mouseup", stopDrag);

    // Touch support for mobile / tablet
    el.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener("touchmove", (e) => {
      if (e.touches.length === 1 && this.isDragging) {
        drag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener("touchend", stopDrag);

    // Interactive Zoom via Scroll Wheel inside canvas
    el.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomDelta = e.deltaY * 0.002;
      this.cameraGoal.z = Math.max(2.8, Math.min(6.5, this.cameraGoal.z + zoomDelta));
    }, { passive: false });
  }

  onWindowResize() {
    if (!this.container) return;
    this.width = this.container.clientWidth;
    this.height = this.container.clientHeight;

    const aspect = this.width / this.height;
    this.camera.aspect = aspect;
    this.camera.fov = aspect < 1 ? 55 : 42;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  /**
   * Set target camera waypoint based on scroll section
   */
  setCameraGoal(pos, lookTarget = { x: 0, y: 0, z: 0 }, shoeRot = null) {
    if (pos.x !== undefined) this.cameraGoal.x = pos.x;
    if (pos.y !== undefined) this.cameraGoal.y = pos.y;
    if (pos.z !== undefined) this.cameraGoal.z = pos.z;

    if (lookTarget.x !== undefined) this.cameraGoal.targetX = lookTarget.x;
    if (lookTarget.y !== undefined) this.cameraGoal.targetY = lookTarget.y;
    if (lookTarget.z !== undefined) this.cameraGoal.targetZ = lookTarget.z;

    if (shoeRot) {
      if (shoeRot.x !== undefined) this.modelRotation.targetX = shoeRot.x;
      if (shoeRot.y !== undefined) this.modelRotation.targetY = shoeRot.y;
      if (shoeRot.z !== undefined) this.modelRotation.targetZ = shoeRot.z;
    }
  }

  /**
   * Main animation & render loop (60+ FPS lerp-smoothed)
   */
  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // 1. Mouse coordinate smoothing
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.08;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.08;

    // 2. Camera smooth interpolation
    this.cameraCurrent.x += (this.cameraGoal.x - this.cameraCurrent.x) * 0.06;
    this.cameraCurrent.y += (this.cameraGoal.y - this.cameraCurrent.y) * 0.06;
    this.cameraCurrent.z += (this.cameraGoal.z - this.cameraCurrent.z) * 0.06;

    this.cameraCurrent.targetX += (this.cameraGoal.targetX - this.cameraCurrent.targetX) * 0.06;
    this.cameraCurrent.targetY += (this.cameraGoal.targetY - this.cameraCurrent.targetY) * 0.06;
    this.cameraCurrent.targetZ += (this.cameraGoal.targetZ - this.cameraCurrent.targetZ) * 0.06;

    // Add subtle camera parallax breathing based on mouse
    const parallaxX = this.mouse.x * 0.25;
    const parallaxY = this.mouse.y * 0.2;

    this.camera.position.set(
      this.cameraCurrent.x + parallaxX,
      this.cameraCurrent.y + parallaxY,
      this.cameraCurrent.z
    );

    this.camera.lookAt(
      this.cameraCurrent.targetX,
      this.cameraCurrent.targetY,
      this.cameraCurrent.targetZ
    );

    // 3. Model rotation & auto-spin logic
    if (this.autoRotate && !this.isDragging) {
      this.modelRotation.targetY += this.autoRotateSpeed;
    }

    this.modelRotation.x += (this.modelRotation.targetX - this.modelRotation.x) * 0.08;
    this.modelRotation.y += (this.modelRotation.targetY - this.modelRotation.y) * 0.08;
    this.modelRotation.z += (this.modelRotation.targetZ - this.modelRotation.z) * 0.08;

    if (this.shoe && this.shoe.group) {
      // Gentle floating levitation sine wave
      const floatOffset = Math.sin(elapsedTime * 1.8) * 0.04;
      this.shoe.group.position.y = floatOffset;

      this.shoe.group.rotation.x = this.modelRotation.x;
      this.shoe.group.rotation.y = this.modelRotation.y;
      this.shoe.group.rotation.z = this.modelRotation.z;
    }

    // 4. Particle drift
    if (this.particles) {
      this.particles.rotation.y = elapsedTime * 0.02;
    }

    // 5. Update 3D Hotspot Screen Coordinates
    this.updateHotspots();

    // 6. Render
    this.renderer.render(this.scene, this.camera);
  }
}
