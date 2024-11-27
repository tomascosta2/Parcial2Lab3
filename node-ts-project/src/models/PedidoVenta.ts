import { pool } from '../db.js'
import { Cliente } from './Cliente.js';
import { PedidoVentaDetalle } from './PedidoVentaDetalle.js';

export default class PedidoVenta {
	id: number;
	cliente: Cliente;
	fechaPedido: Date;
	nroComprobante: number;
	formaPago: string;
	observaciones: string;
	totalPedido: number;
	detalles: PedidoVentaDetalle[];

	constructor(id: number, cliente: Cliente, fechaPedido: Date, nroComprobante: number, formaPago: string, observaciones: string, totalPedido: number, detalles: PedidoVentaDetalle[]) {
		this.id = id;
		this.cliente = cliente;
		this.fechaPedido = fechaPedido;
		this.nroComprobante = nroComprobante;
		this.formaPago = formaPago;
		this.observaciones = observaciones;
		this.totalPedido = totalPedido;
		this.detalles = detalles;
	}

	// Métodos para interactuar con la base de datos
	static async getAll() {

		const connection = await pool.getConnection();
		try {
			await connection.beginTransaction();
			const [pedidos]: any = await connection.query(`
				SELECT
				pedido_venta.id AS id,
				pedido_venta.idcliente AS idcliente,
				pedido_venta.fechaPedido,
				pedido_venta.nroComprobante,
				pedido_venta.formaPago,
				pedido_venta.observaciones,
				pedido_venta.totalPedido,
				pedido_venta.eliminado,
				cliente.id AS cliente_id,
				cliente.cuit,
				cliente.razonSocial 
				FROM pedido_venta 
				JOIN cliente ON pedido_venta.idcliente = cliente.id 
				WHERE eliminado = 0
			`);

			const listapedidos: PedidoVenta[] = [];

			for (const pedido of pedidos) {
				const cliente = {
					id: pedido.idcliente,
					cuit: pedido.cuit,
					razonSocial: pedido.razonSocial
				};

				console.log("Mapeando pedido:", pedido.id);
				try {
					const detalles: any = await PedidoVentaDetalle.getByPedidoVenta(pedido.id);
					console.log("Detalles del pedido: ", detalles);

					listapedidos.push(new PedidoVenta(
						pedido.id,
						cliente,
						pedido.fechaPedido,
						pedido.nroComprobante,
						pedido.formaPago,
						pedido.observaciones,
						pedido.totalPedido,
						detalles
					));
					console.log("Pedido agregado a la lista: ", listapedidos[listapedidos.length - 1]);
				} catch (e) {
					console.log("Error mapeando pedido: ", e);
				}
			}

			console.log("Lista completa de pedidos: ", listapedidos);

			await connection.commit();
			return listapedidos;
		} catch (e) {
			await connection.rollback();
			return e;
		}
	}

	static async getById(id: number) {
		const connection = await pool.getConnection();
		try {
			await connection.beginTransaction();
			const [pedido]: any = await pool.query(`
				SELECT
				pedido_venta.id AS id,
				pedido_venta.idcliente AS idcliente,
				pedido_venta.fechaPedido,
				pedido_venta.nroComprobante,
				pedido_venta.formaPago,
				pedido_venta.observaciones,
				pedido_venta.totalPedido,
				pedido_venta.eliminado,
				cliente.id AS cliente_id,
				cliente.cuit,
				cliente.razonSocial
				FROM pedido_venta 
				JOIN cliente 
				ON pedido_venta.idcliente = cliente.id 
				WHERE pedido_venta.id = ? AND pedido_venta.eliminado = 0;
			`, [id]);

			const cliente = {
				id: pedido[0].idcliente,
				cuit: pedido[0].cuit,
				razonSocial: pedido[0].razonSocial
			}

			const detalles: any = await PedidoVentaDetalle.getByPedidoVenta(id);
			console.log("Detalles del pedido: ", detalles);

			const finalPedido = new PedidoVenta(
				pedido[0].id,
				cliente,
				pedido[0].fechaPedido,
				pedido[0].nroComprobante,
				pedido[0].formaPago,
				pedido[0].observaciones,
				pedido[0].totalPedido,
				detalles
			)

			await connection.commit();
			return finalPedido;
		} catch (e) {
			await connection.rollback();
			return e
		} finally {
			connection.release();
		}
	}

