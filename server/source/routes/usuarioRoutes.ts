import { Router } from 'express';
import { UsuarioController } from '../controllers/usuarioController';

const router = Router();

// GET /api/usuarios - Obtener todos los usuarios (solo admin)
router.get('/', UsuarioController.getAll);

// GET /api/usuarios/perfil - Obtener perfil del usuario actual
router.get('/perfil', UsuarioController.getProfile);

// GET /api/usuarios/:id - Obtener usuario por ID
router.get('/:id', UsuarioController.getById);

// POST /api/usuarios - Crear nuevo usuario
router.post('/', UsuarioController.create);

// PUT /api/usuarios/perfil - Actualizar perfil del usuario actual
router.put('/perfil', UsuarioController.updateProfile);

// PUT /api/usuarios/:id - Actualizar usuario
router.put('/:id', UsuarioController.update);

// DELETE /api/usuarios/:id - Eliminar usuario
router.delete('/:id', UsuarioController.delete);

export default router;
