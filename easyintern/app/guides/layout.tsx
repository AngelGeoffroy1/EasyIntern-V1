import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guides pratiques — EasyIntern',
  description:
    'Guides pratiques pour préparer votre mobilité à l\'étranger : visa, logement, budget, santé et plus.',
};

export default function GuidesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
