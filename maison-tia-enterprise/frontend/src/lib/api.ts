import axios from "axios";
import { MOCK_PRODUCTS, type Product } from "@/data/mockProducts";
import { sanitizeString } from "./validators";

const API_BASE = "/api";

const apiInstance = axios.create({
  baseURL: API_BASE,
  timeout: 5000,
});

apiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Key for persistent local products in local storage (Admin CRUD)
const LOCAL_STORAGE_PRODUCTS_KEY = 'maison_tia_custom_products';

export const getStoredProducts = (): Product[] => {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_PRODUCTS_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.warn("Erreur de lecture du stockage local produits:", e);
  }
  return MOCK_PRODUCTS;
};

export const saveStoredProducts = (products: Product[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_PRODUCTS_KEY, JSON.stringify(products));
  } catch (e) {
    console.warn("Erreur de sauvegarde des produits:", e);
  }
};

export const apiClient = {
  getProducts: async (): Promise<Product[]> => {
    try {
      const response = await apiInstance.get('/products');
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (err) {
      // Backend non disponible -> Utilisation du stockage local persistant
    }
    return getStoredProducts();
  },

  getProductById: async (id: string | number): Promise<Product | undefined> => {
    if (!id || id === 'undefined' || id === 'null') return undefined;
    try {
      const response = await apiInstance.get(`/products/${id}`);
      if (response.data) return response.data;
    } catch (err) {
      // Fallback local lookup
    }
    const list = getStoredProducts();
    return list.find(p => p.id === String(id));
  },

  createProduct: async (product: Partial<Product>): Promise<Product> => {
    const current = getStoredProducts();
    const newId = `prod-${Date.now()}`;
    const fullProduct: Product = {
      id: newId,
      name: sanitizeString(product.name) || 'Nouvelle Création',
      category: (sanitizeString(product.category) as any) || 'gold',
      categoryLabel: product.category === 'gold' ? 'Or & Diamant de Laboratoire' : 'Argent 925 & Argent Beldi',
      subCategory: product.subCategory || (product.category === 'gold' ? 'or-diamant' : 'argent-beldi'),
      price: sanitizeString(product.price) || '1 500 €',
      numericPrice: product.numericPrice || 1500,
      description: sanitizeString(product.description) || 'Description de la pièce d\'exception.',
      longDescription: sanitizeString(product.longDescription || product.description) || 'Description détaillée de la création Maison Tia.',
      materials: product.materials || ['Or 18K', 'Diamant de Laboratoire'],
      craftsmanship: sanitizeString(product.craftsmanship) || 'Façonné à la main par nos maîtres joailliers.',
      featuredImage: product.featuredImage || '/assets/instagram/photo acceuil 1.jpg',
      gallery: product.gallery || [product.featuredImage || '/assets/instagram/photo acceuil 1.jpg'],
      diamondCarat: sanitizeString(product.diamondCarat),
      diamondCut: sanitizeString(product.diamondCut),
      origin: sanitizeString(product.origin) || 'Fait Main au Maroc / Ateliers'
    };

    const updated = [fullProduct, ...current];
    saveStoredProducts(updated);

    try {
      await apiInstance.post('/products', {
        name: fullProduct.name,
        category: fullProduct.category,
        price: fullProduct.price,
        description: fullProduct.description,
        featuredImage: fullProduct.featuredImage,
        images: fullProduct.gallery
      });
    } catch (e) {
      // Silent local fallback
    }
    return fullProduct;
  },

  updateProduct: async (id: string | number, data: Partial<Product>): Promise<Product | null> => {
    if (!id || id === 'undefined') return null;
    const current = getStoredProducts();
    const index = current.findIndex(p => p.id === String(id));
    if (index !== -1) {
      current[index] = { ...current[index], ...data };
      saveStoredProducts(current);
      try {
        await apiInstance.put(`/products/${id}`, data);
      } catch (e) {}
      return current[index];
    }
    return null;
  },

  deleteProduct: async (id: string | number): Promise<boolean> => {
    if (!id || id === 'undefined') return false;
    const current = getStoredProducts();
    const filtered = current.filter(p => p.id !== String(id));
    saveStoredProducts(filtered);
    try {
      await apiInstance.delete(`/products/${id}`);
    } catch (e) {}
    return true;
  },

  submitPublicRequest: async (requestData: {
    customerName: string;
    email: string;
    phone?: string;
    message: string;
    requestedService?: string;
  }) => {
    try {
      const response = await apiInstance.post('/admin/requests/submit', requestData);
      return response.data;
    } catch (err: any) {
      // Fallback local storage for offline resilience
      apiClient.saveAdminRequest({
        clientName: requestData.customerName,
        email: requestData.email,
        phone: requestData.phone,
        service: requestData.requestedService,
        notes: requestData.message
      });
      return { status: 'SUCCESS', localFallback: true };
    }
  },

  getAdminRequests: async () => {
    try {
      const response = await apiInstance.get('/admin/requests');
      return response.data;
    } catch (err) {
      const savedRequests = localStorage.getItem('maison_tia_requests');
      if (savedRequests) {
        return JSON.parse(savedRequests);
      }
      const initial = [
        { id: 101, clientName: 'Sophie de Valois', email: 'sophie@valois-paris.fr', phone: '+33 6 12 34 56 78', service: 'Consultation Sur-Mesure Diamant de Labo', date: '2026-08-05', status: 'EN_ATTENTE', notes: 'Recherche solitaire 1.5 carat.' },
        { id: 102, clientName: 'Karim El Mansouri', email: 'k.mansouri@atlas-luxe.ma', phone: '+212 6 61 23 45 67', service: 'Commande Spéciale Manchette Beldi', date: '2026-08-06', status: 'CONFIRME', notes: 'Gravure personnalisée au marteau.' },
        { id: 103, clientName: 'Elena Rostova', email: 'elena@rostova.com', phone: '+33 7 98 76 54 32', service: 'Essayage Privé Solitaire Céleste', date: '2026-08-08', status: 'EN_ATTENTE', notes: 'Essayage au salon Paris.' }
      ];
      localStorage.setItem('maison_tia_requests', JSON.stringify(initial));
      return initial;
    }
  },

  saveAdminRequest: (request: any) => {
    try {
      const existing = localStorage.getItem('maison_tia_requests');
      const list = existing ? JSON.parse(existing) : [];
      const newReq = { id: Date.now(), ...request, date: new Date().toISOString().split('T')[0], status: 'EN_ATTENTE' };
      localStorage.setItem('maison_tia_requests', JSON.stringify([newReq, ...list]));
      return newReq;
    } catch (e) {
      return null;
    }
  },

  updateRequestStatus: (id: number, status: string) => {
    try {
      const existing = localStorage.getItem('maison_tia_requests');
      if (existing) {
        const list = JSON.parse(existing);
        const item = list.find((r: any) => r.id === id);
        if (item) {
          item.status = status;
          localStorage.setItem('maison_tia_requests', JSON.stringify(list));
        }
      }
      apiInstance.patch(`/admin/requests/${id}/status`, { status }).catch(() => {});
    } catch (e) {}
  }
};

