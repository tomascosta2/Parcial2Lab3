window.onload = async () => {
    interface Pedido {
        id: number;
        idcliente: string;
        fechaPedido: string;
        nroComprobante: string;
        formaPago: string;
        observaciones: string;
        totalPedido: number;
    }

    const displayPedidos = (pedidosList: Pedido[]): void => {
        const tbody = document.getElementById('pedidosTable')?.querySelector('tbody');
        if (!tbody) return;  // Return if tbody is not found

        tbody.innerHTML = '';  // Clear existing rows
        console.log("Lista de pedidos", pedidosList);

        pedidosList.forEach((pedido) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td data-id="${pedido.id}" id="id" class="p-4 border border-slate-500">${pedido.id}</td>
                <td data-id="${pedido.id}" id="idcliente" class="p-4 border border-slate-500">${pedido.idcliente}</td>
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
        });
    }

    const setPedidosButtons = (): void => {
        const editPedidoButtons = document.querySelectorAll('#editPedido');
        editPedidoButtons.forEach((editPedidoButton) => {
            editPedidoButton.onclick = (e) => {
                const pedodoIdToEdit = (e.target as HTMLButtonElement).dataset.id;
                console.log(`Editando pedido con ID ${pedodoIdToEdit}`);
                if (pedodoIdToEdit) {
                    editPedidoById(pedodoIdToEdit);
                }
            }
        });
    }

    const getPedidos = async (id: string): Promise<any> => {
        const response = await fetch('http://localhost:3001/api/getAll', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id })
        });

        const allPedidos = await response.json();
        displayPedidos(allPedidos.allPedidos[0]);
        setPedidosButtons();
        return allPedidos;
    }

    const getPedidosByDate = async (dates: { fromDate: string, toDate: string }): Promise<any> => {
        const response = await fetch('http://localhost:3001/api/getPedidosByDate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ dates })
        });

        const allPedidosByDate = await response.json();
        console.log("Pedidos por fecha recibidos: ", allPedidosByDate);
        displayPedidos(allPedidosByDate.pedidosByDate[0]);
        setPedidosButtons();
        return allPedidosByDate;
    }

    const searchByIdForm = document.getElementById('searchByIdForm') as HTMLFormElement;
    searchByIdForm.onsubmit = async (e) => {
        e.preventDefault();
        const idToSearch = (searchByIdForm.querySelector('input') as HTMLInputElement).value;
        await getPedidos(idToSearch);
    }

    const searchByDatesForm = document.getElementById('searchByDates') as HTMLFormElement;
    searchByDatesForm.onsubmit = (e) => {
        e.preventDefault();
        const fromDate = (searchByDatesForm.querySelector('input#from') as HTMLInputElement).value;
        const toDate = (searchByDatesForm.querySelector('input#to') as HTMLInputElement).value;
        console.log("Buscando desde ", fromDate, " hasta ", toDate);
        getPedidosByDate({ fromDate, toDate });
    }

    // Obtener todos los pedidos
    const allPedidos = await getPedidos('');
    console.log("Todos los pedidos: ", allPedidos);
    const data = await allPedidos;
    const pedidos = data.allPedidos[0];
    displayPedidos(pedidos);
    setPedidosButtons();
}

const editPedidoById = async (id: string): Promise<void> => {
    const popUp = document.getElementById('editPop') as HTMLElement;
    const closeModal = popUp.querySelector('#closePop') as HTMLElement;
    popUp.classList.remove('hidden');
    popUp.querySelector('div#detallesWrapper')?.classList.remove('hidden');

    const form = popUp.querySelector('#editPedidoForm') as HTMLFormElement;
    let idcliente = document.querySelector(`#idcliente[data-id='${id}']`)?.innerHTML;
    let fechaPedido = document.querySelector(`#fechaPedido[data-id='${id}']`)?.innerHTML;
    let nroComprobante = document.querySelector(`#nroComprobante[data-id='${id}']`)?.innerHTML;
    let formaPago = document.querySelector(`#formaPago[data-id='${id}']`)?.innerHTML;
    let observaciones = document.querySelector(`#observaciones[data-id='${id}']`)?.innerHTML;
    let totalPedido = document.querySelector(`#totalPedido[data-id='${id}']`)?.innerHTML;

    if (fechaPedido) {
        let [mes, dia, anio] = fechaPedido.split('/');
        dia = dia.padStart(2, '0');
        mes = mes.padStart(2, '0');
        let fechaCorrecta = `${anio}-${mes}-${dia}`;
        console.log("Fecha del pedido: ", fechaCorrecta);

        form.querySelector('input#idcliente').value = idcliente || '';
        form.querySelector('input#fechaPedido').value = fechaCorrecta;
        form.querySelector('input#nroComprobante').value = nroComprobante || '';
        form.querySelector('input#formaPago').value = formaPago || '';
        form.querySelector('textarea#observaciones').value = observaciones || '';
        form.querySelector('input#totalPedido').value = totalPedido || '';
    }

    form.onsubmit = async (e) => {
        e.preventDefault();
        if (confirm("Confirmar cambios?")) {
            const editedPedido = await fetch(`http://localhost:3001/api/editPedido/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    idcliente: form.querySelector('input#idcliente')?.value,
                    fechaPedido: form.querySelector('input#fechaPedido')?.value,
                    nroComprobante: form.querySelector('input#nroComprobante')?.value,
                    formaPago: form.querySelector('input#formaPago')?.value,
                    observaciones: form.querySelector('textarea#observaciones')?.value,
                    totalPedido: form.querySelector('input#totalPedido')?.value,
                })
            });

            if (editedPedido.ok) {
                const responseJson = await editedPedido.json();
                console.log('Respuesta del servidor:', responseJson);
                window.location.reload();
            }
        }
    }

    closeModal.onclick = () => {
        popUp.classList.add('hidden');
    }
}

const generatePdf = async (pedidoId: number): Promise<void> => {
    console.log("Id a generar pdf: ", pedidoId);
    const response = await fetch(`http://localhost:3001/api/getAll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: pedidoId })
    });

    const pedido = await response.json();
    const res = await fetch(`http://localhost:3001/api/getDetallesById/${pedidoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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

    doc.autoTable({
        startY: 70,
        head: [['ID Producto', 'Nombre Producto', 'Cantidad', 'Subtotal']],
        body: detalles.detalles[0].map((detalle: any) => [
            detalle.idproducto,
            detalle.productoDenominacion,
            detalle.cantidad,
            `$${detalle.subtotal}`,
        ]),
    });

    doc.save(`Pedido_${pedidoId}.pdf`);
}
