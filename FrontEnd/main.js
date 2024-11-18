window.onload = async () => {
	console.log("Entra")
	const allPedidos = await fetch('http://localhost:3001/api/getAll', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	console.log(allPedidos);

	// Verificar si la respuesta es correcta
	if (!allPedidos.ok) {
		throw new Error('Error al obtener los datos');
	}

	// Parsear los datos de la respuesta
	const data = await allPedidos.json();

	// Extraer la lista de pedidos (primer elemento del array)
	const pedidos = data.allPedidos[0];

	// Obtener el tbody de la tabla
	const tbody = document.getElementById('pedidosTable').querySelector('tbody');

	// Limpiar el contenido actual del tbody (opcional)
	tbody.innerHTML = '';

	// Iterar sobre los pedidos y crear filas
	pedidos.forEach((pedido) => {
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
			<button class="p-2 bg-gray-200" id="deletePedido" data-id="${pedido.id}">Eliminar</button>		
		</td>
	`;

		// Agregar la fila al tbody
		tbody.appendChild(row);
	});

	const editPedidoButtons = document.querySelectorAll('#editPedido')
	
	editPedidoButtons.forEach((editPedidoButton) => {
		editPedidoButton.addEventListener('click', () => {
			const pedodoIdToEdit = event.target.dataset.id;
			console.log(`Editando pedido con ID ${pedodoIdToEdit}`);
			editPedidoById(pedodoIdToEdit)
		})
	})
	
}

const editPedidoById = async (id) => {

	const popUp = document.getElementById('editPop');
	const closeModal = popUp.querySelector('#closePop');
	popUp.classList.remove('hidden');
	
	const form = popUp.querySelector('#editPedidoForm');

	let idcliente = document.querySelector(`#idcliente[data-id='${id}']`).innerHTML; 
    let fechaPedido = document.querySelector(`#fechaPedido[data-id='${id}']`).innerHTML; 
    let nroComprobante = document.querySelector(`#nroComprobante[data-id='${id}']`).innerHTML; 
    let formaPago = document.querySelector(`#formaPago[data-id='${id}']`).innerHTML; 
    let observaciones = document.querySelector(`#observaciones[data-id='${id}']`).innerHTML; 
    let totalPedido = document.querySelector(`#totalPedido[data-id='${id}']`).innerHTML; 

	let [dia, mes, anio] = fechaPedido.split('/');
	dia = dia.padStart(2, '0');
	mes = mes.padStart(2, '0');
	let fechaCorrecta = `${anio}-${mes}-${dia}`;

	// Lleno campos del formulario con los datos actuales
	form.querySelector('input#idcliente').value = idcliente;
	form.querySelector('input#fechaPedido').value = fechaCorrecta;
	form.querySelector('input#nroComprobante').value = nroComprobante;
	form.querySelector('input#formaPago').value = formaPago;
	form.querySelector('textarea#observaciones').value = observaciones;
	form.querySelector('input#totalPedido').value = totalPedido;

	form.addEventListener('submit', async (e) => {
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
	})

	// Funcion para el manejo de los detalles del pedido
	detalles(id)

	closeModal.addEventListener('click', () => {
		popUp.classList.add('hidden');
	})
}

const detalles = (pedidoId) => {

	

}