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
}
