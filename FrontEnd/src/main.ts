class Cliente {
	id: number;
	cuit: string;
	razonSocial: string;
  
	constructor(id: number, cuit: string, razonSocial: string) {
	  this.id = id;
	  this.cuit = cuit;
	  this.razonSocial = razonSocial;
	}
}
class PedidoVenta {
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


class PedidoVentaDetalle {
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

class Producto {
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


window.onload = async () => {
	const displayPedidos = (pedidosList: PedidoVenta[] | PedidoVenta) => {
		const tbody = document.getElementById('pedidosTable')?.querySelector('tbody');
		if (!tbody) return;

		tbody.innerHTML = '';

		console.log("Lista de pedidos: ", pedidosList);

		const renderPedido = (pedido: PedidoVenta) => {
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
		} else {
			renderPedido(pedidosList);
		}
	};

	const setPedidosButtons = () => {
		const editPedidoButtons = document.querySelectorAll('#editPedido');
		editPedidoButtons.forEach((editPedidoButton) => {
			editPedidoButton.addEventListener('click', (e) => {
				const target = e.target as HTMLElement;
				const pedidoIdToEdit = target.dataset.id;
				if (pedidoIdToEdit) {
					console.log(`Editando pedido con ID ${pedidoIdToEdit}`);
					editPedidoById(parseInt(pedidoIdToEdit));
				}
			});
		});
	};

	const getPedidos = async (id: string = ''): Promise<PedidoVenta[]> => {
		try {
			const response = await fetch('http://localhost:3001/api/getAll', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ id }),
			});

			if (!response.ok) {
				throw new Error(`Error en la solicitud: ${response.statusText}`);
			}

			const data = await response.json();

			console.log("Todos los pedidos recibidos: ", data);
			let pedidosList = [];
			if (!Array.isArray(data.allPedidos)) {
				pedidosList = [data.allPedidos];
			} else {
				pedidosList = data.allPedidos;
			}

			const pedidos: PedidoVenta[] = pedidosList;

			console.log("PEDIDOS CLIENTES ETC", pedidos);
			// Renderizar los pedidos y configurar los botones
			displayPedidos(pedidos);
			setPedidosButtons();

			return pedidos;
		} catch (error) {
			console.error('Error obteniendo los pedidos:', error);
			return [];
		}
	};

	const getPedidosByDate = async (dates: { fromDate: string; toDate: string }): Promise<PedidoVenta[]> => {
		try {
			const response = await fetch('http://localhost:3001/api/getPedidosByDate', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ dates }),
			});

			if (!response.ok) {
				throw new Error(`Error en la solicitud: ${response.statusText}`);
			}

			const data = await response.json();

			// Suponemos que el backend devuelve un objeto con la propiedad 'pedidosByDate'
			console.log("Pedidos por fecha recibidos: ", data.pedidosByDate);

			const pedidos: PedidoVenta[] = data.pedidosByDate;
			console.log(pedidos);
			// Renderizamos los pedidos en la interfaz
			displayPedidos(pedidos);
			setPedidosButtons();

			return pedidos;
		} catch (error) {
			console.error('Error obteniendo los pedidos por fecha:', error);
			return [];
		}
	};

	const searchByIdForm = document.getElementById('searchByIdForm') as HTMLFormElement;
	searchByIdForm.onsubmit = async (e) => {
		e.preventDefault();
		const idToSearch = (searchByIdForm.querySelector('input') as HTMLInputElement).value;
		const pedidos = await getPedidos(idToSearch); // Ahora devuelve directamente un array de Pedido
		displayPedidos(pedidos); // Mostrar los pedidos en la interfaz
	};

	const searchByDatesForm = document.getElementById('searchByDates') as HTMLFormElement;
	console.log("Fechas form", searchByDatesForm);
	searchByDatesForm.onsubmit = async (e) => {
		e.preventDefault();
		const fromDate = (searchByDatesForm.querySelector('input#from') as HTMLInputElement).value;
		const toDate = (searchByDatesForm.querySelector('input#to') as HTMLInputElement).value;
		console.log("Buscando desde ", fromDate, " hasta ", toDate);
		const pedidos = await getPedidosByDate({ fromDate, toDate }); // Ahora devuelve directamente un array de Pedido
		displayPedidos(pedidos); // Mostrar los pedidos en la interfaz
	};

	await getPedidos('');

	const pedidos = await getPedidos(''); // Obtener todos los pedidos
	displayPedidos(pedidos);

	console.log("Pedidos: ", pedidos);

	setPedidosButtons();
};

