import { pool } from '../db.js'
import PedidoVenta from './PedidoVenta.js';
import { Producto } from './Producto.js';

export class PedidoVentaDetalle {
	id: number;
	pedidoVenta: PedidoVenta;
	producto: Producto;
	cantidad: string;
	subtotal: string;

	constructor(id: number, pedidoVenta: PedidoVenta, producto: Producto, cantidad: string, subtotal: string) {
		this.id = id;
		this.pedidoVenta = pedidoVenta;
		this.producto = producto;
		this.cantidad = cantidad;
		this.subtotal = subtotal;
	}

	// Métodos para interactuar con la base de datos
	static async getByPedidoVenta(idPedidoVenta: number) {
		// Consulta para obtener los detalles de un pedido por su ID
		const detalles = await pool.query(
			`
		SELECT 
			pedido_venta_detalle.*, 
			producto.denominacion AS productoDenominacion
		FROM 
			pedido_venta_detalle
		JOIN 
			producto
		ON 
			pedido_venta_detalle.idProducto = producto.id
		WHERE 
			pedido_venta_detalle.idPedidoVenta = ? 
			AND pedido_venta_detalle.eliminado = 0
		`,
			[idPedidoVenta]
		);
		return detalles;
	}

	static async insertDetalle(detalleData) {
		console.log("Detalle: ", detalleData); // Detalle: { detalle: { id: '4', idProducto: '1', cantidad: '1', subTotal: '1' } }
		const { id, idPedidoVenta, idProducto, cantidad, subTotal } = detalleData.detalle;
		const connection = await pool.getConnection();
	
		try {
			await connection.beginTransaction();
			console.log("Ejecutando query insert detalle...");

			const query = `
				INSERT INTO pedido_venta_detalle (id, idPedidoVenta, idProducto, cantidad, subTotal)
				VALUES (?, ?, ?, ?, ?)
			`;
	
			const detalle = await connection.query(query, [id, idPedidoVenta, idProducto, cantidad, subTotal]);
	
			await connection.commit();
			console.log("Resultado INSERT detalle: ", detalle);
	
			return detalle;
		} catch (e) {
			await connection.rollback();
			console.error("Error insertando detalle, se hizo rollback: ", e);
			throw e;
		} finally {
			connection.release();
		}
	}

	static async deleteDetalle(idDetalle) {
		console.log("Detalle: ", idDetalle); // Detalle: { detalle: { id: '4', idProducto: '1', cantidad: '1', subTotal: '1' } }
		const connection = await pool.getConnection(); // Obtén una conexión individual
	
		try {
			await connection.beginTransaction(); // Inicia la transacción
			console.log("Ejecutando query delete detalle...");
	
			const query = `
				UPDATE pedido_venta_detalle
				SET eliminado = 1
				WHERE id = ?;
			`;
	
			const detalleEliminado = await connection.query(query, [idDetalle]);
			console.log("Resultado DELETE detalle: ", detalleEliminado);
	
			await connection.commit(); // Confirma los cambios
			return detalleEliminado;
		} catch (e) {
			await connection.rollback(); // Revierte los cambios en caso de error
			console.error("Error eliminando detalle, se hizo rollback: ", e);
			throw e; // Re-lanza el error para manejo externo
		} finally {
			connection.release(); // Libera la conexión de vuelta al pool
		}
	}
	

}
