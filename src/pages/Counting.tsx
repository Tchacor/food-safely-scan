import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckSquare, 
  Plus, 
  Package, 
  ScanLine,
  Calculator,
  FileText,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Download,
  Search
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface CountItem {
  id: string;
  productName: string;
  category: string;
  systemQuantity: number;
  countedQuantity: number | null;
  unit: string;
  lastCounted?: string;
  location: string;
  difference: number;
  status: "pending" | "counted" | "discrepancy";
}

interface CountSession {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  status: "active" | "completed" | "draft";
  totalItems: number;
  countedItems: number;
  discrepancies: number;
  createdBy: string;
}

const mockCountSessions: CountSession[] = [
  {
    id: "1",
    name: "Contagem Mensal - Janeiro 2024",
    startDate: "2024-01-27",
    status: "active",
    totalItems: 156,
    countedItems: 89,
    discrepancies: 12,
    createdBy: "João Silva"
  },
  {
    id: "2", 
    name: "Inventário Semanal",
    startDate: "2024-01-20",
    endDate: "2024-01-21",
    status: "completed",
    totalItems: 78,
    countedItems: 78,
    discrepancies: 5,
    createdBy: "Maria Santos"
  }
];

const mockCountItems: CountItem[] = [
  {
    id: "1",
    productName: "Peito de Frango",
    category: "Carnes",
    systemQuantity: 15.5,
    countedQuantity: 14.2,
    unit: "kg",
    lastCounted: "2024-01-27 14:30",
    location: "Geladeira A1",
    difference: -1.3,
    status: "discrepancy"
  },
  {
    id: "2",
    productName: "Leite Integral",
    category: "Laticínios", 
    systemQuantity: 24,
    countedQuantity: 24,
    unit: "L",
    lastCounted: "2024-01-27 14:25",
    location: "Geladeira B2",
    difference: 0,
    status: "counted"
  },
  {
    id: "3",
    productName: "Farinha de Trigo",
    category: "Grãos",
    systemQuantity: 50,
    countedQuantity: null,
    unit: "kg",
    location: "Estoque Seco A3",
    difference: 0,
    status: "pending"
  },
  {
    id: "4",
    productName: "Azeite Extra Virgem",
    category: "Temperos",
    systemQuantity: 2,
    countedQuantity: 3,
    unit: "L",
    lastCounted: "2024-01-27 14:35",
    location: "Estoque Seco B1",
    difference: 1,
    status: "discrepancy"
  }
];

const statusConfig = {
  pending: {
    label: "Pendente",
    variant: "secondary" as const,
    color: "text-muted-foreground",
    bgColor: "bg-muted"
  },
  counted: {
    label: "Contado",
    variant: "default" as const,
    color: "text-success",
    bgColor: "bg-fresh-light border-fresh"
  },
  discrepancy: {
    label: "Divergência",
    variant: "destructive" as const,
    color: "text-warning",
    bgColor: "bg-expiring-light border-expiring"
  }
};

