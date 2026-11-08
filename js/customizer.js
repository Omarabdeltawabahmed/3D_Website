/**
 * FIS-LUXE // Interactive Atelier & 3D Customizer Controller
 * Controls colorway switching, exploded view choreography,
 * wireframe blueprint toggles, and material isolation.
 */

import { CONFIG } from "./config.js";
import { audio } from "./audio.js";

export class CustomizerController {
  constructor(sceneManager) {
    this.sm = sceneManager;
    this.shoe = sceneManager.shoe;
    this.activeColorway = CONFIG.colorways[0];
    this.isExploded = false;
    this.isWireframe = false;
    this.isAutoSpinning = true;

    this.initUI();
    this.bindControls();
  }

  initUI() {
    this.renderColorwaySwatches();
  }

  renderColorwaySwatches() {
    const container = document.getElementById("colorway-swatches");
    if (!container) return;

    container.innerHTML = "";

    CONFIG.colorways.forEach((cw, idx) => {
      const btn = document.createElement("button");
      btn.className = `colorway-btn group relative flex items-center gap-3 w-full p-2.5 rounded-xl border transition-all duration-300 text-left ${
        idx === 0
          ? "border-amber-400/80 bg-amber-400/10 shadow-[0_0_20px_rgba(230,180,34,0.15)]"
          : "border-white/10 bg-white/[0.03] hover:border-white/30 hover:bg-white/[0.06]"
      }`;
      btn.setAttribute("data-id", cw.id);

      btn.innerHTML = `
        <div class="relative flex items-center justify-center w-7 h-7 rounded-full border border-white/20 shadow-inner flex-shrink-0" style="background: ${cw.hexPreview}">
          <span class="active-indicator ${idx === 0 ? "scale-100" : "scale-0"} w-2 h-2 rounded-full bg-black transition-transform duration-300"></span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-white truncate">${cw.name}</span>
            <span class="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded border ${cw.tagColor} font-mono">${cw.badge}</span>
          </div>
          <p class="text-[10px] text-neutral-400 truncate mt-0.5">${cw.subtitle}</p>
        </div>
      `;

      btn.addEventListener("click", () => {
        this.selectColorway(cw, btn);
      });

      container.appendChild(btn);
    });
  }

  selectColorway(colorway, clickedBtn) {
    if (this.activeColorway.id === colorway.id) return;

    this.activeColorway = colorway;
    audio.playWhoosh();

    // Update UI swatch button styles
    document.querySelectorAll(".colorway-btn").forEach((b) => {
      b.classList.remove("border-amber-400/80", "bg-amber-400/10", "shadow-[0_0_20px_rgba(230,180,34,0.15)]");
      b.classList.add("border-white/10", "bg-white/[0.03]");
      const ind = b.querySelector(".active-indicator");
      if (ind) ind.classList.remove("scale-100"), ind.classList.add("scale-0");
    });

    if (clickedBtn) {
      clickedBtn.classList.add("border-amber-400/80", "bg-amber-400/10", "shadow-[0_0_20px_rgba(230,180,34,0.15)]");
      clickedBtn.classList.remove("border-white/10", "bg-white/[0.03]");
      const ind = clickedBtn.querySelector(".active-indicator");
      if (ind) ind.classList.remove("scale-0"), ind.classList.add("scale-100");
    }

    // Update active colorway label in hero and customizer
    const nameLabels = document.querySelectorAll(".current-colorway-name");
    nameLabels.forEach((el) => (el.textContent = colorway.name));

    // Update 3D model materials
    this.shoe.applyColorway(colorway, true);

    // Update under-glow light to match
    if (this.sm.underLight) {
      if (window.gsap) {
        const c = new this.sm.THREE.Color(colorway.colors.glow);
        window.gsap.to(this.sm.underLight.color, {
          r: c.r,
          g: c.g,
          b: c.b,
          duration: 0.8
        });
      } else {
        this.sm.underLight.color.setHex(colorway.colors.glow);
      }
    }
  }

  bindControls() {
    // 1. Exploded View Toggle Button
    const explodeBtn = document.getElementById("btn-explode");
    if (explodeBtn) {
      explodeBtn.addEventListener("click", () => {
        this.toggleExplodedView(explodeBtn);
      });
    }

    // 2. Wireframe / Blueprint Toggle
    const wireframeBtn = document.getElementById("btn-wireframe");
    if (wireframeBtn) {
      wireframeBtn.addEventListener("click", () => {
        this.toggleWireframe(wireframeBtn);
      });
    }

    // 3. Auto Spin 360 Toggle
    const spinBtn = document.getElementById("btn-autospin");
    if (spinBtn) {
      spinBtn.addEventListener("click", () => {
        this.toggleAutoSpin(spinBtn);
      });
    }

    // 4. Reset View Camera
    const resetBtn = document.getElementById("btn-reset-view");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        this.resetView();
      });
    }

    // 5. Material Inspector Tabs
    document.querySelectorAll("[data-material-inspect]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const mat = btn.getAttribute("data-material-inspect");
        audio.playClick();

        document.querySelectorAll("[data-material-inspect]").forEach((b) => {
          b.classList.remove("bg-amber-400", "text-black", "font-bold");
          b.classList.add("bg-white/5", "text-neutral-300");
        });

        btn.classList.add("bg-amber-400", "text-black", "font-bold");
        btn.classList.remove("bg-white/5", "text-neutral-300");

        this.shoe.isolateLayer(mat);
      });
    });
  }

  toggleExplodedView(btn) {
    this.isExploded = !this.isExploded;
    audio.playMechanical();

    const targetProgress = this.isExploded ? 1.0 : 0.0;

    if (window.gsap) {
      window.gsap.to(this.shoe, {
        explodeProgress: targetProgress,
        duration: 1.2,
        ease: "power3.inOut",
        onUpdate: () => {
          this.shoe.setExplodeProgress(this.shoe.explodeProgress);
        }
      });
    } else {
      this.shoe.setExplodeProgress(targetProgress);
    }

    if (btn) {
      const text = btn.querySelector(".btn-label");
      if (text) text.textContent = this.isExploded ? "Assemble Silhouette" : "Exploded Architecture";
      btn.classList.toggle("bg-amber-400/20", this.isExploded);
      btn.classList.toggle("border-amber-400", this.isExploded);
    }
  }

  toggleWireframe(btn) {
    this.isWireframe = !this.isWireframe;
    audio.playClick();
    this.shoe.setWireframe(this.isWireframe);

    if (btn) {
      btn.classList.toggle("bg-amber-400/20", this.isWireframe);
      btn.classList.toggle("border-amber-400", this.isWireframe);
      const text = btn.querySelector(".btn-label");
      if (text) text.textContent = this.isWireframe ? "Shaded PBR" : "X-Ray Wireframe";
    }
  }

  toggleAutoSpin(btn) {
    this.isAutoSpinning = !this.isAutoSpinning;
    this.sm.autoRotate = this.isAutoSpinning;
    audio.playClick();

    if (btn) {
      btn.classList.toggle("bg-amber-400/20", this.isAutoSpinning);
      btn.classList.toggle("border-amber-400", this.isAutoSpinning);
    }
  }

  resetView() {
    audio.playClick();
    this.sm.setCameraGoal(
      { x: 0, y: 0.8, z: 4.2 },
      { x: 0, y: 0, z: 0 },
      { x: 0.1, y: -0.6, z: 0 }
    );
  }
}
