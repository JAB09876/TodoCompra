import { Router } from 'express';
import { CategoriaController } from '../controllers/categoriaController';

const router = Router();

// GET /api/categorias - Obtener todas las categorías
router.get('/', CategoriaController.getAll);

// GET /api/categorias/:id - Obtener categoría por ID
router.get('/:id', CategoriaController.getById);

// GET /api/categorias/:nombre/productos - Obtener productos de una categoría
router.get('/:nombre/productos', CategoriaController.getProductos);

// POST /api/categorias - Crear nueva categoría
router.post('/', CategoriaController.create);

// PUT /api/categorias/:id - Actualizar categoría
router.put('/:id', CategoriaController.update);

// DELETE /api/categorias/:id - Eliminar categoría
router.delete('/:id', CategoriaController.delete);

export default router;
