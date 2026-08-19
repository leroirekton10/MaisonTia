import DOMPurify from "dompurify";

export interface ValidationResult<T = void> {
  isValid: boolean;
  errors: Record<string, string>;
  data?: T;
}

// -----------------------------------------------------------------------------
// 1. REGEX PATTERNS
// -----------------------------------------------------------------------------
export const PATTERNS = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^[+0-9\s().-]{6,30}$/,
  USERNAME: /^[a-zA-Z0-9._%+-@]{2,100}$/,
  PRICE: /^[0-9\s.,€$kK]+$/,
  URL: /^(https?:\/\/.+|\/assets\/.+|\/uploads\/.+|data:image\/.+)$/i,
};

// -----------------------------------------------------------------------------
// 2. SANITIZATION UTILITIES (DOMPurify + Strict Stripping)
// -----------------------------------------------------------------------------
export function sanitizeString(input: string | undefined | null): string {
  if (!input) return '';
  // 1. Run through DOMPurify to strip dangerous payloads
  const purified = typeof window !== 'undefined' ? DOMPurify.sanitize(input, { ALLOWED_TAGS: [] }) : input;
  // 2. Additional safety clean
  return purified
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/data:/gi, '')
    .trim();
}


// -----------------------------------------------------------------------------
// 3. FIELD-LEVEL VALIDATORS
// -----------------------------------------------------------------------------
export function validateEmail(email: string): string | null {
  const clean = sanitizeString(email);
  if (!clean) return "L'adresse email est obligatoire.";
  if (clean.length > 150) return "L'email ne doit pas dépasser 150 caractères.";
  if (!PATTERNS.EMAIL.test(clean)) return "Veuillez saisir une adresse email valide (ex: contact@domaine.com).";
  return null;
}

export function validatePhone(phone: string): string | null {
  const clean = sanitizeString(phone);
  if (!clean) return null; // Optional
  if (clean.length > 30) return "Le numéro de téléphone est trop long (max 30 caractères).";
  if (!PATTERNS.PHONE.test(clean)) return "Format de téléphone invalide (chiffres, +, espaces autorisés).";
  return null;
}

export function validateName(name: string, fieldLabel = "Le nom"): string | null {
  const clean = sanitizeString(name);
  if (!clean) return `${fieldLabel} est obligatoire.`;
  if (clean.length < 2) return `${fieldLabel} doit contenir au moins 2 caractères.`;
  if (clean.length > 100) return `${fieldLabel} ne peut pas dépasser 100 caractères.`;
  return null;
}

export function validateMessage(message: string): string | null {
  const clean = sanitizeString(message);
  if (!clean) return "Votre message ou description de projet est obligatoire.";
  if (clean.length < 10) return "Veuillez fournir un minimum de 10 caractères pour nous décrire votre demande.";
  if (clean.length > 3000) return "Votre message ne peut pas dépasser 3000 caractères.";
  return null;
}

export function validatePassword(password: string): string | null {
  if (!password) return "Le mot de passe est obligatoire.";
  if (password.length < 4) return "Le mot de passe doit comporter au moins 4 caractères.";
  if (password.length > 128) return "Le mot de passe ne doit pas dépasser 128 caractères.";
  return null;
}

// -----------------------------------------------------------------------------
// 4. FORM-LEVEL VALIDATORS
// -----------------------------------------------------------------------------
export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
}

export function validateContactForm(data: ContactFormData): ValidationResult<ContactFormData> {
  const errors: Record<string, string> = {};

  const nameError = validateName(data.name, "Le nom complet");
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(data.email);
  if (emailError) errors.email = emailError;

  if (data.phone) {
    const phoneError = validatePhone(data.phone);
    if (phoneError) errors.phone = phoneError;
  }

  const messageError = validateMessage(data.message);
  if (messageError) errors.message = messageError;

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: {
      name: sanitizeString(data.name),
      email: sanitizeString(data.email).toLowerCase(),
      phone: data.phone ? sanitizeString(data.phone) : undefined,
      service: sanitizeString(data.service) || 'Conseil & Essayage Général',
      message: sanitizeString(data.message),
    }
  };
}

export interface ProductFormData {
  name: string;
  category: string;
  price: string;
  description: string;
  featuredImage: string;
  diamondCarat?: string;
  craftsmanship?: string;
}

export function validateProductForm(data: Partial<ProductFormData>): ValidationResult<ProductFormData> {
  const errors: Record<string, string> = {};

  const cleanName = sanitizeString(data.name);
  if (!cleanName || cleanName.length < 2) {
    errors.name = "Le nom du bijou est obligatoire (min 2 caractères).";
  } else if (cleanName.length > 200) {
    errors.name = "Le nom ne doit pas dépasser 200 caractères.";
  }

  const cleanCategory = sanitizeString(data.category)?.toLowerCase();
  if (!cleanCategory || !['gold', 'silver'].includes(cleanCategory)) {
    errors.category = "Catégorie invalide. Choisissez 'Or & Diamant' ou 'Argent Beldi'.";
  }

  const cleanPrice = sanitizeString(data.price);
  if (!cleanPrice) {
    errors.price = "Le prix d'exception est obligatoire.";
  } else if (cleanPrice.length > 50) {
    errors.price = "Format de prix trop long.";
  }

  const cleanDesc = sanitizeString(data.description);
  if (!cleanDesc) {
    errors.description = "La description de la création est obligatoire.";
  } else if (cleanDesc.length > 2000) {
    errors.description = "La description ne doit pas dépasser 2000 caractères.";
  }

  const cleanImage = data.featuredImage?.trim();
  if (!cleanImage) {
    errors.featuredImage = "L'image principale est requise.";
  } else if (!PATTERNS.URL.test(cleanImage)) {
    errors.featuredImage = "Format d'URL d'image invalide (http, https, /assets/... ou fichier sélectionné).";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: {
      name: cleanName,
      category: cleanCategory || 'gold',
      price: cleanPrice,
      description: cleanDesc,
      featuredImage: cleanImage || '',
      diamondCarat: data.diamondCarat ? sanitizeString(data.diamondCarat) : undefined,
      craftsmanship: data.craftsmanship ? sanitizeString(data.craftsmanship) : undefined,
    }
  };
}

// -----------------------------------------------------------------------------
// 5. FILE UPLOAD VALIDATOR
// -----------------------------------------------------------------------------
export const ALLOWED_UPLOAD_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.mov'];
export const ALLOWED_UPLOAD_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime'
];
export const MAX_UPLOAD_SIZE = 50 * 1024 * 1024; // 50MB

export function validateUploadFile(file: File): string | null {
  if (!file) return "Aucun fichier sélectionné.";

  if (file.size > MAX_UPLOAD_SIZE) {
    return `Le fichier "${file.name}" est trop volumineux (${(file.size / 1024 / 1024).toFixed(1)} Mo). Limite : 50 Mo.`;
  }

  const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  if (!ALLOWED_UPLOAD_EXTENSIONS.includes(ext)) {
    return `Extension de fichier non autorisée (${ext}). Formats acceptés : JPG, PNG, WEBP, MP4, MOV.`;
  }

  if (file.type && !ALLOWED_UPLOAD_MIME_TYPES.includes(file.type.toLowerCase())) {
    return `Type MIME de fichier non autorisé (${file.type}).`;
  }

  return null;
}
