# FRAGANZZA - Tienda de Perfumes

E-commerce de perfumería premium construido con Next.js 14, Firebase y Cloudinary.

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| **Framework** | Next.js 14 (App Router) |
| **UI** | React 18, Tailwind CSS |
| **Lenguaje** | TypeScript |
| **Base de Datos** | Firebase Firestore |
| **Autenticación** | Firebase Auth |
| **Almacenamiento** | Cloudinary (imágenes) |
| **Estado** | Zustand (carrito persistente) |
| **Animaciones** | Framer Motion |

## 📁 Estructura del Proyecto

```
perfumeria/
├── src/
│   ├── app/                    # Rutas de Next.js (App Router)
│   │   ├── page.tsx            # Página principal (catálogo)
│   │   ├── product/[id]/       # Detalle del producto
│   │   ├── admin/              # Área de administración
│   │   │   ├── page.tsx        # Login
│   │   │   └── dashboard/      # Panel de gestión
│   │   └── layout.tsx          # Layout global
│   ├── components/             # Componentes reutilizables
│   │   ├── Header.tsx          # Encabezado
│   │   ├── Footer.tsx          # Pie de página
│   │   ├── ProductCard.tsx     # Tarjeta de producto
│   │   ├── ProductGrid.tsx     # Grilla de productos
│   │   ├── FilterBar.tsx       # Filtros de catálogo
│   │   ├── CartButton.tsx      # Botón flotante del carrito
│   │   └── Toast.tsx           # Notificaciones
│   ├── context/                # Estado global
│   │   ├── cart-context.tsx    # Provider del carrito
│   │   └── cart-store.ts       # Estado Zustand
│   ├── lib/                    # Utilidades
│   │   └── firebase.js         # Configuración Firebase
│   └── types/                  # Tipos TypeScript
│       └── index.ts            # Interfaces del dominio
├── public/                     # Archivos estáticos
├── next.config.js              # Configuración Next.js
├── tailwind.config.js          # Configuración Tailwind
├── tsconfig.json               # Configuración TypeScript
└── package.json                # Dependencias
```

## 🚀 Funcionalidades

### Catálogo Público
- **Filtros por categoría**: Hombre, Mujer, Unisex
- **Ordenamiento**: Precio menor a mayor, mayor a menor
- **Etiquetas**: Tendencias, Más Vendidos
- **Galería de imágenes**: Carrusel con múltiples fotos por producto
- **Optimización**: Imágenes redimensionadas via Cloudinary

### Carrito de Compras
- **Persistencia**: Estado guardado en localStorage (sobresive recargas)
- **Gestión**: Añadir, quitar, actualizar cantidades
- **Checkout**: Genera mensaje de pedido para WhatsApp

### Detalle del Producto
- **Carrusel**: Navegación entre múltiples imágenes
- **Notas olfativas**: Muestra las notas del perfume
- **Precio con oferta**: Descuento visual cuando hay promoción

### Panel de Administración
- **CRUD completo**: Crear, leer, actualizar, eliminar perfumes
- **Subida de imágenes**: Multiple selección, reorderable
- **Gestión de stock**: Activar/desactivar productos
- **Ofertas individuales**: Toggle para aplicar descuento
- **Ofertas masivas**: Aplicar % de descuento a todo el catálogo
- **Estado global**: Activar/desactivar todos los productos

## 🔧 Configuración

### Variables de Entorno (.env.local)

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id

# WhatsApp (para checkout)
NEXT_PUBLIC_WHATSAPP_NUMBER=+56912345678
```

### Colección Firestore: `perfumes`

```typescript
interface Perfume {
  id: string;                    // ID automático de Firestore
  name: string;                  // Nombre del perfume
  brand: string;                // Marca
  category: 'hombre' | 'mujer' | 'unisex';
  notes: string[];               // Notas olfativas
  price: number;                // Precio regular
  imageUrl: string;              // Imagen principal (URL)
  images?: string[];            // Galería de imágenes
  description?: string;        // Descripción opcional
  tags?: ('tendencias' | 'mas-vendidos')[];
  status?: boolean;             // true = en stock, false = sin stock
  discountPrice?: number;      // Precio con descuento
  isOnSale?: boolean;          // Está en oferta
  createdAt: number;           // Timestamp de creación
}
```

## 📦 Scripts

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build   # Construir para producción
npm run start   # Iniciar servidor de producción
npm run lint    # Verificar código
```

## 🎨 Decisiones de Diseño

- **Minimalismo**: Interfaz limpia, énfasis en el producto
- **Tipografía**: Fuentes sans-serif con tracking amplio
- **Colores**: Neutros (blanco, negro, gris) para destacar productos
- **UX**: Feedback visual con toasts animados al añadir al carrito
- **Responsive**: Diseño mobile-first, grid adaptativo

## 📱 Contacto

- **WhatsApp**: +56 9 5088 7666
- **Instagram**: @fraganzza.cl
- **Ubicación**: Los Álamos, Octava Región, Chile

---

© {new Date().getFullYear()} FRAGANZZA. Todos los derechos reservados.