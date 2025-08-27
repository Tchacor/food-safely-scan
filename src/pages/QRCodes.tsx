import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  QrCode, 
  Printer, 
  Download, 
  Search,
  Calendar,
  Package,
  User,
  Clock,
  Plus,
  ScanLine,
  FileText,
  History
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface QRCodeItem {
  id: string;
  code: string;
  productName: string;
  productionDate: string;
  expiryDate: string;
  chef: string;
  batchNumber: string;
  category: string;
  ingredients: string[];
  status: "ativo" | "usado" | "vencido";
  scannedTimes: number;
  lastScanned?: string;
}

const mockQRCodes: QRCodeItem[] = [
  {
    id: "1",
    code: "QR-PRD-001-240127",
    productName: "Lasanha à Bolonhesa",
    productionDate: "2024-01-27",
    expiryDate: "2024-01-29",
    chef: "Chef Maria Silva",
    batchNumber: "PRD-001",
    category: "Pratos Prontos",
    ingredients: ["Massa de lasanha", "Carne moída", "Queijo mussarela", "Molho de tomate"],
    status: "ativo",
    scannedTimes: 3,
    lastScanned: "2024-01-27 14:30"
  },
  {
    id: "2",
    code: "QR-PRD-002-240127",
    productName: "Salada Caesar",
    productionDate: "2024-01-27",
    expiryDate: "2024-01-28",
    chef: "Sous Chef João",
    batchNumber: "PRD-002",
    category: "Saladas",
    ingredients: ["Alface romana", "Queijo parmesão", "Croutons", "Molho caesar"],
    status: "vencido",
    scannedTimes: 1,
    lastScanned: "2024-01-27 12:15"
  },
  {
    id: "3",
    code: "QR-ING-001-240127",
    productName: "Peito de Frango",
    productionDate: "2024-01-25",
    expiryDate: "2024-01-28",
    chef: "Recebimento",
    batchNumber: "FR240125",
    category: "Ingredientes",
    ingredients: ["Peito de frango congelado"],
    status: "usado",
    scannedTimes: 5,
    lastScanned: "2024-01-27 16:45"
  }
];

const statusConfig = {
  ativo: {
    label: "Ativo",
    variant: "default" as const,
    color: "text-success",
    bgColor: "bg-fresh-light border-fresh"
  },
  usado: {
    label: "Usado",
    variant: "secondary" as const,
    color: "text-muted-foreground",
    bgColor: "bg-muted"
  },
  vencido: {
    label: "Vencido",
    variant: "destructive" as const,
    color: "text-danger",
    bgColor: "bg-expired-light border-expired"
  }
};

function QRCodeCard({ item }: { item: QRCodeItem }) {
  const config = statusConfig[item.status];
  
  return (
    <Card className={cn("p-6 hover:shadow-lg transition-smooth", config.bgColor)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-foreground">{item.productName}</h3>
            <Badge variant={config.variant} className="text-xs">
              {config.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-mono">{item.code}</p>
        </div>
        <div className="w-16 h-16 bg-background border-2 border-primary rounded-lg flex items-center justify-center">
          <QrCode className="h-8 w-8 text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Produção</p>
          <p className="text-sm font-medium">
            {new Date(item.productionDate).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Validade</p>
          <p className="text-sm font-medium">
            {new Date(item.expiryDate).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Chef</p>
          <p className="text-sm font-medium">{item.chef}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Leituras</p>
          <p className="text-sm font-medium">{item.scannedTimes}x</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Categoria</p>
        <Badge variant="outline" className="text-xs">
          {item.category}
        </Badge>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          <ScanLine className="h-4 w-4 mr-2" />
          Detalhes
        </Button>
        <Button variant="ghost" size="sm">
          <Printer className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}

export default function QRCodes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const filteredCodes = mockQRCodes.filter(item => {
    const matchesSearch = item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.chef.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getCodesByStatus = (status: string) => {
    if (status === "all") return filteredCodes;
    return filteredCodes.filter(code => code.status === status);
  };

  const currentCodes = getCodesByStatus(activeTab);

  const stats = {
    total: mockQRCodes.length,
    ativo: mockQRCodes.filter(c => c.status === "ativo").length,
    usado: mockQRCodes.filter(c => c.status === "usado").length,
    vencido: mockQRCodes.filter(c => c.status === "vencido").length
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading text-foreground">QR Codes</h1>
            <p className="text-muted-foreground">Etiquetagem inteligente e rastreabilidade completa</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ScanLine className="h-4 w-4 mr-2" />
              Escanear
            </Button>
            <Button variant="hero" size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Gerar Etiqueta
            </Button>
          </div>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 hover:shadow-lg transition-smooth cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <QrCode className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Gerar Etiqueta</h3>
                <p className="text-sm text-muted-foreground">Para produtos manipulados</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-smooth cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-fresh rounded-lg flex items-center justify-center">
                <ScanLine className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Escanear Código</h3>
                <p className="text-sm text-muted-foreground">Consultar rastreabilidade</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-smooth cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-warning rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Relatórios</h3>
                <p className="text-sm text-muted-foreground">Histórico de leituras</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <QrCode className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{stats.total}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-fresh bg-fresh-light">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-success" />
              <div>
                <p className="text-sm text-muted-foreground">Ativos</p>
                <p className="text-xl font-bold text-success">{stats.ativo}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Usados</p>
                <p className="text-xl font-bold">{stats.usado}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-expired bg-expired-light">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-danger" />
              <div>
                <p className="text-sm text-muted-foreground">Vencidos</p>
                <p className="text-xl font-bold text-danger">{stats.vencido}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Search */}
        <Card className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar QR codes, produtos, chefs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        {/* QR Codes Grid with Tabs */}
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todos ({stats.total})</TabsTrigger>
              <TabsTrigger value="ativo" className="text-success">
                Ativos ({stats.ativo})
              </TabsTrigger>
              <TabsTrigger value="usado">
                Usados ({stats.usado})
              </TabsTrigger>
              <TabsTrigger value="vencido" className="text-danger">
                Vencidos ({stats.vencido})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentCodes.map((item) => (
                  <QRCodeCard key={item.id} item={item} />
                ))}
              </div>
              
              {currentCodes.length === 0 && (
                <div className="text-center py-12">
                  <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {searchTerm 
                      ? "Nenhum QR code encontrado com os filtros aplicados" 
                      : "Nenhum QR code gerado ainda"}
                  </p>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Gerar Primeira Etiqueta
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