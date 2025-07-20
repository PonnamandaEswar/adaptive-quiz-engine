// src/app/layout.tsx
import './globals.css';
import { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata = {
  title: 'Adaptive Quiz Engine',
  description: 'Next‑gen adaptive quiz with Firebase auth',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className="antialiased"
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
