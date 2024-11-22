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
  
	constructor(id: number, cliente: Cliente, fechaPedido: Date, nroComprobante: number, formaPago: string, observaciones: string, totalPedido: number) {
	  this.id = id;
	  this.cliente = cliente;
	  this.fechaPedido = fechaPedido;
	  this.nroComprobante = nroComprobante;
	  this.formaPago = formaPago;
	  this.observaciones = observaciones;
	  this.totalPedido = totalPedido;
	}
  
	// Métodos para interactuar con la base de datos
	static async getAll() {
		
		const connection = await pool.getConnection();
		const [pedidos]: any = await connection.query('SELECT * FROM pedido_venta JOIN cliente ON pedido_venta.idcliente = cliente.id WHERE eliminado = 0');

		const listapedidos:PedidoVenta[] = [];
		
		pedidos.map((pedido) => {

			const cliente = {
				id: pedido.idcliente,
				cuit: pedido.cuit,
				razonSocial: pedido.razonSocial
			}

			listapedidos.push(
				new PedidoVenta(
					pedido.id, 
					cliente, 
					pedido.fechaPedido, 
					pedido.nroComprobante, 
					pedido.formaPago, 
					pedido.observaciones, 
					pedido.totalPedido
				)
			)	
		})

		console.log("Lista pedidos: ", listapedidos)

		return listapedidos;
	}

	static async getById(id: number) {
		const pedido = await pool.query(`
			SELECT pedido_venta.*, cliente.*
			FROM pedido_venta
			JOIN cliente ON pedido_venta.idcliente = cliente.id
			WHERE pedido_venta.id = ? AND pedido_venta.eliminado = 0;
		`, [id]);
		return pedido;
	}

	static async getByDate(dates) {
		console.log("FECHAS: ", dates.fromDate);
		const pedido = await pool.query('SELECT * FROM pedido_venta WHERE fechaPedido BETWEEN ? AND ? AND eliminado = 0;', [dates.fromDate, dates.toDate]);
		return pedido;
	}

	static async editById(id: number, data) {
		const connection = await pool.getConnection(); // Obtén una conexión individual del pool
		try {
			await connection.beginTransaction(); // Inicia la transacción
	
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
	
			await connection.commit(); // Confirma los cambios
			console.log("Resultados del Query: ", cambios);
	
			return cambios;
		} catch (e) {
			await connection.rollback(); // Revierte los cambios en caso de error
			console.error("Error en la transacción, se hizo rollback:", e);
			throw e; // Re-lanza el error para manejo externo
		} finally {
			connection.release(); // Libera la conexión de vuelta al pool
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
		const connection = await pool.getConnection(); // Obtén una conexión del pool
		console.log("Pedido: ", idPedido);
	
		try {
			await connection.beginTransaction(); // Inicia la transacción
			console.log("Ejecutando query delete pedido...");
	
			const query = `
				UPDATE pedido_venta
				SET eliminado = 1
				WHERE id = ?;
			`;
	
			const pedidoEliminado = await connection.query(query, [idPedido]);
			console.log("Resultado DELETE pedido: ", pedidoEliminado);
	
			await connection.commit(); // Confirma los cambios
			return pedidoEliminado;
		} catch (e) {
			await connection.rollback(); // Revierte los cambios en caso de error
			console.error("Error en la transacción DELETE pedido: ", e);
			throw e; // Re-lanza el error para manejo externo
		} finally {
			connection.release(); // Libera la conexión de vuelta al pool
		}
	}
}
  