const editPedidoById = async (id: number) => {
	const popUp = document.getElementById('editPop') as HTMLElement;
	const closeModal = popUp.querySelector('#closePop') as HTMLElement;
	popUp.classList.remove('hidden');

	popUp.querySelector('div#detallesWrapper')?.classList.remove('hidden');

	const form = popUp.querySelector('#editPedidoForm') as HTMLFormElement;

	let idcliente = (document.querySelector(`#idcliente[data-id='${id}']`) as HTMLElement).innerHTML;
	let fechaPedido = (document.querySelector(`#fechaPedido[data-id='${id}']`) as HTMLElement).innerHTML;
	let nroComprobante = (document.querySelector(`#nroComprobante[data-id='${id}']`) as HTMLElement).innerHTML;
	let formaPago = (document.querySelector(`#formaPago[data-id='${id}']`) as HTMLElement).innerHTML;
	let observaciones = (document.querySelector(`#observaciones[data-id='${id}']`) as HTMLElement).innerHTML;
	let totalPedido = (document.querySelector(`#totalPedido[data-id='${id}']`) as HTMLElement).innerHTML;

	console.log("Total Pedido: ", totalPedido);

	const renderDetalles = async () => {
		const listaDeDetalles = document.getElementById('listaDeDetalles') as HTMLUListElement;
		// TODO: Obtener del pedido
		listaDeDetalles.innerHTML = '';
		
		const res = await fetch(`http://localhost:3001/api/getDetallesById/${id}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
			},
		});
		const { detalles } = await res.json();
		console.log(detalles);

		detalles.forEach((detalle: any) => {
			const li = document.createElement('li');
			li.dataset.id = detalle.detalleId;
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

	const deletedDetallesIDs: number[] = [];
	renderDetalles().then(() => {
		const deleteDetalleButtons = document.querySelectorAll('li:not(.--not-registered-yet) > #deleteDetalle');
		console.log("Botones de eliminar: ", deleteDetalleButtons);
		Array.from(deleteDetalleButtons).forEach((button) => {
			console.log("Boton de eliminar: ", button);
			button.addEventListener('click', () => {
				const dataId = (button as HTMLElement).dataset.id;
				if (dataId) {
					console.log("Detalle ", dataId, " se va a eliminar");
					deletedDetallesIDs.push(parseInt(dataId));
					(button as HTMLElement).parentElement?.remove();
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

	(form.querySelector('input#idcliente') as HTMLInputElement).value = idcliente;
	(form.querySelector('input#fechaPedido') as HTMLInputElement).value = fechaCorrecta;
	(form.querySelector('input#nroComprobante') as HTMLInputElement).value = nroComprobante;
	(form.querySelector('input#formaPago') as HTMLInputElement).value = formaPago;
	(form.querySelector('textarea#observaciones') as HTMLTextAreaElement).value = observaciones;
	(form.querySelector('input#totalPedido') as HTMLInputElement).value = totalPedido;

	form.onsubmit = async (e) => {
		e.preventDefault();
		if (confirm("Confirmar cambios?")) {
			idcliente = (form.querySelector('input#idcliente') as HTMLInputElement).value;
			fechaPedido = (form.querySelector('input#fechaPedido') as HTMLInputElement).value;
			nroComprobante = (form.querySelector('input#nroComprobante') as HTMLInputElement).value;
			formaPago = (form.querySelector('input#formaPago') as HTMLInputElement).value;
			observaciones = (form.querySelector('textarea#observaciones') as HTMLTextAreaElement).value;
			totalPedido = (form.querySelector('input#totalPedido') as HTMLInputElement).value;

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

				const detallesListData: { id: string; producto: string; cantidad: string; subtotal: string }[] = [];
				Array.from(detallesList).forEach((detalle) => {
					const dataset = (detalle as HTMLElement).dataset;
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
	const popUp = document.getElementById('editPop') as HTMLElement;
	const closeModal = popUp.querySelector('#closePop') as HTMLElement;
	popUp.classList.remove('hidden');

	const form = popUp.querySelector('#editPedidoForm') as HTMLFormElement;
	const listaDeDetalles = form.querySelector('ul#listaDeDetalles') as HTMLUListElement;
	listaDeDetalles.innerHTML = '';

	(form.querySelector('input#idcliente') as HTMLInputElement).value = '';
	(form.querySelector('input#fechaPedido') as HTMLInputElement).value = '';
	(form.querySelector('input#nroComprobante') as HTMLInputElement).value = '';
	(form.querySelector('input#formaPago') as HTMLInputElement).value = '';
	(form.querySelector('textarea#observaciones') as HTMLTextAreaElement).value = '';
	(form.querySelector('input#totalPedido') as HTMLInputElement).value = '';

	await detalles();

	form.onsubmit = async (e) => {
		e.preventDefault();
		if (confirm("Confirmar?")) {
			const idcliente = (form.querySelector('input#idcliente') as HTMLInputElement).value;
			const fechaPedido = (form.querySelector('input#fechaPedido') as HTMLInputElement).value;
			const nroComprobante = (form.querySelector('input#nroComprobante') as HTMLInputElement).value;
			const formaPago = (form.querySelector('input#formaPago') as HTMLInputElement).value;
			const observaciones = (form.querySelector('textarea#observaciones') as HTMLTextAreaElement).value;
			const totalPedido = (form.querySelector('input#totalPedido') as HTMLInputElement).value;

			const detallesList =
				form.querySelectorAll('ul#listaDeDetalles > li');
			console.log("Lista de detalles:", detallesList);

			const detallesListData: { id: string; producto: string; cantidad: string; subtotal: string }[] = [];
			Array.from(detallesList).forEach((detalle) => {
				const dataset = (detalle as HTMLElement).dataset;
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

const uploadCreatedPedidoDetalles = async (pedidoId: number, listaDeDetalles: { id: string; producto: string; cantidad: string; subtotal: string }[]) => {
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

const detalles = async (pedidoId?: number) => {
	const addDetalle = document.getElementById('addDetalle') as HTMLButtonElement;
	addDetalle.onclick = async () => {
		console.log("Creando detalle...");
		const detalleForm = document.getElementById('detalleForm') as HTMLFormElement;
		detalleForm.classList.remove('hidden');

		const productos = await getAllProductos();

		console.log("Productos: ", productos.allProductos[0]);

		const productosSelector = detalleForm.querySelector('select#producto') as HTMLSelectElement;

		if (!productosSelector.classList.contains('--rendered')) {
			productosSelector.classList.add('--rendered');
			productos.allProductos[0].forEach((producto: Producto) => {
				const option = document.createElement('option');
				option.value = producto.id.toString();
				option.textContent = producto.denominacion.toString();
				productosSelector.appendChild(option);
			});
		}

		const updateSubtotal = () => {
			console.log("Actualizando subtotal...");
			const cantidad = parseFloat((detalleForm.querySelector('input#cantidad') as HTMLInputElement).value) || 0;
			const idProducto = (detalleForm.querySelector('select#producto') as HTMLSelectElement).value;
			const producto = productos.allProductos[0].find((p: Producto) => p.id.toString() === idProducto);
			console.log("Producto seleccionado: ", producto);
			const precioVenta = producto ? parseFloat(producto.precioVenta.toString()) : 0;

			const subTotal = cantidad * precioVenta;
			(detalleForm.querySelector('input#subTotal') as HTMLInputElement).value = subTotal.toFixed(2);
		};

		detalleForm.querySelector('input#cantidad')?.addEventListener('input', updateSubtotal);
		detalleForm.querySelector('select#producto')?.addEventListener('change', updateSubtotal);

		const closeDetalleForm = detalleForm.querySelector('span#closeDetalleForm') as HTMLSpanElement;
		if (closeDetalleForm) {
			closeDetalleForm.onclick = () => {
				detalleForm.classList.add('hidden');
			};
		}

		detalleForm.onsubmit = (e) => {
			e.preventDefault();

			const id = (detalleForm.querySelector('input#id') as HTMLInputElement).value;
			const idProducto = (detalleForm.querySelector('select#producto') as HTMLSelectElement).value;
			const cantidad = (detalleForm.querySelector('input#cantidad') as HTMLInputElement).value;
			const subTotal = (detalleForm.querySelector('input#subTotal') as HTMLInputElement).value;

			console.log("Datos form: ", id, idProducto, cantidad, subTotal);

			const listaDeDetalles = document.getElementById('listaDeDetalles') as HTMLUListElement;
			const renderDetalle = (id: string, idProducto: string, cantidad: string, subTotal: string) => {
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

			(detalleForm.querySelector('input#id') as HTMLInputElement).value = '';
			(detalleForm.querySelector('select#producto') as HTMLSelectElement).selectedIndex = 0;
			(detalleForm.querySelector('input#cantidad') as HTMLInputElement).value = '';
			(detalleForm.querySelector('input#subTotal') as HTMLInputElement).value = '';
			detalleForm.classList.add('hidden');

			const lis = Array.from(listaDeDetalles.querySelectorAll('#listaDeDetalles > li'));
			console.log("LISTA: ", lis);
			const updateTotal = () => {
				const form = document.querySelector('#editPedidoForm') as HTMLFormElement;
				console.log("Actualizando total...");
				const total = lis
					.map(detalle => {
						const subtotal = parseFloat((detalle as HTMLElement).dataset.subtotal || '0');
						console.log(subtotal);
						return subtotal;
					})
					.reduce((acc, subtotal) => {
						console.log("ACC", acc, "SUBTOTAL", subtotal);
						return acc + subtotal;
					}, 0);
				(form.querySelector('input#totalPedido') as HTMLInputElement).value = total.toString();
			};
			updateTotal();

			const deleteDetalleButtons = document.querySelectorAll('.--not-registered-yet > #deleteDetalle');
			console.log("Botones de eliminar sin registrar: ", deleteDetalleButtons);
			Array.from(deleteDetalleButtons).forEach((button) => {
				console.log("Boton de eliminar: ", button);
				button.addEventListener('click', () => {
					(button as HTMLElement).parentElement?.remove();
				});
			});
		};
	};
};

const getAllProductos = async (): Promise<{ allProductos: Producto[][] }> => {
	const response = await fetch(`http://localhost:3001/api/getAllProductos`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});

	const allProductos = await response.json();

	return allProductos;
};

const deleteDetalleById = async (id: number) => {
	await fetch(`http://localhost:3001/api/deleteDetalle/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
	});
};

const deletePedidoById = async (id: number) => {
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

const generatePdf = async (pedidoId: number) => {
	console.log("Id a generar pdf: ", pedidoId);

	// Obtener los datos del pedido desde la API
	const response = await fetch(`http://localhost:3001/api/getAll`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ id: pedidoId }),
	});

	const pedido = await response.json();
	console.log("Pedido encontrado: ", pedido);

	// Crear contenido dinámico para el PDF
	const pdfContent = `
		<div class="pdf-content">
		<h1>Pedido de Venta</h1>
		<p><strong>ID Pedido:</strong> ${pedido.allPedidos.id}</p>
		<p><strong>Cliente:</strong> ${pedido.allPedidos.cliente.razonSocial} (${pedido.allPedidos.cliente.cuit})</p>
		<p><strong>Fecha:</strong> ${new Date(pedido.allPedidos.fechaPedido).toLocaleDateString()}</p>
		<p><strong>Total:</strong> $${pedido.allPedidos.totalPedido}</p>

		<h2>Detalles del Pedido</h2>
		<table>
			<thead>
			<tr>
				<th>Detalle ID</th>
				<th>Producto</th>
				<th>Cantidad</th>
				<th>Subtotal</th>
			</tr>
			</thead>
			<tbody>
			${pedido.allPedidos.detalles.map((detalle: { detalleId: any; idproducto: any; cantidad: any; subtotal: any; }) => `
				<tr>
				<td>${detalle.detalleId}</td>
				<td>${detalle.idproducto}</td>
				<td>${detalle.cantidad}</td>
				<td>$${detalle.subtotal}</td>
				</tr>
			`).join('')}
			</tbody>
		</table>
		</div>
	`;

	// Abrir nueva ventana y renderizar contenido
	const printWindow = window.open('', '_blank');
	printWindow?.document.write(`
		<html>
			<head>
			<title>Pedido ${pedido.allPedidos.id}</title>
			<style>
					${document.querySelector('style')?.innerHTML || ''}
			</style>
			</head>
			<body>${pdfContent}</body>
		</html>
		`);
	printWindow?.document.close();
	printWindow?.focus();

	// Activar el diálogo de impresión (permite guardar como PDF)
	printWindow?.print();
	printWindow?.close();
};

const testing = () => {
	console.log("Testeando...");
};

