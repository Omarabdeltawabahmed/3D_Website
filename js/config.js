/**
 * FIS-LUXE AERO-1 // Configuration & Data Matrix
 */

export const CONFIG = {
  brand: {
    name: "FIS-LUXE",
    model: "AERO-1 TITANIUM",
    tagline: "The Pinnacle of Luxury Performance Footwear",
    price: 1450,
    currency: "USD",
    edition: "Limited Atelier Run",
    batchNumber: "042 / 500",
    releaseYear: 2026,
    sku: "FIS-AERO1-TITANIUM-042"
  },

  colorways: [
    {
      id: "onyx",
      name: "Onyx & 24K Gold",
      subtitle: "Heritage Luxury / Bespoke Electroplate",
      hexPreview: "#e6b422",
      badge: "Signature Edition",
      colors: {
        upper: 0x111217,
        upperDetail: 0x1a1c23,
        sole: 0x090a0d,
        tread: 0x181a20,
        cushion: 0xffb703,
        cushionTransmission: 0.85,
        accent: 0xe6b422,
        metallic: 0xf3c74d,
        laces: 0x22242c,
        glow: 0xffaa00
      },
      tagColor: "border-amber-500/40 text-amber-300"
    },
    {
      id: "cyber",
      name: "Cyber Neon Void",
      subtitle: "Hyper-Future / Ultraviolet Emission",
      hexPreview: "#00f0ff",
      badge: "Cyber Atelier",
      colors: {
        upper: 0x0c0f1a,
        upperDetail: 0x161b2e,
        sole: 0x06080e,
        tread: 0x111624,
        cushion: 0x00f0ff,
        cushionTransmission: 0.9,
        accent: 0x00f0ff,
        metallic: 0x7928ca,
        laces: 0x00d4e6,
        glow: 0x00f0ff
      },
      tagColor: "border-cyan-500/40 text-cyan-300"
    },
    {
      id: "hyperion",
      name: "Hyperion Pearl & Emerald",
      subtitle: "Ceramic Finish / Titanium Weave",
      hexPreview: "#10b981",
      badge: "Bespoke Clean",
      colors: {
        upper: 0xe2e8f0,
        upperDetail: 0xcfd8e3,
        sole: 0xf1f5f9,
        tread: 0x94a3b8,
        cushion: 0x10b981,
        cushionTransmission: 0.85,
        accent: 0x059669,
        metallic: 0x10b981,
        laces: 0x047857,
        glow: 0x34d399
      },
      tagColor: "border-emerald-500/40 text-emerald-300"
    },
    {
      id: "crimson",
      name: "Crimson Eclipse",
      subtitle: "Volcanic Matte / Ruby Anodized",
      hexPreview: "#ff2a5f",
      badge: "Performance Track",
      colors: {
        upper: 0x151214,
        upperDetail: 0x241b20,
        sole: 0x0d090a,
        tread: 0x201518,
        cushion: 0xff0055,
        cushionTransmission: 0.88,
        accent: 0xff2a5f,
        metallic: 0xff1e56,
        laces: 0x351b24,
        glow: 0xff0055
      },
      tagColor: "border-rose-500/40 text-rose-300"
    }
  ],

  hotspots: [
    {
      id: "cushion",
      title: "Vortex-Air Dual Chamber",
      category: "Propulsion Engineering",
      position: { x: 0.4, y: -0.25, z: 0.6 },
      description: "Pressurized nitrogen cell encased in ultra-clear polyurethane. Returns up to 94.2% of kinetic impact energy with zero fatigue."
    },
    {
      id: "upper",
      title: "AeroKnit Titanium Weave",
      category: "Ballistic Materials",
      position: { x: -0.6, y: 0.4, z: 0.3 },
      description: "Continuous micro-filament weaving infused with aerospace titanium strands for surgical foot containment and breathability."
    },
    {
      id: "shank",
      title: "Toray T1000 Carbon Bridge",
      category: "Torsional Rigidity",
      position: { x: -0.1, y: -0.35, z: -0.2 },
      description: "Autoclave-molded carbon composite bridge prevents unwanted midfoot twisting while launching transitions forward."
    },
    {
      id: "stabilizer",
      title: "24K Electroplated Aerofin",
      category: "Aerodynamic Balance",
      position: { x: 1.2, y: 0.25, z: 0.0 },
      description: "Sculpted aerodynamic rear stabilizer electroplated in genuine gold finish, locking the calcaneus with zero heel slippage."
    }
  ],

  sizes: [
    { us: "7.0", eu: "40", stock: 3 },
    { us: "8.0", eu: "41", stock: 7 },
    { us: "8.5", eu: "42", stock: 12 },
    { us: "9.5", eu: "43", stock: 15 },
    { us: "10.0", eu: "44", stock: 9 },
    { us: "11.0", eu: "45", stock: 4 },
    { us: "12.0", eu: "46", stock: 2 }
  ],

  specs: [
    { label: "Total Mass", value: "284g", detail: "Per shoe (US 9.5)" },
    { label: "Energy Return", value: "94.2%", detail: "Kinetic cell rebound" },
    { label: "Chassis", value: "T1000", detail: "Forged carbon fiber" },
    { label: "Heel-to-Toe Drop", value: "8.0 mm", detail: "Biomechanical neutral" },
    { label: "Manufacturing", value: "Bespoke", detail: "Numbered atelier run" }
  ]
};
