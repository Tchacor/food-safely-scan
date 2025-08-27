import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Truck, 
  Plus, 
  Package, 
  FileText, 
  Calendar,
  User,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Clock,
  Search
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface DeliveryItem {
  productName: string;
  expectedQuantity: number;
  receivedQuantity: number;
  unit: string;
  expiryDate: string;
  batchNumber: string;
  status: "ok" | "divergent" | "missing";
}

interface Delivery {
  id: string;
  invoiceNumber: string;
  supplier: string;
  deliveryDate: string;
  totalValue: number;
  status: "pending" | "partial" | "completed" | "rejected";
  items: DeliveryItem[];
  notes?: string;
  receivedBy?: string;
  receivedAt?: string;
}

const mockDeliveries: Delivery[] = [
  {
    id: "1",
    invoiceNumber: "NF-12345",
    supplier: "Frigorífico São Paulo",
    deliveryDate: "2024-01-27",
    totalValue: 2847.50,
    status: "pending",
    items: [
      {
        productName: "Peito de Frango",
        expectedQuantity: 20,
        receivedQuantity: 0,
        unit: "kg",
        expiryDate: "2024-01-30",
        batchNumber: "FR240127",
        status: "missing"
      },
      {
        productName: "Coxa de Frango",
        expectedQuantity: 15,
        receivedQuantity: 0,
        unit: "kg", 
        expiryDate: "2024-01-30",
        batchNumber: "FR240127",
        status: "missing"
      }
    ]
  },
  {
    id: "2",
    invoiceNumber: "NF-12344",
    supplier: "Laticínios Vale",
    deliveryDate: "2024-01-27",
    totalValue: 1240.80,
    status: "completed",
    items: [
      {
        productName: "Leite Integral",
        expectedQuantity: 30,
        receivedQuantity: 30,
        unit: "L",
        expiryDate: "2024-02-03",
        batchNumber: "LT240127",
        status: "ok"
      },
      {
        productName: "Queijo Mussarela",
        expectedQuantity: 5,
        receivedQuantity: 4.8,
        unit: "kg",
        expiryDate: "2024-02-10",
        batchNumber: "QM240127",
        status: "divergent"
      }
    ],
    receivedBy: "João Silva",
    receivedAt: "2024-01-27 09:30"
  },
  {
    id: "3",
    invoiceNumber: "NF-12343",
    supplier: "Hortifruti Central",
    deliveryDate: "2024-01-26",
    totalValue: 890.30,
    status: "partial",
    items: [
      {
        productName: "Alface Americana",
        expectedQuantity: 10,
        receivedQuantity: 8,
        unit: "kg",
        expiryDate: "2024-01-29",
        batchNumber: "AL240126",
        status: "divergent"
      },
      {
        productName: "Tomate",
        expectedQuantity: 20,
        receivedQuantity: 20,
        unit: "kg",
        expiryDate: "2024-02-02",
        batchNumber: "TM240126",
        status: "ok"
      }
    ],
    receivedBy: "Maria Santos",
    receivedAt: "2024-01-26 15:45",
    notes: "Alface com algumas folhas danificadas"
  }
];

const statusConfig = {
  pending: {
    label: "Pendente",
    variant: "secondary" as const,
    icon: Clock,
    color: "text-muted-foreground",
    bgColor: "bg-muted"
  },
  partial: {
    label: "Parcial",
    variant: "outline" as const,
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-expiring-light border-expiring"
  },
  completed: {
    label: "Concluído",
    variant: "default" as const,
    icon: CheckCircle,
    color: "text-success",
    bgColor: "bg-fresh-light border-fresh"
  },
  rejected: {
    label: "Rejeitado",
    variant: "destructive" as const,
    icon: AlertTriangle,
    color: "text-danger",
    bgColor: "bg-expired-light border-expired"
  }
};

const itemStatusConfig = {
  ok: { label: "OK", color: "text-success", bgColor: "bg-success/10" },
  divergent: { label: "Divergente", color: "text-warning", bgColor: "bg-warning/10" },
  missing: { label: "Pendente", color: "text-muted-foreground", bgColor: "bg-muted" }
};

