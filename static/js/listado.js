const URL = "https://aime22.pythonanywhere.com/"

fetch(URL + 'productos')
    .then(function (response) {
        if (response.ok) {
            return response.json(); 
    } else {
            throw new Error('Error al obtener los productos.');
        }
    })

    .then(function (data) {
        let tablaProductos = document.getElementById('tablaProductos'); 

        for (let producto of data) {
            let fila = document.createElement('tr');
            fila.innerHTML = '<td>' + producto.codigo + '</td>' +
                '<td>' + producto.descripcion + '</td>' +
                '<td>' + producto.cantidad + '</td>' +
                '<td>' + producto.precio + '</td>' +
                '<td class="td-img"><img src=https://www.pythonanywhere.com/user/aime22/files/home/aime22/mysite/static/images/' + producto.imagen +' alt="Imagen del producto" style="width: 100px;"></td>' + '<td align="right">' + producto.proveedor + '</td>';
            tablaProductos.appendChild(fila);
        }
    })

    .catch(function (error) {
        alert('Error al obtener los productos.');
    });