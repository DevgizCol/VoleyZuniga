import { ImageResponse } from "next/og";

export const alt = "Club Voley Zúñiga | Formamos Campeones";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#071426",
          backgroundImage: "radial-gradient(circle at 25% 25%, #0E2952 0%, #071426 70%)",
          border: "12px solid #F29A2E",
          padding: "60px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Glow corner */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            backgroundColor: "rgba(242, 154, 46, 0.2)",
            filter: "blur(60px)",
          }}
        />

        {/* Badge VIP */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "8px 24px",
            borderRadius: "9999px",
            backgroundColor: "rgba(242, 154, 46, 0.15)",
            border: "2px solid #F29A2E",
            color: "#F29A2E",
            fontSize: "20px",
            fontWeight: "bold",
            letterSpacing: "4px",
            textTransform: "uppercase",
            marginBottom: "30px",
          }}
        >
          CLUB DEPORTIVO OFICIAL • MEDELLÍN
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: "68px",
            fontWeight: "900",
            color: "#FFFFFF",
            letterSpacing: "-1px",
            textTransform: "uppercase",
            textAlign: "center",
            marginBottom: "16px",
          }}
        >
          CLUB VOLEY ZÚÑIGA
        </div>

        {/* Subtitle */}
        <div
          style={{
            display: "flex",
            fontSize: "30px",
            color: "#F29A2E",
            fontWeight: "700",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "40px",
          }}
        >
          Formamos Campeones con Valores y Excelencia
        </div>

        {/* Bottom Specs Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "40px",
            padding: "16px 40px",
            borderRadius: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            color: "#CBD5E1",
            fontSize: "18px",
          }}
        >
          <span>🏆 Liga Departamental de Antioquia</span>
          <span>•</span>
          <span>📍 Polideportivo 3 Canchas & Yesid Santos</span>
          <span>•</span>
          <span>🏐 Sub-12 a Sub-18</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
