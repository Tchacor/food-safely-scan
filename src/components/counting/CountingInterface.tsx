import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Search, Package, CheckCircle, AlertCircle, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CountingItem {
  product_id: string;
  product_name: string;
  category: string;
  current_quantity: number;
  counted_quantity: number | null;
  unit: string;
  status: 'pending' | 'counted' | 'discrepancy';
}

interface CountingInterfaceProps {
  onComplete: (results: CountingItem[]) => void;
}

export function CountingInterface({ onComplete }: CountingInterfaceProps) {
  const { toast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [countingItems, setCountingItems] = useState<CountingItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("status", "ativo")
        .order("name");

      if (error) throw error;

      setProducts(data || []);
      
      const items: CountingItem[] = (data || []).map(product => ({
        product_id: product.id,
        product_name: product.name,
        category: product.category,
        current_quantity: product.quantity,
        counted_quantity: null,
        unit: product.unit,
        status: 'pending'
      }));
      
      setCountingItems(items);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateCountedQuantity = (productId: string, quantity: number) => {
    setCountingItems(items => 
      items.map(item => {
        if (item.product_id === productId) {
          const newItem = {
            ...item,
            counted_quantity: quantity,
            status: quantity === item.current_quantity ? 'counted' : 'discrepancy'
          } as CountingItem;
          return newItem;
        }
        return item;
      })
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'counted':
        return 'bg-success text-success-foreground';
      case 'discrepancy':
        return 'bg-warning text-warning-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'counted':
        return <CheckCircle className="h-4 w-4" />;
      case 'discrepancy':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const filteredItems = countingItems.filter(item =>
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completeCounting = () => {
    const unCountedItems = countingItems.filter(item => item.counted_quantity === null);
    
    if (unCountedItems.length > 0) {
      toast({
        title: "Contagem incompleta",
        description: `${unCountedItems.length} item(s) ainda não foram contados.`,
        variant: "destructive",
      });
      return;
    }

    onComplete(countingItems);
    toast({
      title: "Contagem finalizada!",
      description: "Relatório de discrepâncias será gerado.",
    });
  };

  const stats = {
    total: countingItems.length,
    counted: countingItems.filter(item => item.status === 'counted').length,
    discrepancies: countingItems.filter(item => item.status === 'discrepancy').length,
    pending: countingItems.filter(item => item.status === 'pending').length,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Package className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Carregando produtos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total de Itens</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-success">{stats.counted}</div>
            <div className="text-sm text-muted-foreground">Contados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-warning">{stats.discrepancies}</div>
            <div className="text-sm text-muted-foreground">Discrepâncias</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-muted-foreground">{stats.pending}</div>
            <div className="text-sm text-muted-foreground">Pendentes</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos por nome ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <div className="space-y-4">
        {filteredItems.map((item) => (
          <Card key={item.product_id} className="transition-colors hover:bg-accent/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium">{item.product_name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      {item.category}
                    </Badge>
                    <Badge className={cn("text-xs", getStatusColor(item.status))}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1 capitalize">{item.status === 'pending' ? 'Pendente' : item.status === 'counted' ? 'Contado' : 'Discrepância'}</span>
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Sistema:</span> {item.current_quantity} {item.unit}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium">Contado:</label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={item.counted_quantity || ""}
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          updateCountedQuantity(item.product_id, isNaN(value) ? 0 : value);
                        }}
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">{item.unit}</span>
                    </div>

                    {item.counted_quantity !== null && item.status === 'discrepancy' && (
                      <div className="text-sm">
                        <span className="font-medium text-warning">
                          Diferença: {(item.counted_quantity - item.current_quantity).toFixed(2)} {item.unit}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Complete Button */}
      <Card>
        <CardContent className="p-6 text-center">
          <Button 
            onClick={completeCounting}
            size="lg"
            className="w-full md:w-auto"
            disabled={stats.pending > 0}
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Finalizar Contagem e Gerar Relatório
          </Button>
          
          {stats.pending > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Complete a contagem de todos os itens para gerar o relatório
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}