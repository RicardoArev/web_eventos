const getProduct = async (filters) =>
{
  let values = await fetch('data.json')
    .then((response) => response.json())
    .then((response) => response.items);

  if (filters)
  {
    const { precioMinimo, precioMaximo } = filters;
    values = values.filter((producto) =>
    {
      const precio = parseFloat(producto.price);
      if (precioMinimo && !precioMaximo)
      {
        return precioMinimo <= precio;
      }
      if (!precioMinimo && precioMaximo)
      {
        return precio <= precioMaximo;
      }
      return precioMinimo <= precio && precio <= precioMaximo;
    });
  }
  return values;
};

const deleteProduct = (id) => 
{
  let product = JSON.parse(localStorage.getItem('carrito')) || [];
  product = product.filter((product) => product.id !== id);

  localStorage.setItem('carrito', JSON.stringify(product));
  showCart();
}

const showProduct = (response) =>
{
  const container = document.getElementById('section-product');
  container.innerHTML = '';
  response.map((productInformation) =>
  {
    const product = `<div class="card">
        <div class="card__image">
          <img class="image" src="${productInformation.image_path} " />
        </div>
        <div class="card__description">
          <div>
            <p class="item">${productInformation.name} </p>
            <p class="item__description">${productInformation.description}</p>
          </div>
          <div class="buy">
            <button class="buy__button" onclick="addCartProduct(this)" data-product-information='${JSON.stringify(productInformation)}'>
              Añadir al carrito <img src="assets/buy_car.svg"/>
            </button>
            <p class="number">${productInformation.price} $</p>
          </div>
        </div>
      </div> `;
    const containerProduct = document.createElement('div');
    containerProduct.innerHTML = product;
    container.appendChild(containerProduct);
  });
};

const productAddCounter = (id) =>
{
  const product = JSON.parse(localStorage.getItem('carrito')) || [];
  product.find((product) =>
  {
    if (product.id === id)
    {
      product.quantity = product.quantity + 1;
    }
  });

  localStorage.setItem('carrito', JSON.stringify(product));
  showCart()
};

const productRemoveCounter = (id) =>
{
  const product = JSON.parse(localStorage.getItem('carrito')) || [];
  product.find((product) =>
  {
    if (product.quantity == 1)
    {
      return;
    }

    if (product.id === id)
    {
      product.quantity = product.quantity - 1;
    }
  });

  localStorage.setItem('carrito', JSON.stringify(product));
  showCart();
};

const filterProduct = async () => 
{
  const precioMinimo = parseFloat(document.getElementById('precio-minimo').value);
  const precioMaximo = parseFloat(document.getElementById('precio-maximo').value);

  if (!precioMinimo && !precioMaximo)
  {
    getProduct().then((response) => showProduct(response));
    return;
  }
  if (precioMinimo > precioMaximo)
  {
    alert('El valor del precio minimo no puede ser mayor al precio maximo');
    return;
  }

  const filteredProducts = await getProduct({
    precioMinimo,
    precioMaximo
  });
  showProduct(filteredProducts);
}

const addCartProduct = (element) =>
{
  const product = JSON.parse(element.getAttribute('data-product-information'));
  product.quantity = 1;
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  const productValidation = carrito.find((productInformation) =>
  {
    if (productInformation.id === product.id)
    {
      productInformation.quantity = productInformation.quantity + 1;
      return productInformation;
    }
  });

  if (typeof productValidation !== "undefined")
  {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    showCart();
    return;
  }

  carrito.push(product);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  showCart();
};

const showCart = () =>
{
  let tablaHTML = '';
  let totalPrice = 0;
  const tbody = document.querySelector('tbody');
  const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
  carrito.forEach((item) =>
  {
    totalPrice = totalPrice + (item.price * item.quantity);
    tablaHTML += `
            <tr class="table__item">
              <td class="number">${item.id}</td>
              <td>
                <div class="table__product">
                  <img
                    class="im"
                    src="${item.image_path} "
                    width="150rem"
                  />
                  <div class="product__description">
                    <p class="item">${item.name}</p>
                    <p class="item__description">${item.description}</p>
                  </div>
                  <div class="counter">
                    <img
                      class="less"
                      src="assets/less.svg"
                      alt=""
                      onclick="productRemoveCounter(${item.id})"
                      class=""
                    />
                    <p class="number">${item.quantity}</p>
                    <img
                      class="add"
                      src="assets/add.svg"
                      alt=""
                      onclick="productAddCounter(${item.id})"
                    />
                  </div>
                </div>
              </td>
              <td class="number">${item.quantity * item.price}</td>
              <td class="">
                <img 
                  class="delete" 
                  src="assets/delete.svg" 
                  onclick="deleteProduct(${item.id})"
                />
              </td>
            </tr>
    `;
  });
  tbody.innerHTML = tablaHTML;
  showTotal(totalPrice)
}

const showTotal = (price) =>
{
  const subtotal = document.getElementById('subtotal');
  const total = document.getElementById('total');
  subtotal.innerHTML = `${price} $`;
  total.innerHTML = `${price} $`;
}

getProduct().then((response) => showProduct(response));
showCart();