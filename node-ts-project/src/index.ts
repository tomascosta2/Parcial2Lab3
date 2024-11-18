import express, { Request, Response } from 'express';
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
app.post('/api/getAll', async (req: Request, res: Response) => {
  console.log('Obteniendo todos los pedidos...');
  
  const allPedidos = await PedidoVenta.getAll();
  console.log("Todos los pedidos: ", allPedidos)

  res.json({ allPedidos });
});

// Editar un pedido por id
app.put('/api/editPedido/:id', async (req: Request, res: Response) => {
  
  const { id } = req.params;
  const data = req.body;

  console.log("Pedido a editar: ", id, " \nDatos del pedido: ", data)

  const cambios = await PedidoVenta.editById(parseInt(id), data)

  res.json(cambios);
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