function DeliveryCard({ delivery }: { delivery: Delivery }) {
  const config = statusConfig[delivery.status];
  const StatusIcon = config.icon;
  
  return (
    <Card className={cn("p-6 hover:shadow-lg transition-smooth", config.bgColor)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{delivery.supplier}</h3>
            <Badge variant={config.variant} className="text-xs">
              {config.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">#{delivery.invoiceNumber}</p>
        </div>
        <StatusIcon className={cn("h-5 w-5", config.color)} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Data de Entrega</p>
          <p className="font-medium text-sm">
            {new Date(delivery.deliveryDate).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Valor Total</p>
          <p className="font-medium text-sm">
            R$ {delivery.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
        </div>
        {delivery.receivedBy && (
          <>
            <div>
              <p className="text-xs text-muted-foreground">Recebido por</p>
              <p className="font-medium text-sm">{delivery.receivedBy}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Data/Hora</p>
              <p className="font-medium text-sm">
                {delivery.receivedAt ? new Date(delivery.receivedAt).toLocaleString('pt-BR') : '-'}
              </p>
            </div>
          </>
        )}
      </div>

      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Itens ({delivery.items.length})</p>
        <div className="space-y-1">
          {delivery.items.slice(0, 2).map((item, index) => {
            const itemConfig = itemStatusConfig[item.status];
            return (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-foreground">{item.productName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">
                    {item.receivedQuantity}/{item.expectedQuantity} {item.unit}
                  </span>
                  <Badge 
                    variant="outline" 
                    className={cn("text-xs", itemConfig.color, itemConfig.bgColor)}
                  >
                    {itemConfig.label}
                  </Badge>
                </div>
              </div>
            );
          })}
          {delivery.items.length > 2 && (
            <p className="text-xs text-muted-foreground">
              +{delivery.items.length - 2} itens adicionais
            </p>
          )}
        </div>
      </div>

      {delivery.notes && (
        <div className="mb-4">
          <p className="text-xs text-muted-foreground mb-1">Observações</p>
          <p className="text-sm text-foreground italic">{delivery.notes}</p>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          Ver Detalhes
        </Button>
        {delivery.status === "pending" && (
          <Button variant="success" size="sm">
            Receber
          </Button>
        )}
        {delivery.status === "partial" && (
          <Button variant="warning" size="sm">
            Continuar
          </Button>
        )}
      </div>
    </Card>
  );
}

export default function Receiving() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredDeliveries = mockDeliveries.filter(delivery => {
    const matchesSearch = delivery.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    total: mockDeliveries.length,
    pending: mockDeliveries.filter(d => d.status === "pending").length,
    partial: mockDeliveries.filter(d => d.status === "partial").length,
    completed: mockDeliveries.filter(d => d.status === "completed").length,
    totalValue: mockDeliveries.reduce((sum, d) => sum + d.totalValue, 0)
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading text-foreground">Recebimento</h1>
            <p className="text-muted-foreground">Controle de entrada de mercadorias</p>
          </div>
          <Button variant="hero" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Registrar Entrega
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-expiring bg-expiring-light">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Parciais</p>
                <p className="text-xl font-bold text-warning">{stats.partial}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-fresh bg-fresh-light">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Concluídos</p>
                <p className="text-xl font-bold text-success">{stats.completed}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Valor Total</p>
                <p className="text-lg font-bold">
                  R$ {stats.totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 hover:shadow-lg transition-smooth cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Nova Entrega</h3>
                <p className="text-sm text-muted-foreground">Registrar recebimento</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-smooth cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-fresh rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Comparar NF</h3>
                <p className="text-sm text-muted-foreground">Verificar divergências</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-smooth cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-warning rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Entregas Agendadas</h3>
                <p className="text-sm text-muted-foreground">Próximas chegadas</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar fornecedores, notas fiscais..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Deliveries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeliveries.map((delivery) => (
            <DeliveryCard key={delivery.id} delivery={delivery} />
          ))}
        </div>
        
        {filteredDeliveries.length === 0 && (
          <Card className="p-12">
            <div className="text-center">
              <Truck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? "Nenhuma entrega encontrada com os filtros aplicados" 
                  : "Nenhuma entrega registrada"}
              </p>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Registrar Primeira Entrega
              </Button>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}