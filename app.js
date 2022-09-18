const nombreInput = document.querySelector('#nombre')
const codigoInput = document.querySelector('#codigo')
const cantidadInput = document.querySelector('#cantidad')
const costoInput = document.querySelector('#costo')
const eliminarInput = document.querySelector('#eliminar-input')
const form = document.querySelector('#nuevo-producto')
const botonBuscar = document.querySelector('#buscar');


const botonListado = document.querySelector('#listar')
const botonEliminar = document.querySelector('#eliminar')
const botonListadoInverso = document.querySelector('#listar-inverso')


let productos = document.querySelector('#productos');


eventListeners();

const productoObj = {
    codigo: '',
    nombre: '',
    costo: '',
    cantidad: '',
}


function datosProducto(e) {
    productoObj[e.target.name] = e.target.value
}


class Inventario {
    constructor() {
        this.productos = [];

    }

    addProducto(producto) {
        this.productos[this.productos.length] =  producto

    }

    eliminarProducto(codigo) {
        // this.productos = this.productos.filter( producto => producto.id !== codigo)
        let isFound = false;
        for(let i = 0; i < this.productos.length; i++) {
            if(this.productos[i].codigo == codigo) {
                isFound = true
            }

            if(isFound) {
                this.productos[i] = this.productos[i+1]
            }
        }
        if(isFound) {
            this.productos.length -= 1;
        }

        // for(let i = posicion; i < this.productos.length - 1; i++){
        //     this.productos[i]= this.productos[i+1];
        // }

        // this.productos.length -= 1;
    }

    listarInverso() {
        const iterations = Math.floor(this.productos.length / 2)
        for(let i = 0, x = 1 ; x <= iterations; i++, x++) {
            let temp = this.productos[this.productos.length - x];
            this.productos[this.productos.length - x] = this.productos[i]
            this.productos[i] = temp;
        }
        listar()
        syncStorage()
    }

    buscar(codigo) {
        for (let i = 0; i < this.productos.length; i++) {
            if (this.productos[i].codigo == codigo) {
                return this.productos[i]
            }
        }

        return null;
    }
}

const inventario = new Inventario();
getStorageData();

function eventListeners() {
    nombreInput.addEventListener('input', datosProducto)
    codigoInput.addEventListener('input', datosProducto)
    costoInput.addEventListener('input', datosProducto)
    cantidadInput.addEventListener('input', datosProducto)
    botonEliminar.addEventListener('click', eliminarProducto)
    botonListado.addEventListener('click', listar)
    botonListadoInverso.addEventListener('click', listarInverso)
    botonBuscar.addEventListener('click', buscarProducto)

    form.addEventListener('submit', nuevoProducto)
}

function listar() {
    ui.mostrarProductos(inventario.productos)
}

class UI {
    mostrarProductos(inventario) {
        limpiarHTML();
        for(let i = 0; i < inventario.length; i++) {

            const li = document.createElement('li');
            li.innerHTML = `Nombre: ${inventario[i].nombre} <br>
                            Codigo: ${inventario[i].codigo} <br>
                            Cantidad: ${inventario[i].cantidad} <br>
                            Costo: ${inventario[i].costo} <br>`
            productos.appendChild(li);
        }
    }
}
const ui = new UI();
class Producto {
    constructor(codigo, nombre, cantidad, costo) {
        this.codigo = codigo;
        this.nombre = nombre;
        this.cantidad = cantidad;
        this.costo = costo;
    }

    acoplar() {

        inventario.addProducto({...productoObj})
        ui.mostrarProductos(inventario.productos)
        reiniciarObj();
    }
}



function nuevoProducto(e) {
    e.preventDefault();
    const {codigo, nombre, costo , cantidad} = productoObj
    if(!codigo || !nombre || !costo || !cantidad) {
        alert('Todos los campos son obligatorios')
    } else {
        let producto = new Producto(codigo, nombre, costo, cantidad);
        inventario.addProducto(producto)
        producto.acoplar()
        form.reset();
        syncStorage()

    }
}


function reiniciarObj() {
    productoObj.nombre = '';
    productoObj.codigo = '';
    productoObj.costo = '';
    productoObj.cantidad = '';
}

function limpiarHTML() {
    while(productos.firstChild) {
        productos.removeChild(productos.firstChild)
    }
}

function eliminarProducto() {
    const codigo = Number(eliminarInput.value)
    console.log(codigo)
    inventario.eliminarProducto(codigo)
    console.log('Eliminando')
}

function syncStorage() {
    localStorage.setItem('productos', JSON.stringify(inventario.productos))
}

function getStorageData() {
    inventario.productos = JSON.parse(localStorage.getItem('productos')) || [];
}

function listarInverso() {
    inventario.listarInverso();
}

function buscarProducto() {
    const codigo = Number(eliminarInput.value)
    console.log(inventario.buscar(codigo));
}