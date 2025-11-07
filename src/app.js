import express from 'express';
import http from 'http';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import methodOverride from 'method-override';

import viewsRouter from './routes/views.router.js';
import productsRouter from './routes/products.router.js';

const PORT = 8080;
const app = express();
const server = http.createServer(app);

const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.engine('handlebars', engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);
app.use('/api/products', productsRouter(io));

io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');
    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

server.listen(PORT, () => {
    console.log('Servidor corriendo correctamente en puerto ' + PORT);
});
