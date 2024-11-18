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
export class Producto {
    constructor(id, codigoProducto, denominacion, precioVenta) {
        this.id = id;
        this.codigoProducto = codigoProducto;
        this.denominacion = denominacion;
        this.precioVenta = precioVenta;
    }
    // Métodos para interactuar con la base de datos
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            // Realiza la consulta para obtener el producto por ID
            const producto = yield pool.query('SELECT * FROM producto WHERE id = ?', [id]);
            return producto;
        });
    }
}
