import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { AnimationProvider } from '@/hooks/useAnimationContext';

const degular = localFont({
  src: [
    {
      path: "../public/fonts/Degular-Thin.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/Degular-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Degular-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/Degular-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/Degular-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Degular-Black.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: '--font-degular',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Devumma",
  description: "love you too...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${degular.variable} antialiased`}
      >
        <AnimationProvider>
          {children}
        </AnimationProvider>
      </body>
    </html>
  );
}
