import PedidoVenta from './PedidoVenta.js';
import { Producto } from './Producto.js';

export class PedidoVentaDetalle {
	id: number;
	pedidoVenta: PedidoVenta;
	producto: Producto;
	cantidad: string;
	subtotal: string;

	constructor(id: number, pedidoVenta: PedidoVenta, producto: Producto, cantidad: string, subtotal: string) {
		this.id = id;
		this.pedidoVenta = pedidoVenta;
		this.producto = producto;
		this.cantidad = cantidad;
		this.subtotal = subtotal;
	}


}
