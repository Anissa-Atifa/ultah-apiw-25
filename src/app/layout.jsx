import "./globals.css";

export const metadata = {
  title: "Happy Birthday 25 Babee ! <3 — Apiw Level 25 Arcade",
  description:
    "Interactive Retro Cyberpunk Birthday Web App for Apiw's 25th Birthday (17 November) — Memory Timeline, Photo Vault, Catch the Heart Mini-Game & Thursday Blok M Date Invitation."
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Press+Start+2P&family=VT323&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-void text-zinc-100 font-sans antialiased selection:bg-hotPink selection:text-white min-h-screen relative overflow-x-hidden">
        {/* Lapisan Efek Layar CRT Scanlines & Cyber Grid (Aman, tidak menghalangi klik) */}
        <div className="scanlines-overlay pointer-events-none fixed inset-0 z-40" aria-hidden="true" />
        <div className="cyber-grid-bg pointer-events-none fixed inset-0 z-0" aria-hidden="true" />
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
