# Maison Tia Enterprise - Technical Blueprint 💎

## 🎯 Objective
To elevate Maison Tia to a global luxury brand by building a high-performance, scalable SaaS platform that blends cinematic storytelling with enterprise reliability.

## 🛠️ The Stack
| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Backend** | Java 21 + Spring Boot 3.3 | Enterprise stability, Type safety, High throughput |
| **Database** | PostgreSQL | Reliable relational storage for luxury catalog |
| **Frontend** | React 19 + Vite | Sub-second load times, Modern UX |
| **Animation** | GSAP + Lenis | "Apple-standard" cinematic movement |
| **Styling** | Tailwind CSS v4 | Ultra-fast, utility-first luxurious UI |
| **State** | Zustand | Lean state management for products & auth |

## 📐 API Design (REST)
`GET /api/products` - Fetch all luxury pieces.
`GET /api/products/{id}` - Detailed view of a piece.
`POST /api/products` - Add new creation (Admin).
`PUT /api/products/{id}` - Update pricing or assets (Admin).
`DELETE /api/products/{id}` - Archive a piece (Admin).

## 🎞️ Cinematic Migration Plan
We are porting the prototype components into this enterprise structure:
1. **FrameScrubber**: Move to `/src/components/cinematic/` $\rightarrow$ Connect to Backend asset URLs.
2. **DualUniverse**: Move to `/src/components/cinematic/` $\rightarrow$ Wire it to Product IDs from API.
3. **SavoirFaire**: Implement as a dynamic storytelling section based on DB content.

## 🔐 Enterprise Security
- **JWT Auth**: Protecting the Admin Dashboard.
- **CORS Policy**: Strict origin control between React and Spring Boot.
- **Asset Optimization**: Cloudinary/AWS S3 integration for 4K images to avoid server lag.
