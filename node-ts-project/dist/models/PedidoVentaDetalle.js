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
    static insertDetalle(detalleData) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Detalle: ", detalleData); // Detalle:  { detalle: { id: '4', idProducto: '1', cantidad: '1', subTotal: '1' } }
            const { id, idPedidoVenta, idProducto, cantidad, subTotal } = detalleData.detalle;
            try {
                console.log("Ejecutando query insert detalle...");
                const query = `
				INSERT INTO pedido_venta_detalle (id, idPedidoVenta, idProducto, cantidad, subTotal)
				VALUES (?, ?, ?, ?, ?)
			`;
                const detalle = yield pool.query(query, [id, idPedidoVenta, idProducto, cantidad, subTotal]);
                console.log("Resultado INSERT detalle: ", detalle);
                return detalle;
            }
            catch (e) {
                console.log("Error insertando detalle: ", e);
                return "Ocurrio un error en la ejecucion del Query";
            }
        });
    }
}
