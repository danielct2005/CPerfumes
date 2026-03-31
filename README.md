# CPerfumes
Catalogo Tienda Perfumes
"Necesito desarrollar un catálogo web de perfumes 'Mobile-First' utilizando Next.js (App Router). El sitio es para una tienda que vende por Instagram. Los clientes deben poder ver productos, añadirlos a un carrito local y finalizar la compra enviando un mensaje detallado por WhatsApp al vendedor. No se requiere pasarela de pago ni login de clientes."

Stack Tecnológico:

Framework: Next.js 14+ (App Router).

Estilos: Tailwind CSS.

Base de Datos / Storage: Firebase (Firestore para la data y Firebase Storage para las fotos).

Despliegue: Vercel.

Estado: React Context o Zustand para el carrito de compras.

Estructura y Funcionalidades Requeridas:

Página Principal (/):

Header con logo y botón flotante de carrito con contador.

Sección de filtros rápidos por categorías (Hombre, Mujer, Unisex, Notas Olfativas).

Grid de productos con carga diferida (Lazy Loading). Cada card debe mostrar: Imagen, Nombre, Notas, Precio y botón 'Añadir al carrito'.

Lógica de Carrito:

Persistencia en localStorage.

Al hacer clic en 'Finalizar Pedido', debe abrir un enlace de WhatsApp (wa.me) con un mensaje formateado: "Hola, me interesan estos perfumes: [Lista de Productos con Cantidades] - Total: [Suma Total]".

Panel de Administración (/admin):

Ruta protegida por un middleware simple o un check de Auth de Firebase.

CRUD completo: Formulario para subir nuevos perfumes.

Importante: El input de imagen debe subir el archivo a Firebase Storage y guardar la URL resultante en el documento de Firestore.

Instrucciones Técnicas de Precaución:

Optimización: Usa el componente <Image /> de Next.js para todas las fotos de los perfumes.

Firebase Setup: Genera un archivo lib/firebase.js para la configuración y exporta las instancias de db, storage y auth.

Seguridad: Incluye un ejemplo de las firestore.rules para permitir lectura pública y escritura solo a usuarios autenticados.

Variables de Entorno: Utiliza .env.local para todas las credenciales de Firebase.

Entregable:
"Proporcióname la estructura de carpetas sugerida, el código para el Contexto del Carrito, el componente de la Card de Producto, y la lógica de envío a WhatsApp."
