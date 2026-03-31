import { Router } from 'express';
import { ProductoController } from '../controllers/productoController';

const router = Router();

// GET /api/productos - Obtener todos los productos
router.get('/', ProductoController.getAll);

// GET /api/productos/buscar/:termino - Buscar productos
router.get('/buscar/:termino', ProductoController.search);

// GET /api/productos/categoria/:nombre - Obtener productos por categoría
router.get('/categoria/:nombre', ProductoController.getByCategoria);

// GET /api/productos/:id - Obtener producto por ID
router.get('/:id', ProductoController.getById);

// POST /api/productos - Crear nuevo producto
router.post('/', ProductoController.create);

// PUT /api/productos/:id - Actualizar producto
router.put('/:id', ProductoController.update);

// DELETE /api/productos/:id - Eliminar producto
router.delete('/:id', ProductoController.delete);

export default router;
