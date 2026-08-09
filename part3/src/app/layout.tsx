import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TutorConnect Parent Portal",
  description:
    "Manage your child's tutoring sessions, view upcoming classes, and request reschedules.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geist.variable}>
      <body
        className="bg-bg-base text-content-primary font-sans antialiased min-h-screen"
        style={{
          backgroundImage: [
            "radial-gradient(ellipse 80% 40% at 50% -10%, rgba(99,102,241,0.10), transparent)",
            "radial-gradient(ellipse 50% 30% at 90% 80%, rgba(139,92,246,0.06), transparent)",
          ].join(", "),
        }}
      >
        {children}
      </body>
    </html>
  );
}
