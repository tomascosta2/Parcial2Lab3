import { pool } from '../db.js'

export class PedidoVentaDetalle {
	id: number;
	idPedidoVenta: number;
	idProducto: number;
	cantidad: string;
	subtotal: string;
  
	constructor(id: number, idPedidoVenta: number, idProducto: number, cantidad: string, subtotal: string) {
	  this.id = id;
	  this.idPedidoVenta = idPedidoVenta;
	  this.idProducto = idProducto;
	  this.cantidad = cantidad;
	  this.subtotal = subtotal;
	}
  
	// Métodos para interactuar con la base de datos
	static async getByPedidoVenta(idPedidoVenta: number) {
	  // Consulta para obtener los detalles de un pedido por su ID
	  const detalles = await pool.query('SELECT * FROM pedido_venta_detalle WHERE idPedidoVenta = ?', [idPedidoVenta]);
	  return detalles;
	}
  
	// Otros métodos de CRUD pueden ser definidos aquí...
  }
  