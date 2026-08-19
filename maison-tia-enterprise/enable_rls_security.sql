-- ==============================================================================
-- MAISON TIA — ACTIVATION ROW-LEVEL SECURITY (RLS) SUR TOUTES LES TABLES
-- ==============================================================================
-- Ce script active RLS et configure les politiques d'accès (Policies) pour :
-- 1. users (données sensibles utilisateurs & administrateurs)
-- 2. customer_requests (demandes de consultations privées, leads & commandes)
-- 3. products (catalogue public en lecture, modifications restreintes)
-- 4. product_images (galerie d'images des créations)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 0. FONCTIONS HELPER POUR LE CONTEXTE DE SESSION APPLICATIF
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_app_context(p_username TEXT, p_role TEXT) 
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_user', p_username, false);
    PERFORM set_config('app.current_user_role', p_role, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 1. TABLE : USERS (Authentification & Comptes)
-- ------------------------------------------------------------------------------
-- Activer RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Supprimer anciennes politiques si existantes
DROP POLICY IF EXISTS users_select_policy ON users;
DROP POLICY IF EXISTS users_insert_policy ON users;
DROP POLICY IF EXISTS users_update_policy ON users;
DROP POLICY IF EXISTS users_delete_policy ON users;

-- Lecture : Un utilisateur ne peut lire que son propre compte, sauf ROLE_ADMIN ou superuser
CREATE POLICY users_select_policy ON users
    FOR SELECT
    USING (
        username = current_setting('app.current_user', true)
        OR current_setting('app.current_user_role', true) = 'ROLE_ADMIN'
        OR current_user IN ('postgres', 'leroirekton')
    );

-- Insertion : Uniquement par un administrateur authentifié ou setup initial
CREATE POLICY users_insert_policy ON users
    FOR INSERT
    WITH CHECK (
        current_setting('app.current_user_role', true) = 'ROLE_ADMIN'
        OR current_user IN ('postgres', 'leroirekton')
    );

-- Modification : Son propre compte ou administrateur
CREATE POLICY users_update_policy ON users
    FOR UPDATE
    USING (
        username = current_setting('app.current_user', true)
        OR current_setting('app.current_user_role', true) = 'ROLE_ADMIN'
        OR current_user IN ('postgres', 'leroirekton')
    )
    WITH CHECK (
        username = current_setting('app.current_user', true)
        OR current_setting('app.current_user_role', true) = 'ROLE_ADMIN'
        OR current_user IN ('postgres', 'leroirekton')
    );

-- Suppression : Strictement réservé à l'administrateur
CREATE POLICY users_delete_policy ON users
    FOR DELETE
    USING (
        current_setting('app.current_user_role', true) = 'ROLE_ADMIN'
        OR current_user IN ('postgres', 'leroirekton')
    );

-- ------------------------------------------------------------------------------
-- 2. TABLE : CUSTOMER_REQUESTS (Demandes privées & Rendez-vous clients)
-- ------------------------------------------------------------------------------
ALTER TABLE customer_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS customer_requests_insert_public ON customer_requests;
DROP POLICY IF EXISTS customer_requests_select_admin ON customer_requests;
DROP POLICY IF EXISTS customer_requests_update_admin ON customer_requests;
DROP POLICY IF EXISTS customer_requests_delete_admin ON customer_requests;

-- Création / Demande de RDV : Tout client anonyme ou public peut insérer une demande
CREATE POLICY customer_requests_insert_public ON customer_requests
    FOR INSERT
    WITH CHECK (true);

-- Lecture des leads & consultations : Uniquement les administrateurs
CREATE POLICY customer_requests_select_admin ON customer_requests
    FOR SELECT
    USING (
        current_setting('app.current_user_role', true) = 'ROLE_ADMIN'
        OR current_user IN ('postgres', 'leroirekton')
    );

-- Modification de statut (CONFIRMÉ / TRAITÉ) : Uniquement administrateur
CREATE POLICY customer_requests_update_admin ON customer_requests
    FOR UPDATE
    USING (
        current_setting('app.current_user_role', true) = 'ROLE_ADMIN'
        OR current_user IN ('postgres', 'leroirekton')
    );

-- Suppression : Uniquement administrateur
CREATE POLICY customer_requests_delete_admin ON customer_requests
    FOR DELETE
    USING (
        current_setting('app.current_user_role', true) = 'ROLE_ADMIN'
        OR current_user IN ('postgres', 'leroirekton')
    );

-- ------------------------------------------------------------------------------
-- 3. TABLE : PRODUCTS (Catalogue Joaillerie & Bijoux)
-- ------------------------------------------------------------------------------
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS products_public_read ON products;
DROP POLICY IF EXISTS products_admin_insert ON products;
DROP POLICY IF EXISTS products_admin_update ON products;
DROP POLICY IF EXISTS products_admin_delete ON products;

-- Lecture : Publique (vitrine e-commerce accessible à tous)
CREATE POLICY products_public_read ON products
    FOR SELECT
    USING (true);

-- Écriture / Modification / Suppression : Strictement réservé à l'administration
CREATE POLICY products_admin_insert ON products
    FOR INSERT
    WITH CHECK (
        current_setting('app.current_user_role', true) = 'ROLE_ADMIN'
        OR current_user IN ('postgres', 'leroirekton')
    );

CREATE POLICY products_admin_update ON products
    FOR UPDATE
    USING (
        current_setting('app.current_user_role', true) = 'ROLE_ADMIN'
        OR current_user IN ('postgres', 'leroirekton')
    );

CREATE POLICY products_admin_delete ON products
    FOR DELETE
    USING (
        current_setting('app.current_user_role', true) = 'ROLE_ADMIN'
        OR current_user IN ('postgres', 'leroirekton')
    );

-- ------------------------------------------------------------------------------
-- 4. TABLE : PRODUCT_IMAGES (Galerie Médias)
-- ------------------------------------------------------------------------------
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS product_images_public_read ON product_images;
DROP POLICY IF EXISTS product_images_admin_write ON product_images;

CREATE POLICY product_images_public_read ON product_images
    FOR SELECT
    USING (true);

CREATE POLICY product_images_admin_write ON product_images
    FOR ALL
    USING (
        current_setting('app.current_user_role', true) = 'ROLE_ADMIN'
        OR current_user IN ('postgres', 'leroirekton')
    );

-- ------------------------------------------------------------------------------
-- VÉRIFICATION DU STATUT RLS
-- ------------------------------------------------------------------------------
SELECT 
    schemaname, 
    tablename, 
    rowsecurity AS rls_active 
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
