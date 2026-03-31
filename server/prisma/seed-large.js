const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://admin_mongoDB:Nn7PmHMhUNdjnkot@cluster0.p5hqiac.mongodb.net/todocompra?appName=Cluster0";

async function seed() {
  const client = new MongoClient(uri);
  
  try {
    console.log('Conectando a MongoDB Atlas...');
    await client.connect();
    console.log('✅ Conectado exitosamente');

    const db = client.db('todocompra');

    // Limpiar colecciones
    console.log('Limpiando datos existentes...');
    await db.collection('OrdenProducto').deleteMany({});
    await db.collection('ProductoCategoria').deleteMany({});
    await db.collection('Orden').deleteMany({});
    await db.collection('Producto').deleteMany({});
    await db.collection('Categoria').deleteMany({});
    await db.collection('Usuario').deleteMany({});

    // Crear más categorías
    console.log('Creando categorías...');
    const categorias = await db.collection('Categoria').insertMany([
      { nombre: "Electrónica", updatedAt: new Date() },
      { nombre: "Ropa", updatedAt: new Date() },
      { nombre: "Hogar", updatedAt: new Date() },
      { nombre: "Libros", updatedAt: new Date() },
      { nombre: "Deportes", updatedAt: new Date() },
      { nombre: "Juguetes", updatedAt: new Date() },
      { nombre: "Salud y Belleza", updatedAt: new Date() },
      { nombre: "Automotriz", updatedAt: new Date() },
      { nombre: "Alimentos", updatedAt: new Date() },
      { nombre: "Muebles", updatedAt: new Date() },
      { nombre: "Tecnología", updatedAt: new Date() },
      { nombre: "Accesorios", updatedAt: new Date() }
    ]);

    // Crear muchos más productos
    console.log('Creando productos...');
    const productos = await db.collection('Producto').insertMany([
      // Electrónica
      { nombre: "Laptop Gaming ASUS ROG", descripcion: "Laptop de alto rendimiento con RTX 4070", precio: 1599.99, imagen: "laptop-rog.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "iPhone 15 Pro", descripcion: "Último modelo de Apple con titanium", precio: 1199.99, imagen: "iphone-15.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Samsung Galaxy S24", descripcion: "Flagship Samsung con IA avanzada", precio: 999.99, imagen: "galaxy-s24.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "iPad Air", descripcion: "Tablet potente para trabajo y entretenimiento", precio: 599.99, imagen: "ipad-air.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Sony WH-1000XM5", descripcion: "Auriculares con cancelación de ruido", precio: 349.99, imagen: "sony-headphones.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Ropa
      { nombre: "Jeans Levi's 501", descripcion: "Jeans clásicos ajustados", precio: 89.99, imagen: "levis-501.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Camiseta Adidas Originals", descripcion: "Camiseta vintage con logo", precio: 34.99, imagen: "adidas-tee.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Chaqueta North Face", descripcion: "Chaqueta impermeable para montaña", precio: 199.99, imagen: "north-face.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Zapatillas Nike Air Max", descripcion: "Zapatillas clásicas con aire", precio: 129.99, imagen: "nike-airmax.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Vestido H&M", descripcion: "Vestido elegante para ocasiones especiales", precio: 49.99, imagen: "hm-dress.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Hogar
      { nombre: "Sofá Modular IKEA", descripcion: "Sofá de 4 plazas reconfigurable", precio: 799.99, imagen: "ikea-sofa.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Mesa de Comedor", descripcion: "Mesa de madera para 6 personas", precio: 449.99, imagen: "dining-table.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Lámpara LED Inteligente", descripcion: "Lámpara con control por app", precio: 79.99, imagen: "smart-lamp.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Cafetera Nespresso", descripcion: "Máquina de café cápsulas", precio: 149.99, imagen: "nespresso.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Aspiradora Robot Roomba", descripcion: "Aspiradora automática con mapeo", precio: 399.99, imagen: "roomba.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Libros
      { nombre: "Don Quijote de la Mancha", descripcion: "Clásico de la literatura española", precio: 24.99, imagen: "quijote.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "1984 - George Orwell", descripcion: "Novela distópica clásica", precio: 19.99, imagen: "1984.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "El Principito", descripcion: "Cuento filosófico para todas las edades", precio: 14.99, imagen: "principito.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Cien Años de Soledad", descripcion: "Obra maestra de Gabriel García Márquez", precio: 29.99, imagen: "cien-anos.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Harry Potter Box Set", descripcion: "Colección completa de 7 libros", precio: 89.99, imagen: "harry-potter.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Deportes
      { nombre: "Bicicleta de Montaña", descripcion: "Bici MTB 21 velocidades", precio: 599.99, imagen: "mountain-bike.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Set de Pesas", descripcion: "Set de pesas ajustables 20kg", precio: 89.99, imagen: "dumbbells.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Esterilla de Yoga", descripcion: "Esterilla antideslizante 6mm", precio: 29.99, imagen: "yoga-mat.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Balón de Baloncesto", descripcion: "Balón oficial tamaño 7", precio: 34.99, imagen: "basketball.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Raqueta de Tenis", descripcion: "Raqueta profesional Wilson", precio: 149.99, imagen: "tennis-racket.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Juguetes
      { nombre: "LEGO Creator Expert", descripcion: "Set de 3000 piezas coche deportivo", precio: 199.99, imagen: "lego-car.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Barbie Dream House", descripcion: "Casa de muñecas 3 pisos", precio: 149.99, imagen: "barbie-house.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "PlayStation 5", descripcion: "Consola de última generación", precio: 499.99, imagen: "ps5.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Nintendo Switch", descripcion: "Consola híbrida portátil", precio: 299.99, imagen: "switch.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Drone DJI Mini", descripcion: "Drone con cámara 4K", precio: 449.99, imagen: "dji-drone.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Salud y Belleza
      { nombre: "Secador de Pelo Dyson", descripcion: "Secador supersónico", precio: 399.99, imagen: "dyson-hair.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Cepillo Eléctrico Oral-B", descripcion: "Cepillo con Bluetooth", precio: 89.99, imagen: "oral-b.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Set de Maquillaje", descripcion: "Kit completo de maquillaje", precio: 79.99, imagen: "makeup-kit.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Perfume Chanel No.5", descripcion: "Perfume clásico femenino", precio: 129.99, imagen: "chanel5.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Crema Facial Lancôme", descripcion: "Crema anti-edad 50ml", precio: 149.99, imagen: "lancome.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Automotriz
      { nombre: "GPS Garmin", descripcion: "Navegador GPS para coche", precio: 199.99, imagen: "garmin-gps.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Cámara Dash Cam", descripcion: "Cámara 1080p para coche", precio: 89.99, imagen: "dashcam.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Portaequipos Techo", descripcion: "Portaequipos universal", precio: 149.99, imagen: "roof-rack.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Cargador Coche USB", descripcion: "Cargador dual USB-C", precio: 19.99, imagen: "car-charger.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Aire Acondicionado Portátil", descripcion: "Aire acondicionado 12V", precio: 299.99, imagen: "portable-ac.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Alimentos
      { nombre: "Café en Grano Colombia", descripcion: "Café premium 1kg", precio: 39.99, imagen: "colombian-coffee.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Vino Tinto Reserva", descripcion: "Vino español crianza", precio: 24.99, imagen: "red-wine.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Aceite de Oliva Virgen", descripcion: "Aceite extra virgen 750ml", precio: 19.99, imagen: "olive-oil.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Chocolate Suizo", descripcion: "Chocolate negro 70% cacao", precio: 14.99, imagen: "swiss-chocolate.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Té Verde Japonés", descripcion: "Té matcha orgánico", precio: 29.99, imagen: "matcha-tea.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Muebles
      { nombre: "Silla Ergonómica", descripcion: "Silla de oficina con soporte lumbar", precio: 299.99, imagen: "ergonomic-chair.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Escritorio de Cristal", descripcion: "Escritorio moderno 120x60cm", precio: 199.99, imagen: "glass-desk.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Armario 3 Puertas", descripcion: "Armario de madera con espejo", precio: 399.99, imagen: "wardrobe.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Cómoda 6 Cajones", descripcion: "Cómoda moderna blanca", precio: 249.99, imagen: "dresser.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Estantería Modular", descripcion: "Estantería de 5 niveles", precio: 149.99, imagen: "bookshelf.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Tecnología
      { nombre: "Smart TV 55\"", descripcion: "TV 4K UHD Smart", precio: 699.99, imagen: "smart-tv.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Barra Sonido Samsung", descripcion: "Soundbar con subwoofer", precio: 299.99, imagen: "soundbar.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Google Home Mini", descripcion: "Asistente de voz inteligente", precio: 49.99, imagen: "google-home.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Amazon Echo Dot", descripcion: "Altavoz con Alexa", precio: 39.99, imagen: "echo-dot.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Chromecast 4K", descripcion: "Streaming device 4K HDR", precio: 69.99, imagen: "chromecast.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      
      // Accesorios
      { nombre: "Reloj Smartwatch", descripcion: "Reloj inteligente con GPS", precio: 199.99, imagen: "smartwatch.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Mochila Laptop", descripcion: "Mochila para 15.6\" laptop", precio: 59.99, imagen: "laptop-backpack.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Cartera de Cuero", descripcion: "Cartera masculina genuina", precio: 79.99, imagen: "leather-wallet.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Gafas de Sol Ray-Ban", descripcion: "Gafas polarizadas clásicas", precio: 149.99, imagen: "rayban.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() },
      { nombre: "Bolso Tote Coach", descripcion: "Bolso de mano premium", precio: 299.99, imagen: "coach-bag.jpg", publicar: true, createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Crear relaciones producto-categoría
    console.log('Creando relaciones producto-categoría...');
    const categoriaIds = Object.values(categorias.insertedIds);
    const productoIds = Object.values(productos.insertedIds);

    const relaciones = [];
    
    // Electrónica (primeros 5 productos)
    for (let i = 0; i < 5; i++) {
      relaciones.push({
        productoId: productoIds[i],
        categoriaId: categoriaIds[0], // Electrónica
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Ropa (siguientes 5 productos)
    for (let i = 5; i < 10; i++) {
      relaciones.push({
        productoId: productoIds[i],
        categoriaId: categoriaIds[1], // Ropa
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Hogar (siguientes 5 productos)
    for (let i = 10; i < 15; i++) {
      relaciones.push({
        productoId: productoIds[i],
        categoriaId: categoriaIds[2], // Hogar
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Libros (siguientes 5 productos)
    for (let i = 15; i < 20; i++) {
      relaciones.push({
        productoId: productoIds[i],
        categoriaId: categoriaIds[3], // Libros
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Deportes (siguientes 5 productos)
    for (let i = 20; i < 25; i++) {
      relaciones.push({
        productoId: productoIds[i],
        categoriaId: categoriaIds[4], // Deportes
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Juguetes (siguientes 5 productos)
    for (let i = 25; i < 30; i++) {
      relaciones.push({
        productoId: productoIds[i],
        categoriaId: categoriaIds[5], // Juguetes
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Salud y Belleza (siguientes 5 productos)
    for (let i = 30; i < 35; i++) {
      relaciones.push({
        productoId: productoIds[i],
        categoriaId: categoriaIds[6], // Salud y Belleza
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Automotriz (siguientes 5 productos)
    for (let i = 35; i < 40; i++) {
      relaciones.push({
        productoId: productoIds[i],
        categoriaId: categoriaIds[7], // Automotriz
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Alimentos (siguientes 5 productos)
    for (let i = 40; i < 45; i++) {
      relaciones.push({
        productoId: productoIds[i],
        categoriaId: categoriaIds[8], // Alimentos
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Muebles (siguientes 5 productos)
    for (let i = 45; i < 50; i++) {
      relaciones.push({
        productoId: productoIds[i],
        categoriaId: categoriaIds[9], // Muebles
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Tecnología (siguientes 5 productos)
    for (let i = 50; i < 55; i++) {
      relaciones.push({
        productoId: productoIds[i],
        categoriaId: categoriaIds[10], // Tecnología
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    
    // Accesorios (últimos 5 productos)
    for (let i = 55; i < 60; i++) {
      relaciones.push({
        productoId: productoIds[i],
        categoriaId: categoriaIds[11], // Accesorios
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    await db.collection('ProductoCategoria').insertMany(relaciones);

    // Crear más usuarios
    console.log('Creando usuarios...');
    const usuarios = await db.collection('Usuario').insertMany([
      {
        email: "admin@todocompra.com",
        nombre: "Administrador Sistema",
        password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO6",
        role: "ADMIN"
      },
      {
        email: "cliente@todocompra.com",
        nombre: "Juan Pérez",
        password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO6",
        role: "USER"
      },
      {
        email: "maria.garcia@email.com",
        nombre: "María García",
        password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO6",
        role: "USER"
      },
      {
        email: "carlos.rodriguez@email.com",
        nombre: "Carlos Rodríguez",
        password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO6",
        role: "USER"
      },
      {
        email: "ana.martinez@email.com",
        nombre: "Ana Martínez",
        password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO6",
        role: "USER"
      },
      {
        email: "david.lopez@email.com",
        nombre: "David López",
        password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO6",
        role: "USER"
      },
      {
        email: "laura.sanchez@email.com",
        nombre: "Laura Sánchez",
        password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO6",
        role: "USER"
      },
      {
        email: "pedro.hernandez@email.com",
        nombre: "Pedro Hernández",
        password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO6",
        role: "USER"
      }
    ]);

    // Crear múltiples órdenes
    console.log('Creando órdenes...');
    const usuarioIds = Object.values(usuarios.insertedIds);
    
    for (let i = 0; i < 15; i++) {
      const usuarioId = usuarioIds[Math.floor(Math.random() * usuarioIds.length)];
      const orden = await db.collection('Orden').insertOne({
        usuarioId: usuarioId,
        fechaOrden: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Ordenes de últimos 30 días
      });

      // Agregar productos aleatorios a cada orden
      const numProductos = Math.floor(Math.random() * 4) + 1; // 1-4 productos por orden
      const ordenProductos = [];
      
      for (let j = 0; j < numProductos; j++) {
        const productoId = productoIds[Math.floor(Math.random() * productoIds.length)];
        ordenProductos.push({
          ordenId: orden.insertedId,
          productoId: productoId,
          cantidad: Math.floor(Math.random() * 3) + 1, // 1-3 unidades
          updatedAt: new Date()
        });
      }
      
      await db.collection('OrdenProducto').insertMany(ordenProductos);
    }

    console.log('✅ Seed completado exitosamente!');
    console.log(`📊 Resumen:`);
    console.log(`   - ${categorias.insertedCount} categorías`);
    console.log(`   - ${productos.insertedCount} productos`);
    console.log(`   - ${usuarios.insertedCount} usuarios`);
    console.log(`   - 15 órdenes con múltiples productos`);
    console.log(`   - ${relaciones.length} relaciones producto-categoría`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await client.close();
  }
}

seed();
