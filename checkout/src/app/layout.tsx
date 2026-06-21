import './globals.css';

export const metadata = {
  title: 'Skill Hub — Agent OS Install Guide',
  description: 'The $9 PDF that bootstraps your own agent box.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}