	static async getByDate(dates) {
		const connection = await pool.getConnection();
		try {
			await connection.beginTransaction();
			console.log("FECHAS: ", dates.fromDate);
			const [pedidos]: any = await pool.query(`
				SELECT 
				pedido_venta.id AS id,
				pedido_venta.idcliente AS idcliente,
				pedido_venta.fechaPedido,
				pedido_venta.nroComprobante,
				pedido_venta.formaPago,
				pedido_venta.observaciones,
				pedido_venta.totalPedido,
				pedido_venta.eliminado,
				cliente.id AS cliente_id,
				cliente.cuit,
				cliente.razonSocial
				FROM pedido_venta 
				JOIN cliente 
				ON pedido_venta.idcliente = cliente.id 
				WHERE fechaPedido BETWEEN ? AND ? AND eliminado = 0;
				`, [dates.fromDate, dates.toDate]);

			console.log("PEDIDO POR FECHA: ", pedidos)

			const listapedidos: PedidoVenta[] = [];

			pedidos.map((pedido) => {

				const cliente = {
					id: pedido.idcliente,
					cuit: pedido.cuit,
					razonSocial: pedido.razonSocial
				}

				// TODO: descomentar y corregir
				// listapedidos.push(
				// 	new PedidoVenta(
				// 		pedido.id, 
				// 		cliente, 
				// 		pedido.fechaPedido, 
				// 		pedido.nroComprobante, 
				// 		pedido.formaPago, 
				// 		pedido.observaciones, 
				// 		pedido.totalPedido
				// 	)
				// )	
			})

			await connection.commit();
			return listapedidos;
		} catch (e) {
			await connection.rollback();
			return e;
		} finally {
			connection.release();
		}
	}

	static async editById(id: number, data) {
		const connection = await pool.getConnection();
		try {
			await connection.beginTransaction();

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
					id
				]
			);

			await connection.commit();
			console.log("Resultados del Query: ", cambios);

			return cambios;
		} catch (e) {
			await connection.rollback();
			console.error("Error en la transacción, se hizo rollback:", e);
			throw e;
		} finally {
			connection.release();
		}
	}

	static async createPedido(data) {
		const connection = await pool.getConnection();
		try {
			await connection.beginTransaction();

			const cambios = await connection.query(
				`INSERT INTO pedido_venta (idcliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido)
				 VALUES (?, ?, ?, ?, ?, ?);`,
				[data.idcliente, data.fechaPedido, data.nroComprobante, data.formaPago, data.observaciones, data.totalPedido]
			);

			await connection.commit();
			console.log("Resultados del Query: ", cambios);

			return cambios;
		} catch (e) {
			await connection.rollback();
			console.error("Error en la transacción, se hizo rollback:", e);
			throw e;
		} finally {
			connection.release();
		}
	}

	static async deleteById(idPedido) {
		const connection = await pool.getConnection();
		console.log("Pedido: ", idPedido);

		try {
			await connection.beginTransaction();
			console.log("Ejecutando query delete pedido...");

			const query = `
				UPDATE pedido_venta
				SET eliminado = 1
				WHERE id = ?;
			`;

			const pedidoEliminado = await connection.query(query, [idPedido]);
			console.log("Resultado DELETE pedido: ", pedidoEliminado);

			await connection.commit();
			return pedidoEliminado;
		} catch (e) {
			await connection.rollback();
			console.error("Error en la transacción DELETE pedido: ", e);
			throw e;
		} finally {
			connection.release();
		}
	}
}
