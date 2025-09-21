-- Create the products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    image_url VARCHAR(500),
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample data
INSERT INTO products (name, description, price, stock) VALUES
('Eco-Hydrate Classic', 'Our classic 24oz eco-friendly water bottle made from 100% recycled materials', 29.99, 50),
('Eco-Hydrate Pro', 'Premium 32oz insulated bottle that keeps drinks cold for 24 hours', 39.99, 30),
('Eco-Hydrate Sport', 'Lightweight 20oz sports bottle perfect for active lifestyles', 34.99, 25),
('Eco-Hydrate Mini', 'Compact 16oz bottle perfect for kids and small hands', 24.99, 40),
('Eco-Hydrate XL', 'Extra large 40oz bottle for all-day hydration', 44.99, 20);

-- Create indexes for better performance
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE INDEX idx_products_price ON products(price);
