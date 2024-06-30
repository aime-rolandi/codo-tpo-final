const URL = "https://aime22.pythonanywhere.com/";

// Variables de estado
let codigo = '';
let descripcion = '';
let cantidad = '';
let precio = '';
let proveedor = '';
let imagen = '';
let imagenSeleccionada = null;
let imagenUrlTemp = null;
let mostrarDatosProducto = false;

document.getElementById('form-obtener-producto').addEventListener('submit', obtenerProducto);
document.getElementById('form-guardar-cambios').addEventListener('submit', guardarCambios);
document.getElementById('nuevaImagen').addEventListener('change', seleccionarImagen);

function obtenerProducto(event) {
    event.preventDefault();
    codigo = document.getElementById('codigo').value;
    fetch(`${URL}productos/${codigo}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Producto no encontrado.');
            }
        })
        .then(data => {
            descripcion = data.descripcion;
            cantidad = data.cantidad;
            precio = data.precio;
            proveedor = data.proveedor;
            imagen = data.imagen;
            mostrarDatosProducto = true;
            mostrarFormulario();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Código no encontrado.');
        });
}

function mostrarFormulario() {
    if (mostrarDatosProducto) {
        document.getElementById('descripcionModificar').value = descripcion;
        document.getElementById('cantidadModificar').value = cantidad;
        document.getElementById('precioModificar').value = precio;
        document.getElementById('proveedorProducto').value = proveedor; 

        const imagenActual = document.getElementById('imagen-actual');
        if (imagen && !imagenSeleccionada) {
            imagenActual.src = `https://aime22.pythonanywhere.com/static/images/${imagen}`;
            imagenActual.style.display = 'block';
        } else {
            imagenActual.style.display = 'none';
        }

        document.getElementById('datos-producto').style.display = 'block';
    } else {
        document.getElementById('datos-producto').style.display = 'none';
    }
}

function seleccionarImagen(event) {
    const file = event.target.files[0];
    imagenSeleccionada = file;
    imagenUrlTemp = URL.createObjectURL(file);

    const imagenVistaPrevia = document.getElementById('imagen-vista-previa');
    imagenVistaPrevia.src = imagenUrlTemp;
    imagenVistaPrevia.style.display = 'block';
}

function guardarCambios(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('codigo', codigo);
    formData.append('descripcion', document.getElementById('descripcionModificar').value);
    formData.append('cantidad', document.getElementById('cantidadModificar').value);
    formData.append('proveedor', document.getElementById('proveedorProducto').value); 
    formData.append('precio', document.getElementById('precioModificar').value);

    if (imagenSeleccionada) {
        formData.append('imagen', imagenSeleccionada, imagenSeleccionada.name);
    }

    fetch(`${URL}productos/${codigo}`, {
        method: 'PUT',
        body: formData,
    })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error al guardar los cambios del producto.');
            }
        })
        .then(data => {
            alert('Producto actualizado correctamente.');
            limpiarFormulario();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error al actualizar el producto.');
        });
}

function limpiarFormulario() {
    document.getElementById('codigo').value = '';
    document.getElementById('descripcionModificar').value = '';
    document.getElementById('cantidadModificar').value = '';
    document.getElementById('precioModificar').value = '';
    document.getElementById('proveedorProducto').value = ''; 
    document.getElementById('nuevaImagen').value = '';

    const imagenActual = document.getElementById('imagen-actual');
    imagenActual.style.display = 'none';

    const imagenVistaPrevia = document.getElementById('imagen-vista-previa');
    imagenVistaPrevia.style.display = 'none';

    codigo = '';
    descripcion = '';
    cantidad = '';
    precio = '';
    proveedor = '';
    imagen = '';
    imagenSeleccionada = null;
    imagenUrlTemp = null;
    mostrarDatosProducto = false;

    document.getElementById('datos-producto').style.display = 'none';
}
