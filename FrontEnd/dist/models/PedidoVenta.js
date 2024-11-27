export default class PedidoVenta {
    constructor(id, cliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido, detalles) {
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
