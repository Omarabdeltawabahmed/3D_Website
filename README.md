<div align="center">

# 💎 FIS-LUXE // AERO-1 TITANIUM
### The Pinnacle of Luxury Performance Footwear — 3D Interactive WebGL Showcase

[![Three.js](https://img.shields.io/badge/Three.js-r128-black?style=for-the-badge&logo=three.js&logoColor=white)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![WebGL 2.0](https://img.shields.io/badge/WebGL-2.0-990000?style=for-the-badge&logo=webgl&logoColor=white)](https://www.khronos.org/webgl/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License: MIT](https://img.shields.io/badge/License-MIT-gold?style=for-the-badge)](LICENSE)

<p align="center">
  A state-of-the-art 3D interactive e-commerce landing page inspired by luxury footwear ateliers (like FIS-LUXE). Features procedural high-definition 3D sneaker modeling, real-time colorway customization, cinematic scroll-driven camera choreography, interactive exploded view, and procedural luxury sound synthesis.
</p>

[Explore Features](#-key-features) •
[Quick Start](#-quick-start) •
[Interactive Controls](#-interactive-controls) •
[Tech Stack](#-tech-stack) •
[Deployment](#-deployment)

---

</div>

## 🌟 Key Features

### 1. 👟 Procedural 3D Luxury Sneaker Geometry
- **Zero Heavy 3D Asset Dependencies**: Fully generated in Three.js with precision splines, tubes, extruded shapes, and PBR physical materials.
- **Vortex-Air Dual-Chamber Unit**: Transparent pneumatic dampener (`MeshPhysicalMaterial` with realistic refraction, transmission, and clearcoat) housing glowing kinetic coils.
- **Toray T1000 Carbon Fiber Bridge**: Autoclave-molded carbon composite shank with metallic 24K gold branding badge.
- **AeroKnit Ballistic Upper**: Ergonomically contoured silhouette with reinforced toe cap and side aerodynamic strakes.
- **Crisscross Lacing Rig**: 3D tubular laces threading through 10 metallic gold eyelets with electroplated aglet tips.
- **24K Gold Aerofin Stabilizer**: Race-inspired rear downforce spoiler cup electroplated in mirror gold.

### 2. 🎛️ Real-Time 3D Atelier & Customizer Studio
- **4 Bespoke Colorways**:
  - 🥇 **Onyx & 24K Gold**: Signature heritage carbon with mirror gold hardware and amber air chamber.
  - ⚡ **Cyber Neon Void**: Deep matte slate with electric cyan pneumatic emission.
  - 💎 **Hyperion Pearl & Emerald**: Ceramic titanium weave with brushed emerald metallic accents.
  - 🩸 **Crimson Eclipse**: Volcanic matte charcoal with ruby anodized chassis.
- **Exploded View ("Deconstructed Architecture")**: Disassembles the sneaker into 5 floating suspended layers with GSAP-like smooth interpolation.
- **X-Ray Blueprint Wireframe**: Toggle polygon wireframes for internal geometric inspection.
- **Material Inspector**: Isolate and inspect specific component layers (*AeroKnit*, *24K Gold*, *Carbon Shank*, *Pneumatic Cell*) in real-time.

### 3. 🎥 Cinematic Scroll Choreography & Studio Lighting
- **Scroll Waypoint Director**: Smoothly glides between 5 cinematic camera waypoints as you scroll through the narrative sections (Hero, Internal Architecture, Molecular Matrix, 3D Studio, and Pre-Order Vault).
- **Dynamic Mouse-Tracking Spotlight**: A specular spotlight tracks the cursor across the sneaker surface, casting dynamic reflections on gold and carbon surfaces.
- **Screen-Space 3D Hotspots**: Interactive 3D pins projected onto HTML callout cards with technical engineering telemetry.

### 4. 🔊 Procedural Luxury Sound Synthesizer (Web Audio API)
- Zero external MP3/WAV audio files — ultra-low latency native Web Audio API synthesizer:
  - Sub-bass whoosh on colorway switches and camera transitions.
  - Crisp metallic haptic clicks on buttons.
  - Resonant major chord chime on cart additions and pre-order confirmation.
  - Audio toggle with mute memory in the navigation bar.

### 5. 🛍️ Haute Horlogerie E-Commerce UX
- **Obsidian Dark Aesthetic**: Deep obsidian backdrop, subtle cyber-grid floor, gold shimmer gradients, and frosted glassmorphism (`backdrop-blur-xl`).
- **Interactive Size Selector**: Men's / unisex US 7.0 through 12.0 with live atelier stock allocation indicators.
- **Slide-Out Atelier Bag Drawer**: Real-time subtotal calculations, item removals, and slide-in drawer.
- **VIP Pre-Order Modal**: Form with instant simulated payment validation, confetti explosion, and numbered allocation badge (`#FIS-AERO-042-2026`).

---

## 🕹️ Interactive Controls

| Input | Action |
| :--- | :--- |
| **Mouse Left Drag / Touch Swipe** | Rotate sneaker 360° with inertia damping |
| **Mouse Wheel / Pinch** | Smooth zoom in / zoom out |
| **Mouse Move** | Subtle parallax tilt & dynamic specular spotlight tracking |
| **Scroll Down / Up** | Cinematic camera choreography across narrative sections |
| **Colorway Swatches** | Instant real-time material transition with sound feedback |
| **Exploded View Button** | Disassemble/assemble sneaker layers in 3D space |
| **Wireframe Button** | Toggle between shaded PBR and X-Ray blueprint |

---

## 🚀 Quick Start

### Option 1: Native Node.js Server (Recommended — Zero external dependencies)
No external npm downloads required! Uses the built-in `server.js`:

```bash
# Clone the repository
git clone https://github.com/Omarabdeltawabahmed/3D_Website.git
cd 3D_Website

# Start the dev server
npm start
# or
node server.js
```

Open your browser at: **`http://localhost:3000`**

### Option 2: Run with Any Local HTTP Server
You can also use Python or VS Code Live Server:

```bash
# Python 3
python -m http.server 8080

# Or npx serve
npx serve .
```

---

## 📁 Codebase Architecture

```
3D_Website/
├── index.html               # Main semantic HTML structure & Tailwind UI layout
├── server.js                # Built-in zero-dependency local HTTP server (ESM / MIME support)
├── package.json             # NPM metadata and start scripts
├── .gitignore               # Standard git ignore rules
├── README.md                # Comprehensive documentation
├── css/
│   └── style.css            # Custom luxury styling, keyframes, scrollbar & canvas layers
└── js/
    ├── config.js            # Colorways, specs matrix, hotspot data & sizing
    ├── audio.js             # Web Audio API sound synthesizer
    ├── shoe-model.js        # Procedural 3D sneaker geometry & physical PBR materials
    ├── three-scene.js       # Three.js engine, studio lighting, camera lerp & render loop
    ├── customizer.js        # Colorway switcher, exploded view & wireframe controls
    ├── scroll-manager.js    # Scroll waypoints & camera choreography
    └── app.js               # Main orchestrator, modal, size selector & cart drawer
```

---

## 🛠️ Tech Stack

- **Core 3D Engine**: [Three.js](https://threejs.org/) (WebGL 2.0 Renderer, PCFSoftShadowMap, ACESFilmicToneMapping)
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/) + Custom Luxury Glassmorphism CSS
- **Animation**: [GSAP](https://greensock.com/gsap/) + Native RequestAnimationFrame Lerp Interpolation
- **Acoustic Feedback**: Web Audio API Procedural Synthesizer
- **Celebration Effects**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Architecture**: Vanilla JavaScript (ES6+ Modules, modular separation of concerns)

---

## 🌐 Deployment

### GitHub Pages
1. Go to repository **Settings** > **Pages**.
2. Under **Build and deployment**, set Source to **Deploy from a branch**.
3. Select branch `main` and folder `/ (root)`.
4. Click **Save** — your site will be live within minutes!

### Vercel / Netlify
- **Vercel**: Run `npx vercel` or import the GitHub repository in the Vercel dashboard.
- **Netlify**: Drag and drop the folder into [Netlify Drop](https://app.netlify.com/drop) or connect via GitHub.

---

## 🎨 Customization

- **Change Colorways or Prices**: Edit `js/config.js` to modify HEX colors, pricing, sizes, or specs.
- **Use an External GLTF Model**: If you have a custom 3D model file (`.gltf` / `.glb`), you can easily load it via `THREE.GLTFLoader` inside `js/shoe-model.js`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) — feel free to use, modify, and build upon it!

---

<div align="center">
  <b>FIS-LUXE ATELIER LABS</b> • Engineered with passion for 3D Web & Creative Development
</div>
