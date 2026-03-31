import { Request, Response, NextFunction } from 'express';
import prisma from '../database';

export class CategoriaController {
  // GET /api/categorias - Obtener todas las categorías
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10 } = req.query;
      
      const skip = (Number(page) - 1) * Number(limit);
      
      const [categorias, total] = await Promise.all([
        prisma.categoria.findMany({
          include: {
            productos: {
              include: {
                producto: true
              }
            }
          },
          skip,
          take: Number(limit),
          orderBy: { nombre: 'asc' }
        }),
        prisma.categoria.count()
      ]);
      
      // Agregar conteo de productos a cada categoría
      const categoriasConConteo = categorias.map(categoria => ({
        ...categoria,
        totalProductos: categoria.productos.length,
        productosPublicados: categoria.productos.filter(p => p.producto.publicar).length
      }));
      
      res.json({
        categorias: categoriasConConteo,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/categorias/:id - Obtener categoría por ID
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const categoria = await prisma.categoria.findUnique({
        where: { id },
        include: {
          productos: {
            include: {
              producto: true
            }
          }
        }
      });
      
      if (!categoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      
      res.json({
        ...categoria,
        totalProductos: categoria.productos.length,
        productosPublicados: categoria.productos.filter(p => p.producto.publicar).length
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/categorias - Crear nueva categoría
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre } = req.body;
      
      if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
        return res.status(400).json({ 
          error: 'El nombre de la categoría es requerido y debe ser un texto válido' 
        });
      }
      
      // Verificar si ya existe una categoría con ese nombre
      const categoriaExistente = await prisma.categoria.findFirst({
        where: { 
          nombre: { 
            equals: nombre.trim(), 
            mode: 'insensitive' 
          } 
        }
      });
      
      if (categoriaExistente) {
        return res.status(409).json({ 
          error: 'Ya existe una categoría con ese nombre' 
        });
      }
      
      const categoria = await prisma.categoria.create({
        data: {
          nombre: nombre.trim()
        },
        include: {
          productos: {
            include: {
              producto: true
            }
          }
        }
      });
      
      res.status(201).json({
        ...categoria,
        totalProductos: 0,
        productosPublicados: 0
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/categorias/:id - Actualizar categoría
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { nombre } = req.body;
      
      if (!nombre || typeof nombre !== 'string' || nombre.trim().length === 0) {
        return res.status(400).json({ 
          error: 'El nombre de la categoría es requerido y debe ser un texto válido' 
        });
      }
      
      const categoriaExistente = await prisma.categoria.findUnique({
        where: { id }
      });
      
      if (!categoriaExistente) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      
      // Verificar si ya existe otra categoría con ese nombre
      const categoriaConMismoNombre = await prisma.categoria.findFirst({
        where: { 
          nombre: { 
            equals: nombre.trim(), 
            mode: 'insensitive' 
          },
          id: { not: id }
        }
      });
      
      if (categoriaConMismoNombre) {
        return res.status(409).json({ 
          error: 'Ya existe otra categoría con ese nombre' 
        });
      }
      
      const categoria = await prisma.categoria.update({
        where: { id },
        data: {
          nombre: nombre.trim(),
          updatedAt: new Date()
        },
        include: {
          productos: {
            include: {
              producto: true
            }
          }
        }
      });
      
      res.json({
        ...categoria,
        totalProductos: categoria.productos.length,
        productosPublicados: categoria.productos.filter(p => p.producto.publicar).length
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/categorias/:id - Eliminar categoría
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const categoriaExistente = await prisma.categoria.findUnique({
        where: { id },
        include: {
          productos: true
        }
      });
      
      if (!categoriaExistente) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      
      // Verificar si hay productos asociados
      if (categoriaExistente.productos.length > 0) {
        return res.status(400).json({ 
          error: 'No se puede eliminar la categoría porque tiene productos asociados' 
        });
      }
      
      await prisma.categoria.delete({
        where: { id }
      });
      
      res.json({ message: 'Categoría eliminada exitosamente' });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/categorias/:nombre/productos - Obtener productos de una categoría
  static async getProductos(req: Request, res: Response, next: NextFunction) {
    try {
      const { nombre } = req.params;
      const { page = 1, limit = 10, publicar = 'true' } = req.query;
      
      const skip = (Number(page) - 1) * Number(limit);
      
      // Primero buscar la categoría por nombre
      const categoria = await prisma.categoria.findFirst({
        where: { 
          nombre: { 
            equals: nombre, 
            mode: 'insensitive' 
          } 
        }
      });
      
      if (!categoria) {
        return res.status(404).json({ error: 'Categoría no encontrada' });
      }
      
      const where: any = {
        categorias: {
          some: {
            categoriaId: categoria.id
          }
        }
      };
      
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
          take: Number(limit),
          orderBy: { createdAt: 'desc' }
        }),
        prisma.producto.count({ where })
      ]);
      
      res.json({
        categoria: {
          id: categoria.id,
          nombre: categoria.nombre
        },
        productos,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
