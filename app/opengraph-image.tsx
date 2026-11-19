import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Dheeraj Carpenter — Software Engineer & Developer";
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
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#09090b",
          padding: "80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          color: "#fafafa",
          border: "8px solid #18181b",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "14px",
              height: "14px",
              borderRadius: "50%",
              backgroundColor: "#22c55e",
            }}
          />
          <span
            style={{
              fontSize: "22px",
              fontWeight: 600,
              letterSpacing: "0.15em",
              color: "#a1a1aa",
              textTransform: "uppercase",
            }}
          >
            Software Engineer & Developer
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <h1
            style={{
              fontSize: "76px",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              margin: 0,
              color: "#ffffff",
              lineHeight: 1.05,
            }}
          >
            Dheeraj Carpenter
          </h1>
          <p
            style={{
              fontSize: "28px",
              color: "#a1a1aa",
              margin: 0,
              maxWidth: "900px",
              lineHeight: 1.4,
            }}
          >
            Building modern, high-performance web applications with Next.js, React, and TypeScript.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid #27272a",
            paddingTop: "32px",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            {["Next.js", "React", "TypeScript", "Tailwind CSS", "PostgreSQL"].map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: "18px",
                  padding: "6px 16px",
                  borderRadius: "9999px",
                  backgroundColor: "#18181b",
                  border: "1px solid #27272a",
                  color: "#e4e4e7",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
          <span
            style={{
              fontSize: "20px",
              color: "#71717a",
              fontWeight: 500,
              fontFamily: "monospace",
            }}
          >
            dheerajcarpenter.vercel.app
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
