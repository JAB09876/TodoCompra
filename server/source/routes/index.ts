import { Router } from 'express';
import productoRoutes from './productoRoutes';
import categoriaRoutes from './categoriaRoutes';
import usuarioRoutes from './usuarioRoutes';
import ordenRoutes from './ordenRoutes';

const router = Router();

// Rutas de productos
router.use('/productos', productoRoutes);

// Rutas de categorías
router.use('/categorias', categoriaRoutes);

// Rutas de usuarios
router.use('/usuarios', usuarioRoutes);

// Rutas de órdenes
router.use('/ordenes', ordenRoutes);

export default router;
