# Estructura del Proyecto

Esta es la estructura organizada del proyecto React para el sistema de camping:

```
src/
├── assets/              # Imágenes, íconos y otros recursos estáticos
├── common/             # Componentes reutilizables y utilitarios
├── components/         # Componentes principales
│   ├── admin/         # Componentes de administración
│   ├── layout/        # Componentes de diseño de página
│   └── views/         # Páginas y vistas principales
│       ├── cabañas/   # Componentes relacionados con cabañas
│       ├── home/      # Componente de inicio
│       ├── pagoReserva/ # Componentes de pago y reserva
│       └── usuario/   # Componentes de usuario
├── context/           # Contextos y providers
├── hooks/            # Custom hooks
├── helpers/          # Funciones de utilidad
├── routes/           # Configuración de rutas
├── services/         # Servicios y lógica de negocio
└── index.css         # Estilos globales
```

## Estructura de Componentes

Cada componente debe seguir esta estructura:

```
component/
├── Component.jsx
├── Component.test.jsx
├── index.js      # Exportación del componente
└── styles.css    # Estilos específicos
```
