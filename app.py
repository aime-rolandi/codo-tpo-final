from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
from werkzeug.utils import secure_filename
import os
import time

app = Flask(__name__)
CORS(app) 

class Catalogo:
    # Metodos en la clase
    def __init__(self, host, user, password, database):
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password
        )
        self.cursor = self.conn.cursor()
        try:
            self.cursor.execute(f"USE {database}")
        except mysql.connector.Error as err:
            if err.errno == mysql.connector.errorcode.ER_BAD_DB_ERROR:
                self.cursor.execute(f"CREATE DATABASE {database}")
                self.conn.database = database
            else:
                raise err

        self.cursor.execute('''CREATE TABLE IF NOT EXISTS productos (
            codigo INT AUTO_INCREMENT PRIMARY KEY,
            descripcion VARCHAR(255) NOT NULL,
            cantidad INT NOT NULL,
            precio DECIMAL(10, 2) NOT NULL,
            imagen VARCHAR(255),
            proveedor INT(4))''')
        self.conn.commit()
        
        self.cursor.close()
        self.cursor = self.conn.cursor(dictionary=True)

    def listar_productos(self):
        self.cursor.execute("SELECT * FROM productos")
        productos = self.cursor.fetchall()
        return productos
    
    def consultar_producto(self, codigo):
        self.cursor.execute(f"SELECT * FROM productos WHERE codigo = {codigo}")
        return self.cursor.fetchone()

    # Mostrar producto (read)
    def mostrar_producto(self, codigo):
        producto = self.consultar_producto(codigo)
        if producto:
            print("-" * 40)
            print(f"Código.....: {producto['codigo']}")
            print(f"Descripción: {producto['descripcion']}")
            print(f"Cantidad...: {producto['cantidad']}")
            print(f"Precio.....: {producto['precio']}")
            print(f"Imagen.....: {producto['imagen']}")
            print(f"Proveedor..: {producto['proveedor']}")
            print("-" * 40)
        else:
            print("Producto no encontrado.")

    # Agregar un producto (create)
    def agregar_producto(self, descripcion, cantidad, precio, imagen, proveedor):
        
        sql = "INSERT INTO productos (descripcion, cantidad, precio, imagen, proveedor) VALUES (%s, %s, %s, %s, %s)"
        valores = (descripcion, cantidad, precio, imagen, proveedor)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.lastrowid

    # Modificar un producto (update)
    def modificar_producto(self, codigo, nueva_descripcion, nueva_cantidad, nuevo_precio, nueva_imagen, nuevo_proveedor):
        sql = "UPDATE productos SET descripcion = %s, cantidad = %s, precio = %s, imagen = %s, proveedor = %s WHERE codigo = %s"
        valores = (nueva_descripcion, nueva_cantidad, nuevo_precio, nueva_imagen, nuevo_proveedor, codigo)
        self.cursor.execute(sql, valores)
        self.conn.commit()
        return self.cursor.rowcount > 0

    # Eliminar un producto (delete)
    def eliminar_producto(self, codigo):
        self.cursor.execute(f"DELETE FROM productos WHERE codigo = {codigo}")
        self.conn.commit()
        return self.cursor.rowcount > 0

# Crear una instancia de la clase Catalogo
catalogo = Catalogo(host='aime22.mysql.pythonanywhere-services.com', user='aime22', password='backpy123', database='aime22$miapp')

# Carpeta para guardar las imagenes
ruta_destino = '/home/aime22/mysite/static/images/'

@app.route("/productos", methods=["GET"])
def listar_productos():
    productos = catalogo.listar_productos()
    return jsonify(productos)

@app.route("/productos/<int:codigo>", methods=["GET"])
def mostrar_producto(codigo):
    producto = catalogo.consultar_producto(codigo)
    if producto:
        return jsonify(producto)
    else:
        return "Producto no encontrado", 404

@app.route("/productos", methods=["POST"])
def agregar_producto():
    descripcion = request.form['descripcion']
    cantidad = request.form['cantidad']
    precio = request.form['precio']
    imagen = request.files['imagen']
    proveedor = request.form['proveedor']  
    nombre_imagen = ""

    # Genero el nombre de la imagen para que sea único
    nombre_imagen = secure_filename(imagen.filename)
    nombre_base, extension = os.path.splitext(nombre_imagen) 
    nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}" 

    nuevo_codigo = catalogo.agregar_producto(descripcion, cantidad, precio, nombre_imagen, proveedor)
    if nuevo_codigo:    
        imagen.save(os.path.join(ruta_destino, nombre_imagen))
        return jsonify({"mensaje": "Producto agregado correctamente.", "codigo": nuevo_codigo, "imagen": nombre_imagen}), 201
    else:
        return jsonify({"mensaje": "Error al agregar el producto."}), 500

@app.route("/productos/<int:codigo>", methods=["PUT"])
def modificar_producto(codigo):
    #Se recuperan los nuevos datos del formulario
    nueva_descripcion = request.form.get("descripcion")
    nueva_cantidad = request.form.get("cantidad")
    nuevo_precio = request.form.get("precio")
    nuevo_proveedor = request.form.get("proveedor")
    
    if 'imagen' in request.files:
        imagen = request.files['imagen']
        nombre_imagen = secure_filename(imagen.filename) 
        nombre_base, extension = os.path.splitext(nombre_imagen) 
        nombre_imagen = f"{nombre_base}_{int(time.time())}{extension}" 

        imagen.save(os.path.join(ruta_destino, nombre_imagen))
        
        producto = catalogo.consultar_producto(codigo)
        if producto: 
            imagen_vieja = producto["imagen"]
            ruta_imagen = os.path.join(ruta_destino, imagen_vieja)

            if os.path.exists(ruta_imagen):
                os.remove(ruta_imagen)
    else:     
        producto = catalogo.consultar_producto(codigo)
        if producto:
            nombre_imagen = producto["imagen"]

    if catalogo.modificar_producto(codigo, nueva_descripcion, nueva_cantidad, nuevo_precio, nombre_imagen, nuevo_proveedor):
        return jsonify({"mensaje": "Producto modificado"}), 200
    else:
        return jsonify({"mensaje": "Producto no encontrado"}), 403

@app.route("/productos/<int:codigo>", methods=["DELETE"])
def eliminar_producto(codigo):
    # Primero, obtiene la información del producto para encontrar la imagen
    producto = catalogo.consultar_producto(codigo)
    if producto:
        ruta_imagen = os.path.join(ruta_destino, producto['imagen'])
        if os.path.exists(ruta_imagen):
            os.remove(ruta_imagen)

        if catalogo.eliminar_producto(codigo):
            return jsonify({"mensaje": "Producto eliminado"}), 200
        else:
            return jsonify({"mensaje": "Error al eliminar el producto"}), 500
    else:
        return jsonify({"mensaje": "Producto no encontrado"}), 404

if __name__ == "__main__":
    app.run(debug=True)