import { Cliente } from './Cliente.js';
import { PedidoVentaDetalle } from './PedidoVentaDetalle.js';

export default class PedidoVenta {
	id: number;
	cliente: Cliente;
	fechaPedido: Date;
	nroComprobante: number;
	formaPago: string;
	observaciones: string;
	totalPedido: number;
	detalles: PedidoVentaDetalle[];

	constructor(id: number, cliente: Cliente, fechaPedido: Date, nroComprobante: number, formaPago: string, observaciones: string, totalPedido: number, detalles: PedidoVentaDetalle[]) {
		this.id = id;
		this.cliente = cliente;
		this.fechaPedido = fechaPedido;
		this.nroComprobante = nroComprobante;
		this.formaPago = formaPago;
		this.observaciones = observaciones;
		this.totalPedido = totalPedido;
		this.detalles = detalles;
	}
}
