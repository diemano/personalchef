import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Painel Administrativo | Personal Chef Lucas Medeiros',
  description: 'Área administrativa do Personal Chef Lucas Medeiros',
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
