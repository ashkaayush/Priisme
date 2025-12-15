-- Product categories
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Products (fashion items)
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES public.categories(id),
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- in paise (₹1 = 100 paise)
  original_price INTEGER,
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  sizes JSONB DEFAULT '[]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  stock INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  style_tags JSONB DEFAULT '[]'::jsonb, -- for AI matching
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Cart items
CREATE TABLE public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  size TEXT,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id, size, color)
);

-- Wishlist
CREATE TABLE public.wishlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Orders
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',
  total_amount INTEGER NOT NULL, -- in paise
  shipping_address JSONB,
  payment_intent_id TEXT,
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Order items
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id),
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL, -- price at time of purchase
  size TEXT,
  color TEXT
);

-- Salons
CREATE TABLE public.salons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  phone TEXT,
  email TEXT,
  image_url TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  price_range TEXT, -- '₹', '₹₹', '₹₹₹', '₹₹₹₹'
  opening_hours JSONB,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Salon services
CREATE TABLE public.salon_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID NOT NULL REFERENCES public.salons(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  price INTEGER NOT NULL, -- in paise
  category TEXT, -- 'haircut', 'color', 'makeup', 'spa', etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Bookings
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  salon_id UUID NOT NULL REFERENCES public.salons(id),
  service_id UUID NOT NULL REFERENCES public.salon_services(id),
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  notes TEXT,
  total_amount INTEGER NOT NULL, -- in paise
  payment_status TEXT DEFAULT 'pending', -- pending, paid, refunded
  stripe_session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Reviews (for both products and salons)
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  salon_id UUID REFERENCES public.salons(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT review_target CHECK (
    (product_id IS NOT NULL AND salon_id IS NULL) OR
    (product_id IS NULL AND salon_id IS NOT NULL)
  )
);

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.salon_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Public read policies for catalog
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Salons are viewable by everyone" ON public.salons FOR SELECT USING (is_active = true);
CREATE POLICY "Salon services are viewable by everyone" ON public.salon_services FOR SELECT USING (is_active = true);
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (true);

-- User-specific policies
CREATE POLICY "Users can view their own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to their cart" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their cart" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from their cart" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their wishlist" ON public.wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to wishlist" ON public.wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete from wishlist" ON public.wishlist FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their orders" ON public.orders FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Users can create order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);

CREATE POLICY "Users can view their bookings" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their bookings" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can create reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Trigger for order timestamps
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample data
-- Categories
INSERT INTO public.categories (name, slug, description) VALUES
  ('Ethnic Wear', 'ethnic', 'Traditional Indian clothing'),
  ('Western Wear', 'western', 'Modern western fashion'),
  ('Sarees', 'sarees', 'Beautiful sarees for every occasion'),
  ('Bridal', 'bridal', 'Wedding and bridal collection');

