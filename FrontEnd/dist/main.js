"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
window.onload = function () { return __awaiter(void 0, void 0, void 0, function () {
    var displayPedidos, setPedidosButtons, getPedidos, getPedidosByDate, searchByIdForm, searchByDatesForm, allPedidos, data, pedidos;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                displayPedidos = function (pedidosList) {
                    var _a;
                    var tbody = (_a = document.getElementById('pedidosTable')) === null || _a === void 0 ? void 0 : _a.querySelector('tbody');
                    if (!tbody)
                        return; // Return if tbody is not found
                    tbody.innerHTML = ''; // Clear existing rows
                    console.log("Lista de pedidos", pedidosList);
                    pedidosList.forEach(function (pedido) {
                        var row = document.createElement('tr');
                        row.innerHTML = "\n                <td data-id=\"".concat(pedido.id, "\" id=\"id\" class=\"p-4 border border-slate-500\">").concat(pedido.id, "</td>\n                <td data-id=\"").concat(pedido.id, "\" id=\"idcliente\" class=\"p-4 border border-slate-500\">").concat(pedido.idcliente, "</td>\n                <td data-id=\"").concat(pedido.id, "\" id=\"fechaPedido\" class=\"p-4 border border-slate-500\">").concat(new Date(pedido.fechaPedido).toLocaleDateString(), "</td>\n                <td data-id=\"").concat(pedido.id, "\" id=\"nroComprobante\" class=\"p-4 border border-slate-500\">").concat(pedido.nroComprobante, "</td>\n                <td data-id=\"").concat(pedido.id, "\" id=\"formaPago\" class=\"p-4 border border-slate-500\">").concat(pedido.formaPago, "</td>\n                <td data-id=\"").concat(pedido.id, "\" id=\"observaciones\" class=\"p-4 border border-slate-500\">").concat(pedido.observaciones, "</td>\n                <td data-id=\"").concat(pedido.id, "\" id=\"totalPedido\" class=\"p-4 border border-slate-500\">").concat(pedido.totalPedido, "</td>\n                <td class=\"p-4 border border-slate-500\">\n                    <div class=\"flex gap-2\">\n                        <button class=\"p-2 bg-gray-200\" id=\"editPedido\" data-id=\"").concat(pedido.id, "\">Editar</button>\n                        <button class=\"p-2 bg-gray-200\" onclick=\"generatePdf(").concat(pedido.id, ")\" data-id=\"").concat(pedido.id, "\">PDF</button>\n                        <button class=\"p-2 bg-gray-200\" onclick=\"deletePedidoById(").concat(pedido.id, ")\" data-id=\"").concat(pedido.id, "\">Eliminar</button>\t\t\n                    </div>\n                </td>");
                        tbody.appendChild(row);
                    });
                };
                setPedidosButtons = function () {
                    var editPedidoButtons = document.querySelectorAll('#editPedido');
                    editPedidoButtons.forEach(function (editPedidoButton) {
                        editPedidoButton.onclick = function (e) {
                            var pedodoIdToEdit = e.target.dataset.id;
                            console.log("Editando pedido con ID ".concat(pedodoIdToEdit));
                            if (pedodoIdToEdit) {
                                editPedidoById(pedodoIdToEdit);
                            }
                        };
                    });
                };
                getPedidos = function (id) { return __awaiter(void 0, void 0, void 0, function () {
                    var response, allPedidos;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fetch('http://localhost:3001/api/getAll', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ id: id })
                                })];
                            case 1:
                                response = _a.sent();
                                return [4 /*yield*/, response.json()];
                            case 2:
                                allPedidos = _a.sent();
                                displayPedidos(allPedidos.allPedidos[0]);
                                setPedidosButtons();
                                return [2 /*return*/, allPedidos];
                        }
                    });
                }); };
                getPedidosByDate = function (dates) { return __awaiter(void 0, void 0, void 0, function () {
                    var response, allPedidosByDate;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, fetch('http://localhost:3001/api/getPedidosByDate', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ dates: dates })
                                })];
                            case 1:
                                response = _a.sent();
                                return [4 /*yield*/, response.json()];
                            case 2:
                                allPedidosByDate = _a.sent();
                                console.log("Pedidos por fecha recibidos: ", allPedidosByDate);
                                displayPedidos(allPedidosByDate.pedidosByDate[0]);
                                setPedidosButtons();
                                return [2 /*return*/, allPedidosByDate];
                        }
                    });
                }); };
                searchByIdForm = document.getElementById('searchByIdForm');
                searchByIdForm.onsubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
                    var idToSearch;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                e.preventDefault();
                                idToSearch = searchByIdForm.querySelector('input').value;
                                return [4 /*yield*/, getPedidos(idToSearch)];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                searchByDatesForm = document.getElementById('searchByDates');
                searchByDatesForm.onsubmit = function (e) {
                    e.preventDefault();
                    var fromDate = searchByDatesForm.querySelector('input#from').value;
                    var toDate = searchByDatesForm.querySelector('input#to').value;
                    console.log("Buscando desde ", fromDate, " hasta ", toDate);
                    getPedidosByDate({ fromDate: fromDate, toDate: toDate });
                };
                return [4 /*yield*/, getPedidos('')];
            case 1:
                allPedidos = _a.sent();
                console.log("Todos los pedidos: ", allPedidos);
                return [4 /*yield*/, allPedidos];
            case 2:
                data = _a.sent();
                pedidos = data.allPedidos[0];
                displayPedidos(pedidos);
                setPedidosButtons();
                return [2 /*return*/];
        }
    });
}); };
var editPedidoById = function (id) { return __awaiter(void 0, void 0, void 0, function () {
    var popUp, closeModal, form, idcliente, fechaPedido, nroComprobante, formaPago, observaciones, totalPedido, _a, mes, dia, anio, fechaCorrecta;
    var _b, _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        popUp = document.getElementById('editPop');
        closeModal = popUp.querySelector('#closePop');
        popUp.classList.remove('hidden');
        (_b = popUp.querySelector('div#detallesWrapper')) === null || _b === void 0 ? void 0 : _b.classList.remove('hidden');
        form = popUp.querySelector('#editPedidoForm');
        idcliente = (_c = document.querySelector("#idcliente[data-id='".concat(id, "']"))) === null || _c === void 0 ? void 0 : _c.innerHTML;
        fechaPedido = (_d = document.querySelector("#fechaPedido[data-id='".concat(id, "']"))) === null || _d === void 0 ? void 0 : _d.innerHTML;
        nroComprobante = (_e = document.querySelector("#nroComprobante[data-id='".concat(id, "']"))) === null || _e === void 0 ? void 0 : _e.innerHTML;
        formaPago = (_f = document.querySelector("#formaPago[data-id='".concat(id, "']"))) === null || _f === void 0 ? void 0 : _f.innerHTML;
        observaciones = (_g = document.querySelector("#observaciones[data-id='".concat(id, "']"))) === null || _g === void 0 ? void 0 : _g.innerHTML;
        totalPedido = (_h = document.querySelector("#totalPedido[data-id='".concat(id, "']"))) === null || _h === void 0 ? void 0 : _h.innerHTML;
        if (fechaPedido) {
            _a = fechaPedido.split('/'), mes = _a[0], dia = _a[1], anio = _a[2];
            dia = dia.padStart(2, '0');
            mes = mes.padStart(2, '0');
            fechaCorrecta = "".concat(anio, "-").concat(mes, "-").concat(dia);
            console.log("Fecha del pedido: ", fechaCorrecta);
            form.querySelector('input#idcliente').value = idcliente || '';
            form.querySelector('input#fechaPedido').value = fechaCorrecta;
            form.querySelector('input#nroComprobante').value = nroComprobante || '';
            form.querySelector('input#formaPago').value = formaPago || '';
            form.querySelector('textarea#observaciones').value = observaciones || '';
            form.querySelector('input#totalPedido').value = totalPedido || '';
        }
        form.onsubmit = function (e) { return __awaiter(void 0, void 0, void 0, function () {
            var editedPedido, responseJson;
            var _a, _b, _c, _d, _e, _f;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        e.preventDefault();
                        if (!confirm("Confirmar cambios?")) return [3 /*break*/, 3];
                        return [4 /*yield*/, fetch("http://localhost:3001/api/editPedido/".concat(id), {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    idcliente: (_a = form.querySelector('input#idcliente')) === null || _a === void 0 ? void 0 : _a.value,
                                    fechaPedido: (_b = form.querySelector('input#fechaPedido')) === null || _b === void 0 ? void 0 : _b.value,
                                    nroComprobante: (_c = form.querySelector('input#nroComprobante')) === null || _c === void 0 ? void 0 : _c.value,
                                    formaPago: (_d = form.querySelector('input#formaPago')) === null || _d === void 0 ? void 0 : _d.value,
                                    observaciones: (_e = form.querySelector('textarea#observaciones')) === null || _e === void 0 ? void 0 : _e.value,
                                    totalPedido: (_f = form.querySelector('input#totalPedido')) === null || _f === void 0 ? void 0 : _f.value,
                                })
                            })];
                    case 1:
                        editedPedido = _g.sent();
                        if (!editedPedido.ok) return [3 /*break*/, 3];
                        return [4 /*yield*/, editedPedido.json()];
                    case 2:
                        responseJson = _g.sent();
                        console.log('Respuesta del servidor:', responseJson);
                        window.location.reload();
                        _g.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        closeModal.onclick = function () {
            popUp.classList.add('hidden');
        };
        return [2 /*return*/];
    });
}); };
var generatePdf = function (pedidoId) { return __awaiter(void 0, void 0, void 0, function () {
    var response, pedido, res, detalles, jsPDF, doc;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Id a generar pdf: ", pedidoId);
                return [4 /*yield*/, fetch("http://localhost:3001/api/getAll", {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: pedidoId })
                    })];
            case 1:
                response = _a.sent();
                return [4 /*yield*/, response.json()];
            case 2:
                pedido = _a.sent();
                return [4 /*yield*/, fetch("http://localhost:3001/api/getDetallesById/".concat(pedidoId), {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                    })];
            case 3:
                res = _a.sent();
                return [4 /*yield*/, res.json()];
            case 4:
                detalles = _a.sent();
                console.log("Generando PDF... ", detalles);
                jsPDF = window.jspdf.jsPDF;
                doc = new jsPDF();
                doc.setFontSize(16);
                doc.text("Pedido ID: ".concat(pedidoId), 10, 10);
                doc.setFontSize(12);
                doc.text("Cliente ID: ".concat(pedido.allPedidos[0][0].idcliente), 10, 20);
                doc.text("Fecha: ".concat(new Date(pedido.allPedidos[0][0].fechaPedido).toLocaleDateString()), 10, 30);
                doc.text("Forma de Pago: ".concat(pedido.allPedidos[0][0].formaPago), 10, 40);
                doc.text("Observaciones: ".concat(pedido.allPedidos[0][0].observaciones), 10, 50);
                doc.text("Total: $".concat(pedido.allPedidos[0][0].totalPedido), 10, 60);
                doc.autoTable({
                    startY: 70,
                    head: [['ID Producto', 'Nombre Producto', 'Cantidad', 'Subtotal']],
                    body: detalles.detalles[0].map(function (detalle) { return [
                        detalle.idproducto,
                        detalle.productoDenominacion,
                        detalle.cantidad,
                        "$".concat(detalle.subtotal),
                    ]; }),
                });
                doc.save("Pedido_".concat(pedidoId, ".pdf"));
                return [2 /*return*/];
        }
    });
}); };
