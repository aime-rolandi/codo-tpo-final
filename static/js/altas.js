const URL = "https://aime22.pythonanywhere.com/";

document.getElementById('formulario').addEventListener('submit', function (event) {
    event.preventDefault();

    var descripcion = document.getElementById('descripcion').value.trim();
    var cantidad = document.getElementById('cantidad').value.trim();
    var precio = document.getElementById('precio').value.trim();
    var proveedor = document.getElementById('proveedorProducto').value.trim();
    var imagenProducto = document.getElementById('imagenProducto').files[0];

    var errores = [];

    if (!descripcion) {
        errores.push('Descripción');
    }
    if (!cantidad) {
        errores.push('Cantidad');
    }
    if (!precio) {
        errores.push('Precio');
    }
    if (!proveedor) {
        errores.push('Proveedor');
    }
    if (!imagenProducto) {
        errores.push('Imagen del producto');
    }

    if (errores.length > 0) {
        alert('Complete los siguientes campos: ' + errores.join(', '));
        return;
    }

    var formData = new FormData();
    formData.append('descripcion', descripcion);
    formData.append('cantidad', cantidad);
    formData.append('precio', precio);
    formData.append('proveedor', proveedor);
    formData.append('imagen', imagenProducto);

    fetch(URL + 'productos', {
        method: 'POST',
        body: formData 
    })
    .then(function (response) {
        if (response.ok) { 
            return response.json(); 
        } else {
            throw new Error('Error al agregar el producto.');
        }
    })
    .then(function (data) {
        alert('Producto agregado correctamente.');
    })
    .catch(function (error) {
        alert('Error al agregar el producto.');
    })
    .finally(function () {
        document.getElementById('descripcion').value = "";
        document.getElementById('cantidad').value = "";
        document.getElementById('precio').value = "";
        document.getElementById('imagenProducto').value = "";
        document.getElementById('proveedorProducto').value = "";
    });
});
