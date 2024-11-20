window.onload = async () => {

	const displayPedidos = (pedidosList) => {

		// Obtener el tbody de la tabla
		const tbody = document.getElementById('pedidosTable').querySelector('tbody');

		// Limpiar el contenido actual del tbody (opcional)
		tbody.innerHTML = '';

		console.log("Lista de pedidos", pedidosList)

		// Iterar sobre los pedidos y crear filas
		pedidosList.forEach((pedido) => {
			const row = document.createElement('tr');

			// Crear y agregar celdas a la fila
			row.innerHTML = `
			<td data-id="${pedido.id}" id="id" class="p-4 border border-slate-500">${pedido.id}</td>
			<td data-id="${pedido.id}" id="idcliente" class="p-4 border border-slate-500">${pedido.idcliente}</td>
			<td data-id="${pedido.id}" id="fechaPedido" class="p-4 border border-slate-500">${new Date(pedido.fechaPedido).toLocaleDateString()}</td>
			<td data-id="${pedido.id}" id="nroComprobante" class="p-4 border border-slate-500">${pedido.nroComprobante}</td>
			<td data-id="${pedido.id}" id="formaPago" class="p-4 border border-slate-500">${pedido.formaPago}</td>
			<td data-id="${pedido.id}" id="observaciones" class="p-4 border border-slate-500">${pedido.observaciones}</td>
			<td data-id="${pedido.id}" id="totalPedido" class="p-4 border border-slate-500">${pedido.totalPedido}</td>
			<td class="p-4 border border-slate-500">
				<button class="p-2 bg-gray-200" id="editPedido" data-id="${pedido.id}">Editar</button>
				<button class="p-2 bg-gray-200" onclick="generatePdf(${pedido.id})" data-id="${pedido.id}">PDF</button>
				<button class="p-2 bg-gray-200" onclick="deletePedidoById(${pedido.id})" data-id="${pedido.id}">Eliminar</button>		
			</td>`;

			// Agregar la fila al tbody
			tbody.appendChild(row);
		});

	}

	const setPedidosButtons = () => {
		const editPedidoButtons = document.querySelectorAll('#editPedido')

		editPedidoButtons.forEach((editPedidoButton) => {
			editPedidoButton.onclick = (e) => {
				const pedodoIdToEdit = e.target.dataset.id;
				console.log(`Editando pedido con ID ${pedodoIdToEdit}`);
				editPedidoById(pedodoIdToEdit)
			}
		})
	}

	const getPedidos = async (id) => {

		const response = await fetch('http://localhost:3001/api/getAll', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id })
		})

		const allPedidos = await response.json();

		displayPedidos(allPedidos.allPedidos[0])
		setPedidosButtons()
		return allPedidos;

	}

	const getPedidosByDate = async (dates) => {

		const response = await fetch('http://localhost:3001/api/getPedidosByDate', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ dates })
		})

		const allPedidosByDate = await response.json();
		console.log("Pedidos por fecha recibidos: ", allPedidosByDate)

		displayPedidos(allPedidosByDate.pedidosByDate[0])
		setPedidosButtons()
		return allPedidosByDate;

	}

	const searchByIdForm = document.getElementById('searchByIdForm');
	searchByIdForm.onsubmit = async (e) => {
		e.preventDefault();
		const idToSearch = searchByIdForm.querySelector('input').value
		getPedidos(idToSearch);
	}

	const searchByDatesForm = document.getElementById('searchByDates');
	console.log("Fechas form", searchByDatesForm)
	searchByDatesForm.onsubmit = (e) => {
		e.preventDefault();
		const fromDate = searchByDatesForm.querySelector('input#from').value
		const toDate = searchByDatesForm.querySelector('input#to').value
		console.log("Buscande desde ", fromDate, " hasta ", toDate)
		getPedidosByDate({ fromDate, toDate })
	}

	// Obtener todos los pedidos
	const allPedidos = await getPedidos('');
	console.log("Todos los pedidos: ", allPedidos);

	// Parsear los datos de la respuesta
	const data = await allPedidos;

	// Extraer la lista de pedidos
	const pedidos = data.allPedidos[0];
	displayPedidos(pedidos)

	setPedidosButtons();

}

