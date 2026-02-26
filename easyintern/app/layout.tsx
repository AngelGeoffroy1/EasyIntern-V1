import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

export const metadata: Metadata = {
  title: 'EasyIntern — Trouvez votre parrain à l\'étranger',
  description:
    'EasyIntern met en relation des étudiants français partant à l\'étranger avec des parrains installés sur place.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="antialiased" style={{ fontFamily: "'Airbnb Cereal', sans-serif" }}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
