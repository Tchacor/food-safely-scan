import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Download, Printer } from "lucide-react";

interface QRGeneratorProps {
  products?: any[];
}

export function QRGenerator({ products = [] }: QRGeneratorProps) {
  const { toast } = useToast();
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [customText, setCustomText] = useState("");
  const [qrType, setQrType] = useState<"product" | "custom">("product");
  const [qrData, setQrData] = useState("");

  const generateQRData = () => {
    if (qrType === "product" && selectedProduct) {
      const product = products.find(p => p.id === selectedProduct);
      if (product) {
        const data = {
          type: "product",
          id: product.id,
          name: product.name,
          category: product.category,
          expiry_date: product.expiry_date,
          batch_number: product.batch_number,
          timestamp: new Date().toISOString(),
        };
        setQrData(JSON.stringify(data));
      }
    } else if (qrType === "custom" && customText) {
      setQrData(customText);
    }
  };

  const downloadQR = () => {
    if (!qrData) {
      toast({
        title: "Erro",
        description: "Gere um QR Code primeiro",
        variant: "destructive",
      });
      return;
    }

    const svg = document.querySelector('#qr-code-svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.download = `qr-code-${Date.now()}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      };
      
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }

    toast({
      title: "QR Code baixado!",
      description: "O arquivo foi salvo na pasta de downloads.",
    });
  };

  const printQR = () => {
    if (!qrData) {
      toast({
        title: "Erro",
        description: "Gere um QR Code primeiro",
        variant: "destructive",
      });
      return;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const qrElement = document.querySelector('#qr-code-svg');
      const svgData = qrElement ? new XMLSerializer().serializeToString(qrElement) : '';
      
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - KitchenSafe</title>
            <style>
              body { 
                margin: 0; 
                padding: 20px; 
                display: flex; 
                justify-content: center; 
                align-items: center; 
                min-height: 100vh;
                font-family: Arial, sans-serif;
              }
              .qr-container {
                text-align: center;
                border: 2px solid #000;
                padding: 20px;
                background: white;
              }
              .qr-title {
                margin-bottom: 10px;
                font-size: 18px;
                font-weight: bold;
              }
              .qr-info {
                margin-top: 10px;
                font-size: 12px;
                color: #666;
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="qr-title">KitchenSafe - Rastreabilidade</div>
              ${svgData}
              <div class="qr-info">
                Gerado em: ${new Date().toLocaleString('pt-BR')}
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }

    toast({
      title: "QR Code enviado para impressão!",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Gerar QR Code</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="qr-type">Tipo de QR Code</Label>
            <Select value={qrType} onValueChange={(value: "product" | "custom") => setQrType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="product">Produto do Inventário</SelectItem>
                <SelectItem value="custom">Texto Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {qrType === "product" && (
            <div>
              <Label htmlFor="product">Selecionar Produto</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um produto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - {product.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {qrType === "custom" && (
            <div>
              <Label htmlFor="custom-text">Texto Personalizado</Label>
              <Textarea
                id="custom-text"
                placeholder="Digite o texto ou URL para o QR Code"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                rows={4}
              />
            </div>
          )}

          <Button onClick={generateQRData} className="w-full">
            Gerar QR Code
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Visualização e Download</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {qrData ? (
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <QRCodeSVG
                  id="qr-code-svg"
                  value={qrData}
                  size={200}
                  level="M"
                  includeMargin={true}
                />
              </div>
              
              <div className="space-y-2">
                <Button onClick={downloadQR} className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Baixar PNG
                </Button>
                <Button onClick={printQR} className="w-full" variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir Etiqueta
                </Button>
              </div>
              
              <div className="text-xs text-muted-foreground mt-4 p-2 bg-muted rounded">
                <strong>Dados do QR:</strong>
                <br />
                {qrData.length > 100 ? `${qrData.substring(0, 100)}...` : qrData}
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              <div className="w-48 h-48 mx-auto border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center">
                <span>QR Code aparecerá aqui</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}