import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  QrCode, 
  Package, 
  ClipboardList,
  Scan,
  FileText 
} from "lucide-react";

export function QuickActions() {
  const actions = [
    {
      title: "Nova Produção",
      description: "Criar ordem de produção",
      icon: <ClipboardList className="h-5 w-5" />,
      variant: "hero" as const,
      href: "/production/new"
    },
    {
      title: "Gerar QR Code",
      description: "Etiqueta para produto",
      icon: <QrCode className="h-5 w-5" />,
      variant: "secondary" as const,
      href: "/qr-codes/generate"
    },
    {
      title: "Escanear",
      description: "Ler código QR",
      icon: <Scan className="h-5 w-5" />,
      variant: "outline" as const,
      href: "/scan"
    },
    {
      title: "Adicionar Item",
      description: "Novo produto no estoque",
      icon: <Package className="h-5 w-5" />,
      variant: "fresh" as const,
      href: "/inventory/new"
    },
    {
      title: "Receber Mercadoria",
      description: "Registrar entrada",
      icon: <Plus className="h-5 w-5" />,
      variant: "default" as const,
      href: "/receiving/new"
    },
    {
      title: "Relatório",
      description: "Gerar relatório",
      icon: <FileText className="h-5 w-5" />,
      variant: "ghost" as const,
      href: "/reports"
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Ações Rápidas</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant}
            className="h-auto p-4 flex-col items-start text-left gap-2"
            asChild
          >
            <a href={action.href}>
              <div className="flex items-center gap-2 w-full">
                {action.icon}
                <span className="font-medium text-sm">{action.title}</span>
              </div>
              <span className="text-xs opacity-70 w-full">
                {action.description}
              </span>
            </a>
          </Button>
        ))}
      </div>
    </Card>
  );
}