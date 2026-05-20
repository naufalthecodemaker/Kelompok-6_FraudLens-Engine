import { Orbitron, Share_Tech_Mono } from 'next/font/google';
import "./globals.css";

const orbitron = Orbitron({ 
  subsets: ['latin'],
  variable: '--font-orbitron'
});

const shareTechMono = Share_Tech_Mono({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-mono'
});

export const metadata = {
  title: "Kelompok 6 FraudLens",
  description: "Platform Intelijen Identitas & Deteksi Kriminologi Keuangan Digital",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${shareTechMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
