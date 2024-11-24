var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { pool } from '../db.js';
export class PedidoVentaDetalle {
    constructor(id, pedidoVenta, producto, cantidad, subtotal) {
        this.id = id;
        this.pedidoVenta = pedidoVenta;
        this.producto = producto;
        this.cantidad = cantidad;
        this.subtotal = subtotal;
    }
    static getByPedidoVenta(idPedidoVenta) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield pool.getConnection();
            try {
                yield connection.beginTransaction();
                const [detalles] = yield pool.query(`
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
			`, [idPedidoVenta]);
                console.log("Detalles del pedido: ", detalles);
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
                    new PedidoVentaDetalle(detalle.id, detalle.idpedidoventa, producto, detalle.cantidad, detalle.subtotal);
                });
                yield connection.commit();
                return detalles;
            }
            catch (e) {
                yield connection.rollback();
                return e;
            }
            finally {
                connection.release();
            }
        });
    }
    static insertDetalle(detalleData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Detalle: ", detalleData); // Detalle: { detalle: { id: '4', idProducto: '1', cantidad: '1', subTotal: '1' } }
            const { id, idPedidoVenta, idProducto, cantidad, subTotal } = detalleData.detalle;
            const connection = yield pool.getConnection();
            try {
                yield connection.beginTransaction();
                console.log("Ejecutando query insert detalle...");
                const query = `
				INSERT INTO pedido_venta_detalle (id, idPedidoVenta, idProducto, cantidad, subTotal)
				VALUES (?, ?, ?, ?, ?)
			`;
                const detalle = yield connection.query(query, [id, idPedidoVenta, idProducto, cantidad, subTotal]);
                yield connection.commit();
                console.log("Resultado INSERT detalle: ", detalle);
                return detalle;
            }
            catch (e) {
                yield connection.rollback();
                console.error("Error insertando detalle, se hizo rollback: ", e);
                throw e;
            }
            finally {
                connection.release();
            }
        });
    }
    static deleteDetalle(idDetalle) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Detalle: ", idDetalle); // Detalle: { detalle: { id: '4', idProducto: '1', cantidad: '1', subTotal: '1' } }
            const connection = yield pool.getConnection();
            try {
                yield connection.beginTransaction();
                console.log("Ejecutando query delete detalle...");
                const query = `
				UPDATE pedido_venta_detalle
				SET eliminado = 1
				WHERE id = ?;
			`;
                const detalleEliminado = yield connection.query(query, [idDetalle]);
                console.log("Resultado DELETE detalle: ", detalleEliminado);
                yield connection.commit();
                return detalleEliminado;
            }
            catch (e) {
                yield connection.rollback();
                console.error("Error eliminando detalle, se hizo rollback: ", e);
                throw e;
            }
            finally {
                connection.release();
            }
        });
    }
    static uploadPedidoDetalles(listaDeDetalles, pedidoId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Detalles: ", listaDeDetalles);
            const connection = yield pool.getConnection();
            try {
                yield connection.beginTransaction();
                const detalles = [];
                listaDeDetalles.map((d) => __awaiter(this, void 0, void 0, function* () {
                    const query = `
					INSERT IGNORE INTO pedido_venta_detalle (id, idpedidoventa, idproducto, cantidad, subTotal)
					VALUES (?, ?, ?, ?, ?)
				`;
                    const detalle = yield connection.query(query, [d.id, pedidoId, d.producto, d.cantidad, d.subtotal]);
                    detalles.push(detalle);
                }));
                yield connection.commit();
                return detalles;
            }
            catch (e) {
                yield connection.rollback();
                console.error("Error cargando detalles, se hizo rollback: ", e);
                throw e;
            }
            finally {
                connection.release();
            }
        });
    }
}
