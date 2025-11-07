import express from 'express';
import ProductManager from '../products/productManager.js';

const viewsRouter = express.Router();
const productManager = new ProductManager('./src/products/products.json');

viewsRouter.get('/', async (req, res) => {
    const products = await productManager.getProducts();

    res.render('home', { products });
});

viewsRouter.get('/realtimeproducts', async (req, res) => {
    const products = await productManager.getProducts();

    res.render('realtimeproducts', { products });
});

export default viewsRouter;
