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
export default class PedidoVenta {
    constructor(id, idCliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido) {
        this.id = id;
        this.idCliente = idCliente;
        this.fechaPedido = fechaPedido;
        this.nroComprobante = nroComprobante;
        this.formaPago = formaPago;
        this.observaciones = observaciones;
        this.totalPedido = totalPedido;
    }
    // Obtener todos los pedidos
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const pedidos = yield pool.query('SELECT * FROM pedido_venta WHERE eliminado = 0');
            console.log('Pedidos', pedidos);
            return pedidos;
        });
    }
    // Obtener un pedido por ID
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const pedido = yield pool.query('SELECT * FROM pedido_venta WHERE id = ? AND eliminado = 0', [id]);
            return pedido;
        });
    }
    // Obtener pedidos por rango de fechas
    static getByDate(dates) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('FECHAS: ', dates.fromDate);
            const pedido = yield pool.query('SELECT * FROM pedido_venta WHERE fechaPedido BETWEEN ? AND ? AND eliminado = 0;', [dates.fromDate, dates.toDate]);
            return pedido;
        });
    }
    // Editar un pedido por ID con transacción
    static editById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield pool.getConnection();
            try {
                // Iniciar la transacción
                yield connection.beginTransaction();
                // Actualizar el pedido
                const cambios = yield connection.query(`UPDATE pedido_venta
				 SET idcliente = ?, fechaPedido = ?, nroComprobante = ?, formaPago = ?, observaciones = ?, totalPedido = ?
				 WHERE id = ?`, [
                    data.idcliente,
                    data.fechaPedido,
                    data.nroComprobante,
                    data.formaPago,
                    data.observaciones,
                    data.totalPedido,
                    id,
                ]);
                // Confirmar la transacción
                yield connection.commit();
                return cambios;
            }
            catch (error) {
                // Revertir la transacción en caso de error
                yield connection.rollback();
                console.error('Error al editar el pedido:', error);
                throw error;
            }
            finally {
                // Liberar la conexión
                connection.release();
            }
        });
    }
    // Crear un pedido con transacción
    static createPedido(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield pool.getConnection();
            try {
                // Iniciar la transacción
                yield connection.beginTransaction();
                // Crear el pedido
                const [pedidoResult] = yield connection.query(`INSERT INTO pedido_venta (idcliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido)
				 VALUES (?, ?, ?, ?, ?, ?);`, [data.idcliente, data.fechaPedido, data.nroComprobante, data.formaPago, data.observaciones, data.totalPedido]);
                // Obtener el ID del pedido recién creado
                const pedidoId = pedidoResult.insertId;
                // Insertar los detalles del pedido
                for (const detalle of data.detalles) {
                    yield connection.query(`INSERT INTO pedido_venta_detalle (idPedidoVenta, idProducto, cantidad, subTotal)
					 VALUES (?, ?, ?, ?);`, [pedidoId, detalle.idProducto, detalle.cantidad, detalle.subTotal]);
                }
                // Confirmar la transacción
                yield connection.commit();
                return { success: true, pedidoId };
            }
            catch (error) {
                // Revertir la transacción en caso de error
                yield connection.rollback();
                console.error('Error al crear pedido:', error);
                throw error;
            }
            finally {
                // Liberar la conexión
                connection.release();
            }
        });
    }
    // Eliminar un pedido por ID con transacción
    static deleteById(idPedido) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield pool.getConnection();
            try {
                // Iniciar la transacción
                yield connection.beginTransaction();
                // Marcar el pedido como eliminado
                const query = `
				UPDATE pedido_venta
				SET eliminado = 1
				WHERE id = ?;
			`;
                const pedidoEliminado = yield connection.query(query, [idPedido]);
                // Confirmar la transacción
                yield connection.commit();
                return pedidoEliminado;
            }
            catch (error) {
                // Revertir la transacción en caso de error
                yield connection.rollback();
                console.error('Error al eliminar pedido:', error);
                throw error;
            }
            finally {
                // Liberar la conexión
                connection.release();
            }
        });
    }
}
