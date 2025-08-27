import { Layout } from "@/components/layout/Layout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { InventoryCard } from "@/components/inventory/InventoryCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Package, 
  AlertTriangle, 
  Clock, 
  TrendingUp,
  ChevronRight,
  Bell
} from "lucide-react";
import kitchenHero from "@/assets/kitchen-hero.jpg";

const mockStats = [
  {
    title: "Total de Produtos",
    value: "1,247",
    icon: <Package className="h-6 w-6" />,
    description: "Items no estoque",
    trend: { value: 12, isPositive: true }
  },
  {
    title: "Vencendo Hoje",
    value: "8",
    icon: <Clock className="h-6 w-6" />,
    description: "Requer atenção",
    variant: "warning" as const
  },
  {
    title: "Produtos Vencidos",
    value: "3",
    icon: <AlertTriangle className="h-6 w-6" />,
    description: "Descarte necessário",
    variant: "danger" as const
  },
  {
    title: "Movimentação Hoje",
    value: "R$ 2.847",
    icon: <TrendingUp className="h-6 w-6" />,
    description: "Valor processado",
    trend: { value: 8, isPositive: true },
    variant: "success" as const
  }
];

const mockProducts = [
  {
    id: "1",
    name: "Peito de Frango",
    category: "Carnes",
    quantity: 15.5,
    unit: "kg",
    expiryDate: "2024-01-28",
    daysToExpiry: 1,
    isValuable: true,
    supplier: "Frigorífico São Paulo"
  },
  {
    id: "2", 
    name: "Leite Integral",
    category: "Laticínios",
    quantity: 24,
    unit: "L",
    expiryDate: "2024-01-26",
    daysToExpiry: -1,
    isValuable: false,
    supplier: "Laticínios Vale"
  },
  {
    id: "3",
    name: "Queijo Mussarela",
    category: "Laticínios", 
    quantity: 5,
    unit: "kg",
    expiryDate: "2024-02-05",
    daysToExpiry: 8,
    isValuable: true,
    supplier: "Queijos & Cia"
  }
];

const Index = () => {
  return (
    <Layout>
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-hero p-8 text-white">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{ backgroundImage: `url(${kitchenHero})` }}
          />
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold font-heading mb-2">
                  Bem-vindo ao KitchenSafe
                </h1>
                <p className="text-white/90 text-lg">
                  Gestão completa e rastreabilidade para cozinhas profissionais
                </p>
                <p className="text-white/70 text-sm mt-2">
                  Garantindo segurança alimentar e reduzindo desperdícios
                </p>
              </div>
              <div className="hidden md:block">
                <Button variant="secondary" size="lg">
                  <Bell className="h-5 w-5 mr-2" />
                  8 Alertas
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Alerts and Quick Actions */}
          <div className="space-y-6">
            <AlertsPanel />
            <QuickActions />
          </div>

          {/* Right Column - Recent Products */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Produtos em Destaque
                </h3>
                <Button variant="ghost" size="sm">
                  Ver inventário
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockProducts.map((product) => (
                  <InventoryCard 
                    key={product.id} 
                    product={product}
                    onViewDetails={(product) => console.log('View details:', product)}
                    onGenerateQR={(product) => console.log('Generate QR:', product)}
                  />
                ))}
              </div>
              
              {mockProducts.length === 0 && (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum produto cadastrado</p>
                  <Button variant="outline" className="mt-4">
                    Adicionar Primeiro Produto
                  </Button>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
