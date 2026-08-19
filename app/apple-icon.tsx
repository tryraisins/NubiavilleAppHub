import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(145deg, #09086f 0%, #2834a9 58%, #ff650d 150%)",
          color: "white",
          display: "flex",
          fontFamily: "sans-serif",
          fontSize: 94,
          fontWeight: 800,
          height: "100%",
          justifyContent: "center",
          letterSpacing: -7,
          width: "100%",
        }}
      >
        N
      </div>
    ),
    size,
  );
}
