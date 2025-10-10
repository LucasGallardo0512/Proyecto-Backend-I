import fs from 'fs/promises';
import crypto from 'crypto';

class CartManager {
    constructor(pathFile) {
        this.pathFile = pathFile;
    }

    createId() {
        return crypto.randomUUID();
    }

    async readFile() {
        try {
            const data = await fs.readFile(this.pathFile, 'utf-8');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            if (error.code === 'ENOENT') return []; // archivo no existe
            throw new Error(`Error al leer el archivo: ${error.message}`);
        }
    }

    async writeFile(data) {
        await fs.writeFile(
            this.pathFile,
            JSON.stringify(data, null, 2),
            'utf-8'
        );
    }

    async getCarts() {
        return await this.readFile();
    }

    async getCartById(cid) {
        const carts = await this.getCarts();
        const cart = carts.find((c) => c.id === cid);

        if (!cart) throw new Error('Carrito no encontrado');

        return cart;
    }

    async addCart(initialProducts = []) {
        const carts = await this.getCarts();
        const newCart = {
            id: this.createId(),
            products: initialProducts,
        };

        carts.push(newCart);

        await this.writeFile(carts);
        return newCart;
    }

    async deleteCartById(cid) {
        const carts = await this.getCarts();
        const cartIndex = carts.findIndex((c) => c.id === cid);
        if (cartIndex === -1) throw new Error('Carrito no encontrado');
        carts.splice(cartIndex, 1);
        await this.writeFile(carts);
    }

    async addOrUpdateProductInCart(cid, product, quantity = 1) {
        const carts = await this.getCarts();
        const cart = carts.find((c) => c.id === cid);
        if (!cart) throw new Error('Carrito no encontrado');

        const productIndex = cart.products.findIndex(
            (p) => p.id === product.id
        );
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ ...product, quantity });
        }

        await this.writeFile(carts);
        return cart;
    }

    async deleteProductFromCart(cid, pid, quantity = 1) {
        const carts = await this.getCarts();
        const cart = carts.find((c) => c.id === cid);
        if (!cart) throw new Error('Carrito no encontrado');

        const productIndex = cart.products.findIndex((p) => p.id === pid);
        if (productIndex === -1)
            throw new Error('Producto no encontrado en el carrito');

        const product = cart.products[productIndex];
        product.quantity -= quantity;

        if (product.quantity <= 0) {
            cart.products.splice(productIndex, 1);
        }

        await this.writeFile(carts);
        return cart;
    }
}

export default CartManager;
