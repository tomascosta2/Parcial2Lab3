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
export class Cliente {
    constructor(id, cuit, razonSocial) {
        this.id = id;
        this.cuit = cuit;
        this.razonSocial = razonSocial;
    }
    // Métodos para interactuar con la base de datos (por ejemplo, usando un ORM o SQL directo)
    // Por ejemplo, un método para obtener clientes por su CUIT
    static getByCuit(cuit) {
        return __awaiter(this, void 0, void 0, function* () {
            // Aquí puedes hacer la consulta SQL para obtener un cliente por su CUIT
            const client = yield pool.query('SELECT * FROM cliente WHERE cuit = ?', [cuit]);
            return client;
        });
    }
}