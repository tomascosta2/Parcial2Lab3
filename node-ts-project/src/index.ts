import express, { Request, Response } from 'express';
import cors from 'cors';
import PedidoVenta from './models/PedidoVenta.js';
import { PedidoVentaDetalle } from './models/PedidoVentaDetalle.js';

const app = express();
const port = 3001;

// Habilitar CORS para permitir solicitudes desde cualquier origen
app.use(cors());
app.use(express.json());

// Obtener todos los pedidos
app.post('/api/getAll', async (req: Request, res: Response) => {
  console.log('Obteniendo todos los pedidos...');

  const { id } = req.body;

  if (id === '') {
    const allPedidos = await PedidoVenta.getAll();
    // console.log("Todos los pedidos: ", allPedidos)
    res.json({ allPedidos });
  } else {
    const allPedidos = await PedidoVenta.getById(id);
    console.log("Pedido con id ", id, ": ", allPedidos)
    res.json({ allPedidos });
  }

});

// Obtener los pedidos por fecha
app.post('/api/getPedidosByDate', async (req: Request, res: Response) => {
  console.log('Obteniendo todos los pedidos...');

  const { dates } = req.body;

  const pedidosByDate = await PedidoVenta.getByDate(dates);
  console.log("Todos los pedidos entre las fechas: ", pedidosByDate)
  res.json({ pedidosByDate });

});

// Editar un pedido por id
app.put('/api/editPedido/:id', async (req: Request, res: Response) => {

  const { id } = req.params;
  const data = req.body;

  console.log("Pedido a editar: ", id, " \nDatos del pedido: ", data)

  const cambios = await PedidoVenta.editById(parseInt(id), data)

  res.json(cambios);
});

// Crear un pedido
app.put('/api/createPedido', async (req: Request, res: Response) => {

  const data = req.body;

  console.log("Creando pedido...")
  console.log("Datos del pedido: ", data)

  const cambios = await PedidoVenta.createPedido(data)

  res.json(cambios);
});

// Obtener los detalles de un pedido
app.put('/api/getDetallesById/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log('Obteniendo los detalles del pedido con id ', id);

  const detalles = await PedidoVentaDetalle.getByPedidoVenta(parseInt(id));
  console.log("Detalles obtenidos: ", detalles[0])

  res.json({ detalles });
});

// Insertar un detalle en un pedido
app.put('/api/insertDetalle', async (req: Request, res: Response) => {
  const data = req.body;
  console.log("Datos para insertar recibidos en la URI: ", data)
  const detalle = await PedidoVentaDetalle.insertDetalle(data);

  res.json({ detalle });
});

// Eliminar un detalle
app.put('/api/deleteDetalle/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const detalleEliminado = await PedidoVentaDetalle.deleteDetalle(id);

  res.json({ detalleEliminado });
});

// Eliminar un pedido
app.put('/api/deletePedido/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  const detalleEliminado = await PedidoVenta.deleteById(id);

  res.json({ detalleEliminado });
});


app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
