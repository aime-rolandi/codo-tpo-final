const URL = "https://aime22.pythonanywhere.com/";

// Realizamos la solicitud GET al servidor para obtener todos los productos.
fetch(URL + 'productos')
    .then(function (response) {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error al obtener los productos.');
        }
    })
    .then(function (data) {
        let productoSelect = document.getElementById('productoSelect');

        // Iteramos sobre cada producto y agregamos opciones al select
        for (let producto of data) {
            let option = document.createElement('option');
            option.value = producto.codigo;
            option.textContent = producto.descripcion;
            productoSelect.appendChild(option);
        }
    })
    .catch(function (error) {
        alert('Error al obtener los productos.');
    });

document.getElementById('productoSelect').addEventListener('change', function () {
    let codigo = this.value;
    if (codigo) {
        // Realizamos la solicitud GET para obtener los detalles del producto seleccionado
        fetch(URL + 'productos/' + codigo)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Error al obtener los detalles del producto.');
                }
            })
            .then(function (producto) {
                // Mostramos los detalles del producto en la tarjeta
                let tarjetaProducto = document.getElementById('tarjetaProducto');
                let detallesProducto = document.getElementById('detallesProducto');
                detallesProducto.innerHTML = `
                    <img src="https://aime22.pythonanywhere.com/static/images/${producto.imagen}" alt="Imagen del producto" style="max-height: 200px; ">
                    <div>
                        <p><strong>Código:</strong> ${producto.codigo}</p>
                        <p><strong>Descripción:</strong> ${producto.descripcion}</p>
                        <p><strong>Cantidad:</strong> ${producto.cantidad}</p>
                        <p><strong>Precio:</strong> ${producto.precio}</p>
                        <p><strong>Proveedor:</strong> ${producto.proveedor}</p>
                    </div>
                `;
                tarjetaProducto.style.display = 'block';
            })
            .catch(function (error) {
                alert('Error al obtener los detalles del producto.');
            });
    } else {
        document.getElementById('tarjetaProducto').style.display = 'none';
    }
});