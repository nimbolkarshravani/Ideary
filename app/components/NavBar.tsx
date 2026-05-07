"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const INK = "#8B2447";
const BODY = "#3D2530";

export default function NavBar() {
  const pathname = usePathname();

  const linkStyle = (href: string): React.CSSProperties => ({
    fontFamily: "var(--font-patrick)",
    fontSize: "15px",
    color: pathname === href ? INK : BODY,
    textDecoration: pathname === href ? "underline" : "none",
    textDecorationStyle: pathname === href ? "wavy" : undefined,
    textDecorationColor: pathname === href ? INK : undefined,
    textUnderlineOffset: "4px",
    opacity: pathname === href ? 1 : 0.55,
    transition: "opacity 0.15s",
  });

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backgroundColor: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(6px)",
        borderBottom: "1px solid rgba(139,36,71,0.08)",
        padding: "12px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Link href="/" style={{ fontFamily: "var(--font-caveat)", fontSize: "26px", fontWeight: 700, color: INK, textDecoration: "none" }}>
        Ideary
      </Link>

      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <Link href="/" style={linkStyle("/")}>home</Link>
        <span style={{ color: BODY, opacity: 0.3, fontSize: "13px" }}>·</span>
        <Link href="/eurekas" style={linkStyle("/eurekas")}>Eurekas</Link>
        <span style={{ color: BODY, opacity: 0.3, fontSize: "13px" }}>·</span>
        <Link
          href="/login"
          style={{
            ...linkStyle("/login"),
            backgroundColor: pathname === "/login" ? "#FFD9E5" : "transparent",
            padding: "3px 12px",
            borderRadius: 20,
            border: `1.5px solid ${pathname === "/login" ? INK : "rgba(139,36,71,0.25)"}`,
          }}
        >
          login
        </Link>
      </div>
    </nav>
  );
}
