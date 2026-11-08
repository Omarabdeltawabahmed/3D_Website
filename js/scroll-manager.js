/**
 * FIS-LUXE // Scroll Choreography & Camera Waypoint Director
 * Manages scroll-driven camera transitions, GSAP ScrollTrigger integration,
 * and section reveal animations.
 */

export class ScrollManager {
  constructor(sceneManager) {
    this.sm = sceneManager;
    this.progressBar = document.getElementById("scroll-progress-bar");
    this.sections = document.querySelectorAll("section[data-scene-step]");
    this.currentStep = 0;

    this.init();
  }

  init() {
    this.setupWaypoints();
    this.bindScroll();
    this.checkScroll();
  }

  setupWaypoints() {
    // Defined camera coordinates and model rotations per section
    this.waypoints = [
      {
        step: 0, // Hero Section
        camera: { x: 0, y: 0.8, z: 4.2 },
        target: { x: 0, y: 0, z: 0 },
        rotation: { x: 0.1, y: -0.6, z: 0 }
      },
      {
        step: 1, // Architecture & Pneumatic Air Unit
        camera: { x: 1.1, y: -0.1, z: 2.7 },
        target: { x: 0.4, y: -0.2, z: 0 },
        rotation: { x: 0.2, y: -1.1, z: 0.05 }
      },
      {
        step: 2, // Carbon Fiber Chassis & Material Specs
        camera: { x: -0.6, y: -0.6, z: 2.9 },
        target: { x: -0.1, y: -0.2, z: 0 },
        rotation: { x: -0.6, y: 0.5, z: 0.15 }
      },
      {
        step: 3, // 3D Interactive Atelier Studio
        camera: { x: 0, y: 0.5, z: 3.8 },
        target: { x: 0, y: 0, z: 0 },
        rotation: { x: 0.1, y: -0.6, z: 0 }
      },
      {
        step: 4, // Bespoke Pre-Order & Limited Edition Vault
        camera: { x: -1.3, y: 0.3, z: 3.2 },
        target: { x: -0.5, y: 0, z: 0 },
        rotation: { x: 0.15, y: 0.85, z: -0.1 }
      }
    ];
  }

  bindScroll() {
    window.addEventListener("scroll", () => {
      this.checkScroll();
    }, { passive: true });
  }

  checkScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;

    // 1. Update top progress bar
    if (this.progressBar) {
      this.progressBar.style.width = `${progress * 100}%`;
    }

    // 2. Identify active section based on scroll center
    const viewportMiddle = scrollY + window.innerHeight * 0.45;
    let activeIndex = 0;

    this.sections.forEach((sec, idx) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;

      if (viewportMiddle >= top && viewportMiddle < top + height) {
        activeIndex = idx;
      }
    });

    if (activeIndex !== this.currentStep) {
      this.currentStep = activeIndex;
      this.transitionToStep(this.currentStep);
    }

    // 3. Reveal on scroll effects for HTML text cards
    document.querySelectorAll(".reveal-on-scroll").forEach((el) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;
      if (inView) {
        el.classList.add("is-visible");
      }
    });
  }

  transitionToStep(stepIndex) {
    const waypoint = this.waypoints[stepIndex] || this.waypoints[0];

    // Smoothly update camera and shoe rotation goals in scene manager
    this.sm.setCameraGoal(
      waypoint.camera,
      waypoint.target,
      waypoint.rotation
    );

    // If entering section 3 (Atelier Studio), enable full 360 interaction
    const isStudio = stepIndex === 3;
    const studioBadge = document.getElementById("studio-active-badge");
    if (studioBadge) {
      studioBadge.classList.toggle("opacity-100", isStudio);
      studioBadge.classList.toggle("opacity-0", !isStudio);
    }
  }
}
