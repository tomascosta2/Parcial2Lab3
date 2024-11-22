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

	static async getByPedidoVenta(idPedidoVenta: number): Promise<PedidoVentaDetalle[]> {
		const connection = await pool.getConnection();
		try {
			const [detalles]: any = await connection.query(
				'SELECT * FROM pedido_venta_detalle WHERE idPedidoVenta = ? AND eliminado = 0',
				[idPedidoVenta]
			);
	
			const listaDetalles: PedidoVentaDetalle[] = detalles.map((detalle: any) => {
				return new PedidoVentaDetalle(
					detalle.id,
					detalle.idPedidoVenta,
					detalle.idProducto,
					detalle.cantidad,
					detalle.subtotal
				);
			});
	
			console.log("Lista detalles del pedido: ", listaDetalles);
			return listaDetalles;
		} catch (error) {
			console.error("Error obteniendo detalles del pedido: ", error);
			throw new Error("Error al obtener los detalles del pedido");
		} finally {
			connection.release();
		}
	}
	
	/*
	static async getByPedidoVenta(idPedidoVenta: number): Promise<PedidoVentaDetalle[]> {
		const connection = await pool.getConnection();
		try {
			// Realizar la consulta
			const [detalles]: any = await connection.query(
				'SELECT * FROM pedido_venta_detalle WHERE idPedidoVenta = ? AND eliminado = 0',
				[idPedidoVenta]
			);
	
			// Mapear los resultados a una lista de objetos PedidoVentaDetalle
			const listaDetalles: PedidoVentaDetalle[] = detalles.map((detalle: any) => {
				return new PedidoVentaDetalle(
					detalle.id,
					detalle.idPedidoVenta,
					detalle.idProducto,
					detalle.cantidad,
					detalle.subtotal
				);
			});
	
			console.log("Lista detalles del pedido: ", listaDetalles);
			return listaDetalles;
		} catch (error) {
			console.error("Error obteniendo detalles del pedido: ", error);
			throw new Error("Error al obtener los detalles del pedido");
		} finally {
			// Liberar la conexión al pool
			connection.release();
		}
	}
	*/

	/*
	// Métodos para interactuar con la base de datos
	static async getByPedidoVenta(idPedidoVenta: number) {
		// Consulta para obtener los detalles de un pedido por su ID
		const detalles = await pool.query('SELECT * FROM pedido_venta_detalle WHERE idPedidoVenta = ? AND eliminado = 0', [idPedidoVenta]);
		return detalles;
	}

	*/

	static async insertDetalle(detalleData: {
		detalle: {
			id: number;
			idPedidoVenta: number;
			idProducto: number;
			cantidad: string;
			subTotal: string;
		};
	}): Promise<PedidoVentaDetalle> {
		const { id, idPedidoVenta, idProducto, cantidad, subTotal } = detalleData.detalle;
	
		try {
			console.log("Ejecutando query insert detalle...");
			const query = `
				INSERT INTO pedido_venta_detalle (id, idPedidoVenta, idProducto, cantidad, subTotal)
				VALUES (?, ?, ?, ?, ?)
			`;
			await pool.query(query, [id, idPedidoVenta, idProducto, cantidad, subTotal]);
	
			// Devuelve el detalle como una instancia de PedidoVentaDetalle
			return new PedidoVentaDetalle(id, idPedidoVenta, idProducto, cantidad, subTotal);
		} catch (e) {
			console.error("Error insertando detalle: ", e);
			throw new Error("Ocurrió un error al insertar el detalle");
		}
	}
	
	/*
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
*/

static async deleteDetalle(idDetalle: number): Promise<{ success: boolean; message: string }> {
    try {
        console.log("Ejecutando query delete detalle...");
        const query = `
            UPDATE pedido_venta_detalle
            SET eliminado = 1
            WHERE id = ?;
        `;
        const [result]: any = await pool.query(query, [idDetalle]);

        if (result.affectedRows > 0) {
            return { success: true, message: `Detalle con ID ${idDetalle} eliminado exitosamente` };
        } else {
            return { success: false, message: `Detalle con ID ${idDetalle} no encontrado o ya eliminado` };
        }
    } catch (e) {
        console.error("Error eliminando detalle: ", e);
        throw new Error("Ocurrió un error al eliminar el detalle");
    }
}

/*
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
		*/

}
