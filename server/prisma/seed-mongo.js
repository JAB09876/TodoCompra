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

    // Crear categorías
    console.log('Creando categorías...');
    const categorias = await db.collection('Categoria').insertMany([
      { nombre: "Electrónica", updatedAt: new Date() },
      { nombre: "Ropa", updatedAt: new Date() },
      { nombre: "Hogar", updatedAt: new Date() },
      { nombre: "Libros", updatedAt: new Date() },
      { nombre: "Deportes", updatedAt: new Date() }
    ]);

    // Crear productos
    console.log('Creando productos...');
    const productos = await db.collection('Producto').insertMany([
      {
        nombre: "Laptop Gaming ASUS",
        descripcion: "Laptop de alto rendimiento para gaming",
        precio: 1299.99,
        imagen: "laptop-asus.jpg",
        publicar: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: "Camiseta Nike",
        descripcion: "Camiseta deportiva transpirable",
        precio: 29.99,
        imagen: "camiseta-nike.jpg",
        publicar: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: "Sofá Moderno",
        descripcion: "Sofá de 3 plazas color gris",
        precio: 599.99,
        imagen: "sofa-moderno.jpg",
        publicar: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: "Libro JavaScript Avanzado",
        descripcion: "Guía completa de JavaScript moderno",
        precio: 39.99,
        imagen: "libro-js.jpg",
        publicar: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        nombre: "Balón de Fútbol",
        descripcion: "Balón oficial tamaño 5",
        precio: 24.99,
        imagen: "balon-futbol.jpg",
        publicar: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    // Crear relaciones producto-categoría
    console.log('Creando relaciones producto-categoría...');
    const categoriaIds = Object.values(categorias.insertedIds);
    const productoIds = Object.values(productos.insertedIds);

    await db.collection('ProductoCategoria').insertMany([
      { productoId: productoIds[0], categoriaId: categoriaIds[0], createdAt: new Date(), updatedAt: new Date() },
      { productoId: productoIds[1], categoriaId: categoriaIds[1], createdAt: new Date(), updatedAt: new Date() },
      { productoId: productoIds[2], categoriaId: categoriaIds[2], createdAt: new Date(), updatedAt: new Date() },
      { productoId: productoIds[3], categoriaId: categoriaIds[3], createdAt: new Date(), updatedAt: new Date() },
      { productoId: productoIds[4], categoriaId: categoriaIds[4], createdAt: new Date(), updatedAt: new Date() }
    ]);

    // Crear usuarios
    console.log('Creando usuarios...');
    const usuarios = await db.collection('Usuario').insertMany([
      {
        email: "admin@todocompra.com",
        nombre: "Administrador",
        password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO6",
        role: "USER"
      },
      {
        email: "cliente@todocompra.com",
        nombre: "Juan Pérez",
        password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO6",
        role: "USER"
      }
    ]);

    // Crear una orden de ejemplo
    console.log('Creando orden de ejemplo...');
    const usuarioClienteId = Object.values(usuarios.insertedIds)[1];
    
    const orden = await db.collection('Orden').insertOne({
      usuarioId: usuarioClienteId,
      fechaOrden: new Date()
    });

    // Agregar productos a la orden
    await db.collection('OrdenProducto').insertMany([
      {
        ordenId: orden.insertedId,
        productoId: productoIds[0],
        cantidad: 1,
        updatedAt: new Date()
      },
      {
        ordenId: orden.insertedId,
        productoId: productoIds[3],
        cantidad: 2,
        updatedAt: new Date()
      }
    ]);

    console.log('✅ Seed completado exitosamente!');
    console.log(`📊 Resumen:`);
    console.log(`   - ${categorias.insertedCount} categorías`);
    console.log(`   - ${productos.insertedCount} productos`);
    console.log(`   - ${usuarios.insertedCount} usuarios`);
    console.log(`   - 1 orden con productos`);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
  } finally {
    await client.close();
  }
}

seed();
