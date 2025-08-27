import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Plus, 
  ChefHat, 
  Clock, 
  CheckCircle, 
  XCircle,
  Users,
  Calendar,
  Package,
  QrCode,
  Search,
  Filter
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductionOrder {
  id: string;
  orderNumber: string;
  dishName: string;
  quantity: number;
  status: "pendente" | "em_preparo" | "finalizado" | "cancelado";
  productionDate: string;
  expiryDate: string;
  chef: string;
  estimatedTime: number;
  actualTime?: number;
  ingredients: {
    name: string;
    quantity: number;
    unit: string;
  }[];
  notes?: string;
}

const mockOrders: ProductionOrder[] = [
  {
    id: "1",
    orderNumber: "PRD-001",
    dishName: "Lasanha à Bolonhesa",
    quantity: 10,
    status: "em_preparo",
    productionDate: "2024-01-27",
    expiryDate: "2024-01-29",
    chef: "Chef Maria Silva",
    estimatedTime: 120,
    actualTime: 90,
    ingredients: [
      { name: "Massa de lasanha", quantity: 2, unit: "kg" },
      { name: "Carne moída", quantity: 3, unit: "kg" },
      { name: "Queijo mussarela", quantity: 1.5, unit: "kg" }
    ],
    notes: "Atenção especial ao tempo de forno"
  },
  {
    id: "2",
    orderNumber: "PRD-002",
    dishName: "Salada Caesar",
    quantity: 25,
    status: "finalizado",
    productionDate: "2024-01-27",
    expiryDate: "2024-01-28",
    chef: "Sous Chef João",
    estimatedTime: 45,
    actualTime: 40,
    ingredients: [
      { name: "Alface romana", quantity: 5, unit: "kg" },
      { name: "Queijo parmesão", quantity: 0.5, unit: "kg" },
      { name: "Croutons", quantity: 1, unit: "kg" }
    ]
  },
  {
    id: "3",
    orderNumber: "PRD-003",
    dishName: "Risotto de Cogumelos",
    quantity: 8,
    status: "pendente",
    productionDate: "2024-01-27",
    expiryDate: "2024-01-29",
    chef: "Chef Maria Silva",
    estimatedTime: 90,
    ingredients: [
      { name: "Arroz arbóreo", quantity: 2, unit: "kg" },
      { name: "Cogumelos variados", quantity: 1.5, unit: "kg" },
      { name: "Vinho branco", quantity: 0.5, unit: "L" }
    ]
  }
];

const statusConfig = {
  pendente: {
    label: "Pendente",
    variant: "secondary" as const,
    icon: Clock,
    color: "text-muted-foreground"
  },
  em_preparo: {
    label: "Em Preparo",
    variant: "outline" as const,
    icon: ChefHat,
    color: "text-warning"
  },
  finalizado: {
    label: "Finalizado",
    variant: "outline" as const,
    icon: CheckCircle,
    color: "text-success"
  },
  cancelado: {
    label: "Cancelado",
    variant: "destructive" as const,
    icon: XCircle,
    color: "text-danger"
  }
};

function ProductionOrderCard({ order }: { order: ProductionOrder }) {
  const config = statusConfig[order.status];
  const StatusIcon = config.icon;

  return (
    <Card className="p-6 hover:shadow-lg transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{order.dishName}</h3>
            <Badge variant={config.variant} className="text-xs">
              {config.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">#{order.orderNumber}</p>
        </div>
        <StatusIcon className={cn("h-5 w-5", config.color)} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Quantidade</p>
          <p className="font-medium">{order.quantity} porções</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Chef</p>
          <p className="font-medium text-sm">{order.chef}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Tempo estimado</p>
          <p className="font-medium">{order.estimatedTime} min</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Validade</p>
          <p className="font-medium text-sm">{new Date(order.expiryDate).toLocaleDateString('pt-BR')}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Ingredientes principais</p>
        <div className="flex flex-wrap gap-1">
          {order.ingredients.slice(0, 3).map((ingredient, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {ingredient.name}
            </Badge>
          ))}
          {order.ingredients.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{order.ingredients.length - 3} mais
            </Badge>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          Ver Detalhes
        </Button>
        <Button variant="ghost" size="sm">
          <QrCode className="h-4 w-4" />
        </Button>
        {order.status === "pendente" && (
          <Button variant="success" size="sm">
            Iniciar
          </Button>
        )}
        {order.status === "em_preparo" && (
          <Button variant="default" size="sm">
            Finalizar
          </Button>
        )}
      </div>
    </Card>
  );
}

export default function Production() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = order.dishName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.chef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getOrdersByStatus = (status: string) => {
    if (status === "all") return filteredOrders;
    return filteredOrders.filter(order => order.status === status);
  };

  const currentOrders = getOrdersByStatus(activeTab);

  const stats = {
    total: mockOrders.length,
    pendente: mockOrders.filter(o => o.status === "pendente").length,
    em_preparo: mockOrders.filter(o => o.status === "em_preparo").length,
    finalizado: mockOrders.filter(o => o.status === "finalizado").length
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading text-foreground">Produção</h1>
            <p className="text-muted-foreground">Controle de ordens de produção e preparo</p>
          </div>
          <Button variant="hero" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Nova Ordem de Produção
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <p className="text-xl font-bold">{stats.pendente}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-expiring bg-expiring-light">
            <div className="flex items-center gap-2">
              <ChefHat className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Em Preparo</p>
                <p className="text-xl font-bold text-warning">{stats.em_preparo}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-fresh bg-fresh-light">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Finalizados</p>
                <p className="text-xl font-bold text-success">{stats.finalizado}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar ordens, pratos, chefs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
                <SelectItem value="em_preparo">Em Preparo</SelectItem>
                <SelectItem value="finalizado">Finalizados</SelectItem>
                <SelectItem value="cancelado">Cancelados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Orders with Tabs */}
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todas ({stats.total})</TabsTrigger>
              <TabsTrigger value="pendente">Pendentes ({stats.pendente})</TabsTrigger>
              <TabsTrigger value="em_preparo" className="text-warning">
                Em Preparo ({stats.em_preparo})
              </TabsTrigger>
              <TabsTrigger value="finalizado" className="text-success">
                Finalizadas ({stats.finalizado})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentOrders.map((order) => (
                  <ProductionOrderCard key={order.id} order={order} />
                ))}
              </div>
              
              {currentOrders.length === 0 && (
                <div className="text-center py-12">
                  <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || selectedStatus !== "all" 
                      ? "Nenhuma ordem encontrada com os filtros aplicados" 
                      : "Nenhuma ordem de produção cadastrada"}
                  </p>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Ordem
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </Layout>
  );
}