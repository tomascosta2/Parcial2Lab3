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
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
