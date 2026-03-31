# 🛍️ TodoCompra API

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

> API RESTful completa para aplicación de e-commerce "TodoCompra" construida con Node.js, Express, TypeScript y Prisma con MongoDB Atlas.

## 🚀 Características

- 🛒 **CRUD completo** para productos, categorías, usuarios y órdenes
- 🗄️ **MongoDB Atlas** con Prisma ORM para type safety
- 🔒 **Seguridad** con encriptación de passwords y validaciones
- 📄 **Paginación** y filtros avanzados en todos los endpoints
- 🏗️ **Arquitectura limpia** con separación de responsabilidades
- 📖 **Documentación completa** de todos los endpoints
- 🔧 **TypeScript** para mejor experiencia de desarrollo

## 📁 Estructura del Proyecto

```
server/
├── source/
│   ├── controllers/     # 🧠 Lógica de negocio CRUD
│   │   ├── productoController.ts
│   │   ├── categoriaController.ts
│   │   ├── usuarioController.ts
│   │   └── ordenController.ts
│   ├── routes/          # 🛣️ Definición de rutas API
│   │   ├── productoRoutes.ts
│   │   ├── categoriaRoutes.ts
│   │   ├── usuarioRoutes.ts
│   │   ├── ordenRoutes.ts
│   │   └── index.ts
│   ├── database.ts      # 🗄️ Conexión Prisma
│   └── index.ts         # 🚀 Servidor principal
├── prisma/
│   ├── schema.prisma    # 📋 Esquema de base de datos
│   └── config.ts        # ⚙️ Configuración Prisma
├── .env.example         # 🔑 Variables de entorno ejemplo
├── .gitignore           # 🚫 Archivos ignorados por Git
├── package.json         # 📦 Dependencias y scripts
└── README.md            # 📖 Este archivo
```

## 🛠️ Instalación

### Prerrequisitos
- Node.js 18+ 
- MongoDB Atlas (o MongoDB local)
- Git

### 1. Clonar el repositorio
```bash
git clone https://github.com/JAB09876/TodoCompra.git
cd TodoCompra/server
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
cp .env.example .env
```

Edita `.env` con tus credenciales:
```env
# Database
DATABASE_URL="mongodb+srv://TU_USER:TU_PASSWORD@cluster.mongodb.net/todocompra"

# Server
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET="tu-super-secreto-jwt-aqui"
JWT_EXPIRES_IN="7d"

# Other
BCRYPT_ROUNDS=12
```

### 4. Configurar Prisma
```bash
# Generar cliente Prisma
npx prisma generate

# Aplicar esquema a la base de datos
npx prisma db push
```

### 5. Poblar base de datos (opcional)
```bash
# Ejecutar seed con datos de ejemplo
node prisma/seed-large.js
```

### 6. Iniciar servidor
```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

## 🗄️ Base de Datos

### Esquema MongoDB Atlas

- **👤 Usuario**: Gestión de usuarios con roles (USER/ADMIN)
- **📦 Producto**: Catálogo de productos con información detallada
- **🏷️ Categoria**: Clasificación de productos
- **🛍️ Orden**: Gestión de órdenes de compra
- **🔗 OrdenProducto**: Relación muchos-a-muchos entre órdenes y productos
- **🔗 ProductoCategoria**: Relación muchos-a-muchos entre productos y categorías

### Datos de Ejemplo

El seed incluye:
- **60 productos** variados (electrónica, ropa, hogar, etc.)
- **12 categorías** principales
- **8 usuarios** de ejemplo
- **15 órdenes** con productos

## 📡 Endpoints API

### 📦 Productos (`/api/productos`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Obtener todos los productos (paginación, filtros) |
| `GET` | `/:id` | Obtener producto por ID |
| `POST` | `/` | Crear nuevo producto |
| `PUT` | `/:id` | Actualizar producto |
| `DELETE` | `/:id` | Eliminar producto |
| `GET` | `/buscar/:termino` | Buscar productos por texto |
| `GET` | `/categoria/:nombre` | Productos por categoría |

### 🏷️ Categorías (`/api/categorias`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Obtener todas las categorías |
| `GET` | `/:id` | Obtener categoría por ID |
| `POST` | `/` | Crear nueva categoría |
| `PUT` | `/:id` | Actualizar categoría |
| `DELETE` | `/:id` | Eliminar categoría |
| `GET` | `/:nombre/productos` | Productos de una categoría |

### 👥 Usuarios (`/api/usuarios`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Obtener todos los usuarios (admin) |
| `GET` | `/:id` | Obtener usuario por ID |
| `POST` | `/` | Crear nuevo usuario |
| `PUT` | `:id` | Actualizar usuario |
| `DELETE` | `/:id` | Eliminar usuario |
| `GET` | `/perfil` | Perfil del usuario actual |
| `PUT` | `/perfil` | Actualizar perfil |

### 🛍️ Órdenes (`/api/ordenes`)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Obtener todas las órdenes (admin) |
| `GET` | `/:id` | Obtener orden por ID |
| `POST` | `/` | Crear nueva orden |
| `PUT` | `/:id` | Actualizar orden |
| `DELETE` | `/:id` | Eliminar orden |
| `GET` | `/usuario/:usuarioId` | Órdenes de un usuario |
| `GET` | `/mis-ordenes` | Órdenes del usuario actual |

## 📝 Ejemplos de Uso

### Crear un producto
```bash
curl -X POST http://localhost:3000/api/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Laptop Gaming ASUS",
    "descripcion": "Laptop de alto rendimiento con RTX 4070",
    "precio": 1599.99,
    "imagen": "laptop-asus.jpg",
    "publicar": true,
    "categoriasIds": ["categoria-id-electronica"]
  }'
