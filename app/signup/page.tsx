import Link from "next/link";

export default function SignupPage() {
  return (
    <div
      className="ruled-lines"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: "40px 24px",
      }}
    >
      <p
        style={{
          fontFamily: "var(--font-gloria)",
          fontSize: "28px",
          color: "#8B2447",
          margin: 0,
          transform: "rotate(-1deg)",
        }}
      >
        coming soon...
      </p>
      <p
        style={{
          fontFamily: "var(--font-patrick)",
          fontSize: "16px",
          color: "#3D2530",
          opacity: 0.55,
          margin: 0,
        }}
      >
        sign-up is on its way
      </p>
      <Link
        href="/login"
        style={{
          fontFamily: "var(--font-patrick)",
          fontSize: "14px",
          color: "#8B2447",
          opacity: 0.7,
          marginTop: 8,
        }}
      >
        ← back to login
      </Link>
    </div>
  );
}
