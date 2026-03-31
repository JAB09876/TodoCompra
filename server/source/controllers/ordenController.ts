import { Request, Response, NextFunction } from 'express';
import prisma from '../database';

export class OrdenController {
  // GET /api/ordenes - Obtener todas las órdenes (solo admin)
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, usuarioId, estado } = req.query;
      
      const skip = (Number(page) - 1) * Number(limit);
      
      const where: any = {};
      
      if (usuarioId) {
        where.usuarioId = usuarioId as string;
      }
      
      const [ordenes, total] = await Promise.all([
        prisma.orden.findMany({
          where,
          include: {
            usuario: {
              select: {
                id: true,
                email: true,
                nombre: true
              }
            },
            productos: {
              include: {
                producto: {
                  select: {
                    id: true,
                    nombre: true,
                    precio: true,
                    imagen: true
                  }
                }
              }
            }
          },
          skip,
          take: Number(limit),
          orderBy: { fechaOrden: 'desc' }
        }),
        prisma.orden.count({ where })
      ]);
      
      // Calcular totales para cada orden
      const ordenesConTotales = ordenes.map(orden => {
        const subtotal = orden.productos.reduce((sum, op) => {
          return sum + (op.producto.precio * op.cantidad);
        }, 0);
        
        return {
          ...orden,
          subtotal,
          totalItems: orden.productos.reduce((sum, op) => sum + op.cantidad, 0)
        };
      });
      
      res.json({
        ordenes: ordenesConTotales,
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

  // GET /api/ordenes/:id - Obtener orden por ID
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const orden = await prisma.orden.findUnique({
        where: { id },
        include: {
          usuario: {
            select: {
              id: true,
              email: true,
              nombre: true
            }
          },
          productos: {
            include: {
              producto: {
                select: {
                  id: true,
                  nombre: true,
                  precio: true,
                  imagen: true,
                  descripcion: true
                }
              }
            }
          }
        }
      });
      
      if (!orden) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }
      
      // Calcular totales
      const subtotal = orden.productos.reduce((sum, op) => {
        return sum + (op.producto.precio * op.cantidad);
      }, 0);
      
      const ordenConTotales = {
        ...orden,
        subtotal,
        totalItems: orden.productos.reduce((sum, op) => sum + op.cantidad, 0)
      };
      
      res.json(ordenConTotales);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/ordenes - Crear nueva orden
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { usuarioId, productos } = req.body;
      
      if (!usuarioId || !productos || !Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ 
          error: 'Se requiere usuarioId y un array de productos' 
        });
      }
      
      // Validar que el usuario exista
      const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId }
      });
      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      // Validar productos y calcular totales
      const productosValidados = [];
      let subtotal = 0;
      
      for (const item of productos) {
        if (!item.productoId || !item.cantidad || item.cantidad < 1) {
          return res.status(400).json({ 
            error: 'Cada producto debe tener productoId y cantidad válida' 
          });
        }
        
        const producto = await prisma.producto.findUnique({
          where: { id: item.productoId }
        });
        
        if (!producto) {
          return res.status(404).json({ 
            error: `Producto con ID ${item.productoId} no encontrado` 
          });
        }
        
        if (!producto.publicar) {
          return res.status(400).json({ 
            error: `Producto ${producto.nombre} no está disponible` 
          });
        }
        
        productosValidados.push({
          productoId: item.productoId,
          cantidad: item.cantidad,
          precioUnitario: producto.precio,
          subtotal: producto.precio * item.cantidad
        });
        
        subtotal += producto.precio * item.cantidad;
      }
      
      // Crear la orden
      const orden = await prisma.orden.create({
        data: {
          usuarioId
        },
        include: {
          usuario: {
            select: {
              id: true,
              email: true,
              nombre: true
            }
          }
        }
      });
      
      // Crear las relaciones de productos
      await prisma.ordenProducto.createMany({
        data: productosValidados.map(item => ({
          ordenId: orden.id,
          productoId: item.productoId,
          cantidad: item.cantidad
        }))
      });
      
      // Obtener la orden completa con productos
      const ordenCompleta = await prisma.orden.findUnique({
        where: { id: orden.id },
        include: {
          usuario: {
            select: {
              id: true,
              email: true,
              nombre: true
            }
          },
          productos: {
            include: {
              producto: {
                select: {
                  id: true,
                  nombre: true,
                  precio: true,
                  imagen: true,
                  descripcion: true
                }
              }
            }
          }
        }
      });
      
      res.status(201).json({
        ...ordenCompleta,
        subtotal,
        totalItems: productosValidados.reduce((sum, item) => sum + item.cantidad, 0)
      });
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/ordenes/:id - Actualizar orden
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { productos } = req.body;
      
      const ordenExistente = await prisma.orden.findUnique({
        where: { id }
      });
      
      if (!ordenExistente) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }
      
      if (!productos || !Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({ 
          error: 'Se requiere un array de productos' 
        });
      }
      
      // Eliminar productos existentes
      await prisma.ordenProducto.deleteMany({
        where: { ordenId: id }
      });
      
      // Validar y agregar nuevos productos
      const productosValidados = [];
      let subtotal = 0;
      
      for (const item of productos) {
        if (!item.productoId || !item.cantidad || item.cantidad < 1) {
          return res.status(400).json({ 
            error: 'Cada producto debe tener productoId y cantidad válida' 
          });
        }
        
        const producto = await prisma.producto.findUnique({
          where: { id: item.productoId }
        });
        
        if (!producto) {
          return res.status(404).json({ 
            error: `Producto con ID ${item.productoId} no encontrado` 
          });
        }
        
        if (!producto.publicar) {
          return res.status(400).json({ 
            error: `Producto ${producto.nombre} no está disponible` 
          });
        }
        
        productosValidados.push({
          productoId: item.productoId,
          cantidad: item.cantidad
        });
        
        subtotal += producto.precio * item.cantidad;
      }
      
      // Crear las nuevas relaciones
      await prisma.ordenProducto.createMany({
        data: productosValidados.map(item => ({
          ordenId: id,
          productoId: item.productoId,
          cantidad: item.cantidad
        }))
      });
      
      // Obtener la orden actualizada
      const ordenActualizada = await prisma.orden.findUnique({
        where: { id },
        include: {
          usuario: {
            select: {
              id: true,
              email: true,
              nombre: true
            }
          },
          productos: {
            include: {
              producto: {
                select: {
                  id: true,
                  nombre: true,
                  precio: true,
                  imagen: true,
                  descripcion: true
                }
              }
            }
          }
        }
      });
      
      res.json({
        ...ordenActualizada,
        subtotal,
        totalItems: productosValidados.reduce((sum, item) => sum + item.cantidad, 0)
      });
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/ordenes/:id - Eliminar orden
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const ordenExistente = await prisma.orden.findUnique({
        where: { id }
      });
      
      if (!ordenExistente) {
        return res.status(404).json({ error: 'Orden no encontrada' });
      }
      
      // Eliminar productos de la orden primero
      await prisma.ordenProducto.deleteMany({
        where: { ordenId: id }
      });
      
      // Eliminar la orden
      await prisma.orden.delete({
        where: { id }
      });
      
      res.json({ message: 'Orden eliminada exitosamente' });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/ordenes/usuario/:usuarioId - Obtener órdenes de un usuario
  static async getByUsuario(req: Request, res: Response, next: NextFunction) {
    try {
      const { usuarioId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const skip = (Number(page) - 1) * Number(limit);
      
      // Verificar que el usuario exista
      const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId }
      });
      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      const [ordenes, total] = await Promise.all([
        prisma.orden.findMany({
          where: { usuarioId },
          include: {
            productos: {
              include: {
                producto: {
                  select: {
                    id: true,
                    nombre: true,
                    precio: true,
                    imagen: true
                  }
                }
              }
            }
          },
          skip,
          take: Number(limit),
          orderBy: { fechaOrden: 'desc' }
        }),
        prisma.orden.count({ where: { usuarioId } })
      ]);
      
      // Calcular totales para cada orden
      const ordenesConTotales = ordenes.map(orden => {
        const subtotal = orden.productos.reduce((sum, op) => {
          return sum + (op.producto.precio * op.cantidad);
        }, 0);
        
        return {
          ...orden,
          subtotal,
          totalItems: orden.productos.reduce((sum, op) => sum + op.cantidad, 0)
        };
      });
      
      res.json({
        usuario: {
          id: usuario.id,
          email: usuario.email,
          nombre: usuario.nombre
        },
        ordenes: ordenesConTotales,
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

  // GET /api/ordenes/mis-ordenes - Obtener órdenes del usuario actual
  static async getMisOrdenes(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = (req as any).usuario?.id;
      
      if (!usuarioId) {
        return res.status(401).json({ error: 'No autorizado' });
      }
      
      const { page = 1, limit = 10 } = req.query;
      
      const skip = (Number(page) - 1) * Number(limit);
      
      const [ordenes, total] = await Promise.all([
        prisma.orden.findMany({
          where: { usuarioId },
          include: {
            productos: {
              include: {
                producto: {
                  select: {
                    id: true,
                    nombre: true,
                    precio: true,
                    imagen: true
                  }
                }
              }
            }
          },
          skip,
          take: Number(limit),
          orderBy: { fechaOrden: 'desc' }
        }),
        prisma.orden.count({ where: { usuarioId } })
      ]);
      
      // Calcular totales para cada orden
      const ordenesConTotales = ordenes.map(orden => {
        const subtotal = orden.productos.reduce((sum, op) => {
          return sum + (op.producto.precio * op.cantidad);
        }, 0);
        
        return {
          ...orden,
          subtotal,
          totalItems: orden.productos.reduce((sum, op) => sum + op.cantidad, 0)
        };
      });
      
      res.json({
        ordenes: ordenesConTotales,
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
