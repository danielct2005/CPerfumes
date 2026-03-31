# CPerfumes - Catálogo de Perfumes

Catálogo web Mobile-First de perfumes desarrollado con Next.js 14+ (App Router), Firebase y Tailwind CSS.

## Características

- 🛒 Carrito de compras con persistencia en localStorage
- 📱 Diseño Mobile-First
- 🔍 Filtros por categoría (Hombre, Mujer, Unisex)
- 💬 Checkout por WhatsApp
- 🔧 Panel de administración con CRUD completo
- 📸 Subida de imágenes a Firebase Storage
- 🖼️ Optimización de imágenes con Next.js Image

## Estructura de Carpetas

```
perfumeria/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx      # Dashboard admin con CRUD
│   │   │   └── page.tsx          # Login de admin
│   │   ├── globals.css           # Estilos globales
│   │   ├── layout.tsx            # Layout principal
│   │   ├── page.tsx              # Página principal
│   │   └── providers.tsx         # Providers de React
│   ├── components/
│   │   ├── CartButton.tsx         # Botón flotante del carrito
│   │   ├── FilterBar.tsx         # Barras de filtros
│   │   ├── Header.tsx             # Header con logo
│   │   ├── ProductCard.tsx        # Card de producto
│   │   └── ProductGrid.tsx        # Grid de productos
│   ├── context/
│   │   ├── cart-context.tsx       # Provider del carrito
│   │   └── cart-store.ts         # Zustand store con localStorage
│   ├── lib/
│   │   └── firebase.js           # Configuración de Firebase
│   └── types/
│       └── index.ts              # Tipos de TypeScript
├── public/
├── .env.local                    # Variables de entorno
├── firestore.rules               # Reglas de seguridad
├── next.config.js                # Config de Next.js
├── package.json
├── tailwind.config.js            # Config de Tailwind
└── tsconfig.json                 # Config de TypeScript
```

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/danielct2005/CPerfumes.git
cd CPerfumes
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Edita `.env.local` con tus credenciales de Firebase.

4. Ejecuta el servidor de desarrollo:
```bash
npm run dev
```

## Configuración de Firebase

### 1. Crea un proyecto en Firebase Console
- Ve a [Firebase Console](https://console.firebase.google.com/)
- Crea un nuevo proyecto

### 2. Habilita Firestore
- Ve a "Firestore Database" → "Create database"
- Selecciona la ubicación más cercana
- Inicia en modo de prueba (luego configura las reglas de seguridad)

### 3. Habilita Firebase Storage
- Ve a "Storage" → "Get started"
- Inicia en modo de prueba

### 4. Crea un usuario admin
- Ve a "Authentication" → "Add user"
- Crea un usuario con email: `admin@perfumeria.com`

### 5. Obtiene las credenciales
- Ve a "Project Settings" → "General"
- Copia la configuración y actualiza `.env.local`

## Variables de Entorno

```env
NEXT_PUBLIC_FIREBASE_API_KEY=tu_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=tu_app_id
NEXT_PUBLIC_WHATSAPP_NUMBER=+1234567890
```

## Despliegue en Vercel

1. Conecta tu repositorio a Vercel
2. Agrega las variables de entorno en Vercel Project Settings
3. Despliega

## Reglas de Seguridad Firestore

```firestore
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /perfumes/{perfumeId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.token.email == 'admin@perfumeria.com';
    }
  }
}
```

## Tecnologías

- [Next.js 14](https://nextjs.org/) - Framework React
- [Firebase](https://firebase.google.com/) - Backend
- [Tailwind CSS](https://tailwindcss.com/) - Estilos
- [Zustand](https://zustand-demo.pmnd.rs/) - Gestión de estado

## Licencia

MIT
