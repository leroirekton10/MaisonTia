import React from 'react';

interface LegalNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LegalNoticeModal({ isOpen, onClose }: LegalNoticeModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[140] bg-[#030303]/95 backdrop-blur-2xl flex items-center justify-center p-6 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-3xl w-full luxury-glass border-[#D4AF37]/40 p-8 sm:p-12 cursor-default max-h-[85vh] overflow-y-auto rounded-none text-left"
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#FDFBF7]/60 hover:text-[#D4AF37] text-2xl font-light"
        >
          ✕
        </button>

        <span className="text-[9px] uppercase tracking-[0.35em] text-[#D4AF37] font-semibold block mb-2">
          Mentions Légales &amp; Protection Juridique
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#FDFBF7] mb-8 font-light">
          Droits d'Auteur &amp; <span className="gold-gradient-text italic font-serif">Propriété Intellectuelle</span>
        </h2>

        <div className="space-y-6 text-xs text-[#FDFBF7]/80 font-light leading-relaxed">
          <div className="p-4 luxury-glass border-[#D4AF37]/30 bg-[#030303]/80">
            <h3 className="font-serif text-base text-[#D4AF37] mb-2 font-medium">1. Protection de la Marque &amp; Modèles Déposés</h3>
            <p>
              L’ensemble du site <strong>maisontia.com</strong>, incluant la structure, la direction artistique, les photographies, vidéos, textes, créations de joaillerie en Or, Diamants de laboratoire et Argent Beldi, ainsi que la marque <strong>MAISON TIA</strong>, constitue une œuvre protégée par les lois en vigueur sur la propriété intellectuelle.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base text-[#D4AF37] mb-2 font-medium">2. Clause Pénale contre le Vol de Contenu &amp; la Contrefaçon</h3>
            <p>
              Toute reproduction, représentation, extraction, modification ou exploitation non autorisée, totale ou partielle, par quelque procédé que ce soit, de l’un des éléments du site est strictement interdite. Conformément aux articles L.335-2 et suivants du Code de la Propriété Intellectuelle, toute contrefaçon constitue un délit pénal passible de poursuites judiciaires immédiates et de demandes de dommages et intérêts.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base text-[#D4AF37] mb-2 font-medium">3. Éditeur du Site &amp; Hébergement Independants</h3>
            <p>
              Le site <strong>maisontia.com</strong> est édité sous le contrôle exclusif de la Maison Tia.<br />
              <strong>Nom de domaine :</strong> maisontia.com (Réservé chez OVH SAS).<br />
              <strong>Serveurs de Sécurité :</strong> Infrastructure autonome sécurisée avec chiffrement SSL/TLS 256 bits et protection contre les attaques par déni de service (DDoS).
            </p>
          </div>

          <div>
            <h3 className="font-serif text-base text-[#D4AF37] mb-2 font-medium">4. Protection des Données Personnelles (RGPD)</h3>
            <p>
              Les informations collectées lors des demandes de consultation privée sont strictement destinées au service de conciergerie de la Maison Tia. Aucune donnée n'est cédée ni vendue à des tiers.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-[#D4AF37]/20 flex justify-between items-center text-[10px] text-[#FDFBF7]/50">
          <span>© 2026 Maison Tia. Tous droits réservés.</span>
          <button
            onClick={onClose}
            className="luxury-btn-gold text-[9px] py-2 px-6"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}
