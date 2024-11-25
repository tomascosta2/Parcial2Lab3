window.onload = async () => {

	const displayPedidos = (pedidosList) => {

		// Obtener el tbody de la tabla
		const tbody = document.getElementById('pedidosTable').querySelector('tbody');

		// Limpiar el contenido actual del tbody (opcional)
		tbody.innerHTML = '';

		console.log("Lista de pedidos: ", pedidosList)

		// Iterar sobre los pedidos y crear filas
		if (pedidosList.length > 1 || pedidosList.pedidosByDate) {
			console.log("Entra a pedidos list: ", pedidosList)
			pedidosList.forEach((pedido) => {
				const row = document.createElement('tr');

				// Crear y agregar celdas a la fila
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

				// Agregar la fila al tbody
				tbody.appendChild(row);
			});
		} else {
			console.log("NO entra a pedidos list: ", pedidosList)
			const row = document.createElement('tr');
			const pedido = pedidosList;
			// Crear y agregar celdas a la fila
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

			// Agregar la fila al tbody
			tbody.appendChild(row);
		}

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

		console.log(response)
		const allPedidos = await response.json();

		console.log("Todos los pedidos", allPedidos)

		displayPedidos(allPedidos.allPedidos)
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

		displayPedidos(allPedidosByDate.pedidosByDate)
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
	console.log("Llega aca")
	const allPedidos = await getPedidos('');

	// Parsear los datos de la respuesta
	const data = await allPedidos;

	// Extraer la lista de pedidos
	const pedidos = data.allPedidos;
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

	console.log("Total Pedido: ", totalPedido)

	const renderDetalles = async () => {
		listaDeDetalles.innerHTML = ''
		const res = await fetch(`http://localhost:3001/api/getDetallesById/${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const { detalles } = await res.json();
		console.log(detalles)

		detalles.map((detalle) => {
			const detallesActuales = listaDeDetalles.innerHTML;
			listaDeDetalles.innerHTML = detallesActuales + `
				<li data-id="${id}" data-cantidad="${cantidad}" data-producto="${detalle.idproducto}" data-subtotal="${detalle.subtotal}">
					Id: ${detalle.detalleId} | Cantidad: ${detalle.cantidad} | Producto: ${detalle.idproducto} | Subtotal: ${detalle.subtotal} <span class="text-red-500 cursor-pointer" id="deleteDetalle" data-id="${detalle.detalleId}">[x]</span>
				</li>
			`;
		})
		return detalles;
	}

	const deletedDetallesIDs = [];
	renderDetalles().then(() => {
		const deleteDetalleButtons = document.querySelectorAll('li:not(.--not-registered-yet) > #deleteDetalle');
		console.log("Botones de eliminar: ", deleteDetalleButtons)
		Array.from(deleteDetalleButtons).map((button) => {
			console.log("Boton de eliminar: ", button)
			button.onclick = () => {
				console.log("Detalle ", button.dataset.id, " se va a eliminar")
				deletedDetallesIDs.push(button.dataset.id)
				button.parentElement.remove();
			}
		})
	})

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

			console.log("Detalles eliminados: ", deletedDetallesIDs)
			deletedDetallesIDs.map((id) => deleteDetalleById(id))

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

				const detallesList = form.querySelectorAll('ul#listaDeDetalles > li');
				console.log("Lista de detalles:", detallesList)

				const detallesListData = [];
				Array.from(detallesList).map((detalle) => {
					console.log("Detalle: ", detalle.dataset.id)
					detallesListData.push({
						id: detalle.dataset.id,
						producto: detalle.dataset.producto,
						cantidad: detalle.dataset.cantidad,
						subtotal: detalle.dataset.subtotal
					})
				})

				uploadCreatedPedidoDetalles(id, detallesListData);

				console.log('Respuesta del servidor:', responseJson);
				window.location.reload();
			}
		}
	}

	// Funcion para el manejo de los detalles del pedido
	await detalles(id)

	closeModal.onclick = () => {
		popUp.classList.add('hidden');
	}
}

const createPedido = async () => {
	
	const popUp = document.getElementById('editPop');
	const closeModal = popUp.querySelector('#closePop');
	popUp.classList.remove('hidden');
	
	const form = popUp.querySelector('#editPedidoForm');
	form.querySelector('ul#listaDeDetalles').innerHTML = '';

	form.querySelector('input#idcliente').value = ''
	form.querySelector('input#fechaPedido').value = ''
	form.querySelector('input#nroComprobante').value = ''
	form.querySelector('input#formaPago').value = ''
	form.querySelector('textarea#observaciones').value = ''
	form.querySelector('input#totalPedido').value = ''

	await detalles()

	form.onsubmit = async (e) => {
		e.preventDefault();
		if (confirm("Confirmar?")) {

			const idcliente = form.querySelector('input#idcliente').value
			const fechaPedido = form.querySelector('input#fechaPedido').value
			const nroComprobante = form.querySelector('input#nroComprobante').value
			const formaPago = form.querySelector('input#formaPago').value
			const observaciones = form.querySelector('textarea#observaciones').value
			const totalPedido = form.querySelector('input#totalPedido').value

			const detallesList = form.querySelectorAll('ul#listaDeDetalles > li');
			console.log("Lista de detalles:", detallesList)

			const detallesListData = [];
			Array.from(detallesList).map((detalle) => {
				console.log("Detalle: ", detalle.dataset.id)
				detallesListData.push({
					id: detalle.dataset.id,
					producto: detalle.dataset.producto,
					cantidad: detalle.dataset.cantidad,
					subtotal: detalle.dataset.subtotal
				})
			})

			console.log("Lista de detalles: ", detallesListData)

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

				// TODO: Cargar detalles en la DB
				const createdPedidoId = responseJson[0].insertId

				console.log("Id del pedido creado: ", createdPedidoId)
				uploadCreatedPedidoDetalles(createdPedidoId, detallesListData);

				console.log('Respuesta del servidor:', responseJson);
				window.location.reload();
			}
		}
	}

	closeModal.onclick = () => {
		popUp.classList.add('hidden');
	}
}

const uploadCreatedPedidoDetalles = async (pedidoId, listaDeDetalles) => {

	console.log("Aca se van a subir los detalles", listaDeDetalles, " al pedido ", pedidoId)

	const response = fetch(`http://localhost:3001/api/uploadPedidoDetalles/`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			listaDeDetalles,
			pedidoId
		})
	})

	const detallesCargados = await response.json();
	console.log("Detalles Cargados: ", detallesCargados)
}

