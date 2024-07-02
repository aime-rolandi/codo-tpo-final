const URL = "https://aime22.pythonanywhere.com/"

function obtenerProductos() {
    fetch(URL + 'productos') 
        .then(response => {
            if (response.ok) { return response.json(); }
        })
        .then(data => {
            const productosTable = document.getElementById('productos-table').getElementsByTagName('tbody')[0];
            productosTable.innerHTML = ''; 
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