const editPedidoById = async (id) => {

	const popUp = document.getElementById('editPop');
	const closeModal = popUp.querySelector('#closePop');
	popUp.classList.remove('hidden');

	popUp.querySelector('div#detallesWrapper').classList.remove('hidden')

	const form = popUp.querySelector('#editPedidoForm');

	let idcliente = document.querySelector(`#idcliente[data-id='${id}']`).innerHTML;
	let fechaPedido = document.querySelector(`#fechaPedido[data-id='${id}']`).innerHTML;
	let nroComprobante = document.querySelector(`#nroComprobante[data-id='${id}']`).innerHTML;
	let formaPago = document.querySelector(`#formaPago[data-id='${id}']`).innerHTML;
	let observaciones = document.querySelector(`#observaciones[data-id='${id}']`).innerHTML;
	let totalPedido = document.querySelector(`#totalPedido[data-id='${id}']`).innerHTML;

	console.log("Fecha sin corregir: ", fechaPedido)
	let [mes, dia, anio] = fechaPedido.split('/');
	dia = dia.padStart(2, '0');
	mes = mes.padStart(2, '0');
	let fechaCorrecta = `${anio}-${mes}-${dia}`;
	console.log("Fecha del pedido: ", fechaCorrecta) 

	// Lleno campos del formulario con los datos actuales
	form.querySelector('input#idcliente').value = idcliente;
	form.querySelector('input#fechaPedido').value = fechaCorrecta;
	form.querySelector('input#nroComprobante').value = nroComprobante;
	form.querySelector('input#formaPago').value = formaPago;
	form.querySelector('textarea#observaciones').value = observaciones;
	form.querySelector('input#totalPedido').value = totalPedido;

	form.onsubmit = async (e) => {
		e.preventDefault();
		if (confirm("Confirmar cambios?")) {

			idcliente = form.querySelector('input#idcliente').value
			fechaPedido = form.querySelector('input#fechaPedido').value
			nroComprobante = form.querySelector('input#nroComprobante').value
			formaPago = form.querySelector('input#formaPago').value
			observaciones = form.querySelector('textarea#observaciones').value
			totalPedido = form.querySelector('input#totalPedido').value

			console.log(idcliente)
			console.log("Formulario enviado")
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
				console.log('Respuesta del servidor:', responseJson);
				window.location.reload();
			}
		}
	}

	// Funcion para el manejo de los detalles del pedido
	detalles(id)

	closeModal.onclick = () => {
		popUp.classList.add('hidden');
	}
}


const createPedido = async () => {

	const popUp = document.getElementById('editPop');
	const closeModal = popUp.querySelector('#closePop');
	popUp.classList.remove('hidden');

	const form = popUp.querySelector('#editPedidoForm');

	form.querySelector('input#idcliente').value = ''
	form.querySelector('input#fechaPedido').value = ''
	form.querySelector('input#nroComprobante').value = ''
	form.querySelector('input#formaPago').value = ''
	form.querySelector('textarea#observaciones').value = ''
	form.querySelector('input#totalPedido').value = ''

	form.querySelector('div#detallesWrapper').classList.add('hidden')

	form.onsubmit = async (e) => {
		e.preventDefault();
		if (confirm("Confirmar?")) {

			idcliente = form.querySelector('input#idcliente').value
			fechaPedido = form.querySelector('input#fechaPedido').value
			nroComprobante = form.querySelector('input#nroComprobante').value
			formaPago = form.querySelector('input#formaPago').value
			observaciones = form.querySelector('textarea#observaciones').value
			totalPedido = form.querySelector('input#totalPedido').value

			console.log(idcliente)
			console.log("Formulario enviado")
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
					totalPedido
				})
			});

			if (createdPedido.ok) {
				const responseJson = await createdPedido.json();
				console.log('Respuesta del servidor:', responseJson);
				window.location.reload();
			}
		}
	}

	// Funcion para el manejo de los detalles del pedido (Primero se crea el pedido y en editar se asignan los detalles)
	// detalles(id)

	closeModal.onclick = () => {
		popUp.classList.add('hidden');
	}
}

