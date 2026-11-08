/**
 * FIS-LUXE // Main Application Orchestrator
 * Connects 3D WebGL engine, customizer, audio, cart, modals, and UI interactions.
 */

import { CONFIG } from "./config.js";
import { audio } from "./audio.js";
import { ThreeSceneManager } from "./three-scene.js";
import { CustomizerController } from "./customizer.js";
import { ScrollManager } from "./scroll-manager.js";

class LuxeApp {
  constructor() {
    this.selectedSize = CONFIG.sizes[3]; // Default size 9.5
    this.cart = [];
    this.isMuted = false;

    this.init();
  }

  init() {
    // 1. Initialize Three.js WebGL Scene
    this.sceneManager = new ThreeSceneManager("webgl-canvas-container");

    // 2. Initialize Interactive 3D Customizer
    this.customizer = new CustomizerController(this.sceneManager);

    // 3. Initialize Scroll Choreography
    this.scrollManager = new ScrollManager(this.sceneManager);

    // 4. Populate dynamic UI elements (Sizes, Specs)
    this.populateSpecs();
    this.populateSizes();

    // 5. Setup UI Event Listeners
    this.bindUIEvents();

    console.log("FIS-LUXE AERO-1 // System Initialized.");
  }

  populateSpecs() {
    const container = document.getElementById("specs-matrix-grid");
    if (!container) return;

    container.innerHTML = "";
    CONFIG.specs.forEach((spec) => {
      const card = document.createElement("div");
      card.className = "p-4 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md hover:border-amber-400/40 transition-all duration-300";
      card.innerHTML = `
        <div class="text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-1">${spec.label}</div>
        <div class="text-2xl font-black text-amber-400 tracking-tight mb-0.5">${spec.value}</div>
        <div class="text-xs text-neutral-500">${spec.detail}</div>
      `;
      container.appendChild(card);
    });
  }

  populateSizes() {
    const container = document.getElementById("size-selector-grid");
    if (!container) return;

    container.innerHTML = "";
    CONFIG.sizes.forEach((s) => {
      const btn = document.createElement("button");
      const isSelected = this.selectedSize.us === s.us;
      btn.className = `size-btn relative flex flex-col items-center justify-center py-2.5 px-3 rounded-xl border text-sm font-semibold transition-all duration-300 ${
        isSelected
          ? "border-amber-400 bg-amber-400/15 text-amber-300 shadow-[0_0_15px_rgba(230,180,34,0.2)]"
          : "border-white/10 bg-white/[0.02] text-neutral-300 hover:border-white/30"
      }`;

      btn.innerHTML = `
        <span class="text-sm font-bold">US ${s.us}</span>
        <span class="text-[10px] text-neutral-500 font-mono">EU ${s.eu}</span>
        <span class="text-[9px] text-amber-500/80 font-mono mt-0.5">${s.stock} left</span>
      `;

      btn.addEventListener("click", () => {
        this.selectSize(s, btn);
      });

      container.appendChild(btn);
    });
  }

  selectSize(sizeObj, clickedBtn) {
    this.selectedSize = sizeObj;
    audio.playClick();

    document.querySelectorAll(".size-btn").forEach((b) => {
      b.classList.remove("border-amber-400", "bg-amber-400/15", "text-amber-300", "shadow-[0_0_15px_rgba(230,180,34,0.2)]");
      b.classList.add("border-white/10", "bg-white/[0.02]", "text-neutral-300");
    });

    clickedBtn.classList.add("border-amber-400", "bg-amber-400/15", "text-amber-300", "shadow-[0_0_15px_rgba(230,180,34,0.2)]");
    clickedBtn.classList.remove("border-white/10", "bg-white/[0.02]", "text-neutral-300");

    const sizeDisplay = document.getElementById("selected-size-display");
    if (sizeDisplay) {
      sizeDisplay.textContent = `US ${sizeObj.us} / EU ${sizeObj.eu}`;
    }
  }

