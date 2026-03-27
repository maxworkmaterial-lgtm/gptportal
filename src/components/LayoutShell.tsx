'use client';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';

const FULL_SCREEN_ROUTES: string[] = [];

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isFullScreen = FULL_SCREEN_ROUTES.some((r) => pathname.startsWith(r));

  if (isFullScreen) {
    return <div className="flex-1 min-h-screen">{children}</div>;
  }

  return (
    <>
      <Sidebar />
      <main className="flex-1 ml-[240px] min-h-screen relative">
        {children}
      </main>
    </>
  );
}
