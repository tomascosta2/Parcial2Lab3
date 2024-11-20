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
		const pedidos = pool.query('SELECT * FROM pedido_venta WHERE eliminado = 0');
		console.log("Pedidos", pedidos)
		return pedidos;
	}

	static async getById(id: number) {
		const pedido = await pool.query('SELECT * FROM pedido_venta WHERE id = ? AND eliminado = 0', [id]);
		return pedido;
	}

	static async getByDate(dates) {
		console.log("FECHAS: ", dates.fromDate);
		const pedido = await pool.query('SELECT * FROM pedido_venta WHERE fechaPedido BETWEEN ? AND ? AND eliminado = 0;', [dates.fromDate, dates.toDate]);
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

	static async createPedido(data) {
		try {
			const cambios = await pool.query(
				`INSERT INTO pedido_venta (idcliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido)
				VALUES (?, ?, ?, ?, ?, ?);`,
				[data.idcliente, data.fechaPedido, data.nroComprobante, data.formaPago, data.observaciones, data.totalPedido]
			  );
			console.log("Resultados del Query: ", cambios)
			return cambios;
		} catch (e) {			
			console.log(e)
			return e;
		}
	}

	static async deleteById(idPedido) {
		console.log("Pedido: ", idPedido)
		
		try {
			console.log("Ejecutando query delete pedido...")
			const query = `
				UPDATE pedido_venta
				SET eliminado = 1
				WHERE id = ?;
			`;
			
			const pedidoEliminado = await pool.query(query, [idPedido]);
	  		console.log("Resultado DELETE pedido: ", pedidoEliminado)
			return pedidoEliminado;
		} catch (e) {
			console.log("Error insertando pedido: ", e)
			return "Ocurrio un error en la ejecucion del Query";
		}
	}
}
  