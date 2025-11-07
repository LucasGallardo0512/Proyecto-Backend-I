import express from 'express';
import ProductManager from '../products/productManager.js';
import uploader from '../utils/uploader.js';

const productManager = new ProductManager('./src/products/products.json');

export default function productsRouter(io) {
    const router = express.Router();

    router.post('/', uploader.single('file'), async (req, res) => {
        try {
            const { title, description, price } = req.body;
            const thumbnail = req.file
                ? req.file.filename
                : 'default-product.png';

            await productManager.addProduct({
                title,
                description,
                price: Number(price),
                status: true,
                stock: 10,
                category: 'general',
                thumbnail,
            });

            const updatedProducts = await productManager.getProducts();

            const isRealtime = req.headers['x-request-source'] === 'realtime';
            console.log('🔥 HEADER SOURCE:', req.headers['x-request-source']);
            console.log('🔥 METHOD:', req.method);

            if (isRealtime) {
                io.emit('updateProducts', updatedProducts);
                return res.json({ success: true });
            }

            res.redirect('/');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.delete('/:pid', async (req, res) => {
        try {
            const { pid } = req.params;
            await productManager.deleteProductById(pid);

            const updatedProducts = await productManager.getProducts();
            const isRealtime = req.headers['x-request-source'] === 'realtime';

            if (isRealtime) {
                io.emit('updateProducts', updatedProducts);
                return res.json({ success: true });
            }

            res.redirect('/');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    return router;
}
