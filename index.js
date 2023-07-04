const obtenerProductos = async (filters) => {
  let values = await fetch("data.json")
    .then((response) => response.json())
    .then((response) => response.items);

  if (filters) {
    const { precioMinimo, precioMaximo } = filters;
    values = values.filter((producto) => {
      const precio = parseFloat(producto.price);
      if (precioMinimo && !precioMaximo) {
        return precioMinimo <= precio;
      }
      if (!precioMinimo && precioMaximo) {
        return precio <= precioMaximo;
      }
      return precioMinimo <= precio && precio <= precioMaximo;
    });
  }
  return values;
};

const showproduct = (response) => {
  const container = document.getElementById("section-product");
  container.innerHTML = "";
  response.map((productInformation) => {
    const product = `<div class="card">
        <div class="card__image"><img class="image" src="${productInformation.image_path} " /></div>
        <div class="card__description">
          <span class="item">${productInformation.name} </span><br />
          <span class="item__description"
            >${productInformation.description}</span
          >
          <div class="buy">
            <div class="buy__button" onclick="productSubmit(this)" data-product-information='${JSON.stringify(productInformation)}'>
              Añadir al carrito <img src="assets/buy_car.svg"/>
            </div>
            <span class="number">${productInformation.price} $</span>
          </div>
        </div>
      </div> `;
    const containerProduct = document.createElement("div");
    containerProduct.innerHTML = product;
    container.appendChild(containerProduct);
  });
};
obtenerProductos().then((response) => showproduct(response));

// Primero, debes obtener los valores de entrada de precio mínimo y máximo del usuario y convertirlos a números decimales utilizando la función parseFloat() . Luego, debes tomar la lista de productos y filtrarlos por aquellos que se encuentran dentro de ese rango de precios. Puedes utilizar el método filter() de JavaScript con una función de retroceso (callback) para realizar la filtración.

document
  .querySelector(".filter-button")
  .addEventListener("click", async function () {
    // Obtener los valores de los campos de entrada
    const precioMinimo = parseFloat(
      document.getElementById("precio-minimo").value
    );
    const precioMaximo = parseFloat(
      document.getElementById("precio-maximo").value
    );

    if (!precioMinimo && !precioMaximo) {
      alert("Debes ingresar al menos un precio para poder filtrar");
      return;
    }
    if (precioMinimo > precioMaximo) {
      alert("El valor del precio minimo no puede ser mayor al precio maximo");
      return;
    }

    const filteredProducts = await obtenerProductos({
      precioMinimo,
      precioMaximo,
    });
    showproduct(filteredProducts);
  });

  const productSubmit = (element) => {
    const product = JSON.parse(element.getAttribute('data-product-information'))
      let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
      carrito.push(product);
      localStorage.setItem("carrito", JSON.stringify(carrito));
  }



  

// Obtenemos los elementos del DOM
const productos = document.querySelectorAll(".card");
const botonAgregar = document.querySelectorAll(".buy__button");
const tbody = document.querySelector("tbody");
const total = document.querySelector("#total");

// Función para mostrar el carrito de compras
function mostrarCarrito() {
  let tablaHTML = "";
  let precioTotal = 0;
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.forEach((item) => {
    tablaHTML += `
            <tr class="table__item">
              <td class="number">1</td>
              <td>
                <div class="table__product">
                  <img
                    class="im"
                    src="${item.image_path} "
                    width="150rem"
                  />
                  <div class="product__description">
                    <span class="item">${item.name}</span><br />
                    <span class="item__description"
                      >${item.description}</span
                    >
                  </div>
                  <div class="counter">
                    <img
                      class="less"
                      src="assets/less.svg"
                      alt=""
                      id="boton-less"
                    />
                    <span class="number" id="valor">0</span>
                    <img
                      class="add"
                      src="assets/add.svg"
                      alt=""
                      id="boton-add"
                    />
                  </div>
                </div>
              </td>
              <td class="number">${item.price}</td>
              <td class=""><img class="delete" src="assets/delete.svg" /></td>
            </tr>
    `;
    precioTotal += item.price;
  });
  tbody.innerHTML = tablaHTML;
  total.textContent = `$${precioTotal}`;
}

// Función para agregar un producto al carrito
function agregarAlCarrito(evento) {
  const producto = evento.target.parentElement;
  const nombre = producto.dataset.nombre;
  const precio = Number(producto.dataset.precio);
  const item = {
    nombre,
    precio,
  };
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  carrito.push(item);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  mostrarCarrito();
}

// Añadimos un event listener para cada botón de agregar al carrito
botonAgregar.forEach((boton) => {
  boton.addEventListener("click", agregarAlCarrito);
});

// Mostramos el carrito de compras al cargar la página
mostrarCarrito();




// Escucha cambios en el almacenamiento local
window.addEventListener('storage', function(e) {
  // Actualiza la tabla si se ha agregado un nuevo producto al carrito
  if (e.key === 'carrito') {
    actualizarTabla(JSON.parse(e.newValue));
  }
});
// Actualiza la tabla de productos con los datos del carrito
function actualizarTabla(carrito) {
  // Vacía la tabla
  $('#tabla-productos').empty();

  // Recorre los productos en el carrito y agrega una fila a la tabla para cada uno
  carrito.forEach(function(producto) {
    var fila = '<tr><td>' + producto.nombre + '</td><td>' + producto.precio + '</td></tr>';
    $('#tabla-productos').append(fila);
  });
}

// Función para agregar un producto al carrito y actualizar el almacenamiento local
function agregarAlCarrito(producto) {
  var carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito.push(producto);
  localStorage.setItem('carrito', JSON.stringify(carrito));
}






// ESTE SI ME SALIO XDDDD
const botonSumar = document.querySelector("#boton-add");
const botonRestar = document.querySelector("#boton-less");
const valor = document.querySelector("#valor");

let contador = 0;

 botonSumar.addEventListener("click", () => {
   contador = contador + 1;
   valor.textContent = contador;
 })
 botonRestar.addEventListener("click", () => {
   contador = contador - 1;
   valor.textContent = contador;
 });
