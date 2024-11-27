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
import { PedidoVentaDetalle } from './PedidoVentaDetalle.js';
export default class PedidoVenta {
    constructor(id, cliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido, detalles) {
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
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield pool.getConnection();
            try {
                yield connection.beginTransaction();
                const [pedidos] = yield connection.query(`
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
                const listapedidos = [];
                for (const pedido of pedidos) {
                    const cliente = {
                        id: pedido.idcliente,
                        cuit: pedido.cuit,
                        razonSocial: pedido.razonSocial
                    };
                    console.log("Mapeando pedido:", pedido.id);
                    try {
                        const detalles = yield PedidoVentaDetalle.getByPedidoVenta(pedido.id);
                        console.log("Detalles del pedido: ", detalles);
                        listapedidos.push(new PedidoVenta(pedido.id, cliente, pedido.fechaPedido, pedido.nroComprobante, pedido.formaPago, pedido.observaciones, pedido.totalPedido, detalles));
                        console.log("Pedido agregado a la lista: ", listapedidos[listapedidos.length - 1]);
                    }
                    catch (e) {
                        console.log("Error mapeando pedido: ", e);
                    }
                }
                console.log("Lista completa de pedidos: ", listapedidos);
                yield connection.commit();
                return listapedidos;
            }
            catch (e) {
                yield connection.rollback();
                return e;
            }
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield pool.getConnection();
            try {
                yield connection.beginTransaction();
                const [pedido] = yield pool.query(`
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
                };
                const detalles = yield PedidoVentaDetalle.getByPedidoVenta(id);
                console.log("Detalles del pedido: ", detalles);
                const finalPedido = new PedidoVenta(pedido[0].id, cliente, pedido[0].fechaPedido, pedido[0].nroComprobante, pedido[0].formaPago, pedido[0].observaciones, pedido[0].totalPedido, detalles);
                yield connection.commit();
                return finalPedido;
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
    static getByDate(dates) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield pool.getConnection();
            try {
                yield connection.beginTransaction();
                console.log("FECHAS: ", dates.fromDate);
                const [pedidos] = yield pool.query(`
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
                console.log("PEDIDO POR FECHA: ", pedidos);
                const listapedidos = [];
                pedidos.map((pedido) => {
                    const cliente = {
                        id: pedido.idcliente,
                        cuit: pedido.cuit,
                        razonSocial: pedido.razonSocial
                    };
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
                });
                yield connection.commit();
                return listapedidos;
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
    static editById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield pool.getConnection();
            try {
                yield connection.beginTransaction();
                const cambios = yield connection.query(`UPDATE pedido_venta
				 SET idcliente = ?, fechaPedido = ?, nroComprobante = ?, formaPago = ?, observaciones = ?, totalPedido = ?
				 WHERE id = ?`, [
                    data.idcliente,
                    data.fechaPedido,
                    data.nroComprobante,
                    data.formaPago,
                    data.observaciones,
                    data.totalPedido,
                    id
                ]);
                yield connection.commit();
                console.log("Resultados del Query: ", cambios);
                return cambios;
            }
            catch (e) {
                yield connection.rollback();
                console.error("Error en la transacción, se hizo rollback:", e);
                throw e;
            }
            finally {
                connection.release();
            }
        });
    }
    static createPedido(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield pool.getConnection();
            try {
                yield connection.beginTransaction();
                const cambios = yield connection.query(`INSERT INTO pedido_venta (idcliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido)
				 VALUES (?, ?, ?, ?, ?, ?);`, [data.idcliente, data.fechaPedido, data.nroComprobante, data.formaPago, data.observaciones, data.totalPedido]);
                yield connection.commit();
                console.log("Resultados del Query: ", cambios);
                return cambios;
            }
            catch (e) {
                yield connection.rollback();
                console.error("Error en la transacción, se hizo rollback:", e);
                throw e;
            }
            finally {
                connection.release();
            }
        });
    }
    static deleteById(idPedido) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield pool.getConnection();
            console.log("Pedido: ", idPedido);
            try {
                yield connection.beginTransaction();
                console.log("Ejecutando query delete pedido...");
                const query = `
				UPDATE pedido_venta
				SET eliminado = 1
				WHERE id = ?;
			`;
                const pedidoEliminado = yield connection.query(query, [idPedido]);
                console.log("Resultado DELETE pedido: ", pedidoEliminado);
                yield connection.commit();
                return pedidoEliminado;
            }
            catch (e) {
                yield connection.rollback();
                console.error("Error en la transacción DELETE pedido: ", e);
                throw e;
            }
            finally {
                connection.release();
            }
        });
    }
}
