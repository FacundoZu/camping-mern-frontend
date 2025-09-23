# 🏕️ Camping Municipal - Sistema de Reservas (Frontend)

Este proyecto corresponde al **frontend** del sistema de reservas de un camping municipal, desarrollado con **React** como parte del stack **MERN**.  
El objetivo principal es brindar una **plataforma sencilla, moderna e intuitiva** para que los usuarios puedan realizar reservas de cabañas, gestionar pagos y acceder a información sobre el camping.  

La aplicación también incluye una **interfaz de administración** para que el personal del camping pueda gestionar los recursos, reservas y usuarios.

tambien cuenta con pasarela de pago (Mercado Pago) para realizar pagos en línea.

---

## ✨ Funcionalidades

### 👤 Usuarios
- Registro e inicio de sesión de usuarios.
- Visualización de las cabañas disponibles.
- Selección de fechas en un calendario interactivo.
- Cálculo automático del precio según la cantidad de noches.
- Realización de reservas y proceso de pago.
- Historial de reservas.
- Sección de **preguntas frecuentes (FAQ)**.
- Sistema de comentarios y puntuación por cabaña (solo para usuarios con reservas finalizadas).

### 🏠 Cabañas
- Listado de todas las cabañas disponibles con imágenes, descripción y precios.
- Vista individual de cada cabaña.
- Información detallada de disponibilidad.
- Sección de reseñas y calificación con estrellas.

### 💳 Reservas y Pagos
- Selección de fechas y cantidad de huéspedes.
- Proceso de reserva con validación.
- Integración con pasarela de pagos (Mercado Pago).
- Confirmación de reserva con notificación al usuario (email).

### 🔑 Administrador
- Panel de administración con acceso restringido.
- CRUD de cabañas, eventos, FAQ y usuarios.
- Gestión de reservas.
- Estadísticas con gráficos (ej: reservas por mes, ocupación, etc.).

---

## 📂 Estructura del Proyecto

La organización del proyecto busca mantener un **código limpio, modular y escalable**:

```
src/
├── assets/              # Imágenes, íconos y otros recursos estáticos
├── common/              # Componentes reutilizables (botones, modales, inputs, etc.)
├── components/          # Componentes principales de la aplicación
│   ├── admin/           # Panel y componentes de administración
│   ├── layout/          # Componentes de diseño de página (Header, Footer, etc.)
│   └── views/           # Páginas y vistas principales
│       ├── cabañas/     # Vistas relacionadas con cabañas
│       ├── home/        # Página de inicio
│       ├── pagoReserva/ # Proceso de pago y confirmación de reservas
│       └── usuario/     # Perfil y vistas de usuario
├── context/             # Contextos globales (auth, reservas, etc.)
├── hooks/               # Custom hooks para lógica reutilizable
├── helpers/             # Funciones de utilidad (formateo de fechas, cálculos, etc.)
├── routes/              # Configuración de rutas con React Router
├── services/            # Conexión con la API (fetch/axios)
└── index.css            # Estilos globales
```
---

## 📦 Estructura de Componentes

Cada componente sigue esta convención para mantener consistencia:

```
component/
├── Component.jsx        # Lógica y JSX principal
├── Component.test.jsx   # Tests unitarios
├── index.js             # Exportación del componente
└── styles.css           # Estilos específicos del componente
```

---

## 🚀 Tecnologías Utilizadas

- **React** con Hooks y Context API.
- **React Router** para la navegación.
- **TailwindCSS** para los estilos.
- **Axios/Fetch** para consumo de API.
