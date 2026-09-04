"use client";

import Script from "next/script";

export default function VercelAnalytics() {
  return (
    <>
      {/* Vercel Web Analytics Official Script */}
      <Script
        id="vercel-analytics"
        strategy="afterInteractive"
        src="/_vercel/insights/script.js"
      />
      {/* Vercel Speed Insights Official Script */}
      <Script
        id="vercel-speed-insights"
        strategy="afterInteractive"
        src="/_vercel/speed-insights/script.js"
      />
    </>
  );
}
