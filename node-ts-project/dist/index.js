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
const app = express();
const port = 3001;
// Habilitar CORS para permitir solicitudes desde cualquier origen (o configura solo los orígenes necesarios)
app.use(cors());
app.use(express.json());
// Solicitud para testear que funciona
// app.post('/api/execute', (req: Request, res: Response) => {
//   console.log('Ejecutando función en el backend');
//   const data = req.body;
//   console.log(data);
//   res.json({ message: 'Función ejecutada correctamente' });
// });
// EJEMPLO - Endpoint para obtener un pedido por ID
// app.get('/pedido/:id', async (req: Request, res: Response) => {
//   const id = parseInt(req.params.id);
//   const pedido = await PedidoVenta.getById(id);
//   res.json(pedido);
// });
// Obtener todos los pedidos
app.post('/api/getAll', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Obteniendo todos los pedidos...');
    const allPedidos = yield PedidoVenta.getAll();
    console.log("Todos los pedidos: ", allPedidos);
    res.json({ allPedidos });
}));
// Editar un pedido por id
app.put('/api/editPedido/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const data = req.body;
    console.log("Pedido a editar: ", id, " \nDatos del pedido: ", data);
    const cambios = yield PedidoVenta.editById(parseInt(id), data);
    res.json(cambios);
}));
// Obtener los detalles de un pedido
app.put('/api/getDetallesById/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
