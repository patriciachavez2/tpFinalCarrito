// Definimos la clase base Producto
class Producto {
    constructor(nombre, precio, imagen) {
        this.nombre = nombre;
        this.precio = precio;
        this.imagen = imagen;
        this.cantidad = 1;
    }

    mostrarInformacion() {
        return `Nombre: ${this.nombre}, Precio: $${this.precio}, Cantidad: ${this.cantidad}`;
    }
}

// Definimos la clase derivada ProductoElectronico
class ProductoElectronico extends Producto {
    constructor(nombre, precio, imagen, garantia) {
        super(nombre, precio, imagen);
        this.garantia = garantia; // Propiedad específica para productos electrónicos
    }

    mostrarInformacion() {
        return `${super.mostrarInformacion()}, Garantía: ${this.garantia} años`;
    }
}

// Definimos la clase Carrito
class Carrito {
    constructor() {
        this.productos = [];
    }

    agregarProducto(nuevoProducto) {
        const productoExistente = this.productos.find(producto => producto.nombre === nuevoProducto.nombre);
        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            this.productos.push(nuevoProducto);
        }
        this.actualizarContador();
        this.mostrarCarrito();
    }

    eliminarProducto(nombreProducto) {
        this.productos = this.productos.filter(producto => producto.nombre !== nombreProducto);
        this.actualizarContador();
        this.mostrarCarrito();
    }

    vaciarCarrito() {
        this.productos = [];
        this.actualizarContador();
        this.mostrarCarrito();

        // Ocultar el carrito si está vacío
        const contenedorCarrito = document.querySelector(".buy-card");
        contenedorCarrito.style.display = "none"; // Oculta el carrito
    }

    calcularTotal() {
        return this.productos.reduce((total, producto) => total + producto.precio * producto.cantidad, 0);
    }

    mostrarCarrito() {
        const listaProductos = document.querySelector(".buy-card");
        listaProductos.innerHTML = `
            <ul class="nav-card">
                <li>Imagen</li>
                <li>Producto</li>
                <li>Precio</li>
                <li>Cantidad</li>
                <li>Garantía</li> <!-- Añadido para la garantía -->
            </ul>
        `;

        if (this.productos.length === 0) {
            listaProductos.innerHTML += '<p>El carrito está vacío</p>';
        } else {
            this.productos.forEach(producto => {
                const itemCarrito = document.createElement("div");
                itemCarrito.classList.add("lista_de_productos");
                itemCarrito.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}">
                    <p>${producto.nombre}</p>
                    <p>$${producto.precio}</p>
                    <p>${producto.cantidad}</p>
                    <p>${producto.garantia} años</p> <!-- Muestra la garantía aquí -->
                    <button class="btn-cantidad" onclick="carrito.actualizarCantidad('${producto.nombre}', 1)">+</button>
                    <button class="btn-cantidad" onclick="carrito.actualizarCantidad('${producto.nombre}', -1)">-</button>
                    <p><span class="eliminar" data-nombre="${producto.nombre}">🗑️</span></p>
                `;
                listaProductos.appendChild(itemCarrito);
            });

            const total = document.createElement("p");
            total.innerHTML = `<strong>Total: $${this.calcularTotal()}</strong>`;
            listaProductos.appendChild(total);

            // Asegúrate de que los botones solo se agreguen una vez
            if (!listaProductos.querySelector('.btn-vaciar')) {
                const botonVaciarCarrito = document.createElement("button");
                botonVaciarCarrito.textContent = "Vaciar Carrito";
                botonVaciarCarrito.addEventListener("click", () => this.vaciarCarrito());
                botonVaciarCarrito.classList.add("btn-vaciar");
                listaProductos.appendChild(botonVaciarCarrito);
            }

            if (!listaProductos.querySelector('.btn-confirmar')) {
                const botonConfirmarCompra = document.createElement("button");
                botonConfirmarCompra.textContent = "FINALIZAR COMPRA";
                botonConfirmarCompra.classList.add("btn-confirmar");
                botonConfirmarCompra.addEventListener("click", () => this.confirmarCompra());
                listaProductos.appendChild(botonConfirmarCompra);
            }

            document.querySelectorAll(".eliminar").forEach(boton => {
                boton.addEventListener("click", (e) => {
                    const nombreProducto = e.target.dataset.nombre;
                    this.eliminarProducto(nombreProducto);
                });
            });
        }
        this.guardarEnLocalStorage();
    }

    confirmarCompra() {
        if (this.productos.length > 0) {
            alert("¡Gracias por tu compra!");
            this.vaciarCarrito();
        } else {
            alert("El carrito está vacío.");
        }
    }

    actualizarContador() {
        const totalProductos = this.productos.reduce((total, producto) => total + producto.cantidad, 0);
        document.getElementById("contador-productos").textContent = totalProductos;
    }

    // Guardar el carrito en localStorage
    guardarEnLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(this.productos));
    }

    // Cargar el carrito desde localStorage
    cargarDesdeLocalStorage() {
        const productosGuardados = localStorage.getItem('carrito');
        if (productosGuardados) {
            this.productos = JSON.parse(productosGuardados).map(producto => {
                return new ProductoElectronico(producto.nombre, producto.precio, producto.imagen, producto.garantia);
            });
            this.mostrarCarrito();
            this.actualizarContador();
        }
    }

    // Actualizar la cantidad de un producto
    actualizarCantidad(nombreProducto, cantidad) {
        const productoExistente = this.productos.find(producto => producto.nombre === nombreProducto);
        if (productoExistente) {
            productoExistente.cantidad += cantidad;
            if (productoExistente.cantidad <= 0) {
                this.eliminarProducto(nombreProducto);
            }
            this.guardarEnLocalStorage(); // Guardar en localStorage después de actualizar
            this.mostrarCarrito();
        }
    }
}

// Se crea nueva instancia de la clase Carrito
const carrito = new Carrito();
carrito.cargarDesdeLocalStorage(); // Cargar productos desde localStorage al iniciar

// Selecciona todos los elementos con clase agregar_carrito para asignarles el evento click
document.querySelectorAll(".agregar_carrito").forEach(boton => {
    boton.addEventListener("click", (e) => {
        const producto = e.target.closest(".items");
        const nombre = producto.querySelector("h3").textContent;
        const precio = parseFloat(producto.querySelector("p").textContent.replace('$', ''));
        const imagen = producto.querySelector("img").src;

        // Se crea un nuevo ProductoElectronico
        const nuevoProducto = new ProductoElectronico(nombre, precio, imagen, 1); // Por defecto, garantía 1 año

        carrito.agregarProducto(nuevoProducto);
        document.querySelector(".buy-card").style.display = 'block'; // Mostrar el carrito al agregar un producto
    });
});

// Funcionalidad para mostrar u ocultar el Carrito al hacer click en la imagen del carrito
document.querySelector(".carrito-img").addEventListener("click", () => {
    const contenedorCarrito = document.querySelector(".buy-card");
    if (contenedorCarrito.style.display === "none" || contenedorCarrito.style.display === "") {
        contenedorCarrito.style.display = "block";
        carrito.mostrarCarrito();
    } else {
        contenedorCarrito.style.display = "none";
    }
});

let currentSlideIndex = 0;
const slidesContainer = document.querySelector(".slides");
const totalSlides = document.querySelectorAll(".slide").length;

function updateSlidePosition() {
    slidesContainer.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
}

function nextSlide() {
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    updateSlidePosition();
}

// Cambio automático de imágenes cada 5 segundos
setInterval(nextSlide, 5000);




