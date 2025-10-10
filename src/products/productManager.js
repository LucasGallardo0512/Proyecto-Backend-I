import fs from 'fs/promises';
import crypto from 'crypto';

class ProductManager {
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
            if (error.code === 'ENOENT') return [];
            throw new Error(`Error al leer archivo: ${error.message}`);
        }
    }

    async writeFile(data) {
        try {
            await fs.writeFile(
                this.pathFile,
                JSON.stringify(data, null, 2),
                'utf-8'
            );
        } catch (error) {
            throw new Error(`Error al escribir archivo: ${error.message}`);
        }
    }

    async getProducts() {
        return await this.readFile();
    }

    async getProductById(pid) {
        const products = await this.getProducts();
        const product = products.find((p) => p.id === pid);
        if (!product) throw new Error('Producto no encontrado');
        return product;
    }

    async addProduct(newProduct) {
        const requiredFields = [
            'title',
            'description',
            'price',
            'status',
            'stock',
            'category',
            'thumbnails',
        ];

        for (const field of requiredFields) {
            if (newProduct[field] === undefined || newProduct[field] === null) {
                throw new Error(`Falta el campo obligatorio: ${field}`);
            }
        }

        if (
            typeof newProduct.title !== 'string' ||
            newProduct.title.trim() === ''
        ) {
            throw new Error('El título debe ser un texto no vacío');
        }
        if (
            typeof newProduct.description !== 'string' ||
            newProduct.description.trim() === ''
        ) {
            throw new Error('La descripción debe ser un texto no vacío');
        }
        if (typeof newProduct.price !== 'number' || newProduct.price < 0) {
            throw new Error('El precio debe ser un número positivo');
        }
        if (typeof newProduct.status !== 'boolean') {
            throw new Error('El campo "status" debe ser booleano (true/false)');
        }
        if (typeof newProduct.stock !== 'number' || newProduct.stock < 0) {
            throw new Error('El stock debe ser un número positivo');
        }
        if (
            typeof newProduct.category !== 'string' ||
            newProduct.category.trim() === ''
        ) {
            throw new Error('La categoría debe ser un texto no vacío');
        }
        if (!Array.isArray(newProduct.thumbnails)) {
            throw new Error('El campo "thumbnails" debe ser un array');
        }

        const products = await this.getProducts();
        const product = {
            id: this.createId(),
            title: newProduct.title.trim(),
            description: newProduct.description.trim(),
            price: newProduct.price,
            status: newProduct.status,
            stock: newProduct.stock,
            category: newProduct.category.trim(),
            thumbnails: newProduct.thumbnails,
        };

        products.push(product);
        await this.writeFile(products);

        return product;
    }

    async setProductById(pid, updates) {
        const products = await this.getProducts();
        const index = products.findIndex((prod) => prod.id === pid);
        if (index === -1) throw new Error('Producto no encontrado');

        const { id, ...rest } = updates;
        const updatedProduct = { ...products[index], ...rest };
        products[index] = updatedProduct;

        await this.writeFile(products);
        return updatedProduct;
    }

    async deleteProductById(pid) {
        const products = await this.readFile();
        const index = products.findIndex((prod) => prod.id === pid);
        if (index === -1) throw new Error('Producto no encontrado');

        const [deletedProduct] = products.splice(index, 1);
        await this.writeFile(products);
        return deletedProduct;
    }
}

export default ProductManager;
