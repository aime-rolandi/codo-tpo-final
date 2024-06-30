const URL = "https://aime22.pythonanywhere.com/"


// Obtiene el contenido del inventario
function obtenerProductos() {
    fetch(URL + 'productos') // Realiza una solicitud GET al servidor y obtener la lista de productos.
        .then(response => {
            if (response.ok) { return response.json(); }
        })
        // Asigna los datos de los productos obtenidos a la propiedad productos del estado.
        .then(data => {
            const productosTable = document.getElementById('productos-table').getElementsByTagName('tbody')[0];
            productosTable.innerHTML = ''; // Limpia la tabla antes de insertar nuevos datos
            data.forEach(producto => {
                const row = productosTable.insertRow();
                row.innerHTML = `
                    <td>${producto.codigo}</td>
                    <td>${producto.descripcion}</td>
                    <td>${producto.cantidad}</td>
                    <td align="right">${producto.precio}</td>
                    <td><button class="btn-eliminar" onclick="eliminarProducto('${producto.codigo}')">Eliminar</button></td>
                `;
            });
        })
        .catch(error => {
            console.log('Error:', error);
            alert('Error al obtener los productos.');
        });
}

// Se utiliza para eliminar un producto.
function eliminarProducto(codigo) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        fetch(URL + `productos/${codigo}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    obtenerProductos();
                    alert('Producto eliminado correctamente.');
                }
            })
            .catch(error => {
                alert(error.message);
            });
    }
}

document.addEventListener('DOMContentLoaded', obtenerProductos);