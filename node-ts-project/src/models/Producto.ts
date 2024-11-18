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
  
	// Métodos para interactuar con la base de datos
	static async getById(id: number) {
	  // Realiza la consulta para obtener el producto por ID
	  const producto = await pool.query('SELECT * FROM producto WHERE id = ?', [id]);
	  return producto;
	}
  
	// Otros métodos de CRUD pueden ser definidos aquí...
  }
  