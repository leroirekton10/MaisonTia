import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient, getStoredProducts, saveStoredProducts } from '@/lib/api';
import { type Product, INSTAGRAM_MEDIA } from '@/data/mockProducts';
import { validateProductForm, validateUploadFile, sanitizeString } from '@/lib/validators';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'upload' | 'leads' | 'cms'>('inventory');

  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const [productFormErrors, setProductFormErrors] = useState<Record<string, string>>({});

  // Upload State
  const [uploadedFiles, setUploadedFiles] = useState<{ id: string; name: string; url: string; type: 'image' | 'video' }[]>([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadError, setUploadError] = useState('');

  // Protect Admin Session — validate JWT token exists and session is not expired
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const sessionRaw = localStorage.getItem('adminSession');

    let isValid = false;

    if (token && token.length > 20) {
      // Basic JWT format check: three base64 segments separated by dots
      const jwtParts = token.split('.');
      if (jwtParts.length === 3) {
        // Check session expiry
        if (sessionRaw) {
          try {
            const session = JSON.parse(sessionRaw);
            if (session.expiresAt && Date.now() < session.expiresAt) {
              isValid = true;
            }
          } catch (e) {
            // Invalid session data
          }
        } else {
          // No session data but valid JWT format — allow (server will validate)
          isValid = true;
        }
      }
    }

    if (!isValid) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminSession');
      navigate('/secret-vault-admin');
    } else {
      setAuthenticated(true);
      loadData();
    }
  }, [navigate]);

  const loadData = async () => {
    const list = getStoredProducts();
    setProducts(list);
    const reqs = await apiClient.getAdminRequests();
    setRequests(reqs);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminEmail');
    navigate('/secret-vault-admin');
  };

  // Product CRUD with Zero-Trust Validation
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setProductFormErrors({});

    const validation = validateProductForm({
      name: editingProduct.name,
      category: editingProduct.category,
      price: editingProduct.price,
      description: editingProduct.description,
      featuredImage: editingProduct.featuredImage,
      diamondCarat: editingProduct.diamondCarat,
      craftsmanship: editingProduct.craftsmanship,
    });

    if (!validation.isValid) {
      setProductFormErrors(validation.errors);
      return;
    }

    const sanitizedData: Partial<Product> = {
      ...editingProduct,
      ...validation.data,
      category: (validation.data!.category as 'gold' | 'silver') || 'gold',
      gallery: editingProduct.gallery && editingProduct.gallery.length > 0
        ? editingProduct.gallery
        : [validation.data!.featuredImage]
    };

    if (editingProduct.id) {
      // Update
      await apiClient.updateProduct(editingProduct.id, sanitizedData);
    } else {
      // Create
      await apiClient.createProduct(sanitizedData);
    }

    setEditingProduct(null);
    setIsNewProductModalOpen(false);
    setProductFormErrors({});
    loadData();
  };

  const handleDeleteProduct = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette création de la vitrine ?")) {
      await apiClient.deleteProduct(id);
      loadData();
    }
  };

  // File Upload Handler (with MIME, extension, size validation)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploadError('');
    setUploadStatus("Téléversement et vérification des fichiers en cours...");

    const fileList = Array.from(files);
    for (const file of fileList) {
      const err = validateUploadFile(file);
      if (err) {
        setUploadError(err);
        setUploadStatus('');
        return;
      }
    }

    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileUrl = event.target?.result as string;
        const isVideo = file.type.startsWith('video/');

        const newMediaItem = {
          id: `upload-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: sanitizeString(file.name),
          url: fileUrl,
          type: isVideo ? ('video' as const) : ('image' as const)
        };

        setUploadedFiles((prev) => [newMediaItem, ...prev]);
        setUploadStatus(`Fichier "${file.name}" vérifié et téléversé avec succès !`);
      };
      reader.readAsDataURL(file);
    });
  };

  // Status Change for Consultations
  const handleStatusChange = (id: number, newStatus: string) => {
    const cleanStatus = sanitizeString(newStatus).toUpperCase();
    apiClient.updateRequestStatus(id, cleanStatus);
    apiClient.getAdminRequests().then((reqs) => setRequests(reqs));
  };


  if (!authenticated) return null;

  return (
    <main className="min-h-screen bg-[#030303] text-[#FDFBF7] py-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Admin Bar Header */}
        <div className="luxury-glass border-[#D4AF37]/30 p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
                Portail d'Administration Secret Défense • admin@maisontia.com
              </span>
            </div>
            <h1 className="font-serif text-3xl font-light text-[#FDFBF7]">
              Panneau de Contrôle <span className="gold-gradient-text italic font-serif">Maison Tia SaaS</span>
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/"
              target="_blank"
              className="luxury-btn-outline text-[10px] py-2.5 px-5"
            >
              Voir le Site Public ↗
            </Link>

            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-red-950/40 border border-red-500/40 text-red-300 text-[10px] uppercase tracking-[0.2em] hover:bg-red-900/60 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex flex-wrap gap-3 mb-8 border-b border-[#D4AF37]/20 pb-4">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`text-[11px] uppercase tracking-[0.25em] font-medium py-3 px-6 transition-all ${
              activeTab === 'inventory'
                ? 'luxury-btn-gold text-[#030303]'
                : 'luxury-btn-outline text-[#FDFBF7]/70'
            }`}
          >
            Gestion des Produits ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`text-[11px] uppercase tracking-[0.25em] font-medium py-3 px-6 transition-all ${
              activeTab === 'upload'
                ? 'luxury-btn-gold text-[#030303]'
                : 'luxury-btn-outline text-[#FDFBF7]/70'
            }`}
          >
            Téléversement Photos &amp; Vidéos
          </button>
          <button
            onClick={() => setActiveTab('leads')}
            className={`text-[11px] uppercase tracking-[0.25em] font-medium py-3 px-6 transition-all ${
              activeTab === 'leads'
                ? 'luxury-btn-gold text-[#030303]'
                : 'luxury-btn-outline text-[#FDFBF7]/70'
            }`}
          >
            Rendez-vous &amp; Commandes ({requests.length})
          </button>
        </div>

        {/* TAB 1: INVENTORY & PRODUCT CRUD */}
        {activeTab === 'inventory' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl text-[#FDFBF7]">Catalogue des Créations d'Exception</h2>
              <button
                onClick={() => {
                  setEditingProduct({
                    name: '',
                    category: 'gold',
                    price: '2 500 €',
                    numericPrice: 2500,
                    description: '',
                    materials: ['Or 18K', 'Diamant de Laboratoire'],
                    featuredImage: '/assets/instagram/photo acceuil 1.jpg'
                  });
                  setIsNewProductModalOpen(true);
                }}
                className="luxury-btn-gold text-[10px] py-3 px-6"
              >
                + Ajouter une Nouvelle Création
              </button>
            </div>

            <div className="luxury-glass border-[#D4AF37]/20 p-6 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="text-[10px] uppercase tracking-wider text-[#D4AF37] border-b border-[#D4AF37]/20">
                  <tr>
                    <th className="py-4 px-4">Création</th>
                    <th className="py-4 px-4">Univers</th>
                    <th className="py-4 px-4">Prix</th>
                    <th className="py-4 px-4">Diamant / Métal</th>
                    <th className="py-4 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/10 text-[#FDFBF7]/85">
                  {products.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-4 px-4 font-serif text-base text-[#FDFBF7] flex items-center gap-3">
                        <img src={item.featuredImage} alt={item.name} className="w-12 h-12 object-cover border border-[#D4AF37]/30" />
                        <div>
                          <span className="block font-medium">{item.name}</span>
                          <span className="text-[10px] text-[#FDFBF7]/50 block">{item.id}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-semibold text-[#D4AF37]">
                        {item.category === 'gold' ? 'Or & Diamant de Labo' : 'Argent 925 & Beldi'}
                      </td>
                      <td className="py-4 px-4 font-serif text-sm text-[#FFF6D6]">{item.price}</td>
                      <td className="py-4 px-4 italic">{item.diamondCarat || item.origin || 'Fait main'}</td>
                      <td className="py-4 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingProduct(item);
                            setIsNewProductModalOpen(true);
                          }}
                          className="px-3 py-1.5 luxury-glass text-[#D4AF37] border-[#D4AF37]/40 text-[9px] uppercase tracking-wider hover:bg-[#D4AF37] hover:text-[#030303]"
                        >
                          Éditer
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(item.id)}
                          className="px-3 py-1.5 bg-red-950/40 text-red-300 border border-red-500/30 text-[9px] uppercase tracking-wider hover:bg-red-900"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MEDIA UPLOADER (ORDI & TELEPHONE) */}
        {activeTab === 'upload' && (
          <div className="space-y-8">
            <div className="luxury-glass border-[#D4AF37]/30 p-8 sm:p-12 text-center">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold block mb-2">
                Téléversement Direct Ordinateur / Mobile
              </span>
              <h2 className="font-serif text-3xl text-[#FDFBF7] mb-4">
                Importer des Photos ou Vidéos pour le Site
              </h2>
              <p className="max-w-md mx-auto text-xs text-[#FDFBF7]/70 font-light leading-relaxed mb-8">
                Sélectionnez vos médias depuis votre ordinateur ou appareil mobile. Vous pourrez les utiliser instantanément pour vos créations, la vidéo Hero ou la grille Instagram.
              </p>

              {/* Upload Drop Zone */}
              <label className="luxury-glass border-2 border-dashed border-[#D4AF37]/50 hover:border-[#D4AF37] p-10 block cursor-pointer transition-all max-w-xl mx-auto">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="text-4xl text-[#D4AF37] mb-3">📁</div>
                <span className="font-serif text-lg text-[#FDFBF7] block mb-1">
                  Cliquez ici pour choisir vos fichiers
                </span>
                <span className="text-xs text-[#FDFBF7]/60 block">
                  Formats acceptés : JPG, PNG, WEBP, MP4, MOV (depuis PC ou Smartphone)
                </span>
              </label>

              {uploadError && (
                <div className="mt-4 p-3 bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-semibold max-w-xl mx-auto animate-pulse">
                  ⚠️ {uploadError}
                </div>
              )}

              {uploadStatus && !uploadError && (
                <div className="mt-4 text-xs text-[#D4AF37] font-semibold animate-pulse">
                  {uploadStatus}
                </div>
              )}
            </div>

            {/* Uploaded Gallery Preview */}
            {uploadedFiles.length > 0 && (
              <div className="luxury-glass border-[#D4AF37]/20 p-6">
                <h3 className="font-serif text-xl text-[#FDFBF7] mb-6">
                  Médias Téléversés dans la Session ({uploadedFiles.length})
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                  {uploadedFiles.map((file) => (
                    <div key={file.id} className="relative group luxury-glass border-[#D4AF37]/30 p-2 overflow-hidden">
                      <div className="h-40 w-full overflow-hidden bg-black mb-2">
                        {file.type === 'video' ? (
                          <video src={file.url} controls className="w-full h-full object-cover" />
                        ) : (
                          <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
                        )}
                      </div>

                      <span className="text-[10px] text-[#FDFBF7]/70 truncate block mb-2">{file.name}</span>

                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(file.url);
                          alert("URL du média copiée dans le presse-papier !");
                        }}
                        className="luxury-btn-gold text-[8px] py-1.5 px-3 w-full text-center"
                      >
                        Copier Lien Média
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LEADS & APPOINTMENTS */}
        {activeTab === 'leads' && (
          <div className="luxury-glass border-[#D4AF37]/20 p-6">
            <h2 className="font-serif text-2xl text-[#FDFBF7] mb-6">Demandes de Consultations Privées &amp; Commandes</h2>

            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="p-6 border border-[#D4AF37]/20 bg-[#030303]/80 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold">
                        {req.service}
                      </span>
                      <span className={`px-2.5 py-0.5 text-[8px] uppercase tracking-wider font-bold ${
                        req.status === 'CONFIRME' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-[#D4AF37]/20 text-[#FFF6D6] border border-[#D4AF37]/30'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl text-[#FDFBF7]">{req.clientName}</h3>
                    <p className="text-xs text-[#FDFBF7]/70">
                      📧 {req.email} • 📞 {req.phone || 'Non renseigné'} • Date : {req.date}
                    </p>
                    {req.notes && (
                      <p className="text-xs italic text-[#D4AF37] pt-1">"{req.notes}"</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStatusChange(req.id, 'CONFIRME')}
                      className="luxury-btn-gold text-[9px] py-2.5 px-4"
                    >
                      Confirmer le RDV
                    </button>
                    <button
                      onClick={() => handleStatusChange(req.id, 'PLANIFIE')}
                      className="luxury-btn-outline text-[9px] py-2.5 px-4"
                    >
                      Marquer Planifié
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isNewProductModalOpen && editingProduct && (
        <div
          onClick={() => setIsNewProductModalOpen(false)}
          className="fixed inset-0 z-[150] bg-[#030303]/95 backdrop-blur-2xl flex items-center justify-center p-6 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full luxury-glass border-[#D4AF37]/40 p-8 sm:p-10 cursor-default max-h-[90vh] overflow-y-auto"
          >
            <button
              onClick={() => setIsNewProductModalOpen(false)}
              className="absolute top-4 right-4 text-[#FDFBF7]/60 hover:text-[#D4AF37] text-2xl"
            >
              ✕
            </button>

            <h2 className="font-serif text-3xl text-[#FDFBF7] mb-6">
              {editingProduct.id ? 'Éditer la Création' : 'Ajouter une Nouvelle Création'}
            </h2>

            <form onSubmit={handleSaveProduct} className="space-y-5 text-left text-xs" noValidate>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] uppercase tracking-wider text-[#D4AF37]">Nom du Bijou *</label>
                  {productFormErrors.name && (
                    <span className="text-[9px] text-red-400 font-semibold">{productFormErrors.name}</span>
                  )}
                </div>
                <input
                  required
                  type="text"
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className={`w-full bg-[#030303] border-b py-2 px-3 text-[#FDFBF7] outline-none ${
                    productFormErrors.name ? 'border-red-500' : 'border-[#D4AF37]/30 focus:border-[#D4AF37]'
                  }`}
                  placeholder="ex: Solitaire Céleste"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#D4AF37] mb-1">Axe &amp; Univers *</label>
                  <select
                    value={editingProduct.category || 'gold'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                    className="w-full bg-[#030303] border-b border-[#D4AF37]/30 py-2 px-3 text-[#FDFBF7] focus:border-[#D4AF37] outline-none"
                  >
                    <option value="gold">Or &amp; Diamant de Laboratoire</option>
                    <option value="silver">Argent 925 &amp; Argent Beldi</option>
                  </select>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[10px] uppercase tracking-wider text-[#D4AF37]">Prix d'Exception *</label>
                    {productFormErrors.price && (
                      <span className="text-[9px] text-red-400 font-semibold">{productFormErrors.price}</span>
                    )}
                  </div>
                  <input
                    required
                    type="text"
                    value={editingProduct.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className={`w-full bg-[#030303] border-b py-2 px-3 text-[#FDFBF7] outline-none ${
                      productFormErrors.price ? 'border-red-500' : 'border-[#D4AF37]/30 focus:border-[#D4AF37]'
                    }`}
                    placeholder="ex: 2 850 €"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] uppercase tracking-wider text-[#D4AF37]">Description Synthétique *</label>
                  {productFormErrors.description && (
                    <span className="text-[9px] text-red-400 font-semibold">{productFormErrors.description}</span>
                  )}
                </div>
                <textarea
                  required
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className={`w-full bg-[#030303] border-b py-2 px-3 text-[#FDFBF7] outline-none resize-none ${
                    productFormErrors.description ? 'border-red-500' : 'border-[#D4AF37]/30 focus:border-[#D4AF37]'
                  }`}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] uppercase tracking-wider text-[#D4AF37]">Image Principale de la Création *</label>
                  {productFormErrors.featuredImage && (
                    <span className="text-[9px] text-red-400 font-semibold">{productFormErrors.featuredImage}</span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <input
                    required
                    type="text"
                    value={editingProduct.featuredImage || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, featuredImage: e.target.value })}
                    className={`flex-1 bg-[#030303] border-b py-2 px-3 text-[#FDFBF7] outline-none ${
                      productFormErrors.featuredImage ? 'border-red-500' : 'border-[#D4AF37]/30 focus:border-[#D4AF37]'
                    }`}
                    placeholder="/assets/instagram/photo acceuil 1.jpg ou URL"
                  />
                  <label className="luxury-btn-gold text-[9px] py-2 px-4 cursor-pointer flex items-center justify-center gap-1.5 shrink-0">
                    <span>📂 Parcourir (Browse)</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && editingProduct) {
                          const uploadErr = validateUploadFile(file);
                          if (uploadErr) {
                            alert(uploadErr);
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            const dataUrl = evt.target?.result as string;
                            setEditingProduct({
                              ...editingProduct,
                              featuredImage: dataUrl,
                              gallery: editingProduct.gallery && editingProduct.gallery.length > 0
                                ? [dataUrl, ...editingProduct.gallery.slice(1)]
                                : [dataUrl]
                            });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
                {editingProduct.featuredImage && (
                  <div className="mt-3 flex items-center gap-3 p-2 luxury-glass border-[#D4AF37]/20">
                    <img
                      src={editingProduct.featuredImage}
                      alt="Aperçu"
                      className="w-14 h-14 object-cover border border-[#D4AF37]/40"
                    />
                    <span className="text-[10px] text-emerald-400 font-semibold">✓ Aperçu Image Sélectionnée</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#D4AF37] mb-1">Galerie d'Images Complémentaires</label>
                <div className="flex items-center gap-3 mb-2">
                  <label className="luxury-btn-outline text-[9px] py-2 px-4 cursor-pointer flex items-center gap-2">
                    <span>📂 Parcourir Fichiers Galerie (Browse Multiple)</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files && files.length > 0 && editingProduct) {
                          const newImages: string[] = [];
                          let processed = 0;
                          const fileArr = Array.from(files);
                          for (const f of fileArr) {
                            const err = validateUploadFile(f);
                            if (err) {
                              alert(err);
                              return;
                            }
                          }
                          fileArr.forEach((f) => {
                            const reader = new FileReader();
                            reader.onload = (evt) => {
                              const dataUrl = evt.target?.result as string;
                              newImages.push(dataUrl);
                              processed++;
                              if (processed === fileArr.length) {
                                setEditingProduct({
                                  ...editingProduct,
                                  gallery: [...(editingProduct.gallery || []), ...newImages]
                                });
                              }
                            };
                            reader.readAsDataURL(f);
                          });
                        }
                      }}
                    />
                  </label>
                </div>
                {editingProduct.gallery && editingProduct.gallery.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto p-2 luxury-glass border-[#D4AF37]/20">
                    {editingProduct.gallery.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt={`Galerie ${idx}`} className="w-12 h-12 object-cover border border-[#D4AF37]/30" />
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = (editingProduct.gallery || []).filter((_, i) => i !== idx);
                            setEditingProduct({ ...editingProduct, gallery: filtered });
                          }}
                          className="absolute top-0 right-0 bg-red-900 text-white text-[8px] px-1 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#D4AF37] mb-1">Diamant Carat (Optionnel)</label>
                  <input
                    type="text"
                    value={editingProduct.diamondCarat || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, diamondCarat: e.target.value })}
                    className="w-full bg-[#030303] border-b border-[#D4AF37]/30 py-2 px-3 text-[#FDFBF7] focus:border-[#D4AF37] outline-none"
                    placeholder="ex: 1.20 ct"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#D4AF37] mb-1">Savoir-faire / Origine</label>
                  <input
                    type="text"
                    value={editingProduct.craftsmanship || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, craftsmanship: e.target.value })}
                    className="w-full bg-[#030303] border-b border-[#D4AF37]/30 py-2 px-3 text-[#FDFBF7] focus:border-[#D4AF37] outline-none"
                    placeholder="ex: Fait main au Maroc"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="submit"
                  className="luxury-btn-gold text-[10px] py-3.5 px-6 flex-1"
                >
                  Enregistrer la Création
                </button>
                <button
                  type="button"
                  onClick={() => setIsNewProductModalOpen(false)}
                  className="luxury-btn-outline text-[10px] py-3.5 px-6"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
