"use strict";
window.onload = async () => {
    const displayPedidos = (pedidosList) => {
        var _a;
        const tbody = (_a = document.getElementById('pedidosTable')) === null || _a === void 0 ? void 0 : _a.querySelector('tbody');
        if (!tbody)
            return;
        tbody.innerHTML = '';
        console.log("Lista de pedidos: ", pedidosList);
        const renderPedido = (pedido) => {
            const row = document.createElement('tr');
            row.innerHTML = `
		  <td data-id="${pedido.id}" id="id" class="p-4 border border-slate-500">${pedido.id}</td>
		  <td data-id="${pedido.id}" id="idcliente" class="p-4 border border-slate-500">${pedido.cliente.id}</td>
		  <td data-id="${pedido.id}" id="fechaPedido" class="p-4 border border-slate-500">${new Date(pedido.fechaPedido).toLocaleDateString()}</td>
		  <td data-id="${pedido.id}" id="nroComprobante" class="p-4 border border-slate-500">${pedido.nroComprobante}</td>
		  <td data-id="${pedido.id}" id="formaPago" class="p-4 border border-slate-500">${pedido.formaPago}</td>
		  <td data-id="${pedido.id}" id="observaciones" class="p-4 border border-slate-500">${pedido.observaciones}</td>
		  <td data-id="${pedido.id}" id="totalPedido" class="p-4 border border-slate-500">${pedido.totalPedido}</td>
		  <td class="p-4 border border-slate-500">
			<div class="flex gap-2">
			  <button class="p-2 bg-gray-200" id="editPedido" data-id="${pedido.id}">Editar</button>
			  <button class="p-2 bg-gray-200" onclick="generatePdf(${pedido.id})" data-id="${pedido.id}">PDF</button>
			  <button class="p-2 bg-gray-200" onclick="deletePedidoById(${pedido.id})" data-id="${pedido.id}">Eliminar</button>    
			</div>
		  </td>`;
            tbody.appendChild(row);
        };
        if (Array.isArray(pedidosList)) {
            pedidosList.forEach(renderPedido);
        }
        else {
            renderPedido(pedidosList);
        }
    };
    const setPedidosButtons = () => {
        const editPedidoButtons = document.querySelectorAll('#editPedido');
        editPedidoButtons.forEach((editPedidoButton) => {
            editPedidoButton.addEventListener('click', (e) => {
                const target = e.target;
                const pedidoIdToEdit = target.dataset.id;
                if (pedidoIdToEdit) {
                    console.log(`Editando pedido con ID ${pedidoIdToEdit}`);
                    editPedidoById(parseInt(pedidoIdToEdit));
                }
            });
        });
    };
    const getPedidos = async (id = '') => {
        const response = await fetch('http://localhost:3001/api/getAll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id })
        });
        console.log(response);
        const allPedidos = await response.json();
        console.log("Todos los pedidos", allPedidos);
        displayPedidos(allPedidos.allPedidos);
        setPedidosButtons();
        return allPedidos;
    };
    const getPedidosByDate = async (dates) => {
        const response = await fetch('http://localhost:3001/api/getPedidosByDate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dates })
        });
        const allPedidosByDate = await response.json();
        console.log("Pedidos por fecha recibidos: ", allPedidosByDate);
        displayPedidos(allPedidosByDate.pedidosByDate);
        setPedidosButtons();
        return allPedidosByDate;
    };
    const searchByIdForm = document.getElementById('searchByIdForm');
    searchByIdForm.onsubmit = async (e) => {
        e.preventDefault();
        const idToSearch = searchByIdForm.querySelector('input').value;
        getPedidos(idToSearch);
    };
    const searchByDatesForm = document.getElementById('searchByDates');
    console.log("Fechas form", searchByDatesForm);
    searchByDatesForm.onsubmit = (e) => {
        e.preventDefault();
        const fromDate = searchByDatesForm.querySelector('input#from').value;
        const toDate = searchByDatesForm.querySelector('input#to').value;
        console.log("Buscando desde ", fromDate, " hasta ", toDate);
        getPedidosByDate({ fromDate, toDate });
    };
    console.log("Llega aca");
    const allPedidos = await getPedidos('');
    const data = await allPedidos;
    const pedidos = data.allPedidos;
    displayPedidos(pedidos);
    setPedidosButtons();
};
const editPedidoById = async (id) => {
    var _a;
    const popUp = document.getElementById('editPop');
    const closeModal = popUp.querySelector('#closePop');
    popUp.classList.remove('hidden');
    (_a = popUp.querySelector('div#detallesWrapper')) === null || _a === void 0 ? void 0 : _a.classList.remove('hidden');
    const form = popUp.querySelector('#editPedidoForm');
    let idcliente = document.querySelector(`#idcliente[data-id='${id}']`).innerHTML;
    let fechaPedido = document.querySelector(`#fechaPedido[data-id='${id}']`).innerHTML;
    let nroComprobante = document.querySelector(`#nroComprobante[data-id='${id}']`).innerHTML;
    let formaPago = document.querySelector(`#formaPago[data-id='${id}']`).innerHTML;
    let observaciones = document.querySelector(`#observaciones[data-id='${id}']`).innerHTML;
    let totalPedido = document.querySelector(`#totalPedido[data-id='${id}']`).innerHTML;
    console.log("Total Pedido: ", totalPedido);
    const renderDetalles = async () => {
        const listaDeDetalles = document.getElementById('listaDeDetalles');
        listaDeDetalles.innerHTML = '';
        const res = await fetch(`http://localhost:3001/api/getDetallesById/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const { detalles } = await res.json();
        console.log(detalles);
        detalles.forEach((detalle) => {
            const li = document.createElement('li');
            li.dataset.id = id.toString();
            li.dataset.cantidad = detalle.cantidad.toString();
            li.dataset.producto = detalle.idproducto.toString();
            li.dataset.subtotal = detalle.subtotal.toString();
            li.innerHTML = `
		  Id: ${detalle.detalleId} | Cantidad: ${detalle.cantidad} | Producto: ${detalle.idproducto} | Subtotal: ${detalle.subtotal} <span class="text-red-500 cursor-pointer" id="deleteDetalle" data-id="${detalle.detalleId}">[x]</span>
		`;
            listaDeDetalles.appendChild(li);
        });
        return detalles;
    };
    const deletedDetallesIDs = [];
    renderDetalles().then(() => {
        const deleteDetalleButtons = document.querySelectorAll('li:not(.--not-registered-yet) > #deleteDetalle');
        console.log("Botones de eliminar: ", deleteDetalleButtons);
        Array.from(deleteDetalleButtons).forEach((button) => {
            console.log("Boton de eliminar: ", button);
            button.addEventListener('click', () => {
                var _a;
                const dataId = button.dataset.id;
                if (dataId) {
                    console.log("Detalle ", dataId, " se va a eliminar");
                    deletedDetallesIDs.push(parseInt(dataId));
                    (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.remove();
                }
            });
        });
    });
    console.log("Fecha sin corregir: ", fechaPedido);
    let [mes, dia, anio] = fechaPedido.split('/');
    dia = dia.padStart(2, '0');
    mes = mes.padStart(2, '0');
    let fechaCorrecta = `${anio}-${mes}-${dia}`;
    console.log("Fecha del pedido: ", fechaCorrecta);
    form.querySelector('input#idcliente').value = idcliente;
    form.querySelector('input#fechaPedido').value = fechaCorrecta;
    form.querySelector('input#nroComprobante').value = nroComprobante;
    form.querySelector('input#formaPago').value = formaPago;
    form.querySelector('textarea#observaciones').value = observaciones;
    form.querySelector('input#totalPedido').value = totalPedido;
    form.onsubmit = async (e) => {
        e.preventDefault();
        if (confirm("Confirmar cambios?")) {
            idcliente = form.querySelector('input#idcliente').value;
            fechaPedido = form.querySelector('input#fechaPedido').value;
            nroComprobante = form.querySelector('input#nroComprobante').value;
            formaPago = form.querySelector('input#formaPago').value;
            observaciones = form.querySelector('textarea#observaciones').value;
            totalPedido = form.querySelector('input#totalPedido').value;
            console.log("Detalles eliminados: ", deletedDetallesIDs);
            deletedDetallesIDs.forEach((id) => deleteDetalleById(id));
            console.log(idcliente);
            console.log("Formulario enviado");
            const editedPedido = await fetch(`http://localhost:3001/api/editPedido/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idcliente,
                    fechaPedido: fechaCorrecta,
                    nroComprobante,
                    formaPago,
                    observaciones,
                    totalPedido
                })
            });
            if (editedPedido.ok) {
                const responseJson = await editedPedido.json();
                const detallesList = form.querySelectorAll('ul#listaDeDetalles > li');
                console.log("Lista de detalles:", detallesList);
                const detallesListData = [];
                Array.from(detallesList).forEach((detalle) => {
                    const dataset = detalle.dataset;
                    if (dataset.id && dataset.producto && dataset.cantidad && dataset.subtotal) {
                        console.log("Detalle: ", dataset.id);
                        detallesListData.push({
                            id: dataset.id,
                            producto: dataset.producto,
                            cantidad: dataset.cantidad,
                            subtotal: dataset.subtotal
                        });
                    }
                });
                uploadCreatedPedidoDetalles(id, detallesListData);
                console.log('Respuesta del servidor:', responseJson);
                window.location.reload();
            }
        }
    };
    await detalles(id);
    closeModal.onclick = () => {
        popUp.classList.add('hidden');
    };
};
const createPedido = async () => {
    const popUp = document.getElementById('editPop');
    const closeModal = popUp.querySelector('#closePop');
    popUp.classList.remove('hidden');
    const form = popUp.querySelector('#editPedidoForm');
    const listaDeDetalles = form.querySelector('ul#listaDeDetalles');
    listaDeDetalles.innerHTML = '';
    form.querySelector('input#idcliente').value = '';
    form.querySelector('input#fechaPedido').value = '';
    form.querySelector('input#nroComprobante').value = '';
    form.querySelector('input#formaPago').value = '';
    form.querySelector('textarea#observaciones').value = '';
    form.querySelector('input#totalPedido').value = '';
    await detalles();
    form.onsubmit = async (e) => {
        e.preventDefault();
        if (confirm("Confirmar?")) {
            const idcliente = form.querySelector('input#idcliente').value;
            const fechaPedido = form.querySelector('input#fechaPedido').value;
            const nroComprobante = form.querySelector('input#nroComprobante').value;
            const formaPago = form.querySelector('input#formaPago').value;
            const observaciones = form.querySelector('textarea#observaciones').value;
            const totalPedido = form.querySelector('input#totalPedido').value;
            const detallesList = form.querySelectorAll('ul#listaDeDetalles > li');
            console.log("Lista de detalles:", detallesList);
            const detallesListData = [];
            Array.from(detallesList).forEach((detalle) => {
                const dataset = detalle.dataset;
                if (dataset.id && dataset.producto && dataset.cantidad && dataset.subtotal) {
                    console.log("Detalle: ", dataset.id);
                    detallesListData.push({
                        id: dataset.id,
                        producto: dataset.producto,
                        cantidad: dataset.cantidad,
                        subtotal: dataset.subtotal
                    });
                }
            });
            console.log("Lista de detalles: ", detallesListData);
            const createdPedido = await fetch(`http://localhost:3001/api/createPedido/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idcliente,
                    fechaPedido,
                    nroComprobante,
                    formaPago,
                    observaciones,
                    totalPedido,
                    detallesListData
                })
            });
            if (createdPedido.ok) {
                const responseJson = await createdPedido.json();
                const createdPedidoId = responseJson[0].insertId;
                console.log("Id del pedido creado: ", createdPedidoId);
                uploadCreatedPedidoDetalles(createdPedidoId, detallesListData);
                console.log('Respuesta del servidor:', responseJson);
                window.location.reload();
            }
        }
    };
    closeModal.onclick = () => {
        popUp.classList.add('hidden');
    };
};
const uploadCreatedPedidoDetalles = async (pedidoId, listaDeDetalles) => {
    console.log("Aca se van a subir los detalles", listaDeDetalles, " al pedido ", pedidoId);
    const response = await fetch(`http://localhost:3001/api/uploadPedidoDetalles/`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            listaDeDetalles,
            pedidoId
        })
    });
    const detallesCargados = await response.json();
    console.log("Detalles Cargados: ", detallesCargados);
};
const detalles = async (pedidoId) => {
    const addDetalle = document.getElementById('addDetalle');
    addDetalle.onclick = async () => {
        var _a, _b;
        console.log("Creando detalle...");
        const detalleForm = document.getElementById('detalleForm');
        detalleForm.classList.remove('hidden');
        const productos = await getAllProductos();
        console.log("Productos: ", productos.allProductos[0]);
        const productosSelector = detalleForm.querySelector('select#producto');
        if (!productosSelector.classList.contains('--rendered')) {
            productosSelector.classList.add('--rendered');
            productos.allProductos[0].forEach((producto) => {
                const option = document.createElement('option');
                option.value = producto.id.toString();
                option.textContent = producto.denominacion;
                productosSelector.appendChild(option);
            });
        }
        const updateSubtotal = () => {
            console.log("Actualizando subtotal...");
            const cantidad = parseFloat(detalleForm.querySelector('input#cantidad').value) || 0;
            const idProducto = detalleForm.querySelector('select#producto').value;
            const producto = productos.allProductos[0].find((p) => p.id.toString() === idProducto);
            console.log("Producto seleccionado: ", producto);
            const precioVenta = producto ? parseFloat(producto.precioVenta.toString()) : 0;
            const subTotal = cantidad * precioVenta;
            detalleForm.querySelector('input#subTotal').value = subTotal.toFixed(2);
        };
        (_a = detalleForm.querySelector('input#cantidad')) === null || _a === void 0 ? void 0 : _a.addEventListener('input', updateSubtotal);
        (_b = detalleForm.querySelector('select#producto')) === null || _b === void 0 ? void 0 : _b.addEventListener('change', updateSubtotal);
        const closeDetalleForm = detalleForm.querySelector('span#closeDetalleForm');
        if (closeDetalleForm) {
            closeDetalleForm.onclick = () => {
                detalleForm.classList.add('hidden');
            };
        }
        detalleForm.onsubmit = (e) => {
            e.preventDefault();
            const id = detalleForm.querySelector('input#id').value;
            const idProducto = detalleForm.querySelector('select#producto').value;
            const cantidad = detalleForm.querySelector('input#cantidad').value;
            const subTotal = detalleForm.querySelector('input#subTotal').value;
            console.log("Datos form: ", id, idProducto, cantidad, subTotal);
            const listaDeDetalles = document.getElementById('listaDeDetalles');
            const renderDetalle = (id, idProducto, cantidad, subTotal) => {
                const li = document.createElement('li');
                li.className = '--not-registered-yet';
                li.dataset.id = id;
                li.dataset.cantidad = cantidad;
                li.dataset.producto = idProducto;
                li.dataset.subtotal = subTotal;
                li.innerHTML = `
			Id: ${id} | Cantidad: ${cantidad} | Producto: ${idProducto} | Subtotal: ${subTotal} 
			<span class="text-red-500 cursor-pointer" id="deleteDetalle" data-id="${id}">[x]</span>
		  `;
                listaDeDetalles.appendChild(li);
            };
            renderDetalle(id, idProducto, cantidad, subTotal);
            detalleForm.querySelector('input#id').value = '';
            detalleForm.querySelector('select#producto').selectedIndex = 0;
            detalleForm.querySelector('input#cantidad').value = '';
            detalleForm.querySelector('input#subTotal').value = '';
            detalleForm.classList.add('hidden');
            const lis = Array.from(listaDeDetalles.querySelectorAll('#listaDeDetalles > li'));
            console.log("LISTA: ", lis);
            const updateTotal = () => {
                const form = document.querySelector('#editPedidoForm');
                console.log("Actualizando total...");
                const total = lis
                    .map(detalle => {
                    const subtotal = parseFloat(detalle.dataset.subtotal || '0');
                    console.log(subtotal);
                    return subtotal;
                })
                    .reduce((acc, subtotal) => {
                    console.log("ACC", acc, "SUBTOTAL", subtotal);
                    return acc + subtotal;
                }, 0);
                form.querySelector('input#totalPedido').value = total.toString();
            };
            updateTotal();
            const deleteDetalleButtons = document.querySelectorAll('.--not-registered-yet > #deleteDetalle');
            console.log("Botones de eliminar sin registrar: ", deleteDetalleButtons);
            Array.from(deleteDetalleButtons).forEach((button) => {
                console.log("Boton de eliminar: ", button);
                button.addEventListener('click', () => {
                    var _a;
                    (_a = button.parentElement) === null || _a === void 0 ? void 0 : _a.remove();
                });
            });
        };
    };
};
const getAllProductos = async () => {
    const response = await fetch(`http://localhost:3001/api/getAllProductos`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const allProductos = await response.json();
    return allProductos;
};
const deleteDetalleById = async (id) => {
    await fetch(`http://localhost:3001/api/deleteDetalle/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
const deletePedidoById = async (id) => {
    if (confirm("Seguro que desea eliminar el pedido con id: " + id)) {
        console.log("Eliminando pedido...");
        await fetch(`http://localhost:3001/api/deletePedido/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        window.location.reload();
    }
};
const generatePdf = async (pedidoId) => {
    console.log("Id a generar pdf: ", pedidoId);
    const response = await fetch(`http://localhost:3001/api/getAll`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: pedidoId })
    });
    const pedido = await response.json();
    console.log("Pedido encontrado: ", pedido);
    const res = await fetch(`http://localhost:3001/api/getDetallesById/${pedidoId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const detalles = await res.json();
    console.log("Generando PDF... ", detalles);
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Pedido ID: ${pedidoId}`, 10, 10);
    doc.setFontSize(12);
    doc.text(`Cliente ID: ${pedido.allPedidos[0][0].idcliente}`, 10, 20);
    doc.text(`Fecha: ${new Date(pedido.allPedidos[0][0].fechaPedido).toLocaleDateString()}`, 10, 30);
    doc.text(`Forma de Pago: ${pedido.allPedidos[0][0].formaPago}`, 10, 40);
    doc.text(`Observaciones: ${pedido.allPedidos[0][0].observaciones}`, 10, 50);
    doc.text(`Total: $${pedido.allPedidos[0][0].totalPedido}`, 10, 60);
    console.log(detalles.detalles[0]);
    doc.autoTable({
        startY: 70,
        head: [['ID Producto', 'Nombre Producto', 'Cantidad', 'Subtotal']],
        body: detalles.detalles[0].map((detalle) => [
            detalle.idproducto,
            detalle.productoDenominacion,
            detalle.cantidad,
            `$${detalle.subtotal}`,
        ]),
    });
    doc.save(`Pedido_${pedidoId}.pdf`);
};
const testing = () => {
    console.log("Testeando...");
};
