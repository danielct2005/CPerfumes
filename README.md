Estoy trabajando en una tienda de perfumes llamada CPerfumes desarrollada con Next.js y Tailwind CSS. Necesito implementar las siguientes mejoras técnicas manteniendo la coherencia visual con la landing page principal (/).

Tareas a realizar:

Galería de Imágenes Dinámica:

Modifica el esquema del producto para aceptar un array de strings (URLs) en lugar de una sola imagen.

Implementa un componente de Carousel/Slider (puedes usar swiper o framer-motion) en la vista de detalle del producto que permita deslizar entre las fotos.

Unificación de UI (Dashboard Admin):

Rediseña las rutas /admin y /admin/dashboard para que utilicen los mismos componentes globales (Navbar, Footer, Tipografía y Paleta de colores) que la página principal.

Asegúrate de que el layout del panel de administración sea consistente con la estética de marca de la tienda.

Branding e Identidad:

Actualiza el Header y Footer para incluir el logotipo oficial y el nombre "CPerfumes".

Configura los metadatos de Next.js para que el nombre de la tienda aparezca correctamente en la pestaña del navegador.

Lógica de Filtros y Ordenamiento:

Crea una función de filtrado para la lista de productos que incluya:

Precio: Menor a Mayor / Precio: Mayor a Menor.

Etiquetas: Tendencias / Más Vendidos.

Asegúrate de que el estado de los filtros se maneje de forma eficiente (usando useState o parámetros de URL).