```

### Obtener productos con paginación
```bash
curl "http://localhost:3000/api/productos?page=1&limit=10&publicar=true"
```

### Buscar productos
```bash
curl "http://localhost:3000/api/productos/buscar/laptop?page=1&limit=5"
```

### Crear una orden
```bash
curl -X POST http://localhost:3000/api/ordenes \
  -H "Content-Type: application/json" \
  -d '{
    "usuarioId": "usuario-id",
    "productos": [
      {
        "productoId": "producto-id-1",
        "cantidad": 2
      },
      {
        "productoId": "producto-id-2", 
        "cantidad": 1
      }
    ]
  }'
```

### Filtrar por categoría
```bash
curl "http://localhost:3000/api/productos/categoria/Electrónica?page=1&limit=10"
```

## 🛠️ Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| `dev` | `npm run dev` | Iniciar servidor en desarrollo |
| `build` | `npm run build` | Compilar TypeScript |
| `start` | `npm start` | Iniciar servidor en producción |
| `db:generate` | `npm run db:generate` | Generar cliente Prisma |
| `db:push` | `npm run db:push` | Aplicar esquema a la base de datos |
| `db:studio` | `npm run db:studio` | Abrir Prisma Studio |

## 🔧 Variables de Entorno

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

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar tu repositorio a Vercel
2. Configurar variables de entorno en Vercel
3. Deploy automático

### Railway/Render
1. Importar repositorio
2. Configurar MongoDB Atlas
3. Establecer variables de entorno
4. Deploy

### Docker (Opcional)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔐 Consideraciones de Seguridad

- ✅ Variables de entorno protegidas en `.gitignore`
- ✅ Encriptación de passwords con bcrypt
- ✅ Validación de inputs en todos los endpoints
- ✅ Manejo seguro de errores (sin exposición de datos sensibles)
- 🔒 **Recomendación**: Implementar autenticación JWT para proteger endpoints

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. **Fork** el proyecto
2. **Crear rama** (`git checkout -b feature/AmazingFeature`)
3. **Commit** cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abrir Pull Request**

### Guía de Contribución
- Seguir la estructura existente
- Agregar tests para nuevas funcionalidades
- Documentar nuevos endpoints
- Mantener el código limpio y comentado

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🐛 Issues y Soporte

¿Encontraste un bug? ¿Tienes una sugerencia?

1. **Buscar** issues existentes
2. **Crear nuevo issue** con descripción detallada
3. **Usar plantillas** para bugs o feature requests

## 📊 Estadísticas del Proyecto

![GitHub stars](https://img.shields.io/github/stars/JAB09876/TodoCompra?style=social)
![GitHub forks](https://img.shields.io/github/forks/JAB09876/TodoCompra?style=social)
![GitHub issues](https://img.shields.io/github/issues/JAB09876/TodoCompra)
![GitHub license](https://img.shields.io/github/license/JAB09876/TodoCompra)

## 📞 Contacto

- **GitHub**: [@JAB09876](https://github.com/JAB09876)
- **Email**: [Crea un issue](https://github.com/JAB09876/TodoCompra/issues) para contacto

---

<div align="center">
  <p>Hecho con ❤️ por <a href="https://github.com/JAB09876">JAB09876</a></p>
  <p>⭐ Si te gusta el proyecto, no olvides darle una estrella!</p>
</div>

- Emoji-enhanced sections for better readability
