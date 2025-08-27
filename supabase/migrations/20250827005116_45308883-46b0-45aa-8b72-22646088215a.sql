-- Create schema for kitchen management system

-- Create enum for product categories
CREATE TYPE public.product_category AS ENUM ('carnes', 'vegetais', 'laticinios', 'graos', 'temperos', 'bebidas', 'outros');

-- Create enum for product status
CREATE TYPE public.product_status AS ENUM ('ativo', 'vencido', 'descartado');

-- Create enum for production order status
CREATE TYPE public.production_status AS ENUM ('pendente', 'em_preparo', 'finalizado', 'cancelado');

-- Create products table for inventory
CREATE TABLE public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    category product_category NOT NULL,
    supplier TEXT,
    purchase_date DATE,
    expiry_date DATE NOT NULL,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    unit TEXT NOT NULL DEFAULT 'kg',
    cost_per_unit DECIMAL(10,2),
    is_valuable BOOLEAN DEFAULT false,
    status product_status DEFAULT 'ativo',
    batch_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    user_id UUID REFERENCES auth.users(id)
);

-- Create production orders table
CREATE TABLE public.production_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    dish_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    status production_status DEFAULT 'pendente',
    production_date DATE DEFAULT CURRENT_DATE,
    expiry_date DATE,
    chef_notes TEXT,
    qr_code TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Create production ingredients table (many-to-many)
CREATE TABLE public.production_ingredients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    production_order_id UUID REFERENCES public.production_orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id),
    quantity_used DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create stock movements table for tracking changes
CREATE TABLE public.stock_movements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID REFERENCES public.products(id),
    movement_type TEXT NOT NULL, -- 'entrada', 'saida', 'ajuste', 'descarte'
    quantity DECIMAL(10,2) NOT NULL,
    reason TEXT,
    reference_id UUID, -- Can reference production_order_id or other tables
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.production_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_movements ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Users can view all products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Users can insert products" ON public.products FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update products" ON public.products FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete products" ON public.products FOR DELETE USING (auth.uid() = user_id);

-- Create policies for production orders
CREATE POLICY "Users can view all production orders" ON public.production_orders FOR SELECT USING (true);
CREATE POLICY "Users can insert production orders" ON public.production_orders FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update production orders" ON public.production_orders FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete production orders" ON public.production_orders FOR DELETE USING (auth.uid() = created_by);

-- Create policies for production ingredients
CREATE POLICY "Users can view production ingredients" ON public.production_ingredients FOR SELECT USING (true);
CREATE POLICY "Users can insert production ingredients" ON public.production_ingredients FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update production ingredients" ON public.production_ingredients FOR UPDATE USING (true);
CREATE POLICY "Users can delete production ingredients" ON public.production_ingredients FOR DELETE USING (true);

-- Create policies for stock movements
CREATE POLICY "Users can view all stock movements" ON public.stock_movements FOR SELECT USING (true);
CREATE POLICY "Users can insert stock movements" ON public.stock_movements FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update stock movements" ON public.stock_movements FOR UPDATE USING (auth.uid() = created_by);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_production_orders_updated_at
    BEFORE UPDATE ON public.production_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_products_expiry_date ON public.products(expiry_date);
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_status ON public.products(status);
CREATE INDEX idx_production_orders_status ON public.production_orders(status);
CREATE INDEX idx_production_orders_date ON public.production_orders(production_date);
CREATE INDEX idx_stock_movements_product ON public.stock_movements(product_id);
CREATE INDEX idx_stock_movements_date ON public.stock_movements(created_at);