function CountItemCard({ item }: { item: CountItem }) {
  const config = statusConfig[item.status];
  
  return (
    <Card className={cn("p-4 hover:shadow-lg transition-smooth", config.bgColor)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-foreground text-sm mb-1">{item.productName}</h4>
          <p className="text-xs text-muted-foreground">{item.category} • {item.location}</p>
        </div>
        <Badge variant={config.variant} className="text-xs">
          {config.label}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3 text-sm">
        <div>
          <p className="text-xs text-muted-foreground">Sistema</p>
          <p className="font-medium">{item.systemQuantity} {item.unit}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Contado</p>
          <p className="font-medium">
            {item.countedQuantity !== null ? `${item.countedQuantity} ${item.unit}` : '-'}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Diferença</p>
          <div className="flex items-center gap-1">
            {item.difference !== 0 && item.countedQuantity !== null && (
              <>
                {item.difference > 0 ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-danger" />
                )}
              </>
            )}
            <p className={cn(
              "font-medium text-xs",
              item.difference > 0 && "text-success",
              item.difference < 0 && "text-danger",
              item.difference === 0 && "text-muted-foreground"
            )}>
              {item.difference !== 0 && item.countedQuantity !== null ? 
                (item.difference > 0 ? '+' : '') + item.difference : 
                '-'
              }
            </p>
          </div>
        </div>
      </div>

      {item.lastCounted && (
        <p className="text-xs text-muted-foreground mb-3">
          Última contagem: {new Date(item.lastCounted).toLocaleString('pt-BR')}
        </p>
      )}

      <div className="flex gap-2">
        {item.status === "pending" ? (
          <Button variant="success" size="sm" className="flex-1">
            <CheckSquare className="h-4 w-4 mr-2" />
            Contar
          </Button>
        ) : (
          <Button variant="outline" size="sm" className="flex-1">
            Recontar
          </Button>
        )}
        <Button variant="ghost" size="sm">
          <ScanLine className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

function CountSessionCard({ session }: { session: CountSession }) {
  const progress = (session.countedItems / session.totalItems) * 100;
  
  return (
    <Card className="p-6 hover:shadow-lg transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground mb-1">{session.name}</h3>
          <p className="text-sm text-muted-foreground">Por {session.createdBy}</p>
        </div>
        <Badge 
          variant={session.status === "active" ? "default" : session.status === "completed" ? "outline" : "secondary"}
          className="text-xs"
        >
          {session.status === "active" ? "Ativa" : session.status === "completed" ? "Concluída" : "Rascunho"}
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Progresso</p>
          <p className="font-medium">{session.countedItems}/{session.totalItems}</p>
          <div className="w-full bg-muted rounded-full h-2 mt-1">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Divergências</p>
          <p className="font-medium text-warning">{session.discrepancies}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Início</p>
          <p className="font-medium text-sm">
            {new Date(session.startDate).toLocaleDateString('pt-BR')}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          {session.status === "active" ? "Continuar" : "Ver Detalhes"}
        </Button>
        <Button variant="ghost" size="sm">
          <FileText className="h-4 w-4" />
        </Button>
        {session.status === "completed" && (
          <Button variant="ghost" size="sm">
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  );
}

export default function Counting() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("items");

  const filteredItems = mockCountItems.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const stats = {
    totalItems: mockCountItems.length,
    pending: mockCountItems.filter(i => i.status === "pending").length,
    counted: mockCountItems.filter(i => i.status === "counted").length,
    discrepancies: mockCountItems.filter(i => i.status === "discrepancy").length,
    totalSessions: mockCountSessions.length,
    activeSessions: mockCountSessions.filter(s => s.status === "active").length
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading text-foreground">Contagem de Estoque</h1>
            <p className="text-muted-foreground">Balanço físico e controle de divergências</p>
          </div>
          <Button variant="hero" size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Nova Contagem
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total Itens</p>
                <p className="text-xl font-bold">{stats.totalItems}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-fresh bg-fresh-light">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Contados</p>
                <p className="text-xl font-bold text-success">{stats.counted}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-expiring bg-expiring-light">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Divergências</p>
                <p className="text-xl font-bold text-warning">{stats.discrepancies}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Sessões</p>
                <p className="text-xl font-bold">{stats.totalSessions}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Ativas</p>
                <p className="text-xl font-bold">{stats.activeSessions}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos, categorias, localizações..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* Main Content with Tabs */}
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="items">Itens para Contagem ({stats.totalItems})</TabsTrigger>
              <TabsTrigger value="sessions">Sessões de Contagem ({stats.totalSessions})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="items" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredItems.map((item) => (
                  <CountItemCard key={item.id} item={item} />
                ))}
              </div>
              
              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <CheckSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {searchTerm 
                      ? "Nenhum item encontrado com os filtros aplicados" 
                      : "Nenhum item para contagem"}
                  </p>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Iniciar Contagem
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sessions" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockCountSessions.map((session) => (
                  <CountSessionCard key={session.id} session={session} />
                ))}
              </div>
              
              {mockCountSessions.length === 0 && (
                <div className="text-center py-12">
                  <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Nenhuma sessão de contagem criada</p>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Criar Primeira Sessão
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