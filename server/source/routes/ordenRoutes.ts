import { Router } from 'express';
import { OrdenController } from '../controllers/ordenController';

const router = Router();

// GET /api/ordenes - Obtener todas las órdenes (solo admin)
router.get('/', OrdenController.getAll);

// GET /api/ordenes/mis-ordenes - Obtener órdenes del usuario actual
router.get('/mis-ordenes', OrdenController.getMisOrdenes);

// GET /api/ordenes/usuario/:usuarioId - Obtener órdenes de un usuario
router.get('/usuario/:usuarioId', OrdenController.getByUsuario);

// GET /api/ordenes/:id - Obtener orden por ID
router.get('/:id', OrdenController.getById);

// POST /api/ordenes - Crear nueva orden
router.post('/', OrdenController.create);

// PUT /api/ordenes/:id - Actualizar orden
router.put('/:id', OrdenController.update);

// DELETE /api/ordenes/:id - Eliminar orden
router.delete('/:id', OrdenController.delete);

export default router;
