CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    price VARCHAR(100),
    featured_image TEXT
);

CREATE TABLE IF NOT EXISTS product_images (
    product_id INTEGER REFERENCES products(id),
    image_url TEXT,
    PRIMARY KEY (product_id, image_url)
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'ROLE_ADMIN'
);

CREATE TABLE IF NOT EXISTS customer_requests (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255),
    email VARCHAR(255),
    message TEXT,
    requested_service VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed BOOLEAN DEFAULT FALSE
);

INSERT INTO products (name, category, description, price, featured_image) VALUES 
('L''Éclat Éternel', 'gold', 'Un diamant de laboratoire pur, serti dans l''or 18 carats. Une pièce qui symbolise la perfection et la modernité.', 'Sur demande', 'https://customer-assets.emergentagent.com/job_9649882e-5286-400a-87ec-fa5fb81205a8/artifacts/ia3guqvy_photo%20acceuil%202.jpg'),
('L''Âme Artisanale', 'silver', 'Argent 925 travaillé à la main selon la technique Beldi marocaine. Chaque détail raconte un siècle de tradition.', 'Sur demande', 'https://customer-assets.emergentagent.com/job_9649882e-5286-400a-87ec-fa5fb81205a8/artifacts/qwlu1zt4_photo%20acceuil%205.jpg')
ON CONFLICT DO NOTHING;

INSERT INTO product_images (product_id, image_url) 
SELECT id, featured_image FROM products
ON CONFLICT DO NOTHING;

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) ACTIVATION
-- ==============================================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Users policies
DROP POLICY IF EXISTS users_select_policy ON users;
CREATE POLICY users_select_policy ON users FOR SELECT USING (
    username = current_setting('app.current_user', true) OR current_setting('app.current_user_role', true) = 'ROLE_ADMIN' OR current_user IN ('postgres', 'leroirekton')
);

-- Products & images policies (Public Read, Admin Write)
DROP POLICY IF EXISTS products_public_read ON products;
CREATE POLICY products_public_read ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS product_images_public_read ON product_images;
CREATE POLICY product_images_public_read ON product_images FOR SELECT USING (true);

-- Customer requests policies (Public Insert, Admin View)
DROP POLICY IF EXISTS customer_requests_insert_public ON customer_requests;
CREATE POLICY customer_requests_insert_public ON customer_requests FOR INSERT WITH CHECK (true);

