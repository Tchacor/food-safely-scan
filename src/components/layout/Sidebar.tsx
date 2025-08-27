import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard,
  Package,
  ClipboardList,
  QrCode,
  Truck,
  CheckSquare,
  Bell,
  Settings,
  ChefHat,
  Menu,
  X
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
    description: "Visão geral do sistema"
  },
  {
    title: "Inventário",
    href: "/inventory",
    icon: Package,
    description: "Controle de estoque e validade"
  },
  {
    title: "Produção",
    href: "/production",
    icon: ChefHat,
    description: "Ordens de produção"
  },
  {
    title: "QR Codes",
    href: "/qr-codes",
    icon: QrCode,
    description: "Etiquetas e rastreabilidade"
  },
  {
    title: "Recebimento",
    href: "/receiving",
    icon: Truck,
    description: "Entrada de mercadorias"
  },
  {
    title: "Contagem",
    href: "/counting",
    icon: CheckSquare,
    description: "Balanço de estoque"
  }
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-40 h-full bg-card border-r border-card-border shadow-card transition-all duration-300 lg:static lg:translate-x-0",
        isCollapsed ? "w-16" : "w-64",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-card-border">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <ChefHat className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="font-heading font-semibold text-foreground">KitchenSafe</h1>
                  <p className="text-xs text-muted-foreground">Gestão Profissional</p>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="hidden lg:flex"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 p-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-smooth hover:bg-accent hover:text-accent-foreground",
                    isActive 
                      ? "bg-primary text-primary-foreground shadow-card" 
                      : "text-muted-foreground",
                    isCollapsed && "justify-center"
                  )}
                >
                  <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary-foreground")} />
                  {!isCollapsed && (
                    <div className="flex flex-col">
                      <span>{item.title}</span>
                      <span className={cn(
                        "text-xs opacity-70",
                        isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        {item.description}
                      </span>
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-card-border p-2">
            <Link
              to="/settings"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-smooth hover:bg-accent hover:text-accent-foreground",
                isCollapsed && "justify-center"
              )}
            >
              <Settings className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>Configurações</span>}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}