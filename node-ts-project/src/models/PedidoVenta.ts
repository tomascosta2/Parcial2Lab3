import { pool } from '../db.js'

export default class PedidoVenta {
	id: number;
	idCliente: number;
	fechaPedido: Date;
	nroComprobante: number;
	formaPago: string;
	observaciones: string;
	totalPedido: number;
  
	constructor(id: number, idCliente: number, fechaPedido: Date, nroComprobante: number, formaPago: string, observaciones: string, totalPedido: number) {
	  this.id = id;
	  this.idCliente = idCliente;
	  this.fechaPedido = fechaPedido;
	  this.nroComprobante = nroComprobante;
	  this.formaPago = formaPago;
	  this.observaciones = observaciones;
	  this.totalPedido = totalPedido;
	}
  
	// Métodos para interactuar con la base de datos
	static async getAll() {
		// Realiza la consulta para obtener el pedido por ID
		const pedidos = pool.query('SELECT * FROM pedido_venta');
		console.log("Pedidos", pedidos)
		return pedidos;
	}
	static async getById(id: number) {
		// Realiza la consulta para obtener el pedido por ID
		const pedido = await pool.query('SELECT * FROM pedido_venta WHERE id = ?', [id]);
		return pedido;
	}
	static async editById(id: number, data) {
		try {
			const cambios = await pool.query(
				`UPDATE pedido_venta
				 SET idcliente = ?, fechaPedido = ?, nroComprobante = ?, formaPago = ?, observaciones = ?, totalPedido = ?
				 WHERE id = ?`,
				[data.idcliente, data.fechaPedido, data.nroComprobante, data.formaPago, data.observaciones, data.totalPedido, id]
			  );
			console.log("Resultados del Query: ", cambios)
			return cambios;
		} catch (e) {			
			return e;
		}
	}
}
  