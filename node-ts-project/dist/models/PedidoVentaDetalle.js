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
    constructor(id, idPedidoVenta, idProducto, cantidad, subtotal) {
        this.id = id;
        this.idPedidoVenta = idPedidoVenta;
        this.idProducto = idProducto;
        this.cantidad = cantidad;
        this.subtotal = subtotal;
    }
    // Métodos para interactuar con la base de datos
    static getByPedidoVenta(idPedidoVenta) {
        return __awaiter(this, void 0, void 0, function* () {
            // Consulta para obtener los detalles de un pedido por su ID
            const detalles = yield pool.query(`
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
		`, [idPedidoVenta]);
            return detalles;
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
            const connection = yield pool.getConnection(); // Obtén una conexión individual
            try {
                yield connection.beginTransaction(); // Inicia la transacción
                console.log("Ejecutando query delete detalle...");
                const query = `
				UPDATE pedido_venta_detalle
				SET eliminado = 1
				WHERE id = ?;
			`;
                const detalleEliminado = yield connection.query(query, [idDetalle]);
                console.log("Resultado DELETE detalle: ", detalleEliminado);
                yield connection.commit(); // Confirma los cambios
                return detalleEliminado;
            }
            catch (e) {
                yield connection.rollback(); // Revierte los cambios en caso de error
                console.error("Error eliminando detalle, se hizo rollback: ", e);
                throw e; // Re-lanza el error para manejo externo
            }
            finally {
                connection.release(); // Libera la conexión de vuelta al pool
            }
        });
    }
}
