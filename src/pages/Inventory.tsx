import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InventoryCard } from "@/components/inventory/InventoryCard";
import { 
  Search, 
  Filter, 
  Plus, 
  ScanLine,
  Package,
  AlertTriangle,
  Star,
  Calendar,
  MoreVertical
} from "lucide-react";
import { useState } from "react";

const mockInventoryData = [
  {
    id: "1",
    name: "Peito de Frango",
    category: "Carnes",
    quantity: 15.5,
    unit: "kg",
    expiryDate: "2024-01-28",
    daysToExpiry: 1,
    isValuable: true,
    supplier: "Frigorífico São Paulo",
    batchNumber: "FR240125"
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
    supplier: "Laticínios Vale",
    batchNumber: "LT240124"
  },
  {
    id: "3",
    name: "Azeite Extra Virgem",
    category: "Temperos",
    quantity: 2,
    unit: "L",
    expiryDate: "2024-06-15",
    daysToExpiry: 140,
    isValuable: true,
    supplier: "Oliveira & Filhos",
    batchNumber: "AZ240110"
  },
  {
    id: "4",
    name: "Queijo Mussarela",
    category: "Laticínios", 
    quantity: 5,
    unit: "kg",
    expiryDate: "2024-02-05",
    daysToExpiry: 8,
    isValuable: true,
    supplier: "Queijos & Cia",
    batchNumber: "QM240120"
  },
  {
    id: "5",
    name: "Farinha de Trigo",
    category: "Grãos",
    quantity: 50,
    unit: "kg",
    expiryDate: "2024-08-30",
    daysToExpiry: 215,
    isValuable: false,
    supplier: "Moinho Central",
    batchNumber: "FT240115"
  }
];

const categories = ["Todos", "Carnes", "Laticínios", "Grãos", "Temperos", "Vegetais", "Bebidas", "Outros"];
const statusFilters = ["Todos", "Frescos", "Vencendo", "Vencidos", "Baixo Estoque"];

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedStatus, setSelectedStatus] = useState("Todos");
  const [activeTab, setActiveTab] = useState("all");

  const filteredProducts = mockInventoryData.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    
    let matchesStatus = true;
    if (selectedStatus === "Frescos") matchesStatus = product.daysToExpiry > 7;
    if (selectedStatus === "Vencendo") matchesStatus = product.daysToExpiry >= 0 && product.daysToExpiry <= 7;
    if (selectedStatus === "Vencidos") matchesStatus = product.daysToExpiry < 0;
    if (selectedStatus === "Baixo Estoque") matchesStatus = product.quantity < 5;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getProductsByStatus = (status: string) => {
    if (status === "expiring") return filteredProducts.filter(p => p.daysToExpiry >= 0 && p.daysToExpiry <= 7);
    if (status === "expired") return filteredProducts.filter(p => p.daysToExpiry < 0);
    if (status === "valuable") return filteredProducts.filter(p => p.isValuable);
    return filteredProducts;
  };

  const currentProducts = activeTab === "all" ? filteredProducts : getProductsByStatus(activeTab);

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold font-heading text-foreground">Inventário</h1>
            <p className="text-muted-foreground">Controle de estoque e validade dos produtos</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <ScanLine className="h-4 w-4 mr-2" />
              Escanear
            </Button>
            <Button variant="success" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar produtos, fornecedores..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusFilters.map(status => (
                  <SelectItem key={status} value={status}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-xl font-bold">{mockInventoryData.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-expiring bg-expiring-light">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-warning" />
              <div>
                <p className="text-sm text-muted-foreground">Vencendo</p>
                <p className="text-xl font-bold text-warning">
                  {mockInventoryData.filter(p => p.daysToExpiry >= 0 && p.daysToExpiry <= 7).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-expired bg-expired-light">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-danger" />
              <div>
                <p className="text-sm text-muted-foreground">Vencidos</p>
                <p className="text-xl font-bold text-danger">
                  {mockInventoryData.filter(p => p.daysToExpiry < 0).length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4 border-valuable bg-valuable-light">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-valuable" />
              <div>
                <p className="text-sm text-muted-foreground">Valiosos</p>
                <p className="text-xl font-bold text-valuable">
                  {mockInventoryData.filter(p => p.isValuable).length}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Products Grid with Tabs */}
        <Card className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">Todos ({filteredProducts.length})</TabsTrigger>
              <TabsTrigger value="expiring" className="text-warning">
                Vencendo ({getProductsByStatus("expiring").length})
              </TabsTrigger>
              <TabsTrigger value="expired" className="text-danger">
                Vencidos ({getProductsByStatus("expired").length})
              </TabsTrigger>
              <TabsTrigger value="valuable" className="text-valuable">
                Valiosos ({getProductsByStatus("valuable").length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentProducts.map((product) => (
                  <InventoryCard 
                    key={product.id} 
                    product={product}
                    onViewDetails={(product) => console.log('View details:', product)}
                    onGenerateQR={(product) => console.log('Generate QR:', product)}
                  />
                ))}
              </div>
              
              {currentProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || selectedCategory !== "Todos" || selectedStatus !== "Todos" 
                      ? "Nenhum produto encontrado com os filtros aplicados" 
                      : "Nenhum produto cadastrado"}
                  </p>
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Produto
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