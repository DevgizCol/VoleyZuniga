import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const rootDir = process.cwd();
const logoPath = path.join(rootDir, "public", "logo.svg");
const logoContent = fs.readFileSync(logoPath, "utf-8");

// Extract all <path ... /> elements from logo.svg
const pathMatches = logoContent.match(/<path[\s\S]*?\/>/g) || [];
const innerPaths = pathMatches.join("\n    ");

// Create Luxury Premium SVG Icon
const luxurySvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg viewBox="0 0 512 512" width="512" height="512" version="1.1" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background Radial Gradient -->
    <radialGradient id="pwaBgGlow" cx="50%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#143158" />
      <stop offset="50%" stop-color="#08182D" />
      <stop offset="100%" stop-color="#030A14" />
    </radialGradient>

    <!-- Metallic Athletic Gold Gradient -->
    <linearGradient id="pwaGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE599" />
      <stop offset="25%" stop-color="#F29A2E" />
      <stop offset="50%" stop-color="#FFB957" />
      <stop offset="75%" stop-color="#D97514" />
      <stop offset="100%" stop-color="#F8AB42" />
    </linearGradient>

    <!-- Ambient Emblem Halo -->
    <radialGradient id="pwaEmblemHalo" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#F29A2E" stop-opacity="0.3" />
      <stop offset="60%" stop-color="#F29A2E" stop-opacity="0.08" />
      <stop offset="100%" stop-color="#F29A2E" stop-opacity="0" />
    </radialGradient>

    <!-- Subtle Drop Shadow for Badge -->
    <filter id="pwaShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="6" stdDeviation="10" flood-color="#000000" flood-opacity="0.6" />
    </filter>
  </defs>

  <!-- Solid Luxury Background Canvas -->
  <rect width="512" height="512" fill="url(#pwaBgGlow)" />

  <!-- Outer Gilded Precision Rim (Apple Squircle / Android Adaptive Safe) -->
  <rect x="14" y="14" width="484" height="484" rx="108" fill="none" stroke="url(#pwaGoldGrad)" stroke-width="4.5" opacity="0.85" />
  
  <!-- Inner Subtle Titanium Inset Line -->
  <rect x="22" y="22" width="468" height="468" rx="100" fill="none" stroke="#FFFFFF" stroke-width="1.2" opacity="0.12" />

  <!-- Central Ambient Golden Glow -->
  <circle cx="256" cy="270" r="165" fill="url(#pwaEmblemHalo)" />

  <!-- Championship Stars (3 Stars) -->
  <g fill="url(#pwaGoldGrad)" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.5))">
    <!-- Center Star (Largest) -->
    <polygon points="256,48 261,64 278,64 264,74 269,90 256,80 243,90 248,74 234,64 251,64" />
    <!-- Left Star -->
    <polygon points="216,60 220,72 233,72 222,80 226,92 216,84 206,92 210,80 199,72 212,72" transform="scale(0.85) translate(38, 12)" />
    <!-- Right Star -->
    <polygon points="296,60 300,72 313,72 302,80 306,92 296,84 286,92 290,80 279,72 292,72" transform="scale(0.85) translate(52, 12)" />
  </g>

  <!-- Official Club Voley Zúñiga Emblem (Centered with Drop Shadow) -->
  <g id="pwa-emblem" transform="translate(256, 276) scale(0.185) translate(-1024, -1024)" filter="url(#pwaShadow)">
    ${innerPaths}
  </g>

  <!-- Bottom Club Title Accent -->
  <text x="256" y="468" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="19" letter-spacing="5" fill="url(#pwaGoldGrad)">
    VOLEY ZÚÑIGA
  </text>
  <text x="256" y="486" text-anchor="middle" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="9" letter-spacing="4" fill="#8E9DAE">
    MEDELLÍN • 2026
  </text>
</svg>
`;

// Write to public/pwa-icon.svg and src/app/icon.svg
fs.writeFileSync(path.join(rootDir, "public", "pwa-icon.svg"), luxurySvg, "utf-8");
fs.writeFileSync(path.join(rootDir, "src", "app", "icon.svg"), luxurySvg, "utf-8");
console.log("Successfully generated luxury SVG icons in public/pwa-icon.svg and src/app/icon.svg");

// Create temporary HTML for rendering PNGs via Edge Headless
const tempHtmlPath = path.join(rootDir, "scripts", "temp-icon.html");
const tempHtmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 100vw; height: 100vh; overflow: hidden; background: #071426; }
    svg { width: 100%; height: 100%; display: block; }
  </style>
</head>
<body>
  ${luxurySvg}
</body>
</html>`;
fs.writeFileSync(tempHtmlPath, tempHtmlContent, "utf-8");

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

// Generate icon-512.png
const out512 = path.join(rootDir, "public", "icon-512.png");
console.log("Rendering 512x512 PNG...");
execSync(`"${edgePath}" --headless --screenshot="${out512}" --window-size=512,512 --default-background-color=00000000 "file://${tempHtmlPath}"`, { stdio: "inherit" });

// Generate icon-192.png
const out192 = path.join(rootDir, "public", "icon-192.png");
console.log("Rendering 192x192 PNG...");
execSync(`"${edgePath}" --headless --screenshot="${out192}" --window-size=192,192 --default-background-color=00000000 "file://${tempHtmlPath}"`, { stdio: "inherit" });

// Generate apple-touch-icon.png (180x180)
const outApple = path.join(rootDir, "public", "apple-touch-icon.png");
console.log("Rendering 180x180 Apple Touch Icon PNG...");
execSync(`"${edgePath}" --headless --screenshot="${outApple}" --window-size=180,180 --default-background-color=00000000 "file://${tempHtmlPath}"`, { stdio: "inherit" });

// Clean up temp HTML
try { fs.unlinkSync(tempHtmlPath); } catch (e) {}

console.log("All luxury mobile PWA icons successfully created!");
