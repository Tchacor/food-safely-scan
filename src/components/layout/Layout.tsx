import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden lg:ml-0">
        <div className="h-full overflow-auto p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}