# TodoCompra API

Una API RESTful completa para un eCommerce construida con Node.js, Express, TypeScript y Prisma con MongoDB Atlas.

## 🚀 Características

- **CRUD completo** para productos, categorías, usuarios y órdenes
- **Base de datos MongoDB Atlas** con Prisma ORM
- **TypeScript** para type safety
- **Paginación** y filtros avanzados
- **Validaciones** y manejo de errores
- **Arquitectura limpia** con separación de responsabilidades

## 📁 Estructura del Proyecto

```
server/
├── source/
│   ├── controllers/     # Lógica de negocio CRUD
│   │   ├── productoController.ts
│   │   ├── categoriaController.ts
│   │   ├── usuarioController.ts
│   │   └── ordenController.ts
│   ├── routes/          # Definición de rutas
│   │   ├── productoRoutes.ts
│   │   ├── categoriaRoutes.ts
│   │   ├── usuarioRoutes.ts
│   │   ├── ordenRoutes.ts
│   │   └── index.ts
│   ├── database.ts      # Conexión Prisma
│   └── index.ts         # Servidor principal
├── prisma/
│   ├── schema.prisma    # Esquema de base de datos
│   └── config.ts        # Configuración Prisma
├── .env.example         # Variables de entorno ejemplo
├── .gitignore           # Archivos ignorados por Git
└── package.json         # Dependencias y scripts
```

## 🔧 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd TodoCompra-1/server
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
   Editar `.env` con tus credenciales de MongoDB Atlas.

4. **Generar cliente Prisma**
   ```bash
   npx prisma generate
   ```

5. **Aplicar esquema a la base de datos**
   ```bash
   npx prisma db push
   ```

6. **Iniciar servidor**
   ```bash
   npm run dev
   ```

## 🗄️ Base de Datos

El proyecto usa **MongoDB Atlas** con el siguiente esquema:

- **Usuario**: Administración de usuarios con roles
- **Producto**: Catálogo de productos con categorías
- **Categoria**: Clasificación de productos
- **Orden**: Gestión de órdenes de compra
- **OrdenProducto**: Relación muchos-a-muchos entre órdenes y productos
- **ProductoCategoria**: Relación muchos-a-muchos entre productos y categorías

## 📡 Endpoints API

### Productos (`/api/productos`)
- `GET /` - Obtener todos los productos (paginación, filtros)
- `GET /:id` - Obtener producto por ID
- `POST /` - Crear nuevo producto
- `PUT /:id` - Actualizar producto
- `DELETE /:id` - Eliminar producto
- `GET /buscar/:termino` - Buscar productos
- `GET /categoria/:nombre` - Productos por categoría

### Categorías (`/api/categorias`)
- `GET /` - Obtener todas las categorías
- `GET /:id` - Obtener categoría por ID
- `POST /` - Crear nueva categoría
- `PUT /:id` - Actualizar categoría
- `DELETE /:id` - Eliminar categoría
- `GET /:nombre/productos` - Productos de una categoría

### Usuarios (`/api/usuarios`)
- `GET /` - Obtener todos los usuarios (admin)
- `GET /:id` - Obtener usuario por ID
- `POST /` - Crear nuevo usuario
- `PUT /:id` - Actualizar usuario
- `DELETE /:id` - Eliminar usuario
- `GET /perfil` - Perfil del usuario actual
- `PUT /perfil` - Actualizar perfil

### Órdenes (`/api/ordenes`)
- `GET /` - Obtener todas las órdenes (admin)
- `GET /:id` - Obtener orden por ID
- `POST /` - Crear nueva orden
- `PUT /:id` - Actualizar orden
- `DELETE /:id` - Eliminar orden
- `GET /usuario/:usuarioId` - Órdenes de un usuario
- `GET /mis-ordenes` - Órdenes del usuario actual

## 🔐 Variables de Entorno

```env
# Database
DATABASE_URL="mongodb+srv://user:password@cluster.mongodb.net/dbname"

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Other
BCRYPT_ROUNDS=12
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Iniciar servidor en desarrollo
- `npm run build` - Compilar TypeScript
- `npm start` - Iniciar servidor en producción
- `npm run db:generate` - Generar cliente Prisma
- `npm run db:push` - Aplicar esquema a la base de datos
- `npm run db:studio` - Abrir Prisma Studio

## 📝 Ejemplos de Uso

### Crear un producto
```bash
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Laptop Gaming",
    "descripcion": "Laptop de alto rendimiento",
    "precio": 1299.99,
    "publicar": true,
    "categoriasIds": ["categoria-id-1"]
  }'
```

### Obtener productos con paginación
```bash
curl "http://localhost:3000/api/productos?page=1&limit=10"
```

### Buscar productos
```bash
curl "http://localhost:3000/api/productos/buscar/laptop"
```

## 🚀 Despliegue

### Variables de Entorno en Producción
- Asegúrate de cambiar `NODE_ENV=production`
- Usa un `JWT_SECRET` seguro y aleatorio
- Configura correctamente `DATABASE_URL` de producción

### Consideraciones de Seguridad
- Las credenciales están protegidas en `.env` (ignorado por Git)
- Usa HTTPS en producción
- Implementa autenticación JWT para proteger endpoints
- Valida y sanitiza todos los inputs

## 📄 Licencia

MIT License - Puedes usar este proyecto para fines comerciales y personales.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Contacto

Para preguntas o soporte, abre un issue en el repositorio.
