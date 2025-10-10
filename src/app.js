import express from 'express';
import ProductManager from './products/productManager.js';
import CartManager from './carts/cartManager.js';

const PORT = 8080;
const app = express();
app.use(express.json());
const productManager = new ProductManager('./src/products/products.json');
const cartManager = new CartManager('./src/carts/carts.json');

app.get('/', (req, res) => {
    res.json({ status: 'success', message: 'Hola' });
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json({ message: 'Lista de productos', products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    const newProduct = req.body;
    try {
        const product = await productManager.addProduct(newProduct);
        res.status(201).json({ message: 'Producto agregado', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/products/:pid', async (req, res) => {
    const { pid } = req.params;
    const updates = req.body;
    try {
        const updatedProduct = await productManager.setProductById(
            pid,
            updates
        );
        res.json({ message: 'Producto Actualizado', updatedProduct });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.delete('/api/products/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        await productManager.deleteProductById(pid);
        res.json({ message: 'Producto de id ' + pid + ' eliminado' });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.get('/api/carts', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();
        res.json({ message: 'Lista de carritos', carts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.getCartById(cid);
        res.json({ message: 'Carrito encontrado', cart });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.post('/api/carts', async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.json({ message: 'Carrito creado', newCart });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/carts/:cid/product/:pid', async (req, res) => {
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

app.delete('/api/carts/:cid/product/:pid', async (req, res) => {
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

app.delete('/api/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params;
        await cartManager.deleteCartById(cid);
        res.json({ message: `Carrito con id ${cid} eliminado correctamente` });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log('Servidor corriendo correctamente en puerto ' + PORT);
});