-- Sample Products
INSERT INTO public.products (category_id, name, description, price, original_price, image_url, sizes, colors, stock, rating, review_count, style_tags) VALUES
  ((SELECT id FROM public.categories WHERE slug = 'ethnic'), 'Classic White Kurta', 'Elegant white cotton kurta perfect for any occasion', 249900, 399900, 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop', '["S", "M", "L", "XL"]', '["White", "Cream"]', 50, 4.8, 124, '["classic", "minimalist", "elegant"]'),
  ((SELECT id FROM public.categories WHERE slug = 'ethnic'), 'Embroidered Anarkali', 'Stunning embroidered anarkali suit with dupatta', 499900, 699900, 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=500&fit=crop', '["S", "M", "L", "XL"]', '["Red", "Blue", "Green"]', 30, 4.9, 89, '["glamorous", "romantic", "festive"]'),
  ((SELECT id FROM public.categories WHERE slug = 'sarees'), 'Designer Silk Saree', 'Premium silk saree with golden border', 899900, 1299900, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop', '["Free Size"]', '["Pink", "Purple", "Orange"]', 20, 4.7, 156, '["classic", "elegant", "traditional"]'),
  ((SELECT id FROM public.categories WHERE slug = 'western'), 'Casual Denim Jacket', 'Comfortable denim jacket for everyday style', 199900, 299900, 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop', '["S", "M", "L", "XL", "XXL"]', '["Blue", "Black"]', 75, 4.6, 203, '["casual", "edgy", "streetwear"]'),
  ((SELECT id FROM public.categories WHERE slug = 'western'), 'Printed Maxi Dress', 'Flowy printed maxi dress perfect for summer', 229900, 349900, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop', '["XS", "S", "M", "L"]', '["Floral", "Blue", "Yellow"]', 40, 4.5, 167, '["bohemian", "romantic", "summer"]'),
  ((SELECT id FROM public.categories WHERE slug = 'bridal'), 'Bridal Lehenga Set', 'Exquisite bridal lehenga with heavy embroidery', 2499900, 3499900, 'https://images.unsplash.com/photo-1583391733975-d4d1f7198d0c?w=400&h=500&fit=crop', '["S", "M", "L"]', '["Red", "Maroon", "Pink"]', 10, 5.0, 45, '["glamorous", "bridal", "traditional"]');

-- Sample Salons
INSERT INTO public.salons (name, description, address, city, phone, image_url, rating, review_count, price_range, is_verified, opening_hours) VALUES
  ('Glamour Studio', 'Premium salon offering haircuts, makeup, and bridal services', 'Koramangala 5th Block', 'Bangalore', '+91 98765 43210', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=300&fit=crop', 4.9, 245, '₹₹₹', true, '{"mon": "10:00-20:00", "tue": "10:00-20:00", "wed": "10:00-20:00", "thu": "10:00-20:00", "fri": "10:00-21:00", "sat": "09:00-21:00", "sun": "10:00-18:00"}'),
  ('The Hair Bar', 'Trendy salon specializing in cuts, colors, and styling', 'Indiranagar 12th Main', 'Bangalore', '+91 98765 43211', 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&h=300&fit=crop', 4.7, 189, '₹₹', true, '{"mon": "10:00-20:00", "tue": "10:00-20:00", "wed": "10:00-20:00", "thu": "10:00-20:00", "fri": "10:00-20:00", "sat": "09:00-20:00", "sun": "closed"}'),
  ('Radiance Spa & Salon', 'Luxury spa and salon for complete relaxation', 'HSR Layout Sector 2', 'Bangalore', '+91 98765 43212', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&h=300&fit=crop', 4.8, 312, '₹₹₹₹', true, '{"mon": "09:00-21:00", "tue": "09:00-21:00", "wed": "09:00-21:00", "thu": "09:00-21:00", "fri": "09:00-22:00", "sat": "08:00-22:00", "sun": "10:00-20:00"}'),
  ('Style Studio', 'Modern salon for men and women', 'JP Nagar 6th Phase', 'Bangalore', '+91 98765 43213', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=300&fit=crop', 4.6, 156, '₹₹', true, '{"mon": "10:00-20:00", "tue": "10:00-20:00", "wed": "10:00-20:00", "thu": "10:00-20:00", "fri": "10:00-20:00", "sat": "09:00-20:00", "sun": "10:00-18:00"}');

-- Sample Salon Services
INSERT INTO public.salon_services (salon_id, name, description, duration_minutes, price, category) VALUES
  ((SELECT id FROM public.salons WHERE name = 'Glamour Studio'), 'Haircut & Styling', 'Professional haircut with blow dry styling', 45, 99900, 'haircut'),
  ((SELECT id FROM public.salons WHERE name = 'Glamour Studio'), 'Bridal Makeup', 'Complete bridal makeup with hair styling', 180, 1499900, 'makeup'),
  ((SELECT id FROM public.salons WHERE name = 'Glamour Studio'), 'Hair Color', 'Global or highlights with premium colors', 120, 349900, 'color'),
  ((SELECT id FROM public.salons WHERE name = 'The Hair Bar'), 'Men''s Haircut', 'Trendy men''s haircut with styling', 30, 49900, 'haircut'),
  ((SELECT id FROM public.salons WHERE name = 'The Hair Bar'), 'Women''s Haircut', 'Precision cut with consultation', 45, 79900, 'haircut'),
  ((SELECT id FROM public.salons WHERE name = 'The Hair Bar'), 'Balayage', 'Hand-painted balayage highlights', 180, 599900, 'color'),
  ((SELECT id FROM public.salons WHERE name = 'Radiance Spa & Salon'), 'Facial Treatment', 'Deep cleansing facial with massage', 60, 199900, 'spa'),
  ((SELECT id FROM public.salons WHERE name = 'Radiance Spa & Salon'), 'Full Body Massage', 'Relaxing Swedish massage', 90, 299900, 'spa'),
  ((SELECT id FROM public.salons WHERE name = 'Radiance Spa & Salon'), 'Manicure & Pedicure', 'Classic mani-pedi with nail art', 75, 149900, 'nails'),
  ((SELECT id FROM public.salons WHERE name = 'Style Studio'), 'Beard Grooming', 'Beard trim and styling', 30, 39900, 'grooming'),
  ((SELECT id FROM public.salons WHERE name = 'Style Studio'), 'Hair Spa', 'Deep conditioning hair treatment', 45, 89900, 'treatment');