const detalles = async (pedidoId) => {

	// Funcion para obtener todos los detalles del pedido
	const listarDetalles = async (id) => {
		const respuestaDetalles = await fetch(`http://localhost:3001/api/getDetallesById/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
		});

		const detalles = await respuestaDetalles.json();
		console.log(detalles.detalles[0])

		const listaDeDetalles = document.getElementById('listaDeDetalles');
		listaDeDetalles.innerHTML = '';

		console.log(listaDeDetalles)

		detalles.detalles[0].map((detalle) => {
			const itemDetalle = document.createElement('li');
			itemDetalle.classList.add('py-2')
			itemDetalle.innerHTML = 'Id: ' + detalle.id + ' | Cantidad: ' + detalle.cantidad + ' | Producto: ' + detalle.idproducto + ' | Subtotal: ' + detalle.subtotal + ' <span class="text-red-500 cursor-pointer" id="deleteDetalle" data-id="' + detalle.id + '">[x]</span>';

			listaDeDetalles.appendChild(itemDetalle);
		})

		// Funcion para eliminar un detalle por id
		console.log("Entra")
		const deleteDetalleButtons = document.querySelectorAll('#deleteDetalle')
		deleteDetalleButtons.forEach((deleteDetalleButton) => {
			deleteDetalleButton.onclick = (e) => {
				const detalleIdToDelete = e.target.dataset.id;
				deleteDetalleById(detalleIdToDelete);
				listarDetalles(pedidoId);
			}
		})
	}
	listarDetalles(pedidoId)

	// Agregar un detalle desde el formulario
	const addDetalle = document.getElementById('addDetalle')
	addDetalle.onclick = () => {

		const detalleForm = document.getElementById('detalleForm')
		detalleForm.classList.remove('hidden')

		// El id pedido venta siempre va a ser el del pedido que estamos editando
		detalleForm.querySelector('input#idPedidoVenta').value = pedidoId;
		detalleForm.querySelector('span#closeDetalleForm').onclick = () => {
			detalleForm.classList.add('hidden')
		}

		console.log("Editando pedido: ", pedidoId)

		detalleForm.onsubmit = (e) => {
			e.preventDefault();

			id = detalleForm.querySelector('input#id').value
			idProducto = detalleForm.querySelector('input#idProducto').value
			cantidad = detalleForm.querySelector('input#cantidad').value
			subTotal = detalleForm.querySelector('input#subTotal').value

			console.log("Datos form: ", id, pedidoId, idProducto, cantidad, subTotal)

			crearDetalle({ id, idPedidoVenta: pedidoId, idProducto, cantidad, subTotal }).then(() => {
				// TODO: La llama pero en la segunda vez no actualiza el pedidoId por lo que carga los detalles en el 1er pedido editado
				console.log("Pedido editado: ", pedidoId)
				listarDetalles(pedidoId)
			});;

			// Limpiamos el form, actualizamos lista de detalles y cerramos el modal
			detalleForm.querySelector('input#id').value = ''
			detalleForm.querySelector('input#idProducto').value = ''
			detalleForm.querySelector('input#cantidad').value = ''
			detalleForm.querySelector('input#subTotal').value = ''
			detalleForm.classList.add('hidden')
		}

	}


}

const crearDetalle = async (detalle) => {
	console.log("Detalle enviado al back: ", detalle)
	const detalleCreado = await fetch(`http://localhost:3001/api/insertDetalle`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ detalle })
	})
}

const deleteDetalleById = async (id) => {

	const detalleEliminado = await fetch(`http://localhost:3001/api/deleteDetalle/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
	})
}

const deletePedidoById = async (id) => {
	console.log("Eliminando pedido...")
	const pedidoEliminado = await fetch(`http://localhost:3001/api/deletePedido/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
	}).then(window.location.reload())

}

const generatePdf = async (pedidoId) => {
	console.log("Id a generar pdf: ", pedidoId)
	// Obtenemos los datos del pedido
	const response = await fetch(`http://localhost:3001/api/getAll`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ id: pedidoId })
	})
	const pedido = await response.json();
	console.log("Pedido encontrado: ", pedido)

	// Obtenemos los detalles del pediddo
	const res = await fetch(`http://localhost:3001/api/getDetallesById/${pedidoId}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	const detalles = await res.json();
	console.log("Generando PDF... ", detalles)

	// Generar el PDF
	const { jsPDF } = window.jspdf;
	const doc = new jsPDF();

	// Título
	doc.setFontSize(16);
	doc.text(`Pedido ID: ${pedidoId}`, 10, 10);

	// Información del pedido
	doc.setFontSize(12);
	doc.text(`Cliente ID: ${pedido.allPedidos[0][0].idcliente}`, 10, 20);
	doc.text(`Fecha: ${new Date(pedido.allPedidos[0][0].fechaPedido).toLocaleDateString()}`, 10, 30);
	doc.text(`Forma de Pago: ${pedido.allPedidos[0][0].formaPago}`, 10, 40);
	doc.text(`Observaciones: ${pedido.allPedidos[0][0].observaciones}`, 10, 50);
	doc.text(`Total: $${pedido.allPedidos[0][0].totalPedido}`, 10, 60);

	// Agregar tabla con detalles del pedido
	doc.autoTable({
		startY: 70,
		head: [['ID Producto', 'Cantidad', 'Subtotal']],
		body: detalles.detalles[0].map((detalle) => [
			detalle.idproducto,
			detalle.cantidad,
			`$${detalle.subtotal}`,
		]),
	});

	// Descargar el archivo PDF
	doc.save(`Pedido_${pedidoId}.pdf`);
}