const detalles = async (pedidoId) => {

	// Agregar un detalle desde el formulario
	const addDetalle = document.getElementById('addDetalle')
	addDetalle.onclick = async () => {
		console.log("Creando detalle...")
		const detalleForm = document.getElementById('detalleForm')
		detalleForm.classList.remove('hidden')

		const productos = await getAllProductos();

		console.log("Productos: ", productos.allProductos[0])

		const productosSelector = detalleForm.querySelector('select#producto')

		if (!productosSelector.classList.contains('--rendered')) {
			productosSelector.classList.add('--rendered')
			productos.allProductos[0].forEach(producto => {
				const option = document.createElement('option');
				option.value = producto.id;
				option.textContent = producto.denominacion;
				productosSelector.appendChild(option);
			});
		}

		detalleForm.querySelector('input#cantidad').addEventListener('input', updateSubtotal)
		detalleForm.querySelector('select#producto').addEventListener('change', updateSubtotal)
		function updateSubtotal() {
			console.log("Actualizando subtotal...")
			const cantidad = parseFloat(detalleForm.querySelector('input#cantidad').value) || 0;
			const idProducto = detalleForm.querySelector('select#producto').value;
			const producto = productos.allProductos[0].find(p => p.id == idProducto);
			console.log("Producto seleccionado: ", producto)
			const precioVenta = producto ? parseFloat(producto.precioVenta) : 0;

			const subTotal = cantidad * precioVenta;
			detalleForm.querySelector('input#subTotal').value = subTotal.toFixed(2);
		}

		detalleForm.querySelector('span#closeDetalleForm').onclick = () => {
			detalleForm.classList.add('hidden')
		}

		detalleForm.onsubmit = (e) => {
			e.preventDefault();

			let id = detalleForm.querySelector('input#id').value
			let idProducto = detalleForm.querySelector('select#producto').value
			let cantidad = detalleForm.querySelector('input#cantidad').value
			let subTotal = detalleForm.querySelector('input#subTotal').value

			console.log("Datos form: ", id, idProducto, cantidad, subTotal)

			const listaDeDetalles = document.getElementById('listaDeDetalles');
			const renderDetalle = (id, idProducto, cantidad, subTotal) => {
				const tempDiv = document.createElement('div');
				tempDiv.innerHTML = `
					<li class="--not-registered-yet" data-id="${id}" data-cantidad="${cantidad}" data-producto="${idProducto}" data-subtotal="${subTotal}">
						Id: ${id} | Cantidad: ${cantidad} | Producto: ${idProducto} | Subtotal: ${subTotal} 
						<span class="text-red-500 cursor-pointer" id="deleteDetalle" data-id="${id}">[x]</span>
					</li>
				`;

				// Usamos el primer hijo del contenedor temporal
				listaDeDetalles.appendChild(tempDiv.firstElementChild);
			}
			renderDetalle(id, idProducto, cantidad, subTotal);

			// Limpiamos el form, actualizamos lista de detalles y cerramos el modal
			detalleForm.querySelector('input#id').value = ''
			detalleForm.querySelector('select#producto').option = 0
			detalleForm.querySelector('input#cantidad').value = ''
			detalleForm.querySelector('input#subTotal').value = ''
			detalleForm.classList.add('hidden')

			const lis = Array.from(listaDeDetalles.querySelectorAll('#listaDeDetalles > li'));
			console.log("LISTA: ", lis)
			const updateTotal = () => {
				const form = document.querySelector('#editPedidoForm');
				console.log("Actualizando total...")
				form.querySelector('input#totalPedido').value = lis
					.map(detalle => {
						const subtotal = parseFloat(detalle.dataset.subtotal);
						console.log(subtotal);
						return subtotal;
					})
					.reduce((acc, subtotal) => {
						console.log("ACC", acc, "SUBTOTAL", subtotal);
						return acc + subtotal;
					}, 0);
			}
			updateTotal();

			// Borra solo del HTML de los elementos que todavia no estan guardados en la DB
			const deleteDetalleButtons = document.querySelectorAll('.--not-registered-yet > #deleteDetalle');
			console.log("Botones de eliminar sin registrar: ", deleteDetalleButtons)
			Array.from(deleteDetalleButtons).map((button) => {
				console.log("Boton de eliminar: ", button)
				button.onclick = () => {
					button.parentElement.remove();
				}
			})
		}

	}

	return;

}

const getAllProductos = async () => {
	const response = await fetch(`http://localhost:3001/api/getAllProductos`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const allProductos = response.json();

	return allProductos;
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
	if (confirm("Seguro que desea eliminar el pedido con id: " + id)) {
		console.log("Eliminando pedido...")
		const pedidoEliminado = await fetch(`http://localhost:3001/api/deletePedido/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
		}).then(window.location.reload())
	}

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
		method: 'GET',
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

	console.log(detalles.detalles[0])

	// Agregar tabla con detalles del pedido
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

	// Descargar el archivo PDF
	doc.save(`Pedido_${pedidoId}.pdf`);
}

const testing = () => {
	console.log("Testeando...")
}