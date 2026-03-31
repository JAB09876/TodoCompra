import { Request, Response, NextFunction } from 'express';
import prisma from '../database';

export class ProductoController {
  // GET /api/productos - Obtener todos los productos
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const categoria = req.query.categoria as string;
      const buscar = req.query.buscar as string;
      const publicar = req.query.publicar;
      
      const skip = (page - 1) * limit;
      
      const where: any = {};
      
      if (categoria) {
        where.categorias = {
          some: {
            categoria: {
              nombre: categoria
            }
          }
        };
      }
      
      if (buscar) {
        where.OR = [
          { nombre: { contains: buscar, mode: 'insensitive' } },
          { descripcion: { contains: buscar, mode: 'insensitive' } }
        ];
      }
      
      if (publicar !== undefined) {
        where.publicar = publicar === 'true';
      }
      
      const [productos, total] = await Promise.all([
        prisma.producto.findMany({
          where,
          include: {
            categorias: {
              include: {
                categoria: true
              }
            }
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.producto.count({ where })
      ]);
      
      return res.json({
        productos,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  // GET /api/productos/:id - Obtener producto por ID
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const producto = await prisma.producto.findUnique({
        where: { id: id as string },
        include: {
          categorias: {
            include: {
              categoria: true
            }
          }
        }
      });
      
      if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      return res.json(producto);
    } catch (error) {
      return next(error);
    }
  }

  // POST /api/productos - Crear nuevo producto
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre, descripcion, precio, imagen, publicar = true, categoriasIds } = req.body;
      
      if (!nombre || !descripcion || precio === undefined) {
        return res.status(400).json({ 
          error: 'Faltan campos requeridos: nombre, descripcion, precio' 
        });
      }
      
      const producto = await prisma.producto.create({
        data: {
          nombre,
          descripcion,
          precio: Number(precio),
          imagen: imagen || 'image-not-found.jpg',
          publicar: Boolean(publicar)
        },
        include: {
          categorias: {
            include: {
              categoria: true
            }
          }
        }
      });
      
      // Si se proporcionaron categorías, agregarlas
      if (categoriasIds && Array.isArray(categoriasIds) && categoriasIds.length > 0) {
        await prisma.productoCategoria.createMany({
          data: categoriasIds.map((categoriaId: string) => ({
            productoId: producto.id,
            categoriaId: categoriaId
          }))
        });
        
        // Obtener producto actualizado con categorías
        const productoConCategorias = await prisma.producto.findUnique({
          where: { id: producto.id },
          include: {
            categorias: {
              include: {
                categoria: true
              }
            }
          }
        });
        
        return res.status(201).json(productoConCategorias);
      }
      
      return res.status(201).json(producto);
    } catch (error) {
      return next(error);
    }
  }

  // PUT /api/productos/:id - Actualizar producto
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { nombre, descripcion, precio, imagen, publicar, categoriasIds } = req.body;
      
      const productoExistente = await prisma.producto.findUnique({
        where: { id: id as string }
      });
      
      if (!productoExistente) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      const updateData: any = {
        updatedAt: new Date()
      };
      
      if (nombre !== undefined) updateData.nombre = nombre;
      if (descripcion !== undefined) updateData.descripcion = descripcion;
      if (precio !== undefined) updateData.precio = Number(precio);
      if (imagen !== undefined) updateData.imagen = imagen;
      if (publicar !== undefined) updateData.publicar = Boolean(publicar);
      
      const producto = await prisma.producto.update({
        where: { id: id as string },
        data: updateData,
        include: {
          categorias: {
            include: {
              categoria: true
            }
          }
        }
      });
      
      // Actualizar categorías si se proporcionaron
      if (categoriasIds !== undefined) {
        // Eliminar relaciones existentes
        await prisma.productoCategoria.deleteMany({
          where: { productoId: id as string }
        });
        
        // Crear nuevas relaciones
        if (Array.isArray(categoriasIds) && categoriasIds.length > 0) {
          await prisma.productoCategoria.createMany({
            data: categoriasIds.map((categoriaId: string) => ({
              productoId: id as string,
              categoriaId: categoriaId
            }))
          });
        }
        
        // Obtener producto actualizado con categorías
        const productoActualizado = await prisma.producto.findUnique({
          where: { id: id as string },
          include: {
            categorias: {
              include: {
                categoria: true
              }
            }
          }
        });
        
        return res.json(productoActualizado);
      }
      
      return res.json(producto);
    } catch (error) {
      return next(error);
    }
  }

  // DELETE /api/productos/:id - Eliminar producto
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const productoExistente = await prisma.producto.findUnique({
        where: { id: id as string }
      });
      
      if (!productoExistente) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      // Eliminar relaciones primero
      await prisma.productoCategoria.deleteMany({
        where: { productoId: id as string }
      });
      
      // Eliminar producto
      await prisma.producto.delete({
        where: { id: id as string }
      });
      
      return res.json({ message: 'Producto eliminado exitosamente' });
    } catch (error) {
      return next(error);
    }
  }

  // GET /api/productos/categoria/:nombre - Obtener productos por categoría
  static async getByCategoria(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre } = req.params;
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      
      const skip = (page - 1) * limit;
      
      const [productos, total] = await Promise.all([
        prisma.producto.findMany({
          where: {
            categorias: {
              some: {
                categoria: {
                  nombre: nombre as string
                }
              }
            },
            publicar: true
          },
          include: {
            categorias: {
              include: {
                categoria: true
              }
            }
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.producto.count({
          where: {
            categorias: {
              some: {
                categoria: {
                  nombre: nombre as string
                }
              }
            },
            publicar: true
          }
        })
      ]);
      
      return res.json({
        productos,
        categoria: nombre,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      return next(error);
    }
  }

  // GET /api/productos/buscar/:termino - Buscar productos
  static async search(req: Request, res: Response, next: NextFunction) {
    try {
      const { termino } = req.params;
      
      // Validate that termino is a string
      if (typeof termino !== 'string') {
        return res.status(400).json({ error: 'Search term must be a string' });
      }
      
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      
      // Ensure termino is a string
      const searchTerm = Array.isArray(termino) ? termino[0] : termino;
      
      const skip = (page - 1) * limit;
      
      const [productos, total] = await Promise.all([
        prisma.producto.findMany({
          where: {
            OR: [
              { nombre: { contains: searchTerm, mode: 'insensitive' } },
              { descripcion: { contains: searchTerm, mode: 'insensitive' } }
            ],
            publicar: true
          },
          include: {
            categorias: {
              include: {
                categoria: true
              }
            }
          },
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' }
        }),
        prisma.producto.count({
          where: {
            OR: [
              { nombre: { contains: searchTerm, mode: 'insensitive' } },
              { descripcion: { contains: searchTerm, mode: 'insensitive' } }
            ],
            publicar: true
          }
        })
      ]);
      
      return res.json({
        productos,
        termino: searchTerm,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      return next(error);
    }
  }
}