  bindUIEvents() {
    // 1. Audio Mute Toggle
    const soundToggle = document.getElementById("btn-sound-toggle");
    if (soundToggle) {
      soundToggle.addEventListener("click", () => {
        const isEnabled = audio.toggleMute();
        this.isMuted = !isEnabled;
        audio.playClick();

        const soundIcon = document.getElementById("sound-icon");
        const soundLabel = document.getElementById("sound-label");
        if (soundIcon) {
          soundIcon.innerHTML = isEnabled
            ? `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M11 5L6 9H2v6h4l5 4V5z"/>`
            : `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z m11.414-4l4 4m0-4l-4 4"/>`;
        }
        if (soundLabel) soundLabel.textContent = isEnabled ? "AUDIO ON" : "MUTED";
      });
    }

    // 2. Pre-Order & Checkout Modal Buttons
    const preOrderBtns = document.querySelectorAll(".btn-open-preorder");
    preOrderBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        audio.playClick();
        this.openOrderModal();
      });
    });

    const closeModalBtn = document.getElementById("btn-close-modal");
    if (closeModalBtn) {
      closeModalBtn.addEventListener("click", () => {
        audio.playClick();
        this.closeOrderModal();
      });
    }

    // Modal background click to dismiss
    const modalBackdrop = document.getElementById("order-modal");
    if (modalBackdrop) {
      modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) {
          this.closeOrderModal();
        }
      });
    }

    // 3. Confirm Pre-Order Form Submission
    const orderForm = document.getElementById("preorder-form");
    if (orderForm) {
      orderForm.addEventListener("submit", (e) => {
        e.preventDefault();
        this.handleOrderSubmit();
      });
    }

    // 4. Cart Slide-out Drawer
    const cartToggle = document.getElementById("btn-cart-toggle");
    const cartDrawer = document.getElementById("cart-drawer");
    const closeCartBtn = document.getElementById("btn-close-cart");

    if (cartToggle && cartDrawer) {
      cartToggle.addEventListener("click", () => {
        audio.playClick();
        cartDrawer.classList.toggle("translate-x-full");
      });
    }

    if (closeCartBtn && cartDrawer) {
      closeCartBtn.addEventListener("click", () => {
        audio.playClick();
        cartDrawer.classList.add("translate-x-full");
      });
    }

    // 5. Add to Cart Quick Action
    const addToCartBtn = document.getElementById("btn-add-to-cart");
    if (addToCartBtn) {
      addToCartBtn.addEventListener("click", () => {
        this.addToCart();
      });
    }

    // 6. Smooth navigation link scrolling
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute("href");
        if (targetId === "#") return;
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          audio.playClick();
          targetEl.scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    // 7. Hotspot selected custom event
    window.addEventListener("hotspot-selected", (e) => {
      const spot = e.detail;
      audio.playClick();
      this.showHotspotDetailModal(spot);
    });
  }

  openOrderModal() {
    const modal = document.getElementById("order-modal");
    if (!modal) return;

    // Update modal summary with active colorway & size
    const colorwayEl = document.getElementById("modal-colorway-name");
    const sizeEl = document.getElementById("modal-selected-size");
    const priceEl = document.getElementById("modal-price-display");

    if (colorwayEl) colorwayEl.textContent = this.customizer.activeColorway.name;
    if (sizeEl) sizeEl.textContent = `US ${this.selectedSize.us} (EU ${this.selectedSize.eu})`;
    if (priceEl) priceEl.textContent = `$${CONFIG.brand.price.toLocaleString()} ${CONFIG.brand.currency}`;

    modal.classList.remove("hidden");
    setTimeout(() => {
      modal.classList.remove("opacity-0");
    }, 10);
  }

  closeOrderModal() {
    const modal = document.getElementById("order-modal");
    if (!modal) return;
    modal.classList.add("opacity-0");
    setTimeout(() => {
      modal.classList.add("hidden");
    }, 300);
  }

  addToCart() {
    const item = {
      id: `${this.customizer.activeColorway.id}-${this.selectedSize.us}`,
      name: `${CONFIG.brand.name} ${CONFIG.brand.model}`,
      colorway: this.customizer.activeColorway.name,
      colorHex: this.customizer.activeColorway.hexPreview,
      size: this.selectedSize.us,
      euSize: this.selectedSize.eu,
      price: CONFIG.brand.price
    };

    this.cart.push(item);
    audio.playSuccess();
    this.updateCartUI();

    // Trigger visual toast
    this.showToast(`Added ${item.colorway} (US ${item.size}) to Atelier Bag`);
  }

  updateCartUI() {
    const badge = document.getElementById("cart-count-badge");
    if (badge) {
      badge.textContent = this.cart.length;
      badge.classList.remove("hidden");
      badge.classList.add("animate-pulse");
      setTimeout(() => badge.classList.remove("animate-pulse"), 1000);
    }

    const itemsContainer = document.getElementById("cart-items-list");
    const totalDisplay = document.getElementById("cart-total-amount");

    if (itemsContainer) {
      if (this.cart.length === 0) {
        itemsContainer.innerHTML = `<div class="text-neutral-500 text-center py-12 text-sm font-mono">Your Atelier Bag is currently empty.</div>`;
      } else {
        itemsContainer.innerHTML = "";
        let total = 0;

        this.cart.forEach((item, index) => {
          total += item.price;
          const el = document.createElement("div");
          el.className = "flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/10";
          el.innerHTML = `
            <div class="flex items-center gap-3">
              <span class="w-4 h-4 rounded-full border border-white/20" style="background:${item.colorHex}"></span>
              <div>
                <div class="text-xs font-bold text-white">${item.name}</div>
                <div class="text-[10px] text-neutral-400 font-mono">${item.colorway} // US ${item.size}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="text-xs font-bold text-amber-400">$${item.price.toLocaleString()}</div>
              <button class="text-[10px] text-rose-400 hover:underline remove-cart-item" data-index="${index}">Remove</button>
            </div>
          `;

          el.querySelector(".remove-cart-item").addEventListener("click", () => {
            this.cart.splice(index, 1);
            audio.playClick();
            this.updateCartUI();
          });

          itemsContainer.appendChild(el);
        });

        if (totalDisplay) {
          totalDisplay.textContent = `$${total.toLocaleString()} USD`;
        }
      }
    }
  }

  handleOrderSubmit() {
    audio.playSuccess();

    // Confetti effect celebration
    if (window.confetti) {
      window.confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#f3c74d", "#e6b422", "#ffffff", "#00f0ff"]
      });
    }

    const form = document.getElementById("preorder-form");
    const successBox = document.getElementById("preorder-success-screen");

    if (form && successBox) {
      form.classList.add("hidden");
      successBox.classList.remove("hidden");
    }
  }

  showHotspotDetailModal(spot) {
    const toast = document.createElement("div");
    toast.className = "fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 p-4 bg-black/90 backdrop-blur-2xl border border-amber-400/50 rounded-2xl shadow-2xl max-w-sm w-full mx-4 animate-fade-in";
    toast.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <span class="text-[10px] uppercase font-mono tracking-widest text-amber-400">${spot.category}</span>
        <button class="close-toast text-neutral-400 hover:text-white text-xs">✕</button>
      </div>
      <div class="text-sm font-black text-white mb-1">${spot.title}</div>
      <div class="text-xs text-neutral-300 leading-relaxed">${spot.description}</div>
    `;

    document.body.appendChild(toast);

    const close = () => {
      toast.classList.add("opacity-0", "transition-opacity", "duration-200");
      setTimeout(() => toast.remove(), 200);
    };

    toast.querySelector(".close-toast").addEventListener("click", close);
    setTimeout(close, 6000);
  }

  showToast(message) {
    const toast = document.createElement("div");
    toast.className = "fixed top-24 right-6 z-50 px-4 py-2.5 bg-black/85 backdrop-blur-xl border border-amber-400/40 rounded-xl shadow-xl text-xs text-amber-300 font-mono tracking-wide flex items-center gap-2 transform transition-all duration-300 translate-y-2 opacity-0";
    toast.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
      <span>${message}</span>
    `;

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove("translate-y-2", "opacity-0");
    });

    setTimeout(() => {
      toast.classList.add("translate-y-2", "opacity-0");
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Bootstrap application on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  window.luxeApp = new LuxeApp();
});
