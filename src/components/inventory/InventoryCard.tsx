import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Package, 
  AlertTriangle, 
  Star,
  MoreVertical,
  QrCode
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  daysToExpiry: number;
  isValuable: boolean;
  supplier?: string;
  batchNumber?: string;
}

interface InventoryCardProps {
  product: Product;
  onViewDetails?: (product: Product) => void;
  onGenerateQR?: (product: Product) => void;
}

export function InventoryCard({ product, onViewDetails, onGenerateQR }: InventoryCardProps) {
  const getStatusVariant = () => {
    if (product.daysToExpiry <= 0) return "danger";
    if (product.daysToExpiry <= 3) return "danger";
    if (product.daysToExpiry <= 7) return "warning";
    return "success";
  };

  const getStatusText = () => {
    if (product.daysToExpiry <= 0) return "Vencido";
    if (product.daysToExpiry <= 3) return "Vence hoje";
    if (product.daysToExpiry <= 7) return `${product.daysToExpiry} dias`;
    return `${product.daysToExpiry} dias`;
  };

  const statusVariant = getStatusVariant();

  return (
    <Card className={cn(
      "p-4 transition-smooth hover:shadow-lg cursor-pointer",
      statusVariant === "danger" && "border-expired bg-expired-light",
      statusVariant === "warning" && "border-expiring bg-expiring-light",
      statusVariant === "success" && "border-fresh bg-fresh-light"
    )}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-2">
          {product.isValuable && (
            <Star className="h-4 w-4 text-valuable fill-valuable mt-0.5" />
          )}
          <div>
            <h4 className="font-medium text-foreground text-sm">{product.name}</h4>
            <p className="text-xs text-muted-foreground">{product.category}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Package className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Estoque</span>
          </div>
          <span className="text-sm font-medium text-foreground">
            {product.quantity} {product.unit}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Validade</span>
          </div>
          <Badge 
            className={cn(
              "text-xs",
              statusVariant === "danger" && "bg-danger text-danger-foreground",
              statusVariant === "warning" && "bg-warning text-warning-foreground",
              statusVariant === "success" && "bg-success text-success-foreground"
            )}
          >
            {getStatusText()}
          </Badge>
        </div>

        {product.supplier && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Fornecedor</span>
            <span className="text-xs text-foreground">{product.supplier}</span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1"
          onClick={() => onViewDetails?.(product)}
        >
          Detalhes
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => onGenerateQR?.(product)}
        >
          <QrCode className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}