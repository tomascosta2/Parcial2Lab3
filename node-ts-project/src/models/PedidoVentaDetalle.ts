import { pool } from '../db.js'

export class PedidoVentaDetalle {
	id: number;
	idPedidoVenta: number;
	idProducto: number;
	cantidad: string;
	subtotal: string;

	constructor(id: number, idPedidoVenta: number, idProducto: number, cantidad: string, subtotal: string) {
		this.id = id;
		this.idPedidoVenta = idPedidoVenta;
		this.idProducto = idProducto;
		this.cantidad = cantidad;
		this.subtotal = subtotal;
	}

	// Métodos para interactuar con la base de datos
	static async getByPedidoVenta(idPedidoVenta: number) {
		// Consulta para obtener los detalles de un pedido por su ID
		const detalles = await pool.query('SELECT * FROM pedido_venta_detalle WHERE idPedidoVenta = ? AND eliminado = 0', [idPedidoVenta]);
		return detalles;
	}

	static async insertDetalle(detalleData) {
		console.log("Detalle: ", detalleData) // Detalle:  { detalle: { id: '4', idProducto: '1', cantidad: '1', subTotal: '1' } }
		const { id, idPedidoVenta, idProducto, cantidad, subTotal } = detalleData.detalle;
		try {
			console.log("Ejecutando query insert detalle...")
			const query = `
				INSERT INTO pedido_venta_detalle (id, idPedidoVenta, idProducto, cantidad, subTotal)
				VALUES (?, ?, ?, ?, ?)
			`;

			const detalle = await pool.query(query, [id, idPedidoVenta, idProducto, cantidad, subTotal]);
			console.log("Resultado INSERT detalle: ", detalle)
			return detalle;
		} catch (e) {
			console.log("Error insertando detalle: ", e)
			return "Ocurrio un error en la ejecucion del Query";
		}
	}


	static async deleteDetalle(idDetalle) {
		console.log("Detalle: ", idDetalle) // Detalle:  { detalle: { id: '4', idProducto: '1', cantidad: '1', subTotal: '1' } }

		try {
			console.log("Ejecutando query delete detalle...")
			const query = `
				UPDATE pedido_venta_detalle
				SET eliminado = 1
				WHERE id = ?;
			`;

			const detalleEliminado = await pool.query(query, [idDetalle]);
			console.log("Resultado DELETE detalle: ", detalleEliminado)
			return detalleEliminado;
		} catch (e) {
			console.log("Error insertando detalle: ", e)
			return "Ocurrio un error en la ejecucion del Query";
		}
	}

}
