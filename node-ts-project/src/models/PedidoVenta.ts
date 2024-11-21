import { pool } from '../db.js';

export default class PedidoVenta {
	id: number;
	idCliente: number;
	fechaPedido: Date;
	nroComprobante: number;
	formaPago: string;
	observaciones: string;
	totalPedido: number;

	constructor(
		id: number,
		idCliente: number,
		fechaPedido: Date,
		nroComprobante: number,
		formaPago: string,
		observaciones: string,
		totalPedido: number
	) {
		this.id = id;
		this.idCliente = idCliente;
		this.fechaPedido = fechaPedido;
		this.nroComprobante = nroComprobante;
		this.formaPago = formaPago;
		this.observaciones = observaciones;
		this.totalPedido = totalPedido;
	}

	// Obtener todos los pedidos
	static async getAll() {
		const pedidos = await pool.query('SELECT * FROM pedido_venta WHERE eliminado = 0');
		console.log('Pedidos', pedidos);
		return pedidos;
	}

	// Obtener un pedido por ID
	static async getById(id: number) {
		const pedido = await pool.query('SELECT * FROM pedido_venta WHERE id = ? AND eliminado = 0', [id]);
		return pedido;
	}

	// Obtener pedidos por rango de fechas
	static async getByDate(dates: { fromDate: string; toDate: string }) {
		console.log('FECHAS: ', dates.fromDate);
		const pedido = await pool.query(
			'SELECT * FROM pedido_venta WHERE fechaPedido BETWEEN ? AND ? AND eliminado = 0;',
			[dates.fromDate, dates.toDate]
		);
		return pedido;
	}

	// Editar un pedido por ID con transacción
	static async editById(id: number, data: any) {
		const connection = await pool.getConnection();
		try {
			// Iniciar la transacción
			await connection.beginTransaction();

			// Actualizar el pedido
			const cambios = await connection.query(
				`UPDATE pedido_venta
				 SET idcliente = ?, fechaPedido = ?, nroComprobante = ?, formaPago = ?, observaciones = ?, totalPedido = ?
				 WHERE id = ?`,
				[
					data.idcliente,
					data.fechaPedido,
					data.nroComprobante,
					data.formaPago,
					data.observaciones,
					data.totalPedido,
					id,
				]
			);

			// Confirmar la transacción
			await connection.commit();
			return cambios;
		} catch (error) {
			// Revertir la transacción en caso de error
			await connection.rollback();
			console.error('Error al editar el pedido:', error);
			throw error;
		} finally {
			// Liberar la conexión
			connection.release();
		}
	}

	// Crear un pedido con transacción
	static async createPedido(data: any) {
		const connection = await pool.getConnection();
		try {
			// Iniciar la transacción
			await connection.beginTransaction();

			// Crear el pedido
			const [pedidoResult] = await connection.query(
				`INSERT INTO pedido_venta (idcliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido)
				 VALUES (?, ?, ?, ?, ?, ?);`,
				[data.idcliente, data.fechaPedido, data.nroComprobante, data.formaPago, data.observaciones, data.totalPedido]
			);

			// Obtener el ID del pedido recién creado
			const pedidoId = (pedidoResult as any).insertId;

			// Insertar los detalles del pedido
			for (const detalle of data.detalles) {
				await connection.query(
					`INSERT INTO pedido_venta_detalle (idPedidoVenta, idProducto, cantidad, subTotal)
					 VALUES (?, ?, ?, ?);`,
					[pedidoId, detalle.idProducto, detalle.cantidad, detalle.subTotal]
				);
			}

			// Confirmar la transacción
			await connection.commit();

			return { success: true, pedidoId };
		} catch (error) {
			// Revertir la transacción en caso de error
			await connection.rollback();
			console.error('Error al crear pedido:', error);
			throw error;
		} finally {
			// Liberar la conexión
			connection.release();
		}
	}

	// Eliminar un pedido por ID con transacción
	static async deleteById(idPedido: number) {
		const connection = await pool.getConnection();
		try {
			// Iniciar la transacción
			await connection.beginTransaction();

			// Marcar el pedido como eliminado
			const query = `
				UPDATE pedido_venta
				SET eliminado = 1
				WHERE id = ?;
			`;
			const pedidoEliminado = await connection.query(query, [idPedido]);

			// Confirmar la transacción
			await connection.commit();
			return pedidoEliminado;
		} catch (error) {
			// Revertir la transacción en caso de error
			await connection.rollback();
			console.error('Error al eliminar pedido:', error);
			throw error;
		} finally {
			// Liberar la conexión
			connection.release();
		}
	}
}
