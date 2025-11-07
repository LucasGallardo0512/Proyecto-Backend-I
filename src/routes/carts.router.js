import express from 'express';
import CartManager from '../carts/cartManager.js';

const cartsRouter = express.Router();
const cartManager = new CartManager('./src/carts/carts.json');

cartsRouter.get('/api/carts', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.json({ message: 'Lista de carritos', carts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.get('/api/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCartById(cid);
        res.json({ message: 'Carrito encontrado', cart });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

cartsRouter.post('/api/carts', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.json({ message: 'Carrito creado', newCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.post('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const quantity = parseInt(req.query.quantity);
        const qtyToUse = quantity > 0 ? quantity : undefined;

        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        const updatedCart = await cartManager.addOrUpdateProductInCart(
            cid,
            product,
            qtyToUse
        );
        res.json({ message: 'Producto agregado al carrito', updatedCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.delete('/api/carts/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const quantity = parseInt(req.query.quantity);
        const qtyToUse = quantity > 0 ? quantity : undefined;
        const updatedCart = await cartManager.deleteProductFromCart(
            cid,
            pid,
            qtyToUse
        );
        res.json({ message: 'Producto eliminado del carrito', updatedCart });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

cartsRouter.delete('/api/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        await cartManager.deleteCartById(cid);
        res.json({ message: `Carrito con id ${cid} eliminado correctamente` });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

export default productsRouter;
