var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import cors from 'cors';
import PedidoVenta from './models/PedidoVenta.js';
import { PedidoVentaDetalle } from './models/PedidoVentaDetalle.js';
import { Producto } from './models/Producto.js';
const app = express();
const port = 3001;
// Habilitar CORS para permitir solicitudes desde cualquier origen
app.use(cors());
app.use(express.json());
// Obtener todos los pedidos
app.post('/api/getAll', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Obteniendo todos los pedidos...');
    const { id } = req.body;
    if (id === '') {
        const allPedidos = yield PedidoVenta.getAll();
        console.log("Todos los pedidos: ", allPedidos);
        res.json({ allPedidos });
    }
    else {
        const allPedidos = yield PedidoVenta.getById(id);
        console.log("Pedido con id ", id, ": ", allPedidos);
        res.json({ allPedidos });
    }
}));
// Obtener los pedidos por fecha
app.post('/api/getPedidosByDate', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Obteniendo todos los pedidos...');
    const { dates } = req.body;
    const pedidosByDate = yield PedidoVenta.getByDate(dates);
    console.log("Todos los pedidos entre las fechas: ", pedidosByDate);
    res.json({ pedidosByDate });
}));
// Editar un pedido por id
app.put('/api/editPedido/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    console.log("Pedido a editar: ", id, " \nDatos del pedido: ", data);
    const cambios = yield PedidoVenta.editById(parseInt(id), data);
    res.json(cambios);
}));
// Crear un pedido
app.put('/api/createPedido', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    console.log("Creando pedido...");
    console.log("Datos del pedido: ", data);
    const cambios = yield PedidoVenta.createPedido(data);
    res.json(cambios);
}));
// Obtener los detalles de un pedido
app.get('/api/getDetallesById/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    console.log('Obteniendo los detalles del pedido con id ', id);
    const detalles = yield PedidoVentaDetalle.getByPedidoVenta(parseInt(id));
    console.log("Detalles obtenidos: ", detalles[0]);
    res.json({ detalles });
}));
// Insertar un detalle en un pedido
app.put('/api/insertDetalle', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    console.log("Datos para insertar recibidos en la URI: ", data);
    const detalle = yield PedidoVentaDetalle.insertDetalle(data);
    res.json({ detalle });
}));
// Eliminar un detalle
app.put('/api/deleteDetalle/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const detalleEliminado = yield PedidoVentaDetalle.deleteDetalle(id);
    res.json({ detalleEliminado });
}));
// Eliminar un pedido
app.put('/api/deletePedido/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const detalleEliminado = yield PedidoVenta.deleteById(id);
    res.json({ detalleEliminado });
}));
// Obtener todos los productos
app.get('/api/getAllProductos', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Obteniendo todos los productos...');
    const allProductos = yield Producto.getAll();
    console.log("Todos los productos: ", allProductos);
    res.json({ allProductos });
}));
// Cargar los detalles de un pedido
app.put('/api/uploadPedidoDetalles', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Cargando los detalles...');
    const { listaDeDetalles, pedidoId } = req.body;
    const detalles = yield PedidoVentaDetalle.uploadPedidoDetalles(listaDeDetalles, pedidoId);
    console.log("Todos los detalles: ", detalles);
    res.json({ detalles });
}));
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
