import { pool } from '../db.js'

export class Producto {
	id: number;
	codigoProducto: string;
	denominacion: number;
	precioVenta: number;

	constructor(id: number, codigoProducto: string, denominacion: number, precioVenta: number) {
		this.id = id;
		this.codigoProducto = codigoProducto;
		this.denominacion = denominacion;
		this.precioVenta = precioVenta;
	}

	static async getById(id: number) {
		const connection = await pool.getConnection();
		try {
			await connection.beginTransaction();
			const producto = await pool.query('SELECT * FROM producto WHERE id = ?', [id]);
			await connection.commit();
			return producto;
		} catch (e) {
			await connection.rollback();
			return e;
		} finally {
			connection.release();
		}
	}

	static async getAll() {
		const connection = await pool.getConnection();
		try {
			await connection.beginTransaction();
			const productos = await pool.query('SELECT * FROM producto');
			await connection.commit();
			return productos;
		} catch (e) {
			await connection.rollback();
			return e;
		} finally {
			connection.release();
		}
	}
}
