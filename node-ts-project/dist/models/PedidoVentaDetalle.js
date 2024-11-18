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
            const detalles = yield pool.query('SELECT * FROM pedido_venta_detalle WHERE idPedidoVenta = ?', [idPedidoVenta]);
            return detalles;
        });
    }
}
