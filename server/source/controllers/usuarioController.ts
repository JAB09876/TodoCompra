import { Request, Response, NextFunction } from 'express';
import prisma from '../database';
import bcrypt from 'bcryptjs';

export class UsuarioController {
  // GET /api/usuarios - Obtener todos los usuarios (solo admin)
  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, role } = req.query;
      
      const skip = (Number(page) - 1) * Number(limit);
      
      const where: any = {};
      if (role) {
        where.role = role as string;
      }
      
      const [usuarios, total] = await Promise.all([
        prisma.usuario.findMany({
          where,
          select: {
            id: true,
            email: true,
            nombre: true,
            role: true,
            ordenes: {
              select: {
                id: true,
                fechaOrden: true
              }
            },
            createdAt: true
          },
          skip,
          take: Number(limit),
          orderBy: { createdAt: 'desc' }
        }),
        prisma.usuario.count({ where })
      ]);
      
      res.json({
        usuarios,
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

  // GET /api/usuarios/:id - Obtener usuario por ID
  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const usuario = await prisma.usuario.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          nombre: true,
          role: true,
          ordenes: {
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
            }
          }
        }
      });
      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  }

  // POST /api/usuarios - Crear nuevo usuario
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, nombre, password, role = 'USER' } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ 
          error: 'Email y password son requeridos' 
        });
      }
      
      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          error: 'Email no válido' 
        });
      }
      
      // Verificar si el email ya existe
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email }
      });
      
      if (usuarioExistente) {
        return res.status(409).json({ 
          error: 'El email ya está registrado' 
        });
      }
      
      // Validar rol
      if (!['USER', 'ADMIN'].includes(role)) {
        return res.status(400).json({ 
          error: 'Rol no válido. Debe ser USER o ADMIN' 
        });
      }
      
      // Encriptar password
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);
      
      const usuario = await prisma.usuario.create({
        data: {
          email: email.toLowerCase().trim(),
          nombre: nombre?.trim() || '',
          password: passwordHash,
          role
        },
        select: {
          id: true,
          email: true,
          nombre: true,
          role: true,
          createdAt: true
        }
      });
      
      res.status(201).json(usuario);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/usuarios/:id - Actualizar usuario
  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { email, nombre, password, role } = req.body;
      
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { id }
      });
      
      if (!usuarioExistente) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      const updateData: any = {};
      
      if (email !== undefined) {
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ 
            error: 'Email no válido' 
          });
        }
        
        // Verificar si el email ya existe (excepto el actual)
        const emailExistente = await prisma.usuario.findFirst({
          where: { 
            email: email.toLowerCase().trim(),
            id: { not: id }
          }
        });
        
        if (emailExistente) {
          return res.status(409).json({ 
            error: 'El email ya está registrado' 
          });
        }
        
        updateData.email = email.toLowerCase().trim();
      }
      
      if (nombre !== undefined) {
        updateData.nombre = nombre.trim();
      }
      
      if (password !== undefined) {
        if (password.length < 6) {
          return res.status(400).json({ 
            error: 'El password debe tener al menos 6 caracteres' 
          });
        }
        
        const salt = await bcrypt.genSalt(12);
        updateData.password = await bcrypt.hash(password, salt);
      }
      
      if (role !== undefined) {
        if (!['USER', 'ADMIN'].includes(role)) {
          return res.status(400).json({ 
            error: 'Rol no válido. Debe ser USER o ADMIN' 
          });
        }
        updateData.role = role;
      }
      
      const usuario = await prisma.usuario.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          email: true,
          nombre: true,
          role: true,
          createdAt: true
        }
      });
      
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  }

  // DELETE /api/usuarios/:id - Eliminar usuario
  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { id },
        include: {
          ordenes: true
        }
      });
      
      if (!usuarioExistente) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      // Verificar si tiene órdenes asociadas
      if (usuarioExistente.ordenes.length > 0) {
        return res.status(400).json({ 
          error: 'No se puede eliminar el usuario porque tiene órdenes asociadas' 
        });
      }
      
      await prisma.usuario.delete({
        where: { id }
      });
      
      res.json({ message: 'Usuario eliminado exitosamente' });
    } catch (error) {
      next(error);
    }
  }

  // GET /api/usuarios/perfil - Obtener perfil del usuario actual
  static async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      // Aquí normalmente obtendrías el ID del usuario del token JWT
      // Por ahora, vamos a simular que viene del middleware de autenticación
      const usuarioId = (req as any).usuario?.id;
      
      if (!usuarioId) {
        return res.status(401).json({ error: 'No autorizado' });
      }
      
      const usuario = await prisma.usuario.findUnique({
        where: { id: usuarioId },
        select: {
          id: true,
          email: true,
          nombre: true,
          role: true,
          ordenes: {
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
            }
          }
        }
      });
      
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  }

  // PUT /api/usuarios/perfil - Actualizar perfil del usuario actual
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarioId = (req as any).usuario?.id;
      
      if (!usuarioId) {
        return res.status(401).json({ error: 'No autorizado' });
      }
      
      const { nombre, email, passwordActual, passwordNuevo } = req.body;
      
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { id: usuarioId }
      });
      
      if (!usuarioExistente) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      const updateData: any = {};
      
      if (nombre !== undefined) {
        updateData.nombre = nombre.trim();
      }
      
      if (email !== undefined) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          return res.status(400).json({ 
            error: 'Email no válido' 
          });
        }
        
        const emailExistente = await prisma.usuario.findFirst({
          where: { 
            email: email.toLowerCase().trim(),
            id: { not: usuarioId }
          }
        });
        
        if (emailExistente) {
          return res.status(409).json({ 
            error: 'El email ya está registrado' 
          });
        }
        
        updateData.email = email.toLowerCase().trim();
      }
      
      if (passwordNuevo !== undefined) {
        if (!passwordActual) {
          return res.status(400).json({ 
            error: 'Se requiere el password actual para cambiar el password' 
          });
        }
        
        if (passwordNuevo.length < 6) {
          return res.status(400).json({ 
            error: 'El nuevo password debe tener al menos 6 caracteres' 
          });
        }
        
        // Verificar password actual
        const passwordValido = await bcrypt.compare(passwordActual, usuarioExistente.password);
        if (!passwordValido) {
          return res.status(400).json({ 
            error: 'Password actual incorrecto' 
          });
        }
        
        const salt = await bcrypt.genSalt(12);
        updateData.password = await bcrypt.hash(passwordNuevo, salt);
      }
      
      const usuario = await prisma.usuario.update({
        where: { id: usuarioId },
        data: updateData,
        select: {
          id: true,
          email: true,
          nombre: true,
          role: true,
          createdAt: true
        }
      });
      
      res.json(usuario);
    } catch (error) {
      next(error);
    }
  }
}
