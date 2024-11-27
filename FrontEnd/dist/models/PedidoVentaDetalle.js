export class PedidoVentaDetalle {
    constructor(id, pedidoVenta, producto, cantidad, subtotal) {
        this.id = id;
        this.pedidoVenta = pedidoVenta;
        this.producto = producto;
        this.cantidad = cantidad;
        this.subtotal = subtotal;
    }
}
