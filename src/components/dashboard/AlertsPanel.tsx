import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Clock, 
  Package, 
  AlertCircle,
  ChevronRight 
} from "lucide-react";

interface Alert {
  id: string;
  type: "expired" | "expiring" | "low_stock" | "task";
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  time: string;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "expired",
    title: "Produto Vencido",
    description: "Leite integral - venceu há 2 dias",
    priority: "high",
    time: "2h atrás"
  },
  {
    id: "2",
    type: "expiring",
    title: "Vence Hoje",
    description: "Peito de frango - 3kg",
    priority: "high",
    time: "6h atrás"
  },
  {
    id: "3",
    type: "low_stock",
    title: "Estoque Baixo",
    description: "Azeite extravirgem - apenas 2 unidades",
    priority: "medium",
    time: "1 dia atrás"
  },
  {
    id: "4",
    type: "expiring",
    title: "Vence em 3 dias",
    description: "Queijo mussarela - 5kg",
    priority: "medium",
    time: "2 dias atrás"
  }
];

export function AlertsPanel() {
  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "expired":
        return <AlertCircle className="h-4 w-4" />;
      case "expiring":
        return <Clock className="h-4 w-4" />;
      case "low_stock":
        return <Package className="h-4 w-4" />;
      case "task":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getAlertVariant = (type: Alert["type"]) => {
    switch (type) {
      case "expired":
        return "danger";
      case "expiring":
        return "warning";
      case "low_stock":
        return "secondary";
      case "task":
        return "default";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority: Alert["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-danger text-danger-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Alertas Importantes</h3>
        <Button variant="ghost" size="sm">
          Ver todos
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {mockAlerts.map((alert) => (
          <div 
            key={alert.id}
            className="flex items-start space-x-3 p-3 rounded-lg border border-card-border hover:bg-accent/50 transition-smooth cursor-pointer"
          >
            <div className={`
              p-2 rounded-full
              ${alert.type === 'expired' ? 'bg-danger/10 text-danger' : ''}
              ${alert.type === 'expiring' ? 'bg-warning/10 text-warning' : ''}
              ${alert.type === 'low_stock' ? 'bg-muted text-muted-foreground' : ''}
            `}>
              {getAlertIcon(alert.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground truncate">
                  {alert.title}
                </p>
                <Badge 
                  className={`text-xs ml-2 ${getPriorityColor(alert.priority)}`}
                  variant="secondary"
                >
                  {alert.priority === "high" ? "Alta" : alert.priority === "medium" ? "Média" : "Baixa"}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{alert.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
            </div>
          </div>
        ))}
      </div>
      
      {mockAlerts.length === 0 && (
        <div className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum alerta no momento</p>
        </div>
      )}
    </Card>
  );
}