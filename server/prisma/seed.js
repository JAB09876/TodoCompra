import { PrismaClient } from '@prisma/client';

// Usar la misma configuración que database.ts
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed de la base de datos...');

  try {
    // Limpiar datos existentes
    await prisma.ordenProducto.deleteMany();
    await prisma.productoCategoria.deleteMany();
    await prisma.orden.deleteMany();
    await prisma.producto.deleteMany();
    await prisma.categoria.deleteMany();
    await prisma.usuario.deleteMany();

    console.log('Datos existentes eliminados');

    // Crear categorías
    const categorias = await prisma.categoria.createMany({
      data: [
        { nombre: "Electrónica" },
        { nombre: "Ropa" },
        { nombre: "Hogar" },
        { nombre: "Libros" },
        { nombre: "Deportes" }
      ]
    });
    console.log(`${categorias.count} categorías creadas`);

    // Obtener categorías creadas
    const categoriaElectronica = await prisma.categoria.findFirst({ where: { nombre: "Electrónica" } });
    const categoriaRopa = await prisma.categoria.findFirst({ where: { nombre: "Ropa" } });
    const categoriaHogar = await prisma.categoria.findFirst({ where: { nombre: "Hogar" } });
    const categoriaLibros = await prisma.categoria.findFirst({ where: { nombre: "Libros" } });
    const categoriaDeportes = await prisma.categoria.findFirst({ where: { nombre: "Deportes" } });

    // Crear productos
    const productos = await prisma.producto.createMany({
      data: [
        {
          nombre: "Laptop Gaming ASUS",
          descripcion: "Laptop de alto rendimiento para gaming",
          precio: 1299.99,
          imagen: "laptop-asus.jpg",
          publicar: true
        },
        {
          nombre: "Camiseta Nike",
          descripcion: "Camiseta deportiva transpirable",
          precio: 29.99,
          imagen: "camiseta-nike.jpg",
          publicar: true
        },
        {
          nombre: "Sofá Moderno",
          descripcion: "Sofá de 3 plazas color gris",
          precio: 599.99,
          imagen: "sofa-moderno.jpg",
          publicar: true
        },
        {
          nombre: "Libro JavaScript Avanzado",
          descripcion: "Guía completa de JavaScript moderno",
          precio: 39.99,
          imagen: "libro-js.jpg",
          publicar: true
        },
        {
          nombre: "Balón de Fútbol",
          descripcion: "Balón oficial tamaño 5",
          precio: 24.99,
          imagen: "balon-futbol.jpg",
          publicar: true
        }
      ]
    });
    console.log(`${productos.count} productos creados`);

    // Obtener productos creados
    const productoLaptop = await prisma.producto.findFirst({ where: { nombre: "Laptop Gaming ASUS" } });
    const productoCamiseta = await prisma.producto.findFirst({ where: { nombre: "Camiseta Nike" } });
    const productoSofa = await prisma.producto.findFirst({ where: { nombre: "Sofá Moderno" } });
    const productoLibro = await prisma.producto.findFirst({ where: { nombre: "Libro JavaScript Avanzado" } });
    const productoBalon = await prisma.producto.findFirst({ where: { nombre: "Balón de Fútbol" } });

    // Crear relaciones producto-categoría
    if (categoriaElectronica && productoLaptop) {
      await prisma.productoCategoria.create({
        data: {
          productoId: productoLaptop.id,
          categoriaId: categoriaElectronica.id
        }
      });
    }

    if (categoriaRopa && productoCamiseta) {
      await prisma.productoCategoria.create({
        data: {
          productoId: productoCamiseta.id,
          categoriaId: categoriaRopa.id
        }
      });
    }

    if (categoriaHogar && productoSofa) {
      await prisma.productoCategoria.create({
        data: {
          productoId: productoSofa.id,
          categoriaId: categoriaHogar.id
        }
      });
    }

    if (categoriaLibros && productoLibro) {
      await prisma.productoCategoria.create({
        data: {
          productoId: productoLibro.id,
          categoriaId: categoriaLibros.id
        }
      });
    }

    if (categoriaDeportes && productoBalon) {
      await prisma.productoCategoria.create({
        data: {
          productoId: productoBalon.id,
          categoriaId: categoriaDeportes.id
        }
      });
    }

    console.log('Relaciones producto-categoría creadas');

    // Crear usuarios
    const usuarios = await prisma.usuario.createMany({
      data: [
        {
          email: "admin@todocompra.com",
          nombre: "Administrador",
          password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO6", // password: admin123
          role: "ADMIN"
        },
        {
          email: "cliente@todocompra.com",
          nombre: "Juan Pérez",
          password: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6ukx.LFvO6", // password: admin123
          role: "USER"
        }
      ]
    });
    console.log(`${usuarios.count} usuarios creados`);

    // Obtener usuarios creados
    const usuarioCliente = await prisma.usuario.findFirst({ where: { email: "cliente@todocompra.com" } });

    // Crear órdenes de ejemplo
    if (usuarioCliente && productoLaptop && productoLibro) {
      const orden = await prisma.orden.create({
        data: {
          usuarioId: usuarioCliente.id
        }
      });

      // Agregar productos a la orden
      await prisma.ordenProducto.create({
        data: {
          ordenId: orden.id,
          productoId: productoLaptop.id,
          cantidad: 1
        }
      });

      await prisma.ordenProducto.create({
        data: {
          ordenId: orden.id,
          productoId: productoLibro.id,
          cantidad: 2
        }
      });

      console.log('Orden de ejemplo creada');
    }

    console.log('✅ Seed completado exitosamente!');
  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('Error fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
