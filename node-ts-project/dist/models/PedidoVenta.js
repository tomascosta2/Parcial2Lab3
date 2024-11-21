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
    // Métodos para interactuar con la base de datos
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const pedidos = pool.query('SELECT * FROM pedido_venta WHERE eliminado = 0');
            console.log("Pedidos", pedidos);
            return pedidos;
        });
    }
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const pedido = yield pool.query('SELECT * FROM pedido_venta WHERE id = ? AND eliminado = 0', [id]);
            return pedido;
        });
    }
    static getByDate(dates) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("FECHAS: ", dates.fromDate);
            const pedido = yield pool.query('SELECT * FROM pedido_venta WHERE fechaPedido BETWEEN ? AND ? AND eliminado = 0;', [dates.fromDate, dates.toDate]);
            return pedido;
        });
    }
    static editById(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield pool.getConnection(); // Obtén una conexión individual del pool
            try {
                yield connection.beginTransaction(); // Inicia la transacción
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
                yield connection.commit(); // Confirma los cambios
                console.log("Resultados del Query: ", cambios);
                return cambios;
            }
            catch (e) {
                yield connection.rollback(); // Revierte los cambios en caso de error
                console.error("Error en la transacción, se hizo rollback:", e);
                throw e; // Re-lanza el error para manejo externo
            }
            finally {
                connection.release(); // Libera la conexión de vuelta al pool
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
            const connection = yield pool.getConnection(); // Obtén una conexión del pool
            console.log("Pedido: ", idPedido);
            try {
                yield connection.beginTransaction(); // Inicia la transacción
                console.log("Ejecutando query delete pedido...");
                const query = `
				UPDATE pedido_venta
				SET eliminado = 1
				WHERE id = ?;
			`;
                const pedidoEliminado = yield connection.query(query, [idPedido]);
                console.log("Resultado DELETE pedido: ", pedidoEliminado);
                yield connection.commit(); // Confirma los cambios
                return pedidoEliminado;
            }
            catch (e) {
                yield connection.rollback(); // Revierte los cambios en caso de error
                console.error("Error en la transacción DELETE pedido: ", e);
                throw e; // Re-lanza el error para manejo externo
            }
            finally {
                connection.release(); // Libera la conexión de vuelta al pool
            }
        });
    }
}
