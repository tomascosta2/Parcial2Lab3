import { deflateRaw } from 'zlib';
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

	static async getByPedidoVenta(idPedidoVenta: number) {
		const connection = await pool.getConnection();
		try {
			await connection.beginTransaction();

			const [detalles]: any = await pool.query(
				`
			SELECT 
				pvd.id AS detalleId,
				pvd.idpedidoventa,
				pvd.idproducto,
				pvd.cantidad,
				pvd.subtotal,
				pvd.eliminado AS detalleEliminado,
				
				prod.codigoProducto,
				prod.denominacion AS productoDenominacion,
				prod.precioVenta AS productoPrecio,

				pv.id AS idPedido,
				pv.idcliente AS idCliente,
				pv.fechaPedido,
				pv.nroComprobante,
				pv.formaPago,
				pv.observaciones,
				pv.totalPedido,
				pv.eliminado
			FROM 
				pedido_venta_detalle AS pvd
			JOIN 
				producto AS prod
			ON 
				pvd.idProducto = prod.id
			JOIN 
				pedido_venta AS pv
			ON 
				pvd.idPedidoVenta = pv.id
			WHERE 
				pvd.idPedidoVenta = ?
				AND pvd.eliminado = 0;
			`,
				[idPedidoVenta]
			);

			console.log("Detalles del pedido: ", detalles)

			detalles.map((detalle) => {
				const producto = {
					id: detalle.idproducto,
					codigoProducto: detalle.codigoProducto,
					denominacion: detalle.productoDenominacion,
					precioVenta: detalle.productoPrecio
				};

				// !!! No tiene sentido agregar todo el objeto de pedido venta al detalle 
				// ya que cada detalle terminaria teniendo dentro todo el resto de detalles 
				// del pedido y ademas si estamos en este punto es porque ya obtuvimos toda la info del 
				// pedido.
				// 		const pedidoVenta = {
				// 			id: detalle.idpedidoventa,
				// 			idCliente: detalle.idCliente,
				// 			fechaPedido: detalle.fechaPedido,
				// 			nroComprobante: detalle.nroComprobante,
				// 			formaPago: detalle.formaPago,
				// 			observaciones: detalle.observaciones,
				// 			totalPedido: detalle.totalPedido,
				// 			eliminado: detalle.eliminado
				// 		};

				new PedidoVentaDetalle(
					detalle.id,
					detalle.idpedidoventa,
					producto,
					detalle.cantidad,
					detalle.subtotal
				);
			})

			await connection.commit();
			return detalles;
		} catch (e) {
			await connection.rollback();
			return e;
		} finally {
			connection.release();
		}
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
		const connection = await pool.getConnection();

		try {
			await connection.beginTransaction();
			console.log("Ejecutando query delete detalle...");

			const query = `
				UPDATE pedido_venta_detalle
				SET eliminado = 1
				WHERE id = ?;
			`;

			const detalleEliminado = await connection.query(query, [idDetalle]);
			console.log("Resultado DELETE detalle: ", detalleEliminado);

			await connection.commit();
			return detalleEliminado;
		} catch (e) {
			await connection.rollback();
			console.error("Error eliminando detalle, se hizo rollback: ", e);
			throw e;
		} finally {
			connection.release();
		}
	}

	static async uploadPedidoDetalles(listaDeDetalles, pedidoId) {
		console.log("Detalles: ", listaDeDetalles);
		const connection = await pool.getConnection();

		try {
			await connection.beginTransaction();

			const detalles = [];
			listaDeDetalles.map(async (d) => {
				const query = `
					INSERT IGNORE INTO pedido_venta_detalle (id, idpedidoventa, idproducto, cantidad, subTotal)
					VALUES (?, ?, ?, ?, ?)
				`;

				const detalle = await connection.query(query, [d.id, pedidoId, d.producto, d.cantidad, d.subtotal]);
				detalles.push(detalle);
			})

			await connection.commit();
			return detalles;
		} catch (e) {
			await connection.rollback();
			console.error("Error cargando detalles, se hizo rollback: ", e);
			throw e;
		} finally {
			connection.release();
		}
	}


}
