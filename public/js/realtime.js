document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const form = document.getElementById('realtimeForm');
    const productList = document.querySelector('.products');

    if (!form || !productList) {
        console.error('No se encontró el formulario o la lista de productos.');
        return;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);

        try {
            const res = await fetch('/api/products?source=realtime', {
                method: 'POST',
                body: formData,
                headers: {
                    'x-request-source': 'realtime',
                },
            });

            if (!res.ok) throw new Error('Error al agregar producto');
            form.reset();
        } catch (err) {
            console.error('Error al agregar producto:', err);
        }
    });

    socket.on('updateProducts', (products) => {
        console.log('Productos actualizados:', products);
        productList.innerHTML = '';

        products.forEach((p) => {
            const li = document.createElement('li');
            li.classList.add('product-item');
            li.innerHTML = `
                <form action="/api/products/${p.id}?_method=DELETE" method="POST" class="delete-form">
                    <button type="submit" class="delete-btn">✕</button>
                </form>
                <img class="product-img" src="/img/img-products/${p.thumbnail}" alt="${p.title}" />
                <h3 class="product-title">${p.title}</h3>
                <p class="product-desc">${p.description}</p>
                <span>$${p.price}</span>
            `;
            productList.appendChild(li);
        });

        document.querySelectorAll('.delete-form').forEach((f) => {
            f.addEventListener('submit', async (e) => {
                e.preventDefault();
                const url = f.action;

                try {
                    const res = await fetch(url, {
                        method: 'POST',
                        headers: { 'x-request-source': 'realtime' },
                    });

                    if (!res.ok) throw new Error('Error al eliminar producto');
                } catch (err) {
                    console.error('Error al eliminar producto:', err);
                }
            });
        });
    });
});
